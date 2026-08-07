import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenericTablePage } from '../../components/common/GenericTablePage';
import type { Column } from '../../components/common/GenericTablePage';
import type { RoutineItem } from '../../types';
import { dataService } from '../../services/dataService';
import { useApi } from '../../hooks/useApi';
import { Spinner } from '../../components/ui/Spinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Icon } from '../../components/ui/Icon';
import { useLanguage } from '../../context/LanguageContext';
import { authService } from '../../services/authService';

export function AcademicRoutinePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const userRole = authService.getUserRole();
  const isAuthorized = userRole === 'Admin' || userRole === 'Principal';

  const { data: routines, loading, error, execute: fetchRoutines } = useApi<RoutineItem[], []>(
    () => dataService.getRoutines(),
    true,
    []
  );

  useEffect(() => {
    fetchRoutines();
  }, [fetchRoutines]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteItem = async (item: RoutineItem) => {
    if (!window.confirm(t('Are you sure you want to delete this routine entry?'))) return;
    try {
      await dataService.deleteRoutine(item.id);
      showToast(t('Routine deleted successfully'), 'success');
      fetchRoutines();
    } catch (err: any) {
      showToast(err.message || t('Error deleting routine'), 'error');
    }
  };

  const columns: Column<RoutineItem>[] = [
    { key: 'id', label: '#' },
    { key: 'schoolYear', label: 'School Year' },
    { key: 'className', label: 'Class' },
    { key: 'sectionName', label: 'Section' },
    { key: 'subjectName', label: 'Subject' },
    { key: 'day', label: 'Day' },
    { key: 'teacherName', label: 'Teacher' },
    { key: 'startingTime', label: 'Starting Time' },
    { key: 'endingTime', label: 'Ending Time' },
    { key: 'room', label: 'Room' },
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
                onClick={() => navigate(`/dashboard/academic/routine/edit/${item.id}`)}
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

  const filterFn = (item: RoutineItem, searchTerm: string, selectedClass: string) => {
    const matchesSearch =
      searchTerm === '' ||
      item.schoolYear.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sectionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.day.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.room.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass =
      !selectedClass ||
      selectedClass === 'Select Class' ||
      item.className.toLowerCase() === selectedClass.toLowerCase();

    return matchesSearch && matchesClass;
  };

  if (loading && (!routines || routines.length === 0)) {
    return (
      <div className="min-h-screen bg-bodyBg flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage message={error} onRetry={fetchRoutines} />
      </div>
    );
  }

  return (
    <>
      <GenericTablePage<RoutineItem>
        titleKey="Routine"
        iconName="fa-calendar"
        columns={columns}
        initialData={routines || []}
        filterFn={filterFn}
        showClassFilter={true}
        onAddClick={() => navigate('/dashboard/academic/routine/add')}
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
