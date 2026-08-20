/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { Icon } from '../../components/ui/Icon';
import { PageHeaderBar } from '../../components/common/PageHeaderBar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { useSearchAndFilter } from '../../hooks/useSearchAndFilter';
import { useModal } from '../../hooks/useModal';
import { dataService } from '../../services/dataService';
import type { Visitor } from '../../types';
import { Spinner } from '../../components/ui/Spinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';

import {
  type ExportColumn,
  handleCopyToClipboard,
  handleExportCsv,
  exportExcelWithImages,
  exportPdfWithImages,
} from '../../Utils/exportService';

export const VisitorPage: React.FC = () => {
  const { t } = useLanguage();
  const visitorModal = useModal<Visitor>();
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVisitors = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dataService.getVisitors();
      setVisitors(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load visitors');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchVisitors();
  }, []);

  const [formName, setFormName] = useState('');
  const [formToMeet, setFormToMeet] = useState('');

  const handleAddVisitor = async () => {
    if (!formName.trim()) {
      alert(t("Name is required"));
      return;
    }
    try {
      const newV = await dataService.addVisitor({
        name: formName,
        toMeet: formToMeet || 'Management',
        checkIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        checkOut: '-',
        date: new Date().toLocaleDateString(),
        status: 'In',
      });
      setVisitors([newV, ...visitors]);
      setFormName('');
      setFormToMeet('');
      setActiveTab('list');
    } catch (err: any) {
      alert("Error adding visitor: " + (err.message || err));
    }
  };

  const handleDeleteVisitor = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this visitor record?")) {
      try {
        await dataService.deleteVisitor(id);
        setVisitors(visitors.filter((v) => v.id !== id));
      } catch (err: any) {
        alert("Error deleting visitor: " + (err.message || err));
      }
    }
  };

  const handleCheckoutVisitor = async (id: string | number) => {
    try {
      const updated = await dataService.updateVisitor(id, {
        checkOut: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Out',
      });
      setVisitors(visitors.map((v) => (v.id === id ? updated : v)));
      alert("Visitor checked out successfully!");
    } catch (err: any) {
      alert("Error checking out visitor: " + (err.message || err));
    }
  };

  const exportColumns: ExportColumn[] = [
    { header: "Name", accessorKey: "name" },
    { header: "To Meet", accessorKey: "toMeet" },
    { header: "Check In", accessorKey: "checkIn" },
    { header: "Check Out", accessorKey: "checkOut" },
    { header: "Date", accessorKey: "date" },
    { header: "Status", accessorKey: "status" },
  ];

  const handleCopy = () => {
    handleCopyToClipboard(visitors, exportColumns);
  };

  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    const filename = "visitor-list";
    if (format === "csv") {
      handleExportCsv(visitors, exportColumns, filename);
    } else if (format === "excel") {
      try {
        await exportExcelWithImages(visitors, exportColumns, filename);
      } catch {
        handleExportCsv(visitors, exportColumns, filename);
      }
    } else if (format === "pdf") {
      try {
        await exportPdfWithImages(visitors, exportColumns, filename);
      } catch {
        handleExportCsv(visitors, exportColumns, filename);
      }
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filterFn = (v: Visitor, term: string) =>
    v.name.toLowerCase().includes(term.toLowerCase()) ||
    v.toMeet.toLowerCase().includes(term.toLowerCase());

  const {
    searchTerm,
    setSearchTerm,
    sortedData: filteredVisitors
  } = useSearchAndFilter<Visitor>({
    initialData: visitors,
    filterFn,
    initialSortField: 'id',
    initialSortOrder: 'asc'
  });

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filteredVisitors.length, searchTerm]);

  const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVisitors = filteredVisitors.slice(startIndex, startIndex + itemsPerPage);

  return (
    <DashboardLayout>
      <div className="bg-white rounded-[4px] shadow-[0_1px_1px_rgba(0,0,0,.1)] border border-[#e7eaec] overflow-hidden">
        <PageHeaderBar titleKey="Visitor Information" iconName="fa-user-secret" />

        {/* Tab switcher headers */}
        <div className="bg-[#f5f7f8] border-b border-[#e7eaec] px-[15px] flex space-x-1 select-none">
          <Button
            variant="link"
            onClick={() => setActiveTab('list')}
            className={`px-4 py-3 text-[13px] font-semibold border-b-2 rounded-none hover:no-underline active:scale-100 shadow-none ${
              activeTab === 'list'
                ? 'border-teal text-teal font-bold'
                : 'border-transparent text-muted hover:text-dark'
            }`}
          >
            {t("Visitor List")}
          </Button>
          <Button
            variant="link"
            onClick={() => setActiveTab('add')}
            className={`px-4 py-3 text-[13px] font-semibold border-b-2 rounded-none hover:no-underline active:scale-100 shadow-none ${
              activeTab === 'add'
                ? 'border-teal text-teal font-bold'
                : 'border-transparent text-muted hover:text-dark'
            }`}
          >
            {t("Visitor Add")}
          </Button>
        </div>

        {/* Tab contents */}
        <div className="p-[15px]">
          {error && (
            <div className="mb-4">
              <ErrorMessage message={error} onRetry={fetchVisitors} />
            </div>
          )}
          {loading && visitors.length === 0 ? (
            <Spinner size="lg" />
          ) : activeTab === 'list' ? (
            <div className="border border-[#e7eaec] rounded-[3px] overflow-hidden">
              {/* Toolbar */}
              <div className="bg-[#f8f9fa] border-b border-[#e7eaec] px-[15px] py-[10px] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 select-none">
                <div className="flex gap-2">
                  <Button variant="export" onClick={handleCopy}>{t("Copy")}</Button>
                  <Button variant="export" onClick={() => handleExport('excel')}>{t("Excel")}</Button>
                  <Button variant="export" onClick={() => handleExport('csv')}>{t("CSV")}</Button>
                  <Button variant="export" onClick={() => handleExport('pdf')}>{t("PDF")}</Button>
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

              {/* Data Table */}
              <div className="overflow-x-auto w-full">
                <table className="w-full border-collapse">
                  <thead className="bg-[#f8f9fa] border-b border-[#e7eaec] select-none">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider w-12">#</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">{t("Visitor ID")}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">{t("Name")}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">{t("To meet")}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">{t("Check in")}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">{t("Check out")}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider w-24">{t("Status")}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider w-28">{t("Action")}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#f0f0f0]">
                    {filteredVisitors.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-muted bg-[#fdfdfd] text-[13px]">
                          {t("No data available in table")}
                        </td>
                      </tr>
                    ) : (
                      paginatedVisitors.map((v, index) => (
                        <tr key={v.id} className="hover:bg-[#fafafa] transition-colors">
                          <td className="px-4 py-3 text-sm text-dark">{startIndex + index + 1}</td>
                          <td className="px-4 py-3 text-sm text-dark">{v.visitorId}</td>
                          <td className="px-4 py-3 text-sm text-dark font-medium">{v.name}</td>
                          <td className="px-4 py-3 text-sm text-dark">{v.toMeet}</td>
                          <td className="px-4 py-3 text-sm text-dark">{v.checkIn}</td>
                          <td className="px-4 py-3 text-sm text-dark">{v.checkOut || '-'}</td>
                          <td className="px-4 py-3 text-sm text-dark select-none">
                            <Button
                              variant={v.status === 'in' ? 'success' : 'secondary'}
                              size="sm"
                              onClick={() => v.status === 'in' && handleCheckoutVisitor(v.id)}
                              className={`px-2.5 py-0.5 rounded text-white text-[11px] font-semibold uppercase tracking-wider border-0 cursor-pointer ${
                                v.status === 'in' ? 'hover:opacity-90' : 'opacity-60 cursor-default shadow-none bg-muted active:scale-100 hover:bg-muted'
                              }`}
                            >
                              {t(v.status)}
                            </Button>
                          </td>
                          <td className="px-4 py-3 text-sm text-dark flex items-center gap-1.5">
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => visitorModal.open(v)}
                              className="rounded-[3px] px-[8px] py-[5px] text-[13px]"
                            >
                              <Icon name="fa-check-square-o" />
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteVisitor(v.id)}
                              className="rounded-[3px] px-[8px] py-[5px] text-[13px]"
                            >
                              <Icon name="fa-trash" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-4 py-3 border-t border-[#e7eaec] select-none bg-[#fdfdfd]">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-[13px] text-muted">
                    {t("Showing")} {filteredVisitors.length > 0 ? startIndex + 1 : 0} {t("to")}{' '}
                    {Math.min(startIndex + itemsPerPage, filteredVisitors.length)} {t("of")} {filteredVisitors.length} {t("entries")}
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
          ) : (
            /* Visitor Add Form */
            <div className="max-w-md border border-[#e7eaec] rounded-lg p-6 bg-[#fdfdfd] shadow-sm select-none mx-auto animate-fadeIn">
              <h3 className="text-[16px] font-semibold text-dark mb-4 pb-2 border-b border-[#f0f0f0]">
                {t("Add Visitor Information")}
              </h3>
              <form onSubmit={handleAddVisitor} className="space-y-4">
                <Input
                  label={t("Name")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name..."
                  requiredField
                />

                <Select
                  label={t("To meet")}
                  value={toMeet}
                  onChange={(e) => setToMeet(e.target.value)}
                  options={[
                    { value: "Lewis Rowley", label: "Lewis Rowley" },
                    { value: "Sarah Connor", label: "Sarah Connor" },
                    { value: "Alice Smith", label: "Alice Smith" }
                  ]}
                />

                <Select
                  label={t("Status")}
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'in' | 'out')}
                  options={[
                    { value: "in", label: "In" },
                    { value: "out", label: "Out" }
                  ]}
                />

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setActiveTab('list')}
                  >
                    {t("Cancel")}
                  </Button>
                  <Button
                    type="submit"
                    variant="success"
                  >
                    {t("Save")}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Visitor Detail Modal */}
      <Modal
        isOpen={visitorModal.isOpen}
        onClose={visitorModal.close}
        title="Visitor Details"
      >
        {visitorModal.activeItem && (
          <div className="p-6 space-y-3">
            <div className="flex justify-between py-2 border-b border-[#f0f0f0] text-[13px]">
              <span className="font-semibold text-muted">{t("Visitor ID")}</span>
              <span className="font-bold text-dark">{visitorModal.activeItem.visitorId}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#f0f0f0] text-[13px]">
              <span className="font-semibold text-muted">{t("Name")}</span>
              <span className="font-bold text-dark">{visitorModal.activeItem.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#f0f0f0] text-[13px]">
              <span className="font-semibold text-muted">{t("To meet")}</span>
              <span className="font-bold text-dark">{visitorModal.activeItem.toMeet}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#f0f0f0] text-[13px]">
              <span className="font-semibold text-muted">{t("Check in")}</span>
              <span className="font-medium text-dark">{visitorModal.activeItem.checkIn}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#f0f0f0] text-[13px]">
              <span className="font-semibold text-muted">{t("Check out")}</span>
              <span className="font-medium text-dark">{visitorModal.activeItem.checkOut || '-'}</span>
            </div>
            <div className="flex justify-between py-2 text-[13px]">
              <span className="font-semibold text-muted">{t("Status")}</span>
              <span className={`px-2.5 py-0.5 rounded text-white text-[11px] font-semibold uppercase tracking-wider ${
                visitorModal.activeItem.status === 'in' ? 'bg-teal' : 'bg-muted opacity-60'
              }`}>
                {t(visitorModal.activeItem.status)}
              </span>
            </div>

            <div className="pt-4 flex justify-end">
              <Button variant="success" onClick={visitorModal.close}>
                {t("Close")}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};
