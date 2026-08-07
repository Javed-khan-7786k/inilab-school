/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { Icon } from '../../components/ui/Icon';
import { PageHeaderBar } from '../../components/common/PageHeaderBar';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useSearchAndFilter } from '../../hooks/useSearchAndFilter';
import { useModal } from '../../hooks/useModal';
import {
  type ExportColumn,
  handleCopyToClipboard,
  handleExportCsv,
  exportExcelWithImages,
  exportExcelFromTemplate,
} from '../../Utils/exportService';
import { exportPdf } from '../../Utils/exportPdfwithoutImage';

interface StaffSalaryRecord {
  id: string | number;
  name: string;
  role: string;
  salaryGrade: string;
  basicSalary: string;
  totalAllowance: string;
  totalDeduction: string;
  netSalary: string;
  status: 'Set' | 'Not Set' | 'Pending';
  photo?: string;
}

export function PayrollManageSalaryPage() {
  const { t } = useLanguage();
  const viewModal = useModal<StaffSalaryRecord>();

  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedYear, setSelectedYear] = useState('2025');

  const sampleRecords: StaffSalaryRecord[] = [
    {
      id: 1,
      name: 'Alisha Henry',
      role: 'Teacher',
      salaryGrade: 'A',
      basicSalary: '20,000.00',
      totalAllowance: '2,000.00',
      totalDeduction: '500.00',
      netSalary: '21,500.00',
      status: 'Set',
    },
    {
      id: 2,
      name: 'George Chapman',
      role: 'Staff',
      salaryGrade: 'B',
      basicSalary: '10,000.00',
      totalAllowance: '1,000.00',
      totalDeduction: '200.00',
      netSalary: '10,800.00',
      status: 'Set',
    },
    {
      id: 3,
      name: 'Ryan Thompson',
      role: 'Accountant',
      salaryGrade: 'C',
      basicSalary: '5,000.00',
      totalAllowance: '500.00',
      totalDeduction: '100.00',
      netSalary: '5,400.00',
      status: 'Set',
    },
    {
      id: 4,
      name: 'Kiera Turnbull',
      role: 'Librarian',
      salaryGrade: 'B',
      basicSalary: '10,000.00',
      totalAllowance: '800.00',
      totalDeduction: '150.00',
      netSalary: '10,650.00',
      status: 'Not Set',
    },
  ];

  const rolesList = ['All', 'Teacher', 'Staff', 'Accountant', 'Librarian', 'Receptionist'];
  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const yearsList = ['2024', '2025', '2026'];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filterFn = (item: StaffSalaryRecord, term: string) => {
    const matchesRole = selectedRole === 'All' || item.role.toLowerCase() === selectedRole.toLowerCase();
    const matchesTerm =
      item.name.toLowerCase().includes(term.toLowerCase()) ||
      item.role.toLowerCase().includes(term.toLowerCase()) ||
      item.salaryGrade.toLowerCase().includes(term.toLowerCase()) ||
      item.netSalary.toLowerCase().includes(term.toLowerCase());
    return matchesRole && matchesTerm;
  };

  const {
    searchTerm,
    setSearchTerm,
    sortedData: filteredItems,
  } = useSearchAndFilter<StaffSalaryRecord>({
    initialData: sampleRecords,
    filterFn,
    initialSortField: 'name',
    initialSortOrder: 'asc',
  });

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const exportColumns: ExportColumn[] = [
    { header: 'Name', accessorKey: 'name' },
    { header: 'Role', accessorKey: 'role' },
    { header: 'Salary Grade', accessorKey: 'salaryGrade' },
    { header: 'Basic Salary', accessorKey: 'basicSalary' },
    { header: 'Net Salary', accessorKey: 'netSalary' },
    { header: 'Status', accessorKey: 'status' },
  ];

  const handleCopy = () => {
    handleCopyToClipboard(filteredItems, exportColumns);
  };

  const handleExport = async (format: string) => {
    const filename = 'Manage_Salary_Report';
    switch (format) {
      case 'csv':
        handleExportCsv(filteredItems, exportColumns, filename);
        break;
      case 'excel':
        try {
          await exportExcelWithImages(filteredItems, exportColumns, filename, {
            templateUrl: '/template.xlsx',
          });
        } catch {
          await exportExcelFromTemplate(filteredItems, exportColumns, filename, {
            templateUrl: '/template.xlsx',
            startRow: 2,
          });
        }
        break;
      case 'pdf':
        try {
          await exportPdf(filteredItems, exportColumns, filename);
        } catch (err) {
          console.error('PDF Export Error:', err);
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
          titleKey="Manage Salary"
          iconName="fa-calculator"
          breadcrumbLabel="Manage Salary"
        />

        <div className="p-[15px]">
          {/* Field Requirement Under Construction Banner */}
          <div className="mb-4 bg-[#fff8e1] border-l-4 border-[#ffb300] p-4 rounded shadow-sm flex items-start gap-3">
            <div className="p-2 bg-[#ffecb3] rounded-full text-[#ff8f00] flex-shrink-0">
              <Icon name="fa-wrench" className="text-[18px]" />
            </div>
            <div>
              <h4 className="font-bold text-[#8f6b00] text-sm mb-0.5">
                {t('Field Requirement Under Construction')}
              </h4>
              <p className="text-xs text-[#6d5100] m-0 leading-relaxed">
                {t(
                  'The custom field requirements and automated formula engine for Manage Salary are under active design. Customize role and month parameters below or contact administrator for custom field specifications.'
                )}
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-[#f8f9fa] border border-[#e7eaec] rounded p-3.5 mb-4 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-[#676a6c] uppercase mb-1">
                {t('Role')}
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full border border-[#dfe6e9] rounded px-3 py-1.5 text-xs text-dark focus:outline-none focus:ring-1 focus:ring-[#1ab394] bg-white"
              >
                {rolesList.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#676a6c] uppercase mb-1">
                {t('Month')}
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full border border-[#dfe6e9] rounded px-3 py-1.5 text-xs text-dark focus:outline-none focus:ring-1 focus:ring-[#1ab394] bg-white"
              >
                {monthsList.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#676a6c] uppercase mb-1">
                {t('Year')}
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full border border-[#dfe6e9] rounded px-3 py-1.5 text-xs text-dark focus:outline-none focus:ring-1 focus:ring-[#1ab394] bg-white"
              >
                {yearsList.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div>
              <Button
                type="button"
                variant="success"
                size="sm"
                className="w-full bg-[#1ab394] hover:bg-[#18a689] text-white flex items-center justify-center gap-1.5 py-2 text-xs"
              >
                <Icon name="fa-filter" className="text-[11px]" />
                <span>{t('Filter')}</span>
              </Button>
            </div>
          </div>

          {/* Main Table Container */}
          <div className="border border-[#e7eaec] rounded-[3px] overflow-hidden">
            {/* Top Action Toolbar */}
            <div className="bg-[#f8f9fa] border-b border-[#e7eaec] px-[15px] py-[10px] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 select-none">
              <div className="flex items-center gap-2">
                <Button variant="export" size="sm" onClick={handleCopy}>{t('Copy')}</Button>
                <Button variant="export" size="sm" onClick={() => handleExport('excel')}>{t('Excel')}</Button>
                <Button variant="export" size="sm" onClick={() => handleExport('csv')}>{t('CSV')}</Button>
                <Button variant="export" size="sm" onClick={() => handleExport('pdf')}>{t('PDF')}</Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[13px] text-muted font-medium">{t('Search')}:</span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-[#dfe6e9] rounded px-3 py-1.5 text-[13px] text-dark focus:outline-none focus:ring-1 focus:ring-[#1ab394] bg-white shadow-sm w-full sm:w-48"
                  placeholder={t('Search...')}
                />
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto w-full">
              <table className="w-full border-collapse">
                <thead className="bg-[#f8f9fa] border-b border-[#e7eaec] select-none">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#676a6c] uppercase tracking-wider w-12">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#676a6c] uppercase tracking-wider">{t('Name')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#676a6c] uppercase tracking-wider w-32">{t('Role')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#676a6c] uppercase tracking-wider w-32">{t('Salary Grade')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#676a6c] uppercase tracking-wider w-36">{t('Basic Salary')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#676a6c] uppercase tracking-wider w-36">{t('Net Salary')}</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-[#676a6c] uppercase tracking-wider w-28">{t('Status')}</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-[#676a6c] uppercase tracking-wider w-28">{t('Action')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#e7eaec] text-[13px] text-[#676a6c]">
                  {paginatedItems.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-6 text-center text-gray-500 italic">
                        {t('No Staff Salary records found')}
                      </td>
                    </tr>
                  ) : (
                    paginatedItems.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-[#f5f5f5] transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-700">{startIndex + idx + 1}</td>
                        <td className="px-4 py-3 font-semibold text-gray-800 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#ebf5fb] text-[#2980b9] font-bold flex items-center justify-center text-xs border border-[#a9cce3]">
                            {item.name.charAt(0)}
                          </div>
                          <span>{item.name}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#f3f3f4] text-[#676a6c] border border-[#e7eaec]">
                            {item.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-gray-700">{item.salaryGrade}</td>
                        <td className="px-4 py-3 font-medium text-gray-700">{item.basicSalary}</td>
                        <td className="px-4 py-3 font-semibold text-[#1ab394]">{item.netSalary}</td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold ${
                              item.status === 'Set'
                                ? 'bg-[#e8f8f5] text-[#1ab394] border border-[#a3e4d7]'
                                : 'bg-[#fef9e7] text-[#f8ac59] border border-[#fdebd0]'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center space-x-1.5">
                            <button
                              type="button"
                              onClick={() => viewModal.open(item)}
                              className="p-1.5 rounded bg-[#1c84c6] hover:bg-[#1a7bb9] text-white transition-colors"
                              title={t('View Details')}
                            >
                              <Icon name="fa-eye" className="text-[12px]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer / Pagination */}
            <div className="bg-[#f8f9fa] border-t border-[#e7eaec] px-[15px] py-[10px] flex flex-col sm:flex-row items-center justify-between gap-3 select-none text-[13px] text-muted">
              <div>
                {t('Showing')} {filteredItems.length === 0 ? 0 : startIndex + 1} {t('to')}{' '}
                {Math.min(startIndex + itemsPerPage, filteredItems.length)} {t('of')} {filteredItems.length} {t('entries')}
              </div>

              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="px-3 py-1 rounded border border-[#dfe6e9] bg-white text-[13px] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t('Previous')}
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded text-[13px] font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-[#1ab394] text-white border border-[#1ab394]'
                        : 'bg-white border border-[#dfe6e9] text-[#676a6c] hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages || filteredItems.length === 0}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="px-3 py-1 rounded border border-[#dfe6e9] bg-white text-[13px] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t('Next')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Staff Salary Details Modal */}
      {viewModal.isOpen && viewModal.activeItem && (
        <Modal
          isOpen={viewModal.isOpen}
          onClose={viewModal.close}
          title={`${t('Salary Details')} - ${viewModal.activeItem.name}`}
        >
          <div className="space-y-4 text-sm text-gray-700">
            <div className="grid grid-cols-2 gap-3 bg-[#f8f9fa] p-3.5 rounded border border-[#e7eaec]">
              <div>
                <span className="text-xs font-semibold text-muted block uppercase mb-1">{t('Staff Name')}</span>
                <span className="font-bold text-gray-800 text-base">{viewModal.activeItem.name}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-muted block uppercase mb-1">{t('Role')}</span>
                <span className="font-semibold text-gray-800">{viewModal.activeItem.role}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-muted block uppercase mb-1">{t('Salary Grade')}</span>
                <span className="font-bold text-gray-800">{viewModal.activeItem.salaryGrade}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-muted block uppercase mb-1">{t('Basic Salary')}</span>
                <span className="font-medium text-gray-800">{viewModal.activeItem.basicSalary}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-muted block uppercase mb-1">{t('Total Allowance')}</span>
                <span className="font-medium text-teal-600">{viewModal.activeItem.totalAllowance}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-muted block uppercase mb-1">{t('Total Deduction')}</span>
                <span className="font-medium text-red-500">{viewModal.activeItem.totalDeduction}</span>
              </div>
            </div>

            <div className="bg-[#e8f8f5] p-3 rounded border border-[#a3e4d7] flex justify-between items-center">
              <span className="text-xs font-bold text-[#1ab394] uppercase">{t('Net Salary')}</span>
              <span className="text-lg font-extrabold text-[#1ab394]">{viewModal.activeItem.netSalary}</span>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#e7eaec]">
              <Button type="button" variant="secondary" onClick={viewModal.close}>
                {t('Close')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
