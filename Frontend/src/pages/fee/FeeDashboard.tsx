import React, { useEffect, useState, useMemo } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { PageHeaderBar } from "../../components/common/PageHeaderBar";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../components/ui/Icon";
import { FeeEditModal } from "../../components/fee/FeeEditModal";
import { dataService } from "../../services/dataService";
import { useLanguage } from "../../context/LanguageContext";
import type { ClassItem, SectionItem, FeeRecord } from "../../types";

const FeeDashboard: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [classesList, setClassesList] = useState<ClassItem[]>([]);
  const [sectionsList, setSectionsList] = useState<SectionItem[]>([]);
  const [feesList, setFeesList] = useState<FeeRecord[]>([]);

  // Filters
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");

  // Modals state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null);

  useEffect(() => {
    const loadData = async () => {
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
    loadData();
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
      return matchClass && matchSec;
    });
  }, [feesList, selectedClass, selectedSection]);

  const handleView = (fee: FeeRecord) => {
    navigate(`/dashboard/fee/view/${fee.id}`);
  };

  const handleEdit = (fee: FeeRecord) => {
    setSelectedFee(fee);
    setEditModalOpen(true);
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
      `INR ${fee.totalDue}`
    ]);

    (doc as any).autoTable({
      startY: 30,
      head: [['Student Name', 'Roll No', 'Class', 'Total Fee', 'Paid', 'Due']],
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
        {/* Filter Card */}
        <div className="bg-white rounded-[3px] border border-[#e1e1e1] shadow-sm p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#eee]">
            <h2 className="text-[16px] font-semibold text-[#444] m-0">
              {t("Filter Fee Records")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-[13px] font-semibold text-[#444] mb-1.5">
                {t("Class")}
              </label>
              <Select
                value={selectedClass}
                onChange={handleClassChange}
                className="w-full"
              >
                <option value="">{t("All Classes")}</option>
                {classesList.map((c: any) => (
                  <option key={c.id || c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#444] mb-1.5">
                {t("Section")}
              </label>
              <Select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full"
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
            
            <div className="lg:col-span-2 flex justify-end">
              <Button
                type="button"
                variant="primary"
                onClick={() => {}}
                className="inline-flex items-center gap-2 cursor-pointer"
              >
                <Icon name="fa-search" /> {t("Search")}
              </Button>
            </div>
          </div>
        </div>

        {/* Fees Table Card */}
        <div className="bg-white rounded-[3px] border border-[#e1e1e1] shadow-sm p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#eee]">
            <h2 className="text-[16px] font-semibold text-[#444] m-0">
              {t("Student Fees List")}
            </h2>
            <Button
              variant="success"
              className="flex items-center gap-2"
              onClick={handleExportAllPDF}
              disabled={filteredFees.length === 0}
            >
              <Icon name="fa-file-pdf-o" /> {t("Export PDF")}
            </Button>
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
                    <tr key={fee.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          {fee.photo && (
                            <img src={fee.photo} alt={fee.studentName} className="w-8 h-8 rounded-full object-cover" />
                          )}
                          <span className="font-medium text-gray-800">{fee.studentName}</span>
                        </div>
                      </td>
                      <td className="p-3">{fee.roll}</td>
                      <td className="p-3">{fee.className} ({fee.sectionName})</td>
                      <td className="p-3 text-right">₹{fee.totalFee}</td>
                      <td className="p-3 text-right text-teal font-medium">₹{fee.totalPaid}</td>
                      <td className="p-3 text-right text-red-500 font-medium">₹{fee.totalDue}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
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
                          <button
                            onClick={() => handleView(fee)}
                            className="w-7 h-7 rounded bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center transition-colors"
                            title="View Details"
                          >
                            <Icon name="fa-eye" />
                          </button>
                          <button
                            onClick={() => handleEdit(fee)}
                            className="w-7 h-7 rounded bg-orange-100 text-orange-600 hover:bg-orange-200 flex items-center justify-center transition-colors"
                            title="Edit Payments"
                          >
                            <Icon name="fa-edit" />
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
