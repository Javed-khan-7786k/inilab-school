import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenericTablePage } from '../../components/common/GenericTablePage';
import type { Column } from '../../components/common/GenericTablePage';
import type { ExamItem } from '../../types';
import { dataService } from '../../services/dataService';
import { useApi } from '../../hooks/useApi';
import { Spinner } from '../../components/ui/Spinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Icon } from '../../components/ui/Icon';
import { useLanguage } from '../../context/LanguageContext';
import { authService } from '../../services/authService';

export function ExamExamPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const userRole = authService.getUserRole();
  const isAuthorized = userRole === 'Admin' || userRole === 'Principal';

  const { data: exams, loading, error, execute: fetchExams } = useApi<ExamItem[], []>(
    () => dataService.getExams(),
    true,
    []
  );

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteItem = async (item: ExamItem) => {
    if (!window.confirm(t('Are you sure you want to delete this exam?'))) return;
    try {
      await dataService.deleteExam(item.id);
      showToast(t('Exam deleted successfully'), 'success');
      fetchExams();
    } catch (err: any) {
      showToast(err.message || t('Error deleting exam'), 'error');
    }
  };

  const columns: Column<ExamItem>[] = [
    { key: 'id', label: '#' },
    { key: 'name', label: 'Exam Name' },
    { key: 'date', label: 'Date' },
    { key: 'note', label: 'Note' },
    {
      key: 'action',
      label: 'Action',
      sortable: false,
      render: (item) => (
        <div className="flex items-center gap-1.5 flex-nowrap">
          {isAuthorized && (
            <>
              <button
                type="button"
                onClick={() => navigate(`/dashboard/exam/edit/${item.id}`)}
                title={t('Edit')}
                className="rounded-[3px] px-[8px] py-[5px] text-[13px] text-white border-0 bg-primary hover:opacity-90 transition-colors cursor-pointer"
              >
                <Icon name="fa-pencil" />
              </button>

              <button
                type="button"
                onClick={() => handleDeleteItem(item)}
                title={t('Delete')}
                className="rounded-[3px] px-[8px] py-[5px] text-[13px] text-white border-0 bg-iconred hover:opacity-90 transition-colors cursor-pointer"
              >
                <Icon name="fa-trash" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const filterFn = (item: ExamItem, searchTerm: string, _selectedClass: string) => {
    return Boolean(
      searchTerm === '' ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.note && item.note.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  if (loading && (!exams || exams.length === 0)) {
    return (
      <div className="min-h-screen bg-bodyBg flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage message={error} onRetry={fetchExams} />
      </div>
    );
  }

  return (
    <>
      <GenericTablePage<ExamItem>
        titleKey="Exam"
        iconName="fa-pencil"
        columns={columns}
        initialData={exams || []}
        filterFn={filterFn}
        onAddClick={() => navigate('/dashboard/exam/add')}
      />

      {toast && (
        <div
          className={`fixed top-4 right-4 z-[9999] p-4 rounded-lg shadow-md text-white font-bold transition-all duration-300 flex items-center gap-2 animate-fadeIn ${
            toast.type === 'success' ? 'bg-teal bg-[#1abc9c] shadow-[#1abc9c]/20' : 'bg-iconred bg-red-500 shadow-red-500/20'
          }`}
        >
          <Icon name={toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} className="text-[16px]" />
          <span>{toast.message}</span>
        </div>
      )}
    </>
  );
}
