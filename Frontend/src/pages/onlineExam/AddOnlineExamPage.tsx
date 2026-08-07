/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { PageHeaderBar } from '../../components/common/PageHeaderBar';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { Spinner } from '../../components/ui/Spinner';
import { dataService } from '../../services/dataService';

export const AddOnlineExamPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [examTitle, setExamTitle] = useState('');
  const [examStatus, setExamStatus] = useState('Multiple Time');
  const [date, setDate] = useState('01-Jan-2025 - 31-Dec-2025');
  const [published, setPublished] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const statusOptions = ['Multiple Time', 'One Time'];

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (isEditMode && id) {
      const loadItem = async () => {
        try {
          const all = await dataService.getOnlineExams();
          const item = all.find((x) => String(x.id) === String(id));
          if (item) {
            setExamTitle(item.examTitle || '');
            setExamStatus(item.examStatus || 'Multiple Time');
            setDate(item.date || '01-Jan-2025 - 31-Dec-2025');
            setPublished(item.published !== undefined ? item.published : true);
          }
        } catch (err: any) {
          showToast(err.message || t('Failed to load data'), 'error');
        } finally {
          setLoading(false);
        }
      };
      loadItem();
    }
  }, [id, isEditMode, t]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!examTitle.trim()) errs.examTitle = t('Exam Title is required');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        examTitle: examTitle.trim(),
        examStatus,
        date: date.trim(),
        published,
      };

      if (isEditMode && id) {
        await dataService.updateOnlineExam(id, payload);
        showToast(t('Online Exam updated successfully'), 'success');
      } else {
        await dataService.addOnlineExam(payload);
        showToast(t('Online Exam added successfully'), 'success');
      }

      setTimeout(() => {
        navigate('/dashboard/online-exam/online-exam');
      }, 800);
    } catch (err: any) {
      showToast(err.message || t('Failed to save Online Exam'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-bodyBg flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeaderBar
        titleKey={isEditMode ? 'Edit Online Exam' : 'Add a Online Exam'}
        iconName="fa-folder"
        breadcrumbLabel={isEditMode ? 'Edit Online Exam' : 'Add Online Exam'}
      />

      <div className="p-[20px] bg-bodyBg">
        <div className="bg-white rounded-[3px] border border-[#e1e1e1] shadow-sm max-w-2xl mx-auto overflow-hidden">
          <div className="bg-[#fcfcfc] border-b border-[#e1e1e1] px-6 py-4 flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-[#444] m-0">
              {isEditMode ? t('Edit Online Exam') : t('Add a Online Exam')}
            </h2>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => navigate('/dashboard/online-exam/online-exam')}
            >
              <Icon name="fa-arrow-left" className="mr-1" /> {t('Back to List')}
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Exam Title */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t('Exam Title')} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <Input
                  type="text"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="e.g. ICT Exam, Math Exam..."
                  className="w-full"
                />
                {errors.examTitle && <p className="text-red-500 text-xs mt-1">{errors.examTitle}</p>}
              </div>
            </div>

            {/* Exam Status */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t('Exam Status')} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <select
                  value={examStatus}
                  onChange={(e) => setExamStatus(e.target.value)}
                  className="w-full border border-[#dfe6e9] rounded px-3 py-2 text-sm text-dark focus:outline-none focus:ring-1 focus:ring-[#1ab394] bg-white"
                >
                  {statusOptions.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date Range */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t('Date Range')}
              </label>
              <div className="sm:w-3/4">
                <Input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g. 01-Jan-2025 - 31-Dec-2025"
                  className="w-full"
                />
              </div>
            </div>

            {/* Published Toggle Switch */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t('Published Status')}
              </label>
              <div className="sm:w-3/4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPublished(!published)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    published ? 'bg-[#1ab394]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      published ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-sm font-medium text-gray-700">
                  {published ? t('Published (YES)') : t('Unpublished (NO)')}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-4 border-t border-[#eee] flex items-center justify-end sm:pl-[25%] gap-3">
              <Button type="submit" variant="success" disabled={submitting} className="bg-[#1ab394] hover:bg-[#18a689]">
                {submitting ? <Spinner size="sm" /> : isEditMode ? t('Update') : t('Save')}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/dashboard/online-exam/online-exam')}
              >
                {t('Cancel')}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {toast && (
        <div
          className={`fixed top-4 right-4 z-[9999] p-4 rounded-lg shadow-md text-white font-bold transition-all duration-300 flex items-center gap-2 ${
            toast.type === 'success' ? 'bg-[#1abc9c]' : 'bg-red-500'
          }`}
        >
          <Icon name={toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} className="text-[16px]" />
          <span>{toast.message}</span>
        </div>
      )}
    </DashboardLayout>
  );
};
