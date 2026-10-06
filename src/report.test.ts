import { describe, expect, it } from 'vitest';
import { buildReport, reportFileName } from './report';
import { buildAlerts } from './predictive';
import { initialMaintenances, initialVehicles } from './data';

describe('relatório em PDF', () => {
  const today = '2026-01-01';
  const vehicle = initialVehicles[0];
  const alerts = buildAlerts(initialVehicles, initialMaintenances, today);

  it('gera um PDF válido com os dados do veículo', () => {
    const doc = buildReport(vehicle, initialMaintenances, alerts, today);
    const bytes = new Uint8Array(doc.output('arraybuffer'));
    expect(String.fromCharCode(...bytes.slice(0, 5))).toBe('%PDF-');
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(1);
    if (process.env.PDF_OUT) doc.save(process.env.PDF_OUT);
  });
  it('nomeia o arquivo pela placa e data', () => {
    expect(reportFileName(vehicle, today)).toBe('maje-drive-ABC1D23-2026-01-01.pdf');
  });
});
