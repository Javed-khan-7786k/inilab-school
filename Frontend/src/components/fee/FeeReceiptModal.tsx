import React from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { schoolSettingApi } from "../../services/api/schoolSettingApi";
import type { FeeReceipt } from "../../types";

interface FeeReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: FeeReceipt | null;
}

export const FeeReceiptModal: React.FC<FeeReceiptModalProps> = ({
  isOpen,
  onClose,
  receipt,
}) => {
  const [schoolProfile, setSchoolProfile] = React.useState<any>(null);

  React.useEffect(() => {
    if (isOpen) {
      schoolSettingApi.getSettings()
        .then(settings => {
          if (settings?.schoolProfile) {
            setSchoolProfile(settings.schoolProfile);
          }
        })
        .catch(err => console.error("Failed to load school settings for receipt:", err));
    }
  }, [isOpen]);

  if (!receipt) return null;

  const schoolName = schoolProfile?.name || "Inilab International Academy";
  const schoolAddress = schoolProfile?.address || "123 Knowledge Park, Education Hub, New Delhi";
  const schoolPhone = schoolProfile?.phone || "+91 98765 43210";
  const schoolBoard = schoolProfile?.affiliationBoard || "CBSE Board";
  const schoolReg = schoolProfile?.registrationNo || "REG-998877-CBSE";

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(18);
      doc.setTextColor(41, 128, 185);
      doc.text(schoolName.toUpperCase(), 105, 18, { align: "center" });

      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(`${schoolBoard} | Reg No: ${schoolReg}`, 105, 24, { align: "center" });
      doc.text(`${schoolAddress} | Tel: ${schoolPhone}`, 105, 29, { align: "center" });

      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      doc.text("FEE PAYMENT RECEIPT", 105, 38, { align: "center" });

      doc.setLineWidth(0.5);
      doc.setDrawColor(200);
      doc.line(14, 42, 196, 42);

      // Receipt Meta
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Receipt No: ${receipt.receiptNo}`, 14, 49);
      doc.text(`Date: ${new Date(receipt.paymentDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`, 140, 49);
      doc.text(`Academic Year: ${receipt.academicYear || "2026-2027"}`, 14, 55);
      doc.text(`Payment Mode: ${receipt.paymentMode}`, 140, 55);

      // Student Meta Box
      doc.setFillColor(245, 247, 250);
      doc.rect(14, 60, 182, 18, "F");
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`Student: ${receipt.studentName}`, 18, 67);
      doc.text(`Roll No: ${receipt.roll}`, 140, 67);
      doc.setFont("helvetica", "normal");
      doc.text(`Class: ${receipt.className} (${receipt.sectionName})`, 18, 74);
      if (receipt.fatherName) {
        doc.text(`Father's Name: ${receipt.fatherName}`, 140, 74);
      }

      // Items Table
      const tableData = receipt.items.map((item, index) => [
        String(index + 1),
        item.headName,
        item.term || "Monthly",
        item.period || "-",
        `INR ${Number(item.amount).toLocaleString("en-IN")}`
      ]);

      (doc as any).autoTable({
        startY: 83,
        head: [["#", "Fee Head", "Term", "Period / Description", "Amount"]],
        body: tableData,
        theme: "striped",
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
        columnStyles: {
          0: { cellWidth: 10, halign: "center" },
          1: { cellWidth: 60 },
          2: { cellWidth: 30 },
          3: { cellWidth: 45 },
          4: { cellWidth: 37, halign: "right" },
        },
      });

      const finalY = (doc as any).lastAutoTable.finalY + 8;

      // Totals
      doc.setFontSize(10);
      doc.text(`Subtotal: INR ${receipt.subTotal.toLocaleString("en-IN")}`, 140, finalY);
      if (receipt.discount > 0) {
        doc.text(`Discount: - INR ${receipt.discount.toLocaleString("en-IN")}`, 140, finalY + 6);
      }
      if (receipt.fine > 0) {
        doc.text(`Fine: + INR ${receipt.fine.toLocaleString("en-IN")}`, 140, finalY + 12);
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(41, 128, 185);
      doc.text(`Total Paid: INR ${receipt.totalPaid.toLocaleString("en-IN")}`, 140, finalY + 18);
      
      doc.setFontSize(10);
      doc.setTextColor(200, 30, 30);
      doc.text(`Balance Due: INR ${receipt.balanceDue.toLocaleString("en-IN")}`, 140, finalY + 24);

      // Signatures
      doc.setTextColor(80);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Authorized Signature & Stamp", 140, finalY + 45);
      doc.line(135, finalY + 41, 190, finalY + 41);

      doc.text("Received By: " + (receipt.collectedBy || "School Office"), 14, finalY + 45);
      doc.text("Note: Computer generated fee receipt. No physical signature required.", 14, finalY + 52);

      doc.save(`Fee_Receipt_${receipt.receiptNo}_${receipt.studentName}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Official Fee Receipt - ${receipt.receiptNo}`}
      maxWidthClass="max-w-4xl"
    >
      <div className="p-6 bg-gray-50 max-h-[85vh] overflow-y-auto">
        {/* Printable Area */}
        <div
          id="school-fee-receipt-print"
          className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 w-full mx-auto print:p-0 print:border-0 print:shadow-none"
        >
          <style>{`
            @media print {
              body * {
                visibility: hidden !important;
              }
              #school-fee-receipt-print, #school-fee-receipt-print * {
                visibility: visible !important;
              }
              #school-fee-receipt-print {
                position: fixed !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 20px !important;
                background: white !important;
              }
              .no-print {
                display: none !important;
              }
            }
          `}</style>

          {/* School Header */}
          <div className="text-center pb-4 border-b-2 border-primary/30">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                <Icon name="fa-graduation-cap" />
              </span>
              <h1 className="text-xl font-bold text-gray-800 tracking-wide uppercase m-0">
                {schoolName}
              </h1>
            </div>
            <p className="text-xs text-gray-500 m-0">
              {schoolBoard} | Registration No: {schoolReg}
            </p>
            <p className="text-xs text-gray-500 m-0">
              {schoolAddress} | Contact: {schoolPhone}
            </p>
            <div className="inline-block mt-3 px-4 py-1 bg-primary text-white text-xs font-semibold rounded-full tracking-wider uppercase">
              Official Fee Receipt
            </div>
          </div>

          {/* Receipt Info Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4 p-3 bg-gray-50 rounded border border-gray-100 text-xs">
            <div>
              <span className="text-gray-500 block">Receipt No:</span>
              <span className="font-bold text-gray-800">{receipt.receiptNo}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Payment Date:</span>
              <span className="font-semibold text-gray-800">
                {new Date(receipt.paymentDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block">Academic Year:</span>
              <span className="font-semibold text-gray-800">{receipt.academicYear || "2026-2027"}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Payment Mode:</span>
              <span className="inline-block font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                {receipt.paymentMode}
              </span>
            </div>
          </div>

          {/* Student Profile Card */}
          <div className="p-3 bg-blue-50/50 rounded border border-blue-100 mb-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-gray-500 block">Student Name</span>
                <span className="font-bold text-gray-900 text-sm">{receipt.studentName}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Roll / ID</span>
                <span className="font-bold text-gray-900 text-sm">#{receipt.roll}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Class & Section</span>
                <span className="font-semibold text-gray-800">{receipt.className} ({receipt.sectionName})</span>
              </div>
              <div>
                <span className="text-gray-500 block">Father's Name</span>
                <span className="font-semibold text-gray-800">{receipt.fatherName || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-gray-200 rounded overflow-hidden mb-4">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-gray-100 border-b border-gray-200 text-gray-700 font-semibold">
                <tr>
                  <th className="p-2.5 text-center w-10">#</th>
                  <th className="p-2.5">Fee Category</th>
                  <th className="p-2.5">Term</th>
                  <th className="p-2.5">Period / Details</th>
                  <th className="p-2.5 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {receipt.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-2.5 text-center text-gray-500">{idx + 1}</td>
                    <td className="p-2.5 font-medium text-gray-800">{item.headName}</td>
                    <td className="p-2.5 text-gray-600">{item.term}</td>
                    <td className="p-2.5 text-gray-600">{item.period || "-"}</td>
                    <td className="p-2.5 text-right font-semibold text-gray-800">
                      ₹{Number(item.amount).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculations / Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div className="text-xs text-gray-500 max-w-xs space-y-1">
              {receipt.transactionId && (
                <p className="m-0">
                  <strong className="text-gray-700">Txn / Ref ID:</strong> {receipt.transactionId}
                </p>
              )}
              {receipt.remarks && (
                <p className="m-0">
                  <strong className="text-gray-700">Remarks:</strong> {receipt.remarks}
                </p>
              )}
              <p className="m-0 text-[11px] italic pt-1">
                * Note: Cheque payments are subject to realization.
              </p>
            </div>

            <div className="w-full sm:w-60 bg-gray-50 p-3 rounded border border-gray-200 text-xs space-y-1.5">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>₹{receipt.subTotal.toLocaleString("en-IN")}</span>
              </div>
              {receipt.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>- ₹{receipt.discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              {receipt.fine > 0 && (
                <div className="flex justify-between text-orange-600">
                  <span>Fine / Late Fee:</span>
                  <span>+ ₹{receipt.fine.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-primary pt-2 border-t border-gray-200">
                <span>Total Paid:</span>
                <span>₹{receipt.totalPaid.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-red-600 pt-1">
                <span>Balance Due:</span>
                <span>₹{receipt.balanceDue.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Signature Footer */}
          <div className="pt-6 border-t border-gray-200 flex justify-between items-end text-xs text-gray-500">
            <div>
              <p className="m-0">Cashier: <strong className="text-gray-700">{receipt.collectedBy || "Admin"}</strong></p>
              <p className="m-0 text-[10px] text-gray-400">Printed on {new Date().toLocaleString("en-IN")}</p>
            </div>
            <div className="text-center">
              <div className="w-36 border-b border-gray-400 mb-1"></div>
              <span className="font-semibold text-gray-700 text-[11px]">Authorized Signatory</span>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons (Hidden when printing) */}
        <div className="mt-6 flex flex-wrap justify-end gap-3 no-print">
          <Button variant="secondary" onClick={onClose} className="px-4">
            Close
          </Button>
          <Button
            variant="success"
            className="flex items-center gap-2 px-4"
            onClick={handleDownloadPDF}
          >
            <Icon name="fa-file-pdf-o" /> Download PDF
          </Button>
          <Button
            variant="primary"
            className="flex items-center gap-2 px-5"
            onClick={handlePrint}
          >
            <Icon name="fa-print" /> Print Receipt
          </Button>
        </div>
      </div>
    </Modal>
  );
};
