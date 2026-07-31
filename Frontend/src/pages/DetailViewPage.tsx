/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useLanguage } from '../context/LanguageContext';
import { Icon } from '../components/ui/Icon';
import { AttendanceCalendarGrid } from '../components/attendance/AttendanceCalendarGrid';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { userApi } from '../services/api/userApi';
import { attendanceApi, type AttendanceRecord } from '../services/api/attendanceApi';
// import { documentApi } from '../services/api/documentApi';
import type { ProfileDetails } from '../types';
import { getPhotoUrl, handleImageError } from "../Utils/image";
import { dataService } from '../services/dataService';
import type { Enquiry } from '../types';
import { studentApi } from '../services/api/studentApi';
import { teacherApi } from '../services/api/teacherApi';
import { authService } from '../services/authService';

export const DetailViewPage: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isAdmin = authService.getUserRole() === 'Admin';

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'attendance' | 'document'>('profile');
  const [profile, setProfile] = useState<ProfileDetails | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapEnquiryToProfile = (e: Enquiry): ProfileDetails => ({
    name: e.studentName,
    roleLabel: "Enquiry",
    photo: e.photo || "",
    gender: e.gender,
    dob: e.dob,
    phone: e.fatherContact || e.motherContact || "",
    joiningDate: e.createdAt || "-",
    religion: "-",
    email: e.fatherEmail || e.motherEmail || "",
    address: e.address,
    username: "-",
    class: e.applyingClass,
    roll: "-",
    documents: e.documents || [],
  });

  const fetchProfileAndDocs = async () => {
    setLoading(true);
    setError(null);
    try {
      const profileKey = type && type.includes('attendance') ? type.split('-')[0] : type;
      if (profileKey && id) {
        if (profileKey === 'enquiry') {
          const enquiryData = await dataService.getEnquiryById(id);
          setProfile(mapEnquiryToProfile(enquiryData));
        } else {
          const profileData = await userApi.getProfile(profileKey, id);
          setProfile(profileData);

          // Fetch real attendance for the current month
          const month = new Date().toISOString().slice(0, 7); // YYYY-MM
          try {
            const attendanceData = await attendanceApi.getUserAttendance(profileKey, id, month);
            setAttendance(attendanceData);
          } catch (attErr) {
            console.warn("Failed to fetch attendance:", attErr);
            setAttendance([]);
          }
        }
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

  // 👇 YE NAYA ADD KARO
  const handleDelete = async () => {
    if (!id || !type || !isAdmin) return;

    const profileKey = type.includes('attendance') ? type.split('-')[0] : type;
    const confirmMsg = `Are you sure you want to delete ${profile?.name || 'this record'}?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      if (profileKey === 'student') {
        await studentApi.delete(id);
      } else if (profileKey === 'enquiry') {
        await dataService.deleteEnquiry(id);
      } else if (profileKey === 'teacher') {
        await teacherApi.delete(id);
      } else {
        alert(`Delete not supported for type: ${profileKey}`);
        return;
      }
      navigate(profileKey === 'enquiry' ? '/dashboard/student' : `/dashboard/${profileKey}`);
    } catch (err: any) {
      alert(err.message || 'Failed to delete record');
    }
  };

  const profileKey = type && type.includes('attendance') ? type.split('-')[0] : type;

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

          {isAdmin && (
            <div className="flex gap-2">
              {profileKey === 'teacher' && (
                <Button
                  onClick={() => navigate(`/dashboard/teacher/edit/${id}`)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-primary hover:opacity-90 text-white rounded transition-opacity text-[13px] font-medium border-0 cursor-pointer shadow-sm active:scale-95"
                >
                  <Icon name="fa-pencil" className="w-4 h-4" />
                  {t("Edit")}
                </Button>
              )}
              <Button
                onClick={handleDelete}
                className="flex items-center gap-2 px-3 py-1.5 bg-iconred hover:opacity-90 text-white rounded transition-opacity text-[13px] font-medium border-0 cursor-pointer shadow-sm active:scale-95"
              >
                <Icon name="fa-trash" className="w-4 h-4" />
                {t("Delete")}
              </Button>
            </div>
          )}
        </div>

        <nav className="text-[13px] text-muted flex items-center space-x-1">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-1 hover:text-white transition-colors cursor-pointer bg-transparent border-0 text-muted"
          >
            <Icon name="fa-laptop" className="w-4 h-4 text-muted" />
            <span>{t("Dashboard")}</span>
          </button>
          <span>/</span>
          <span className="text-teal font-medium">{t("Profile")}</span>
        </nav>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 animate-fadeIn">
        {/* Left Side Profile Card */}
        <div className="lg:w-1/4 bg-white rounded-lg shadow-sm border border-[#e7eaec] p-6 flex flex-col items-center">
          <div className="w-28 h-28 rounded-full border-[5px] border-[#e1e1e1] shadow-inner overflow-hidden mb-4">
            <img
              src={getPhotoUrl(profile.photo)}
              onError={handleImageError}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-[18px] font-bold text-dark">{profile.name}</h2>
          <p className="text-muted text-[13px] mt-1 mb-6">{t(profile.roleLabel)}</p>

          {/* Left card details table */}
          <div className="w-full border border-[#e7eaec] rounded-[4px] overflow-hidden text-[13px]">
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
        <div className="lg:w-3/4 bg-white rounded-lg shadow-sm border border-[#e7eaec] overflow-hidden flex flex-col">
          {/* Tab Headers switcher */}
          <div className="bg-[#fdfdfd] border-b border-[#e7eaec] px-6 flex space-x-1 select-none">
            <Button
              variant="link"
              onClick={() => setActiveSubTab('profile')}
              className={`py-3.5 px-4 text-sm font-semibold transition-all border-b-2 rounded-none hover:no-underline active:scale-100 shadow-none ${
                activeSubTab === 'profile'
                  ? 'border-teal text-teal font-bold'
                  : 'border-transparent text-muted hover:text-dark'
              }`}
            >
              {t("Profile")}
            </Button>
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
            <Button
              variant="link"
              onClick={() => setActiveSubTab('document')}
              className={`py-3.5 px-4 text-sm font-semibold transition-all border-b-2 rounded-none hover:no-underline active:scale-100 shadow-none ${
                activeSubTab === 'document'
                  ? 'border-teal text-teal font-bold'
                  : 'border-transparent text-muted hover:text-dark'
              }`}
            >
              {t("Document")}
            </Button>
          </div>

          {/* SubTab contents */}
          <div className="p-6">
            {activeSubTab === 'profile' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-12 text-[14px]">
                    <span className="col-span-5 font-semibold text-muted">{t("Joining Date")}</span>
                    <span className="col-span-1 text-center text-muted">:</span>
                    <span className="col-span-6 font-medium text-dark">{profile.joiningDate}</span>
                  </div>
                  <div className="grid grid-cols-12 text-[14px]">
                    <span className="col-span-5 font-semibold text-muted">{t("Email")}</span>
                    <span className="col-span-1 text-center text-muted">:</span>
                    <span className="col-span-6 font-medium text-dark truncate" title={profile.email}>{profile.email}</span>
                  </div>
                  <div className="grid grid-cols-12 text-[14px]">
                    <span className="col-span-5 font-semibold text-muted">{t("Username")}</span>
                    <span className="col-span-1 text-center text-muted">:</span>
                    <span className="col-span-6 font-medium text-dark">{profile.username}</span>
                  </div>
                  {profile.class && (
                    <div className="grid grid-cols-12 text-[14px]">
                      <span className="col-span-5 font-semibold text-muted">{t("Class")}</span>
                      <span className="col-span-1 text-center text-muted">:</span>
                      <span className="col-span-6 font-medium text-dark">{profile.class}</span>
                    </div>
                  )}
                  {profile.designation && (
                    <div className="grid grid-cols-12 text-[14px]">
                      <span className="col-span-5 font-semibold text-muted">{t("Designation")}</span>
                      <span className="col-span-1 text-center text-muted">:</span>
                      <span className="col-span-6 font-medium text-dark">{profile.designation}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-12 text-[14px]">
                    <span className="col-span-5 font-semibold text-muted">{t("Religion")}</span>
                    <span className="col-span-1 text-center text-muted">:</span>
                    <span className="col-span-6 font-medium text-dark">{t(profile.religion)}</span>
                  </div>
                  <div className="grid grid-cols-12 text-[14px]">
                    <span className="col-span-5 font-semibold text-muted">{t("Address")}</span>
                    <span className="col-span-1 text-center text-muted">:</span>
                    <span className="col-span-6 font-medium text-dark leading-relaxed">{profile.address}</span>
                  </div>
                  {profile.section && (
                    <div className="grid grid-cols-12 text-[14px]">
                      <span className="col-span-5 font-semibold text-muted">{t("Section")}</span>
                      <span className="col-span-1 text-center text-muted">:</span>
                      <span className="col-span-6 font-medium text-dark">{profile.section}</span>
                    </div>
                  )}
                  {profile.roll && (
                    <div className="grid grid-cols-12 text-[14px]">
                      <span className="col-span-5 font-semibold text-muted">{t("Roll")}</span>
                      <span className="col-span-1 text-center text-muted">:</span>
                      <span className="col-span-6 font-medium text-dark">{profile.roll}</span>
                    </div>
                  )}
                  {profile.department && (
                    <div className="grid grid-cols-12 text-[14px]">
                      <span className="col-span-5 font-semibold text-muted">{t("Department")}</span>
                      <span className="col-span-1 text-center text-muted">:</span>
                      <span className="col-span-6 font-medium text-dark">{profile.department}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSubTab === 'attendance' && (
              <div className="space-y-4">
                {/* 12x31 Month Day Grid - Mapping API status to Calendar grid expectations */}
                <AttendanceCalendarGrid
                  attendance={attendance.reduce((acc, curr) => {
                    const day = parseInt(curr.date.split('-')[2]);
                    acc[day] = curr.status;
                    return acc;
                  }, {} as Record<number, string>)}
                />
                
                {/* Stats list footer */}
                <div className="mt-4 text-[13px] text-muted select-none">
                  {t("Present")}: {attendance.filter(a => a.status === 'Present').length},
                  {t("Absent")}: {attendance.filter(a => a.status === 'Absent').length},
                  {t("Late")}: {attendance.filter(a => a.status === 'Late').length},
                  {t("Half Day")}: {attendance.filter(a => a.status === 'Half Day').length}
                </div>
              </div>
            )}

            {activeSubTab === 'document' && (
              <div className="border border-[#e7eaec] rounded-[3px] overflow-hidden">
                <table className="w-full border-collapse text-[13px]">
                  <thead className="bg-[#f8f9fa] border-b border-[#e7eaec] select-none">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-muted w-12">#</th>
                      <th className="px-4 py-3 text-left font-semibold text-muted">{t("Document Name / Title")}</th>
                      <th className="px-4 py-3 text-left font-semibold text-muted w-24">{t("Action")}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#f0f0f0]">
                    {profile.documents && profile.documents.length > 0 ? (
                      profile.documents.map((doc, index) => (
                        <tr key={index} className="hover:bg-[#fafafa] transition-colors">
                          <td className="px-4 py-3 text-dark">{index + 1}</td>
                          <td className="px-4 py-3 text-dark font-medium">
                            {doc.name || `${t("Document")} ${index + 1}`}
                          </td>
                          <td className="px-4 py-3 text-dark">
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => {
                                // If it's a base64 string, open it in a new tab
                                if (doc.file.startsWith('data:')) {
                                  const win = window.open();
                                  win?.document.write(`<iframe src="${doc.file}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                                } else {
                                  window.open(getPhotoUrl(doc.file), '_blank');
                                }
                              }}
                              className="rounded-[3px] px-[8px] py-[5px] text-[13px]"
                            >
                              <Icon name="fa-eye" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-4 py-6 text-center text-muted italic">
                          {t("No documents available for this profile")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
