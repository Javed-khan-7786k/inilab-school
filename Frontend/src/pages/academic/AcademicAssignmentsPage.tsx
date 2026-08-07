import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenericTablePage } from '../../components/common/GenericTablePage';
import type { Column } from '../../components/common/GenericTablePage';
import type { AssignmentItem } from '../../types';
import { dataService } from '../../services/dataService';
import { useApi } from '../../hooks/useApi';
import { Spinner } from '../../components/ui/Spinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Icon } from '../../components/ui/Icon';
import { useLanguage } from '../../context/LanguageContext';
import { authService } from '../../services/authService';

export function AcademicAssignmentsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const userRole = authService.getUserRole();
  const isAuthorized = userRole === 'Admin' || userRole === 'Principal';

  const { data: assignments, loading, error, execute: fetchAssignments } = useApi<AssignmentItem[], []>(
    () => dataService.getAssignments(),
    true,
    []
  );

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteItem = async (item: AssignmentItem) => {
    if (!window.confirm(t('Are you sure you want to delete this assignment?'))) return;
    try {
      await dataService.deleteAssignment(item.id);
      showToast(t('Assignment deleted successfully'), 'success');
      fetchAssignments();
    } catch (err: any) {
      showToast(err.message || t('Error deleting assignment'), 'error');
    }
  };

  const columns: Column<AssignmentItem>[] = [
    { key: 'id', label: '#' },
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { key: 'deadline', label: 'Deadline' },
    { key: 'sectionName', label: 'Section' },
    { key: 'subjectName', label: 'Subject' },
    { key: 'uploader', label: 'Uploader' },
    {
      key: 'file',
      label: 'File',
      sortable: false,
      render: (item) => (
        item.file ? (
          <a
            href={item.file.startsWith('data:') ? item.file : `#`}
            download={item.file.startsWith('data:') ? `${item.title.replace(/\s+/g, '_')}_assignment` : undefined}
            onClick={(e) => {
              if (!item.file?.startsWith('data:')) {
                e.preventDefault();
                alert(t('Mock assignment file attached: ') + item.file);
              }
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#1abc9c] bg-[#1abc9c]/10 rounded border border-[#1abc9c]/20 hover:bg-[#1abc9c] hover:text-white transition-colors cursor-pointer"
          >
            <Icon name="fa-download" /> {t('Download')}
          </a>
        ) : (
          <span className="text-gray-400 text-xs italic">{t('No File')}</span>
        )
      ),
    },
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
                onClick={() => navigate(`/dashboard/academic/assignment/edit/${item.id}`)}
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

  const filterFn = (item: AssignmentItem, searchTerm: string, selectedClass: string) => {
    const matchesSearch =
      searchTerm === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.sectionName && item.sectionName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.uploader.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass =
      !selectedClass ||
      selectedClass === 'Select Class' ||
      item.className.toLowerCase() === selectedClass.toLowerCase();

    return matchesSearch && matchesClass;
  };

  if (loading && (!assignments || assignments.length === 0)) {
    return (
      <div className="min-h-screen bg-bodyBg flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage message={error} onRetry={fetchAssignments} />
      </div>
    );
  }

  return (
    <>
      <GenericTablePage<AssignmentItem>
        titleKey="Assignment"
        iconName="fa-tasks"
        columns={columns}
        initialData={assignments || []}
        filterFn={filterFn}
        showClassFilter={true}
        onAddClick={() => navigate('/dashboard/academic/assignment/add')}
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
