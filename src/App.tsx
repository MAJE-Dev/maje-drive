import { useState } from 'react';
import type { Screen, Vehicle, MaintenanceRecord, Alert } from './types';
import { initialVehicles, initialMaintenances, initialAlerts } from './data';
import BottomNav from './components/BottomNav';
import Dashboard from './screens/Dashboard';
import Garage from './screens/Garage';
import AddVehicle from './screens/AddVehicle';
import History from './screens/History';
import AddMaintenance from './screens/AddMaintenance';
import AlertsScreen from './screens/Alerts';

export default function App() {
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(initialVehicles[0]?.id ?? '');
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [maintenances, setMaintenances] = useState<MaintenanceRecord[]>(initialMaintenances);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

  const nonOkAlertCount = alerts.filter(a => a.severity !== 'ok').length;
  const criticalCount = alerts.filter(a => a.severity === 'critical').length;

  const addVehicle = (v: Vehicle) => {
    setVehicles(prev => [...prev, v]);
    setSelectedVehicleId(v.id);
    setScreen('dashboard');
  };

  const deleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
    if (selectedVehicleId === id) {
      const remaining = vehicles.filter(v => v.id !== id);
      if (remaining.length > 0) setSelectedVehicleId(remaining[0].id);
    }
  };

  const addMaintenance = (m: MaintenanceRecord) => {
    setMaintenances(prev => [m, ...prev]);
    setScreen('history');
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
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
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 390,
        minHeight: '100vh',
        background: '#09090E',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}>
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
