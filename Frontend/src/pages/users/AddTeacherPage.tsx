import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { useLanguage } from "../../context/LanguageContext";
import { PageHeaderBar } from "../../components/common/PageHeaderBar";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { teacherApi } from "../../services/api/teacherApi";
import { Spinner } from "../../components/ui/Spinner";
import type { DocumentObject } from "../../types";

export const AddTeacherPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Form Fields State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [photo, setPhoto] = useState<string>("");
  const [photoPreview, setPhotoPreview] = useState<string>("");

  const [infiniteDocuments, setInfiniteDocuments] = useState<DocumentObject[]>([{ name: "", file: "" }]);
  const [infinitePreviews, setInfinitePreviews] = useState<string[]>([""]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (isEditMode && id) {
      const fetchTeacher = async () => {
        try {
          const teacher = await teacherApi.getById(id);
          setName(teacher.name || "");
          setEmail(teacher.email || "");
          setDesignation(teacher.designation || "");

          if (teacher.photo) {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
            setPhotoPreview(teacher.photo.startsWith("/") ? `${backendUrl}${teacher.photo}` : teacher.photo);
          }
          if (teacher.infiniteDocuments) {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
            setInfiniteDocuments([...teacher.infiniteDocuments, { name: "", file: "" }]);
            setInfinitePreviews([...teacher.infiniteDocuments.map(doc => doc.file.startsWith("/") ? `${backendUrl}${doc.file}` : doc.file), ""]);
          }
        } catch (err: any) {
          showToast(err.message || "Failed to fetch teacher data", "error");
        } finally {
          setLoading(false);
        }
      };
      fetchTeacher();
    }
  }, [isEditMode, id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void, previewSetter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setter(base64String);
        previewSetter(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInfiniteFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const newDocs = [...infiniteDocuments];
        // Set file and default name if not already set
        newDocs[index] = {
          name: newDocs[index].name || file.name.split('.')[0],
          file: base64String
        };

        const newPreviews = [...infinitePreviews];
        newPreviews[index] = base64String;

        // Auto generate next field if this was the last one
        if (index === infiniteDocuments.length - 1) {
          newDocs.push({ name: "", file: "" });
          newPreviews.push("");
        }

        setInfiniteDocuments(newDocs);
        setInfinitePreviews(newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentNameChange = (index: number, newName: string) => {
    const newDocs = [...infiniteDocuments];
    newDocs[index].name = newName;
    setInfiniteDocuments(newDocs);
  };

  // const addDocField = () => {
  //   setInfiniteDocuments([...infiniteDocuments, { name: "", file: "" }]);
  //   setInfinitePreviews([...infinitePreviews, ""]);
  // };

  const removeDocField = (index: number) => {
    if (infiniteDocuments.length === 1) {
      // If it's the only field, just clear it
      const newDocs = [{ name: "", file: "" }];
      setInfiniteDocuments(newDocs);
      setInfinitePreviews([""]);
      return;
    }

    const newDocs = [...infiniteDocuments];
    newDocs.splice(index, 1);
    setInfiniteDocuments(newDocs);

    const newPreviews = [...infinitePreviews];
    newPreviews.splice(index, 1);
    setInfinitePreviews(newPreviews);
  };

  const validateForm = (): boolean => {
    const tempErrors: Record<string, string> = {};
    if (!name.trim()) tempErrors.name = t("Name is required");
    if (!email.trim()) {
        tempErrors.email = t("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        tempErrors.email = t("Invalid email format");
    }
    if (!designation.trim()) tempErrors.designation = t("Designation is required");

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast(t("Please fill all required fields correctly"), "error");
      return;
    }

    setSubmitting(true);
    try {
      const payload: any = {
        name,
        email,
        designation,
        infiniteDocuments: infiniteDocuments.filter(doc => doc.file !== ""),
      };
      if (photo) payload.photo = photo;

      if (isEditMode && id) {
        await teacherApi.update(id, payload);
        showToast(t("Teacher updated successfully!"), "success");
      } else {
        await teacherApi.create(payload);
        showToast(t("Teacher added successfully!"), "success");
      }
      setTimeout(() => navigate("/dashboard/teacher"), 1200);
    } catch (err: any) {
      showToast(err.message || "Failed to save teacher", "error");
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
      <div className="bg-white rounded-[4px] shadow-[0_1px_1px_rgba(0,0,0,.1)] border border-[#e7eaec] overflow-hidden">
        <PageHeaderBar
          titleKey={isEditMode ? "Edit Teacher" : "Add Teacher"}
          iconName="fa-user"
          breadcrumbLabel="Teacher"
        />

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Top Section: Photo and Basic Info */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              {/* Photo Area */}
              <div className="lg:col-span-1 border border-[#e7eaec] rounded-lg p-5 bg-[#fdfdfd] flex flex-col items-center">
                <h3 className="w-full text-teal font-bold text-[14px] uppercase tracking-wider mb-4 border-b border-[#e7eaec] pb-2 flex items-center gap-1.5">
                  <Icon name="fa-camera" /> {t("Photo")}
                </h3>
                <div className="relative group w-32 h-32 rounded-lg border-2 border-dashed border-[#dfe6e9] flex items-center justify-center overflow-hidden bg-white shadow-sm transition-all hover:border-teal">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Icon name="fa-user" className="w-10 h-10 text-gray-300" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <label className="cursor-pointer text-white text-[12px] font-bold bg-teal px-3 py-1.5 rounded-full shadow-lg hover:scale-105 transition-transform">
                      {t("Change")}
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setPhoto, setPhotoPreview)} className="hidden" />
                    </label>
                    {photoPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setPhoto("");
                          setPhotoPreview("");
                        }}
                        className="text-white text-[11px] font-bold bg-iconred/80 px-3 py-1 rounded-full shadow-lg hover:bg-iconred hover:scale-105 transition-all cursor-pointer border-0"
                      >
                        {t("Remove")}
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-[11px] text-muted text-center">{t("Upload JPEG, PNG or WebP")}</p>
              </div>

              {/* Basic Info */}
              <div className="lg:col-span-3 border border-[#e7eaec] rounded-lg p-5 bg-[#fdfdfd]">
                <h3 className="text-teal font-bold text-[14px] uppercase tracking-wider mb-4 border-b border-[#e7eaec] pb-2 flex items-center gap-1.5">
                  <Icon name="fa-info-circle" /> {t("Teacher Details")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <Input
                    label={t("Full Name")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={errors.name}
                    requiredField
                    placeholder="e.g. John Doe"
                  />
                  <Input
                    label={t("Gmail / Email Address")}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                    requiredField
                    placeholder="johndoe@gmail.com"
                  />
                  <Select
                    label={t("Designation / Role")}
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    error={errors.designation}
                    requiredField
                    options={[
                      { value: "", label: t("Select Designation") },
                      { value: "Principal", label: t("Principal") },
                      { value: "Vice Principal", label: t("Vice Principal") },
                      { value: "Senior Teacher", label: t("Senior Teacher") },
                      { value: "Primary Teacher", label: t("Primary Teacher") },
                      { value: "Secondary Teacher", label: t("Secondary Teacher") },
                      { value: "Subject Teacher", label: t("Subject Teacher") },
                      { value: "Assistant Teacher", label: t("Assistant Teacher") },
                      { value: "Physical Education Teacher", label: t("Physical Education Teacher") },
                      { value: "Music/Art Teacher", label: t("Music/Art Teacher") },
                      { value: "Librarian", label: t("Librarian") },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Infinite Documents */}
            <div className="border border-[#e7eaec] rounded-lg p-5 bg-[#fdfdfd]">
              <div className="flex justify-between items-center mb-4 border-b border-[#e7eaec] pb-2">
                <h3 className="text-teal font-bold text-[14px] uppercase tracking-wider flex items-center gap-1.5">
                  <Icon name="fa-files-o" /> {t("Documents & Certificates")}
                </h3>
                <span className="text-[11px] text-muted italic">({t("Auto-generates new field on upload")})</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {infiniteDocuments.map((doc, index) => (
                  <div key={index} className="group relative flex flex-col gap-3 p-3 border border-[#f0f0f0] rounded-lg bg-white hover:border-teal/30 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {infinitePreviews[index] ? (
                          infinitePreviews[index].includes("pdf") ? (
                            <Icon name="fa-file-pdf-o" className="text-iconred text-lg" />
                          ) : (
                            <img src={infinitePreviews[index]} alt="preview" className="w-full h-full object-cover" />
                          )
                        ) : (
                          <Icon name="fa-upload" className="text-gray-300 text-lg" />
                        )}
                      </div>

                      <div className="flex-grow min-w-0">
                        <label className="block text-[10px] font-bold text-muted uppercase mb-1">
                          {t("Upload File")}
                        </label>
                        <input
                          type="file"
                          onChange={(e) => handleInfiniteFileChange(e, index)}
                          className="text-[11px] w-full cursor-pointer file:hidden text-gray-500 italic"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-muted uppercase">
                        {t("Document Name")}
                      </label>
                      <input
                        type="text"
                        value={doc.name}
                        onChange={(e) => handleDocumentNameChange(index, e.target.value)}
                        placeholder={t("e.g. Appointment Letter")}
                        className="w-full px-2 py-1.5 text-[11px] border border-gray-200 rounded focus:outline-none focus:border-teal"
                      />
                    </div>

                    {(doc.file !== "" || infiniteDocuments.length > 1) && (
                      <button
                        type="button"
                        onClick={() => removeDocField(index)}
                        title={doc.file !== "" ? t("Clear/Remove") : t("Remove Field")}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-red-100 rounded-full text-iconred hover:bg-red-50 hover:scale-110 transition-all shadow-sm flex items-center justify-center cursor-pointer"
                      >
                        <Icon name="fa-times" className="text-[10px]" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Panel */}
            <div className="pt-4 border-t border-[#e7eaec] flex justify-end gap-3">
              <Button variant="secondary" onClick={() => navigate("/dashboard/teacher")} disabled={submitting}>
                {t("Cancel")}
              </Button>
              <Button type="submit" variant="success" isLoading={submitting} className="bg-[#1abc9c] hover:bg-[#16a085]">
                {isEditMode ? t("Update Teacher") : t("Add Teacher")}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {toast && (
        <div className={`fixed top-4 right-4 z-[9999] p-4 rounded-lg shadow-md text-white font-bold transition-all duration-300 flex items-center gap-2 animate-fadeIn ${
          toast.type === "success" ? "bg-[#1abc9c]" : "bg-red-500"
        }`}>
          <Icon name={toast.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"} />
          <span>{toast.message}</span>
        </div>
      )}
    </DashboardLayout>
  );
};
