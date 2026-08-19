import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, ErrorMessage as FormikErrorMessage } from "formik";
import * as Yup from "yup";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { useLanguage } from "../../context/LanguageContext";
import { PageHeaderBar } from "../../components/common/PageHeaderBar";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { Spinner } from "../../components/ui/Spinner";
import { dataService } from "../../services/dataService";
import type { ClassItem, SectionItem, SubjectItem, ExamItem } from "../../types";

export const AddExamSchedulePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditMode);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [initialValues, setInitialValues] = useState({
    examName: "",
    examId: "",
    className: "",
    classId: "",
    sectionName: "",
    sectionId: "",
    subjectName: "",
    subjectId: "",
    date: "",
    time: "09:00 AM - 12:00 PM",
    room: "",
  });

  const [examsList, setExamsList] = useState<ExamItem[]>([]);
  const [classesList, setClassesList] = useState<ClassItem[]>([]);
  const [sectionsList, setSectionsList] = useState<SectionItem[]>([]);
  const [subjectsList, setSubjectsList] = useState<SubjectItem[]>([]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const validationSchema = Yup.object({
    examName: Yup.string().required(t("Exam name selection is required")),
    className: Yup.string().required(t("Class selection is required")),
    sectionName: Yup.string().required(t("Section selection is required")),
    subjectName: Yup.string().required(t("Subject selection is required")),
    date: Yup.string().required(t("Date is required")),
    time: Yup.string().required(t("Time is required")),
    room: Yup.string().required(t("Room is required")),
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [exams, classes, sections, subjects] = await Promise.all([
          dataService.getExams(),
          dataService.getClasses(),
          dataService.getSections(),
          dataService.getSubjects(),
        ]);
        setExamsList(exams);
        setClassesList(classes);
        setSectionsList(sections);
        setSubjectsList(subjects);

        if (isEditMode && id) {
          const scheduleData = await dataService.getExamScheduleById(id);
          setInitialValues({
            examName: scheduleData.examName || "",
            examId: scheduleData.examId || "",
            className: scheduleData.className || "",
            classId: scheduleData.classId || "",
            sectionName: scheduleData.sectionName || "",
            sectionId: scheduleData.sectionId || "",
            subjectName: scheduleData.subjectName || "",
            subjectId: scheduleData.subjectId || "",
            date: scheduleData.date || "",
            time: scheduleData.time || "09:00 AM - 12:00 PM",
            room: scheduleData.room || "",
          });
        }
      } catch (err: any) {
        showToast(err.message || t("Failed to load schedule data"), "error");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [id, isEditMode, t]);

  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
    try {
      if (isEditMode && id) {
        await dataService.updateExamSchedule(id, values);
        showToast(t("Exam schedule updated successfully"), "success");
      } else {
        await dataService.addExamSchedule(values);
        showToast(t("Exam schedule added successfully"), "success");
      }

      setTimeout(() => {
        navigate("/dashboard/exam/schedule");
      }, 1000);
    } catch (err: any) {
      showToast(err.message || t("Failed to save exam schedule"), "error");
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
        titleKey={isEditMode ? "Edit Exam Schedule" : "Add Exam Schedule"}
        iconName="fa-calendar"
        breadcrumbLabel={isEditMode ? "Edit Exam Schedule" : "Add Exam Schedule"}
      />

      <div className="p-[20px] bg-bodyBg">
        <div className="bg-white rounded-[3px] border border-[#e1e1e1] shadow-sm max-w-4xl mx-auto overflow-hidden">
          <div className="bg-[#fcfcfc] border-b border-[#e1e1e1] px-6 py-4">
            <h2 className="text-[16px] font-semibold text-[#444] m-0">
              {isEditMode ? t("Edit Exam Schedule") : t("Add Exam Schedule")}
            </h2>
          </div>

          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values, setFieldValue, handleChange, handleBlur }) => {
              const filteredSections = values.className
                ? sectionsList.filter((s) => s.className.toLowerCase() === values.className.toLowerCase())
                : sectionsList;

              const filteredSubjects = values.className
                ? subjectsList.filter((sub) => sub.className.toLowerCase() === values.className.toLowerCase())
                : subjectsList;

              return (
                <Form className="p-6 space-y-6">
                  {/* Exam Name Selection */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                      {t("Exam Name")} <span className="text-red-500">*</span>
                    </label>
                    <div className="sm:w-3/4">
                      <Select
                        name="examName"
                        value={values.examName}
                        onChange={(e) => {
                          const selectedName = e.target.value;
                          setFieldValue("examName", selectedName);
                          const selectedExam = examsList.find((ex) => ex.name === selectedName);
                          setFieldValue("examId", selectedExam ? String(selectedExam.id) : "");
                        }}
                        onBlur={handleBlur}
                        className="w-full"
                      >
                        <option value="">{t("Select Exam")}</option>
                        {examsList.map((exItem) => (
                          <option key={exItem.id} value={exItem.name}>
                            {exItem.name}
                          </option>
                        ))}
                      </Select>
                      <FormikErrorMessage name="examName" component="p" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>

                  {/* Class Selection */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                      {t("Class")} <span className="text-red-500">*</span>
                    </label>
                    <div className="sm:w-3/4">
                      <Select
                        name="className"
                        value={values.className}
                        onChange={(e) => {
                          const selectedName = e.target.value;
                          setFieldValue("className", selectedName);
                          const selectedClass = classesList.find((c) => c.name === selectedName);
                          setFieldValue("classId", selectedClass ? String(selectedClass.id) : "");
                        }}
                        onBlur={handleBlur}
                        className="w-full"
                      >
                        <option value="">{t("Select Class")}</option>
                        {classesList.map((cItem) => (
                          <option key={cItem.id} value={cItem.name}>
                            {cItem.name}
                          </option>
                        ))}
                      </Select>
                      <FormikErrorMessage name="className" component="p" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>

                  {/* Section Selection */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                      {t("Section")} <span className="text-red-500">*</span>
                    </label>
                    <div className="sm:w-3/4">
                      <Select
                        name="sectionName"
                        value={values.sectionName}
                        onChange={(e) => {
                          const selectedName = e.target.value;
                          setFieldValue("sectionName", selectedName);
                          const selectedSection = sectionsList.find((s) => s.name === selectedName);
                          setFieldValue("sectionId", selectedSection ? String(selectedSection.id) : "");
                        }}
                        onBlur={handleBlur}
                        className="w-full"
                      >
                        <option value="">{t("Select Section")}</option>
                        {filteredSections.map((sItem) => (
                          <option key={sItem.id} value={sItem.name}>
                            {sItem.name} ({sItem.category})
                          </option>
                        ))}
                      </Select>
                      <FormikErrorMessage name="sectionName" component="p" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>

                  {/* Subject Selection */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                      {t("Subject")} <span className="text-red-500">*</span>
                    </label>
                    <div className="sm:w-3/4">
                      <Select
                        name="subjectName"
                        value={values.subjectName}
                        onChange={(e) => {
                          const selectedName = e.target.value;
                          setFieldValue("subjectName", selectedName);
                          const selectedSubject = subjectsList.find((sub) => sub.name === selectedName);
                          setFieldValue("subjectId", selectedSubject ? String(selectedSubject.id) : "");
                        }}
                        onBlur={handleBlur}
                        className="w-full"
                      >
                        <option value="">{t("Select Subject")}</option>
                        {filteredSubjects.map((subItem) => (
                          <option key={subItem.id} value={subItem.name}>
                            {subItem.name} ({subItem.code})
                          </option>
                        ))}
                      </Select>
                      <FormikErrorMessage name="subjectName" component="p" className="text-red-500 text-xs mt-1" />
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
                        placeholder="e.g. 10 Jan 2025"
                        className="w-full"
                      />
                      <FormikErrorMessage name="date" component="p" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                      {t("Time")} <span className="text-red-500">*</span>
                    </label>
                    <div className="sm:w-3/4">
                      <Input
                        type="text"
                        name="time"
                        value={values.time}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g. 09:00 AM - 12:00 PM"
                        className="w-full"
                      />
                      <FormikErrorMessage name="time" component="p" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>

                  {/* Room */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                      {t("Room")} <span className="text-red-500">*</span>
                    </label>
                    <div className="sm:w-3/4">
                      <Input
                        type="text"
                        name="room"
                        value={values.room}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g. 101"
                        className="w-full"
                      />
                      <FormikErrorMessage name="room" component="p" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="pt-4 border-t border-[#eee] flex items-center justify-end gap-3">
                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <Spinner size="sm" />
                      ) : isEditMode ? (
                        t("Update Exam Schedule")
                      ) : (
                        t("Add Exam Schedule")
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => navigate("/dashboard/exam/schedule")}
                    >
                      {t("Cancel")}
                    </Button>
                  </div>
                </Form>
              );
            }}
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
