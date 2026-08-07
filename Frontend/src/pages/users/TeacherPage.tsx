import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenericTablePage } from '../../components/common/GenericTablePage';
import type { Column } from '../../components/common/GenericTablePage';

import type { Teacher } from '../../types';
import { dataService } from '../../services/dataService';
import { teacherApi } from '../../services/api/teacherApi';
import { useApi } from '../../hooks/useApi';
import { Spinner } from '../../components/ui/Spinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Icon } from '../../components/ui/Icon';
import { useLanguage } from '../../context/LanguageContext';
import { getPhotoUrl, handleImageError } from '../../Utils/image';
import { authService } from '../../services/authService';

export const TeacherPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const isAdmin = authService.getUserRole() === 'Admin';

  const { data: teachers, loading, error, execute: fetchTeachers } = useApi<Teacher[], []>(
    () => dataService.getTeachers(),
    true,
    []
  );

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);
  

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteItem = async (item: Teacher) => {
    if (!window.confirm(t('Are you sure you want to delete this teacher record?'))) return;
    try {
      await teacherApi.delete(item.id);
      showToast(t('Record deleted successfully'), 'success');
      fetchTeachers();
    } catch (err: any) {
      showToast(err.message || t('Error deleting record'), 'error');
    }
  };

  const columns: Column<Teacher>[] = [
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
    { key: 'email', label: 'Email' },
    { key: 'designation', label: 'Designation' },
    {
      key: 'status',
      label: 'Status',
      sortable: false,
      render: () => (
        <span className="px-2 py-1 rounded text-[11px] font-semibold bg-[#d4edda] text-[#155724]">
          {t('Active')}
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
            onClick={() => navigate(`/dashboard/view/teacher/${item.id}`)}
            title={t('View Details')}
            className="rounded-[3px] px-[8px] py-[5px] text-[13px] text-white border-0 bg-teal hover:opacity-90 transition-colors cursor-pointer"
          >
            <Icon name="fa-check-square-o" />
          </button>

          {isAdmin && (
            <>
              <button
                type="button"
                onClick={() => navigate(`/dashboard/teacher/edit/${item.id}`)}
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

  const filterFn = (item: Teacher, searchTerm: string) => {
    return (
      searchTerm === '' ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.designation.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  if (loading && (!teachers || teachers.length === 0)) {
    return (
      <div className="min-h-screen bg-bodyBg flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage message={error} onRetry={fetchTeachers} />
      </div>
    );
  }

  return (
    <>
      <GenericTablePage<Teacher>
        titleKey="Teacher"
        iconName="fa-user"
        columns={columns}
        initialData={teachers || []}
        filterFn={filterFn}
        showClassFilter={false}
        importEntity="teachers"
        onImportSuccess={fetchTeachers}
        onAddClick={() => navigate('/dashboard/teacher/add')}
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
