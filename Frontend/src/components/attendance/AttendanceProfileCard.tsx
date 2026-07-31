import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface AttendanceProfileCardProps {
  name: string;
  title: string;
  photo: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
}

export const AttendanceProfileCard: React.FC<AttendanceProfileCardProps> = ({
  name,
  title,
  photo,
  gender,
  dateOfBirth,
  phone,
}) => {
  const { t } = useLanguage();

  return (
    <div className="lg:w-1/4 bg-white rounded-lg shadow-sm border border-[#e7eaec] p-6">
      <div className="text-center">
        <img
          src={photo}
          alt={name}
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-gray-100 shadow-sm"
        />
        <h2 className="text-xl font-semibold text-dark">{name}</h2>
        <p className="text-muted text-sm mt-1">{t(title)}</p>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex justify-between py-2 border-b border-[#f0f0f0]">
          <span className="text-muted text-sm font-medium">{t("Gender")}</span>
          <span className="text-dark text-sm font-medium">{t(gender)}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-[#f0f0f0]">
          <span className="text-muted text-sm font-medium">{t("Date of Birth")}</span>
          <span className="text-dark text-sm font-medium">{dateOfBirth}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-muted text-sm font-medium">{t("Phone")}</span>
          <span className="text-dark text-sm font-medium">{phone}</span>
        </div>
      </div>
    </div>
  );
};
