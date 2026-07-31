/* eslint-disable @typescript-eslint/no-explicit-any */
import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable/es';
import { PDFDocument } from 'pdf-lib';

export interface ExportColumn {
  header: string;
  accessorKey: string;
}

export interface ExportTemplateMap {
  [templateField: string]: string;
}

export interface ImageFieldMapValue {
  dataKey: string;
  pageIndex?: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ImageFieldMap = Record<string, string | ImageFieldMapValue>;

export interface BaseExportOptions {
  proxyUrl?: string;
  maxImageFetchConcurrency?: number;
  placeholderImageDataUrl?: string;
}

export interface ExcelTemplateExportOptions extends BaseExportOptions {
  templateUrl?: string;
  sheetName?: string;
  startRow?: number;
  fieldMap?: ExportTemplateMap;
  imageColumnKey?: string;
  imageSize?: { width: number; height: number };
}

export interface PdfTemplateExportOptions extends BaseExportOptions {
  templateUrl?: string;
  fieldMap?: ExportTemplateMap;
  imageFieldMap?: ImageFieldMap;
  flatten?: boolean;
}

const SUPPORTED_IMAGE_MIMES = ['png', 'jpeg', 'jpg', 'webp'];
const DEFAULT_PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAn8B9RXMbwAAAABJRU5ErkJggg==';

/** Default DB field name to user-friendly Excel header label mappings */
export const DEFAULT_HEADER_LABELS: Record<string, string> = {
  sno: '#',
  id: '#',
  _id: '#',
  photo: 'Student Photo',
  image: 'Student Photo',
  avatar: 'Student Photo',
  name: 'Student Name',
  studentName: 'Student Name',
  className: 'Class',
  class: 'Class',
  rollNumber: 'Roll Number',
  roll: 'Roll Number',
  dateOfBirth: 'Date of Birth',
  dob: 'Date of Birth',
  gender: 'Gender',
  fatherName: "Father's Name",
  fatherOccupation: "Father's Occupation",
  occupation: "Father's Occupation",
  fatherContact: 'Contact Number',
  contactNumber: 'Contact Number',
  phone: 'Contact Number',
  fatherEmail: 'Email Address',
  email: 'Email Address',
  emailAddress: 'Email Address',
  address: 'Address',
  status: 'Status',
  createdAt: 'Enquiry Date',
  enquiryDate: 'Enquiry Date',
};

const stripDataUrlPrefix = (dataUrl: string): string => {
  const match = dataUrl.match(/^data:[^;]+;base64,(.+)$/i);
  return match ? match[1] : dataUrl;
};

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const convertBlobToPngDataUrl = async (blob: Blob): Promise<string> => {
  const objectUrl = URL.createObjectURL(blob);
  const image = new Image();
  image.src = objectUrl;
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('Failed to decode image for conversion'));
  });

  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    URL.revokeObjectURL(objectUrl);
    throw new Error('Unable to create canvas context for image conversion');
  }

  ctx.drawImage(image, 0, 0);
  const dataUrl = canvas.toDataURL('image/png');
  URL.revokeObjectURL(objectUrl);
  return dataUrl;
};

const normalizeImageDataUrl = async (blob: Blob, contentType: string): Promise<string> => {
  const mime = contentType.split(';')[0].trim().toLowerCase();
  if (mime === 'image/webp') {
    return await convertBlobToPngDataUrl(blob);
  }

  if (mime === 'image/png' || mime === 'image/jpeg' || mime === 'image/jpg') {
    return await blobToDataUrl(blob);
  }

  return DEFAULT_PLACEHOLDER_IMAGE;
};

const isSupportedImageMime = (contentType: string): boolean =>
  SUPPORTED_IMAGE_MIMES.some((mime) => contentType.toLowerCase().includes(mime));

const downloadBlob = (blob: Blob, filename: string) => {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(objectUrl);
};

export const fetchImageAsBase64 = async (
  url: string,
  proxyUrl?: string,
  timeoutMs = 20000
): Promise<string> => {
  if (!url || url === '-' || url.includes('default.png')) {
    return DEFAULT_PLACEHOLDER_IMAGE;
  }

  const fetchUrl = proxyUrl ? `${proxyUrl}${encodeURIComponent(url)}` : url;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(fetchUrl, { signal: controller.signal, mode: 'cors' });
    if (!response.ok) {
      return DEFAULT_PLACEHOLDER_IMAGE;
    }

    const contentType = response.headers.get('Content-Type') || 'image/png';
    if (!isSupportedImageMime(contentType)) {
      return DEFAULT_PLACEHOLDER_IMAGE;
    }

    const blob = await response.blob();
    return await normalizeImageDataUrl(blob, contentType);
  } catch {
    return DEFAULT_PLACEHOLDER_IMAGE;
  } finally {
    window.clearTimeout(timeout);
  }
};

const fetchImagesInBatches = async (
  urls: string[],
  proxyUrl?: string,
  maxConcurrency = 8
): Promise<Map<string, string>> => {
  const uniqueUrls = Array.from(new Set(urls.filter(Boolean)));
  const result = new Map<string, string>();

  const batches = [];
  for (let i = 0; i < uniqueUrls.length; i += maxConcurrency) {
    batches.push(uniqueUrls.slice(i, i + maxConcurrency));
  }

  for (const batch of batches) {
    await Promise.all(
      batch.map(async (url) => {
        const value = await fetchImageAsBase64(url, proxyUrl);
        result.set(url, value);
      })
    );
  }

  return result;
};

// ==========================================
// REUSABLE HELPER FUNCTIONS
// ==========================================

/** Format dates like 23-Jul-2026 instead of ISO strings */
export const formatDate = (value: any): string => {
  if (!value || value === '-') return '-';
  const d = new Date(value);
  if (isNaN(d.getTime())) {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      const parts = value.split('T')[0].split('-');
      if (parts.length === 3) {
        const year = parts[0];
        const monthIdx = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        if (monthIdx >= 0 && monthIdx < 12) {
          return `${String(day).padStart(2, '0')}-${months[monthIdx]}-${year}`;
        }
      }
    }
    return String(value);
  }
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = String(d.getDate()).padStart(2, '0');
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

/** Format cell values: null/undefined/empty -> '-', booleans -> Yes/No, dates -> 23-Jul-2026 */
export const formatExportValue = (value: any): string => {
  if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    return '-';
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (value instanceof Date) {
    return formatDate(value);
  }
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return formatDate(value);
  }
  return String(value);
};

/** Format Header Cell: Bold, Centered, White Font, Corporate Blue Background, Vertical Center, Wrap Text */
export const formatHeader = (cell: ExcelJS.Cell, headerText: string) => {
  cell.value = headerText;
  cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1E3A8A' }, // Corporate Dark Blue (#1E3A8A)
  };
  cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  setBorders(cell, 'FF94A3B8');
};

/** Format Data Cell: Font, Alignment, Zebra Shading, Thin Borders */
export const formatCell = (
  cell: ExcelJS.Cell,
  value: any,
  options: { isZebra?: boolean; isCentered?: boolean } = {}
) => {
  cell.value = value;
  cell.font = { name: 'Segoe UI', size: 10, color: { argb: 'FF1E293B' } };
  cell.alignment = {
    vertical: 'middle',
    horizontal: options.isCentered ? 'center' : 'left',
    wrapText: false,
  };

  if (options.isZebra) {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF8FAFC' }, // Alternate row light zebra tint
    };
  }

  setBorders(cell, 'FFE2E8F0');
};

/** Set Thin Cell Borders */
export const setBorders = (cell: ExcelJS.Cell, colorArgb = 'FFE2E8F0') => {
  cell.border = {
    top: { style: 'thin', color: { argb: colorArgb } },
    left: { style: 'thin', color: { argb: colorArgb } },
    bottom: { style: 'thin', color: { argb: colorArgb } },
    right: { style: 'thin', color: { argb: colorArgb } },
  };
};

/** Insert Image inside Worksheet Cell */
export const insertImage = (
  worksheet: ExcelJS.Worksheet,
  imageId: number,
  imageColumnIndex: number,
  rowNumber: number,
  width = 50,
  height = 50
) => {
  worksheet.addImage(imageId, {
    tl: { col: imageColumnIndex, row: rowNumber - 1 },
    ext: { width, height },
    editAs: 'oneCell',
  });
};

/** Set Column Widths Automatically based on content length */
export const setColumnWidth = (
  worksheet: ExcelJS.Worksheet,
  columns: ExportColumn[],
  imageColumnIndex: number,
  imageWidth: number,
  headerRowIndex = 6
) => {
  columns.forEach((col, idx) => {
    const column = worksheet.getColumn(idx + 1);
    let maxLength = 0;

    worksheet.eachRow({ includeEmpty: false }, (row, rowNum) => {
      if (rowNum >= headerRowIndex) {
        const val = row.getCell(idx + 1).value;
        if (val) maxLength = Math.max(maxLength, String(val).length);
      }
    });

    const isImageCol = idx === imageColumnIndex;
    column.width = isImageCol
      ? Math.max(14, imageWidth / 7 + 4)
      : Math.max(maxLength + 4, col.header.length + 5, 12);
  });
};

/** Calculate Excel Column Letter (A, B, AA...) */
export const getExcelColumnLetter = (colIndex: number): string => {
  let letter = '';
  let temp = colIndex;
  while (temp > 0) {
    const mod = (temp - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    temp = Math.floor((temp - mod) / 26);
  }
  return letter || 'F';
};

/** Prepares columns and data rows globally for all exports (Excel, CSV, PDF, Copy) */
export const prepareExportData = (
  data: Record<string, any>[],
  columns: ExportColumn[]
): { preparedData: Record<string, any>[]; preparedColumns: ExportColumn[] } => {
  if (!columns || columns.length === 0) {
    return { preparedData: data || [], preparedColumns: [] };
  }

  // Clone columns and replace any raw DB field headers with human readable labels
  let preparedColumns: ExportColumn[] = columns.map((col) => {
    const rawKey = col.accessorKey || '';
    const mappedLabel = DEFAULT_HEADER_LABELS[rawKey] || col.header;
    return {
      header: mappedLabel,
      accessorKey: rawKey,
    };
  });

  // Ensure serial number column is present as column 1
  const firstColKey = (preparedColumns[0]?.accessorKey || '').toLowerCase();
  const firstColHeader = (preparedColumns[0]?.header || '').toLowerCase();

  const isSerialCol =
    firstColKey === 'sno' ||
    firstColKey === '#' ||
    firstColHeader === '#' ||
    firstColHeader === 's.no' ||
    firstColHeader === 's.no.' ||
    firstColHeader === 'sl.no';

  if (isSerialCol) {
    preparedColumns[0] = { header: '#', accessorKey: 'sno' };
  } else if (firstColKey === 'id' || firstColKey === '_id') {
    preparedColumns[0] = { header: '#', accessorKey: 'sno' };
  } else {
    preparedColumns.unshift({ header: '#', accessorKey: 'sno' });
  }

  // Sanitize data rows (Serial Number, nulls -> '-', booleans -> Yes/No, dates -> 23-Jul-2026)
  const preparedData = (data || []).map((row, index) => {
    const newRow: Record<string, any> = { ...row, sno: index + 1 };

    if (newRow.id && typeof newRow.id === 'string' && /^[0-9a-fA-F]{24}$/.test(newRow.id)) {
      newRow.id = index + 1;
    }

    return newRow;
  });

  return { preparedData, preparedColumns };
};

const createRows = (data: Record<string, any>[], columns: ExportColumn[], fieldMap?: ExportTemplateMap) => {
  if (fieldMap) {
    return data.map((row) =>
      Object.keys(fieldMap).map((field) => formatExportValue(row[fieldMap[field]]))
    );
  }

  return data.map((row) =>
    columns.map((col) => formatExportValue(row[col.accessorKey]))
  );
};

export const handleCopyToClipboard = (data: Record<string, any>[], columns: ExportColumn[]) => {
  const { preparedData, preparedColumns } = prepareExportData(data, columns);
  const headers = preparedColumns.map((col) => col.header).join('\t');
  const rows = preparedData.map((row) =>
    preparedColumns.map((col) => formatExportValue(row[col.accessorKey])).join('\t')
  );
  navigator.clipboard.writeText([headers, ...rows].join('\n'));
};

export const handleExportCsv = (data: Record<string, any>[], columns: ExportColumn[], filename = 'export') => {
  const { preparedData, preparedColumns } = prepareExportData(data, columns);
  const escapeCsv = (value: any) => {
    const text = value === undefined || value === null ? '' : String(value);
    const escaped = text.replace(/"/g, '""');
    return /[",\n\r]/.test(text) ? `"${escaped}"` : escaped;
  };

  const headers = preparedColumns.map((col) => escapeCsv(col.header)).join(',');
  const rows = preparedData.map((row) =>
    preparedColumns.map((col) => escapeCsv(formatExportValue(row[col.accessorKey]))).join(',')
  );

  const csv = [headers, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

  const formattedDate = new Date().toISOString().split('T')[0];
  const cleanFilename = filename.replace(/ report$/i, '').replace(/ /g, '_');
  downloadBlob(blob, `${cleanFilename}_Report_${formattedDate}.csv`);
};

/**
 * Professional Excel Export Module.
 * Generates custom, business-grade styled Excel documents with images, readable labels, auto column widths,
 * zebra row shading, print settings, autofilters, and frozen headers.
 */
export const exportExcelFromTemplate = async (
  data: Record<string, any>[],
  columns: ExportColumn[],
  filename = 'Enquiry',
  options: ExcelTemplateExportOptions = {}
) => {
  const { preparedData, preparedColumns } = prepareExportData(data, columns);
  const {
    sheetName = 'Report',
    imageColumnKey = 'photo',
    imageSize = { width: 50, height: 50 },
    proxyUrl,
    maxImageFetchConcurrency = 8,
  } = options;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  // 1. Print Settings (Landscape, Fit to Page Width, Centered)
  worksheet.pageSetup = {
    orientation: 'landscape',
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    horizontalCentered: true,
  };

  const lastColLetter = getExcelColumnLetter(preparedColumns.length);

  // 2. Header Branding Banners (Row 2, Row 3, Row 4)
  worksheet.mergeCells(`A2:${lastColLetter}2`);
  const titleCell = worksheet.getCell('A2');
  titleCell.value = 'INILAB School Management System';
  titleCell.font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
  worksheet.getRow(2).height = 36;

  worksheet.mergeCells(`A3:${lastColLetter}3`);
  const subtitleCell = worksheet.getCell('A3');
  subtitleCell.value = `${filename.toUpperCase().replace(/_/g, ' ').replace(/-/g, ' ')} REPORT`;
  subtitleCell.font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FF1E293B' } };
  subtitleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getRow(3).height = 24;

  worksheet.mergeCells(`A4:${lastColLetter}4`);
  const metaCell = worksheet.getCell('A4');
  metaCell.value = `Generated: ${formatDate(new Date())} | Total Records: ${preparedData.length}`;
  metaCell.font = { name: 'Segoe UI', size: 9, italic: true, color: { argb: 'FF64748B' } };
  metaCell.alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getRow(4).height = 18;

  worksheet.getRow(5).height = 10; // Spacing row

  // 3. Header Row (Row 6) - Styled with Blue background, Bold white font, Center aligned, Wrap Text
  const headerRowIndex = 6;
  const headerRow = worksheet.getRow(headerRowIndex);
  headerRow.height = 28;

  preparedColumns.forEach((col, idx) => {
    const cell = headerRow.getCell(idx + 1);
    formatHeader(cell, col.header);
  });

  // 4. Image Pre-fetching
  const imageUrls = imageColumnKey
    ? preparedData.map((row) => String(row[imageColumnKey] ?? '')).filter((u) => u && u !== '-')
    : [];
  const imagesMap = await fetchImagesInBatches(imageUrls, proxyUrl, maxImageFetchConcurrency);
  const imageColIdx = imageColumnKey
    ? preparedColumns.findIndex((col) => col.accessorKey === imageColumnKey)
    : -1;

  // 5. Data Rows (Starting at Row 7)
  const activeStartRow = 7;
  const dataRows = createRows(preparedData, preparedColumns);

  dataRows.forEach((rowValues, rowIndex) => {
    const rowNumber = activeStartRow + rowIndex;
    const excelRow = worksheet.getRow(rowNumber);
    excelRow.height = imageColIdx >= 0 ? Math.max(24, imageSize.height + 12) : 22;

    rowValues.forEach((value, colIdx) => {
      const cell = excelRow.getCell(colIdx + 1);
      const isCentered = colIdx === 0; // Center align Serial Number
      const isZebra = rowIndex % 2 === 1; // Alternating row shading

      if (colIdx === imageColIdx) {
        const imageUrl = String(preparedData[rowIndex][imageColumnKey] ?? '');
        const imageDataUrl = imagesMap.get(imageUrl);

        if (imageDataUrl && imageDataUrl !== DEFAULT_PLACEHOLDER_IMAGE) {
          cell.value = '';
          try {
            const [mime] = imageDataUrl.substring(5).split(';');
            const extension = mime.includes('png') ? 'png' : 'jpeg';
            const base64 = stripDataUrlPrefix(imageDataUrl);
            const imageId = workbook.addImage({ base64, extension });

            insertImage(worksheet, imageId, colIdx, rowNumber, imageSize.width, imageSize.height);
          } catch {
            cell.value = 'No Image';
          }
        } else {
          cell.value = 'No Image';
        }
        formatCell(cell, cell.value, { isZebra, isCentered: true });
        if (cell.value === 'No Image') {
          cell.font = { name: 'Segoe UI', size: 9, italic: true, color: { argb: 'FF94A3B8' } };
        }
      } else {
        formatCell(cell, value, { isZebra, isCentered });
      }
    });
  });

  // 6. Auto Column Widths
  setColumnWidth(worksheet, preparedColumns, imageColIdx, imageSize.width, headerRowIndex);

  // 7. Freeze Header & Enable AutoFilter
  worksheet.views = [{ state: 'frozen', ySplit: headerRowIndex }];
  worksheet.autoFilter = {
    from: { row: headerRowIndex, column: 1 },
    to: { row: headerRowIndex, column: preparedColumns.length },
  };

  // 8. Generate File Name: e.g. Enquiry_Report_2026-07-23.xlsx
  const formattedDate = new Date().toISOString().split('T')[0];
  const cleanFilename = filename.replace(/ report$/i, '').replace(/ /g, '_');
  const finalFileName = `${cleanFilename}_Report_${formattedDate}.xlsx`;

  // 9. Write & Download Blob
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  downloadBlob(blob, finalFileName);
};

export const exportExcelWithImages = async (
  data: Record<string, any>[],
  columns: ExportColumn[],
  filename = 'export',
  options: ExcelTemplateExportOptions = {}
) => {
  return exportExcelFromTemplate(data, columns, filename, options);
};

export const exportPdfFromTemplate = async (
  data: Record<string, any>[] | Record<string, any>,
  filename = 'export',
  options: PdfTemplateExportOptions = {}
) => {
  const {
    templateUrl = '/my_form_template.pdf',
    fieldMap,
    imageFieldMap,
    proxyUrl,
  } = options;

  const payload = Array.isArray(data) ? data[0] ?? {} : data;
  const response = await fetch(templateUrl);
  if (!response.ok) {
    throw new Error(`Cannot load PDF template: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const form = pdfDoc.getForm();

  if (fieldMap) {
    for (const [templateField, dataKey] of Object.entries(fieldMap)) {
      const value = String(payload[dataKey] ?? '');
      try {
        form.getTextField(templateField).setText(value);
        continue;
      } catch {
        // field not found or not text, ignore
      }
      try {
        form.getDropdown(templateField).select(value);
        continue;
      } catch {
        // field not found or not dropdown, ignore
      }
      try {
        const checkbox = form.getCheckBox(templateField);
        if (value.toLowerCase() === 'true' || value === '1' || value.toLowerCase() === 'yes') {
          checkbox.check();
        } else {
          checkbox.uncheck();
        }
      } catch {
        // field not found or not checkbox, ignore
      }
    }
  }

  if (imageFieldMap) {
    const entries = Object.entries(imageFieldMap);
    const imageValues = await Promise.all(
      entries.map(async ([fieldName, mapping]) => {
        const dataKey = typeof mapping === 'string' ? mapping : mapping.dataKey;
        const imageUrl = String(payload[dataKey] ?? '');
        const base64 = await fetchImageAsBase64(imageUrl, proxyUrl, 20000);
        return [fieldName, mapping, base64] as const;
      })
    );

    for (const [, mapping, imageDataUrl] of imageValues) {
      const imageBuffer = stripDataUrlPrefix(imageDataUrl);
      const mime = imageDataUrl.substring(5, imageDataUrl.indexOf(';'));
      const embeddedImage = mime.includes('png')
        ? await pdfDoc.embedPng(imageBuffer)
        : await pdfDoc.embedJpg(imageBuffer);

      if (typeof mapping === 'string') {
        continue;
      }

      const pageIndex = mapping.pageIndex ?? 0;
      const page = pdfDoc.getPages()[pageIndex];
      if (page) {
        page.drawImage(embeddedImage, {
          x: mapping.x,
          y: mapping.y,
          width: mapping.width,
          height: mapping.height,
        });
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  downloadBlob(blob, `${filename}.pdf`);
};

export const exportPdfWithImages = async (
  data: Record<string, any>[],
  columns: ExportColumn[],
  filename = 'export',
  options: BaseExportOptions & { imageColumnKey?: string; imageSize?: { width: number; height: number } } = {}
) => {
  const { preparedData, preparedColumns } = prepareExportData(data, columns);
  const {
    imageColumnKey,
    proxyUrl,
    maxImageFetchConcurrency = 8,
    imageSize = { width: 32, height: 32 },
  } = options;

  const doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: preparedColumns.length > 5 ? 'landscape' : 'portrait' });
  const tableColumns = preparedColumns.map((col) => ({ header: col.header, dataKey: col.accessorKey }));
  const rows = preparedData.map((row) =>
    Object.fromEntries(
      preparedColumns.map((col) => [
        col.accessorKey,
        col.accessorKey === imageColumnKey ? '' : formatExportValue(row[col.accessorKey]),
      ])
    )
  );

  const imageUrls = imageColumnKey
    ? preparedData.map((row) => String(row[imageColumnKey] ?? '')).filter(Boolean)
    : [];
  const imageMap = await fetchImagesInBatches(imageUrls, proxyUrl, maxImageFetchConcurrency);

  autoTable(doc, {
    columns: tableColumns,
    body: rows,
    startY: 130,
    margin: { top: 70, bottom: 60, left: 40, right: 40 },
    styles: {
      fontSize: 9,
      cellPadding: 6,
      valign: 'middle',
      minCellHeight: imageColumnKey ? imageSize.height + 10 : undefined,
      lineColor: [235, 240, 243],
      lineWidth: 0.5,
    },
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 10,
      cellPadding: 8,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 252],
    },
    columnStyles: imageColumnKey ? { [imageColumnKey]: { cellWidth: imageSize.width + 12 } } : {},
    didDrawCell: (dataCell) => {
      if (
        imageColumnKey &&
        dataCell.section === 'body' &&
        dataCell.column.dataKey === imageColumnKey
      ) {
        const imageUrl = String(preparedData[dataCell.row.index]?.[imageColumnKey] ?? '');
        const imageDataUrl = imageMap.get(imageUrl) || DEFAULT_PLACEHOLDER_IMAGE;
        if (imageDataUrl && imageDataUrl !== DEFAULT_PLACEHOLDER_IMAGE) {
          try {
            const mime = imageDataUrl.substring(5, imageDataUrl.indexOf(';'));
            const imageWidth = Math.min(imageSize.width, dataCell.cell.width - 8);
            const imageHeight = Math.min(imageSize.height, dataCell.cell.height - 8);
            const x = dataCell.cell.x + (dataCell.cell.width - imageWidth) / 2;
            const y = dataCell.cell.y + (dataCell.cell.height - imageHeight) / 2;
            doc.addImage(imageDataUrl, mime.includes('png') ? 'PNG' : 'JPEG', x, y, imageWidth, imageHeight);
          } catch (err) {
            console.warn('Failed embedding cell image in PDF:', err);
          }
        }
      }
    },
    didDrawPage: (pageData) => {
      const pageCount = (doc as any).internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(127, 140, 141);

      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      doc.setDrawColor(220, 224, 230);
      doc.setLineWidth(0.5);
      doc.line(40, pageHeight - 45, pageWidth - 40, pageHeight - 45);

      doc.text("INILAB School Management System — Confidential Report", 40, pageHeight - 32);
      doc.text(`Page ${pageData.pageNumber} of ${pageCount}`, pageWidth - 80, pageHeight - 32);
    },
  });

  const formattedDate = new Date().toISOString().split('T')[0];
  const cleanFilename = filename.replace(/ report$/i, '').replace(/ /g, '_');
  doc.save(`${cleanFilename}_Report_${formattedDate}.pdf`);
};
