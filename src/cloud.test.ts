import { describe, expect, it } from 'vitest';
import { mergeById, maintenanceFromRow, maintenanceToRow, vehicleFromRow, vehicleToRow } from './cloud';
import { initialMaintenances, initialVehicles } from './data';

describe('mapeamento Supabase', () => {
  it('veículo ida e volta', () => {
    for (const v of initialVehicles) expect(vehicleFromRow(vehicleToRow(v))).toEqual(v);
  });
  it('manutenção ida e volta (numeric vem como string)', () => {
    for (const m of initialMaintenances) {
      const row = maintenanceToRow(m);
      expect(maintenanceFromRow({ ...row, cost: String(row.cost) })).toEqual(m);
    }
  });
  it('usa snake_case nas colunas', () => {
    expect(Object.keys(maintenanceToRow(initialMaintenances[0]))).toContain('vehicle_id');
  });
});

describe('mergeById', () => {
  it('mantém itens só locais e prefere a nuvem em conflito', () => {
    const merged = mergeById([{ id: 'a', v: 'nuvem' }], [{ id: 'a', v: 'local' }, { id: 'b', v: 'local' }]);
    expect(merged).toEqual([{ id: 'a', v: 'nuvem' }, { id: 'b', v: 'local' }]);
  });
});
