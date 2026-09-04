import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { PageHeaderBar } from "../../components/common/PageHeaderBar";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Icon } from "../../components/ui/Icon";
import { FeeReceiptModal } from "../../components/fee/FeeReceiptModal";
import { dataService } from "../../services/dataService";
import type { StudentFeeSearchResult, FeeReceipt } from "../../types";

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

const FeeCollectPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paramStudentId = searchParams.get("studentId");

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StudentFeeSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentFeeSearchResult | null>(null);

  // Fee Items
  const [feeItems, setFeeItems] = useState<FeeItemRow[]>([]);
  const [selectedTuitionMonths, setSelectedTuitionMonths] = useState<string[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [fine, setFine] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<string>("Cash");
  const [transactionId, setTransactionId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Receipt Modal State
  const [generatedReceipt, setGeneratedReceipt] = useState<FeeReceipt | null>(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  // Load student if studentId is in URL query parameter
  useEffect(() => {
    if (paramStudentId) {
      const loadStudentFromParam = async () => {
        try {
          const results = await dataService.searchFeeStudents(paramStudentId);
          if (results && results.length > 0) {
            setSelectedStudent(results[0]);
          }
        } catch (err) {
          console.error("Failed to load student from parameter:", err);
        }
      };
      loadStudentFromParam();
    }
  }, [paramStudentId]);

  // Load fee structure when selectedStudent changes
  useEffect(() => {
    const loadFeeStructure = async () => {
      if (!selectedStudent) {
        setFeeItems([]);
        return;
      }

      try {
        const structure = await dataService.getFeeStructure(selectedStudent.className);
        const tuition = structure?.classTuitionRates?.[selectedStudent.className?.toLowerCase()] || selectedStudent.monthlyTuition || 1500;

        // Default month is first unpaid month or current month
        const unpaidMonthObj = selectedStudent.monthlyDetails?.find(m => m.due > 0);
        const defaultMonth = unpaidMonthObj ? unpaidMonthObj.month : MONTHS_LIST[new Date().getMonth()];
        setSelectedTuitionMonths([defaultMonth]);

        const items: FeeItemRow[] = (structure?.feeHeads || []).map((head: any, index: number) => ({
          id: `head-${index}`,
          headName: head.headName,
          term: head.term || "Monthly",
          period: head.isTuition ? defaultMonth : (head.term === "Halfyearly" ? "Term 1" : head.term === "Annually" ? "Session 2026" : "Current"),
          amount: head.isTuition ? tuition : Number(head.amount || 1000),
          selected: head.isTuition ? true : false,
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
      setErrorMsg("Please search and select a student first.");
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
    setSuccessMsg("");

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
      setGeneratedReceipt(receipt);
      setReceiptModalOpen(true);
      setSuccessMsg(`Receipt ${receipt.receiptNo} generated successfully!`);

      // Refresh student details
      const refreshed = await dataService.searchFeeStudents(selectedStudent.roll || selectedStudent.name);
      if (refreshed && refreshed.length > 0) {
        setSelectedStudent(refreshed[0]);
      }
    } catch (err: any) {
      console.error("Failed to collect fee:", err);
      setErrorMsg(err?.response?.data?.message || err.message || "Failed to generate receipt");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeaderBar
        titleKey="Collect Student Fee"
        iconName="fa-credit-card"
        breadcrumbLabel="Fee Management / Collect Fee"
      />

      <div className="p-6 bg-bodyBg space-y-6">
        {/* Top Actions Nav */}
        <div className="flex flex-wrap justify-between items-center gap-3 bg-white p-4 rounded border border-[#e1e1e1] shadow-sm">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate("/dashboard/fee")}
              className="text-xs flex items-center gap-1.5"
            >
              <Icon name="fa-arrow-left" /> Fee Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard/fee/receipts")}
              className="text-xs flex items-center gap-1.5"
            >
              <Icon name="fa-history" /> Receipts History
            </Button>
          </div>

          <div className="text-xs text-gray-500 font-medium">
            Collect fees with automatic Excel fee structure rates & instant printable receipt
          </div>
        </div>

        {/* Search & Student Selection Card */}
        <div className="bg-white p-6 rounded border border-[#e1e1e1] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#eee]">
            <h2 className="text-base font-bold text-gray-800 m-0 flex items-center gap-2">
              <Icon name="fa-id-card-o" className="text-primary" /> Step 1: Select Student
            </h2>
            {selectedStudent && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedStudent(null);
                  setSearchQuery("");
                }}
                className="text-xs"
              >
                <Icon name="fa-exchange" /> Change Student
              </Button>
            )}
          </div>

          {!selectedStudent ? (
            <div className="max-w-2xl">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Search by Student ID, Roll No, or Student Name
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="e.g. Type 101, Alice, 102, or Bob..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 text-sm h-10"
                  autoFocus
                />
                <span className="absolute left-3 top-3 text-gray-400">
                  <Icon name="fa-search" />
                </span>
              </div>

              {isSearching && (
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                  <Icon name="fa-spinner" className="fa-spin text-primary" /> Searching students...
                </p>
              )}

              {searchResults.length > 0 && (
                <div className="mt-3 border border-gray-200 rounded-lg max-h-60 overflow-y-auto divide-y divide-gray-100 bg-white shadow-md">
                  {searchResults.map(std => (
                    <div
                      key={std.id}
                      onClick={() => {
                        setSelectedStudent(std);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      className="p-3.5 hover:bg-blue-50/60 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {std.photo ? (
                          <img src={std.photo} alt={std.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                            {std.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-gray-800 text-sm">{std.name}</div>
                          <div className="text-xs text-gray-500">
                            Roll: <strong className="text-gray-800">#{std.roll}</strong> | Class: {std.className} ({std.sectionName})
                            {std.fatherName && ` | Father: ${std.fatherName}`}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold text-red-600">
                          Due: ₹{std.totalDue?.toLocaleString("en-IN")}
                        </div>
                        <span className="text-[11px] px-2.5 py-1 rounded bg-primary text-white font-medium inline-block mt-1 shadow-sm">
                          Select & Proceed
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Selected Student Detailed Card */
            <div className="bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/50 p-4 rounded-lg border border-blue-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                {selectedStudent.photo ? (
                  <img
                    src={selectedStudent.photo}
                    alt={selectedStudent.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xl">
                    {selectedStudent.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-gray-900 text-lg m-0 flex items-center gap-2">
                    {selectedStudent.name}
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                      Roll #{selectedStudent.roll}
                    </span>
                  </h3>
                  <p className="text-xs text-gray-600 m-0 mt-1">
                    Class: <strong>{selectedStudent.className}</strong> | Section: <strong>{selectedStudent.sectionName}</strong>
                    {selectedStudent.fatherName && ` | Father: ${selectedStudent.fatherName}`}
                  </p>
                </div>
              </div>

              {/* Financial Metrics */}
              <div className="flex items-center gap-3 text-xs bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                <div>
                  <span className="text-gray-500 block">Class Tuition</span>
                  <span className="font-bold text-gray-800 text-sm">₹{selectedStudent.monthlyTuition}/mo</span>
                </div>
                <div className="border-l border-gray-200 pl-3">
                  <span className="text-gray-500 block">Total Paid</span>
                  <span className="font-bold text-teal text-sm">₹{selectedStudent.totalPaid?.toLocaleString("en-IN")}</span>
                </div>
                <div className="border-l border-gray-200 pl-3">
                  <span className="text-gray-500 block">Total Due</span>
                  <span className="font-bold text-red-600 text-sm">₹{selectedStudent.totalDue?.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Collection Form (When student is selected) */}
        {selectedStudent && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 2: Tuition Months Checklist */}
            <div className="bg-white p-6 rounded border border-[#e1e1e1] shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#eee] gap-2">
                <h3 className="text-sm font-bold text-gray-800 m-0 flex items-center gap-2">
                  <Icon name="fa-calendar-check-o" className="text-primary" /> Step 2: Select Tuition Fee Months (₹{selectedStudent.monthlyTuition} / month)
                </h3>
                <span className="text-xs font-semibold text-primary">
                  {selectedTuitionMonths.length} month(s) selected = ₹{selectedStudent.monthlyTuition * selectedTuitionMonths.length}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-2">
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
                      className={`p-2.5 rounded text-xs font-medium border text-center transition-all ${
                        isPaid
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through"
                          : isSelected
                          ? "bg-primary text-white border-primary shadow-sm font-bold"
                          : "bg-white text-gray-700 border-gray-200 hover:border-primary/50 hover:bg-blue-50/20 cursor-pointer"
                      }`}
                    >
                      <div className="text-sm font-semibold">{month.slice(0, 3)}</div>
                      <div className="text-[10px] mt-0.5 opacity-90">{isPaid ? "Already Paid" : `₹${selectedStudent.monthlyTuition}`}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Excel-based Fee Categories Table */}
            <div className="bg-white p-6 rounded border border-[#e1e1e1] shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#eee] gap-2">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 m-0 flex items-center gap-2">
                    <Icon name="fa-list-ol" className="text-primary" /> Step 3: Fee Categories & Amounts (Auto-Filled from Fee Structure)
                  </h3>
                  <p className="text-xs text-gray-500 m-0 mt-0.5">
                    Tick the checkbox for the fees you want to collect. Amounts are automatically pre-filled.
                  </p>
                </div>
                <span className="text-xs text-gray-600">
                  {selectedItems.length} fee category selected
                </span>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="p-3 w-12 text-center">Collect</th>
                      <th className="p-3">Fee Category</th>
                      <th className="p-3">Frequency / Term</th>
                      <th className="p-3">Period / Description</th>
                      <th className="p-3 text-right w-44">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {feeItems.map(item => (
                      <tr
                        key={item.id}
                        className={`hover:bg-gray-50/80 transition-colors ${item.selected ? "bg-blue-50/25" : ""}`}
                      >
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => handleToggleItem(item.id)}
                            className="w-4 h-4 text-primary rounded cursor-pointer"
                          />
                        </td>
                        <td className="p-3 font-semibold text-gray-800">
                          {item.headName}
                          {item.isTuition && (
                            <span className="ml-2 text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold">
                              Tuition Fee
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-gray-600">{item.term}</td>
                        <td className="p-3 text-gray-600 font-medium">{item.period || "-"}</td>
                        <td className="p-3 text-right">
                          <div className="inline-flex items-center gap-1 justify-end">
                            <span className="text-gray-500 font-semibold">₹</span>
                            <Input
                              type="number"
                              value={item.amount}
                              disabled={!item.selected}
                              onChange={e => handleAmountChange(item.id, parseFloat(e.target.value))}
                              className="w-28 h-8 text-xs text-right font-bold"
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

            {/* Step 4: Billing Details & Payment Mode */}
            <div className="bg-white p-6 rounded border border-[#e1e1e1] shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 m-0 pb-3 border-b border-[#eee] flex items-center gap-2">
                <Icon name="fa-money" className="text-primary" /> Step 4: Payment Mode & Billing Summary
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                {/* Left Column: Payment Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Payment Mode *
                    </label>
                    <Select
                      value={paymentMode}
                      onChange={e => setPaymentMode(e.target.value)}
                      className="w-full text-xs h-10 font-medium"
                    >
                      <option value="Cash">Cash</option>
                      <option value="UPI / Online">UPI / Online Transfer</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Bank Transfer">Direct Bank Transfer</option>
                      <option value="Card">Debit / Credit Card</option>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Transaction / Cheque / Ref Number (Optional)
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. UPI Ref: 9876543210 or Cheque #12345"
                      value={transactionId}
                      onChange={e => setTransactionId(e.target.value)}
                      className="w-full text-xs h-9"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Remarks / Note (Optional)
                    </label>
                    <Input
                      type="text"
                      placeholder="Any note to print on the receipt..."
                      value={remarks}
                      onChange={e => setRemarks(e.target.value)}
                      className="w-full text-xs h-9"
                    />
                  </div>
                </div>

                {/* Right Column: Calculations */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 flex flex-col justify-between space-y-3">
                  <div className="flex justify-between text-xs text-gray-600 font-medium">
                    <span>Subtotal ({selectedItems.length} fee categories):</span>
                    <span className="font-bold text-gray-800 text-sm">₹{subTotal.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-green-700 font-semibold">Special Discount (₹):</span>
                    <Input
                      type="number"
                      min={0}
                      max={subTotal}
                      value={discount}
                      onChange={e => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-28 h-8 text-xs text-right text-green-700 font-bold"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-orange-700 font-semibold">Fine / Late Fee (₹):</span>
                    <Input
                      type="number"
                      min={0}
                      value={fine}
                      onChange={e => setFine(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-28 h-8 text-xs text-right text-orange-700 font-bold"
                    />
                  </div>

                  <div className="pt-3 border-t border-gray-300 flex justify-between items-center text-primary">
                    <span className="font-bold text-sm">Total Paid / Collected:</span>
                    <span className="text-xl font-extrabold">₹{totalPaid.toLocaleString("en-IN")}</span>
                  </div>

                  <p className="text-[11px] text-gray-400 m-0 italic pt-1">
                    * Submitting will instantly issue an official School Fee Receipt with print and PDF download.
                  </p>
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded text-xs flex items-center gap-2 font-medium">
                <Icon name="fa-exclamation-circle" /> {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 bg-green-50 border border-green-200 text-green-700 rounded text-xs flex items-center gap-2 font-medium">
                <Icon name="fa-check-circle" /> {successMsg}
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/dashboard/fee")}
                disabled={submitting}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="primary"
                disabled={submitting || selectedItems.length === 0}
                className="bg-green-600 hover:bg-green-700 text-white font-bold flex items-center gap-2 px-6 py-2.5 text-sm shadow-md border-none cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Icon name="fa-spinner" className="fa-spin" /> Generating Receipt...
                  </>
                ) : (
                  <>
                    <Icon name="fa-check-circle" /> Collect Fee & Generate Official Receipt
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Official Printable Fee Receipt Modal */}
      <FeeReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        receipt={generatedReceipt}
      />
    </DashboardLayout>
  );
};

export default FeeCollectPage;
