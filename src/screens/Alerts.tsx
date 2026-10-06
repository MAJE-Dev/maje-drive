import { useState } from 'react';
import type { Vehicle, Alert, AlertSeverity, Screen } from '../types';
import { categoryConfig, fmtDate, fmtKm } from '../utils';

interface AlertsProps {
  vehicles: Vehicle[];
  alerts: Alert[];
  onNavigate: (screen: Screen) => void;
  onDismiss: (id: string) => void;
}

type Filter = 'all' | AlertSeverity;

const TEAL = '#00CCCC';

const sevConfig = {
  critical: {
    label: 'CRÍTICO', badgeBg: 'rgba(239,68,68,0.18)', badgeColor: '#EF4444',
    cardBg: 'rgba(239,68,68,0.06)', cardBorder: 'rgba(239,68,68,0.22)',
    iconBg: 'rgba(239,68,68,0.14)', actionLabel: 'Registrar agora',
    actionBg: 'rgba(239,68,68,0.14)', actionBorder: 'rgba(239,68,68,0.3)', actionColor: '#EF4444',
  },
  warning: {
    label: 'ATENÇÃO', badgeBg: 'rgba(255,122,48,0.18)', badgeColor: '#FF7A30',
    cardBg: 'rgba(255,122,48,0.06)', cardBorder: 'rgba(255,122,48,0.18)',
    iconBg: 'rgba(255,122,48,0.14)', actionLabel: 'Agendar',
    actionBg: 'rgba(255,122,48,0.12)', actionBorder: 'rgba(255,122,48,0.28)', actionColor: '#FF7A30',
  },
  ok: {
    label: 'EM DIA', badgeBg: `${TEAL}22`, badgeColor: TEAL,
    cardBg: `${TEAL}07`, cardBorder: `${TEAL}22`,
    iconBg: `${TEAL}14`, actionLabel: 'Ver detalhes',
    actionBg: `${TEAL}12`, actionBorder: `${TEAL}2A`, actionColor: TEAL,
  },
};

function AlertSevIcon({ severity }: { severity: AlertSeverity }) {
  if (severity === 'critical') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    );
  }
  if (severity === 'warning') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF7A30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export default function AlertsScreen({ vehicles, alerts, onNavigate, onDismiss }: AlertsProps) {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = alerts
    .filter(a => filter === 'all' || a.severity === filter)
    .sort((a, b) => ({ critical: 0, warning: 1, ok: 2 }[a.severity] - { critical: 0, warning: 1, ok: 2 }[b.severity]));

  const counts = {
    critical: alerts.filter(a => a.severity === 'critical').length,
    warning: alerts.filter(a => a.severity === 'warning').length,
    ok: alerts.filter(a => a.severity === 'ok').length,
  };

  const filterTabs: { key: Filter; label: string; count: number; color: string }[] = [
    { key: 'all', label: 'Todos', count: alerts.length, color: TEAL },
    { key: 'critical', label: 'Vencidos', count: counts.critical, color: '#EF4444' },
    { key: 'warning', label: 'Em breve', count: counts.warning, color: '#FF7A30' },
    { key: 'ok', label: 'Em dia', count: counts.ok, color: TEAL },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ flexShrink: 0, padding: '48px 18px 0', background: '#0D0F13', borderBottom: '1px solid #1D2028' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ color: '#F2F3F7', fontSize: 22, fontWeight: 700 }}>Alertas</div>
            <div style={{ color: '#4A5168', fontSize: 13, marginTop: 2 }}>
              {counts.critical > 0
                ? `${counts.critical} item${counts.critical > 1 ? 'ns' : ''} vencido${counts.critical > 1 ? 's' : ''}`
                : 'Manutenções e lembretes'}
            </div>
          </div>
          {counts.critical > 0 && (
            <div style={{
              background: 'rgba(239,68,68,0.14)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 10, padding: '8px 14px',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#EF4444' }} />
              <span style={{ color: '#EF4444', fontSize: 13, fontWeight: 700 }}>{counts.critical} crítico{counts.critical > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 14 }}>
          {filterTabs.map(tab => {
            const active = filter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                style={{
                  flex: '0 0 auto',
                  background: active ? `${tab.color}18` : '#171A1F',
                  border: active ? `1.5px solid ${tab.color}44` : '1.5px solid #222630',
                  borderRadius: 8, padding: '6px 12px',
                  color: active ? tab.color : '#8B929E',
                  fontSize: 12, fontWeight: active ? 600 : 400,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span style={{
                    background: active ? `${tab.color}28` : '#222630',
                    color: active ? tab.color : '#4A5168',
                    borderRadius: 4, padding: '0 5px', fontSize: 10, fontWeight: 700,
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px 24px' }}>
        {filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, paddingTop: 60 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: `${TEAL}10`, border: `1px solid ${TEAL}28`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div style={{ color: '#F2F3F7', fontSize: 15, fontWeight: 600 }}>Tudo em dia!</div>
            <div style={{ color: '#4A5168', fontSize: 13, textAlign: 'center' }}>Nenhum alerta nessa categoria</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(alert => {
              const vehicle = vehicles.find(v => v.id === alert.vehicleId);
              const cfg = sevConfig[alert.severity];
              const catCfg = categoryConfig[alert.category];
              const kmDiff = alert.dueMileage && alert.currentMileage ? alert.dueMileage - alert.currentMileage : null;

              return (
                <div
                  key={alert.id}
                  style={{ background: cfg.cardBg, border: `1px solid ${cfg.cardBorder}`, borderRadius: 16, padding: '16px' }}
                >
                  {/* Top row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 12,
                      background: cfg.iconBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <AlertSevIcon severity={alert.severity} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4, flexWrap: 'wrap' }}>
                        <span style={{ color: '#F2F3F7', fontSize: 15, fontWeight: 700 }}>{alert.title}</span>
                        <span style={{
                          background: cfg.badgeBg, color: cfg.badgeColor,
                          borderRadius: 5, padding: '2px 8px', fontSize: 9, fontWeight: 800,
                          letterSpacing: '0.06em',
                        }}>
                          {cfg.label}
                        </span>
                      </div>
                      <div style={{ color: '#8B929E', fontSize: 13 }}>{alert.description}</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                    {vehicle && (
                      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: vehicle.color }} />
                        <span style={{ color: '#8B929E', fontSize: 12 }}>{vehicle.brand} {vehicle.model}</span>
                      </div>
                    )}
                    {kmDiff !== null && (
                      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '6px 10px' }}>
                        <span style={{ fontFamily: "'JetBrains Mono Variable'", color: '#8B929E', fontSize: 11 }}>
                          {kmDiff < 0 ? `${fmtKm(Math.abs(kmDiff))} km vencido` : `${fmtKm(kmDiff)} km restantes`}
                        </span>
                      </div>
                    )}
                    {alert.predictedDate && (
                      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '6px 10px' }}>
                        <span style={{ color: cfg.badgeColor, fontSize: 11 }}>
                          Previsão: {fmtDate(alert.predictedDate)}{alert.kmPerDay ? ` · ~${Math.round(alert.kmPerDay)} km/dia` : ''}
                        </span>
                      </div>
                    )}
                    {alert.dueMileage && (
                      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '6px 10px' }}>
                        <span style={{ fontFamily: "'JetBrains Mono Variable'", color: '#4A5168', fontSize: 11 }}>Previsto: {fmtKm(alert.dueMileage)} km</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => onNavigate('add-maintenance')}
                      style={{
                        flex: 1, background: cfg.actionBg, border: `1px solid ${cfg.actionBorder}`,
                        borderRadius: 10, padding: '10px', color: cfg.actionColor,
                        fontSize: 12, fontWeight: 700, cursor: 'pointer',
                      }}
                    >
                      {cfg.actionLabel}
                    </button>
                    <button
                      onClick={() => onDismiss(alert.id)}
                      style={{
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 10, padding: '10px 14px', color: '#4A5168', fontSize: 12,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      Dispensar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
