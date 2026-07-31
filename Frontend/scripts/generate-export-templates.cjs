const ExcelJS = require('exceljs');
const fs = require('fs');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

(async () => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Students');
  sheet.columns = [
    { header: '#', key: 'id', width: 8 },
    { header: 'Photo', key: 'photo', width: 18 },
    { header: 'Name', key: 'name', width: 24 },
    { header: 'Roll', key: 'roll', width: 14 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Class', key: 'className', width: 16 },
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

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
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

  page.drawText('This PDF serves as the export template for table formatting.', {
    x: 40,
    y: 770,
    size: 10,
    font: helveticaFont,
    color: rgb(1, 1, 1),
  });

  const headings = ['#', 'Photo', 'Name', 'Roll', 'Email', 'Class'];
  const widths = [30, 70, 140, 80, 170, 90];
  let x = 40;
  const yHeader = 720;

  page.drawRectangle({
    x: 40,
    y: yHeader - 10,
    width: widths.reduce((sum, w) => sum + w, 0),
    height: 24,
    color: rgb(0.16, 0.56, 0.76),
  });

  headings.forEach((text, index) => {
    page.drawText(text, {
      x,
      y: yHeader,
      size: 10,
      font: helveticaFont,
      color: rgb(1, 1, 1),
    });
    x += widths[index];
  });

  page.drawText('Use this template for styling exported student tables.', {
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
