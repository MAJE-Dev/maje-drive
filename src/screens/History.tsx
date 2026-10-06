import { useState } from 'react';
import type { Vehicle, MaintenanceRecord, MaintenanceCategory, Screen } from '../types';
import { categoryConfig, fmtKm, fmtDate, fmtCurrency } from '../utils';

interface HistoryProps {
  vehicles: Vehicle[];
  selectedVehicleId: string;
  maintenances: MaintenanceRecord[];
  onNavigate: (screen: Screen) => void;
  onSelectVehicle: (id: string) => void;
}

const TEAL = '#00CCCC';

const ALL_CATEGORIES: MaintenanceCategory[] = [
  'oil', 'brakes', 'filters', 'revision', 'electrical', 'suspension', 'cooling', 'transmission', 'battery', 'other',
];

function CategoryIcon({ cat }: { cat: MaintenanceCategory }) {
  const icons: Record<MaintenanceCategory, React.ReactNode> = {
    oil: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a7 7 0 0 1 7 7c0 4.97-7 13-7 13S5 13.97 5 9a7 7 0 0 1 7-7z" /></svg>,
    brakes: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><line x1="12" y1="3" x2="12" y2="8" /><line x1="12" y1="16" x2="12" y2="21" /><line x1="3" y1="12" x2="8" y2="12" /><line x1="16" y1="12" x2="21" y2="12" /></svg>,
    filters: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>,
    revision: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>,
    electrical: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
    suspension: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3" /><path d="M12 8v3" /><path d="M9 14s.5-3 3-3 3 3 3 3" /><path d="M9 14v6M15 14v6M9 20h6" /></svg>,
    cooling: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
    transmission: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" /></svg>,
    battery: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="18" height="11" rx="2" /><path d="M22 11v3" /><line x1="6" y1="11" x2="6" y2="13" /><line x1="10" y1="9" x2="10" y2="15" /></svg>,
    other: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>,
  };
  return <>{icons[cat]}</>;
}

export default function History({ vehicles, selectedVehicleId, maintenances, onNavigate, onSelectVehicle }: HistoryProps) {
  const [filter, setFilter] = useState<MaintenanceCategory | 'all'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const vehicle = vehicles.find(v => v.id === selectedVehicleId) ?? vehicles[0];
  const vMaint = maintenances
    .filter(m => m.vehicleId === (vehicle?.id ?? ''))
    .filter(m => filter === 'all' || m.category === filter)
    .sort((a, b) => b.date.localeCompare(a.date));

  const thisYear = new Date().getFullYear().toString();
  const yearCost = vMaint.filter(m => m.date.startsWith(thisYear)).reduce((s, m) => s + m.cost, 0);
  const totalCost = vMaint.reduce((s, m) => s + m.cost, 0);

  const usedCategories = Array.from(new Set(
    maintenances.filter(m => m.vehicleId === vehicle?.id).map(m => m.category)
  ));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ flexShrink: 0, padding: '48px 18px 0', background: '#0D0F13', borderBottom: '1px solid #1D2028' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <div style={{ color: '#F2F3F7', fontSize: 22, fontWeight: 700 }}>Histórico</div>
            <div style={{ color: '#4A5168', fontSize: 13, marginTop: 2 }}>{vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Nenhum veículo'}</div>
          </div>
          <button
            onClick={() => onNavigate('add-maintenance')}
            style={{
              background: TEAL, border: 'none', borderRadius: 12,
              padding: '9px 14px', color: '#0D0F13', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0D0F13" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Registrar
          </button>
        </div>

        {/* Vehicle selector */}
        {vehicles.length > 1 && (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12 }}>
            {vehicles.map(v => (
              <button
                key={v.id}
                onClick={() => onSelectVehicle(v.id)}
                style={{
                  flex: '0 0 auto',
                  background: v.id === selectedVehicleId ? `${TEAL}15` : '#171A1F',
                  border: v.id === selectedVehicleId ? `1.5px solid ${TEAL}44` : '1.5px solid #222630',
                  borderRadius: 8, padding: '6px 12px',
                  color: v.id === selectedVehicleId ? TEAL : '#8B929E',
                  fontSize: 12, fontWeight: 500, cursor: 'pointer',
                }}
              >
                {v.brand} {v.model}
              </button>
            ))}
          </div>
        )}

        {/* Category filters */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 14 }}>
          {(['all', ...usedCategories] as const).map(cat => {
            const active = filter === cat;
            const cfg = cat !== 'all' ? categoryConfig[cat] : null;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  flex: '0 0 auto',
                  background: active ? (cfg ? `${cfg.color}18` : `${TEAL}15`) : '#171A1F',
                  border: active ? `1.5px solid ${cfg ? `${cfg.color}44` : `${TEAL}44`}` : '1.5px solid #222630',
                  borderRadius: 8, padding: '6px 12px',
                  color: active ? (cfg ? cfg.color : TEAL) : '#8B929E',
                  fontSize: 12, fontWeight: active ? 600 : 400, cursor: 'pointer',
                }}
              >
                {cat === 'all' ? 'Todos' : cfg!.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px 24px' }}>
        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          <div style={{ background: '#171A1F', border: '1px solid #222630', borderRadius: 14, padding: '14px 16px' }}>
            <div style={{ color: '#4A5168', fontSize: 10, letterSpacing: '0.08em', marginBottom: 5 }}>TOTAL REGISTROS</div>
            <div style={{ color: '#F2F3F7', fontSize: 22, fontWeight: 700 }}>{vMaint.length}</div>
            <div style={{ color: '#4A5168', fontSize: 11, marginTop: 2 }}>manutenções</div>
          </div>
          <div style={{ background: '#171A1F', border: '1px solid #222630', borderRadius: 14, padding: '14px 16px' }}>
            <div style={{ color: '#4A5168', fontSize: 10, letterSpacing: '0.08em', marginBottom: 5 }}>GASTO {thisYear}</div>
            <div style={{ color: TEAL, fontSize: 18, fontWeight: 700 }}>{fmtCurrency(yearCost)}</div>
            <div style={{ color: '#4A5168', fontSize: 11, marginTop: 2 }}>Total: {fmtCurrency(totalCost)}</div>
          </div>
        </div>

        {vMaint.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, paddingTop: 40 }}>
            <div style={{ color: '#4A5168', fontSize: 14 }}>Nenhum registro encontrado</div>
            <button
              onClick={() => onNavigate('add-maintenance')}
              style={{
                background: `${TEAL}10`, border: `1px dashed ${TEAL}33`,
                borderRadius: 12, padding: '10px 20px', color: TEAL,
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Registrar primeira manutenção
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {vMaint.map(m => {
              const cfg = categoryConfig[m.category];
              const isExpanded = expanded === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setExpanded(isExpanded ? null : m.id)}
                  style={{
                    width: '100%', background: '#171A1F',
                    border: '1px solid #222630', borderRadius: 14,
                    padding: '14px 16px', cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: cfg.bg, color: cfg.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <CategoryIcon cat={m.category} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: '#F2F3F7', fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{m.name}</div>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span style={{ color: '#4A5168', fontSize: 12 }}>{fmtDate(m.date)}</span>
                        <span style={{ fontFamily: "'JetBrains Mono'", color: '#4A5168', fontSize: 11 }}>{fmtKm(m.mileage)} km</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                      <span style={{ color: '#F2F3F7', fontSize: 14, fontWeight: 700 }}>{fmtCurrency(m.cost)}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A5168" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #222630' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div>
                          <div style={{ color: '#4A5168', fontSize: 10, letterSpacing: '0.06em', marginBottom: 3 }}>KM NA TROCA</div>
                          <div style={{ fontFamily: "'JetBrains Mono'", color: '#8B929E', fontSize: 13 }}>{fmtKm(m.mileage)} km</div>
                        </div>
                        {m.nextMileage && (
                          <div>
                            <div style={{ color: '#4A5168', fontSize: 10, letterSpacing: '0.06em', marginBottom: 3 }}>PRÓXIMA TROCA</div>
                            <div style={{ fontFamily: "'JetBrains Mono'", color: '#8B929E', fontSize: 13 }}>{fmtKm(m.nextMileage)} km</div>
                          </div>
                        )}
                      </div>
                      {m.notes && (
                        <div style={{ marginTop: 10 }}>
                          <div style={{ color: '#4A5168', fontSize: 10, letterSpacing: '0.06em', marginBottom: 3 }}>OBSERVAÇÕES</div>
                          <div style={{ color: '#8B929E', fontSize: 13 }}>{m.notes}</div>
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
