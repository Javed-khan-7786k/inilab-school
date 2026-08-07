import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GenericTablePage } from "../../components/common/GenericTablePage";
import type { Column } from "../../components/common/GenericTablePage";
import type { MarkDistributionItem } from "../../types";
import { dataService } from "../../services/dataService";
import { useApi } from "../../hooks/useApi";
import { Spinner } from "../../components/ui/Spinner";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { Icon } from "../../components/ui/Icon";
import { useLanguage } from "../../context/LanguageContext";
import { authService } from "../../services/authService";

export function MarkMarkDistributionPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const userRole = authService.getUserRole();
  const isAuthorized = userRole === "Admin" || userRole === "Principal";

  const {
    data: markDistributions,
    loading,
    error,
    execute: fetchMarkDistributions,
  } = useApi<MarkDistributionItem[], []>(
    () => dataService.getMarkDistributions(),
    true,
    []
  );

  useEffect(() => {
    fetchMarkDistributions();
  }, [fetchMarkDistributions]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteItem = async (item: MarkDistributionItem) => {
    if (!window.confirm(t("Are you sure you want to delete this mark distribution?"))) return;
    try {
      await dataService.deleteMarkDistribution(item.id);
      showToast(t("Mark distribution deleted successfully"), "success");
      fetchMarkDistributions();
    } catch (err: any) {
      showToast(err.message || t("Error deleting mark distribution"), "error");
    }
  };

  const columns: Column<MarkDistributionItem>[] = [
    { key: "id", label: "#" },
    { key: "markDistributionType", label: "Mark Distribution Type" },
    { key: "markValue", label: "Mark Value" },
    {
      key: "action",
      label: "Action",
      sortable: false,
      render: (item) => (
        <div className="flex items-center gap-1.5 flex-nowrap">
          {isAuthorized && (
            <>
              <button
                type="button"
                onClick={() => navigate(`/dashboard/mark/distribution/edit/${item.id}`)}
                title={t("Edit")}
                className="rounded-[3px] px-[8px] py-[5px] text-[13px] text-white border-0 bg-primary hover:opacity-90 transition-colors cursor-pointer"
              >
                <Icon name="fa-pencil" />
              </button>

              <button
                type="button"
                onClick={() => handleDeleteItem(item)}
                title={t("Delete")}
                className="rounded-[3px] px-[8px] py-[5px] text-[13px] text-white border-0 bg-iconred hover:opacity-90 transition-colors cursor-pointer"
              >
                <Icon name="fa-trash" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const filterFn = (item: MarkDistributionItem, searchTerm: string) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.markDistributionType.toLowerCase().includes(term) ||
      String(item.markValue).toLowerCase().includes(term)
    );
  };

  if (loading && (!markDistributions || markDistributions.length === 0)) {
    return (
      <div className="min-h-screen bg-bodyBg flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage message={error} onRetry={fetchMarkDistributions} />
      </div>
    );
  }

  return (
    <>
      <GenericTablePage<MarkDistributionItem>
        titleKey="Mark Distribution"
        iconName="fa-sliders"
        columns={columns}
        initialData={markDistributions || []}
        filterFn={filterFn}
        onAddClick={() => navigate("/dashboard/mark/distribution/add")}
      />

      {toast && (
        <div
          className={`fixed top-4 right-4 z-[9999] p-4 rounded-lg shadow-md text-white font-bold transition-all duration-300 flex items-center gap-2 animate-fadeIn ${
            toast.type === "success"
              ? "bg-teal bg-[#1abc9c] shadow-[#1abc9c]/20"
              : "bg-iconred bg-red-500 shadow-red-500/20"
          }`}
        >
          <Icon
            name={toast.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}
            className="text-[16px]"
          />
          <span>{toast.message}</span>
        </div>
      )}
    </>
  );
}
