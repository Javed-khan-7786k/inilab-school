import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import type { FeeRecord } from "../../types";

interface FeeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  feeData: FeeRecord | null;
  onSave: (updatedRecord: FeeRecord) => void;
}

export const FeeEditModal: React.FC<FeeEditModalProps> = ({
  isOpen,
  onClose,
  feeData,
  onSave,
}) => {
  const [formData, setFormData] = useState<FeeRecord | null>(null);

  useEffect(() => {
    if (feeData) {
      // Deep copy to allow editing monthly details safely
      setFormData(JSON.parse(JSON.stringify(feeData)));
    }
  }, [feeData]);

  if (!formData) return null;

  const handleMonthlyPaidChange = (idx: number, value: string) => {
    const amount = Number(value);
    if (isNaN(amount) || amount < 0) return;

    const newFormData = { ...formData };
    const monthRecord = newFormData.monthlyDetails[idx];
    
    // Ensure paid amount does not exceed total amount for the month
    if (amount > monthRecord.amount) return;

    monthRecord.paid = amount;
    monthRecord.due = monthRecord.amount - amount;
    monthRecord.status =
      monthRecord.due === 0
        ? "Paid"
        : monthRecord.due === monthRecord.amount
        ? "Unpaid"
        : "Partial";

    // Recalculate totals
    let totalPaid = 0;
    let totalDue = 0;
    newFormData.monthlyDetails.forEach((m) => {
      totalPaid += m.paid;
      totalDue += m.due;
    });

    newFormData.totalPaid = totalPaid;
    newFormData.totalDue = totalDue;
    newFormData.status =
      totalDue === 0 ? "Paid" : totalDue === newFormData.totalFee ? "Unpaid" : "Partial";

    setFormData(newFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Fee Payment"
      maxWidthClass="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="p-5">
        <div className="mb-6 bg-gray-50 p-4 rounded border border-gray-200">
          <h3 className="font-semibold text-gray-700 text-sm mb-2">Student Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="block text-gray-500 text-xs">Name</span>
              <span className="font-medium">{formData.studentName}</span>
            </div>
            <div>
              <span className="block text-gray-500 text-xs">Roll No</span>
              <span className="font-medium">{formData.roll}</span>
            </div>
            <div>
              <span className="block text-gray-500 text-xs">Class</span>
              <span className="font-medium">{formData.className}</span>
            </div>
            <div>
              <span className="block text-gray-500 text-xs">Section</span>
              <span className="font-medium">{formData.sectionName}</span>
            </div>
          </div>
        </div>

        <h3 className="font-semibold text-gray-700 text-sm mb-3">Update Monthly Payments</h3>
        <div className="max-h-[300px] overflow-y-auto pr-2 border border-gray-200 rounded">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-gray-100 shadow-sm">
              <tr>
                <th className="p-2 font-semibold">Month</th>
                <th className="p-2 font-semibold">Total Amount</th>
                <th className="p-2 font-semibold">Paid Amount</th>
                <th className="p-2 font-semibold text-right">Due</th>
              </tr>
            </thead>
            <tbody>
              {formData.monthlyDetails.map((detail, idx) => (
                <tr key={idx} className="border-b border-gray-100 last:border-0">
                  <td className="p-2 font-medium">{detail.month}</td>
                  <td className="p-2">₹{detail.amount}</td>
                  <td className="p-2">
                    <Input
                      type="number"
                      value={detail.paid}
                      onChange={(e) => handleMonthlyPaidChange(idx, e.target.value)}
                      className="w-24 h-8 text-sm"
                      min={0}
                      max={detail.amount}
                    />
                  </td>
                  <td className="p-2 text-right text-red-500 font-medium">₹{detail.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-gray-100 p-3 rounded flex justify-end gap-6 text-sm">
          <div>
            <span className="text-gray-500 font-semibold mr-2">Total Fee:</span>
            <span className="font-bold">₹{formData.totalFee}</span>
          </div>
          <div>
            <span className="text-gray-500 font-semibold mr-2">Total Paid:</span>
            <span className="font-bold text-teal">₹{formData.totalPaid}</span>
          </div>
          <div>
            <span className="text-gray-500 font-semibold mr-2">Total Due:</span>
            <span className="font-bold text-red-500">₹{formData.totalDue}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
