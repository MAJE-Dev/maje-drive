import { useState } from 'react';
import type { Vehicle, MaintenanceRecord, MaintenanceCategory, Screen } from '../types';
import { categoryConfig } from '../utils';

interface AddMaintenanceProps {
  vehicles: Vehicle[];
  selectedVehicleId: string;
  onNavigate: (screen: Screen) => void;
  onSave: (record: MaintenanceRecord) => void;
}

const TEAL = '#00CCCC';

const CATEGORIES: MaintenanceCategory[] = [
  'oil', 'brakes', 'filters', 'revision', 'electrical', 'suspension', 'cooling', 'transmission', 'battery', 'other',
];

const categoryDefaults: Record<MaintenanceCategory, string> = {
  oil: 'Troca de óleo e filtro',
  brakes: 'Revisão de freios',
  filters: 'Troca de filtro',
  revision: 'Revisão programada',
  electrical: 'Serviço elétrico',
  suspension: 'Serviço de suspensão',
  cooling: 'Serviço de arrefecimento',
  transmission: 'Serviço de câmbio',
  battery: 'Substituição de bateria',
  other: 'Serviço avulso',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ color: '#4A5168', fontSize: 11, letterSpacing: '0.08em', marginBottom: 8, fontWeight: 500 }}>{label}</div>
      {children}
    </div>
  );
}

const inputStyle = (mono = false): React.CSSProperties => ({
  width: '100%', background: '#131619',
  border: '1px solid #222630', borderRadius: 12,
  padding: '13px 16px', color: '#F2F3F7', fontSize: 14,
  fontFamily: mono ? "'JetBrains Mono'" : "'Inter'",
});

export default function AddMaintenance({ vehicles, selectedVehicleId, onNavigate, onSave }: AddMaintenanceProps) {
  const [vehicleId, setVehicleId] = useState(selectedVehicleId);
  const [category, setCategory] = useState<MaintenanceCategory>('oil');
  const [name, setName] = useState(categoryDefaults['oil']);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [mileage, setMileage] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');
  const [nextMileage, setNextMileage] = useState('');
  const [nextDate, setNextDate] = useState('');
  const [error, setError] = useState('');

  const selectedVehicle = vehicles.find(v => v.id === vehicleId);

  const handleCategorySelect = (cat: MaintenanceCategory) => {
    setCategory(cat);
    if (!name || Object.values(categoryDefaults).includes(name)) setName(categoryDefaults[cat]);
  };

  const handleSave = () => {
    if (!vehicleId || !name || !date || !mileage || !cost) { setError('Preencha os campos obrigatórios.'); return; }
    const km = parseFloat(mileage.replace(/\D/g, ''));
    const costVal = parseFloat(cost.replace(',', '.').replace(/[^0-9.]/g, ''));
    if (isNaN(km) || km < 0) { setError('Quilometragem inválida.'); return; }
    if (isNaN(costVal) || costVal < 0) { setError('Custo inválido.'); return; }
    onSave({
      id: `m${Date.now()}`, vehicleId, category, name, date,
      mileage: km, cost: costVal,
      notes: notes || undefined,
      nextMileage: nextMileage ? parseFloat(nextMileage.replace(/\D/g, '')) : undefined,
      nextDate: nextDate || undefined,
    });
  };

  const focusTeal = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = TEAL);
  const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = '#222630');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ flexShrink: 0, padding: '48px 18px 16px', background: '#0D0F13', borderBottom: '1px solid #1D2028' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => onNavigate('history')}
            style={{ background: '#171A1F', border: '1px solid #222630', borderRadius: 10, padding: '8px', cursor: 'pointer' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B929E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div>
            <div style={{ color: '#F2F3F7', fontSize: 18, fontWeight: 700 }}>Registrar Serviço</div>
            <div style={{ color: '#4A5168', fontSize: 12 }}>Novo evento de manutenção</div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 18px 30px' }}>
        {/* Vehicle selector */}
        {vehicles.length > 1 && (
          <Field label="VEÍCULO *">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {vehicles.map(v => (
                <button
                  key={v.id}
                  onClick={() => setVehicleId(v.id)}
                  style={{
                    background: vehicleId === v.id ? `${TEAL}15` : '#171A1F',
                    border: vehicleId === v.id ? `1.5px solid ${TEAL}44` : '1.5px solid #222630',
                    borderRadius: 8, padding: '7px 12px',
                    color: vehicleId === v.id ? TEAL : '#8B929E',
                    fontSize: 12, fontWeight: vehicleId === v.id ? 600 : 400, cursor: 'pointer',
                  }}
                >
                  {v.brand} {v.model}
                </button>
              ))}
            </div>
          </Field>
        )}

        {/* Category */}
        <Field label="CATEGORIA *">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => {
              const cfg = categoryConfig[cat];
              const active = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  style={{
                    background: active ? cfg.bg : '#171A1F',
                    border: active ? `1.5px solid ${cfg.color}55` : '1.5px solid #222630',
                    borderRadius: 8, padding: '7px 12px',
                    color: active ? cfg.color : '#8B929E',
                    fontSize: 12, fontWeight: active ? 600 : 400, cursor: 'pointer',
                  }}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </Field>

        {/* Service name */}
        <Field label="DESCRIÇÃO DO SERVIÇO *">
          <input
            type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder="Ex: Troca de óleo 5W30 sintético"
            style={inputStyle()}
            onFocus={focusTeal} onBlur={blurBorder}
          />
        </Field>

        {/* Date + Mileage */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <div style={{ color: '#4A5168', fontSize: 11, letterSpacing: '0.08em', marginBottom: 8 }}>DATA *</div>
            <input
              type="date" value={date} onChange={e => setDate(e.target.value)}
              style={{ width: '100%', background: '#131619', border: '1px solid #222630', borderRadius: 12, padding: '12px 14px', color: '#F2F3F7', fontSize: 13, colorScheme: 'dark' }}
              onFocus={focusTeal} onBlur={blurBorder}
            />
          </div>
          <div>
            <div style={{ color: '#4A5168', fontSize: 11, letterSpacing: '0.08em', marginBottom: 8 }}>KM ATUAL *</div>
            <div style={{ position: 'relative' }}>
              <input
                type="number" value={mileage} onChange={e => setMileage(e.target.value)}
                placeholder={selectedVehicle ? String(selectedVehicle.mileage) : '45230'}
                style={{ width: '100%', background: '#131619', border: '1px solid #222630', borderRadius: 12, padding: '12px 42px 12px 14px', color: '#F2F3F7', fontSize: 13, fontFamily: "'JetBrains Mono'" }}
                onFocus={focusTeal} onBlur={blurBorder}
              />
              <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#4A5168', fontSize: 11 }}>km</span>
            </div>
          </div>
        </div>

        {/* Cost */}
        <Field label="CUSTO (R$) *">
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#4A5168', fontSize: 13, pointerEvents: 'none' }}>R$</span>
            <input
              type="number" step="0.01" value={cost} onChange={e => setCost(e.target.value)}
              placeholder="180,00"
              style={{ width: '100%', background: '#131619', border: '1px solid #222630', borderRadius: 12, padding: '13px 16px 13px 36px', color: '#F2F3F7', fontSize: 14, fontFamily: "'JetBrains Mono'" }}
              onFocus={focusTeal} onBlur={blurBorder}
            />
          </div>
        </Field>

        {/* Notes */}
        <Field label="OBSERVAÇÕES">
          <textarea
            value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Marca do óleo, peças utilizadas, nome da oficina..."
            rows={3}
            style={{ width: '100%', background: '#131619', border: '1px solid #222630', borderRadius: 12, padding: '13px 16px', color: '#F2F3F7', fontSize: 14, resize: 'none', lineHeight: 1.5 }}
            onFocus={focusTeal as any} onBlur={blurBorder as any}
          />
        </Field>

        {/* Next service */}
        <div style={{ background: '#171A1F', border: '1px solid #222630', borderRadius: 14, padding: '16px', marginBottom: 20 }}>
          <div style={{ color: '#8B929E', fontSize: 13, fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 15" />
            </svg>
            Lembrete para próxima troca (opcional)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <div style={{ color: '#4A5168', fontSize: 10, letterSpacing: '0.06em', marginBottom: 6 }}>PRÓX. KM</div>
              <div style={{ position: 'relative' }}>
                <input type="number" value={nextMileage} onChange={e => setNextMileage(e.target.value)} placeholder="48000"
                  style={{ width: '100%', background: '#131619', border: '1px solid #222630', borderRadius: 10, padding: '10px 38px 10px 12px', color: '#F2F3F7', fontSize: 12, fontFamily: "'JetBrains Mono'" }}
                  onFocus={focusTeal} onBlur={blurBorder}
                />
                <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#4A5168', fontSize: 10 }}>km</span>
              </div>
            </div>
            <div>
              <div style={{ color: '#4A5168', fontSize: 10, letterSpacing: '0.06em', marginBottom: 6 }}>PRÓX. DATA</div>
              <input type="date" value={nextDate} onChange={e => setNextDate(e.target.value)}
                style={{ width: '100%', background: '#131619', border: '1px solid #222630', borderRadius: 10, padding: '10px 12px', color: '#F2F3F7', fontSize: 12, colorScheme: 'dark' }}
                onFocus={focusTeal} onBlur={blurBorder}
              />
            </div>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '10px 14px', color: '#EF4444', fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSave}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #00DEDE, #009A9A)',
            border: 'none', borderRadius: 14, padding: '16px',
            color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,204,204,0.3)',
          }}
        >
          Registrar Serviço
        </button>
      </div>
    </div>
  );
}
