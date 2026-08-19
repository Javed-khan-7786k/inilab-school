import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, ErrorMessage as FormikErrorMessage } from "formik";
import * as Yup from "yup";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { useLanguage } from "../../context/LanguageContext";
import { PageHeaderBar } from "../../components/common/PageHeaderBar";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { Spinner } from "../../components/ui/Spinner";
import { dataService } from "../../services/dataService";

export const AddExamPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditMode);
  const [initialValues, setInitialValues] = useState({
    name: "",
    date: "",
    note: "",
  });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(t("Exam name is required")),
    date: Yup.string().required(t("Date is required")),
    note: Yup.string().optional(),
  });

  useEffect(() => {
    const loadInitialData = async () => {
      if (isEditMode && id) {
        try {
          const examData = await dataService.getExamById(id);
          setInitialValues({
            name: examData.name || "",
            date: examData.date || "",
            note: examData.note || "",
          });
        } catch (err: any) {
          showToast(err.message || t("Failed to load exam data"), "error");
        } finally {
          setLoading(false);
        }
      }
    };

    loadInitialData();
  }, [id, isEditMode, t]);

  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
    try {
      if (isEditMode && id) {
        await dataService.updateExam(id, values);
        showToast(t("Exam updated successfully"), "success");
      } else {
        await dataService.addExam(values);
        showToast(t("Exam added successfully"), "success");
      }

      setTimeout(() => {
        navigate("/dashboard/exam");
      }, 1000);
    } catch (err: any) {
      showToast(err.message || t("Failed to save exam"), "error");
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
        titleKey={isEditMode ? "Edit Exam" : "Add Exam"}
        iconName="fa-pencil"
        breadcrumbLabel={isEditMode ? "Edit Exam" : "Add Exam"}
      />

      <div className="p-[20px] bg-bodyBg">
        <div className="bg-white rounded-[3px] border border-[#e1e1e1] shadow-sm max-w-4xl mx-auto overflow-hidden">
          <div className="bg-[#fcfcfc] border-b border-[#e1e1e1] px-6 py-4">
            <h2 className="text-[16px] font-semibold text-[#444] m-0">
              {isEditMode ? t("Edit Exam") : t("Add Exam")}
            </h2>
          </div>

          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values, handleChange, handleBlur }) => (
              <Form className="p-6 space-y-6">
                {/* Exam Name */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                    {t("Exam Name")} <span className="text-red-500">*</span>
                  </label>
                  <div className="sm:w-3/4">
                    <Input
                      type="text"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. First Semester"
                      className="w-full"
                    />
                    <FormikErrorMessage name="name" component="p" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>

                {/* Date */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                    {t("Date")} <span className="text-red-500">*</span>
                  </label>
                  <div className="sm:w-3/4">
                    <Input
                      type="text"
                      name="date"
                      value={values.date}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. 01-01-2025"
                      className="w-full"
                    />
                    <FormikErrorMessage name="date" component="p" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>

                {/* Note */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                  <label className="sm:w-1/4 text-[13px] font-semibold text-[#444] sm:pt-2">
                    {t("Note")}
                  </label>
                  <div className="sm:w-3/4">
                    <textarea
                      name="note"
                      value={values.note}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={3}
                      placeholder="e.g. Don't delete it!"
                      className="w-full rounded-[3px] border border-[#d2d6de] px-3 py-2 text-[13px] focus:border-primary focus:outline-none"
                    />
                    <FormikErrorMessage name="note" component="p" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>

                {/* Buttons */}
                <div className="pt-4 border-t border-[#eee] flex items-center justify-end gap-3">
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Spinner size="sm" />
                    ) : isEditMode ? (
                      t("Update Exam")
                    ) : (
                      t("Add Exam")
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate("/dashboard/exam")}
                  >
                    {t("Cancel")}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

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
    </DashboardLayout>
  );
};
