import { useState } from 'react';
import type { Vehicle, FuelType, Screen } from '../types';

interface AddVehicleProps {
  onNavigate: (screen: Screen) => void;
  onSave: (vehicle: Vehicle) => void;
}

const TEAL = '#00CCCC';

const BRANDS = [
  'Chevrolet', 'Fiat', 'Ford', 'Honda', 'Hyundai', 'Jeep',
  'Nissan', 'Renault', 'Toyota', 'Volkswagen', 'BMW', 'Mercedes-Benz',
];

const FUEL_TYPES: FuelType[] = ['Flex', 'Gasolina', 'Etanol', 'Diesel', 'Elétrico', 'Híbrido'];

const COLORS = [
  { label: 'Branco', value: '#E5E7EB' },
  { label: 'Prata', value: '#9CA3AF' },
  { label: 'Preto', value: '#1F2937' },
  { label: 'Cinza', value: '#6B7280' },
  { label: 'Azul', value: '#1A56DB' },
  { label: 'Vermelho', value: '#B91C1C' },
  { label: 'Verde', value: '#065F46' },
  { label: 'Prata met.', value: '#94A3B8' },
  { label: 'Azul esc.', value: '#1E3A5F' },
  { label: 'Vinho', value: '#7F1D1D' },
  { label: 'Dourado', value: '#B45309' },
  { label: 'Laranja', value: '#C2410C' },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ color: '#4A5168', fontSize: 11, letterSpacing: '0.08em', marginBottom: 8, fontWeight: 500 }}>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = 'text' }: {
  value: string; onChange: (v: string) => void; placeholder: string; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', background: '#131619',
        border: '1px solid #222630', borderRadius: 12,
        padding: '13px 16px', color: '#F2F3F7', fontSize: 14,
      }}
      onFocus={e => (e.target.style.borderColor = TEAL)}
      onBlur={e => (e.target.style.borderColor = '#222630')}
    />
  );
}

export default function AddVehicle({ onNavigate, onSave }: AddVehicleProps) {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [plate, setPlate] = useState('');
  const [mileage, setMileage] = useState('');
  const [fuelType, setFuelType] = useState<FuelType>('Flex');
  const [color, setColor] = useState(COLORS[4].value);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!brand || !model || !year || !plate || !mileage) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    const yearNum = parseInt(year);
    const kmNum = parseInt(mileage.replace(/\D/g, ''));
    if (isNaN(yearNum) || yearNum < 1990 || yearNum > new Date().getFullYear() + 1) {
      setError('Ano inválido.');
      return;
    }
    if (isNaN(kmNum) || kmNum < 0) {
      setError('Quilometragem inválida.');
      return;
    }
    onSave({
      id: `v${Date.now()}`,
      brand, model, year: yearNum,
      plate: plate.toUpperCase(),
      mileage: kmNum,
      fuelType, color,
      healthScore: 85,
    });
  };

  const chipActive = (active: boolean, color?: string) => ({
    background: active ? (color ? `${color}20` : `${TEAL}18`) : '#171A1F',
    border: active ? `1.5px solid ${color ? `${color}55` : `${TEAL}55`}` : '1.5px solid #222630',
    color: active ? (color ?? TEAL) : '#8B929E',
    fontWeight: active ? 600 : 400,
  } as const);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ flexShrink: 0, padding: '48px 18px 16px', background: '#0D0F13', borderBottom: '1px solid #1D2028' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => onNavigate('garage')}
            style={{ background: '#171A1F', border: '1px solid #222630', borderRadius: 10, padding: '8px', cursor: 'pointer' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B929E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div>
            <div style={{ color: '#F2F3F7', fontSize: 18, fontWeight: 700 }}>Novo Veículo</div>
            <div style={{ color: '#4A5168', fontSize: 12 }}>Preencha os dados do veículo</div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 18px 30px' }}>
        {/* Brand */}
        <div style={{ marginBottom: 20 }}>
          <FieldLabel>MARCA *</FieldLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {BRANDS.map(b => (
              <button
                key={b}
                onClick={() => setBrand(b)}
                style={{
                  ...chipActive(brand === b),
                  borderRadius: 8, padding: '7px 12px', fontSize: 12, cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Model */}
        <div style={{ marginBottom: 16 }}>
          <FieldLabel>MODELO *</FieldLabel>
          <TextInput value={model} onChange={setModel} placeholder="Ex: Civic EXL, HB20S, Gol" />
        </div>

        {/* Year + Plate */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <FieldLabel>ANO *</FieldLabel>
            <TextInput value={year} onChange={setYear} placeholder="2021" type="number" />
          </div>
          <div>
            <FieldLabel>PLACA *</FieldLabel>
            <TextInput
              value={plate}
              onChange={v => setPlate(v.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 8))}
              placeholder="ABC-1D23"
            />
          </div>
        </div>

        {/* Mileage */}
        <div style={{ marginBottom: 20 }}>
          <FieldLabel>QUILOMETRAGEM ATUAL *</FieldLabel>
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              value={mileage}
              onChange={e => setMileage(e.target.value)}
              placeholder="12500"
              style={{
                width: '100%', background: '#131619', border: '1px solid #222630', borderRadius: 12,
                padding: '13px 52px 13px 16px', color: '#F2F3F7', fontSize: 14, fontFamily: "'JetBrains Mono Variable'",
              }}
              onFocus={e => (e.target.style.borderColor = TEAL)}
              onBlur={e => (e.target.style.borderColor = '#222630')}
            />
            <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#4A5168', fontSize: 12, pointerEvents: 'none' }}>km</span>
          </div>
        </div>

        {/* Fuel */}
        <div style={{ marginBottom: 20 }}>
          <FieldLabel>COMBUSTÍVEL</FieldLabel>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {FUEL_TYPES.map(ft => (
              <button
                key={ft}
                onClick={() => setFuelType(ft)}
                style={{ ...chipActive(fuelType === ft), borderRadius: 8, padding: '7px 14px', fontSize: 12, cursor: 'pointer', transition: 'all 0.15s' }}
              >
                {ft}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div style={{ marginBottom: 28 }}>
          <FieldLabel>COR DO VEÍCULO</FieldLabel>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {COLORS.map(c => (
              <button
                key={c.value}
                title={c.label}
                onClick={() => setColor(c.value)}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: c.value,
                  border: color === c.value ? `2.5px solid ${TEAL}` : '2px solid transparent',
                  outline: color === c.value ? `2px solid ${TEAL}44` : 'none',
                  cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        {brand && model && (
          <div style={{
            background: '#171A1F', border: '1px solid #222630',
            borderRadius: 14, padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: color, flexShrink: 0 }} />
            <div>
              <div style={{ color: '#F2F3F7', fontSize: 14, fontWeight: 700 }}>{brand} {model}</div>
              <div style={{ color: '#4A5168', fontSize: 12 }}>{year || '----'} · {plate || 'XXX-0X00'} · {fuelType}</div>
            </div>
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: 10, padding: '10px 14px', color: '#EF4444', fontSize: 13, marginBottom: 16,
          }}>
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
          Salvar Veículo
        </button>
      </div>
    </div>
  );
}
