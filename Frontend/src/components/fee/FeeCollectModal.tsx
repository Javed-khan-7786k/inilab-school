import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Icon } from "../ui/Icon";
import { dataService } from "../../services/dataService";
import type { StudentFeeSearchResult, FeeReceipt, FeeRecord } from "../../types";

interface FeeCollectModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStudent?: StudentFeeSearchResult | FeeRecord | null;
  onReceiptGenerated: (receipt: FeeReceipt) => void;
}

interface FeeItemRow {
  id: string;
  headName: string;
  term: string;
  period: string;
  amount: number;
  selected: boolean;
  isTuition?: boolean;
}

const MONTHS_LIST = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const FeeCollectModal: React.FC<FeeCollectModalProps> = ({
  isOpen,
  onClose,
  initialStudent,
  onReceiptGenerated,
}) => {
  // Student Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StudentFeeSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentFeeSearchResult | null>(null);

  // Fee items to collect
  const [feeItems, setFeeItems] = useState<FeeItemRow[]>([]);
  const [selectedTuitionMonths, setSelectedTuitionMonths] = useState<string[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [fine, setFine] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<string>("Cash");
  const [transactionId, setTransactionId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // When modal opens or initial student changes
  useEffect(() => {
    if (isOpen) {
      if (initialStudent) {
        // Convert FeeRecord or StudentFeeSearchResult to selectedStudent format
        const std: StudentFeeSearchResult = {
          id: String(initialStudent.studentId || (initialStudent as any).id),
          studentId: String(initialStudent.studentId || (initialStudent as any).id),
          name: (initialStudent as any).studentName || (initialStudent as any).name,
          roll: initialStudent.roll,
          className: initialStudent.className,
          sectionName: initialStudent.sectionName,
          photo: initialStudent.photo,
          fatherName: (initialStudent as any).fatherName || "",
          monthlyTuition: (initialStudent as any).monthlyTuition || 1500,
          totalFee: initialStudent.totalFee,
          totalPaid: initialStudent.totalPaid,
          totalDue: initialStudent.totalDue,
          feeStatus: ((initialStudent as any).status || (initialStudent as any).feeStatus || "Unpaid") as any,
          monthlyDetails: initialStudent.monthlyDetails || [],
        };
        setSelectedStudent(std);
      } else {
        setSelectedStudent(null);
      }
      setSearchQuery("");
      setSearchResults([]);
      setErrorMsg("");
    }
  }, [isOpen, initialStudent]);

  // Load fee structure when a student is selected
  useEffect(() => {
    const loadFeeStructure = async () => {
      if (!selectedStudent) {
        setFeeItems([]);
        return;
      }

      try {
        const structure = await dataService.getFeeStructure(selectedStudent.className);
        const tuition = structure?.classTuitionRates?.[selectedStudent.className?.toLowerCase()] || selectedStudent.monthlyTuition || 1500;

        // Determine current month or first unpaid month for Tuition
        const unpaidMonthObj = selectedStudent.monthlyDetails?.find(m => m.due > 0);
        const defaultMonth = unpaidMonthObj ? unpaidMonthObj.month : MONTHS_LIST[new Date().getMonth()];
        setSelectedTuitionMonths([defaultMonth]);

        const items: FeeItemRow[] = (structure?.feeHeads || []).map((head: any, index: number) => ({
          id: `head-${index}`,
          headName: head.headName,
          term: head.term || "Monthly",
          period: head.isTuition ? defaultMonth : (head.term === "Halfyearly" ? "Term 1" : head.term === "Annually" ? "Session 2026" : "Current"),
          amount: head.isTuition ? tuition : Number(head.amount || 1000),
          selected: head.isTuition ? true : false, // By default select Tuition Fee
          isTuition: !!head.isTuition,
        }));

        setFeeItems(items);
      } catch (err) {
        console.error("Failed to load fee structure:", err);
      }
    };

    loadFeeStructure();
  }, [selectedStudent]);

  // Search debouncing
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await dataService.searchFeeStudents(searchQuery);
        setSearchResults(results || []);
      } catch (err) {
        console.error("Student search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleToggleItem = (id: string) => {
    setFeeItems(prev =>
      prev.map(item => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const handleAmountChange = (id: string, newAmt: number) => {
    setFeeItems(prev =>
      prev.map(item => (item.id === id ? { ...item, amount: isNaN(newAmt) ? 0 : newAmt } : item))
    );
  };

  const handleToggleMonth = (month: string) => {
    setSelectedTuitionMonths(prev => {
      const exists = prev.includes(month);
      const updated = exists ? prev.filter(m => m !== month) : [...prev, month];
      
      // Update the tuition row period description and amount
      const tuitionRate = selectedStudent?.monthlyTuition || 1500;
      setFeeItems(items =>
        items.map(item => {
          if (item.isTuition) {
            return {
              ...item,
              period: updated.join(", ") || "No Month Selected",
              amount: tuitionRate * Math.max(1, updated.length),
              selected: updated.length > 0,
            };
          }
          return item;
        })
      );
      return updated;
    });
  };

  // Calculations
  const selectedItems = feeItems.filter(item => item.selected);
  const subTotal = selectedItems.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const totalPaid = Math.max(0, subTotal - discount + fine);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      setErrorMsg("Please select a student first.");
      return;
    }
    if (selectedItems.length === 0) {
      setErrorMsg("Please select at least one fee category to collect.");
      return;
    }
    if (totalPaid <= 0) {
      setErrorMsg("Total payable amount must be greater than zero.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const payload = {
        studentId: selectedStudent.id || selectedStudent.studentId,
        academicYear: "2026-2027",
        items: selectedItems.map(item => ({
          headName: item.headName,
          term: item.term,
          period: item.period,
          amount: item.amount,
        })),
        subTotal,
        discount,
        fine,
        totalPaid,
        paymentMode,
        transactionId,
        remarks,
        collectedBy: "Admin",
      };

      const receipt = await dataService.collectFee(payload);
      onReceiptGenerated(receipt);
      onClose();
    } catch (err: any) {
      console.error("Failed to collect fee:", err);
      setErrorMsg(err?.response?.data?.message || err.message || "Failed to generate receipt");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Collect Student Fee & Generate Receipt"
      maxWidthClass="max-w-5xl"
    >
      <form onSubmit={handleSubmit} className="p-6 max-h-[85vh] overflow-y-auto space-y-5">
        {/* Search / Select Student Header */}
        {!selectedStudent ? (
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Icon name="fa-search" className="mr-1 text-primary" /> Search Student by ID / Roll No / Name
            </label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Type Student Roll No (e.g. 101), Name (e.g. Alice), or ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-sm pl-9"
                autoFocus
              />
              <span className="absolute left-3 top-2.5 text-gray-400">
                <Icon name="fa-id-card-o" />
              </span>
            </div>

            {isSearching && (
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                <Icon name="fa-spinner" className="fa-spin text-primary" /> Searching students...
              </p>
            )}

            {searchResults.length > 0 && (
              <div className="mt-3 border border-gray-200 rounded-md max-h-52 overflow-y-auto divide-y divide-gray-100 bg-white shadow-md">
                {searchResults.map(std => (
                  <div
                    key={std.id}
                    onClick={() => {
                      setSelectedStudent(std);
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="p-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {std.photo ? (
                        <img src={std.photo} alt={std.name} className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-sm">
                          {std.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">{std.name}</div>
                        <div className="text-xs text-gray-500">
                          Roll: <strong className="text-gray-700">#{std.roll}</strong> | Class: {std.className} ({std.sectionName})
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-red-600">
                        Due: ₹{std.totalDue?.toLocaleString("en-IN")}
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">
                        Select
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Selected Student Info Banner */
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50/40 p-4 rounded-lg border border-blue-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3.5">
              {selectedStudent.photo ? (
                <img
                  src={selectedStudent.photo}
                  alt={selectedStudent.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-lg">
                  {selectedStudent.name.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="font-bold text-gray-900 text-base m-0 flex items-center gap-2">
                  {selectedStudent.name}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    Roll: #{selectedStudent.roll}
                  </span>
                </h3>
                <p className="text-xs text-gray-600 m-0 mt-0.5">
                  Class: <strong>{selectedStudent.className}</strong> | Sec: <strong>{selectedStudent.sectionName}</strong>
                  {selectedStudent.fatherName && ` | Father: ${selectedStudent.fatherName}`}
                </p>
                <div className="flex gap-4 mt-1.5 text-xs font-medium">
                  <span className="text-gray-600">Tuition: ₹{selectedStudent.monthlyTuition}/mo</span>
                  <span className="text-teal font-semibold">Paid: ₹{selectedStudent.totalPaid?.toLocaleString("en-IN")}</span>
                  <span className="text-red-600 font-bold">Due: ₹{selectedStudent.totalDue?.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectedStudent(null)}
              className="text-xs self-end sm:self-center"
            >
              <Icon name="fa-exchange" /> Change Student
            </Button>
          </div>
        )}

        {/* Month Selector for Tuition */}
        {selectedStudent && (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                <Icon name="fa-calendar" className="text-primary" /> Select Month(s) to Pay Tuition Fee (₹{selectedStudent.monthlyTuition}/mo)
              </label>
              <span className="text-xs text-gray-500">
                {selectedTuitionMonths.length} month(s) selected
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {MONTHS_LIST.map(month => {
                const monthDetail = selectedStudent.monthlyDetails?.find(m => m.month.toLowerCase() === month.toLowerCase());
                const isPaid = monthDetail?.status === "Paid";
                const isSelected = selectedTuitionMonths.includes(month);

                return (
                  <button
                    key={month}
                    type="button"
                    disabled={isPaid}
                    onClick={() => handleToggleMonth(month)}
                    className={`p-2 rounded text-xs font-medium border text-center transition-all ${
                      isPaid
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through"
                        : isSelected
                        ? "bg-primary text-white border-primary shadow-sm font-semibold"
                        : "bg-white text-gray-700 border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                    }`}
                  >
                    <div>{month.slice(0, 3)}</div>
                    <div className="text-[10px] opacity-80">{isPaid ? "Paid" : `₹${selectedStudent.monthlyTuition}`}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Fee Categories Checklist (Auto-filled from Excel!) */}
        {selectedStudent && (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
              <div>
                <h4 className="text-sm font-bold text-gray-800 m-0">
                  Fee Categories & Amounts (Auto-filled from Fee Structure)
                </h4>
                <p className="text-xs text-gray-500 m-0">
                  Select the fees you want to collect. Amounts are pre-filled automatically based on Excel rates.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                    <th className="p-2 w-10 text-center">Select</th>
                    <th className="p-2">Fee Head</th>
                    <th className="p-2">Frequency / Term</th>
                    <th className="p-2">Period / Note</th>
                    <th className="p-2 text-right w-36">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {feeItems.map(item => (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50/80 transition-colors ${item.selected ? "bg-blue-50/30" : ""}`}
                    >
                      <td className="p-2 text-center">
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => handleToggleItem(item.id)}
                          className="w-4 h-4 text-primary rounded cursor-pointer"
                        />
                      </td>
                      <td className="p-2 font-medium text-gray-800">
                        {item.headName}
                        {item.isTuition && (
                          <span className="ml-1.5 text-[10px] px-1.5 py-0.2 bg-green-100 text-green-700 rounded font-semibold">
                            Tuition
                          </span>
                        )}
                      </td>
                      <td className="p-2 text-gray-500">{item.term}</td>
                      <td className="p-2 text-gray-500">{item.period || "-"}</td>
                      <td className="p-2 text-right">
                        <div className="inline-flex items-center gap-1 justify-end">
                          <span className="text-gray-400">₹</span>
                          <Input
                            type="number"
                            value={item.amount}
                            disabled={!item.selected}
                            onChange={e => handleAmountChange(item.id, parseFloat(e.target.value))}
                            className="w-24 h-7 text-xs text-right font-semibold"
                            min={0}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payment Summary & Mode */}
        {selectedStudent && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            {/* Left Column: Payment Details */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Payment Mode
                </label>
                <Select
                  value={paymentMode}
                  onChange={e => setPaymentMode(e.target.value)}
                  className="w-full text-xs h-9"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI / Online">UPI / Online Transfer</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Bank Transfer">Direct Bank Transfer</option>
                  <option value="Card">Debit / Credit Card</option>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Txn / Cheque / Reference No (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. UPI-998822 or Cheque #12345"
                  value={transactionId}
                  onChange={e => setTransactionId(e.target.value)}
                  className="w-full text-xs h-8"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Remarks / Note (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="Any remark for receipt..."
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  className="w-full text-xs h-8"
                />
              </div>
            </div>

            {/* Right Column: Billing Totals */}
            <div className="bg-white p-4 rounded border border-gray-200 flex flex-col justify-between text-xs space-y-2">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Subtotal ({selectedItems.length} categories):</span>
                <span>₹{subTotal.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-green-700 font-medium">Discount (₹):</span>
                <Input
                  type="number"
                  min={0}
                  max={subTotal}
                  value={discount}
                  onChange={e => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-24 h-7 text-xs text-right text-green-700"
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-orange-700 font-medium">Fine / Late Fee (₹):</span>
                <Input
                  type="number"
                  min={0}
                  value={fine}
                  onChange={e => setFine(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-24 h-7 text-xs text-right text-orange-700"
                />
              </div>

              <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-sm font-bold text-primary">
                <span>Total Payable / Paid:</span>
                <span className="text-base">₹{totalPaid.toLocaleString("en-IN")}</span>
              </div>

              <div className="text-[11px] text-gray-400 italic">
                * An official receipt will be generated automatically and ready to print or download.
              </div>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-xs flex items-center gap-2">
            <Icon name="fa-exclamation-circle" /> {errorMsg}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!selectedStudent || submitting || selectedItems.length === 0}
            className="flex items-center gap-2 px-5"
          >
            {submitting ? (
              <>
                <Icon name="fa-spinner" className="fa-spin" /> Generating Receipt...
              </>
            ) : (
              <>
                <Icon name="fa-check-circle" /> Collect & Generate Receipt
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
