import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { PageHeaderBar } from "../../components/common/PageHeaderBar";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { FeeEditModal } from "../../components/fee/FeeEditModal";
import { FeeCollectModal } from "../../components/fee/FeeCollectModal";
import { FeeReceiptModal } from "../../components/fee/FeeReceiptModal";
import { dataService } from "../../services/dataService";
import type { FeeRecord, FeeReceipt } from "../../types";

const FeeViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [feeData, setFeeData] = useState<FeeRecord | null>(null);
  const [studentReceipts, setStudentReceipts] = useState<FeeReceipt[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [collectModalOpen, setCollectModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<FeeReceipt | null>(null);

  const fetchFeeDetails = async () => {
    try {
      if (id) {
        setLoading(true);
        const fee = await dataService.getFeeById(id);
        setFeeData(fee);

        // Fetch past receipts for this student
        if (fee && fee.studentId) {
          const receipts = await dataService.getFeeReceipts({ studentId: String(fee.studentId) });
          setStudentReceipts(receipts || []);
        }
      }
    } catch (err) {
      console.error("Failed to load fee details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeDetails();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-12 text-center text-gray-500">
          <Icon name="fa-spinner" className="fa-spin mr-2 text-primary" /> Loading student fee profile...
        </div>
      </DashboardLayout>
    );
  }

  if (!feeData) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-gray-500">
          Fee record not found.
          <div className="mt-4">
            <Button variant="secondary" onClick={() => navigate("/dashboard/fee")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csv = "Month,Amount,Paid,Due,Status\n";
    feeData.monthlyDetails.forEach((m) => {
      csv += `${m.month},${m.amount},${m.paid},${m.due},${m.status}\n`;
    });
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `${feeData.studentName}_FeeDetails.csv`);
    a.click();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text(`Fee Details - ${feeData.studentName}`, 14, 20);
    
    doc.setFontSize(11);
    doc.text(`Roll No: ${feeData.roll} | Class: ${feeData.className} | Section: ${feeData.sectionName}`, 14, 30);
    doc.text(`Total Fee: INR ${feeData.totalFee} | Paid: INR ${feeData.totalPaid} | Due: INR ${feeData.totalDue}`, 14, 38);

    const tableData = feeData.monthlyDetails.map(m => [
      m.month, 
      `INR ${m.amount}`, 
      `INR ${m.paid}`, 
      `INR ${m.due}`, 
      m.status
    ]);

    (doc as any).autoTable({
      startY: 45,
      head: [['Month', 'Amount', 'Paid', 'Due', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save(`${feeData.studentName}_FeeDetails.pdf`);
  };

  const handleSaveFee = async (updatedFee: FeeRecord) => {
    try {
      const saved = await dataService.updateFee(updatedFee.id, updatedFee);
      setFeeData(saved);
      setEditModalOpen(false);
    } catch (err) {
      console.error("Failed to update fee", err);
    }
  };

  const handleReceiptGenerated = (receipt: FeeReceipt) => {
    setCurrentReceipt(receipt);
    setReceiptModalOpen(true);
    // Refresh page data
    fetchFeeDetails();
  };

  const handleViewPastReceipt = (receipt: FeeReceipt) => {
    setCurrentReceipt(receipt);
    setReceiptModalOpen(true);
  };

  return (
    <DashboardLayout>
      <PageHeaderBar
        titleKey="Fee Details"
        iconName="fa-eye"
        breadcrumbLabel="Fee Management / View"
      />

      <div className="p-5 bg-white m-5 rounded border border-[#e1e1e1] space-y-6" id="printable-fee-details">
        {/* Print Styles */}
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-fee-details, #printable-fee-details * {
              visibility: visible;
            }
            #printable-fee-details {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 20px;
            }
            .print\\:hidden {
              display: none !important;
            }
          }
        `}</style>

        {/* Top Header Card: Profile + Financial Summary + Main Actions */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-[#eee]">
          <div className="flex items-center gap-4">
            {feeData.photo ? (
              <img
                src={feeData.photo}
                alt={feeData.studentName}
                className="w-16 h-16 rounded-full border-2 border-primary/20 object-cover shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xl">
                {feeData.studentName?.charAt(0) || "S"}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-800 m-0">
                  {feeData.studentName}
                </h2>
                <span
                  className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                    feeData.status === "Paid"
                      ? "bg-green-100 text-green-700"
                      : feeData.status === "Partial"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {feeData.status}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1 m-0">
                Roll No: <strong>#{feeData.roll}</strong> | Class: <strong>{feeData.className}</strong> ({feeData.sectionName})
                {feeData.fatherName && ` | Father: ${feeData.fatherName}`}
              </p>
            </div>
          </div>
          
          {/* Financial Badges & Collect Action */}
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
            <div className="flex items-center gap-3 text-xs bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              <div>
                <span className="text-gray-500 block">Total Fee</span>
                <span className="font-bold text-gray-800 text-sm">₹{feeData.totalFee.toLocaleString("en-IN")}</span>
              </div>
              <div className="border-l border-gray-200 pl-3">
                <span className="text-gray-500 block">Total Paid</span>
                <span className="font-bold text-teal text-sm">₹{feeData.totalPaid.toLocaleString("en-IN")}</span>
              </div>
              <div className="border-l border-gray-200 pl-3">
                <span className="text-gray-500 block">Balance Due</span>
                <span className="font-bold text-red-600 text-sm">₹{feeData.totalDue.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Prominent Collect Fee & Generate Receipt Button */}
            <Button
              variant="primary"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-2 px-4 py-2 text-xs shadow-sm border-none cursor-pointer print:hidden"
              onClick={() => navigate(`/dashboard/fee/collect?studentId=${feeData.studentId || feeData.id}`)}
            >
              <Icon name="fa-file-text-o" /> Collect Fee / Receipt
            </Button>
          </div>
        </div>

        {/* Section 1: Monthly Breakdown */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-gray-800 m-0 flex items-center gap-2">
              <Icon name="fa-calendar" className="text-primary" /> Monthly Fee Breakdown
            </h3>
            <span className="text-xs text-gray-500">12 Months Academic Breakdown</span>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                <tr>
                  <th className="p-3">Month</th>
                  <th className="p-3 text-right">Tuition Amount</th>
                  <th className="p-3 text-right">Paid</th>
                  <th className="p-3 text-right">Due</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {feeData.monthlyDetails.map((detail, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/80">
                    <td className="p-3 font-medium text-gray-800">{detail.month}</td>
                    <td className="p-3 text-right">₹{detail.amount.toLocaleString("en-IN")}</td>
                    <td className="p-3 text-right text-teal font-semibold">₹{detail.paid.toLocaleString("en-IN")}</td>
                    <td className="p-3 text-right text-red-600 font-semibold">₹{detail.due.toLocaleString("en-IN")}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded ${
                          detail.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : detail.status === "Partial"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {detail.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Issued Receipts & Payment History */}
        <div className="pt-2">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-gray-800 m-0 flex items-center gap-2">
              <Icon name="fa-history" className="text-primary" /> Issued Receipts & Payment History
            </h3>
            <span className="text-xs text-gray-500">
              {studentReceipts.length} receipt(s) issued
            </span>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                <tr>
                  <th className="p-3">Receipt No</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Fee Heads Collected</th>
                  <th className="p-3 text-right">Paid Amount</th>
                  <th className="p-3 text-center">Payment Mode</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {studentReceipts.length > 0 ? (
                  studentReceipts.map((rec) => (
                    <tr key={rec.id || rec.receiptNo} className="hover:bg-blue-50/30">
                      <td className="p-3 font-bold text-primary">{rec.receiptNo}</td>
                      <td className="p-3 text-gray-600">
                        {new Date(rec.paymentDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-3 text-gray-700">
                        {rec.items.map((it) => it.headName + (it.period ? ` (${it.period})` : "")).join(", ")}
                      </td>
                      <td className="p-3 text-right font-bold text-teal">
                        ₹{rec.totalPaid.toLocaleString("en-IN")}
                      </td>
                      <td className="p-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium">
                          {rec.paymentMode}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleViewPastReceipt(rec)}
                          className="inline-flex items-center gap-1.5 text-xs py-1 px-2.5"
                        >
                          <Icon name="fa-print" /> View / Print Receipt
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500 italic">
                      No receipts generated for this student yet. Click "Collect Fee / Receipt" to collect payment and generate an official receipt.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="pt-4 flex flex-wrap justify-between items-center gap-3 border-t border-gray-200 print:hidden">
          <Button variant="secondary" onClick={() => navigate("/dashboard/fee")} className="text-xs">
            <Icon name="fa-arrow-left" className="mr-1" /> Back to Fee Dashboard
          </Button>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-1.5 text-xs py-2"
              onClick={() => navigate("/dashboard/fee/receipts")}
              title="View all receipts history"
            >
              <Icon name="fa-history" /> Receipts History
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-1.5 text-xs py-2"
              onClick={() => setEditModalOpen(true)}
              title="Manual monthly edit"
            >
              <Icon name="fa-pencil" /> Manual Edit
            </Button>
            <Button
              variant="success"
              className="flex items-center gap-1.5 text-xs py-2"
              onClick={handleExportPDF}
            >
              <Icon name="fa-file-pdf-o" /> Export PDF
            </Button>
            <Button
              variant="success"
              className="flex items-center gap-1.5 text-xs py-2"
              onClick={handleExportCSV}
            >
              <Icon name="fa-file-excel-o" /> CSV
            </Button>
            <Button
              variant="primary"
              className="flex items-center gap-1.5 text-xs py-2"
              onClick={handlePrint}
            >
              <Icon name="fa-print" /> Print Page
            </Button>
          </div>
        </div>
      </div>

      {/* Collect Fee & Generate Receipt Modal */}
      <FeeCollectModal
        isOpen={collectModalOpen}
        onClose={() => setCollectModalOpen(false)}
        initialStudent={feeData}
        onReceiptGenerated={handleReceiptGenerated}
      />

      {/* Official Printable Fee Receipt Modal */}
      <FeeReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        receipt={currentReceipt}
      />

      {/* Manual Monthly Edit Modal */}
      <FeeEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        feeData={feeData}
        onSave={handleSaveFee}
      />
    </DashboardLayout>
  );
};

export default FeeViewPage;
