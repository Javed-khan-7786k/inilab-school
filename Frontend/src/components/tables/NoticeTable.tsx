/**
 * NoticeTable — Table of notice items inside a PanelCard.
 *
 * Why: The notice section has a specific table layout with striped rows
 *      and active action view buttons. Fetches live data from DB.
 */

import { useEffect, useState } from "react";
import type { NoticeData } from "../../constants/LibrariandashboardData";
import { PanelCard } from "../ui/PanelCard";
import { Icon } from "../ui/Icon";
import { useLanguage } from "../../context/LanguageContext";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { noticeApi } from "../../services/api/noticeApi";

interface NoticeTableProps {
  notices?: NoticeData[];
}

export function NoticeTable({ notices: initialNotices }: NoticeTableProps) {
  const { t } = useLanguage();
  const [notices, setNotices] = useState<NoticeData[]>(initialNotices || []);
  const [selectedNotice, setSelectedNotice] = useState<NoticeData | null>(null);

  useEffect(() => {
    // Fetch live notices from MongoDB database
    const fetchLiveNotices = async () => {
      try {
        const data = await noticeApi.getAll();
        if (data && data.length > 0) {
          const mapped: NoticeData[] = data.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.notice,
            notice: item.notice,
            date: item.date,
          }));
          setNotices(mapped);
        } else if (initialNotices && initialNotices.length > 0) {
          setNotices(initialNotices);
        }
      } catch (err) {
        console.warn("NoticeTable: Failed fetching DB notices, using fallback props", err);
        if (initialNotices) setNotices(initialNotices);
      }
    };

    fetchLiveNotices();
  }, [initialNotices]);

  return (
    <PanelCard title={t("Notice")}>
      <table className="w-full border-collapse">
        <tbody>
          {notices.map((notice, index) => {
            const isLast = index === notices.length - 1;
            notice.id=index+1
            const borderClass = isLast ? "" : " border-b-2 border-[#f5f6fa]";

            return (
              <tr key={notice.id} className="even:bg-noticestripe">
                <td
                  className={`w-[30px] px-[15px] py-[10px] align-middle text-[12px] text-muted${borderClass}`}
                >
                  {index + 1}
                </td>
                <td
                  className={`w-[200px] px-[15px] py-[10px] align-middle text-[12px] font-thin text-dark${borderClass}`}
                >
                  {t(notice.title)}
                </td>
                <td
                  className={`px-[15px] py-[10px] align-middle text-[12px] text-muted${borderClass}`}
                >
                  {t(notice.description || notice.notice || "")}
                </td>
                <td
                  className={`w-[40px] px-[15px] py-[10px] text-right align-middle${borderClass}`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedNotice(notice)}
                    className="inline-block rounded-[3px] bg-action px-[8px] py-[5px] text-[13px] text-white hover:opacity-90 transition-opacity border-0 cursor-pointer"
                    title={t("View Notice")}
                  >
                    <Icon name="fa-check-square-o" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Notice Details Modal */}
      <Modal
        isOpen={Boolean(selectedNotice)}
        onClose={() => setSelectedNotice(null)}
        title={selectedNotice?.title ? t(selectedNotice.title) : t("Notice Details")}
        maxWidthClass="max-w-lg"
      >
        {selectedNotice && (
          <div className="p-6 space-y-4 select-none">
            <div className="flex justify-between items-center text-[12px] text-muted border-b border-[#f0f0f0] pb-2">
              <span>{t("Notice Date")}: {selectedNotice.date || "N/A"}</span>
              <span>ID: #{selectedNotice.id}</span>
            </div>
            <p className="text-[14px] text-muted leading-relaxed whitespace-pre-line">
              {selectedNotice.notice || selectedNotice.description}
            </p>
            <div className="pt-2 flex justify-end">
              <Button className="inline-block rounded-[3px] bg-[#e84393] px-[8px] py-[5px] text-[13px] text-[#e84385] hover:opacity-90 transition-opacity border-0 cursor-pointer" onClick={() => setSelectedNotice(null)}>
                {t("Close")}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PanelCard>
  );
}
