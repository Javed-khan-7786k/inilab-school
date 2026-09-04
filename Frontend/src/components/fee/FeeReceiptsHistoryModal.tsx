import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Icon } from "../ui/Icon";
import { dataService } from "../../services/dataService";
import type { FeeReceipt } from "../../types";

interface FeeReceiptsHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReceipt: (receipt: FeeReceipt) => void;
}

export const FeeReceiptsHistoryModal: React.FC<FeeReceiptsHistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectReceipt,
}) => {
  const [receipts, setReceipts] = useState<FeeReceipt[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReceipts = async (searchTerm = "") => {
    setLoading(true);
    try {
      const data = await dataService.getFeeReceipts({ search: searchTerm });
      setReceipts(data || []);
    } catch (err) {
      console.error("Failed to load fee receipts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchReceipts(search);
    }
  }, [isOpen]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    fetchReceipts(val);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Fee Receipts & Payment History"
      maxWidthClass="max-w-5xl"
    >
      <div className="p-6 max-h-[85vh] overflow-y-auto space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="relative w-full sm:w-80">
            <Input
              type="text"
              placeholder="Search by Receipt No, Student Name, Roll..."
              value={search}
              onChange={handleSearchChange}
              className="w-full text-xs pl-8 h-9"
            />
            <span className="absolute left-2.5 top-2.5 text-gray-400 text-xs">
              <Icon name="fa-search" />
            </span>
          </div>

          <div className="text-xs text-gray-500">
            Showing <strong>{receipts.length}</strong> receipt(s)
          </div>
        </div>

        {/* Table */}
        <div className="border border-gray-200 rounded-lg overflow-x-auto bg-white shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-gray-100 border-b border-gray-200 text-gray-700 font-semibold">
              <tr>
                <th className="p-3">Receipt No</th>
                <th className="p-3">Date</th>
                <th className="p-3">Student Name</th>
                <th className="p-3">Roll No</th>
                <th className="p-3">Class</th>
                <th className="p-3 text-right">Amount Paid</th>
                <th className="p-3 text-center">Payment Mode</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    <Icon name="fa-spinner" className="fa-spin mr-2 text-primary" /> Loading receipts...
                  </td>
                </tr>
              ) : receipts.length > 0 ? (
                receipts.map(rec => (
                  <tr key={rec.id || rec.receiptNo} className="hover:bg-blue-50/40 transition-colors">
                    <td className="p-3 font-bold text-primary">{rec.receiptNo}</td>
                    <td className="p-3 text-gray-600">
                      {new Date(rec.paymentDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-3 font-semibold text-gray-900">{rec.studentName}</td>
                    <td className="p-3 font-medium text-gray-700">#{rec.roll}</td>
                    <td className="p-3 text-gray-600">
                      {rec.className} ({rec.sectionName})
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
                        onClick={() => {
                          onSelectReceipt(rec);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs py-1 px-2.5"
                      >
                        <Icon name="fa-print" /> View / Print
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500 italic">
                    No fee receipts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
