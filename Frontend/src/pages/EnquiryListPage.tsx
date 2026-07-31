import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { useLanguage } from "../context/LanguageContext";
import { Icon } from "../components/ui/Icon";
import { PageHeaderBar } from "../components/common/PageHeaderBar";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Spinner } from "../components/ui/Spinner";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { useSearchAndFilter } from "../hooks/useSearchAndFilter";
import { useModal } from "../hooks/useModal";
import { dataService } from "../services/dataService";
import apiClient from "../services/api/apiClient";
import type { Enquiry } from "../types";
import { getPhotoUrl, handleImageError } from "../Utils/image";
import { studentApi } from "../services/api/studentApi";
import {
  type ExportColumn,
  handleCopyToClipboard,
  handleExportCsv,
  exportExcelFromTemplate,
  exportExcelWithImages,
  exportPdfWithImages
} from "../Utils/exportService";

export const EnquiryListPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const detailModal = useModal<Enquiry>();

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [admittingId, setAdmittingId] = useState<string | number | null>(null);

  // Filters State
  const [classFilter, setClassFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchEnquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dataService.getEnquiries();
      // Current Enquiry list = only NOT-yet-admitted records
      setEnquiries(data.filter((e) => e.status !== "Admission Confirmed"));
    } catch (err: any) {
      setError(err.message || "Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  };

  const handleAdmitStudent = async (enquiry: Enquiry) => {
    if (enquiry.status === "Admission Confirmed") {
      if (!window.confirm(t("This student has already been admitted. Do you want to process admission again?"))) {
        return;
      }
    } else {
      if (!window.confirm(t(`Do you want to Admit ${enquiry.studentName} and move record into Student List?`))) {
        return;
      }
    }

    setAdmittingId(enquiry.id);
    try {
      // 1. Create Student record in Student Database
      // Carry over ALL data from Enquiry to Student
      const {
        id, status, studentName, applyingClass, createdAt, updatedAt, ...remainingData
      } = enquiry;

      const studentPayload = {
        ...remainingData,
        name: studentName,
        roll: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
        className: applyingClass || "Class 1",
        email: enquiry.fatherEmail || enquiry.motherEmail || `${enquiry.studentName.toLowerCase().replace(/\s+/g, '')}@school.com`,
        photo: enquiry.photo || "https://demo.eduking.xyz/uploads/images/default.png",
        documents: enquiry.documents || [],
      };

      await studentApi.create(studentPayload);

      // 2. Update Enquiry status to "Admission Confirmed"
      await dataService.updateEnquiry(enquiry.id, { status: "Admission Confirmed" });

      showToast(`🎉 ${enquiry.studentName} ${t("admitted successfully and moved to Student List!")}`, "success");
      fetchEnquiries();
      if (detailModal.isOpen && detailModal.activeItem?.id === enquiry.id) {
        detailModal.close();
      }
    } catch (err: any) {
      showToast(err.message || t("Failed to process student admission"), "error");
    } finally {
      setAdmittingId(null);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleDelete = async (id: string | number) => {
    if (window.confirm(t("Are you sure you want to delete this enquiry record?"))) {
      try {
        await dataService.deleteEnquiry(id);
        showToast(t("Enquiry deleted successfully"), "success");
        fetchEnquiries(); // Refresh the list
      } catch (err: any) {
        showToast(err.message || "Error deleting enquiry", "error");
      }
    }
  };

  const handleStatusChange = async (id: string | number, newStatus: Enquiry["status"]) => {
    // Quick-dropdown se seedha "Admission Confirmed" chuna gaya ho,
    // toh usi Admit flow se guzaro taaki Student record bhi bane.
    if (newStatus === "Admission Confirmed") {
      const target = enquiries.find((item) => item.id === id) || detailModal.activeItem;
      if (target) {
        await handleAdmitStudent(target);
      }
      return;
    }

    try {
      await dataService.updateEnquiry(id, { status: newStatus });
      showToast(t("Status updated successfully"), "success");

      setEnquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );

      if (detailModal.isOpen && detailModal.activeItem?.id === id) {
        detailModal.open({ ...detailModal.activeItem, status: newStatus });
      }
    } catch (err: any) {
      showToast(err.message || "Error updating status", "error");
    }
  };

  // Import State & Handler
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    if (!file.name.endsWith(".xlsx")) {
      showToast(t("Only .xlsx files are allowed"), "error");
      return;
    }

    setImporting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await apiClient.post("/import/enquiries", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = res.data?.data;
      const inserted = data?.insertedCount ?? 0;
      const skipped = data?.skippedRows?.length ?? 0;
      showToast(`${t("Imported")}: ${inserted} | ${t("Skipped")}: ${skipped}`, "success");
      fetchEnquiries();
    } catch (err: any) {
      showToast(err.message || t("Import failed"), "error");
    } finally {
      setImporting(false);
    }
  };

  // Export Columns
  const exportColumns: ExportColumn[] = [
    { header: "Student Name", accessorKey: "studentName" },
    { header: "Applying Class", accessorKey: "applyingClass" },
    { header: "Gender", accessorKey: "gender" },
    { header: "Date of Birth", accessorKey: "dob" },
    { header: "Father Name", accessorKey: "fatherName" },
    { header: "Contact Number", accessorKey: "fatherContact" },
    { header: "Status", accessorKey: "status" },
    { header: "PIN Code", accessorKey: "pinCode" },
    { header: "Address", accessorKey: "address" },
    { header: "Photo", accessorKey: "photo" },
  ];

  const handleCopy = () => {
    handleCopyToClipboard(filteredEnquiries, exportColumns);
    showToast(t("Copied to clipboard"), "success");
  };

  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    const filename = "student-enquiries";
    switch (format) {
      case "csv":
        handleExportCsv(filteredEnquiries, exportColumns, filename);
        showToast(t("Exported CSV successfully"), "success");
        break;
      case "excel":
        try {
          await exportExcelWithImages(filteredEnquiries, exportColumns, filename, {
            templateUrl: "/template.xlsx",
            imageColumnKey: "photo",
            imageSize: { width: 60, height: 60 },
          });
        } catch {
          try {
            await exportExcelFromTemplate(filteredEnquiries, exportColumns, filename, {
              templateUrl: "/template.xlsx",
              startRow: 2,
            });
          } catch {
            handleExportCsv(filteredEnquiries, exportColumns, filename);
          }
        }
        showToast(t("Exported Excel successfully"), "success");
        break;
      case "pdf":
        try {
          await exportPdfWithImages(filteredEnquiries, exportColumns, filename, {
            imageColumnKey: "photo",
            imageSize: { width: 30, height: 30 },
          });
        } catch {
          handleExportCsv(filteredEnquiries, exportColumns, filename);
        }
        showToast(t("Exported PDF successfully"), "success");
        break;
    }
  };

  // Multi-Filter Function
  const filterFn = (item: Enquiry, term: string) => {
    const matchesSearch =
      term === "" ||
      item.studentName.toLowerCase().includes(term.toLowerCase()) ||
      item.fatherName.toLowerCase().includes(term.toLowerCase()) ||
      item.fatherContact.includes(term) ||
      !!(item.motherContact && item.motherContact.includes(term));

    const matchesClass = classFilter === "" || item.applyingClass === classFilter;
    const matchesStatus = statusFilter === "" || item.status === statusFilter;

    return !!(matchesSearch && matchesClass && matchesStatus);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    searchTerm,
    setSearchTerm,
    filterValue,
    sortField,
    sortOrder,
    handleSort,
    sortedData: filteredEnquiries,
  } = useSearchAndFilter<Enquiry>({
    initialData: enquiries,
    filterFn,
    initialSortField: "createdAt",
    initialSortOrder: "desc", // Newest first
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredEnquiries.length, searchTerm, filterValue]);

  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEnquiries = filteredEnquiries.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadgeClass = (status: Enquiry["status"]) => {
    switch (status) {
      case "New":
        return "bg-teal text-white";
      case "Contacted":
        return "bg-calblue text-white";
      case "Follow-up":
        return "bg-badgeorange text-white";
      case "Admission Confirmed":
        return "bg-[#00BC29] text-white";
      case "Rejected":
        return "bg-badgered text-white";
      case "Closed":
        return "bg-muted text-white";
      default:
        return "bg-gray-100 text-dark";
    }
  };

  const renderSortIcon = (key: keyof Enquiry | "action") => {
    if (key === "action") return null;
    if (sortField !== key) {
      return <Icon name="fa-caret-down" className="text-gray-300 ml-1 text-[10px]" />;
    }
    return sortOrder === "asc" ? (
      <Icon name="fa-caret-down" className="text-teal ml-1 text-[10px] rotate-180 transition-transform duration-200" />
    ) : (
      <Icon name="fa-caret-down" className="text-teal ml-1 text-[10px] transition-transform duration-200" />
    );
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-[4px] shadow-[0_1px_1px_rgba(0,0,0,.1)] border border-[#e7eaec] overflow-hidden select-none">
        <PageHeaderBar titleKey="Current Enquiries" iconName="fa-question-circle" />

        <div className="p-[15px]">
          {error && (
            <div className="mb-4">
              <ErrorMessage message={error} onRetry={fetchEnquiries} />
            </div>
          )}

          {/* Filters and Search Row */}
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-4 select-none">

            {/* Multi-Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="border border-[#dfe6e9] rounded px-3 py-2 text-dark bg-white focus:outline-none focus:ring-1 focus:ring-accent text-[13px] min-w-[140px] shadow-sm cursor-pointer"
              >
                <option value="">{t("Filter Class")}</option>
                {["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-[#dfe6e9] rounded px-3 py-2 text-dark bg-white focus:outline-none focus:ring-1 focus:ring-accent text-[13px] min-w-[140px] shadow-sm cursor-pointer"
              >
                <option value="">{t("Filter Status")}</option>
                {["New", "Contacted", "Follow-up", "Admission Confirmed", "Rejected", "Closed"].map((s) => (
                  <option key={s} value={s}>{t(s)}</option>
                ))}
              </select>

              {(classFilter || statusFilter) && (
                <button
                  onClick={() => {
                    setClassFilter("");
                    setStatusFilter("");
                  }}
                  className="px-3 py-2 text-[12px] text-teal border border-teal rounded hover:bg-teal hover:text-white transition-colors font-semibold bg-transparent cursor-pointer"
                >
                  {t("Clear Filters")}
                </button>
              )}
            </div>

            {/* Search Input */}

            <div className="flex items-center gap-4">
                   
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
                      <Button
                        variant="success"
                        onClick={() => navigate("/dashboard/enquiry/new")}
                        className="bg-teal hover:bg-[#16a085] text-white font-bold px-4 py-2 rounded shadow-sm text-xs border-0 cursor-pointer flex items-center gap-2 active:scale-95 transition-all"
                      >
                        <Icon name="fa-plus-circle" className="text-sm" />
                        <span>{t("New Enquiry")}</span>
                      </Button>
                    </div>
              <label className="text-[13px] text-muted font-medium">{t("Search")}:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("Name, Father Name, Phone...")}
                className="border border-[#dfe6e9] rounded px-3 py-1.5 text-[13px] text-dark focus:outline-none focus:ring-1 focus:ring-accent bg-white shadow-sm min-w-[200px]"
              />
            </div>
          </div>

          {/* Toolbar and Data Grid Panel */}
          {loading && enquiries.length === 0 ? (
            <div className="py-12 flex justify-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="border border-[#e7eaec] rounded-[3px] overflow-hidden">

              {/* Toolbar Actions */}
              <div className="bg-[#f8f9fa] border-b border-[#e7eaec] px-[15px] py-[10px] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 select-none">
                <span className="text-[13px] font-bold text-dark uppercase tracking-wider">
                  {t("Enquiry List")}
                </span>

                <div className="flex flex-wrap gap-2">
                  <Button variant="export" onClick={handleCopy}>{t("Copy")}</Button>
                  <Button variant="export" onClick={() => handleExport("excel")}>{t("Excel")}</Button>
                  <Button variant="export" onClick={() => handleExport("csv")}>{t("CSV")}</Button>
                  <Button variant="export" onClick={() => handleExport("pdf")}>{t("PDF")}</Button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="export"
                    onClick={handleImportClick}
                    disabled={importing}
                    className="border border-teal text-teal hover:bg-teal hover:text-white transition-colors flex items-center gap-1 bg-transparent cursor-pointer"
                  >
                    {importing ? <Spinner size="sm" /> : <Icon name="fa-file-text" className="text-[12px]" />}
                    {t("Import Excel")}
                  </Button>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto w-full">
                <table className="w-full border-collapse">
                  <thead className="bg-[#f8f9fa] border-b border-[#e7eaec] select-none">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider w-12">#</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider w-20">{t("Photo")}</th>
                      <th
                        onClick={() => handleSort("studentName")}
                        className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider cursor-pointer hover:bg-[#f0f0f0] transition-colors"
                      >
                        <div className="flex items-center">
                          <span>{t("Student Name")}</span>
                          {renderSortIcon("studentName")}
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort("applyingClass")}
                        className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider cursor-pointer hover:bg-[#f0f0f0] transition-colors"
                      >
                        <div className="flex items-center">
                          <span>{t("Applying Class")}</span>
                          {renderSortIcon("applyingClass")}
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort("fatherName")}
                        className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider cursor-pointer hover:bg-[#f0f0f0] transition-colors"
                      >
                        <div className="flex items-center">
                          <span>{t("Father Name")}</span>
                          {renderSortIcon("fatherName")}
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort("fatherContact")}
                        className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider cursor-pointer hover:bg-[#f0f0f0] transition-colors"
                      >
                        <div className="flex items-center">
                          <span>{t("Contact Number")}</span>
                          {renderSortIcon("fatherContact")}
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort("status")}
                        className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider cursor-pointer hover:bg-[#f0f0f0] transition-colors w-32"
                      >
                        <div className="flex items-center">
                          <span>{t("Status")}</span>
                          {renderSortIcon("status")}
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort("createdAt")}
                        className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider cursor-pointer hover:bg-[#f0f0f0] transition-colors"
                      >
                        <div className="flex items-center">
                          <span>{t("Created Date")}</span>
                          {renderSortIcon("createdAt")}
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap min-w-[200px]">{t("Action")}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#f0f0f0]">
                    {filteredEnquiries.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-muted bg-[#fdfdfd] text-[13px]">
                          {t("No data available in table")}
                        </td>
                      </tr>
                    ) : (
                      paginatedEnquiries.map((item, index) => (
                        <tr key={item.id} className="hover:bg-[#fafafa] transition-colors">
                          <td className="px-4 py-3 text-sm text-dark">{startIndex + index + 1}</td>
                          <td className="px-4 py-3 text-sm text-dark">
                            <div className="w-[36px] h-[36px] rounded-full border border-[#e1e1e1] shadow-sm overflow-hidden select-none">
                              <img
                                src={getPhotoUrl(item.photo)}
                                onError={handleImageError}
                                alt={item.studentName}
                                className="w-full h-full object-cover cursor-zoom-in hover:scale-110 transition-transform duration-200"
                                onClick={() => {
                                  // Quick preview trigger by opening details modal
                                  detailModal.open(item);
                                }}
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-dark font-semibold">{item.studentName}</td>
                          <td className="px-4 py-3 text-sm text-[#3c8dbc] font-medium">{item.applyingClass}</td>
                          <td className="px-4 py-3 text-sm text-dark">{item.fatherName}</td>
                          <td className="px-4 py-3 text-sm text-dark">{item.fatherContact}</td>
                          <td className="px-4 py-3 text-sm text-dark select-none">
                            {/* Fast status update select */}
                            <select
                              value={item.status}
                              onChange={(e) => handleStatusChange(item.id, e.target.value as Enquiry["status"])}
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent ${getStatusBadgeClass(
                                item.status
                              )}`}
                            >
                              <option value="New" className="bg-white text-dark">{t("New")}</option>
                              <option value="Contacted" className="bg-white text-dark">{t("Contacted")}</option>
                              <option value="Follow-up" className="bg-white text-dark">{t("Follow-up")}</option>
                              <option value="Admission Confirmed" className="bg-white text-dark">{t("Admission Confirmed")}</option>
                              <option value="Rejected" className="bg-white text-dark">{t("Rejected")}</option>
                              <option value="Closed" className="bg-white text-dark">{t("Closed")}</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted">
                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-dark whitespace-nowrap">
                            <div className="flex items-center gap-1.5 flex-nowrap">
                              
                              {item.status !== "Admission Confirmed" && (
                                <Button
                                  variant="success"
                                  size="sm"
                                  disabled={admittingId === item.id}
                                  onClick={() => handleAdmitStudent(item)}
                                  title={t("Admit Student / Move to Student DB")}
                                  className="rounded-[3px] px-[8px] py-[5px] text-[12px] font-semibold text-white border-0 flex items-center gap-1 transition-all bg-emerald-600 hover:bg-emerald-700"
                                >
                                  {admittingId === item.id ? (
                                    <Spinner size="sm" />
                                  ) : (
                                    <>
                                      <Icon name="fa-user-plus" />
                                      
                                    </>
                                  )}
                                </Button>
                              )}

                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => detailModal.open(item)}
                                title={t("View Details")}
                                className="rounded-[3px] px-[8px] py-[5px] text-[13px] bg-teal hover:opacity-90 border-0"
                              >
                                <Icon name="fa-check-square-o" />
                              </Button>

                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => navigate(`/dashboard/enquiry/edit/${item.id}`)}
                                title={t("Edit")}
                                className="rounded-[3px] px-[8px] py-[5px] text-[13px] bg-primary hover:opacity-90 border-0"
                              >
                                <Icon name="fa-pencil" />
                              </Button>

                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(item.id)}
                                title={t("Delete")}
                                className="rounded-[3px] px-[8px] py-[5px] text-[13px] bg-iconred hover:opacity-90 border-0"
                              >
                                <Icon name="fa-trash" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Paging Footer */}
              <div className="px-4 py-3 border-t border-[#e7eaec] select-none bg-[#fdfdfd] flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-[13px] text-muted">
                  {t("Showing")} {filteredEnquiries.length > 0 ? startIndex + 1 : 0} {t("to")}{' '}
                  {Math.min(startIndex + itemsPerPage, filteredEnquiries.length)} {t("of")} {filteredEnquiries.length} {t("entries")}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  >
                    {t("Previous")}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage >= totalPages || totalPages === 0}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  >
                    {t("Next")}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Detail Modal */}
      <Modal
        isOpen={detailModal.isOpen}
        onClose={detailModal.close}
        title="Student Enquiry Information Details"
        maxWidthClass="max-w-3xl"
      >
        {detailModal.activeItem && (
          <div className="p-6 overflow-y-auto max-h-[75vh] select-none animate-fadeIn">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row gap-6 mb-6 pb-6 border-b border-[#f0f0f0] items-center sm:items-start text-center sm:text-left">
              <div className="w-24 h-24 rounded-full border-4 border-[#e1e1e1] shadow-inner overflow-hidden flex-shrink-0 bg-white">
                <img
                  src={getPhotoUrl(detailModal.activeItem.photo)}
                  onError={handleImageError}
                  alt={detailModal.activeItem.studentName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-1">
                <h2 className="text-[20px] font-bold text-dark">{detailModal.activeItem.studentName}</h2>
                <p className="text-[#3c8dbc] font-semibold text-[13px]">
                  {t("Applying Class")}: {detailModal.activeItem.applyingClass}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2">
                  <span className="text-[13px] text-muted">
                    <Icon name="fa-birthday-cake" className="mr-1" />
                    {detailModal.activeItem.dob} ({t(detailModal.activeItem.gender)})
                  </span>

                  {/* Quick status edit dropdown inside modal */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] text-muted font-bold uppercase">{t("Status")}:</span>
                    <select
                      value={detailModal.activeItem.status}
                      onChange={(e) => handleStatusChange(detailModal.activeItem!.id, e.target.value as Enquiry["status"])}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider border border-[#dfe6e9] focus:outline-none ${getStatusBadgeClass(
                        detailModal.activeItem.status
                      )}`}
                    >
                      <option value="New" className="bg-white text-dark">{t("New")}</option>
                      <option value="Contacted" className="bg-white text-dark">{t("Contacted")}</option>
                      <option value="Follow-up" className="bg-white text-dark">{t("Follow-up")}</option>
                      <option value="Admission Confirmed" className="bg-white text-dark">{t("Admission Confirmed")}</option>
                      <option value="Rejected" className="bg-white text-dark">{t("Rejected")}</option>
                      <option value="Closed" className="bg-white text-dark">{t("Closed")}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Structured details rows */}
            <div className="space-y-6">

              {/* Personal details grid */}
              <div className="bg-[#fcfcfc] rounded-lg border border-[#e7eaec] p-4">
                <h4 className="text-teal font-bold text-[13px] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Icon name="fa-user" /> {t("Student Personal Details")}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
                  <div className="grid grid-cols-12">
                    <span className="col-span-5 font-semibold text-muted">{t("APAR ID")}</span>
                    <span className="col-span-1 text-center text-muted">:</span>
                    <span className="col-span-6 font-medium text-dark">{detailModal.activeItem.aparId || "-"}</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-5 font-semibold text-muted">{t("PEN Number")}</span>
                    <span className="col-span-1 text-center text-muted">:</span>
                    <span className="col-span-6 font-medium text-dark">{detailModal.activeItem.penNumber || "-"}</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-5 font-semibold text-muted">{t("Aadhaar Number")}</span>
                    <span className="col-span-1 text-center text-muted">:</span>
                    <span className="col-span-6 font-medium text-dark">{detailModal.activeItem.childAadhaar || "-"}</span>
                  </div>
                </div>
              </div>

              {/* Parents details grid */}
              <div className="bg-[#fcfcfc] rounded-lg border border-[#e7eaec] p-4">
                <h4 className="text-teal font-bold text-[13px] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Icon name="fa-users" /> {t("Parent Details")}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[13px]">
                  {/* Father's side */}
                  <div className="space-y-2.5">
                    <h5 className="font-bold text-[#636e72] border-b border-[#f0f0f0] pb-1">{t("Father Details")}</h5>
                    <div className="grid grid-cols-12">
                      <span className="col-span-5 font-semibold text-muted">{t("Name")}</span>
                      <span className="col-span-1 text-center text-muted">:</span>
                      <span className="col-span-6 font-medium text-dark">{detailModal.activeItem.fatherName}</span>
                    </div>
                    <div className="grid grid-cols-12">
                      <span className="col-span-5 font-semibold text-muted">{t("Occupation")}</span>
                      <span className="col-span-1 text-center text-muted">:</span>
                      <span className="col-span-6 font-medium text-dark">{detailModal.activeItem.fatherOccupation}</span>
                    </div>
                    <div className="grid grid-cols-12">
                      <span className="col-span-5 font-semibold text-muted">{t("Contact No")}</span>
                      <span className="col-span-1 text-center text-muted">:</span>
                      <span className="col-span-6 font-medium text-dark">{detailModal.activeItem.fatherContact}</span>
                    </div>
                    <div className="grid grid-cols-12">
                      <span className="col-span-5 font-semibold text-muted">{t("Email ID")}</span>
                      <span className="col-span-1 text-center text-muted">:</span>
                      <span className="col-span-6 font-medium text-dark truncate" title={detailModal.activeItem.fatherEmail}>{detailModal.activeItem.fatherEmail}</span>
                    </div>
                    <div className="grid grid-cols-12">
                      <span className="col-span-5 font-semibold text-muted">{t("Aadhaar Number")}</span>
                      <span className="col-span-1 text-center text-muted">:</span>
                      <span className="col-span-6 font-medium text-dark">{detailModal.activeItem.fatherAadhaar || "-"}</span>
                    </div>
                  </div>

                  {/* Mother's side */}
                  <div className="space-y-2.5">
                    <h5 className="font-bold text-[#636e72] border-b border-[#f0f0f0] pb-1">{t("Mother Details")}</h5>
                    <div className="grid grid-cols-12">
                      <span className="col-span-5 font-semibold text-muted">{t("Name")}</span>
                      <span className="col-span-1 text-center text-muted">:</span>
                      <span className="col-span-6 font-medium text-dark">{detailModal.activeItem.motherName}</span>
                    </div>
                    <div className="grid grid-cols-12">
                      <span className="col-span-5 font-semibold text-muted">{t("Occupation")}</span>
                      <span className="col-span-1 text-center text-muted">:</span>
                      <span className="col-span-6 font-medium text-dark">{detailModal.activeItem.motherOccupation}</span>
                    </div>
                    <div className="grid grid-cols-12">
                      <span className="col-span-5 font-semibold text-muted">{t("Contact No")}</span>
                      <span className="col-span-1 text-center text-muted">:</span>
                      <span className="col-span-6 font-medium text-dark">{detailModal.activeItem.motherContact}</span>
                    </div>
                    <div className="grid grid-cols-12">
                      <span className="col-span-5 font-semibold text-muted">{t("Email ID")}</span>
                      <span className="col-span-1 text-center text-muted">:</span>
                      <span className="col-span-6 font-medium text-dark truncate" title={detailModal.activeItem.motherEmail}>{detailModal.activeItem.motherEmail}</span>
                    </div>
                    <div className="grid grid-cols-12">
                      <span className="col-span-5 font-semibold text-muted">{t("Aadhaar Number")}</span>
                      <span className="col-span-1 text-center text-muted">:</span>
                      <span className="col-span-6 font-medium text-dark">{detailModal.activeItem.motherAadhaar || "-"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address details grid */}
              <div className="bg-[#fcfcfc] rounded-lg border border-[#e7eaec] p-4">
                <h4 className="text-teal font-bold text-[13px] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Icon name="fa-map-marker" /> {t("Address Details")}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
                  <div className="grid grid-cols-12 md:col-span-2">
                    <span className="col-span-3 font-semibold text-muted">{t("Address")}</span>
                    <span className="col-span-1 text-center text-muted">:</span>
                    <span className="col-span-8 font-medium text-dark">{detailModal.activeItem.address}</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-5 font-semibold text-muted">{t("District")}</span>
                    <span className="col-span-1 text-center text-muted">:</span>
                    <span className="col-span-6 font-medium text-dark">{detailModal.activeItem.district}</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-5 font-semibold text-muted">{t("State")}</span>
                    <span className="col-span-1 text-center text-muted">:</span>
                    <span className="col-span-6 font-medium text-dark">{detailModal.activeItem.state}</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-5 font-semibold text-muted">{t("PIN Code")}</span>
                    <span className="col-span-1 text-center text-muted">:</span>
                    <span className="col-span-6 font-medium text-dark">{detailModal.activeItem.pinCode}</span>
                  </div>
                </div>
              </div>

              {/* School details grid */}
              <div className="bg-[#fcfcfc] rounded-lg border border-[#e7eaec] p-4">
                <h4 className="text-teal font-bold text-[13px] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Icon name="fa-university" /> {t("Previous School Details")}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
                  <div className="grid grid-cols-12">
                    <span className="col-span-5 font-semibold text-muted">{t("Previous School")}</span>
                    <span className="col-span-1 text-center text-muted">:</span>
                    <span className="col-span-6 font-medium text-dark">{detailModal.activeItem.previousSchool || "-"}</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-5 font-semibold text-muted">{t("Previous School ID")}</span>
                    <span className="col-span-1 text-center text-muted">:</span>
                    <span className="col-span-6 font-medium text-dark">{detailModal.activeItem.previousSchoolId || "-"}</span>
                  </div>
                  <div className="grid grid-cols-12 md:col-span-2">
                    <span className="col-span-3 font-semibold text-muted">{t("School Address")}</span>
                    <span className="col-span-1 text-center text-muted">:</span>
                    <span className="col-span-8 font-medium text-dark">{detailModal.activeItem.previousSchoolAddress || "-"}</span>
                  </div>
                  <div className="grid grid-cols-12">
                    <span className="col-span-5 font-semibold text-muted">{t("Last Class Attended")}</span>
                    <span className="col-span-1 text-center text-muted">:</span>
                    <span className="col-span-6 font-medium text-dark">{detailModal.activeItem.lastClassAttended || "-"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal footer action buttons */}
            <div className="mt-6 pt-4 border-t border-[#f0f0f0] flex justify-between items-center">
              {detailModal.activeItem.status !== "Admission Confirmed" ? (
                <Button
                  variant="success"
                  disabled={admittingId === detailModal.activeItem.id}
                  onClick={() => handleAdmitStudent(detailModal.activeItem!)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 text-[13px] flex items-center gap-1.5 border-0 rounded"
                >
                  {admittingId === detailModal.activeItem.id ? (
                    <Spinner size="sm" />
                  ) : (
                    <>
                      <Icon name="fa-user-plus" />
                      <span>{t("Admit Student to DB")}</span>
                    </>
                  )}
                </Button>
              ) : (
                <div />
              )}
              <Button
                variant="secondary"
                onClick={detailModal.close}
                className="px-6 uppercase tracking-wider text-[12px]"
              >
                {t("Close")}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Inline Toast Notifications */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[9999] p-4 rounded-lg shadow-md text-white font-bold transition-all duration-300 flex items-center gap-2 animate-fadeIn ${toast.type === "success" ? "bg-teal bg-[#1abc9c] shadow-[#1abc9c]/20" : "bg-iconred bg-red-500 shadow-red-500/20"
          }`}>
          <Icon name={toast.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"} className="text-[16px]" />
          <span>{toast.message}</span>
        </div>
      )}
    </DashboardLayout>
  );
};
