/**
 * ProfileCard — User profile card with colored header and detail rows.
 *
 * Why: The profile section has a unique pink header + detail list pattern
 *      that's distinct enough to warrant its own component.
 *
 * Props:
 *  - name     : user display name
 *  - role     : user role text
 *  - avatarUrl: URL for the profile image
 *  - details  : array of { icon, label, value } for each detail row
 */

import type { ProfileDetailData } from "../../constants/LibrariandashboardData";
import { Icon } from "../ui/Icon";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { getPhotoUrl, handleImageError } from "../../Utils/image";

interface ProfileCardProps {
  name: string;
  role: string;
  avatarUrl: string;
  details: ProfileDetailData[];
}

export function ProfileCard({ name, role, avatarUrl, details }: ProfileCardProps) {
  const displayName = sessionStorage.getItem("userName") || name;
  const displayRole = sessionStorage.getItem("userRole") || role;
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    const userId = sessionStorage.getItem("userId") || "1";
    navigate(`/dashboard/view/user/${userId}`);
  };

  return (
    <div className="overflow-hidden rounded-[4px] bg-white shadow-[0_1px_1px_rgba(0,0,0,.1)]">
      {/* Header */}
      <div
        onClick={handleProfileClick}
        className="bg-pinkhead px-[5px] py-[15px] text-center text-white cursor-pointer hover:opacity-95 transition-opacity select-none"
      >
        <div className="mx-auto mb-[10px] mt-[8px] flex h-[45px] w-[45px] items-center justify-center overflow-hidden rounded-full border border-white bg-teal text-[18px] text-white">
          <img src={getPhotoUrl(avatarUrl)} onError={handleImageError} className="h-full w-full object-cover" alt="Profile Image" />
        </div>
        <h4 className="m-0 mt-[5px] text-[20px] font-normal italic">{displayName}</h4>
        <p className="m-0 mt-[4px] text-[13px] italic opacity-95">{t(displayRole)}</p>
      </div>

      {/* Detail Rows */}
      <div>
        {details.map((detail, index) => {
          const displayValue =
            detail.label === "Username"
              ? sessionStorage.getItem("loginUsername") || detail.value
              : detail.value;

          return (
            <div
              key={detail.label}
              className={`flex items-center px-[15px] py-[12px]${index < details.length - 1 ? " border-b border-[#f0f0f0]" : ""
                }`}
            >
              <Icon name={detail.icon} className="w-[20px] text-[14px] text-iconred mr-[10px]" />
              <span className="w-[90px] text-left text-[13px] text-muted">{t(detail.label)}</span>
              <span className="text-[13px] text-muted flex-1 break-all">{displayValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
