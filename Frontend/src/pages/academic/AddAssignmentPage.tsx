import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { useLanguage } from "../../context/LanguageContext";
import { PageHeaderBar } from "../../components/common/PageHeaderBar";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { Spinner } from "../../components/ui/Spinner";
import { dataService } from "../../services/dataService";
import type { ClassItem, SectionItem, SubjectItem } from "../../types";

export const AddAssignmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Form Fields State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [className, setClassName] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");

  const [classesList, setClassesList] = useState<ClassItem[]>([]);
  const [sectionsList, setSectionsList] = useState<SectionItem[]>([]);
  const [subjectsList, setSubjectsList] = useState<SubjectItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [classes, sections, subjects] = await Promise.all([
          dataService.getClasses(),
          dataService.getSections(),
          dataService.getSubjects(),
        ]);
        setClassesList(classes);
        setSectionsList(sections);
        setSubjectsList(subjects);

        if (isEditMode && id) {
          const assignmentData = await dataService.getAssignmentById(id);
          setTitle(assignmentData.title || "");
          setDescription(assignmentData.description || "");
          setDeadline(assignmentData.deadline || "");
          setClassName(assignmentData.className || "");
          setClassId(assignmentData.classId || "");
          setSectionName(assignmentData.sectionName || "");
          setSectionId(assignmentData.sectionId || "");
          setSubjectName(assignmentData.subjectName || "");
          setSubjectId(assignmentData.subjectId || "");
          setFile(assignmentData.file || "");
        }
      } catch (err: any) {
        showToast(err.message || t("Failed to load assignment data"), "error");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [id, isEditMode, t]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = t("Title is required");
    if (!description.trim()) errs.description = t("Description is required");
    if (!deadline.trim()) errs.deadline = t("Deadline is required");
    if (!className.trim()) errs.className = t("Class selection is required");
    if (!subjectName.trim()) errs.subjectName = t("Subject selection is required");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    setClassName(selectedName);
    const selectedClass = classesList.find((c) => c.name === selectedName);
    if (selectedClass) {
      setClassId(String(selectedClass.id));
    } else {
      setClassId("");
    }
  };

  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    setSectionName(selectedName);
    const selectedSection = sectionsList.find((s) => s.name === selectedName);
    if (selectedSection) {
      setSectionId(String(selectedSection.id));
    } else {
      setSectionId("");
    }
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    setSubjectName(selectedName);
    const selectedSubject = subjectsList.find((sub) => sub.name === selectedName);
    if (selectedSubject) {
      setSubjectId(String(selectedSubject.id));
    } else {
      setSubjectId("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFileName(selectedFile.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        title,
        description,
        deadline,
        className,
        classId,
        sectionName,
        sectionId,
        subjectName,
        subjectId,
        uploader: "Admin",
        file: file || fileName || "assignment_doc.pdf",
      };

      if (isEditMode && id) {
        await dataService.updateAssignment(id, payload);
        showToast(t("Assignment updated successfully"), "success");
      } else {
        await dataService.addAssignment(payload);
        showToast(t("Assignment added successfully"), "success");
      }

      setTimeout(() => {
        navigate("/dashboard/academic/assignments");
      }, 1000);
    } catch (err: any) {
      showToast(err.message || t("Failed to save assignment"), "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter sections and subjects by selected class
  const filteredSections = className
    ? sectionsList.filter((s) => s.className.toLowerCase() === className.toLowerCase())
    : sectionsList;

  const filteredSubjects = className
    ? subjectsList.filter((sub) => sub.className.toLowerCase() === className.toLowerCase())
    : subjectsList;

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
        titleKey={isEditMode ? "Edit Assignment" : "Add Assignment"}
        iconName="fa-tasks"
        breadcrumbLabel={isEditMode ? "Edit Assignment" : "Add Assignment"}
      />

      <div className="p-[20px] bg-bodyBg">
        <div className="bg-white rounded-[3px] border border-[#e1e1e1] shadow-sm max-w-4xl mx-auto overflow-hidden">
          <div className="bg-[#fcfcfc] border-b border-[#e1e1e1] px-6 py-4">
            <h2 className="text-[16px] font-semibold text-[#444] m-0">
              {isEditMode ? t("Edit Assignment") : t("Add Assignment")}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t("Title")} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Algebra Worksheet #1"
                  className="w-full"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444] sm:pt-2">
                {t("Description")} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="e.g. Solve problems from chapter 3 exercises"
                  className="w-full rounded-[3px] border border-[#d2d6de] px-3 py-2 text-[13px] focus:border-primary focus:outline-none"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
              </div>
            </div>

            {/* Deadline */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t("Deadline")} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <Input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full"
                />
                {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>}
              </div>
            </div>

            {/* Class Selection */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t("Class")} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <Select
                  value={className}
                  onChange={handleClassChange}
                  className="w-full"
                >
                  <option value="">{t("Select Class")}</option>
                  {classesList.map((cItem) => (
                    <option key={cItem.id} value={cItem.name}>
                      {cItem.name}
                    </option>
                  ))}
                </Select>
                {errors.className && (
                  <p className="text-red-500 text-xs mt-1">{errors.className}</p>
                )}
              </div>
            </div>

            {/* Section Selection */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t("Section")}
              </label>
              <div className="sm:w-3/4">
                <Select
                  value={sectionName}
                  onChange={handleSectionChange}
                  className="w-full"
                >
                  <option value="">{t("Select Section")}</option>
                  {filteredSections.map((sItem) => (
                    <option key={sItem.id} value={sItem.name}>
                      {sItem.name} ({sItem.category})
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Subject Selection */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t("Subject")} <span className="text-red-500">*</span>
              </label>
              <div className="sm:w-3/4">
                <Select
                  value={subjectName}
                  onChange={handleSubjectChange}
                  className="w-full"
                >
                  <option value="">{t("Select Subject")}</option>
                  {filteredSubjects.map((subItem) => (
                    <option key={subItem.id} value={subItem.name}>
                      {subItem.name} ({subItem.code})
                    </option>
                  ))}
                </Select>
                {errors.subjectName && (
                  <p className="text-red-500 text-xs mt-1">{errors.subjectName}</p>
                )}
              </div>
            </div>

            {/* File Upload */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="sm:w-1/4 text-[13px] font-semibold text-[#444]">
                {t("File")}
              </label>
              <div className="sm:w-3/4">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-teal/10 file:text-teal hover:file:bg-teal/20 cursor-pointer"
                />
                {fileName && (
                  <p className="text-xs text-teal font-semibold mt-1">
                    {t("Selected:")} {fileName}
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-4 border-t border-[#eee] flex items-center justify-end gap-3">
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? (
                  <Spinner size="sm" />
                ) : isEditMode ? (
                  t("Update Assignment")
                ) : (
                  t("Add Assignment")
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/dashboard/academic/assignments")}
              >
                {t("Cancel")}
              </Button>
            </div>
          </form>
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
