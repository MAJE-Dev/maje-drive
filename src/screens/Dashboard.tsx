import type { Vehicle, MaintenanceRecord, Alert, Screen } from '../types';
import { fmtKm, fmtDate, healthColor, healthLabel } from '../utils';

interface DashboardProps {
  vehicles: Vehicle[];
  selectedVehicleId: string;
  maintenances: MaintenanceRecord[];
  alerts: Alert[];
  criticalCount: number;
  onNavigate: (screen: Screen) => void;
  onSelectVehicle: (id: string) => void;
}

const TEAL = '#00CCCC';

function StatusBar() {
  return (
    <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', flexShrink: 0 }}>
      <span style={{ fontFamily: "'JetBrains Mono Variable'", fontSize: 13, fontWeight: 600, color: '#F2F3F7' }}>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="#F2F3F7">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="4.5" y="5" width="3" height="7" rx="1" />
          <rect x="9" y="2" width="3" height="10" rx="1" />
          <rect x="13.5" y="0" width="3" height="12" rx="1" opacity="0.35" />
        </svg>
        <svg width="14" height="11" viewBox="0 0 14 11" fill="none" stroke="#F2F3F7" strokeWidth="1.5" strokeLinecap="round">
          <path d="M1 3.5C3.2 1.3 10.8 1.3 13 3.5" opacity="0.35" />
          <path d="M3 6C4.4 4.6 9.6 4.6 11 6" />
          <path d="M5.5 8.5C6.2 7.8 7.8 7.8 8.5 8.5" />
          <circle cx="7" cy="11" r="0.8" fill="#F2F3F7" stroke="none" />
        </svg>
        <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <div style={{ width: 22, height: 11, border: '1px solid rgba(242,243,247,0.5)', borderRadius: 3, padding: '1.5px 2px', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '90%', height: '100%', background: TEAL, borderRadius: 1.5 }} />
          </div>
          <div style={{ width: 2, height: 5, background: 'rgba(242,243,247,0.4)', borderRadius: '0 1px 1px 0' }} />
        </div>
      </div>
    </div>
  );
}

function HealthGauge({ score }: { score: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = healthColor(score);
  return (
    <div style={{ position: 'relative', width: 96, height: 96 }}>
      <svg width={96} height={96} viewBox="0 0 96 96">
        <circle cx={48} cy={48} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={6} />
        <circle
          cx={48} cy={48} r={r} fill="none"
          stroke={color} strokeWidth={6} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          transform="rotate(-90 48 48)"
          style={{ filter: `drop-shadow(0 0 8px ${color}88)` }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color, fontSize: 20, fontWeight: 700, lineHeight: 1 }}>{score}%</div>
        <div style={{ color: 'rgba(255,255,255,0.28)', fontSize: 8, letterSpacing: '0.1em', marginTop: 3, fontWeight: 500 }}>SAÚDE</div>
      </div>
    </div>
  );
}

function VehicleCard({ vehicle, maintenances, onNavigate }: {
  vehicle: Vehicle;
  maintenances: MaintenanceRecord[];
  onNavigate: (s: Screen) => void;
}) {
  const vMaint = maintenances.filter(m => m.vehicleId === vehicle.id);
  const lastOil = vMaint.filter(m => m.category === 'oil').sort((a, b) => b.date.localeCompare(a.date))[0];
  const lastRevision = vMaint.filter(m => m.category === 'revision').sort((a, b) => b.date.localeCompare(a.date))[0];
  const nextRevKm = lastRevision?.nextMileage;
  const hColor = healthColor(vehicle.healthScore);
  const hLabel = healthLabel(vehicle.healthScore);

  return (
    <div style={{ borderRadius: 20, overflow: 'hidden', background: '#171A1F', border: '1px solid #222630' }}>
      {/* Photo header */}
      <div style={{ position: 'relative', height: 140, overflow: 'hidden', background: '#0D0F13' }}>
        {vehicle.photo && (
          <img
            src={vehicle.photo}
            alt={`${vehicle.brand} ${vehicle.model}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
          />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(13,15,19,0.2) 0%, rgba(13,15,19,0.7) 100%)',
        }} />
        {/* Top info row */}
        <div style={{ position: 'absolute', top: 14, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ color: 'rgba(242,243,247,0.55)', fontSize: 11, letterSpacing: '0.04em', marginBottom: 2 }}>{vehicle.brand}</div>
            <div style={{ color: '#F2F3F7', fontSize: 18, fontWeight: 700 }}>{vehicle.model}</div>
          </div>
          <div style={{
            background: `${hColor}22`, border: `1px solid ${hColor}55`,
            borderRadius: 8, padding: '4px 10px',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: hColor }} />
            <span style={{ color: hColor, fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }}>{hLabel}</span>
          </div>
        </div>
        {/* Plate + km */}
        <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            background: 'rgba(13,15,19,0.7)',
            borderRadius: 6, padding: '3px 10px',
            fontFamily: "'JetBrains Mono Variable'", color: '#F2F3F7', fontSize: 11, fontWeight: 500,
          }}>
            {vehicle.plate}
          </span>
          <span style={{ fontFamily: "'JetBrains Mono Variable'", color: 'rgba(242,243,247,0.7)', fontSize: 12 }}>
            {fmtKm(vehicle.mileage)} km
          </span>
        </div>
      </div>

      {/* Health + stats */}
      <div style={{ padding: '16px 16px 18px' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
          <HealthGauge score={vehicle.healthScore} />
          <div style={{ flex: 1 }}>
            <div style={{ color: '#F2F3F7', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Saúde do Veículo</div>
            <div style={{ color: '#8B929E', fontSize: 12, lineHeight: 1.5 }}>
              {vehicle.healthScore >= 70
                ? `Seu ${vehicle.model} está em ótimas condições.`
                : vehicle.healthScore >= 40
                  ? `Seu ${vehicle.model} precisa de atenção em breve.`
                  : `Seu ${vehicle.model} precisa de manutenção urgente.`}
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '12px 14px' }}>
            <div style={{ color: '#4A5168', fontSize: 9.5, letterSpacing: '0.08em', marginBottom: 4 }}>ÚLTIMO ÓLEO</div>
            {lastOil ? (
              <>
                <div style={{ color: '#F2F3F7', fontSize: 13, fontWeight: 600 }}>{fmtKm(vehicle.mileage - lastOil.mileage)} km atrás</div>
                <div style={{ color: '#8B929E', fontSize: 11, marginTop: 2 }}>{fmtDate(lastOil.date)}</div>
              </>
            ) : (
              <div style={{ color: '#4A5168', fontSize: 12 }}>Não registrado</div>
            )}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '12px 14px' }}>
            <div style={{ color: '#4A5168', fontSize: 9.5, letterSpacing: '0.08em', marginBottom: 4 }}>PRÓX. REVISÃO</div>
            {nextRevKm ? (
              <>
                <div style={{ color: nextRevKm - vehicle.mileage < 3000 ? '#FF7A30' : '#F2F3F7', fontSize: 13, fontWeight: 600 }}>
                  {fmtKm(nextRevKm - vehicle.mileage)} km
                </div>
                <div style={{ color: '#8B929E', fontSize: 11, marginTop: 2 }}>{fmtKm(nextRevKm)} km total</div>
              </>
            ) : (
              <div style={{ color: '#4A5168', fontSize: 12 }}>Não agendada</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertItem({ alert, vehicle, onNavigate }: {
  alert: Alert;
  vehicle?: Vehicle;
  onNavigate: (s: Screen) => void;
}) {
  const sevColor = alert.severity === 'critical' ? '#EF4444' : '#FF7A30';
  const sevLabel = alert.severity === 'critical' ? 'CRÍTICO' : 'ATENÇÃO';
  const kmDiff = alert.dueMileage && alert.currentMileage ? alert.dueMileage - alert.currentMileage : null;

  return (
    <div style={{
      background: '#1D2026', borderRadius: 12, padding: '12px 14px',
      display: 'flex', alignItems: 'center', gap: 12,
      border: `1px solid ${sevColor}22`,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: `${sevColor}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={sevColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: '#F2F3F7', fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{alert.title}</div>
        <div style={{ color: '#8B929E', fontSize: 11 }}>
          {kmDiff !== null && kmDiff < 0
            ? `Vencido há ${fmtKm(Math.abs(kmDiff))} km`
            : kmDiff !== null
              ? `Faltam ${fmtKm(kmDiff)} km`
              : alert.description}
        </div>
      </div>
      <span style={{
        background: `${sevColor}22`, color: sevColor,
        borderRadius: 6, padding: '3px 8px', fontSize: 9, fontWeight: 700,
        letterSpacing: '0.05em', flexShrink: 0,
      }}>
        {sevLabel}
      </span>
    </div>
  );
}

export default function Dashboard({
  vehicles, selectedVehicleId, maintenances, alerts, criticalCount, onNavigate, onSelectVehicle,
}: DashboardProps) {
  const vehicle = vehicles.find(v => v.id === selectedVehicleId) ?? vehicles[0];
  const urgentAlerts = alerts.filter(a => a.severity !== 'ok' && a.vehicleId === vehicle?.id).slice(0, 2);

  const today = new Date();
  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const dateStr = `${days[today.getDay()]}, ${today.getDate()} de ${months[today.getMonth()]}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <StatusBar />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ color: '#F2F3F7', fontSize: 22, fontWeight: 700 }}>Olá, Carlos!</div>
            <div style={{ color: '#4A5168', fontSize: 13, marginTop: 2 }}>{dateStr}</div>
          </div>
          <button
            onClick={() => onNavigate('alerts')}
            style={{
              position: 'relative', background: '#171A1F',
              border: '1px solid #222630', borderRadius: 12, padding: '10px 11px', cursor: 'pointer',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B929E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {criticalCount > 0 && (
              <div style={{
                position: 'absolute', top: -5, right: -5, width: 18, height: 18, borderRadius: '50%',
                background: '#EF4444', color: '#fff', fontSize: 9, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #0D0F13',
              }}>
                {criticalCount}
              </div>
            )}
          </button>
        </div>

        {/* Vehicle card */}
        {vehicle && (
          <div style={{ marginBottom: 20 }}>
            <VehicleCard vehicle={vehicle} maintenances={maintenances} onNavigate={onNavigate} />
          </div>
        )}

        {/* Alerts section */}
        {urgentAlerts.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ color: '#4A5168', fontSize: 11, letterSpacing: '0.1em', fontWeight: 500 }}>PRÓXIMOS ALERTAS</div>
              <button
                onClick={() => onNavigate('alerts')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEAL, fontSize: 12, fontWeight: 600 }}
              >
                Ver todos
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {urgentAlerts.map(a => (
                <AlertItem
                  key={a.id}
                  alert={a}
                  vehicle={vehicles.find(v => v.id === a.vehicleId)}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={() => onNavigate('add-maintenance')}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #00DEDE, #009A9A)',
            border: 'none', borderRadius: 14, padding: '15px',
            color: '#fff', fontSize: 15, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 20px rgba(0,204,204,0.3)',
            marginBottom: 16,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Adicionar Manutenção
        </button>

        {/* Meus Veículos */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ color: '#4A5168', fontSize: 11, letterSpacing: '0.1em', fontWeight: 500 }}>MEUS VEÍCULOS</div>
            <button
              onClick={() => onNavigate('garage')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEAL, fontSize: 12, fontWeight: 600 }}
            >
              Ver todos
            </button>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
            {vehicles.map(v => {
              const hc = healthColor(v.healthScore);
              const hl = healthLabel(v.healthScore);
              const isSelected = v.id === selectedVehicleId;
              return (
                <button
                  key={v.id}
                  onClick={() => onSelectVehicle(v.id)}
                  style={{
                    flex: '0 0 auto', width: 140,
                    background: '#171A1F',
                    border: isSelected ? `1.5px solid ${TEAL}55` : '1.5px solid #222630',
                    borderRadius: 14, overflow: 'hidden',
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  {v.photo ? (
                    <div style={{ height: 70, overflow: 'hidden', background: '#0D0F13', position: 'relative' }}>
                      <img src={v.photo} alt={`${v.brand} ${v.model}`} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(13,15,19,0.6) 100%)' }} />
                    </div>
                  ) : (
                    <div style={{ height: 70, background: v.color, opacity: 0.7 }} />
                  )}
                  <div style={{ padding: '8px 10px' }}>
                    <div style={{ color: '#F2F3F7', fontSize: 11, fontWeight: 700, marginBottom: 2 }}>{v.brand} {v.model}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: hc }} />
                      <span style={{ color: hc, fontSize: 9.5, fontWeight: 700 }}>{hl}</span>
                      {isSelected && <span style={{ marginLeft: 'auto', color: TEAL, fontSize: 8, fontWeight: 700, letterSpacing: '0.04em' }}>ATIVO</span>}
                    </div>
                  </div>
                </button>
              );
            })}
            <button
              onClick={() => onNavigate('add-vehicle')}
              style={{
                flex: '0 0 auto', width: 80,
                background: '#171A1F', border: '1.5px dashed #2C3040',
                borderRadius: 14, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '16px 0',
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: `${TEAL}14`, border: `1px solid ${TEAL}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <span style={{ color: '#4A5168', fontSize: 10 }}>Adicionar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
