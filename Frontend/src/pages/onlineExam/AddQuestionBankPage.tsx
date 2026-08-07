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

export const AddQuestionBankPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [difficultyLevel, setDifficultyLevel] = useState('Easy');
  const [questionGroup, setQuestionGroup] = useState('General');
  const [questionType, setQuestionType] = useState('Single Answer');
  const [question, setQuestion] = useState('');
  const [mark, setMark] = useState<number | string>(1);
  const [explanation, setExplanation] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const levelOptions = ['Easy', 'Medium', 'Hard'];
  const groupOptions = ['General', 'Sports', 'Math', 'Reasoning', 'Computer Knowledge', 'GRE', 'A'];
  const typeOptions = ['Single Answer', 'Multi Answer', 'Fill in the blanks', 'True / False'];

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (isEditMode && id) {
      const loadItem = async () => {
        try {
          const all = await dataService.getQuestionBanks();
          const item = all.find((x) => String(x.id) === String(id));
          if (item) {
            setDifficultyLevel(item.difficultyLevel || 'Easy');
            setQuestionGroup(item.questionGroup || 'General');
            setQuestionType(item.questionType || 'Single Answer');
            setQuestion(item.question || '');
            setMark(item.mark || 1);
            setExplanation(item.explanation || '');
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
    if (!question.trim()) errs.question = t('Question text is required');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        difficultyLevel,
        questionGroup,
        questionType,
        question: question.trim(),
        mark: Number(mark) || 1,
        explanation: explanation.trim(),
      };

      if (isEditMode && id) {
        await dataService.updateQuestionBank(id, payload);
        showToast(t('Question Bank entry updated successfully'), 'success');
      } else {
        await dataService.addQuestionBank(payload);
        showToast(t('Question Bank entry added successfully'), 'success');
      }

      setTimeout(() => {
        navigate('/dashboard/online-exam/question-bank');
      }, 800);
    } catch (err: any) {
      showToast(err.message || t('Failed to save Question Bank entry'), 'error');
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
        titleKey={isEditMode ? 'Edit Question Bank' : 'Add a Question Bank'}
        iconName="fa-folder"
        breadcrumbLabel={isEditMode ? 'Edit Question Bank' : 'Add Question Bank'}
      />

      <div className="p-[20px] bg-bodyBg">
        <div className="bg-white rounded-[3px] border border-[#e1e1e1] shadow-sm max-w-3xl mx-auto overflow-hidden">
          <div className="bg-[#fcfcfc] border-b border-[#e1e1e1] px-6 py-4 flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-[#444] m-0">
              {isEditMode ? t('Edit Question Bank') : t('Add a Question Bank')}
            </h2>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => navigate('/dashboard/online-exam/question-bank')}
            >
              <Icon name="fa-arrow-left" className="mr-1" /> {t('Back to List')}
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Difficulty Level */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t('Difficulty Level')} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <select
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(e.target.value)}
                  className="w-full border border-[#dfe6e9] rounded px-3 py-2 text-sm text-dark focus:outline-none focus:ring-1 focus:ring-[#1ab394] bg-white"
                >
                  {levelOptions.map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Question Group */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t('Question Group')} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <select
                  value={questionGroup}
                  onChange={(e) => setQuestionGroup(e.target.value)}
                  className="w-full border border-[#dfe6e9] rounded px-3 py-2 text-sm text-dark focus:outline-none focus:ring-1 focus:ring-[#1ab394] bg-white"
                >
                  {groupOptions.map((grp) => (
                    <option key={grp} value={grp}>{grp}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Question Type */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t('Question Type')} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="w-full border border-[#dfe6e9] rounded px-3 py-2 text-sm text-dark focus:outline-none focus:ring-1 focus:ring-[#1ab394] bg-white"
                >
                  {typeOptions.map((typ) => (
                    <option key={typ} value={typ}>{typ}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mark / Points */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t('Mark / Points')}
              </label>
              <div className="sm:w-3/4">
                <Input
                  type="number"
                  min="1"
                  value={mark}
                  onChange={(e) => setMark(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Question Body */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444] sm:pt-2">
                {t('Question')} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <textarea
                  rows={4}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter full question text here..."
                  className="w-full rounded-[3px] border border-[#d2d6de] px-3 py-2 text-[13px] focus:border-[#1ab394] focus:outline-none resize-y"
                />
                {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question}</p>}
              </div>
            </div>

            {/* Explanation / Notes */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444] sm:pt-2">
                {t('Explanation / Notes')}
              </label>
              <div className="sm:w-3/4">
                <textarea
                  rows={3}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Optional answer explanation or solution notes..."
                  className="w-full rounded-[3px] border border-[#d2d6de] px-3 py-2 text-[13px] focus:border-[#1ab394] focus:outline-none resize-y"
                />
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
                onClick={() => navigate('/dashboard/online-exam/question-bank')}
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
