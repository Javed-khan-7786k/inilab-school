import { jsPDF } from 'jspdf';
import autoTableImport from 'jspdf-autotable';
import type { ExportColumn } from './exportService'; 

// Bulletproof resolver for autoTable across all bundlers
const autoTable: any = (autoTableImport as any).default || (autoTableImport as any).autoTable || autoTableImport;
// Helper to sanitize text and prevent garbled characters in PDF
const sanitizeText = (value: any): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  
  let str = String(value);
  // Remove invisible control characters that cause garbled text in jsPDF
  str = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');
  return str;
};

export const exportPdf = async (
  data: Record<string, any>[],
  columns: ExportColumn[],
  filename = 'export',
  options: { orientation?: 'portrait' | 'landscape' } = {}
) => {
  const orientation = options.orientation || (columns.length > 5 ? 'landscape' : 'portrait');

  const doc = new jsPDF({ 
    unit: 'pt', 
    format: 'a4', 
    orientation,
    compress: true
  });

  // Explicitly set standard font to prevent encoding issues
  doc.setFont('helvetica', 'normal');

  const tableColumns = columns.map((col) => ({ 
    header: sanitizeText(col.header), 
    dataKey: col.accessorKey 
  }));

  const rows = data.map((row) =>
    Object.fromEntries(
      columns.map((col) => [
        col.accessorKey,
        sanitizeText(row[col.accessorKey])
      ])
    )
  );

  autoTable(doc, {
    columns: tableColumns,
    body: rows,
    startY: 60,
    margin: { top: 10, bottom: 10, left: 10, right: 10 },
    styles: {
      fontSize: 9,
      cellPadding: 6,
      valign: 'middle',
      halign: 'left',
      lineColor: [235, 240, 243],
      lineWidth: 0.5,
      font: 'helvetica',
      fontStyle: 'normal',
      overflow: 'linebreak',
      cellWidth: 'wrap'
    },
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 10,
      cellPadding: 8,
      font: 'helvetica',
      halign: 'left'
    },
    alternateRowStyles: {
      fillColor: [249, 250, 252],
    },
    columnStyles: {
      // Example: Force the 'Notice' or 'Description' column to wrap
      notice: { 
        cellWidth: 370, // <-- Set a fixed width to force text to wrap
        overflow: 'linebreak' 
      },
      details: { 
        cellWidth: 370, // <-- Set a fixed width to force text to wrap
        overflow: 'linebreak' 
      },
      
      
      // Example: Force the 'Title' column to wrap if it's too long
      title: {
        cellWidth: 120,
        overflow: 'linebreak'
      },

      // Example: Keep 'Date' or 'ID' columns on a single line
      date: { 
        cellWidth: 80, 
        halign: 'center',
        overflow: 'hidden' // Prevents wrapping for short data
      }
    },
    didDrawPage: (pageData:any) => {
      const pageCount = (doc as any).internal.getNumberOfPages();
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(127, 140, 141);

      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      // Footer line
      doc.setDrawColor(220, 224, 230);
      doc.setLineWidth(0.5);
      doc.line(40, pageHeight - 45, pageWidth - 40, pageHeight - 45);

      // Footer text
      doc.text("INILAB School Management System — Confidential Report", 40, pageHeight - 30);
      doc.text(`Page ${pageData.pageNumber} of ${pageCount}`, pageWidth - 80, pageHeight - 30);
    },
  });

  const formattedDate = new Date().toISOString().split('T')[0];
  const cleanFilename = filename.replace(/ report$/i, '').replace(/ /g, '_');
  doc.save(`${cleanFilename}_Report_${formattedDate}.pdf`);
};
