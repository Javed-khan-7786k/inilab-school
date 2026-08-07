/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
import React, { useEffect, useState, useRef } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { Icon } from '../../components/ui/Icon';
import { PageHeaderBar } from '../../components/common/PageHeaderBar';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { useSearchAndFilter } from '../../hooks/useSearchAndFilter';
import { useModal } from '../../hooks/useModal';
import { dataService } from '../../services/dataService';
import type { HolidayItem } from '../../types';
import { Spinner } from '../../components/ui/Spinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import apiClient from '../../services/api/apiClient';
import {
  type ExportColumn,
  handleCopyToClipboard,
  handleExportCsv,
  exportExcelWithImages,
  exportExcelFromTemplate,
} from '../../Utils/exportService';
import { exportPdf } from '../../Utils/exportPdfwithoutImage';

export const HolidayPage: React.FC = () => {
  const { t } = useLanguage();
  const holidayModal = useModal<HolidayItem>();
  const [holidays, setHolidays] = useState<HolidayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchHolidays = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dataService.getHolidays();
      setHolidays(data);
    } catch (err: any) {
      setError(err.message || "Failed to load holidays");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const exportColumns: ExportColumn[] = [
    { header: 'Title', accessorKey: 'title' },
    { header: 'Date', accessorKey: 'date' },
    { header: 'Details', accessorKey: 'details' },
  ];

  const filename = "Holiday_Report";

  const handleCopy = () => {
    handleCopyToClipboard(filteredHolidays, exportColumns);
  };

  const handleExport = async (format: string) => {
    switch (format) {
      case 'csv':
        handleExportCsv(filteredHolidays, exportColumns, filename);
        break;
      case 'excel':
        try {
          await exportExcelWithImages(filteredHolidays, exportColumns, filename, {
            templateUrl: '/template.xlsx',
          });
        } catch (error) {
          console.warn('Excel export failed, falling back to template', error);
          await exportExcelFromTemplate(filteredHolidays, exportColumns, filename, {
            templateUrl: '/template.xlsx',
            startRow: 2,
          });
        }
        break;
      case 'pdf':
        try {

          await exportPdf(filteredHolidays, exportColumns, filename);
        } catch (error) {

          console.log("Error :",error)
        }
        break;
      default:
        break;
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

      const res = await apiClient.post(`/import/holidays`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = res.data?.data;
      const inserted = data?.insertedCount ?? 0;
      setImportResult({
        message: `${t('Imported')}: ${inserted}`,
        type: 'success',
      });
      fetchHolidays();
    } catch (err: any) {
      setImportResult({ message: err.response?.data?.message || err.message || t('Import failed'), type: 'error' });
    } finally {
      setImporting(false);
      setTimeout(() => setImportResult(null), 5000);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filterFn = (item: HolidayItem, term: string) =>
    item.title.toLowerCase().includes(term.toLowerCase()) ||
    item.details.toLowerCase().includes(term.toLowerCase());

  const {
    searchTerm,
    setSearchTerm,
    sortedData: filteredHolidays
  } = useSearchAndFilter<HolidayItem>({
    initialData: holidays,
    filterFn,
    initialSortField: 'id',
    initialSortOrder: 'asc'
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredHolidays.length, searchTerm]);

  const totalPages = Math.ceil(filteredHolidays.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHolidays = filteredHolidays.slice(startIndex, startIndex + itemsPerPage);

  return (
    <DashboardLayout>
      <div className="bg-white rounded-[4px] shadow-[0_1px_1px_rgba(0,0,0,.1)] border border-[#e7eaec] overflow-hidden">
        <PageHeaderBar titleKey="Holiday" iconName="fa-flag" />

        <div className="p-[15px]">
          {error && (
            <div className="mb-4">
              <ErrorMessage message={error} onRetry={fetchHolidays} />
            </div>
          )}

          {importResult && (
            <div className={`mb-4 p-3 rounded text-sm font-medium ${importResult.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {importResult.message}
            </div>
          )}

          {loading && holidays.length === 0 ? (
            <Spinner size="lg" />
          ) : (
            <div className="border border-[#e7eaec] rounded-[3px] overflow-hidden">
              <div className="bg-[#f8f9fa] border-b border-[#e7eaec] px-[15px] py-[10px] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 select-none">
                <div className="flex flex-wrap gap-2 items-center">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-2.5 py-1 text-[11px] font-normal border border-[#ccc] bg-white rounded hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer text-dark shadow-sm"
                  >
                    {t("Copy")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport('excel')}
                    className="px-2.5 py-1 text-[11px] font-normal border border-[#ccc] bg-white rounded hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer text-dark shadow-sm"
                  >
                    {t("Excel")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport('csv')}
                    className="px-2.5 py-1 text-[11px] font-normal border border-[#ccc] bg-white rounded hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer text-dark shadow-sm"
                  >
                    {t("CSV")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport('pdf')}
                    className="px-2.5 py-1 text-[11px] font-normal border border-[#ccc] bg-white rounded hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer text-dark shadow-sm"
                  >
                    {t("PDF")}
                  </button>

                  <div className="h-4 w-px bg-gray-300 mx-1 hidden sm:block"></div>

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
                    className="px-3 py-1 text-[11px] font-medium border border-[#1ab394] text-[#1ab394] bg-white rounded hover:bg-[#1ab394] hover:text-white transition-colors focus:outline-none cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    <Icon name={importing ? 'fa-spinner fa-spin' : 'fa-upload'} className="text-[10px]" />
                    {importing ? t('Importing...') : t('Import')}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-muted">{t("Search")}:</span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-[#dfe6e9] rounded px-3 py-1.5 text-[13px] text-dark focus:outline-none focus:ring-1 focus:ring-accent bg-white shadow-sm"
                  />
                </div>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full border-collapse">
                  <thead className="bg-[#f8f9fa] border-b border-[#e7eaec] select-none">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider w-12">#</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">{t("Title")}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider w-56">{t("Date")}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">{t("Details")}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider w-20">{t("Action")}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#f0f0f0]">
                    {filteredHolidays.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-muted bg-[#fdfdfd] text-[13px]">
                          {t("No data available in table")}
                        </td>
                      </tr>
                    ) : (
                      paginatedHolidays.map((item, index) => (
                        <tr key={item.id} className="hover:bg-[#fafafa] transition-colors">
                          <td className="px-4 py-3 text-sm text-dark">{startIndex + index + 1}</td>
                          <td className="px-4 py-3 text-sm text-dark font-medium">{t(item.title)}</td>
                          <td className="px-4 py-3 text-sm text-dark">{item.date}</td>
                          <td className="px-4 py-3 text-sm text-muted max-w-md truncate" title={item.details}>{item.details}</td>
                          <td className="px-4 py-3 text-sm text-dark">
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => holidayModal.open(item)}
                              className="rounded-[3px] px-[8px] py-[5px] text-[13px]"
                            >
                              <Icon name="fa-check-square-o" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="px-4 py-3 border-t border-[#e7eaec] select-none bg-[#fdfdfd]">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-[13px] text-muted">
                    {t("Showing")} {filteredHolidays.length > 0 ? startIndex + 1 : 0} {t("to")}{' '}
                    {Math.min(startIndex + itemsPerPage, filteredHolidays.length)} {t("of")} {filteredHolidays.length} {t("entries")}
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
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={holidayModal.isOpen}
        onClose={holidayModal.close}
        title={holidayModal.activeItem?.title || "Holiday Details"}
        maxWidthClass="max-w-lg"
      >
        {holidayModal.activeItem && (
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center text-[12px] text-muted border-b border-[#f0f0f0] pb-2">
              <span>{t("Holiday Date")}: {holidayModal.activeItem.date}</span>
              <span>ID: #{holidayModal.activeItem.id}</span>
            </div>
            <p className="text-[14px] text-dark leading-relaxed whitespace-pre-line">
              {holidayModal.activeItem.details}
            </p>
            <div className="pt-2 flex justify-end">
              <Button variant="success" onClick={holidayModal.close}>
                {t("Close")}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};
