const ExcelJS = require('exceljs');
const fs = require('fs');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

(async () => {
  // Excel template
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Students');
  sheet.columns = [
    { header: '#', key: 'id', width: 8 },
    { header: 'Photo', key: 'photo', width: 18 },
    { header: 'Name', key: 'name', width: 24 },
    { header: 'Roll', key: 'roll', width: 14 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Class', key: 'className', width: 17 },
  ];

  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0E76A8' },
  };
  sheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.properties.defaultRowHeight = 22;
  sheet.views = [{ state: 'frozen', ySplit: 1 }];

  await workbook.xlsx.writeFile('public/template.xlsx');
  console.log('Created public/template.xlsx');

  // PDF template
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 portrait
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawRectangle({
    x: 0,
    y: 780,
    width: 595,
    height: 62,
    color: rgb(0.06, 0.46, 0.66),
  });

  page.drawText('Student Export Template', {
    x: 40,
    y: 796,
    size: 22,
    font: helveticaFont,
    color: rgb(1, 1, 1),
  });

  page.drawText('This template is used as the base PDF for export formatting.', {
    x: 40,
    y: 770,
    size: 10,
    font: helveticaFont,
    color: rgb(1, 1, 1),
  });

  const tableHeadings = ['#', 'Photo', 'Name', 'Roll', 'Email', 'Class'];
  const startX = 40;
  let x = startX;
  const y = 720;
  const widths = [30, 70, 140, 80, 180, 90];

  tableHeadings.forEach((heading, index) => {
    page.drawText(heading, {
      x,
      y,
      size: 10,
      font: helveticaFont,
      color: rgb(1, 1, 1),
    });
    x += widths[index];
  });

  page.drawRectangle({
    x: startX,
    y: y - 6,
    width: widths.reduce((sum, w) => sum + w, 0),
    height: 22,
    borderColor: rgb(0.06, 0.46, 0.66),
    borderWidth: 1,
    color: rgb(0.16, 0.56, 0.76),
    opacity: 0.8,
  });

  page.drawText('Use `public/template.xlsx` for Excel export and `public/my_form_template.pdf` or this PDF as styling reference.', {
    x: 40,
    y: 680,
    size: 9,
    font: helveticaFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('public/my_form_template.pdf', pdfBytes);
  console.log('Created public/my_form_template.pdf');
})();
