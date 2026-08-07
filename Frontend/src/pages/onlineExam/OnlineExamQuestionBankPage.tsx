/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { Icon } from '../../components/ui/Icon';
import { PageHeaderBar } from '../../components/common/PageHeaderBar';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { useSearchAndFilter } from '../../hooks/useSearchAndFilter';
import { useModal } from '../../hooks/useModal';
import { dataService } from '../../services/dataService';
import type { QuestionBankItem } from '../../types';
import { Spinner } from '../../components/ui/Spinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import {
  type ExportColumn,
  handleCopyToClipboard,
  handleExportCsv,
  exportExcelWithImages,
  exportExcelFromTemplate,
} from '../../Utils/exportService';
import { exportPdf } from '../../Utils/exportPdfwithoutImage';

export function OnlineExamQuestionBankPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const viewModal = useModal<QuestionBankItem>();
  const [items, setItems] = useState<QuestionBankItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dataService.getQuestionBanks();
      setItems(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load Question Bank entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: string | number) => {
    if (!window.confirm(t('Are you sure you want to delete this Question Bank entry?'))) return;
    try {
      await dataService.deleteQuestionBank(id);
      fetchItems();
    } catch (err: any) {
      alert(err.message || 'Failed to delete Question Bank entry');
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filterFn = (item: QuestionBankItem, term: string) =>
    item.difficultyLevel.toLowerCase().includes(term.toLowerCase()) ||
    item.question.toLowerCase().includes(term.toLowerCase()) ||
    item.questionGroup.toLowerCase().includes(term.toLowerCase()) ||
    item.questionType.toLowerCase().includes(term.toLowerCase());

  const {
    searchTerm,
    setSearchTerm,
    sortedData: filteredItems,
  } = useSearchAndFilter<QuestionBankItem>({
    initialData: items,
    filterFn,
    initialSortField: 'questionGroup',
    initialSortOrder: 'asc',
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredItems.length, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const exportColumns: ExportColumn[] = [
    { header: 'Difficulty Level', accessorKey: 'difficultyLevel' },
    { header: 'Question', accessorKey: 'question' },
    { header: 'Question Group', accessorKey: 'questionGroup' },
    { header: 'Question Type', accessorKey: 'questionType' },
  ];

  const handleCopy = () => {
    handleCopyToClipboard(filteredItems, exportColumns);
  };

  const handleExport = async (format: string) => {
    const filename = 'Question_Bank_Report';
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

  const getDifficultyBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case 'easy':
        return 'bg-[#e8f8f5] text-[#1ab394] border-[#a3e4d7]';
      case 'medium':
        return 'bg-[#fef9e7] text-[#f8ac59] border-[#fdebd0]';
      case 'hard':
        return 'bg-[#fadbd8] text-[#ed5565] border-[#f5b7b1]';
      default:
        return 'bg-[#f3f3f4] text-[#676a6c] border-[#e7eaec]';
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-[4px] shadow-[0_1px_1px_rgba(0,0,0,.1)] border border-[#e7eaec] overflow-hidden">
        <PageHeaderBar
          titleKey="Question Bank"
          iconName="fa-folder"
          breadcrumbLabel="Question Bank"
        />

        <div className="p-[15px]">
          {error && (
            <div className="mb-4">
              <ErrorMessage message={error} onRetry={fetchItems} />
            </div>
          )}

          {loading && items.length === 0 ? (
            <div className="py-8 flex justify-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="border border-[#e7eaec] rounded-[3px] overflow-hidden">
              {/* Top Action Toolbar */}
              <div className="bg-[#f8f9fa] border-b border-[#e7eaec] px-[15px] py-[10px] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 select-none">
                <div className="flex items-center gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => navigate('/dashboard/online-exam/question-bank/add')}
                    className="flex items-center gap-1.5 bg-[#1ab394] hover:bg-[#18a689] text-white border-none rounded px-3 py-1.5 text-[13px] font-medium shadow-sm"
                  >
                    <Icon name="fa-plus" className="text-[12px]" />
                    <span>{t('Add a Question Bank')}</span>
                  </Button>
                  <div className="h-4 w-[1px] bg-[#dfe6e9] mx-1 hidden sm:block"></div>
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
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#676a6c] uppercase tracking-wider w-16">#</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#676a6c] uppercase tracking-wider w-36">{t('Difficulty Level')}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#676a6c] uppercase tracking-wider">{t('Question')}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#676a6c] uppercase tracking-wider w-36">{t('Question Group')}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#676a6c] uppercase tracking-wider w-40">{t('Question Type')}</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-[#676a6c] uppercase tracking-wider w-28">{t('Action')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#e7eaec] text-[13px] text-[#676a6c]">
                    {paginatedItems.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-gray-500 italic">
                          {t('No Question Bank entries found')}
                        </td>
                      </tr>
                    ) : (
                      paginatedItems.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-[#f5f5f5] transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-700">{startIndex + idx + 1}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold border ${getDifficultyBadge(item.difficultyLevel)}`}>
                              {item.difficultyLevel}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-800 max-w-[360px] truncate" title={item.question}>
                            {item.question}
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-700">{item.questionGroup}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#ebf5fb] text-[#2980b9] border border-[#a9cce3]">
                              {item.questionType}
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
                              <button
                                type="button"
                                onClick={() => navigate(`/dashboard/online-exam/question-bank/edit/${item.id}`)}
                                className="p-1.5 rounded bg-[#f8ac59] hover:bg-[#f7a54a] text-white transition-colors"
                                title={t('Edit')}
                              >
                                <Icon name="fa-edit" className="text-[12px]" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(item.id)}
                                className="p-1.5 rounded bg-[#ed5565] hover:bg-[#ec4758] text-white transition-colors"
                                title={t('Delete')}
                              >
                                <Icon name="fa-trash" className="text-[12px]" />
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
          )}
        </div>
      </div>

      {/* View Question Bank Detail Modal */}
      {viewModal.isOpen && viewModal.activeItem && (
        <Modal
          isOpen={viewModal.isOpen}
          onClose={viewModal.close}
          title={t('Question Details')}
        >
          <div className="space-y-4 text-sm text-gray-700">
            <div className="grid grid-cols-3 gap-3 bg-[#f8f9fa] p-3.5 rounded border border-[#e7eaec]">
              <div>
                <span className="text-xs font-semibold text-muted block uppercase">{t('Difficulty')}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${getDifficultyBadge(viewModal.activeItem.difficultyLevel)}`}>
                  {viewModal.activeItem.difficultyLevel}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-muted block uppercase">{t('Group')}</span>
                <span className="font-semibold text-gray-800">{viewModal.activeItem.questionGroup}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-muted block uppercase">{t('Type')}</span>
                <span className="font-semibold text-gray-800">{viewModal.activeItem.questionType}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-muted block uppercase mb-1">{t('Question Text')}</span>
              <div className="bg-white p-3 rounded border border-[#dfe6e9] font-medium text-gray-800 leading-relaxed">
                {viewModal.activeItem.question}
              </div>
            </div>

            {viewModal.activeItem.explanation && (
              <div>
                <span className="text-xs font-semibold text-muted block uppercase mb-1">{t('Explanation / Notes')}</span>
                <div className="bg-white p-3 rounded border border-[#dfe6e9] text-gray-700 whitespace-pre-wrap">
                  {viewModal.activeItem.explanation}
                </div>
              </div>
            )}

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
