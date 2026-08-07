/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useLanguage } from '../../context/LanguageContext';
import { Icon } from '../../components/ui/Icon';
import { AttendanceCalendarGrid } from '../../components/attendance/AttendanceCalendarGrid';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { userApi } from '../../services/api/userApi';
import type { ProfileDetails } from '../../types';
import { getPhotoUrl, handleImageError } from "../../Utils/image";
import { DEFAULT_ATTENDANCE } from '../../constants/mockData';

export const AttendenceViewPage: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const { t } = useLanguage();

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'attendance' | 'document'>('profile');
  const [profile, setProfile] = useState<ProfileDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileAndDocs = async () => {
    setLoading(true);
    setError(null);
    try {
      const profileKey = type && type.includes('attendance') ? type.split('-')[0] : type;
      if (profileKey && id) {
        const profileData = await userApi.getProfile(profileKey, id);
        setProfile(profileData);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndDocs();
  }, [type, id]);

  const handlePrint = () => {
    window.print();
  };

  const handleMail = () => {
    alert("Email sent: Success!");
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

  if (error || !profile) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <ErrorMessage message={error || "Profile not found"} onRetry={fetchProfileAndDocs} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Upper action header container with styling matching screenshots */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 select-none animate-fadeIn">
       <h1 className="text-[18px] font-bold text-dark text-6xl">
        {t("Attendance")}
       </h1>
       
        <div className="flex gap-2">
          <Button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#ff7675] hover:opacity-90 text-white rounded transition-opacity text-[13px] font-medium border-0 cursor-pointer shadow-sm active:scale-95"
          >
            <Icon name="fa-print" className="w-4 h-4" />
            {t("Print")}
          </Button>
          <Button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#ff7675] hover:opacity-90 text-white rounded transition-opacity text-[13px] font-medium border-0 cursor-pointer shadow-sm active:scale-95"
          >
            <Icon name="fa-file-pdf-o" className="w-4 h-4" />
            {t("PDF Preview")}
          </Button>
          <Button
            onClick={handleMail}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#ff7675] hover:opacity-90 text-white rounded transition-opacity text-[13px] font-medium border-0 cursor-pointer shadow-sm active:scale-95"
          >
            <Icon name="fa-envelope" className="w-4 h-4" />
            {t("Send PDF To Mail")}
          </Button>
        </div>

        
      </div>

      <div className="flex flex-col lg:flex-row gap-2 animate-fadeIn">
        {/* Left Side Profile Card */}
        <div className="lg:w-2/9 bg-white rounded-lg shadow-sm border border-[#e7eaec] p-6 flex flex-col items-center">
          <div className="w-28 h-28 rounded-full border-[5px] border-[#e1e1e1] shadow-inner overflow-hidden mb-4">
            <img
              src={getPhotoUrl(profile.photo)}
              onError={handleImageError}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-[18px] font-bold text-dark">{profile.name}</h2>
          <p className="text-muted text-[12px] mt-1 mb-6">{t(profile.roleLabel)}</p>

          {/* Left card details table */}
          <div className="w-full border border-[#e7eaec] rounded-[4px] overflow-hidden text-[12px]">
            <div className="flex justify-between p-3 border-b border-[#f0f0f0]">
              <span className="font-semibold text-muted">{t("Gender")}</span>
              <span className="text-dark font-medium">{t(profile.gender)}</span>
            </div>
            <div className="flex justify-between p-3 border-b border-[#f0f0f0]">
              <span className="font-semibold text-muted">{t("Date of Birth")}</span>
              <span className="text-dark font-medium">{profile.dob}</span>
            </div>
            <div className="flex justify-between p-3 bg-[#fcfcfc]">
              <span className="font-semibold text-muted">{t("Phone")}</span>
              <span className="text-dark font-medium">{profile.phone}</span>
            </div>
          </div>
        </div>

        {/* Right Side Tabbed Panel */}
        <div className="lg:w-7/9 bg-white rounded-lg shadow-sm border border-[#e7eaec] overflow-hidden flex flex-col">
          {/* Tab Headers switcher */}
          <div className="bg-[#fdfdfd] border-b border-[#e7eaec] px-6 flex space-x-1 select-none">

            <Button
              variant="link"
              onClick={() => setActiveSubTab('attendance')}
              className={`py-3.5 px-4 text-sm font-semibold transition-all border-b-2 rounded-none hover:no-underline active:scale-100 shadow-none ${
                activeSubTab === 'attendance'
                  ? 'border-teal text-teal font-bold'
                  : 'border-transparent text-muted hover:text-dark'
              }`}
            >
              {t("Attendance")}
            </Button>

          </div>

          {/* SubTab contents */}
          <div className="p-1.5">

            
              <div className="space-y-4">
                {/* 12x31 Month Day Grid */}
                <AttendanceCalendarGrid attendance={DEFAULT_ATTENDANCE} />
                
                {/* Stats list footer */}
                <div className="mt-4 text-[13px] text-muted select-none">
                  {t("Total Holiday")}:12, {t("Total Weekend")}:51, {t("Total Leave")}:0, {t("Total Present")}:7, {t("Total Late With Excuse")}:1, {t("Total Late")}:0, {t("Total Absent")}:0
                </div>
              </div>
            


          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
