import React, { useRef, useState, useEffect } from 'react';
import apiClient from '../../services/api/apiClient';
import { DashboardLayout } from '../layout/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { Icon } from '../ui/Icon';
import { useNavigate } from 'react-router-dom';
import { PageHeaderBar } from './PageHeaderBar';
import { useSearchAndFilter } from '../../hooks/useSearchAndFilter';
import { authService } from '../../services/authService';
import {
  type ExportColumn,
  handleCopyToClipboard,
  handleExportCsv,
  exportExcelFromTemplate,
  exportExcelWithImages,
  exportPdfFromTemplate,
  exportPdfWithImages,
} from '../../Utils/exportService';

export interface Column<T> {
  key: keyof T | 'action' | 'status';
  label: string;
  sortable?: boolean;
  render?: (item: T, id: string | number) => React.ReactNode;
}

interface GenericTablePageProps<T extends { id: string | number }> {
  titleKey: string; // e.g. "Student", "Teacher", "Parents", "User"
  iconName: string; // e.g. "fa-user"
  columns: Column<T>[];
  initialData: T[];
  filterFn: (item: T, searchTerm: string, selectedClass: string) => boolean;
  showClassFilter?: boolean;
  importEntity?: string; // e.g. "students", "teachers", "users" — enables Import button
  onImportSuccess?: () => void; // callback to refresh data after import
  onAddClick?: () => void; // callback for + Add button
}

export function GenericTablePage<T extends { id: string | number }>({
  titleKey,
  iconName,
  columns,
  initialData,
  filterFn,
  showClassFilter = false,
  importEntity,
  onImportSuccess,
  onAddClick,
}: GenericTablePageProps<T>) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // console.log('GenericTablePage rendered with initialData:', initialData); // Debugging log
  // console.log('GenericTablePage rendered with columns:', columns); // Debugging log
  // console.log('GenericTablePage rendered with titleKey:', titleKey); // Debugging log
  // console.log('GenericTablePage rendered with iconName:', iconName); // Debugging log
  // console.log('GenericTablePage rendered with showClassFilter:', showClassFilter); // Debugging log
  // console.log('GenericTablePage rendered with importEntity:', importEntity); // Debugging log
  // console.log('GenericTablePage rendered with onImportSuccess:', onImportSuccess); // Debugging log
  // console.log('GenericTablePage rendered with onAddClick:', onAddClick); // Debugging log

  // ─── Pagination state ───────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ─── Import state ─────────────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset for next pick
    e.target.value = '';

    if (!file.name.endsWith('.xlsx')) {
      setImportResult({ message: t('Only .xlsx files are allowed'), type: 'error' });
      setTimeout(() => setImportResult(null), 4000);
      return;
    }

    setImporting(true);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await apiClient.post(`/import/${importEntity}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = res.data?.data;
      const inserted = data?.insertedCount ?? 0;
      const skipped = data?.skippedRows?.length ?? 0;
      setImportResult({
        message: `${t('Imported')}: ${inserted} | ${t('Skipped')}: ${skipped}`,
        type: 'success',
      });
      onImportSuccess?.();
    } catch (err: any) {
      setImportResult({ message: err.message || t('Import failed'), type: 'error' });
    } finally {
      setImporting(false);
      setTimeout(() => setImportResult(null), 5000);
    }
  };
  const {
    searchTerm,
    setSearchTerm,
    filterValue: selectedClass,
    setFilterValue: setSelectedClass,
    sortField,
    sortOrder,
    handleSort,
    sortedData
  } = useSearchAndFilter<T>({
    initialData,
    filterFn,
    initialSortField: 'id',
    initialSortOrder: 'asc'
  });

  // Reset page to 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [sortedData.length, searchTerm, selectedClass]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const exportColumns: ExportColumn[] = columns
    .filter((col) => col.key !== 'action')
    .map((col) => ({
      header: col.label,
      accessorKey: String(col.key),
    }));

  const filename = titleKey.toLowerCase().replace(/\s+/g, '-');

  const handleCopy = () => {
    handleCopyToClipboard(sortedData, exportColumns);
  };

  const handleExport = async (format: string) => {
    const imageColumn = exportColumns.find((col) =>
      /photo|image|avatar/i.test(col.header) || col.accessorKey === 'photo'
    );
    const imageColumnKey = imageColumn?.accessorKey;

    switch (format) {
      case 'csv':
        handleExportCsv(sortedData, exportColumns, filename);
        break;
      case 'excel':
        try {
          await exportExcelWithImages(sortedData, exportColumns, filename, {
            templateUrl: '/template.xlsx',
            imageColumnKey: imageColumnKey ?? 'photo',
            imageSize: { width: 60, height: 60 },
          });
          break;
        } catch (error) {
          console.warn('Excel image export failed, falling back to template export', error);
        }

        try {
          await exportExcelFromTemplate(sortedData, exportColumns, filename, {
            templateUrl: '/template.xlsx',
            startRow: 2,
          });
          break;
        } catch (error) {
          console.warn('Template Excel export failed, falling back to CSV export', error);
          handleExportCsv(sortedData, exportColumns, filename);
        }
        break;
      case 'pdf':
        try {
          await exportPdfWithImages(sortedData, exportColumns, filename, {
            imageColumnKey: imageColumnKey ?? 'photo',
            imageSize: { width: 30, height: 30 },
          });
          break;
        } catch (error) {
          console.warn('PDF image export failed, falling back to PDF template export', error);
        }

        try {
          await exportPdfFromTemplate(sortedData, filename, {
            templateUrl: '/my_form_template.pdf',
            fieldMap: {
              studentName: 'name',
              studentId: 'id',
              photo: 'photo',
            },
            imageFieldMap: {
              photo: { dataKey: 'photo', x: 360, y: 620, width: 120, height: 120 },
            },
          });
        } catch (error) {
          console.warn('PDF template export failed, falling back to CSV export', error);
          handleExportCsv(sortedData, exportColumns, filename);
        }
        break;
      default:
        break;
    }
  };

 const renderSortIcon = (key: keyof T | "status" | "action") => {
    if (key === 'action') return null;
    return (
      <span className="text-[10px] text-gray-400 ml-1.5 inline-block">
        {sortField === key ? (sortOrder === 'asc' ? '▲' : '▼') : '▲▼'}
      </span>
    );
  };

  const userRole = authService.getUserRole();
  const isAdmin = userRole === "Admin";

  return (
    <DashboardLayout>
      <div className="bg-white rounded-[4px] shadow-[0_1px_1px_rgba(0,0,0,.1)] border border-[#e7eaec] overflow-hidden">
        {/* Header Section using PageHeaderBar */}
        <PageHeaderBar titleKey={titleKey} iconName={iconName} />

        {/* Main Content Area */}
        <div className="p-[15px]">
          {/* Top Row: Add Button on Left (ADMIN ONLY) + Select Class Dropdown on Right */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-4 select-none">
            <div>
              {isAdmin && (
                <button
                  type="button"
                  onClick={onAddClick}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-dark bg-white border border-[#ccc] rounded hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
                >
                  <span className="text-base leading-none font-bold text-gray-500">+</span>
                  <span>{t("Add a " + titleKey.toLowerCase())}</span>
                </button>
              )}
            </div>

            {showClassFilter && (
              <div>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="border border-[#1ab394] rounded px-3 py-1.5 text-dark bg-white focus:outline-none focus:ring-1 focus:ring-[#1ab394] text-[13px] min-w-[170px] shadow-sm"
                >
                  <option value="">{t("Select Class")}</option>
                  <option value="Class 1">Class 1</option>
                  <option value="Class 2">Class 2</option>
                  <option value="Class 3">Class 3</option>
                </select>
              </div>
            )}
          </div>

          {/* Table Container Card */}
          <div className="border border-[#e7eaec] rounded-[3px] overflow-hidden bg-white">
            {/* Tab Header Strip */}
            <div className="bg-[#f5f5f5] border-b border-[#e7eaec] px-4 py-2">
              <span className="inline-block bg-white border border-[#e7eaec] border-b-white rounded-t px-4 py-1.5 text-[13px] font-bold text-dark select-none -mb-[9px]">
                {t("All " + titleKey + "s") || t("All Students")}
              </span>
            </div>

            {/* Toolbar Header: Export Buttons on Left, Search on Right */}
            <div className="bg-white border-b border-[#e7eaec] px-3 py-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              {/* Export & Import Buttons */}
              <div className="flex flex-wrap gap-1.5 select-none">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-0.5 text-[11px] font-normal border border-[#ccc] bg-white rounded hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer text-dark shadow-sm"
                >
                  {t("Copy")}
                </button>
                <button
                  type="button"
                  onClick={() => handleExport('excel')}
                  className="px-2.5 py-0.5 text-[11px] font-normal border border-[#ccc] bg-white rounded hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer text-dark shadow-sm"
                >
                  {t("Excel")}
                </button>
                <button
                  type="button"
                  onClick={() => handleExport('csv')}
                  className="px-2.5 py-0.5 text-[11px] font-normal border border-[#ccc] bg-white rounded hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer text-dark shadow-sm"
                >
                  {t("CSV")}
                </button>
                <button
                  type="button"
                  onClick={() => handleExport('pdf')}
                  className="px-2.5 py-0.5 text-[11px] font-normal border border-[#ccc] bg-white rounded hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer text-dark shadow-sm"
                >
                  {t("PDF")}
                </button>

                {importEntity && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <button
                      type="button"
                      onClick={handleImportClick}
                      disabled={importing}
                      className="px-3 py-1 text-[12px] font-medium border border-[#1ab394] text-[#1ab394] bg-white rounded hover:bg-[#1ab394] hover:text-white transition-colors focus:outline-none cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5"
                    >
                      <Icon name={importing ? 'fa-spinner fa-spin' : 'fa-upload'} className="text-[11px]" />
                      {importing ? t('Importing...') : t('Import')}
                    </button>
                  </>
                )}
              </div>

              {/* Search Box on the Right */}
              <div className="flex items-center space-x-2">
                <label className="text-[13px] text-gray-600 font-medium">{t("Search")}:</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-[#ccc] rounded px-2 py-0.5 text-[12px] text-dark focus:outline-none focus:border-[#1ab394] bg-white shadow-inner w-[130px] sm:w-[160px]"
                />
              </div>

              {/* Import result toast */}
              {importResult && (
                <div className={`text-[12px] font-semibold px-3 py-1 rounded ${importResult.type === 'success'
                  ? 'bg-[#d4edda] text-[#155724] border border-[#c3e6cb]'
                  : 'bg-[#f8d7da] text-[#721c24] border border-[#f5c6cb]'
                  }`}>
                  {importResult.message}
                </div>
              )}
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto w-full">
              <table className="w-full border-collapse">
                <thead className="bg-white border-b-2 border-[#e7eaec]">
                  <tr className="select-none">
                    {columns.map((col) => (
                      <th
                        key={String(col.key)}
                        onClick={() => col.sortable !== false && handleSort(col.key)}
                        className={`px-3 py-1.5 text-left text-[12px] font-bold text-[#676a6c] ${col.sortable !== false ? 'cursor-pointer hover:bg-gray-50' : ''
                        } transition-colors border-b border-[#e7eaec]`}
                      >
                        <div className="flex items-center space-x-1">
                          <span>{t(col.label)}</span>
                          {col.sortable !== false && renderSortIcon(col.key)}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#e7eaec]">
                  {sortedData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="px-4 py-6 text-center text-[#676a6c] bg-[#fcfcfc] text-[13px]"
                      >
                        {t("No data available in table")}
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((item, index) => (
                      <tr key={item.id} className={`hover:bg-[#f0f0f0] transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#f1f1f1]'
                      }`}>
                        {columns.map((col) => (
                          <td key={String(col.key)} className="px-3 py-1.5 whitespace-nowrap text-[12px] text-dark border-b border-[#e7eaec]">
                            {col.render ? (
                              col.render(item, item.id)
                            ) : col.key === 'action' ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const keyMapping: Record<string, string> = {
                                    "Student": "student",
                                    "Teacher": "teacher",
                                    "Parents": "parents",
                                    "User": "user",
                                    "Student Attendance": "student-attendance",
                                    "Teacher Attendance": "teacher-attendance",
                                    "User Attendance": "user-attendance",
                                  };
                                  const typeParam = keyMapping[titleKey] || "student";
                                  const isAttendance = typeParam.endsWith("attendance");
                                  // Use rawId if available (StudentListItem), else use id
                                  const targetId = (item as any).rawId || item.id;
                                  const targetUrl = isAttendance
                                    ? `/dashboard/view/${typeParam}/Attendence/${targetId}`
                                    : `/dashboard/view/${typeParam}/${targetId}`;
                                  navigate(targetUrl);
                                }}
                                  className="inline-block rounded-[3px] bg-[#1ab394] px-[6px] py-[3px] text-[11px] text-white cursor-pointer hover:bg-[#18a689] transition-colors border-0 shadow-sm"
                              >
                                <Icon name="fa-check-square-o" />
                              </button>
                            ) : col.key === 'id' ? (
                              startIndex + index + 1
                            ) : (
                              String(item[col.key as keyof T] || '')
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-3 py-2 border-t border-[#e7eaec] bg-white select-none">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-[13px] text-[#676a6c]">
                  {t("Showing")} {sortedData.length > 0 ? startIndex + 1 : 0} {t("to")}{' '}
                  {Math.min(startIndex + itemsPerPage, sortedData.length)} {t("of")} {sortedData.length} {t("entries")}
                </div>
                <div className="flex space-x-1">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="px-3 py-1.5 text-[12px] font-normal border border-[#ccc] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors cursor-pointer text-dark bg-white shadow-sm"
                  >
                    {t("Previous")}
                  </button>
                  <button
                    type="button"
                    disabled={currentPage >= totalPages || totalPages === 0}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="px-3 py-1.5 text-[12px] font-normal border border-[#ccc] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors cursor-pointer text-dark bg-white shadow-sm"
                  >
                    {t("Next")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
