/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useLanguage } from '../context/LanguageContext';
import { Icon } from '../components/ui/Icon';
import { PageHeaderBar } from '../components/common/PageHeaderBar';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { useSearchAndFilter } from '../hooks/useSearchAndFilter';
import { useModal } from '../hooks/useModal';
import { dataService } from '../services/dataService';
import type { LeaveApplication } from '../types';
import { Spinner } from '../components/ui/Spinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';

export const LeaveApplyPage: React.FC = () => {
  const { t } = useLanguage();
  const applyModal = useModal();
  const [leaves, setLeaves] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal Form States
  const [applyTo, setApplyTo] = useState<string>('Principal');
  const [category, setCategory] = useState<string>('Casual Leave');
  const [schedule, setSchedule] = useState<string>('');
  const [daysCount, setDaysCount] = useState<number>(1);

  const fetchLeaves = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dataService.getLeaves();
      setLeaves(data);
    } catch (err: any) {
      setError(err.message || "Failed to load leave applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleAddLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dataService.addLeave(applyTo, category, schedule, daysCount);
      await fetchLeaves(); // Reload list
      applyModal.close();
    } catch (err: any) {
      alert("Error submitting leave application: " + (err.message || err));
    }
  };

  const handleCopy = () => alert(t("Copy") + ": Success!");
  const handleExport = (format: string) => alert("Export to " + format.toUpperCase() + ": Success!");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filterFn = (leave: LeaveApplication, term: string) =>
    leave.applicationTo.toLowerCase().includes(term.toLowerCase()) ||
    leave.category.toLowerCase().includes(term.toLowerCase()) ||
    leave.status.toLowerCase().includes(term.toLowerCase());

  const {
    searchTerm,
    setSearchTerm,
    sortedData: filteredLeaves
  } = useSearchAndFilter<LeaveApplication>({
    initialData: leaves,
    filterFn,
    initialSortField: 'id',
    initialSortOrder: 'asc'
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredLeaves.length, searchTerm]);

  const totalPages = Math.ceil(filteredLeaves.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeaves = filteredLeaves.slice(startIndex, startIndex + itemsPerPage);

  return (
    <DashboardLayout>
      <div className="bg-white rounded-[4px] shadow-[0_1px_1px_rgba(0,0,0,.1)] border border-[#e7eaec] overflow-hidden">
        <PageHeaderBar titleKey="Leave Apply" iconName="fa-paper-plane" />

        {/* Main Content */}
        <div className="p-[15px]">
          {error && (
            <div className="mb-4">
              <ErrorMessage message={error} onRetry={fetchLeaves} />
            </div>
          )}

          {/* Add Leave Application Link */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => applyModal.open()}
              className="flex items-center gap-1.5 text-[#1abc9c] hover:text-[#16a085] font-semibold text-[14px] bg-transparent border-0 cursor-pointer focus:outline-none"
            >
              <span className="text-[16px] font-bold">+</span>
              <span className="underline">{t("Add a leave application")}</span>
            </button>
          </div>

          {loading && leaves.length === 0 ? (
            <Spinner size="lg" />
          ) : (
            <div className="border border-[#e7eaec] rounded-[3px] overflow-hidden">
            {/* Toolbar row */}
            <div className="bg-[#f8f9fa] border-b border-[#e7eaec] px-[15px] py-[10px] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 select-none">
              <div className="flex gap-2">
                <Button variant="export" onClick={handleCopy}>{t("Copy")}</Button>
                <Button variant="export" onClick={() => handleExport('excel')}>{t("Excel")}</Button>
                <Button variant="export" onClick={() => handleExport('csv')}>{t("CSV")}</Button>
                <Button variant="export" onClick={() => handleExport('pdf')}>{t("PDF")}</Button>
              </div>

              {/* Search input */}
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

            {/* Grid Table */}
            <div className="overflow-x-auto w-full">
              <table className="w-full border-collapse">
                <thead className="bg-[#f8f9fa] border-b border-[#e7eaec] select-none">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">{t("Application To")}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">{t("Category")}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">{t("Date")}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">{t("Schedule")}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">{t("Days")}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">{t("Attachment")}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">{t("Status")}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">{t("Action")}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#f0f0f0]">
                  {filteredLeaves.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-muted bg-[#fdfdfd] text-[13px]">
                        {t("No data available in table")}
                      </td>
                    </tr>
                  ) : (
                    paginatedLeaves.map((leave, index) => (
                      <tr key={leave.id} className="hover:bg-[#fafafa] transition-colors">
                        <td className="px-4 py-3 text-sm text-dark">{startIndex + index + 1}</td>
                        <td className="px-4 py-3 text-sm text-dark font-medium">{t(leave.applicationTo)}</td>
                        <td className="px-4 py-3 text-sm text-dark">{t(leave.category)}</td>
                        <td className="px-4 py-3 text-sm text-dark">{leave.date}</td>
                        <td className="px-4 py-3 text-sm text-dark">{leave.schedule}</td>
                        <td className="px-4 py-3 text-sm text-dark">{leave.days}</td>
                        <td className="px-4 py-3 text-sm text-dark">{leave.attachment}</td>
                        <td className="px-4 py-3 text-sm text-dark">
                          <span className={`px-2.5 py-1 rounded text-white text-[11px] font-semibold uppercase tracking-wider ${
                            leave.status === 'Approved' ? 'bg-teal' : 'bg-badgeorange'
                          }`}>
                            {t(leave.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-dark">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => alert(`Leave details for application #${leave.id}:\n\nTo: ${leave.applicationTo}\nCategory: ${leave.category}\nSchedule: ${leave.schedule}\nDays: ${leave.days}\nStatus: ${leave.status}`)}
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

            {/* Pagination Footer */}
            <div className="px-4 py-3 border-t border-[#e7eaec] select-none bg-[#fdfdfd]">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-[13px] text-muted">
                  {t("Showing")} {filteredLeaves.length > 0 ? startIndex + 1 : 0} {t("to")}{' '}
                  {Math.min(startIndex + itemsPerPage, filteredLeaves.length)} {t("of")} {filteredLeaves.length} {t("entries")}
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

      {/* Add Leave Application Modal Form */}
      <Modal
        isOpen={applyModal.isOpen}
        onClose={applyModal.close}
        title="Add a leave application"
      >
        <form onSubmit={handleAddLeave} className="p-6 space-y-4">
          <Select
            label={t("Application To")}
            value={applyTo}
            onChange={(e) => setApplyTo(e.target.value)}
            options={[
              { value: "Principal", label: "Principal" },
              { value: "Headmaster", label: "Headmaster" },
              { value: "Registrar", label: "Registrar" }
            ]}
          />

          <Select
            label={t("Category")}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: "Casual Leave", label: "Casual Leave" },
              { value: "Sick Leave", label: "Sick Leave" },
              { value: "Maternity Leave", label: "Maternity Leave" }
            ]}
          />

          <Input
            label={t("Schedule")}
            placeholder="e.g. 2026-07-20 to 2026-07-22"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
          />

          <Input
            label={t("Days")}
            type="number"
            min={1}
            value={daysCount}
            onChange={(e) => setDaysCount(Number(e.target.value))}
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={applyModal.close}
            >
              {t("Cancel")}
            </Button>
            <Button
              type="submit"
              variant="success"
            >
              {t("Apply")}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};
