import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, ErrorMessage as FormikErrorMessage } from "formik";
import * as Yup from "yup";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { useLanguage } from "../../context/LanguageContext";
import { PageHeaderBar } from "../../components/common/PageHeaderBar";
import { FormRow } from "../../components/common/FormRow";
import { Toast } from "../../components/ui/Toast";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import { dataService } from "../../services/dataService";

export const AddGradePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditMode);
  const [initialValues, setInitialValues] = useState({
    gradeName: "",
    gradePoint: "",
    markFrom: "",
    markUpto: "",
    note: "",
  });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const validationSchema = Yup.object({
    gradeName: Yup.string().required(t("Grade name is required")),
    gradePoint: Yup.string().required(t("Grade point is required")),
    markFrom: Yup.number().required(t("Mark from is required")).min(0, t("Must be at least 0")),
    markUpto: Yup.number().required(t("Mark upto is required")).min(0, t("Must be at least 0")),
    note: Yup.string().optional(),
  });

  useEffect(() => {
    const loadInitialData = async () => {
      if (isEditMode && id) {
        try {
          const gradeData = await dataService.getGradeById(id);
          setInitialValues({
            gradeName: gradeData.gradeName || "",
            gradePoint: gradeData.gradePoint || "",
            markFrom: gradeData.markFrom !== undefined ? String(gradeData.markFrom) : "",
            markUpto: gradeData.markUpto !== undefined ? String(gradeData.markUpto) : "",
            note: gradeData.note || "",
          });
        } catch (err: any) {
          showToast(err.message || t("Failed to load grade data"), "error");
        } finally {
          setLoading(false);
        }
      }
    };

    loadInitialData();
  }, [id, isEditMode, t]);

  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
    try {
      const payload = {
        gradeName: values.gradeName,
        gradePoint: values.gradePoint,
        markFrom: Number(values.markFrom),
        markUpto: Number(values.markUpto),
        note: values.note,
      };

      if (isEditMode && id) {
        await dataService.updateGrade(id, payload);
        showToast(t("Grade updated successfully"), "success");
      } else {
        await dataService.addGrade(payload);
        showToast(t("Grade added successfully"), "success");
      }

      setTimeout(() => {
        navigate("/dashboard/exam/grade");
      }, 1000);
    } catch (err: any) {
      showToast(err.message || t("Failed to save grade"), "error");
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
        titleKey={isEditMode ? "Edit Grade" : "Add Grade"}
        iconName="fa-graduation-cap"
        breadcrumbLabel={isEditMode ? "Edit Grade" : "Add Grade"}
      />

      <div className="p-[20px] bg-bodyBg">
        <div className="bg-white rounded-[3px] border border-[#e1e1e1] shadow-sm max-w-4xl mx-auto overflow-hidden">
          <div className="bg-[#fcfcfc] border-b border-[#e1e1e1] px-6 py-4">
            <h2 className="text-[16px] font-semibold text-[#444] m-0">
              {isEditMode ? t("Edit Grade") : t("Add Grade")}
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
                <FormRow label={t("Grade Name")} required>
                  <div>
                    <Input
                      type="text"
                      name="gradeName"
                      value={values.gradeName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. A+"
                      className="w-full"
                    />
                    <FormikErrorMessage name="gradeName" component="p" className="text-red-500 text-xs mt-1" />
                  </div>
                </FormRow>

                <FormRow label={t("Grade Point")} required>
                  <div>
                    <Input
                      type="text"
                      name="gradePoint"
                      value={values.gradePoint}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. 5.00"
                      className="w-full"
                    />
                    <FormikErrorMessage name="gradePoint" component="p" className="text-red-500 text-xs mt-1" />
                  </div>
                </FormRow>

                <FormRow label={t("Mark From")} required>
                  <div>
                    <Input
                      type="number"
                      name="markFrom"
                      value={values.markFrom}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. 80"
                      className="w-full"
                    />
                    <FormikErrorMessage name="markFrom" component="p" className="text-red-500 text-xs mt-1" />
                  </div>
                </FormRow>

                <FormRow label={t("Mark Upto")} required>
                  <div>
                    <Input
                      type="number"
                      name="markUpto"
                      value={values.markUpto}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. 100"
                      className="w-full"
                    />
                    <FormikErrorMessage name="markUpto" component="p" className="text-red-500 text-xs mt-1" />
                  </div>
                </FormRow>

                <FormRow label={t("Note")} alignTop>
                  <div>
                    <textarea
                      name="note"
                      value={values.note}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={3}
                      placeholder="e.g. Excellent"
                      className="w-full rounded-[3px] border border-[#d2d6de] px-3 py-2 text-[13px] focus:border-primary focus:outline-none"
                    />
                    <FormikErrorMessage name="note" component="p" className="text-red-500 text-xs mt-1" />
                  </div>
                </FormRow>

                {/* Buttons */}
                <div className="pt-4 border-t border-[#eee] flex items-center justify-end gap-3">
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Spinner size="sm" />
                    ) : isEditMode ? (
                      t("Update Grade")
                    ) : (
                      t("Add Grade")
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate("/dashboard/exam/grade")}
                  >
                    {t("Cancel")}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </DashboardLayout>
  );
};
