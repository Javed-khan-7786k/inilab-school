import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { PageHeaderBar } from "../../components/common/PageHeaderBar";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Icon } from "../../components/ui/Icon";
import { FeeReceiptModal } from "../../components/fee/FeeReceiptModal";
import { dataService } from "../../services/dataService";
import type { FeeReceipt, ClassItem } from "../../types";

const FeeReceiptsPage: React.FC = () => {
  const navigate = useNavigate();

  const [receipts, setReceipts] = useState<FeeReceipt[]>([]);
  const [classesList, setClassesList] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedMode, setSelectedMode] = useState("");

  // Modal
  const [selectedReceipt, setSelectedReceipt] = useState<FeeReceipt | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [receiptsData, classesData] = await Promise.all([
        dataService.getFeeReceipts().catch(() => []),
        dataService.getClasses().catch(() => []),
      ]);
      setReceipts(receiptsData || []);
      setClassesList(classesData || []);
    } catch (err) {
      console.error("Failed to load receipts data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredReceipts = useMemo(() => {
    return receipts.filter(rec => {
      const cleanSearch = search.trim().toLowerCase();
      const matchSearch =
        !cleanSearch ||
        rec.receiptNo?.toLowerCase().includes(cleanSearch) ||
        rec.studentName?.toLowerCase().includes(cleanSearch) ||
        rec.roll?.toLowerCase().includes(cleanSearch);

      const matchClass = !selectedClass || rec.className?.toLowerCase() === selectedClass.toLowerCase();
      const matchMode = !selectedMode || rec.paymentMode?.toLowerCase() === selectedMode.toLowerCase();

      return matchSearch && matchClass && matchMode;
    });
  }, [receipts, search, selectedClass, selectedMode]);

  const handleOpenReceiptModal = (rec: FeeReceipt) => {
    setSelectedReceipt(rec);
    setReceiptModalOpen(true);
  };

  return (
    <DashboardLayout>
      <PageHeaderBar
        titleKey="Fee Receipts History"
        iconName="fa-history"
        breadcrumbLabel="Fee Management / Receipts History"
      />

      <div className="p-6 bg-bodyBg space-y-6">
        {/* Top Actions & Stats Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded border border-[#e1e1e1] shadow-sm">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate("/dashboard/fee")}
              className="text-xs flex items-center gap-1.5"
            >
              <Icon name="fa-arrow-left" /> Fee Dashboard
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate("/dashboard/fee/collect")}
              className="text-xs flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white border-none shadow-sm"
            >
              <Icon name="fa-plus-circle" /> Collect Fee & Generate Receipt
            </Button>
          </div>

          <div className="text-xs text-gray-500 font-medium">
            Total Receipts Issued: <strong className="text-gray-800 text-sm">{receipts.length}</strong>
          </div>
        </div>

        {/* Filter Card */}
        <div className="bg-white p-5 rounded border border-[#e1e1e1] shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#eee]">
            <h2 className="text-sm font-bold text-gray-800 m-0 flex items-center gap-2">
              <Icon name="fa-search" className="text-primary" /> Search & Filter Receipts
            </h2>
            {(search || selectedClass || selectedMode) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedClass("");
                  setSelectedMode("");
                }}
                className="text-xs text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Icon name="fa-times" /> Reset Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Search by Receipt No, Student Name, or Roll No
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="e.g. REC-2026-00001, Alice, 101..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full text-xs pl-9 h-9"
                />
                <span className="absolute left-3 top-2.5 text-gray-400 text-xs">
                  <Icon name="fa-search" />
                </span>
              </div>
            </div>

            {/* Class Filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Class
              </label>
              <Select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="w-full text-xs h-9"
              >
                <option value="">All Classes</option>
                {classesList.map((c: any) => (
                  <option key={c.id || c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Payment Mode Filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Payment Mode
              </label>
              <Select
                value={selectedMode}
                onChange={e => setSelectedMode(e.target.value)}
                className="w-full text-xs h-9"
              >
                <option value="">All Payment Modes</option>
                <option value="Cash">Cash</option>
                <option value="UPI / Online">UPI / Online</option>
                <option value="Cheque">Cheque</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Card">Card</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Receipts Table Card (No modal overlap, full-width responsive table!) */}
        <div className="bg-white rounded border border-[#e1e1e1] shadow-sm p-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 mb-4 border-b border-[#eee]">
            <div>
              <h2 className="text-base font-bold text-gray-800 m-0 flex items-center gap-2">
                <Icon name="fa-list-alt" className="text-primary" /> Issued Fee Receipts Log
              </h2>
              <p className="text-xs text-gray-500 m-0 mt-0.5">
                Showing <strong>{filteredReceipts.length}</strong> of <strong>{receipts.length}</strong> receipts
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-gray-100 border-b border-gray-200 text-gray-700 font-semibold">
                <tr>
                  <th className="p-3">Receipt No</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Roll No</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Fee Categories Collected</th>
                  <th className="p-3 text-right">Amount Paid</th>
                  <th className="p-3 text-center">Payment Mode</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="p-10 text-center text-gray-500">
                      <Icon name="fa-spinner" className="fa-spin mr-2 text-primary text-base" /> Loading receipts history...
                    </td>
                  </tr>
                ) : filteredReceipts.length > 0 ? (
                  filteredReceipts.map(rec => (
                    <tr key={rec.id || rec.receiptNo} className="hover:bg-blue-50/30 transition-colors">
                      <td className="p-3 font-bold text-primary whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                          {rec.receiptNo}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600 whitespace-nowrap">
                        {new Date(rec.paymentDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-3 font-bold text-gray-900 whitespace-nowrap">
                        {rec.studentName}
                      </td>
                      <td className="p-3 font-medium text-gray-700 whitespace-nowrap">
                        #{rec.roll}
                      </td>
                      <td className="p-3 text-gray-700 whitespace-nowrap">
                        {rec.className} ({rec.sectionName})
                      </td>
                      <td className="p-3 text-gray-600 max-w-xs truncate">
                        {rec.items?.map(it => it.headName + (it.period ? ` (${it.period})` : "")).join(", ") || "-"}
                      </td>
                      <td className="p-3 text-right font-extrabold text-teal whitespace-nowrap text-sm">
                        ₹{rec.totalPaid?.toLocaleString("en-IN")}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">
                          {rec.paymentMode}
                        </span>
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleOpenReceiptModal(rec)}
                          className="inline-flex items-center gap-1.5 text-xs py-1.5 px-3 bg-primary hover:bg-primary-dark cursor-pointer shadow-sm"
                        >
                          <Icon name="fa-print" /> View / Print Receipt
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="p-10 text-center text-gray-500 italic">
                      No fee receipts found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Official Printable Fee Receipt Modal */}
      <FeeReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        receipt={selectedReceipt}
      />
    </DashboardLayout>
  );
};

export default FeeReceiptsPage;
