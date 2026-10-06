export type Screen =
  | 'dashboard'
  | 'garage'
  | 'add-vehicle'
  | 'history'
  | 'add-maintenance'
  | 'alerts';

export type FuelType = 'Gasolina' | 'Etanol' | 'Flex' | 'Diesel' | 'Elétrico' | 'Híbrido';

export type MaintenanceCategory =
  | 'oil'
  | 'brakes'
  | 'filters'
  | 'revision'
  | 'electrical'
  | 'suspension'
  | 'cooling'
  | 'transmission'
  | 'battery'
  | 'other';

export type AlertSeverity = 'critical' | 'warning' | 'ok';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  mileage: number;
  fuelType: FuelType;
  color: string;
  healthScore: number;
  photo?: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  category: MaintenanceCategory;
  name: string;
  date: string;
  mileage: number;
  cost: number;
  notes?: string;
  nextMileage?: number;
  nextDate?: string;
}

export interface Alert {
  id: string;
  vehicleId: string;
  category: MaintenanceCategory;
  title: string;
  description: string;
  severity: AlertSeverity;
  dueMileage?: number;
  currentMileage?: number;
  dueDate?: string;
  /** Data prevista (estimada pelo uso médio) para atingir a quilometragem de revisão. */
  predictedDate?: string;
  daysLeft?: number;
  kmPerDay?: number;
}
