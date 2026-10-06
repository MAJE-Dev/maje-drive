import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import type { Alert, MaintenanceRecord, Vehicle } from './types';
import { categoryConfig, fmtCurrency, fmtDate, fmtKm } from './utils';
import { estimateKmPerDay, toISODate } from './predictive';

const PURPLE: [number, number, number] = [123, 51, 99];
const SEVERITY_LABEL = { critical: 'Vencido', warning: 'Atenção', ok: 'Em dia' } as const;

/** Monta o dossiê de manutenção de um veículo em PDF. */
export function buildReport(vehicle: Vehicle, records: MaintenanceRecord[], alerts: Alert[], today = toISODate(new Date())): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const mine = records.filter(r => r.vehicleId === vehicle.id).sort((a, b) => b.date.localeCompare(a.date));
  const myAlerts = alerts.filter(a => a.vehicleId === vehicle.id);
  const total = mine.reduce((s, r) => s + r.cost, 0);
  const kmPerDay = estimateKmPerDay(vehicle, records, today);

  doc.setFillColor(...PURPLE);
  doc.rect(0, 0, pageW, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Maje Drive', 14, 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Dossiê de manutenção do veículo', 14, 21);
  doc.text(`Emitido em ${fmtDate(today)}`, pageW - 14, 21, { align: 'right' });

  doc.setTextColor(30, 30, 40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`${vehicle.brand} ${vehicle.model}`, 14, 40);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(
    [
      `Placa: ${vehicle.plate}    Ano: ${vehicle.year}    Combustível: ${vehicle.fuelType}`,
      `Quilometragem atual: ${fmtKm(vehicle.mileage)} km    Uso médio estimado: ${Math.round(kmPerDay)} km/dia`,
      `Serviços registrados: ${mine.length}    Custo total: ${fmtCurrency(total)}`,
    ],
    14,
    47,
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Alertas preditivos', 14, 70);
  autoTable(doc, {
    startY: 73,
    head: [['Item', 'Situação', 'Previsto (km)', 'Previsão de data']],
    body: myAlerts.length
      ? myAlerts.map(a => [
          a.title,
          `${SEVERITY_LABEL[a.severity]}: ${a.description}`,
          a.dueMileage ? fmtKm(a.dueMileage) : '-',
          a.predictedDate ? fmtDate(a.predictedDate) : a.dueDate ? fmtDate(a.dueDate) : '-',
        ])
      : [['Nenhum item monitorado', '', '', '']],
    headStyles: { fillColor: PURPLE },
    styles: { fontSize: 9 },
  });

  const afterAlerts = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Histórico de manutenções', 14, afterAlerts + 10);
  autoTable(doc, {
    startY: afterAlerts + 13,
    head: [['Data', 'Serviço', 'Categoria', 'Km', 'Custo']],
    body: mine.length
      ? mine.map(r => [fmtDate(r.date), r.name, categoryConfig[r.category].label, fmtKm(r.mileage), fmtCurrency(r.cost)])
      : [['Nenhum registro', '', '', '', '']],
    foot: [['', '', '', 'Total', fmtCurrency(total)]],
    headStyles: { fillColor: PURPLE },
    footStyles: { fillColor: [235, 235, 240], textColor: [30, 30, 40] },
    styles: { fontSize: 9 },
  });

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 130);
    doc.text(`Maje Drive · página ${i} de ${pages}`, pageW / 2, 290, { align: 'center' });
  }
  return doc;
}

export function reportFileName(vehicle: Vehicle, today = toISODate(new Date())): string {
  return `maje-drive-${vehicle.plate.replace(/[^A-Za-z0-9]/g, '')}-${today}.pdf`;
}

/** No Android abre a folha de compartilhamento com o PDF; no navegador baixa o arquivo. */
export async function exportReport(vehicle: Vehicle, records: MaintenanceRecord[], alerts: Alert[]): Promise<void> {
  const doc = buildReport(vehicle, records, alerts);
  const fileName = reportFileName(vehicle);

  if (!Capacitor.isNativePlatform()) {
    doc.save(fileName);
    return;
  }
  const dataUri = doc.output('datauristring');
  const base64 = dataUri.slice(dataUri.indexOf('base64,') + 7);
  const { uri } = await Filesystem.writeFile({ path: fileName, data: base64, directory: Directory.Cache });
  await Share.share({ title: 'Dossiê Maje Drive', text: `Relatório de ${vehicle.brand} ${vehicle.model}`, url: uri, dialogTitle: 'Compartilhar relatório' });
}
