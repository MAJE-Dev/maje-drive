import type { Alert, AlertSeverity, MaintenanceCategory, MaintenanceRecord, Vehicle } from './types';
import { categoryConfig, fmtDate, fmtKm } from './utils';

/** Intervalo padrão (km) usado quando o registro não informa a próxima quilometragem. */
export const DEFAULT_INTERVAL_KM: Partial<Record<MaintenanceCategory, number>> = {
  oil: 10000,
  filters: 10000,
  revision: 10000,
  brakes: 30000,
  suspension: 20000,
  cooling: 40000,
  transmission: 60000,
  battery: 40000,
};

export const FALLBACK_KM_PER_DAY = 40;
const MIN_KM_PER_DAY = 5;
const MAX_KM_PER_DAY = 300;
const MIN_SPAN_DAYS = 30;
const WARNING_KM = 3000;
const WARNING_DAYS = 30;
const DAY_MS = 86_400_000;

export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function daysBetween(fromISO: string, toISO: string): number {
  return Math.round((Date.parse(toISO) - Date.parse(fromISO)) / DAY_MS);
}

export function addDays(iso: string, days: number): string {
  return toISODate(new Date(Date.parse(iso) + days * DAY_MS));
}

/**
 * Média diária de km rodados: inclina a reta entre o primeiro registro de
 * manutenção e a quilometragem atual (considerada "hoje").
 */
export function estimateKmPerDay(vehicle: Vehicle, records: MaintenanceRecord[], today: string): number {
  const points = records
    .filter(r => r.vehicleId === vehicle.id)
    .map(r => ({ date: r.date, km: r.mileage }))
    .sort((a, b) => a.date.localeCompare(b.date));
  points.push({ date: today, km: vehicle.mileage });

  const first = points[0];
  const last = points[points.length - 1];
  const span = daysBetween(first.date, last.date);
  const km = last.km - first.km;
  if (span < MIN_SPAN_DAYS || km <= 0) return FALLBACK_KM_PER_DAY;
  return Math.min(MAX_KM_PER_DAY, Math.max(MIN_KM_PER_DAY, km / span));
}

function severityFor(remainingKm: number | null, daysLeft: number | null): AlertSeverity {
  if ((remainingKm !== null && remainingKm <= 0) || (daysLeft !== null && daysLeft <= 0)) return 'critical';
  if ((remainingKm !== null && remainingKm <= WARNING_KM) || (daysLeft !== null && daysLeft <= WARNING_DAYS)) {
    return 'warning';
  }
  return 'ok';
}

function describe(remainingKm: number | null, daysLeft: number | null, predictedDate?: string): string {
  if (remainingKm !== null && remainingKm <= 0) return `Vencida há ${fmtKm(-remainingKm)} km`;
  if (remainingKm === null && daysLeft !== null && daysLeft <= 0) return `Vencida há ${-daysLeft} dias`;
  if (daysLeft !== null && daysLeft <= 0) return `Prazo vencido há ${-daysLeft} dias`;
  const parts: string[] = [];
  if (remainingKm !== null) parts.push(`Faltam ${fmtKm(remainingKm)} km`);
  if (predictedDate) parts.push(`previsto para ${fmtDate(predictedDate)}`);
  else if (daysLeft !== null) parts.push(`faltam ${daysLeft} dias`);
  return parts.join(', ');
}

/** Gera os alertas preditivos de um veículo a partir do histórico de manutenções. */
export function predictAlerts(vehicle: Vehicle, records: MaintenanceRecord[], today: string): Alert[] {
  const kmPerDay = estimateKmPerDay(vehicle, records, today);

  const latestByCategory = new Map<MaintenanceCategory, MaintenanceRecord>();
  for (const r of records.filter(r => r.vehicleId === vehicle.id)) {
    const cur = latestByCategory.get(r.category);
    if (!cur || r.date > cur.date || (r.date === cur.date && r.mileage > cur.mileage)) {
      latestByCategory.set(r.category, r);
    }
  }

  const alerts: Alert[] = [];
  for (const [category, rec] of latestByCategory) {
    const interval = DEFAULT_INTERVAL_KM[category];
    const dueMileage = rec.nextMileage ?? (interval ? rec.mileage + interval : undefined);
    if (dueMileage === undefined && !rec.nextDate) continue;

    const remainingKm = dueMileage !== undefined ? dueMileage - vehicle.mileage : null;
    const daysByDate = rec.nextDate ? daysBetween(today, rec.nextDate) : null;
    const daysByKm = remainingKm !== null ? Math.ceil(Math.max(remainingKm, 0) / kmPerDay) : null;
    const candidates = [daysByDate, remainingKm !== null && remainingKm <= 0 ? 0 : daysByKm].filter(
      (n): n is number => n !== null,
    );
    const daysLeft = candidates.length ? Math.min(...candidates) : null;
    const predictedDate = daysLeft !== null && daysLeft > 0 ? addDays(today, daysLeft) : undefined;

    const severity = severityFor(remainingKm, daysLeft);
    alerts.push({
      id: `${vehicle.id}:${category}:${rec.id}`,
      vehicleId: vehicle.id,
      category,
      title: rec.name,
      description: describe(remainingKm, daysLeft, predictedDate),
      severity,
      dueMileage,
      currentMileage: vehicle.mileage,
      dueDate: rec.nextDate,
      predictedDate,
      daysLeft: daysLeft ?? undefined,
      kmPerDay: Math.round(kmPerDay * 10) / 10,
    });
  }

  const order = { critical: 0, warning: 1, ok: 2 } as const;
  return alerts.sort((a, b) => order[a.severity] - order[b.severity] || (a.daysLeft ?? 1e9) - (b.daysLeft ?? 1e9));
}

export function buildAlerts(vehicles: Vehicle[], records: MaintenanceRecord[], today: string): Alert[] {
  return vehicles.flatMap(v => predictAlerts(v, records, today));
}

/** Saúde do veículo (0–100) derivada dos alertas: cada item vencido pesa mais que um em atenção. */
export function computeHealthScore(alerts: Alert[]): number {
  const critical = alerts.filter(a => a.severity === 'critical').length;
  const warning = alerts.filter(a => a.severity === 'warning').length;
  return Math.max(0, Math.min(100, 100 - critical * 25 - warning * 8));
}

export function categoryLabel(c: MaintenanceCategory): string {
  return categoryConfig[c].label;
}
