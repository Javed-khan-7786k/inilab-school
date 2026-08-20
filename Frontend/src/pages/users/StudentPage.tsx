import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenericTablePage } from '../../components/common/GenericTablePage';
import type { Column } from '../../components/common/GenericTablePage';
import type { StudentListItem } from '../../types';
import { dataService } from '../../services/dataService';
import { studentApi } from '../../services/api/studentApi';
import { useApi } from '../../hooks/useApi';
import { Spinner } from '../../components/ui/Spinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Icon } from '../../components/ui/Icon';
import { useLanguage } from '../../context/LanguageContext';
import { getPhotoUrl, handleImageError } from '../../Utils/image';
import { authService } from '../../services/authService';

export const StudentPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const isAdmin = authService.getUserRole() === 'Admin';

  const { data: students, loading, error, execute: fetchStudents } = useApi<StudentListItem[], []>(
    () => dataService.getAdmittedStudents(),
    true,
    []
  );

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteItem = async (item: StudentListItem) => {
    if (!window.confirm(t('Are you sure you want to delete this student record?'))) return;
    try {
      await studentApi.delete(item.rawId);
      showToast(t('Record deleted successfully'), 'success');
      fetchStudents();
    } catch (err: any) {
      showToast(err.message || t('Error deleting record'), 'error');
    }
  };

  const columns: Column<StudentListItem>[] = [
    { key: 'id', label: '#' },
    {
      key: 'photo',
      label: 'Photo',
      sortable: false,
      render: (item) => (
        <img
          src={getPhotoUrl(item.photo)}
          onError={handleImageError}
          alt={item.name}
          className="w-[36px] h-[36px] rounded-full object-cover border border-[#e1e1e1] shadow-sm"
        />
      ),
    },
    { key: 'name', label: 'Name' },
    { key: 'roll', label: 'Roll' },
    { key: 'email', label: 'Email' },
    { key: 'className', label: 'Class' },
    {
      key: 'status',
      label: 'Status',
      sortable: false,
      render: () => (
        <span className="px-2 py-1 rounded text-[11px] font-semibold bg-[#d4edda] text-[#155724]">
          {t('Admitted')}
        </span>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      sortable: false,
      render: (item) => (
        <div className="flex items-center gap-1.5 flex-nowrap">
          <button
            type="button"
            onClick={() => navigate(`/dashboard/view/student/${item.rawId}`)}
            title={t('View Details')}
            className="rounded-[3px] px-[8px] py-[5px] text-[13px] text-white border-0 bg-teal hover:opacity-90 transition-colors cursor-pointer"
          >
            <Icon name="fa-check-square-o" />
          </button>

          {isAdmin && (
            <>
              <button
                type="button"
                onClick={() => navigate(`/dashboard/enquiry/edit/${item.rawId}?from=admin-student&editType=student`)}
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

  const filterFn = (item: StudentListItem, searchTerm: string, selectedClass: string) => {
    const matchesClass =
      !selectedClass ||
      selectedClass === '' ||
      selectedClass === 'Select Class' ||
      (item.className && item.className.toLowerCase() === selectedClass.toLowerCase());
    const matchesSearch =
      searchTerm === '' ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.roll).includes(searchTerm) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  };

  if (loading && (!students || students.length === 0)) {
    return (
      <div className="min-h-screen bg-bodyBg flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage message={error} onRetry={fetchStudents} />
      </div>
    );
  }

  return (
    <>
      <GenericTablePage<StudentListItem>
        titleKey="Student"
        iconName="fa-user"
        columns={columns}
        initialData={students || []}
        filterFn={filterFn}
        showClassFilter={true}
        importEntity="students"
        onImportSuccess={fetchStudents}
        onAddClick={() => navigate('/dashboard/enquiry/new?from=admin-student')}
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
};