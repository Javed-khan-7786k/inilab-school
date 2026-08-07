import React, { useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { PageHeaderBar } from "../../components/common/PageHeaderBar";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Icon } from "../../components/ui/Icon";
import { useLanguage } from "../../context/LanguageContext";
import { authService } from "../../services/authService";
import { schoolSettingApi } from "../../services/api/schoolSettingApi";
import { subjectApi } from "../../services/api/subjectApi";
import {
  DEFAULT_SCHOOL_STREAMS,
  DEFAULT_CLASS_STREAMS,
  STREAM_STORAGE_KEY,
  CLASS_STREAM_STORAGE_KEY,
} from "../../Utils/streamService";

type SubTab = "profile" | "session" | "class-section" | "subject" | "stream";

interface SessionItem {
  id: string;
  year: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface SectionItem {
  id: string;
  name: string;
  capacity: number;
  teacher: string;
}

interface ClassItem {
  id: string;
  name: string;
  numericGrade: number;
  sections: SectionItem[];
}

interface SubjectItem {
  id: string;
  code: string;
  name: string;
  classId: string;
  type: "Theory" | "Practical" | "Both";
  fullMarks: number;
}

interface StreamOption {
  id: string;
  name: string;
  code: string;
  description: string;
}

export function SchoolSettingsPage({ initialTab = "profile" }: { initialTab?: SubTab }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<SubTab>(initialTab);

  // Admin Role Check — Restricted strictly to Administrator
  const userRole = (authService.getUserRole() || "admin").toLowerCase();
  const isAdmin = userRole === "admin" || userRole === "administrator" || userRole === "superadmin";

  // 1. School Profile State
  const [schoolProfile, setSchoolProfile] = useState({
    name: "Inilab International Academy",
    code: "SCH-2026-INILAB",
    registrationNo: "REG-998877-CBSE",
    affiliationBoard: "CBSE Board",
    establishmentYear: "2008",
    principalName: "Dr. Parvej Alam",
    address: "123 Knowledge Park, Education Hub, New Delhi",
    phone: "+91 98765 43210",
    email: "contact@inilabacademy.edu.in",
    currency: "INR (₹)",
  });

  // 2. New Session State
  const [sessions, setSessions] = useState<SessionItem[]>([
    { id: "1", year: "2024-2025", startDate: "2024-04-01", endDate: "2025-03-31", isActive: false },
    { id: "2", year: "2025-2026", startDate: "2025-04-01", endDate: "2026-03-31", isActive: true },
  ]);
  const [showAddSessionForm, setShowAddSessionForm] = useState(false);
  const [newSessionData, setNewSessionData] = useState({ year: "", startDate: "", endDate: "" });

  // 3. Class and Section State
  const [classList, setClassList] = useState<ClassItem[]>([
    {
      id: "c1",
      name: "Class 1",
      numericGrade: 1,
      sections: [
        { id: "s1", name: "Section A", capacity: 40, teacher: "Mr. Rajesh Kumar" },
        { id: "s2", name: "Section B", capacity: 35, teacher: "Ms. Sunita Sharma" },
      ],
    },
    {
      id: "c9",
      name: "Class 9",
      numericGrade: 9,
      sections: [
        { id: "s3", name: "Section A (PCM)", capacity: 45, teacher: "Dr. Amit Verma" },
        { id: "s4", name: "Section B (PCB)", capacity: 40, teacher: "Mrs. Kavita Roy" },
      ],
    },
    {
      id: "c10",
      name: "Class 10",
      numericGrade: 10,
      sections: [{ id: "s5", name: "Section A", capacity: 50, teacher: "Mr. Vikram Singh" }],
    },
    {
      id: "c11",
      name: "Class 11",
      numericGrade: 11,
      sections: [
        { id: "s6", name: "Science", capacity: 40, teacher: "Prof. S. K. Gupta" },
        { id: "s7", name: "Commerce", capacity: 45, teacher: "Mrs. Neha Mehta" },
      ],
    },
    {
      id: "c12",
      name: "Class 12",
      numericGrade: 12,
      sections: [
        { id: "s8", name: "Science PCM", capacity: 40, teacher: "Dr. R. C. Das" },
        { id: "s9", name: "Arts & Humanities", capacity: 35, teacher: "Ms. Pooja Sen" },
      ],
    },
  ]);
  const [selectedClassId, setSelectedClassId] = useState<string>("c9");
  const [showAddSectionForm, setShowAddSectionForm] = useState(false);
  const [newSectionData, setNewSectionData] = useState({ name: "", capacity: 40, teacher: "" });

  // 4. Subject State
  const [subjects, setSubjects] = useState<SubjectItem[]>([
    { id: "sub1", code: "MATH-101", name: "Mathematics", classId: "c9", type: "Both", fullMarks: 100 },
    { id: "sub2", code: "PHY-101", name: "Physics", classId: "c9", type: "Both", fullMarks: 100 },
    { id: "sub3", code: "ENG-101", name: "English Core", classId: "c9", type: "Theory", fullMarks: 100 },
    { id: "sub4", code: "BIO-201", name: "Biology", classId: "c11", type: "Both", fullMarks: 100 },
  ]);
  const [showAddSubjectForm, setShowAddSubjectForm] = useState(false);
  const [newSubjectData, setNewSubjectData] = useState({
    code: "",
    name: "",
    classId: "c9",
    type: "Theory" as "Theory" | "Practical" | "Both",
    fullMarks: 100,
  });

  // 5. Stream Management State (Multiple Streams per Senior Class)
  const [availableStreams, setAvailableStreams] = useState<StreamOption[]>(() => {
  try {
    const saved = localStorage.getItem(STREAM_STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_SCHOOL_STREAMS;
  } catch {
    return DEFAULT_SCHOOL_STREAMS;
  }
});

const [classMultiStreams, setClassMultiStreams] = useState<Record<number, string[]>>(() => {
  try {
    const saved = localStorage.getItem(CLASS_STREAM_STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_CLASS_STREAMS;
  } catch {
    return DEFAULT_CLASS_STREAMS;
  }
});

const [showAddStreamForm, setShowAddStreamForm] = useState(false);
const [newStreamInput, setNewStreamInput] = useState({ name: "", code: "", description: "" });
const [savingBackend, setSavingBackend] = useState(false);

// Fetch settings and subjects from MongoDB backend on mount
React.useEffect(() => {
  const loadBackendSettings = async () => {
    try {
      const data = await schoolSettingApi.getSettings();
      if (data) {
        if (data.schoolProfile) setSchoolProfile(data.schoolProfile);
        if (data.sessions && data.sessions.length > 0) setSessions(data.sessions);
        if (data.availableStreams && data.availableStreams.length > 0) {
          setAvailableStreams(data.availableStreams);
          localStorage.setItem(STREAM_STORAGE_KEY, JSON.stringify(data.availableStreams));
        }
        if (data.classMultiStreams) {
          const formattedMap: Record<number, string[]> = {};
          Object.keys(data.classMultiStreams).forEach((k) => {
            formattedMap[parseInt(k, 10)] = data.classMultiStreams[k];
          });
          setClassMultiStreams(formattedMap);
          localStorage.setItem(CLASS_STREAM_STORAGE_KEY, JSON.stringify(formattedMap));
        }
      }

      // Fetch subjects from database
      const backendSubjects = await subjectApi.getAll();
      if (backendSubjects && backendSubjects.length > 0) {
        const mappedSubjects: SubjectItem[] = backendSubjects.map((sub: any) => ({
          id: sub.id || sub._id,
          code: sub.code || "SUB-101",
          name: sub.name,
          classId: sub.classId || "c9",
          type: sub.type || "Theory",
          fullMarks: sub.finalMark || sub.fullMarks || 100,
        }));
        setSubjects(mappedSubjects);
      }
    } catch (err) {
      console.warn("Backend settings load warning, using active defaults:", err);
    }
  };
  loadBackendSettings();
}, []);

// Notification Toast
const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

const showToast = (message: string, type: "success" | "error" = "success") => {
  setToast({ message, type });
  setTimeout(() => setToast(null), 3000);
};

const handleSaveSettingsToBackend = async () => {
  setSavingBackend(true);
  try {
    const payload = {
      schoolProfile,
      sessions,
      availableStreams,
      classMultiStreams,
    };
    await schoolSettingApi.updateSettings(payload);
    localStorage.setItem(STREAM_STORAGE_KEY, JSON.stringify(availableStreams));
    localStorage.setItem(CLASS_STREAM_STORAGE_KEY, JSON.stringify(classMultiStreams));
    showToast("Settings saved & synchronized with MongoDB database successfully!");
  } catch (err: any) {
    showToast(err.message || "Failed to sync settings with database", "error");
  } finally {
    setSavingBackend(false);
  }
};

const handleToggleStreamForClass = (grade: number, streamId: string) => {
  setClassMultiStreams((prev) => {
    const currentList = prev[grade] || [];
    const updated = currentList.includes(streamId)
      ? currentList.filter((id) => id !== streamId)
      : [...currentList, streamId];
    localStorage.setItem(CLASS_STREAM_STORAGE_KEY, JSON.stringify({ ...prev, [grade]: updated }));
    return { ...prev, [grade]: updated };
  });
  showToast(`Updated streams for Class ${grade}!`);
};

const handleAddCustomStream = (e: React.FormEvent) => {
  e.preventDefault();
  if (!newStreamInput.name || !newStreamInput.code) return;
  const created: StreamOption = {
    id: `str-custom-${Date.now()}`,
    name: newStreamInput.name,
    code: newStreamInput.code,
    description: newStreamInput.description || "Custom stream option",
  };
  setAvailableStreams((prev) => {
    const updated = [...prev, created];
    localStorage.setItem(STREAM_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  });
  setNewStreamInput({ name: "", code: "", description: "" });
  setShowAddStreamForm(false);
  showToast(`Stream "${created.name}" created successfully!`);
};

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionData.year) return;
    const newSession: SessionItem = {
      id: Date.now().toString(),
      year: newSessionData.year,
      startDate: newSessionData.startDate || "2026-04-01",
      endDate: newSessionData.endDate || "2027-03-31",
      isActive: false,
    };
    setSessions((prev) => [newSession, ...prev]);
    setNewSessionData({ year: "", startDate: "", endDate: "" });
    setShowAddSessionForm(false);
    showToast(`New Session ${newSession.year} added!`);
  };

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionData.name) return;
    const createdSection: SectionItem = {
      id: Date.now().toString(),
      name: newSectionData.name,
      capacity: newSectionData.capacity,
      teacher: newSectionData.teacher || "Unassigned",
    };
    setClassList((prev) =>
      prev.map((cls) =>
        cls.id === selectedClassId
          ? { ...cls, sections: [...cls.sections, createdSection] }
          : cls
      )
    );
    setNewSectionData({ name: "", capacity: 40, teacher: "" });
    setShowAddSectionForm(false);
    showToast("Section added successfully!");
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectData.name || !newSubjectData.code) return;
    try {
      const payload = {
        name: newSubjectData.name,
        code: newSubjectData.code,
        className: "Class 9",
        teacherName: "Assigned Staff",
        passMark: 33,
        finalMark: newSubjectData.fullMarks || 100,
        type: newSubjectData.type,
      };
      const created = await subjectApi.create(payload as any);
      const newSubItem: SubjectItem = {
        id: String(created.id || Date.now()),
        code: created.code || newSubjectData.code,
        name: created.name,
        classId: newSubjectData.classId,
        type: newSubjectData.type,
        fullMarks: newSubjectData.fullMarks,
      };
      setSubjects((prev) => [newSubItem, ...prev]);
      setNewSubjectData({ code: "", name: "", classId: "c9", type: "Theory", fullMarks: 100 });
      setShowAddSubjectForm(false);
      showToast(`Subject "${created.name}" created & saved to database!`);
    } catch (err: any) {
      showToast(err.message || "Failed to create subject", "error");
    }
  };

  const selectedClass = classList.find((c) => c.id === selectedClassId) || classList[0];

  // Admin Access Restriction Guard
  if (!isAdmin) {
    return (
      <DashboardLayout>
        <PageHeaderBar
          titleKey="School Settings"
          iconName="fa-university"
          breadcrumbLabel="School Settings"
        />
        <div className="p-[20px] bg-bodyBg">
          <div className="bg-white rounded-[3px] border border-[#e1e1e1] shadow-sm max-w-4xl mx-auto overflow-hidden p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center border border-red-200">
              <Icon name="fa-shield" className="text-[28px]" />
            </div>
            <h2 className="text-lg font-bold text-[#333]">{t("Access Restricted — Admin Role Only")}</h2>
            <p className="text-sm text-[#666] max-w-md mx-auto">
              {t("School Settings (Profile, Session, Class & Section, Subject Directory, and Stream Management) are strictly restricted to Authorized School Administrators only.")}
            </p>
            <div className="pt-2">
              <span className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded">
                Current Role: {userRole.toUpperCase()} (Unauthorized)
              </span>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Native Dark Header Bar */}
      <PageHeaderBar
        titleKey="School Settings"
        iconName="fa-university"
        breadcrumbLabel="School Settings"
      />

      {/* Main Page Layout Wrapper matching AddClassPage & AcademicClassPage */}
      <div className="p-[20px] bg-bodyBg">
        <div className="bg-white rounded-[3px] border border-[#e1e1e1] shadow-sm max-w-6xl mx-auto overflow-hidden">
          
          {/* Card Header & Tabs */}
          <div className="bg-[#fcfcfc] border-b border-[#e1e1e1] px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-[16px] font-semibold text-[#444] m-0 flex items-center gap-2">
              <Icon name="fa-cog" className="text-teal text-[#1abc9c]" />
              <span>{t("School & Academic Configuration")}</span>
            </h2>

            <Button
              variant="primary"
              onClick={handleSaveSettingsToBackend}
              disabled={savingBackend}
              className="text-[13px] font-semibold"
            >
              <Icon name="fa-save" className="mr-1.5" />
              <span>{savingBackend ? t("Saving to DB...") : t("Save Changes")}</span>
            </Button>
          </div>

          {/* Sub Tab Navigation */}
          <div className="flex border-b border-[#e1e1e1] px-6 bg-[#fafafa] overflow-x-auto space-x-1">
            {[
              { id: "profile", label: "School Profile", icon: "fa-building" },
              { id: "session", label: "New Session", icon: "fa-calendar" },
              { id: "class-section", label: "Class & Section", icon: "fa-sitemap" },
              { id: "subject", label: "Subject Directory", icon: "fa-book" },
              { id: "stream", label: "Stream Management (Class 9-12)", icon: "fa-code-fork" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as SubTab)}
                className={`py-3 px-4 text-[13px] font-semibold border-b-2 transition-all border-0 bg-transparent cursor-pointer flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-[#1abc9c] text-[#1abc9c] font-bold bg-white"
                    : "border-transparent text-[#666] hover:text-[#333]"
                }`}
              >
                <Icon name={tab.icon} />
                <span>{t(tab.label)}</span>
              </button>
            ))}
          </div>

          {/* Content Body */}
          <div className="p-6">

            {/* TAB 1: SCHOOL PROFILE */}
            {activeTab === "profile" && (
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[13px] font-semibold text-[#444]">
                      {t("School Name")} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={schoolProfile.name}
                      onChange={(e) => setSchoolProfile({ ...schoolProfile, name: e.target.value })}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[13px] font-semibold text-[#444]">
                      {t("School Code")} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={schoolProfile.code}
                      onChange={(e) => setSchoolProfile({ ...schoolProfile, code: e.target.value })}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[13px] font-semibold text-[#444]">{t("Registration Number")}</label>
                    <Input
                      value={schoolProfile.registrationNo}
                      onChange={(e) => setSchoolProfile({ ...schoolProfile, registrationNo: e.target.value })}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[13px] font-semibold text-[#444]">{t("Affiliation Board")}</label>
                    <Input
                      value={schoolProfile.affiliationBoard}
                      onChange={(e) => setSchoolProfile({ ...schoolProfile, affiliationBoard: e.target.value })}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[13px] font-semibold text-[#444]">{t("Principal Name")}</label>
                    <Input
                      value={schoolProfile.principalName}
                      onChange={(e) => setSchoolProfile({ ...schoolProfile, principalName: e.target.value })}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[13px] font-semibold text-[#444]">{t("Establishment Year")}</label>
                    <Input
                      value={schoolProfile.establishmentYear}
                      onChange={(e) => setSchoolProfile({ ...schoolProfile, establishmentYear: e.target.value })}
                    />
                  </div>

                  <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-[13px] font-semibold text-[#444]">{t("Campus Address")}</label>
                    <Input
                      value={schoolProfile.address}
                      onChange={(e) => setSchoolProfile({ ...schoolProfile, address: e.target.value })}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[13px] font-semibold text-[#444]">{t("Phone")}</label>
                    <Input
                      value={schoolProfile.phone}
                      onChange={(e) => setSchoolProfile({ ...schoolProfile, phone: e.target.value })}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[13px] font-semibold text-[#444]">{t("Email")}</label>
                    <Input
                      type="email"
                      value={schoolProfile.email}
                      onChange={(e) => setSchoolProfile({ ...schoolProfile, email: e.target.value })}
                    />
                  </div>
                </div>
              </form>
            )}

            {/* TAB 2: NEW SESSION */}
            {activeTab === "session" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#eee]">
                  <h3 className="text-[14px] font-semibold text-[#444] m-0">{t("Academic Sessions")}</h3>
                  <Button
                    variant="primary"
                    onClick={() => setShowAddSessionForm(!showAddSessionForm)}
                    className="text-[12px]"
                  >
                    <Icon name="fa-plus" className="mr-1" />
                    {showAddSessionForm ? t("Cancel") : t("Add New Session")}
                  </Button>
                </div>

                {showAddSessionForm && (
                  <form onSubmit={handleAddSession} className="p-4 bg-[#fcfcfc] border border-[#e1e1e1] rounded space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input
                        label={t("Session Year")}
                        placeholder="e.g. 2026-2027"
                        value={newSessionData.year}
                        onChange={(e) => setNewSessionData({ ...newSessionData, year: e.target.value })}
                      />
                      <Input
                        label={t("Start Date")}
                        type="date"
                        value={newSessionData.startDate}
                        onChange={(e) => setNewSessionData({ ...newSessionData, startDate: e.target.value })}
                      />
                      <Input
                        label={t("End Date")}
                        type="date"
                        value={newSessionData.endDate}
                        onChange={(e) => setNewSessionData({ ...newSessionData, endDate: e.target.value })}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" variant="success" className="text-[12px]">
                        {t("Save Session")}
                      </Button>
                    </div>
                  </form>
                )}

                <div className="overflow-x-auto border border-[#e1e1e1] rounded">
                  <table className="w-full text-left text-[13px]">
                    <thead className="bg-[#f8f9fa] text-[#444] font-semibold border-b border-[#e1e1e1]">
                      <tr>
                        <th className="p-3">Session Year</th>
                        <th className="p-3">Start Date</th>
                        <th className="p-3">End Date</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eee]">
                      {sessions.map((sess) => (
                        <tr key={sess.id} className="hover:bg-gray-50">
                          <td className="p-3 font-semibold text-[#333]">{sess.year}</td>
                          <td className="p-3 text-[#666]">{sess.startDate}</td>
                          <td className="p-3 text-[#666]">{sess.endDate}</td>
                          <td className="p-3">
                            {sess.isActive ? (
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#1abc9c] text-white">
                                Active Session
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-[#666]">
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right space-x-2">
                            {!sess.isActive && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSessions((prev) => prev.map((s) => ({ ...s, isActive: s.id === sess.id })));
                                  showToast("Active session updated!");
                                }}
                                className="text-[12px] text-[#1abc9c] font-semibold hover:underline cursor-pointer border-0 bg-transparent"
                              >
                                Set Active
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: CLASS & SECTION */}
            {activeTab === "class-section" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#eee]">
                  <div className="flex items-center gap-3">
                    <label className="text-[13px] font-semibold text-[#444]">{t("Select Class:")}</label>
                    <Select
                      value={selectedClassId}
                      onChange={(e) => setSelectedClassId(e.target.value)}
                      className="text-[13px]"
                    >
                      {classList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <Button
                    variant="primary"
                    onClick={() => setShowAddSectionForm(!showAddSectionForm)}
                    className="text-[12px]"
                  >
                    <Icon name="fa-plus" className="mr-1" />
                    {showAddSectionForm ? t("Cancel") : t("Add Section")}
                  </Button>
                </div>

                {showAddSectionForm && (
                  <form onSubmit={handleAddSection} className="p-4 bg-[#fcfcfc] border border-[#e1e1e1] rounded space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input
                        label={t("Section Name")}
                        placeholder="e.g. Section C"
                        value={newSectionData.name}
                        onChange={(e) => setNewSectionData({ ...newSectionData, name: e.target.value })}
                      />
                      <Input
                        label={t("Capacity")}
                        type="number"
                        value={newSectionData.capacity}
                        onChange={(e) => setNewSectionData({ ...newSectionData, capacity: parseInt(e.target.value) || 40 })}
                      />
                      <Input
                        label={t("Teacher")}
                        placeholder="Teacher Name"
                        value={newSectionData.teacher}
                        onChange={(e) => setNewSectionData({ ...newSectionData, teacher: e.target.value })}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" variant="success" className="text-[12px]">
                        {t("Save Section")}
                      </Button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {selectedClass.sections.map((sec) => (
                    <div key={sec.id} className="p-3 bg-[#fcfcfc] border border-[#e1e1e1] rounded space-y-1">
                      <div className="font-bold text-[13px] text-[#1abc9c]">{sec.name}</div>
                      <div className="text-[12px] text-[#555]">Teacher: {sec.teacher}</div>
                      <div className="text-[12px] text-[#777]">Capacity: {sec.capacity} Students</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: SUBJECT DIRECTORY */}
            {activeTab === "subject" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#eee]">
                  <h3 className="text-[14px] font-semibold text-[#444] m-0">{t("Subjects List")}</h3>
                  <Button
                    variant="primary"
                    onClick={() => setShowAddSubjectForm(!showAddSubjectForm)}
                    className="text-[12px]"
                  >
                    <Icon name="fa-plus" className="mr-1" />
                    {showAddSubjectForm ? t("Cancel") : t("Add Subject")}
                  </Button>
                </div>

                {showAddSubjectForm && (
                  <form onSubmit={handleAddSubject} className="p-4 bg-[#fcfcfc] border border-[#e1e1e1] rounded space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <Input
                        label={t("Subject Code")}
                        placeholder="e.g. MATH-101"
                        value={newSubjectData.code}
                        onChange={(e) => setNewSubjectData({ ...newSubjectData, code: e.target.value })}
                      />
                      <Input
                        label={t("Subject Name")}
                        placeholder="e.g. Mathematics"
                        value={newSubjectData.name}
                        onChange={(e) => setNewSubjectData({ ...newSubjectData, name: e.target.value })}
                      />
                      <Select
                        label={t("Type")}
                        value={newSubjectData.type}
                        onChange={(e) => setNewSubjectData({ ...newSubjectData, type: e.target.value as any })}
                      >
                        <option value="Theory">Theory</option>
                        <option value="Practical">Practical</option>
                        <option value="Both">Both</option>
                      </Select>
                      <Input
                        label={t("Marks")}
                        type="number"
                        value={newSubjectData.fullMarks}
                        onChange={(e) => setNewSubjectData({ ...newSubjectData, fullMarks: parseInt(e.target.value) || 100 })}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" variant="success" className="text-[12px]">
                        {t("Save Subject")}
                      </Button>
                    </div>
                  </form>
                )}

                <div className="overflow-x-auto border border-[#e1e1e1] rounded">
                  <table className="w-full text-left text-[13px]">
                    <thead className="bg-[#f8f9fa] text-[#444] font-semibold border-b border-[#e1e1e1]">
                      <tr>
                        <th className="p-3">Subject Code</th>
                        <th className="p-3">Subject Name</th>
                        <th className="p-3">Evaluation Type</th>
                        <th className="p-3">Full Marks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eee]">
                      {subjects.map((sub) => (
                        <tr key={sub.id} className="hover:bg-gray-50">
                          <td className="p-3 font-mono font-bold text-[#1abc9c]">{sub.code}</td>
                          <td className="p-3 font-semibold text-[#333]">{sub.name}</td>
                          <td className="p-3 text-[#666]">{sub.type}</td>
                          <td className="p-3 text-[#666]">{sub.fullMarks} Marks</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 5: STREAM MANAGEMENT (CLASS 9-12) */}
            {activeTab === "stream" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#eee]">
                  <div>
                    <h3 className="text-[14px] font-semibold text-[#444] m-0">
                      {t("Class Stream Configuration (Class 9-12)")}
                    </h3>
                    <p className="text-[12px] text-[#777] m-0 mt-0.5">
                      Class 1-8 follow General Curriculum. Class 9-12 can have multiple active streams.
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    onClick={() => setShowAddStreamForm(!showAddStreamForm)}
                    className="text-[12px]"
                  >
                    <Icon name="fa-plus" className="mr-1" />
                    {showAddStreamForm ? t("Cancel") : t("Add Stream Option")}
                  </Button>
                </div>

                {showAddStreamForm && (
                  <form onSubmit={handleAddCustomStream} className="p-4 bg-[#fcfcfc] border border-[#e1e1e1] rounded space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input
                        label={t("Stream Name")}
                        placeholder="e.g. Agriculture Science"
                        value={newStreamInput.name}
                        onChange={(e) => setNewStreamInput({ ...newStreamInput, name: e.target.value })}
                      />
                      <Input
                        label={t("Stream Code")}
                        placeholder="e.g. AGR-01"
                        value={newStreamInput.code}
                        onChange={(e) => setNewStreamInput({ ...newStreamInput, code: e.target.value })}
                      />
                      <Input
                        label={t("Description")}
                        placeholder="Summary"
                        value={newStreamInput.description}
                        onChange={(e) => setNewStreamInput({ ...newStreamInput, description: e.target.value })}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" variant="success" className="text-[12px]">
                        {t("Save Stream")}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Clean Stream Table Layout */}
                <div className="overflow-x-auto border border-[#e1e1e1] rounded">
                  <table className="w-full text-left text-[13px]">
                    <thead className="bg-[#f8f9fa] text-[#444] font-semibold border-b border-[#e1e1e1]">
                      <tr>
                        <th className="p-3 w-32">Class Grade</th>
                        <th className="p-3 w-48">Curriculum Status</th>
                        <th className="p-3">Enabled Stream Options</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eee]">
                      {/* Class 1 to 8: Integrated Subjects Display */}
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((grade) => {
                        const integratedSubjects =
                          grade <= 2
                            ? ["English", "Hindi", "Mathematics", "EVS", "Art & Craft", "General Knowledge"]
                            : grade <= 5
                            ? ["English", "Hindi", "Mathematics", "Environmental Science", "Computer Studies", "GK"]
                            : ["English", "Hindi", "Mathematics", "General Science", "Social Science", "Sanskrit / 3rd Lang", "Computer Science"];

                        return (
                          <tr key={`j-${grade}`} className="bg-[#fcfcfc]">
                            <td className="p-3 font-semibold text-[#444]">Class {grade}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#eef2f7] text-[#4a5568] border border-[#cbd5e1]">
                                Integrated Subjects
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex flex-wrap gap-1.5 items-center">
                                <span className="text-[11px] font-bold text-[#666] mr-1">No Stream — Core Subjects:</span>
                                {integratedSubjects.map((sub, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-white border border-[#d2d6de] text-[#333] text-[11px] rounded font-medium"
                                  >
                                    {sub}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      {/* Class 9 to 12 */}
                      {[9, 10, 11, 12].map((grade) => {
                        const activeGradeStreams = classMultiStreams[grade] || [];

                        return (
                          <tr key={`s-${grade}`} className="hover:bg-gray-50">
                            <td className="p-3 font-bold text-[#1abc9c]">Class {grade}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#1abc9c] text-white">
                                {activeGradeStreams.length} Active Stream{activeGradeStreams.length !== 1 ? "s" : ""}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex flex-wrap items-center gap-3">
                                {availableStreams.map((st) => {
                                  const isChecked = activeGradeStreams.includes(st.id);

                                  return (
                                    <label
                                      key={st.id}
                                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[12px] font-semibold cursor-pointer transition-all ${
                                        isChecked
                                          ? "bg-emerald-50 border-[#1abc9c] text-[#1abc9c]"
                                          : "bg-white border-[#d2d6de] text-[#444] hover:border-gray-400"
                                      }`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => handleToggleStreamForClass(grade, st.id)}
                                        className="w-3.5 h-3.5 accent-[#1abc9c] cursor-pointer"
                                      />
                                      <span>{st.name}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Floating Toast Alert */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[9999] p-4 rounded shadow-md text-white font-bold transition-all duration-300 flex items-center gap-2 ${
            toast.type === "success" ? "bg-[#1abc9c]" : "bg-red-500"
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
}
