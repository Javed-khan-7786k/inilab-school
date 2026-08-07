import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenericTablePage } from '../../components/common/GenericTablePage';
import type { Column } from '../../components/common/GenericTablePage';
import type { GradeItem } from '../../types';
import { dataService } from '../../services/dataService';
import { useApi } from '../../hooks/useApi';
import { Spinner } from '../../components/ui/Spinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Icon } from '../../components/ui/Icon';
import { useLanguage } from '../../context/LanguageContext';
import { authService } from '../../services/authService';

export function ExamGradePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const userRole = authService.getUserRole();
  const isAuthorized = userRole === 'Admin' || userRole === 'Principal';

  const { data: grades, loading, error, execute: fetchGrades } = useApi<GradeItem[], []>(
    () => dataService.getGrades(),
    true,
    []
  );

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteItem = async (item: GradeItem) => {
    if (!window.confirm(t('Are you sure you want to delete this grade?'))) return;
    try {
      await dataService.deleteGrade(item.id);
      showToast(t('Grade deleted successfully'), 'success');
      fetchGrades();
    } catch (err: any) {
      showToast(err.message || t('Error deleting grade'), 'error');
    }
  };

  const columns: Column<GradeItem>[] = [
    { key: 'id', label: '#' },
    { key: 'gradeName', label: 'Grade Name' },
    { key: 'gradePoint', label: 'Grade Point' },
    { key: 'markFrom', label: 'Mark From' },
    { key: 'markUpto', label: 'Mark Upto' },
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
                onClick={() => navigate(`/dashboard/exam/grade/edit/${item.id}`)}
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

  const filterFn = (item: GradeItem, searchTerm: string, _selectedClass: string) => {
    return Boolean(
      searchTerm === '' ||
      item.gradeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.gradePoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.markFrom).includes(searchTerm) ||
      String(item.markUpto).includes(searchTerm) ||
      (item.note && item.note.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  if (loading && (!grades || grades.length === 0)) {
    return (
      <div className="min-h-screen bg-bodyBg flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage message={error} onRetry={fetchGrades} />
      </div>
    );
  }

  return (
    <>
      <GenericTablePage<GradeItem>
        titleKey="Grade"
        iconName="fa-graduation-cap"
        columns={columns}
        initialData={grades || []}
        filterFn={filterFn}
        onAddClick={() => navigate('/dashboard/exam/grade/add')}
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
