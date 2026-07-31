/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useLanguage } from '../context/LanguageContext';
import { Icon } from '../components/ui/Icon';
import { PageHeaderBar } from '../components/common/PageHeaderBar';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { useSearchAndFilter } from '../hooks/useSearchAndFilter';
import { useModal } from '../hooks/useModal';
import { dataService } from '../services/dataService';
import type { EventItem } from '../types';
import { Spinner } from '../components/ui/Spinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { authService } from '../services/authService';
import {
  type ExportColumn,
  handleCopyToClipboard,
  handleExportCsv,
  exportExcelWithImages,
  exportExcelFromTemplate,
  // exportPdfWithImages,
  // exportPdfFromTemplate
} from '../Utils/exportService';
import { exportPdf } from '../Utils/exportPdfwithoutImage';

export const EventPage: React.FC = () => {
  const { t } = useLanguage();
  const eventModal = useModal<EventItem>();
  const addEditModal = useModal<EventItem>();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userRole = authService.getUserRole();
  const isAdmin = userRole === 'Admin';

  const [formData, setFormData] = useState<Omit<EventItem, 'id'>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    details: '',
    targetRoles: []
  });

  const roles = ["Admin", "Teacher", "Student", "Parent", "Accountant", "Librarian", "Receptionist"];

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dataService.getEvents();
      // Filter based on role if not admin
      const filtered = isAdmin
        ? data
        : data.filter(e => !e.targetRoles || e.targetRoles.length === 0 || e.targetRoles.includes(userRole));

      setEvents(filtered);
    } catch (err: any) {
      setError(err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (addEditModal.activeItem) {
        await dataService.updateEvent(addEditModal.activeItem.id, formData);
      } else {
        await dataService.addEvent(formData);
      }
      addEditModal.close();
      fetchEvents();
    } catch (err: any) {
      alert(err.message || "Failed to save event");
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm(t("Are you sure you want to delete this event?"))) return;
    try {
      await dataService.deleteEvent(id);
      fetchEvents();
    } catch (err: any) {
      alert(err.message || "Failed to delete event");
    }
  };

  const openAddModal = () => {
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      details: '',
      targetRoles: []
    });
    addEditModal.open();
  };

  const openEditModal = (item: EventItem) => {
    setFormData({
      title: item.title,
      date: item.date,
      details: item.details,
      targetRoles: item.targetRoles || []
    });
    addEditModal.open(item);
  };

  const toggleRole = (role: string) => {
    setFormData((prev: Omit<EventItem, 'id'>) => ({
      ...prev,
      targetRoles: prev.targetRoles?.includes(role)
        ? prev.targetRoles.filter((r: string) => r !== role)
        : [...(prev.targetRoles || []), role]
    }));
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filterFn = (item: EventItem, term: string) =>
    item.title.toLowerCase().includes(term.toLowerCase()) ||
    item.details.toLowerCase().includes(term.toLowerCase());

  const {
    searchTerm,
    setSearchTerm,
    sortedData: filteredEvents
  } = useSearchAndFilter<EventItem>({
    initialData: events,
    filterFn,
    initialSortField: 'date',
    initialSortOrder: 'desc'
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredEvents.length, searchTerm]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);

  const exportColumns: ExportColumn[] = [
    { header: 'Title', accessorKey: 'title' },
    { header: 'Date', accessorKey: 'date' },
    { header: 'Details', accessorKey: 'details' },
  ];

  const handleCopy = () => {
    handleCopyToClipboard(filteredEvents, exportColumns);
  };

  const handleExport = async (format: string) => {
    const filename = "Event_Report";
    switch (format) {
      case 'csv':
        handleExportCsv(filteredEvents, exportColumns, filename);
        break;
      case 'excel':
        try {
          await exportExcelWithImages(filteredEvents, exportColumns, filename, {
            templateUrl: '/template.xlsx',
          });
        } catch (error) {
          await exportExcelFromTemplate(filteredEvents, exportColumns, filename, {
            templateUrl: '/template.xlsx',
            startRow: 2,
          });
        }
        break;
      case 'pdf':
        try {
          await exportPdf(filteredEvents, exportColumns, filename);

        } catch (error) {
          console.log(error)

        }
        break;
      default:
        break;
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-[4px] shadow-[0_1px_1px_rgba(0,0,0,.1)] border border-[#e7eaec] overflow-hidden">
        <PageHeaderBar
          titleKey="Event"
          iconName="fa-calendar-check-o"

        />

        <div className="p-[15px]">
          {error && (
            <div className="mb-4">
              <ErrorMessage message={error} onRetry={fetchEvents} />
            </div>
          )}
          {loading && events.length === 0 ? (
            <Spinner size="lg" />
          ) : (
            <div className="border border-[#e7eaec] rounded-[3px] overflow-hidden">
            <div className="bg-[#f8f9fa] border-b border-[#e7eaec] px-[15px] py-[10px] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 select-none">
              <div className="flex gap-2">
                <Button variant="export" size="sm" onClick={handleCopy}>{t("Copy")}</Button>
                <Button variant="export" size="sm" onClick={() => handleExport('excel')}>{t("Excel")}</Button>
                <Button variant="export" size="sm" onClick={() => handleExport('csv')}>{t("CSV")}</Button>
                <Button variant="export" size="sm" onClick={() => handleExport('pdf')}>{t("PDF")}</Button>
              </div>

              
              <div className="flex items-center gap-2">
               {isAdmin && (
            <Button  size="sm" onClick={openAddModal} className="border border-[#dfe6e9] rounded px-3 py-1.5 text-[13px] text-dark focus:outline-none focus:ring-1 focus:ring-accent hover:bg-white bg-white shadow-sm">
              <Icon className="text-[13px] text-muted hover:text-muted" name="fa-plus" /> <span className="text-[13px] text-muted">{t("Add Event")}</span>
            </Button>
          )}

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
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider w-36">{t("Date")}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">{t("Details")}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider w-32">{t("Action")}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#f0f0f0]">
                  {filteredEvents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted bg-[#fdfdfd] text-[13px]">
                        {t("No data available in table")}
                      </td>
                    </tr>
                  ) : (
                    paginatedEvents.map((item, index) => (
                      <tr key={item.id} className="hover:bg-[#fafafa] transition-colors text-dark">
                        <td className="px-4 py-3 text-sm">{startIndex + index + 1}</td>
                        <td className="px-4 py-3 text-sm font-medium">{t(item.title)}</td>
                        <td className="px-4 py-3 text-sm">{item.date}</td>
                        <td className="px-4 py-3 text-sm text-muted max-w-md truncate" title={item.details}>{item.details}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-1.5">
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => eventModal.open(item)}
                              className="rounded-[3px] px-[8px] py-[4px] text-[12px]"
                              title={t("View")}
                            >
                              <Icon name="fa-check-square-o" />
                            </Button>
                            {isAdmin && (
                              <>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => openEditModal(item)}
                                  className="rounded-[3px] px-[8px] py-[4px] text-[12px] bg-[#1c84c6] border-[#1c84c6]"
                                  title={t("Edit")}
                                >
                                  <Icon name="fa-pencil" />
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleDelete(item.id)}
                                  className="rounded-[3px] px-[8px] py-[4px] text-[12px]"
                                  title={t("Delete")}
                                >
                                  <Icon name="fa-trash" />
                                </Button>
                              </>
                            )}
                          </div>
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
                  {t("Showing")} {filteredEvents.length > 0 ? startIndex + 1 : 0} {t("to")}{' '}
                  {Math.min(startIndex + itemsPerPage, filteredEvents.length)} {t("of")} {filteredEvents.length} {t("entries")}
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

      {/* View Modal */}
      <Modal
        isOpen={eventModal.isOpen}
        onClose={eventModal.close}
        title={eventModal.activeItem?.title || "Event Details"}
        maxWidthClass="max-w-lg"
      >
        {eventModal.activeItem && (
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center text-[12px] text-muted border-b border-[#f0f0f0] pb-2">
              <span>{t("Event Date")}: {eventModal.activeItem.date}</span>
              <div className="flex gap-1">
                {(eventModal.activeItem.targetRoles || []).map((role: string) => (
                  <span key={role} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-medium border border-blue-100">
                    {role}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-[14px] text-dark leading-relaxed whitespace-pre-line">
              {eventModal.activeItem.details}
            </p>
            <div className="pt-2 flex justify-end">
              <Button variant="success" onClick={eventModal.close}>
                {t("Close")}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={addEditModal.isOpen}
        onClose={addEditModal.close}
        title={addEditModal.activeItem ? t("Edit Event") : t("Add Event")}
        maxWidthClass="max-w-2xl"
      >
        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-dark">{t("Title")} <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border border-[#ccc] rounded px-3 py-2 text-[14px] focus:outline-none focus:border-accent"
              placeholder={t("Enter event title")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-dark">{t("Date")} <span className="text-red-500">*</span></label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full border border-[#ccc] rounded px-3 py-2 text-[14px] focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-dark">{t("User Type (Target Roles)")}</label>
            <div className="flex flex-wrap gap-2 pt-1">
              {roles.map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
                    formData.targetRoles?.includes(role)
                      ? 'bg-accent text-white border-accent'
                      : 'bg-white text-muted border-[#ccc] hover:bg-gray-50'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-muted mt-1">{t("If none selected, it will be visible to everyone.")}</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-dark">{t("Event Details")} <span className="text-red-500">*</span></label>
            <textarea
              required
              rows={6}
              value={formData.details}
              onChange={e => setFormData(prev => ({ ...prev, details: e.target.value }))}
              className="w-full border border-[#ccc] rounded px-3 py-2 text-[14px] focus:outline-none focus:border-accent resize-none"
              placeholder={t("Enter event details...")}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[#f0f0f0]">
            <Button variant="secondary" type="button" onClick={addEditModal.close}>
              {t("Cancel")}
            </Button>
            <Button variant="success" type="submit">
              {addEditModal.activeItem ? t("Update") : t("Save")}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};
