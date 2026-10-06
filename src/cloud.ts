import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { FuelType, MaintenanceCategory, MaintenanceRecord, Vehicle } from './types';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const cloudEnabled = Boolean(url && key);

let client: SupabaseClient | null = null;
function db(): SupabaseClient {
  if (!url || !key) throw new Error('Supabase não configurado');
  client ??= createClient(url, key, { auth: { persistSession: false } });
  return client;
}

interface VehicleRow {
  id: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  mileage: number;
  fuel_type: string;
  color: string;
  health_score: number;
  photo: string | null;
}

interface MaintenanceRow {
  id: string;
  vehicle_id: string;
  category: string;
  name: string;
  date: string;
  mileage: number;
  cost: number | string;
  notes: string | null;
  next_mileage: number | null;
  next_date: string | null;
}

export const vehicleToRow = (v: Vehicle): VehicleRow => ({
  id: v.id,
  brand: v.brand,
  model: v.model,
  year: v.year,
  plate: v.plate,
  mileage: v.mileage,
  fuel_type: v.fuelType,
  color: v.color,
  health_score: v.healthScore,
  photo: v.photo ?? null,
});

export const vehicleFromRow = (r: VehicleRow): Vehicle => ({
  id: r.id,
  brand: r.brand,
  model: r.model,
  year: r.year,
  plate: r.plate,
  mileage: r.mileage,
  fuelType: r.fuel_type as FuelType,
  color: r.color,
  healthScore: r.health_score,
  photo: r.photo ?? undefined,
});

export const maintenanceToRow = (m: MaintenanceRecord): MaintenanceRow => ({
  id: m.id,
  vehicle_id: m.vehicleId,
  category: m.category,
  name: m.name,
  date: m.date,
  mileage: m.mileage,
  cost: m.cost,
  notes: m.notes ?? null,
  next_mileage: m.nextMileage ?? null,
  next_date: m.nextDate ?? null,
});

export const maintenanceFromRow = (r: MaintenanceRow): MaintenanceRecord => ({
  id: r.id,
  vehicleId: r.vehicle_id,
  category: r.category as MaintenanceCategory,
  name: r.name,
  date: r.date,
  mileage: r.mileage,
  cost: Number(r.cost),
  notes: r.notes ?? undefined,
  nextMileage: r.next_mileage ?? undefined,
  nextDate: r.next_date ?? undefined,
});

function check(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export async function fetchAll(): Promise<{ vehicles: Vehicle[]; maintenances: MaintenanceRecord[] }> {
  const [v, m] = await Promise.all([
    db().from('vehicles').select('*'),
    db().from('maintenances').select('*').order('date', { ascending: false }),
  ]);
  check(v.error);
  check(m.error);
  return {
    vehicles: (v.data as VehicleRow[]).map(vehicleFromRow),
    maintenances: (m.data as MaintenanceRow[]).map(maintenanceFromRow),
  };
}

export async function pushAll(vehicles: Vehicle[], maintenances: MaintenanceRecord[]) {
  if (vehicles.length) check((await db().from('vehicles').upsert(vehicles.map(vehicleToRow))).error);
  if (maintenances.length) check((await db().from('maintenances').upsert(maintenances.map(maintenanceToRow))).error);
}

export async function upsertVehicle(v: Vehicle) {
  check((await db().from('vehicles').upsert(vehicleToRow(v))).error);
}

export async function removeVehicle(id: string) {
  check((await db().from('vehicles').delete().eq('id', id)).error);
}

export async function upsertMaintenance(m: MaintenanceRecord) {
  check((await db().from('maintenances').upsert(maintenanceToRow(m))).error);
}
