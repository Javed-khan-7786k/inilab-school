import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { useLanguage } from "../context/LanguageContext";
import { PageHeaderBar } from "../components/common/PageHeaderBar";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Button } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { dataService } from "../services/dataService";
import { studentApi } from "../services/api/studentApi";
import { Spinner } from "../components/ui/Spinner";
import type { Enquiry, DocumentObject } from "../types";
import type { Student } from "../types";

export const EnquiryFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Admin flows: reuse this same form for Student add/edit instead of the plain Enquiry form
  const cameFromAdminStudent = searchParams.get("from") === "admin-student";
  const isEditingStudentRecord = isEditMode && searchParams.get("editType") === "student";
  const isAdminStudentContext = cameFromAdminStudent || isEditingStudentRecord;

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Form Fields State
  const [studentName, setStudentName] = useState("");
  const [applyingClass, setApplyingClass] = useState("");
  const [roll, setRoll] = useState(""); // Only used in Admin Student context
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Male");

  const [fatherName, setFatherName] = useState("");
  const [fatherOccupation, setFatherOccupation] = useState("");
  const [fatherContact, setFatherContact] = useState("");
  const [fatherEmail, setFatherEmail] = useState("");
  const [fatherAadhaar, setFatherAadhaar] = useState("");

  const [motherName, setMotherName] = useState("");
  const [motherOccupation, setMotherOccupation] = useState("");
  const [motherContact, setMotherContact] = useState("");
  const [motherEmail, setMotherEmail] = useState("");
  const [motherAadhaar, setMotherAadhaar] = useState("");

  const [address, setAddress] = useState("");
  const [state, setState] = useState("Delhi");
  const [district, setDistrict] = useState("");
  const [pinCode, setPinCode] = useState("");

  const [childAadhaar, setChildAadhaar] = useState("");
  const [aparId, setAparId] = useState("");
  const [penNumber, setPenNumber] = useState("");

  const [previousSchool, setPreviousSchool] = useState("");
  const [previousSchoolAddress, setPreviousSchoolAddress] = useState("");
  const [previousSchoolId, setPreviousSchoolId] = useState("");
  const [lastClassAttended, setLastClassAttended] = useState("");

  const [status, setStatus] = useState<Enquiry["status"]>("New");
  const [photo, setPhoto] = useState<string>("");
  const [photoPreview, setPhotoPreview] = useState<string>("");

  const [documents, setDocuments] = useState<DocumentObject[]>([{ name: "", file: "" }]);
  const [documentPreviews, setDocumentPreviews] = useState<string[]>([""]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [originalData, setOriginalData] = useState<Enquiry | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch existing record in edit mode — either an Enquiry, or (Admin flow) a Student
  useEffect(() => {
    if (isEditMode && id) {
      const fetchData = async () => {
        try {
          if (isEditingStudentRecord) {
            const student: any = await studentApi.getById(id);
            setStudentName(student.name || "");
            setApplyingClass(student.className || "");
            setRoll(student.roll || "");
            setDob(student.dob || "");
            setGender(student.gender || "Male");
            setFatherName(student.fatherName || "");
            setFatherOccupation(student.fatherOccupation || "");
            setFatherContact(student.fatherContact || "");
            setFatherEmail(student.fatherEmail || student.email || "");
            setFatherAadhaar(student.fatherAadhaar || "");
            setMotherName(student.motherName || "");
            setMotherOccupation(student.motherOccupation || "");
            setMotherContact(student.motherContact || "");
            setMotherEmail(student.motherEmail || "");
            setMotherAadhaar(student.motherAadhaar || "");
            setAddress(student.address || "");
            setState(student.state || "Delhi");
            setDistrict(student.district || "");
            setPinCode(student.pinCode || "");
            setChildAadhaar(student.childAadhaar || "");
            setAparId(student.aparId || "");
            setPenNumber(student.penNumber || "");
            setPreviousSchool(student.previousSchool || "");
            setPreviousSchoolAddress(student.previousSchoolAddress || "");
            setPreviousSchoolId(student.previousSchoolId || "");
            setLastClassAttended(student.lastClassAttended || "");
            if (student.photo) {
              const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
              const fullPhotoUrl = student.photo.startsWith("/")
                ? `${backendUrl}${student.photo}`
                : student.photo;
              setPhotoPreview(fullPhotoUrl);
            }
            if (student.documents && student.documents.length > 0) {
              const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
              setDocuments([...student.documents, { name: "", file: "" }]);
              setDocumentPreviews([...student.documents.map((doc: DocumentObject) => doc.file.startsWith("/") ? `${backendUrl}${doc.file}` : doc.file), ""]);
            } else {
              setDocuments([{ name: "", file: "" }]);
              setDocumentPreviews([""]);
            }
          } else {
            const data = await dataService.getEnquiryById(id);
            setOriginalData(data);
            populateFields(data);
            if (data.documents && data.documents.length > 0) {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
            setDocuments([...data.documents, { name: "", file: "" }]);
            setDocumentPreviews([...data.documents.map((doc: DocumentObject) => doc.file.startsWith("/") ? `${backendUrl}${doc.file}` : doc.file), ""]);
          } else {
            setDocuments([{ name: "", file: "" }]);
            setDocumentPreviews([""]);
          }
          }
        } catch (err: any) {
          showToast(err.message || "Failed to fetch data", "error");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isEditMode, id, isEditingStudentRecord]);

  const populateFields = (data: Enquiry) => {
    setStudentName(data.studentName);
    setApplyingClass(data.applyingClass);
    setDob(data.dob);
    setGender(data.gender);
    setFatherName(data.fatherName);
    setFatherOccupation(data.fatherOccupation);
    setFatherContact(data.fatherContact);
    setFatherEmail(data.fatherEmail);
    setFatherAadhaar(data.fatherAadhaar || "");
    setMotherName(data.motherName);
    setMotherOccupation(data.motherOccupation);
    setMotherContact(data.motherContact);
    setMotherEmail(data.motherEmail);
    setMotherAadhaar(data.motherAadhaar || "");
    setAddress(data.address);
    setState(data.state);
    setDistrict(data.district);
    setPinCode(data.pinCode);
    setChildAadhaar(data.childAadhaar || "");
    setAparId(data.aparId || "");
    setPenNumber(data.penNumber || "");
    setPreviousSchool(data.previousSchool || "");
    setPreviousSchoolAddress(data.previousSchoolAddress || "");
    setPreviousSchoolId(data.previousSchoolId || "");
    setLastClassAttended(data.lastClassAttended || "");
    setStatus(data.status);

    if (data.photo) {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const fullPhotoUrl = data.photo.startsWith("/")
        ? `${backendUrl}${data.photo}`
        : data.photo;
      setPhotoPreview(fullPhotoUrl);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert(t("Please upload an image file."));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPhoto(base64String);
        setPhotoPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    if (isEditMode && originalData) {
      populateFields(originalData);
      setErrors({});
      showToast(t("Form reset to original values"), "success");
    } else {
      setStudentName("");
      setApplyingClass("Class 1");
      setRoll("");
      setDob("");
      setGender("Male");
      setFatherName("");
      setFatherOccupation("");
      setFatherContact("");
      setFatherEmail("");
      setFatherAadhaar("");
      setMotherName("");
      setMotherOccupation("");
      setMotherContact("");
      setMotherEmail("");
      setMotherAadhaar("");
      setAddress("");
      setState("Delhi");
      setDistrict("");
      setPinCode("");
      setChildAadhaar("");
      setAparId("");
      setPenNumber("");
      setPreviousSchool("");
      setPreviousSchoolAddress("");
      setPreviousSchoolId("");
      setLastClassAttended("");
      setStatus("New");
      setPhoto("");
      setPhotoPreview("");
      setDocuments([{ name: "", file: "" }]);
      setDocumentPreviews([""]);
      setErrors({});
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const newDocs = [...documents];
        newDocs[index] = {
          name: newDocs[index].name || file.name.split('.')[0],
          file: base64String
        };

        const newPreviews = [...documentPreviews];
        newPreviews[index] = base64String;

        // Auto generate next field
        if (index === documents.length - 1) {
          newDocs.push({ name: "", file: "" });
          newPreviews.push("");
        }

        setDocuments(newDocs);
        setDocumentPreviews(newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentNameChange = (index: number, newName: string) => {
    const newDocs = [...documents];
    newDocs[index].name = newName;
    setDocuments(newDocs);
  };

  const removeDocumentField = (index: number) => {
    if (documents.length === 1) {
      // If it's the only field, just clear it
      const newDocs = [{ name: "", file: "" }];
      setDocuments(newDocs);
      setDocumentPreviews([""]);
      return;
    }

    const newDocs = [...documents];
    newDocs.splice(index, 1);
    setDocuments(newDocs);

    const newPreviews = [...documentPreviews];
    newPreviews.splice(index, 1);
    setDocumentPreviews(newPreviews);
  };

  const validateForm = (): boolean => {
    const tempErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const pinRegex = /^[0-9]{6}$/;
    const aadhaarRegex = /^[0-9]{12}$/;

    if (!studentName.trim()) tempErrors.studentName = t("Student name is required");
    if (!applyingClass || applyingClass === "None") tempErrors.applyingClass = t("Applying class is required");
    if (isAdminStudentContext && !roll.trim()) tempErrors.roll = t("Roll number is required");
    if (!dob) tempErrors.dob = t("Date of birth is required");
    if (!gender) tempErrors.gender = t("Gender is required");

    if (!fatherName.trim()) tempErrors.fatherName = t("Father name is required");
    if (!fatherOccupation.trim()) tempErrors.fatherOccupation = t("Father occupation is required");
    if (!fatherContact.trim()) {
      tempErrors.fatherContact = t("Father contact number is required");
    } else if (!phoneRegex.test(fatherContact)) {
      tempErrors.fatherContact = t("Contact number must be exactly 10 digits");
    }
    if (!fatherEmail.trim()) {
      tempErrors.fatherEmail = t("Father email ID is required");
    } else if (!emailRegex.test(fatherEmail)) {
      tempErrors.fatherEmail = t("Please enter a valid email ID");
    }

    if (!motherName.trim()) tempErrors.motherName = t("Mother name is required");
    if (!motherOccupation.trim()) tempErrors.motherOccupation = t("Mother occupation is required");
    if (!motherContact.trim()) {
      tempErrors.motherContact = t("Mother contact number is required");
    } else if (!phoneRegex.test(motherContact)) {
      tempErrors.motherContact = t("Contact number must be exactly 10 digits");
    }
    if (!motherEmail.trim()) {
      tempErrors.motherEmail = t("Mother email ID is required");
    } else if (!emailRegex.test(motherEmail)) {
      tempErrors.motherEmail = t("Please enter a valid email ID");
    }

    if (!address.trim()) tempErrors.address = t("Address is required");
    if (!state) tempErrors.state = t("State is required");
    if (!district.trim()) tempErrors.district = t("District is required");
    if (!pinCode.trim()) {
      tempErrors.pinCode = t("PIN Code is required");
    } else if (!pinRegex.test(pinCode)) {
      tempErrors.pinCode = t("PIN Code must be exactly 6 digits");
    }

    if (fatherAadhaar && !aadhaarRegex.test(fatherAadhaar)) {
      tempErrors.fatherAadhaar = t("Aadhaar number must be exactly 12 digits");
    }
    if (motherAadhaar && !aadhaarRegex.test(motherAadhaar)) {
      tempErrors.motherAadhaar = t("Aadhaar number must be exactly 12 digits");
    }
    if (childAadhaar && !aadhaarRegex.test(childAadhaar)) {
      tempErrors.childAadhaar = t("Aadhaar number must be exactly 12 digits");
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast(t("Please Enter valid Data!!.."), "error");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);

    try {
      // --- Admin Student context: create/update a real Student record, full profile ---
      if (isAdminStudentContext) {
        const studentPayload: Omit<Student, "id"> = {
          photo: photo || "",
          name: studentName,
          roll,
          className: applyingClass,
          email: fatherEmail ?? "",
          dob,
          gender,
          fatherName,
          fatherOccupation,
          fatherContact,
          fatherEmail,
          fatherAadhaar: fatherAadhaar || undefined,
          motherName,
          motherOccupation,
          motherContact,
          motherEmail,
          motherAadhaar: motherAadhaar || undefined,
          address,
          state,
          district,
          pinCode,
          childAadhaar: childAadhaar || undefined,
          aparId: aparId || undefined,
          penNumber: penNumber || undefined,
          previousSchool: previousSchool || undefined,
          previousSchoolAddress: previousSchoolAddress || undefined,
          previousSchoolId: previousSchoolId || undefined,
          lastClassAttended: lastClassAttended || undefined,
          documents: documents.filter(doc => doc.file !== ""),
        };
        // if (photo) studentPayload.photo = photo;

        if (isEditingStudentRecord && id) {
          await studentApi.update(id, studentPayload);
          showToast(t("Student updated successfully!"), "success");
        } else {
          await studentApi.create(studentPayload);
          showToast(t("Student added successfully!"), "success");
        }
        setTimeout(() => navigate("/dashboard/student"), 1200);
        return;
      }

      // --- Normal Enquiry flow (unchanged) ---
      const payload: Omit<Enquiry, "id"> = {
        studentName,
        applyingClass,
        dob,
        gender,
        fatherName,
        fatherOccupation,
        fatherContact,
        fatherEmail,
        fatherAadhaar: fatherAadhaar || undefined,
        motherName,
        motherOccupation,
        motherContact,
        motherEmail,
        motherAadhaar: motherAadhaar || undefined,
        address,
        state,
        district,
        pinCode,
        childAadhaar: childAadhaar || undefined,
        aparId: aparId || undefined,
        penNumber: penNumber || undefined,
        previousSchool: previousSchool || undefined,
        previousSchoolAddress: previousSchoolAddress || undefined,
        previousSchoolId: previousSchoolId || undefined,
        lastClassAttended: lastClassAttended || undefined,
        status,
      };
      if (photo) payload.photo = photo;
      payload.documents = documents.filter(doc => doc.file !== "");

      if (isEditMode && id) {
        await dataService.updateEnquiry(id, payload);
        showToast(t("Enquiry updated successfully!"), "success");
        setTimeout(() => navigate("/dashboard/enquiry/current"), 1200);
      } else {
        await dataService.addEnquiry(payload);
        showToast(t("Enquiry submitted successfully!"), "success");
        handleReset();
      }
    } catch (err: any) {
      showToast(err.message || "Failed to submit. Please try again.", "error");
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

  const pageTitle = isEditingStudentRecord
    ? "Edit Student"
    : cameFromAdminStudent
      ? "Add Student"
      : isEditMode
        ? "Edit Student Enquiry"
        : "New Student Enquiry";

  return (
    <DashboardLayout>
      <div className="bg-white rounded-[4px] shadow-[0_1px_1px_rgba(0,0,0,.1)] border border-[#e7eaec] overflow-hidden select-none">
        <PageHeaderBar
          titleKey={pageTitle}
          iconName={isAdminStudentContext ? "fa-user" : "fa-question-circle"}
          breadcrumbLabel={isAdminStudentContext ? "Student" : "Enquiry Form"}
        />

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Section 1: Personal Information */}
            <div className="border border-[#e7eaec] rounded-lg p-5 bg-[#fdfdfd]">
              <h3 className="text-teal font-bold text-[14px] uppercase tracking-wider mb-4 border-b border-[#e7eaec] pb-2 flex items-center gap-1.5">
                <Icon name="fa-user" /> {t("Personal Information")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label={t("Student Name")}
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  error={errors.studentName}
                  requiredField
                  placeholder="Enter student name"
                />

                <Select
                  label={t("Applying For Class")}
                  value={applyingClass}
                  onChange={(e) => setApplyingClass(e.target.value)}
                  error={errors.applyingClass}
                  requiredField
                  options={[
                    { value: "None", label: "Select Class" },
                    { value: "Class 1", label: "Class 1" },
                    { value: "Class 2", label: "Class 2" },
                    { value: "Class 3", label: "Class 3" },
                    { value: "Class 4", label: "Class 4" },
                    { value: "Class 5", label: "Class 5" },
                    { value: "Class 6", label: "Class 6" },
                    { value: "Class 7", label: "Class 7" },
                    { value: "Class 8", label: "Class 8" },
                    { value: "Class 9", label: "Class 9" },
                    { value: "Class 10", label: "Class 10" },
                  ]}
                />

                {/* Roll — only relevant in Admin Student context */}
                {isAdminStudentContext && (
                  <Input
                    label={t("Roll")}
                    value={roll}
                    onChange={(e) => setRoll(e.target.value)}
                    error={errors.roll}
                    requiredField
                    placeholder="Roll number"
                  />
                )}

                <Input
                  label={t("Date of Birth")}
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  error={errors.dob}
                  requiredField
                />

                <Select
                  label={t("Gender")}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  error={errors.gender}
                  requiredField
                  options={[
                    { value: "Male", label: t("Male") },
                    { value: "Female", label: t("Female") },
                    { value: "Other", label: t("Other") },
                  ]}
                />

                <Input
                  label={t("Child Aadhaar Number")}
                  value={childAadhaar}
                  onChange={(e) => setChildAadhaar(e.target.value)}
                  error={errors.childAadhaar}
                  placeholder="12-digit Aadhaar Card Number"
                />

                <Input
                  label={t("APAR ID")}
                  value={aparId}
                  onChange={(e) => setAparId(e.target.value)}
                  placeholder="Enter APAR ID"
                />

                <Input
                  label={t("PEN Number")}
                  value={penNumber}
                  onChange={(e) => setPenNumber(e.target.value)}
                  placeholder="Permanent Education Number"
                />
              </div>
            </div>

            {/* Section 2: Parent Information */}
            <div className="border border-[#e7eaec] rounded-lg p-5 bg-[#fdfdfd]">
              <h3 className="text-teal font-bold text-[14px] uppercase tracking-wider mb-4 border-b border-[#e7eaec] pb-2 flex items-center gap-1.5">
                <Icon name="fa-users" /> {t("Parent Information")}
              </h3>

              <h4 className="text-dark font-semibold text-[13px] mb-3">{t("Father's Details")}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                <Input
                  label={t("Father Name")}
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  error={errors.fatherName}
                  requiredField
                  placeholder="Enter father's name"
                />

                <Input
                  label={t("Father Occupation")}
                  value={fatherOccupation}
                  onChange={(e) => setFatherOccupation(e.target.value)}
                  error={errors.fatherOccupation}
                  requiredField
                  placeholder="Occupation"
                />

                <Input
                  label={t("Father Contact Number")}
                  value={fatherContact}
                  onChange={(e) => setFatherContact(e.target.value)}
                  error={errors.fatherContact}
                  requiredField
                  placeholder="10-digit mobile number"
                />

                <Input
                  label={t("Father Email ID")}
                  type="email"
                  value={fatherEmail}
                  onChange={(e) => setFatherEmail(e.target.value)}
                  error={errors.fatherEmail}
                  requiredField
                  placeholder="Email address"
                />

                <Input
                  label={t("Father Aadhaar Number")}
                  value={fatherAadhaar}
                  onChange={(e) => setFatherAadhaar(e.target.value)}
                  error={errors.fatherAadhaar}
                  placeholder="12-digit Aadhaar Card Number"
                />
              </div>

              <h4 className="text-dark font-semibold text-[13px] mb-3">{t("Mother's Details")}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label={t("Mother Name")}
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  error={errors.motherName}
                  requiredField
                  placeholder="Enter mother's name"
                />

                <Input
                  label={t("Mother Occupation")}
                  value={motherOccupation}
                  onChange={(e) => setMotherOccupation(e.target.value)}
                  error={errors.motherOccupation}
                  requiredField
                  placeholder="Occupation"
                />

                <Input
                  label={t("Mother Contact Number")}
                  value={motherContact}
                  onChange={(e) => setMotherContact(e.target.value)}
                  error={errors.motherContact}
                  requiredField
                  placeholder="10-digit mobile number"
                />

                <Input
                  label={t("Mother Email ID")}
                  type="email"
                  value={motherEmail}
                  onChange={(e) => setMotherEmail(e.target.value)}
                  error={errors.motherEmail}
                  requiredField
                  placeholder="Email address"
                />

                <Input
                  label={t("Mother Aadhaar Number")}
                  value={motherAadhaar}
                  onChange={(e) => setMotherAadhaar(e.target.value)}
                  error={errors.motherAadhaar}
                  placeholder="12-digit Aadhaar Card Number"
                />
              </div>
            </div>

            {/* Section 3: Address Information */}
            <div className="border border-[#e7eaec] rounded-lg p-5 bg-[#fdfdfd]">
              <h3 className="text-teal font-bold text-[14px] uppercase tracking-wider mb-4 border-b border-[#e7eaec] pb-2 flex items-center gap-1.5">
                <Icon name="fa-map-marker" /> {t("Address Information")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label={t("Address")}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    error={errors.address}
                    requiredField
                    placeholder="Enter complete address"
                  />
                </div>

                <Select
                  label={t("State")}
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  error={errors.state}
                  requiredField
                  options={[
                    { value: "Delhi", label: "Delhi" },
                    { value: "Maharashtra", label: "Maharashtra" },
                    { value: "Karnataka", label: "Karnataka" },
                    { value: "Tamil Nadu", label: "Tamil Nadu" },
                    { value: "Uttar Pradesh", label: "Uttar Pradesh" },
                    { value: "West Bengal", label: "West Bengal" },
                    { value: "Gujarat", label: "Gujarat" },
                    { value: "Haryana", label: "Haryana" },
                    { value: "Punjab", label: "Punjab" },
                    { value: "Rajasthan", label: "Rajasthan" },
                  ]}
                />

                <Input
                  label={t("District")}
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  error={errors.district}
                  requiredField
                  placeholder="District"
                />

                <Input
                  label={t("PIN Code")}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  error={errors.pinCode}
                  requiredField
                  placeholder="6-digit ZIP / PIN"
                />
              </div>
            </div>

            {/* Section 4: School Information (Hidden for Class 1) */}
            {applyingClass !== "Class 1" && applyingClass !== "1" && (
              <div className="border border-[#e7eaec] rounded-lg p-5 bg-[#fdfdfd]">
                <h3 className="text-teal font-bold text-[14px] uppercase tracking-wider mb-4 border-b border-[#e7eaec] pb-2 flex items-center gap-1.5">
                  <Icon name="fa-university" /> {t("School Information")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    label={t("Previous School")}
                    value={previousSchool}
                    onChange={(e) => setPreviousSchool(e.target.value)}
                    placeholder="Previous school name"
                  />

                  <div className="md:col-span-2">
                    <Input
                      label={t("Previous School Address")}
                      value={previousSchoolAddress}
                      onChange={(e) => setPreviousSchoolAddress(e.target.value)}
                      placeholder="Previous school complete address"
                    />
                  </div>

                  <Input
                    label={t("Previous School ID")}
                    value={previousSchoolId}
                    onChange={(e) => setPreviousSchoolId(e.target.value)}
                    placeholder="School registration ID"
                  />

                  <Select
                    label={t("Last Class Attended")}
                    value={lastClassAttended}
                    onChange={(e) => setLastClassAttended(e.target.value)}
                    options={[
                      { value: "", label: t("None") },
                      { value: "Nursery / KG", label: "Nursery / KG" },
                      { value: "Class 1", label: "Class 1" },
                      { value: "Class 2", label: "Class 2" },
                      { value: "Class 3", label: "Class 3" },
                      { value: "Class 4", label: "Class 4" },
                      { value: "Class 5", label: "Class 5" },
                      { value: "Class 6", label: "Class 6" },
                      { value: "Class 7", label: "Class 7" },
                      { value: "Class 8", label: "Class 8" },
                      { value: "Class 9", label: "Class 9" },
                    ]}
                  />
                </div>
              </div>
            )}

            {/* Section 5: Student Photo & Status */}
            <div className={`border border-[#e7eaec] rounded-lg p-5 bg-[#fdfdfd] grid grid-cols-1 gap-6 ${
              isAdminStudentContext ? "" : "md:grid-cols-2"
            }`}>

              {/* Photo Area */}
              <div>
                <h3 className="text-teal font-bold text-[14px] uppercase tracking-wider mb-4 border-b border-[#e7eaec] pb-2 flex items-center gap-1.5">
                  <Icon name="fa-camera" /> {t("Student Photo")}
                </h3>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-[100px] h-[100px] rounded-lg border-2 border-dashed border-[#dfe6e9] flex items-center justify-center overflow-hidden bg-white shadow-sm flex-shrink-0 select-none">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Icon name="fa-user" className="w-8 h-8 text-gray-300" />
                    )}
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <label className="text-[13px] text-muted font-medium">{t("Upload Student Photo")}</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="text-[12px] text-muted file:mr-4 file:py-1.5 file:px-3 file:rounded file:border file:border-[#dfe6e9] file:text-[12px] file:font-semibold file:bg-[#f8f9fa] file:text-dark hover:file:bg-gray-100 file:cursor-pointer"
                    />
                    <span className="text-[11px] text-muted">{t("Supports JPEG, PNG or WebP files")}</span>
                    {photoPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setPhoto("");
                          setPhotoPreview("");
                        }}
                        className="text-left text-iconred hover:underline text-[12px] bg-transparent border-0 cursor-pointer w-fit"
                      >
                        {t("Remove Photo")}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Area — hidden for Admin's Add/Edit Student flow (Student has no status) */}
              {!isAdminStudentContext && (
                <div>
                  <h3 className="text-teal font-bold text-[14px] uppercase tracking-wider mb-4 border-b border-[#e7eaec] pb-2 flex items-center gap-1.5">
                    <Icon name="fa-tasks" /> {t("Status Details")}
                  </h3>
                  <div className="space-y-4">
                    <Select
                      label={t("Enquiry Status")}
                      value={status}
                      onChange={(e) => setStatus(e.target.value as Enquiry["status"])}
                      options={[
                        { value: "New", label: t("New") },
                        { value: "Contacted", label: t("Contacted") },
                        { value: "Follow-up", label: t("Follow-up") },
                        { value: "Admission Confirmed", label: t("Admission Confirmed") },
                        { value: "Rejected", label: t("Rejected") },
                        { value: "Closed", label: t("Closed") },
                      ]}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section 6: Documents */}
            <div className="border border-[#e7eaec] rounded-lg p-5 bg-[#fdfdfd]">
              <h3 className="text-teal font-bold text-[14px] uppercase tracking-wider mb-4 border-b border-[#e7eaec] pb-2 flex items-center gap-1.5">
                <Icon name="fa-files-o" /> {t("Documents & Certificates")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc, index) => (
                  <div key={index} className="relative flex flex-col gap-3 p-3 border border-[#f0f0f0] rounded-lg bg-white shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 border rounded flex-shrink-0 flex items-center justify-center overflow-hidden bg-gray-50">
                        {documentPreviews[index] ? (
                          documentPreviews[index].includes("pdf") ? (
                            <Icon name="fa-file-pdf-o" className="text-iconred" />
                          ) : (
                            <img src={documentPreviews[index]} alt="preview" className="w-full h-full object-cover" />
                          )
                        ) : (
                          <Icon name="fa-upload" className="text-gray-300" />
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <label className="block text-[10px] font-bold text-muted uppercase mb-1">
                          {t("Upload File")}
                        </label>
                        <input
                          type="file"
                          onChange={(e) => handleDocumentChange(e, index)}
                          className="text-[11px] w-full"
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
                        placeholder={t("e.g. Birth Certificate")}
                        className="w-full px-2 py-1.5 text-[11px] border border-gray-200 rounded focus:outline-none focus:border-teal"
                      />
                    </div>

                    {(doc.file !== "" || documents.length > 1) && (
                      <button
                        type="button"
                        onClick={() => removeDocumentField(index)}
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
            <div className="pt-4 border-t border-[#e7eaec] flex justify-end gap-3 select-none">
              <Button
                variant="secondary"
                onClick={() => navigate(isAdminStudentContext ? "/dashboard/student" : "/dashboard/enquiry/current")}
                disabled={submitting}
                className="px-6 uppercase tracking-wider text-[12px]"
              >
                {t("Cancel")}
              </Button>

              <Button
                variant="warning"
                onClick={handleReset}
                disabled={submitting}
                className="px-6 uppercase tracking-wider text-[12px]"
              >
                {t("Reset")}
              </Button>

              <Button
                type="submit"
                variant="success"
                isLoading={submitting}
                className="px-8 uppercase tracking-wider text-[12px] bg-[#1abc9c] hover:bg-[#16a085]"
              >
                {isEditingStudentRecord
                  ? t("Update Student")
                  : cameFromAdminStudent
                    ? t("Add Student")
                    : isEditMode
                      ? t("Update")
                      : t("Submit")}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {toast && (
        <div className={`fixed top-4 right-4 z-[9999] p-4 rounded-lg shadow-md text-white font-bold transition-all duration-300 flex items-center gap-2 animate-fadeIn ${
          toast.type === "success" ? "bg-teal bg-[#1abc9c] shadow-[#1abc9c]/20" : "bg-iconred bg-red-500 shadow-red-500/20"
        }`}>
          <Icon name={toast.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"} className="text-[16px]" />
          <span>{toast.message}</span>
        </div>
      )}
    </DashboardLayout>
  );
};