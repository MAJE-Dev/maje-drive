import { describe, expect, it } from 'vitest';
import type { MaintenanceRecord, Vehicle } from './types';
import { buildAlerts, computeHealthScore, estimateKmPerDay, FALLBACK_KM_PER_DAY, predictAlerts } from './predictive';
import { initialMaintenances, initialVehicles } from './data';

const TODAY = '2026-01-01';
const car: Vehicle = {
  id: 'c', brand: 'X', model: 'Y', year: 2020, plate: 'AAA-0A00', mileage: 10000,
  fuelType: 'Flex', color: '#000000', healthScore: 100,
};
const rec = (over: Partial<MaintenanceRecord>): MaintenanceRecord => ({
  id: 'r1', vehicleId: 'c', category: 'oil', name: 'Troca de óleo', date: '2025-01-01', mileage: 5000, cost: 100, ...over,
});

describe('estimateKmPerDay', () => {
  it('calcula a média entre o primeiro registro e hoje', () => {
    // 5.000 km em 365 dias ≈ 13,7 km/dia
    expect(estimateKmPerDay(car, [rec({})], TODAY)).toBeCloseTo(13.7, 1);
  });
  it('usa o valor padrão quando há pouco histórico', () => {
    expect(estimateKmPerDay(car, [], TODAY)).toBe(FALLBACK_KM_PER_DAY);
    expect(estimateKmPerDay(car, [rec({ date: '2025-12-25' })], TODAY)).toBe(FALLBACK_KM_PER_DAY);
  });
});

describe('predictAlerts', () => {
  it('marca como crítico quando a quilometragem já passou', () => {
    const [a] = predictAlerts(car, [rec({ nextMileage: 9000 })], TODAY);
    expect(a.severity).toBe('critical');
    expect(a.description).toContain('Vencida há 1.000 km');
  });
  it('marca como atenção perto do vencimento e prevê a data', () => {
    const [a] = predictAlerts(car, [rec({ nextMileage: 12000 })], TODAY);
    expect(a.severity).toBe('warning');
    expect(a.predictedDate).toBeDefined();
    expect(a.daysLeft).toBeGreaterThan(0);
  });
  it('marca como em dia quando está longe', () => {
    const [a] = predictAlerts(car, [rec({ nextMileage: 30000 })], TODAY);
    expect(a.severity).toBe('ok');
  });
  it('usa o intervalo padrão quando não há próxima quilometragem', () => {
    const [a] = predictAlerts(car, [rec({})], TODAY); // óleo: 5.000 + 10.000 = 15.000
    expect(a.dueMileage).toBe(15000);
  });
  it('considera a data limite informada', () => {
    const [a] = predictAlerts(car, [rec({ nextMileage: 90000, nextDate: '2025-12-01' })], TODAY);
    expect(a.severity).toBe('critical');
  });
  it('olha só o registro mais recente de cada categoria', () => {
    const alerts = predictAlerts(car, [rec({ nextMileage: 9000 }), rec({ id: 'r2', date: '2025-12-20', mileage: 9900, nextMileage: 19900 })], TODAY);
    expect(alerts).toHaveLength(1);
    expect(alerts[0].severity).toBe('ok');
  });
  it('ignora categorias sem intervalo', () => {
    expect(predictAlerts(car, [rec({ category: 'other' })], TODAY)).toHaveLength(0);
  });
  it('gera ids diferentes para cada registro (dispensa não vale para o próximo ciclo)', () => {
    const [a] = predictAlerts(car, [rec({})], TODAY);
    const [b] = predictAlerts(car, [rec({ id: 'r9', date: '2025-12-30' })], TODAY);
    expect(a.id).not.toBe(b.id);
  });
});

describe('computeHealthScore', () => {
  it('desconta críticos e atenções', () => {
    expect(computeHealthScore([])).toBe(100);
    const mk = (severity: 'critical' | 'warning') => ({ id: severity, vehicleId: 'c', category: 'oil' as const, title: '', description: '', severity });
    expect(computeHealthScore([mk('critical'), mk('warning')])).toBe(67);
    expect(computeHealthScore(Array(5).fill(mk('critical')))).toBe(0);
  });
});

describe('dados de exemplo', () => {
  it('geram alertas para todos os veículos', () => {
    const alerts = buildAlerts(initialVehicles, initialMaintenances, TODAY);
    for (const v of initialVehicles) expect(alerts.some(a => a.vehicleId === v.id)).toBe(true);
  });
});
