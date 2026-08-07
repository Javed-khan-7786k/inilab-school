import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenericTablePage } from '../../components/common/GenericTablePage';
import type { Column } from '../../components/common/GenericTablePage';
import type { MarkItem } from '../../types';
import { dataService } from '../../services/dataService';
import { useApi } from '../../hooks/useApi';
import { Spinner } from '../../components/ui/Spinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Icon } from '../../components/ui/Icon';
import { useLanguage } from '../../context/LanguageContext';
import { authService } from '../../services/authService';

export function MarkMarkPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [viewModalItem, setViewModalItem] = useState<MarkItem | null>(null);

  const userRole = authService.getUserRole();
  const isAuthorized = userRole === 'Admin' || userRole === 'Principal';

  const { data: marks, loading, error, execute: fetchMarks } = useApi<MarkItem[], []>(
    () => dataService.getMarks(),
    true,
    []
  );

  useEffect(() => {
    fetchMarks();
  }, [fetchMarks]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteItem = async (item: MarkItem) => {
    if (!window.confirm(t('Are you sure you want to delete this mark entry?'))) return;
    try {
      await dataService.deleteMark(item.id);
      showToast(t('Mark deleted successfully'), 'success');
      fetchMarks();
    } catch (err: any) {
      showToast(err.message || t('Error deleting mark'), 'error');
    }
  };

  const columns: Column<MarkItem>[] = [
    { key: 'id', label: '#' },
    {
      key: 'photo',
      label: 'Photo',
      sortable: false,
      render: (item) => (
        <img
          src={item.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.studentName}`}
          alt={item.studentName}
          className="w-8 h-8 rounded-full object-cover border border-[#ddd]"
        />
      ),
    },
    { key: 'studentName', label: 'Name' },
    { key: 'roll', label: 'Roll' },
    { key: 'email', label: 'Email' },
    {
      key: 'action',
      label: 'Action',
      sortable: false,
      render: (item) => (
        <div className="flex items-center gap-1.5 flex-nowrap">
          <button
            type="button"
            onClick={() => setViewModalItem(item)}
            title={t('View')}
            className="rounded-[3px] px-[8px] py-[5px] text-[13px] text-white border-0 bg-[#00c0ef] hover:opacity-90 transition-colors cursor-pointer"
          >
            <Icon name="fa-eye" />
          </button>

          {isAuthorized && (
            <>
              <button
                type="button"
                onClick={() => navigate(`/dashboard/mark/edit/${item.id}`)}
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

  const filterFn = (item: MarkItem, searchTerm: string, selectedClass: string) => {
    const matchesSearch =
      searchTerm === '' ||
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.roll.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.examName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass =
      !selectedClass ||
      selectedClass === 'Select Class' ||
      item.className.toLowerCase() === selectedClass.toLowerCase();

    return matchesSearch && matchesClass;
  };

  if (loading && (!marks || marks.length === 0)) {
    return (
      <div className="min-h-screen bg-bodyBg flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage message={error} onRetry={fetchMarks} />
      </div>
    );
  }

  return (
    <>
      <GenericTablePage<MarkItem>
        titleKey="Mark"
        iconName="fa-flask"
        columns={columns}
        initialData={marks || []}
        filterFn={filterFn}
        showClassFilter={true}
        onAddClick={() => navigate('/dashboard/mark/add')}
      />

      {/* View Mark Details Modal */}
      {viewModalItem && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden animate-fadeIn">
            <div className="bg-[#1abc9c] text-white px-5 py-3 flex justify-between items-center">
              <h3 className="font-semibold text-base m-0 flex items-center gap-2">
                <Icon name="fa-file-text-o" /> {t("Mark Details")}
              </h3>
              <button
                type="button"
                onClick={() => setViewModalItem(null)}
                className="text-white/80 hover:text-white text-lg font-bold border-0 bg-transparent cursor-pointer"
              >
                ×
              </button>
            </div>
            <div className="p-5 space-y-3 text-xs text-[#444]">
              <div className="flex items-center gap-3 pb-3 border-b border-[#eee]">
                <img
                  src={viewModalItem.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${viewModalItem.studentName}`}
                  alt={viewModalItem.studentName}
                  className="w-12 h-12 rounded-full border border-[#ddd]"
                />
                <div>
                  <h4 className="font-bold text-sm text-[#333] m-0">{viewModalItem.studentName}</h4>
                  <p className="text-gray-500 m-0">{t("Roll:")} {viewModalItem.roll} | {t("Email:")} {viewModalItem.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="font-semibold">{t("Exam:")}</span> {viewModalItem.examName}</div>
                <div><span className="font-semibold">{t("Class:")}</span> {viewModalItem.className}</div>
                <div><span className="font-semibold">{t("Section:")}</span> {viewModalItem.sectionName || "-"}</div>
                <div><span className="font-semibold">{t("Subject:")}</span> {viewModalItem.subjectName}</div>
              </div>

              <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200 space-y-1.5">
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span>{t("Exam (70)")}:</span>
                  <span className="font-bold text-teal">{viewModalItem.examMark}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span>{t("Attendance (10)")}:</span>
                  <span className="font-bold text-teal">{viewModalItem.attendanceMark}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span>{t("Class Test (10)")}:</span>
                  <span className="font-bold text-teal">{viewModalItem.classTestMark}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-1">
                  <span>{t("Assignment (10)")}:</span>
                  <span className="font-bold text-teal">{viewModalItem.assignmentMark}</span>
                </div>
                <div className="flex justify-between pt-1 font-bold text-sm text-[#333]">
                  <span>{t("Total Marks")}:</span>
                  <span className="text-primary">{viewModalItem.totalMark || (viewModalItem.examMark + viewModalItem.attendanceMark + viewModalItem.classTestMark + viewModalItem.assignmentMark)} / 100</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 text-right">
              <button
                type="button"
                onClick={() => setViewModalItem(null)}
                className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold text-xs rounded border-0 cursor-pointer"
              >
                {t("Close")}
              </button>
            </div>
          </div>
        </div>
      )}

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
