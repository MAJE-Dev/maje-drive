import { useState } from 'react';
import type { Vehicle, Screen } from '../types';
import { healthColor, healthLabel, fmtKm } from '../utils';

interface GarageProps {
  vehicles: Vehicle[];
  selectedVehicleId: string;
  onNavigate: (screen: Screen) => void;
  onSelectVehicle: (id: string) => void;
  onDeleteVehicle: (id: string) => void;
}

const TEAL = '#00CCCC';

function FuelBadge({ type }: { type: string }) {
  const colors: Record<string, [string, string]> = {
    Gasolina: ['rgba(248,113,113,0.15)', '#F87171'],
    Etanol: ['rgba(52,211,153,0.15)', '#34D399'],
    Flex: ['rgba(251,191,36,0.15)', '#FBBF24'],
    Diesel: ['rgba(96,165,250,0.15)', '#60A5FA'],
    Elétrico: ['rgba(167,139,250,0.15)', '#A78BFA'],
    Híbrido: ['rgba(74,222,128,0.15)', '#4ADE80'],
  };
  const [bg, color] = colors[type] ?? ['rgba(139,146,158,0.15)', '#8B929E'];
  return (
    <span style={{ background: bg, color, borderRadius: 6, padding: '2px 7px', fontSize: 10, fontWeight: 600 }}>
      {type}
    </span>
  );
}

export default function Garage({ vehicles, selectedVehicleId, onNavigate, onSelectVehicle, onDeleteVehicle }: GarageProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ flexShrink: 0, padding: '48px 18px 16px', background: '#0D0F13', borderBottom: '1px solid #1D2028' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#F2F3F7', fontSize: 22, fontWeight: 700 }}>Minha Garagem</div>
            <div style={{ color: '#4A5168', fontSize: 13, marginTop: 2 }}>
              {vehicles.length} {vehicles.length === 1 ? 'veículo cadastrado' : 'veículos cadastrados'}
            </div>
          </div>
          <button
            onClick={() => onNavigate('add-vehicle')}
            style={{
              background: TEAL, border: 'none', borderRadius: 12,
              padding: '10px 16px', color: '#0D0F13', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0D0F13" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Adicionar
          </button>
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px' }}>
        {vehicles.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: `${TEAL}10`, border: `1px dashed ${TEAL}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="28" height="22" viewBox="0 0 28 22" fill="none" stroke={TEAL} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="7" width="26" height="13" rx="2" />
                <path d="M1 7l4-6h18l4 6" />
                <circle cx="7" cy="16" r="2" fill={TEAL} stroke="none" />
                <circle cx="21" cy="16" r="2" fill={TEAL} stroke="none" />
              </svg>
            </div>
            <div style={{ color: '#F2F3F7', fontSize: 16, fontWeight: 600 }}>Nenhum veículo</div>
            <div style={{ color: '#4A5168', fontSize: 13, textAlign: 'center' }}>Adicione seu primeiro veículo para começar</div>
            <button
              onClick={() => onNavigate('add-vehicle')}
              style={{
                background: TEAL, border: 'none', borderRadius: 12,
                padding: '12px 24px', color: '#0D0F13', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 8,
              }}
            >
              Adicionar veículo
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {vehicles.map(v => {
              const hc = healthColor(v.healthScore);
              const hl = healthLabel(v.healthScore);
              const isSelected = v.id === selectedVehicleId;
              return (
                <div key={v.id}>
                  <button
                    onClick={() => { onSelectVehicle(v.id); onNavigate('dashboard'); }}
                    style={{
                      width: '100%', background: '#171A1F',
                      border: isSelected ? `1.5px solid ${TEAL}44` : '1.5px solid #222630',
                      borderRadius: 18, overflow: 'hidden', cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    {/* Photo */}
                    {v.photo ? (
                      <div style={{ height: 130, overflow: 'hidden', position: 'relative', background: '#0D0F13' }}>
                        <img
                          src={v.photo}
                          alt={`${v.brand} ${v.model}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.88 }}
                        />
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'linear-gradient(180deg, rgba(13,15,19,0.1) 0%, rgba(13,15,19,0.65) 100%)',
                        }} />
                        {/* Health badge */}
                        <div style={{
                          position: 'absolute', top: 12, right: 12,
                          background: `${hc}22`, border: `1px solid ${hc}55`,
                          borderRadius: 8, padding: '4px 10px',
                          display: 'flex', alignItems: 'center', gap: 5,
                        }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: hc }} />
                          <span style={{ color: hc, fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }}>
                            {v.healthScore}% {hl}
                          </span>
                        </div>
                        {/* Active badge */}
                        {isSelected && (
                          <div style={{
                            position: 'absolute', top: 12, left: 12,
                            background: `${TEAL}22`, border: `1px solid ${TEAL}55`,
                            borderRadius: 6, padding: '3px 8px',
                            color: TEAL, fontSize: 9, fontWeight: 700, letterSpacing: '0.05em',
                          }}>
                            ATIVO
                          </div>
                        )}
                        {/* Bottom info */}
                        <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                          <div>
                            <div style={{ color: 'rgba(242,243,247,0.5)', fontSize: 10, marginBottom: 2 }}>{v.brand}</div>
                            <div style={{ color: '#F2F3F7', fontSize: 16, fontWeight: 700 }}>{v.model}</div>
                          </div>
                          <span style={{
                            background: 'rgba(13,15,19,0.7)', borderRadius: 6, padding: '3px 10px',
                            fontFamily: "'JetBrains Mono Variable'", color: '#F2F3F7', fontSize: 11,
                          }}>
                            {v.plate}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ height: 100, background: v.color, opacity: 0.7 }} />
                    )}

                    {/* Info row */}
                    <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: "'JetBrains Mono Variable'", color: '#8B929E', fontSize: 12, fontWeight: 500 }}>
                          {fmtKm(v.mileage)} km
                        </span>
                        <span style={{ color: '#2C3040' }}>·</span>
                        <span style={{ color: '#8B929E', fontSize: 12 }}>ANO {v.year}</span>
                        <span style={{ color: '#2C3040' }}>·</span>
                        <FuelBadge type={v.fuelType} />
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); setDeletingId(v.id); }}
                        style={{
                          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                          borderRadius: 8, padding: '6px 7px', cursor: 'pointer',
                        }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4h6v2" />
                        </svg>
                      </button>
                    </div>
                  </button>

                  {/* Delete confirm */}
                  {deletingId === v.id && (
                    <div style={{
                      background: '#1D2026', border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: 12, padding: '14px 16px', marginTop: 4,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                      <span style={{ color: '#F2F3F7', fontSize: 13 }}>Remover {v.brand} {v.model}?</span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => setDeletingId(null)}
                          style={{ background: '#222630', border: 'none', borderRadius: 8, padding: '6px 12px', color: '#8B929E', fontSize: 12, cursor: 'pointer' }}
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => { onDeleteVehicle(v.id); setDeletingId(null); }}
                          style={{ background: '#EF4444', border: 'none', borderRadius: 8, padding: '6px 12px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
