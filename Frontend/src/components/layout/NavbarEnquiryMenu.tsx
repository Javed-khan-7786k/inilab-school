
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { Icon } from "../ui/Icon";

export function NavbarEnquiryMenu() {
  const navigate = useNavigate();
  const { t } = useLanguage();



  return (
    <div  className="relative">
        <div className="">
          <div className="py-[4px]">
            <button
              type="button"
              onClick={() => {
                navigate("/dashboard/enquiry/new");
              }}
              className="flex w-full cursor-pointer items-center gap-[12px] px-[15px] py-[9px] hover:bg-[#f5f5f5] text-left border-0 bg-transparent transition-colors duration-150"
            >
              <Icon name="fa-plus" className="text-muted text-[13px] w-[16px] text-center" />
              <span className="flex-1 text-[13px] text-dark font-normal">
                {t("New Enquiry")}
              </span>
            </button>
          </div>
        </div>

    </div>
  );
}
