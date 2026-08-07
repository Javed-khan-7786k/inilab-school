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

export const AddMailSMSPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [role, setRole] = useState('Parents');
  const [users, setUsers] = useState('');
  const [type, setType] = useState('Email');
  const [message, setMessage] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const rolesList = ['Parents', 'Student', 'Teacher', 'Admin', 'Staff', 'All'];

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (isEditMode && id) {
      const loadItem = async () => {
        try {
          const all = await dataService.getMailSMSList();
          const item = all.find((x) => String(x.id) === String(id));
          if (item) {
            setRole(item.role || 'Parents');
            setUsers(item.users || '');
            setType(item.type || 'Email');
            setMessage(item.message || '');
            setDateTime(item.dateTime || '');
          }
        } catch (err: any) {
          showToast(err.message || t('Failed to load entry data'), 'error');
        } finally {
          setLoading(false);
        }
      };
      loadItem();
    }
  }, [id, isEditMode, t]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!users.trim()) errs.users = t('Recipients / Users are required');
    if (!message.trim()) errs.message = t('Message content is required');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const nowFormatted =
        dateTime ||
        new Date().toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });

      const payload = {
        role,
        users: users.trim(),
        type,
        dateTime: nowFormatted,
        message: message.trim(),
      };

      if (isEditMode && id) {
        // If editing is requested
        showToast(t('Mail / SMS updated successfully'), 'success');
      } else {
        await dataService.addMailSMS(payload);
        showToast(t('Mail / SMS sent successfully'), 'success');
      }

      setTimeout(() => {
        navigate('/dashboard/mail-sms');
      }, 800);
    } catch (err: any) {
      showToast(err.message || t('Failed to save Mail / SMS'), 'error');
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
        titleKey={isEditMode ? 'Edit Mail / SMS' : 'Add a mail / sms'}
        iconName="fa-paper-plane"
        breadcrumbLabel={isEditMode ? 'Edit Mail / SMS' : 'Add a mail / sms'}
      />

      <div className="p-[20px] bg-bodyBg">
        <div className="bg-white rounded-[3px] border border-[#e1e1e1] shadow-sm max-w-3xl mx-auto overflow-hidden">
          <div className="bg-[#fcfcfc] border-b border-[#e1e1e1] px-6 py-4 flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-[#444] m-0">
              {isEditMode ? t('Edit Mail / SMS') : t('Add a mail / sms')}
            </h2>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => navigate('/dashboard/mail-sms')}
            >
              <Icon name="fa-arrow-left" className="mr-1" /> {t('Back to List')}
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Role Selection */}
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
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Users / Recipients */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t('Recipients (Users)')} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <Input
                  type="text"
                  value={users}
                  onChange={(e) => setUsers(e.target.value)}
                  placeholder="e.g. George Chapman or Ryan Thompson ,Kiera Turnbull..."
                  className="w-full"
                />
                {errors.users && <p className="text-red-500 text-xs mt-1">{errors.users}</p>}
              </div>
            </div>

            {/* Type Radio */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t('Type')} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4 flex items-center space-x-6">
                <label className="inline-flex items-center cursor-pointer text-sm font-medium text-gray-700">
                  <input
                    type="radio"
                    name="type"
                    value="Email"
                    checked={type === 'Email'}
                    onChange={(e) => setType(e.target.value)}
                    className="w-4 h-4 text-[#1ab394] focus:ring-[#1ab394] border-gray-300"
                  />
                  <span className="ml-2 flex items-center gap-1">
                    <Icon name="fa-envelope" className="text-blue-500" /> {t('Email')}
                  </span>
                </label>
                <label className="inline-flex items-center cursor-pointer text-sm font-medium text-gray-700">
                  <input
                    type="radio"
                    name="type"
                    value="Sms"
                    checked={type === 'Sms'}
                    onChange={(e) => setType(e.target.value)}
                    className="w-4 h-4 text-[#1ab394] focus:ring-[#1ab394] border-gray-300"
                  />
                  <span className="ml-2 flex items-center gap-1">
                    <Icon name="fa-mobile" className="text-teal-500" /> {t('SMS')}
                  </span>
                </label>
              </div>
            </div>

            {/* Message Body */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444] sm:pt-2">
                {t('Message')} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your mail or SMS content here..."
                  className="w-full rounded-[3px] border border-[#d2d6de] px-3 py-2 text-[13px] focus:border-[#1ab394] focus:outline-none resize-y"
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>
            </div>

            {/* Form Action Buttons */}
            <div className="pt-4 border-t border-[#eee] flex items-center justify-end sm:pl-[25%] gap-3">
              <Button type="submit" variant="success" disabled={submitting} className="bg-[#1ab394] hover:bg-[#18a689]">
                {submitting ? <Spinner size="sm" /> : isEditMode ? t('Update') : t('Send / Save')}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/dashboard/mail-sms')}
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
