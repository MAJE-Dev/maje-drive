import { useEffect, useMemo, useState } from 'react';
import type { Screen, Vehicle, MaintenanceRecord, Alert } from './types';
import { initialVehicles, initialMaintenances } from './data';
import { buildAlerts, computeHealthScore, toISODate } from './predictive';
import { cloudEnabled, fetchAll, pushAll, upsertVehicle, removeVehicle, upsertMaintenance } from './cloud';
import BottomNav from './components/BottomNav';
import Dashboard from './screens/Dashboard';
import Garage from './screens/Garage';
import AddVehicle from './screens/AddVehicle';
import History from './screens/History';
import AddMaintenance from './screens/AddMaintenance';
import AlertsScreen from './screens/Alerts';

function usePersistedState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* armazenamento indisponível */
    }
  }, [key, value]);
  return [value, setValue] as const;
}

type SyncStatus = 'off' | 'syncing' | 'online' | 'error';

const syncUi: Record<Exclude<SyncStatus, 'off'>, { color: string; label: string }> = {
  syncing: { color: '#FF7A30', label: 'Sincronizando…' },
  online: { color: '#00CCCC', label: 'Nuvem conectada' },
  error: { color: '#EF4444', label: 'Sem conexão com a nuvem (dados salvos no aparelho)' },
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [selectedVehicleId, setSelectedVehicleId] = usePersistedState<string>('maje:selected', initialVehicles[0]?.id ?? '');
  const [storedVehicles, setVehicles] = usePersistedState<Vehicle[]>('maje:vehicles', initialVehicles);
  const [maintenances, setMaintenances] = usePersistedState<MaintenanceRecord[]>('maje:maintenances', initialMaintenances);
  const [dismissed, setDismissed] = usePersistedState<string[]>('maje:dismissed', []);
  const [sync, setSync] = useState<SyncStatus>(cloudEnabled ? 'syncing' : 'off');

  const today = toISODate(new Date());
  const allAlerts = useMemo(() => buildAlerts(storedVehicles, maintenances, today), [storedVehicles, maintenances, today]);
  const alerts: Alert[] = useMemo(() => allAlerts.filter(a => !dismissed.includes(a.id)), [allAlerts, dismissed]);
  // A saúde exibida é sempre derivada dos alertas preditivos (não dos dados salvos).
  const vehicles = useMemo(
    () => storedVehicles.map(v => ({ ...v, healthScore: computeHealthScore(allAlerts.filter(a => a.vehicleId === v.id)) })),
    [storedVehicles, allAlerts],
  );

  const track = (op: Promise<unknown>) => {
    if (!cloudEnabled) return;
    setSync('syncing');
    op.then(() => setSync('online')).catch(err => {
      console.error('Falha ao sincronizar com o Supabase', err);
      setSync('error');
    });
  };

  // Carga inicial: se a nuvem tem dados, ela é a fonte da verdade; se está vazia, envia os dados locais.
  useEffect(() => {
    if (!cloudEnabled) return;
    let cancelled = false;
    fetchAll()
      .then(async remote => {
        if (cancelled) return;
        if (remote.vehicles.length === 0 && remote.maintenances.length === 0) {
          await pushAll(storedVehicles, maintenances);
        } else {
          setVehicles(remote.vehicles);
          setMaintenances(remote.maintenances);
          setSelectedVehicleId(id => (remote.vehicles.some(v => v.id === id) ? id : remote.vehicles[0]?.id ?? ''));
        }
        if (!cancelled) setSync('online');
      })
      .catch(err => {
        console.error('Falha ao carregar do Supabase', err);
        if (!cancelled) setSync('error');
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nonOkAlertCount = alerts.filter(a => a.severity !== 'ok').length;
  const criticalCount = alerts.filter(a => a.severity === 'critical').length;

  const addVehicle = (v: Vehicle) => {
    track(upsertVehicle(v));
    setVehicles(prev => [...prev, v]);
    setSelectedVehicleId(v.id);
    setScreen('dashboard');
  };

  const deleteVehicle = (id: string) => {
    track(removeVehicle(id));
    setVehicles(prev => prev.filter(v => v.id !== id));
    setMaintenances(prev => prev.filter(m => m.vehicleId !== id));
    if (selectedVehicleId === id) {
      const remaining = storedVehicles.filter(v => v.id !== id);
      setSelectedVehicleId(remaining[0]?.id ?? '');
    }
  };

  const addMaintenance = (m: MaintenanceRecord) => {
    const vehicle = storedVehicles.find(v => v.id === m.vehicleId);
    const updated = vehicle && m.mileage > vehicle.mileage ? { ...vehicle, mileage: m.mileage } : undefined;
    track(Promise.all([upsertMaintenance(m), updated ? upsertVehicle(updated) : null]));
    setMaintenances(prev => [m, ...prev]);
    if (updated) setVehicles(prev => prev.map(v => (v.id === updated.id ? updated : v)));
    setScreen('history');
  };

  const dismissAlert = (id: string) => {
    setDismissed(prev => [...prev, id]);
  };

  const bottomNavScreens: Screen[] = ['dashboard', 'garage', 'history', 'alerts'];
  const showBottomNav = bottomNavScreens.includes(screen);

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard':
        return (
          <Dashboard
            vehicles={vehicles}
            selectedVehicleId={selectedVehicleId}
            maintenances={maintenances}
            alerts={alerts}
            criticalCount={criticalCount}
            onNavigate={setScreen}
            onSelectVehicle={setSelectedVehicleId}
          />
        );
      case 'garage':
        return (
          <Garage
            vehicles={vehicles}
            selectedVehicleId={selectedVehicleId}
            onNavigate={setScreen}
            onSelectVehicle={setSelectedVehicleId}
            onDeleteVehicle={deleteVehicle}
          />
        );
      case 'add-vehicle':
        return (
          <AddVehicle
            onNavigate={setScreen}
            onSave={addVehicle}
          />
        );
      case 'history':
        return (
          <History
            vehicles={vehicles}
            selectedVehicleId={selectedVehicleId}
            maintenances={maintenances}
            alerts={allAlerts}
            onNavigate={setScreen}
            onSelectVehicle={setSelectedVehicleId}
          />
        );
      case 'add-maintenance':
        return (
          <AddMaintenance
            vehicles={vehicles}
            selectedVehicleId={selectedVehicleId}
            onNavigate={setScreen}
            onSave={addMaintenance}
          />
        );
      case 'alerts':
        return (
          <AlertsScreen
            vehicles={vehicles}
            alerts={alerts}
            onNavigate={setScreen}
            onDismiss={dismissAlert}
          />
        );
    }
  };

  return (
    <div style={{
      background: '#030305',
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 390,
        minHeight: '100dvh',
        background: '#09090E',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxSizing: 'border-box',
      }}>
        {sync !== 'off' && (
          <div
            role="status"
            title={syncUi[sync].label}
            aria-label={syncUi[sync].label}
            style={{
              position: 'absolute', top: 'calc(env(safe-area-inset-top) + 8px)', right: 10, zIndex: 50,
              width: 8, height: 8, borderRadius: '50%', background: syncUi[sync].color,
            }}
          />
        )}
        {/* Screen content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {renderScreen()}
        </div>

        {/* Bottom nav */}
        {showBottomNav && (
          <BottomNav
            activeScreen={screen}
            onNavigate={setScreen}
            alertCount={nonOkAlertCount}
            onAddPress={() => setScreen('add-maintenance')}
          />
        )}
      </div>
    </div>
  );
}
