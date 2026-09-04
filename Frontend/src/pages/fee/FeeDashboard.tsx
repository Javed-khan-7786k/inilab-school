import React, { useEffect, useState, useMemo } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { PageHeaderBar } from "../../components/common/PageHeaderBar";
import { Select } from "../../components/ui/Select";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../components/ui/Icon";
import { FeeEditModal } from "../../components/fee/FeeEditModal";
import { FeeCollectModal } from "../../components/fee/FeeCollectModal";
import { FeeReceiptModal } from "../../components/fee/FeeReceiptModal";
import { FeeReceiptsHistoryModal } from "../../components/fee/FeeReceiptsHistoryModal";
import { dataService } from "../../services/dataService";
import { useLanguage } from "../../context/LanguageContext";
import type { ClassItem, SectionItem, FeeRecord, FeeReceipt } from "../../types";

const FeeDashboard: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [classesList, setClassesList] = useState<ClassItem[]>([]);
  const [sectionsList, setSectionsList] = useState<SectionItem[]>([]);
  const [feesList, setFeesList] = useState<FeeRecord[]>([]);

  // Search & Filters
  const [studentSearchTerm, setStudentSearchTerm] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");

  // Modals state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null);

  // New Collection & Receipt Modals
  const [collectModalOpen, setCollectModalOpen] = useState(false);
  const [studentForCollection, setStudentForCollection] = useState<FeeRecord | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<FeeReceipt | null>(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  const loadAllFees = async () => {
    try {
      const [classes, sections, fees] = await Promise.all([
        dataService.getClasses().catch(() => []),
        dataService.getSections().catch(() => []),
        dataService.getFees().catch(() => []),
      ]);
      
      setClassesList(classes || []);
      setSectionsList(sections || []);
      setFeesList(fees || []);
    } catch (err) {
      console.error("Failed to load fee dashboard data:", err);
    }
  };

  useEffect(() => {
    loadAllFees();
  }, []);

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(e.target.value);
    setSelectedSection("");
  };

  const filteredSections = selectedClass
    ? sectionsList.filter((s) => s.className?.toLowerCase() === selectedClass.toLowerCase())
    : sectionsList;

  const filteredFees = useMemo(() => {
    return feesList.filter((fee) => {
      const matchClass = !selectedClass || fee.className.toLowerCase() === selectedClass.toLowerCase();
      const matchSec = !selectedSection || fee.sectionName.toLowerCase() === selectedSection.toLowerCase();
      
      const cleanSearch = studentSearchTerm.trim().toLowerCase();
      const matchSearch =
        !cleanSearch ||
        fee.studentName?.toLowerCase().includes(cleanSearch) ||
        fee.roll?.toLowerCase().includes(cleanSearch) ||
        String(fee.studentId || "").toLowerCase().includes(cleanSearch);

      return matchClass && matchSec && matchSearch;
    });
  }, [feesList, selectedClass, selectedSection, studentSearchTerm]);

  const handleView = (fee: FeeRecord) => {
    navigate(`/dashboard/fee/view/${fee.id}`);
  };

  const handleEdit = (fee: FeeRecord) => {
    setSelectedFee(fee);
    setEditModalOpen(true);
  };

  const handleOpenCollectForStudent = (fee: FeeRecord) => {
    navigate(`/dashboard/fee/collect?studentId=${fee.studentId || fee.id}`);
  };

  const handleOpenNewCollect = () => {
    navigate("/dashboard/fee/collect");
  };

  const handleOpenReceiptsHistory = () => {
    navigate("/dashboard/fee/receipts");
  };

  const handleReceiptGenerated = (receipt: FeeReceipt) => {
    setCurrentReceipt(receipt);
    setReceiptModalOpen(true);
    // Reload fees list so updated paid & due amounts show up immediately
    loadAllFees();
  };

  const handleSaveFee = async (updatedFee: FeeRecord) => {
    try {
      const saved = await dataService.updateFee(updatedFee.id, updatedFee);
      setFeesList((prev) =>
        prev.map((f) => (f.id === saved.id ? saved : f))
      );
      setEditModalOpen(false);
    } catch (err) {
      console.error("Failed to update fee", err);
    }
  };

  const handleExportAllPDF = () => {
    if (filteredFees.length === 0) return;
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text("Student Fees List", 14, 20);

    const tableData = filteredFees.map(fee => [
      fee.studentName,
      fee.roll,
      `${fee.className} (${fee.sectionName})`,
      `INR ${fee.totalFee}`,
      `INR ${fee.totalPaid}`,
      `INR ${fee.totalDue}`,
      fee.status
    ]);

    (doc as any).autoTable({
      startY: 30,
      head: [['Student Name', 'Roll No', 'Class', 'Total Fee', 'Paid', 'Due', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save("Student_Fees_List.pdf");
  };

  return (
    <DashboardLayout>
      <PageHeaderBar
        titleKey="Fee Dashboard"
        iconName="fa-money"
        breadcrumbLabel="Fee Management"
      />

      <div className="p-[20px] bg-bodyBg space-y-6">
        {/* Filter & Quick Student ID Search Card */}
        <div className="bg-white rounded-[3px] border border-[#e1e1e1] shadow-sm p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-[#eee] gap-3">
            <h2 className="text-[16px] font-semibold text-[#444] m-0 flex items-center gap-2">
              <Icon name="fa-filter" className="text-primary" /> {t("Filter & Student ID Search")}
            </h2>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                variant="primary"
                className="flex items-center gap-2 text-xs font-semibold py-2 px-3.5 bg-green-600 hover:bg-green-700 text-white border-none shadow-sm cursor-pointer"
                onClick={handleOpenNewCollect}
              >
                <Icon name="fa-plus-circle" /> {t("Collect Fee / Receipt")}
              </Button>

              <Button
                variant="outline"
                className="flex items-center gap-2 text-xs font-semibold py-2 px-3.5 cursor-pointer"
                onClick={handleOpenReceiptsHistory}
              >
                <Icon name="fa-history" /> {t("Receipts History")}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Student ID / Roll / Name Search */}
            <div className="lg:col-span-2">
              <label className="block text-[13px] font-semibold text-[#444] mb-1.5">
                <Icon name="fa-id-card" className="mr-1 text-primary" /> {t("Search by Student ID / Roll No / Name")}
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter Student ID, Roll No (e.g. 101), or Name..."
                  value={studentSearchTerm}
                  onChange={(e) => setStudentSearchTerm(e.target.value)}
                  className="w-full text-xs pl-9 pr-8 h-9"
                />
                <span className="absolute left-3 top-2.5 text-gray-400 text-xs">
                  <Icon name="fa-search" />
                </span>
                {studentSearchTerm && (
                  <button
                    type="button"
                    onClick={() => setStudentSearchTerm("")}
                    className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 text-xs"
                    title="Clear search"
                  >
                    <Icon name="fa-times" />
                  </button>
                )}
              </div>
            </div>

            {/* Class Dropdown */}
            <div>
              <label className="block text-[13px] font-semibold text-[#444] mb-1.5">
                {t("Class")}
              </label>
              <Select
                value={selectedClass}
                onChange={handleClassChange}
                className="w-full text-xs h-9"
              >
                <option value="">{t("All Classes")}</option>
                {classesList.map((c: any) => (
                  <option key={c.id || c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Section Dropdown */}
            <div>
              <label className="block text-[13px] font-semibold text-[#444] mb-1.5">
                {t("Section")}
              </label>
              <Select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full text-xs h-9"
                disabled={!selectedClass}
              >
                <option value="">{t("All Sections")}</option>
                {filteredSections.map((s: any) => (
                  <option key={s.id || s._id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* Fees Table Card */}
        <div className="bg-white rounded-[3px] border border-[#e1e1e1] shadow-sm p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-[#eee] gap-3">
            <div>
              <h2 className="text-[16px] font-semibold text-[#444] m-0">
                {t("Student Fees List")}
              </h2>
              <p className="text-xs text-gray-500 m-0 mt-0.5">
                Showing <strong>{filteredFees.length}</strong> of <strong>{feesList.length}</strong> students
                {studentSearchTerm && ` matching "${studentSearchTerm}"`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="success"
                className="flex items-center gap-2 text-xs py-2 px-3"
                onClick={handleExportAllPDF}
                disabled={filteredFees.length === 0}
              >
                <Icon name="fa-file-pdf-o" /> {t("Export PDF")}
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="p-3 font-semibold text-gray-700">Student Name</th>
                  <th className="p-3 font-semibold text-gray-700">Roll No</th>
                  <th className="p-3 font-semibold text-gray-700">Class</th>
                  <th className="p-3 font-semibold text-gray-700 text-right">Total Fee</th>
                  <th className="p-3 font-semibold text-gray-700 text-right">Paid</th>
                  <th className="p-3 font-semibold text-gray-700 text-right">Due</th>
                  <th className="p-3 font-semibold text-gray-700 text-center">Status</th>
                  <th className="p-3 font-semibold text-gray-700 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredFees.length > 0 ? (
                  filteredFees.map((fee) => (
                    <tr key={fee.id} className="border-b border-gray-100 hover:bg-blue-50/20 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          {fee.photo ? (
                            <img src={fee.photo} alt={fee.studentName} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-xs">
                              {fee.studentName?.charAt(0) || "S"}
                            </div>
                          )}
                          <div>
                            <span className="font-semibold text-gray-800 block text-xs sm:text-sm">{fee.studentName}</span>
                            <span className="text-[11px] text-gray-400">ID: {String(fee.studentId || fee.id).slice(-6)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-medium text-gray-700">#{fee.roll}</td>
                      <td className="p-3 text-gray-700">{fee.className} ({fee.sectionName})</td>
                      <td className="p-3 text-right font-medium text-gray-800">₹{fee.totalFee.toLocaleString("en-IN")}</td>
                      <td className="p-3 text-right text-teal font-semibold">₹{fee.totalPaid.toLocaleString("en-IN")}</td>
                      <td className="p-3 text-right text-red-600 font-bold">₹{fee.totalDue.toLocaleString("en-IN")}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
                            fee.status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : fee.status === "Partial"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {fee.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Collect Fee & Generate Receipt Quick Button */}
                          <button
                            onClick={() => handleOpenCollectForStudent(fee)}
                            className="px-3 py-1.5 rounded bg-green-600 hover:bg-green-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                            title="Collect Fee & Generate Receipt"
                          >
                            <Icon name="fa-file-text-o" /> Collect
                          </button>
                          {/* View Details */}
                          <button
                            onClick={() => handleView(fee)}
                            className="px-3 py-1.5 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="View Full Fee Details"
                          >
                            <Icon name="fa-eye" /> View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500 italic">
                      {t("No fee records found for the selected criteria.")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Collect Fee & Generate Receipt Modal */}
      <FeeCollectModal
        isOpen={collectModalOpen}
        onClose={() => setCollectModalOpen(false)}
        initialStudent={studentForCollection}
        onReceiptGenerated={handleReceiptGenerated}
      />

      {/* Official Printable Fee Receipt Modal */}
      <FeeReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        receipt={currentReceipt}
      />

      {/* Receipts History & Re-print Modal */}
      <FeeReceiptsHistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        onSelectReceipt={(receipt) => {
          setCurrentReceipt(receipt);
          setReceiptModalOpen(true);
        }}
      />

      {/* Monthly Edit Modal (Preserved for manual adjustments) */}
      <FeeEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        feeData={selectedFee}
        onSave={handleSaveFee}
      />
    </DashboardLayout>
  );
};

export default FeeDashboard;
