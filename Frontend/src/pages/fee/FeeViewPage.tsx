import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { PageHeaderBar } from "../../components/common/PageHeaderBar";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { FeeEditModal } from "../../components/fee/FeeEditModal";
import { dataService } from "../../services/dataService";
import type { FeeRecord } from "../../types";

const FeeViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [feeData, setFeeData] = useState<FeeRecord | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchFee = async () => {
      try {
        if (id) {
          const fee = await dataService.getFeeById(id);
          setFeeData(fee);
        }
      } catch (err) {
        console.error("Failed to load fee", err);
      }
    };
    fetchFee();
  }, [id]);

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

  return (
    <DashboardLayout>
      <PageHeaderBar
        titleKey="Fee Details"
        iconName="fa-eye"
        breadcrumbLabel="Fee Management / View"
      />

      <div className="p-5 bg-white m-5 rounded border border-[#e1e1e1]" id="printable-fee-details">
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

        <div className="flex flex-col sm:flex-row justify-between items-start mb-6 border-b border-[#eee] pb-4">
          <div className="flex gap-4">
            {feeData.photo && (
              <img
                src={feeData.photo}
                alt={feeData.studentName}
                className="w-16 h-16 rounded border border-gray-200 object-cover"
              />
            )}
            <div>
              <h2 className="text-lg font-bold text-gray-800 m-0">
                {feeData.studentName}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Class: {feeData.className} | Section: {feeData.sectionName} | Roll No: {feeData.roll}
              </p>
            </div>
          </div>
          
          <div className="text-right mt-4 sm:mt-0">
            <div className="text-sm">
              <span className="text-gray-500 font-semibold">Total Fee: </span>
              <span className="font-bold">₹{feeData.totalFee}</span>
            </div>
            <div className="text-sm mt-1">
              <span className="text-gray-500 font-semibold">Paid: </span>
              <span className="font-bold text-teal">₹{feeData.totalPaid}</span>
            </div>
            <div className="text-sm mt-1">
              <span className="text-gray-500 font-semibold">Due: </span>
              <span className="font-bold text-red-500">₹{feeData.totalDue}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="p-2 border border-gray-300 font-semibold">Month</th>
                <th className="p-2 border border-gray-300 font-semibold text-right">Amount</th>
                <th className="p-2 border border-gray-300 font-semibold text-right">Paid</th>
                <th className="p-2 border border-gray-300 font-semibold text-right">Due</th>
                <th className="p-2 border border-gray-300 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {feeData.monthlyDetails.map((detail, idx) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="p-2 border border-gray-300 font-medium">{detail.month}</td>
                  <td className="p-2 border border-gray-300 text-right">₹{detail.amount}</td>
                  <td className="p-2 border border-gray-300 text-right text-teal font-medium">₹{detail.paid}</td>
                  <td className="p-2 border border-gray-300 text-right text-red-500 font-medium">₹{detail.due}</td>
                  <td className="p-2 border border-gray-300 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
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

        <div className="mt-6 flex justify-end gap-3 print:hidden">
          <Button variant="secondary" onClick={() => navigate("/dashboard/fee")}>
            Back
          </Button>
          <Button
            variant="warning"
            className="flex items-center gap-2"
            onClick={() => setEditModalOpen(true)}
          >
            <Icon name="fa-edit" /> Edit
          </Button>
          <Button
            variant="success"
            className="flex items-center gap-2"
            onClick={handleExportPDF}
          >
            <Icon name="fa-file-pdf-o" /> Export PDF
          </Button>
          <Button
            variant="success"
            className="flex items-center gap-2"
            onClick={handleExportCSV}
          >
            <Icon name="fa-file-excel-o" /> CSV
          </Button>
          <Button
            variant="primary"
            className="flex items-center gap-2"
            onClick={handlePrint}
          >
            <Icon name="fa-print" /> Print
          </Button>
        </div>
      </div>

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
