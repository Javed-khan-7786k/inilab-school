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

export const AddInstructionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (isEditMode && id) {
      const loadItem = async () => {
        try {
          const all = await dataService.getInstructions();
          const item = all.find((x) => String(x.id) === String(id));
          if (item) {
            setTitle(item.title || '');
            setContent(item.content || '');
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
    if (!title.trim()) errs.title = t('Title is required');
    if (!content.trim()) errs.content = t('Content is required');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
      };

      if (isEditMode && id) {
        await dataService.updateInstruction(id, payload);
        showToast(t('Instruction updated successfully'), 'success');
      } else {
        await dataService.addInstruction(payload);
        showToast(t('Instruction added successfully'), 'success');
      }

      setTimeout(() => {
        navigate('/dashboard/online-exam/instruction');
      }, 800);
    } catch (err: any) {
      showToast(err.message || t('Failed to save Instruction'), 'error');
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
        titleKey={isEditMode ? 'Edit Instruction' : 'Add a Instruction'}
        iconName="fa-folder"
        breadcrumbLabel={isEditMode ? 'Edit Instruction' : 'Add Instruction'}
      />

      <div className="p-[20px] bg-bodyBg">
        <div className="bg-white rounded-[3px] border border-[#e1e1e1] shadow-sm max-w-2xl mx-auto overflow-hidden">
          <div className="bg-[#fcfcfc] border-b border-[#e1e1e1] px-6 py-4 flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-[#444] m-0">
              {isEditMode ? t('Edit Instruction') : t('Add a Instruction')}
            </h2>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => navigate('/dashboard/online-exam/instruction')}
            >
              <Icon name="fa-arrow-left" className="mr-1" /> {t('Back to List')}
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Title */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t('Title')} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Exam Instruction 1"
                  className="w-full"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444] sm:pt-2">
                {t('Content')} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <textarea
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type instruction details here..."
                  className="w-full rounded-[3px] border border-[#d2d6de] px-3 py-2 text-[13px] focus:border-[#1ab394] focus:outline-none resize-y"
                />
                {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
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
                onClick={() => navigate('/dashboard/online-exam/instruction')}
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
