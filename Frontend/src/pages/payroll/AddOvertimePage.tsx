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

export const AddOvertimePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [role, setRole] = useState('Teacher');
  const [user, setUser] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hours, setHours] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const rolesList = ['Teacher', 'Staff', 'Accountant', 'Librarian', 'Receptionist', 'Admin'];

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (isEditMode && id) {
      const loadItem = async () => {
        try {
          const all = await dataService.getOvertimes();
          const item = all.find((x) => String(x.id) === String(id));
          if (item) {
            setRole(item.role || 'Teacher');
            setUser(item.user || '');
            setDate(item.date || new Date().toISOString().split('T')[0]);
            setHours(item.hours || '');
            setTotalAmount(item.totalAmount || '');
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
    if (!user.trim()) errs.user = t('User / Staff name is required');
    if (!hours.trim()) errs.hours = t('Hours is required');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        role,
        user: user.trim(),
        date,
        hours: hours.trim(),
        totalAmount: totalAmount.trim() || '0.00',
      };

      if (isEditMode && id) {
        await dataService.updateOvertime(id, payload);
        showToast(t('Overtime updated successfully'), 'success');
      } else {
        await dataService.addOvertime(payload);
        showToast(t('Overtime added successfully'), 'success');
      }

      setTimeout(() => {
        navigate('/dashboard/payroll/overtime');
      }, 800);
    } catch (err: any) {
      showToast(err.message || t('Failed to save Overtime record'), 'error');
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
        titleKey={isEditMode ? 'Edit Overtime' : 'Add a Overtime'}
        iconName="fa-folder"
        breadcrumbLabel={isEditMode ? 'Edit Overtime' : 'Add Overtime'}
      />

      <div className="p-[20px] bg-bodyBg">
        <div className="bg-white rounded-[3px] border border-[#e1e1e1] shadow-sm max-w-2xl mx-auto overflow-hidden">
          <div className="bg-[#fcfcfc] border-b border-[#e1e1e1] px-6 py-4 flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-[#444] m-0">
              {isEditMode ? t('Edit Overtime') : t('Add a Overtime')}
            </h2>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => navigate('/dashboard/payroll/overtime')}
            >
              <Icon name="fa-arrow-left" className="mr-1" /> {t('Back to List')}
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Role */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t('Role')} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-[#dfe6e9] rounded px-3 py-2 text-sm text-dark focus:outline-none focus:ring-1 focus:ring-[#1ab394] bg-white"
                >
                  {rolesList.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* User */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t('User')} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <Input
                  type="text"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="e.g. Alisha Henry"
                  className="w-full"
                  required
                />
                {errors.user && <p className="text-red-500 text-xs mt-1">{errors.user}</p>}
              </div>
            </div>

            {/* Date */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t('Date')}
              </label>
              <div className="sm:w-3/4">
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Hours */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t('Hours')} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <Input
                  type="text"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="e.g. 5"
                  className="w-full"
                  required
                />
                {errors.hours && <p className="text-red-500 text-xs mt-1">{errors.hours}</p>}
              </div>
            </div>

            {/* Total Amount */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t('Total Amount')}
              </label>
              <div className="sm:w-3/4">
                <Input
                  type="text"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  placeholder="e.g. 2,500.00"
                  className="w-full"
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
                onClick={() => navigate('/dashboard/payroll/overtime')}
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
