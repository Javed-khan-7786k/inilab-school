import SchoolSetting from "../models/SchoolSetting.js";

const DEFAULT_STREAMS = [
  { id: "str-pcm", name: "Science (PCM)", code: "SCI-PCM", description: "Physics, Chemistry, Maths & CS" },
  { id: "str-pcb", name: "Science (PCB)", code: "SCI-PCB", description: "Physics, Chemistry, Biology & Psych" },
  { id: "str-com", name: "Commerce", code: "COM-ACC", description: "Accountancy, Business Studies, Economics" },
  { id: "str-art", name: "Arts / Humanities", code: "ART-HUM", description: "History, Pol Science, Geography, Sociology" },
  { id: "str-voc", name: "Vocational & IT", code: "VOC-IT", description: "Information Technology & Web Design" },
];

const DEFAULT_CLASS_STREAMS = {
  "9": ["str-pcm", "str-pcb"],
  "10": ["str-pcm"],
  "11": ["str-pcm", "str-com", "str-art"],
  "12": ["str-pcm", "str-com"],
};

export const getSchoolSettings = async (req, res) => {
  try {
    let settings = await SchoolSetting.findOne();
    if (!settings) {
      settings = await SchoolSetting.create({
        availableStreams: DEFAULT_STREAMS,
        classMultiStreams: DEFAULT_CLASS_STREAMS,
        sessions: [
          { id: "1", year: "2024-2025", startDate: "2024-04-01", endDate: "2025-03-31", isActive: false },
          { id: "2", year: "2025-2026", startDate: "2025-04-01", endDate: "2026-03-31", isActive: true },
        ],
      });
    }
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error("Error fetching school settings:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSchoolSettings = async (req, res) => {
  try {
    const { schoolProfile, sessions, availableStreams, classMultiStreams } = req.body;
    let settings = await SchoolSetting.findOne();

    if (!settings) {
      settings = new SchoolSetting({});
    }

    if (schoolProfile) settings.schoolProfile = schoolProfile;
    if (sessions) settings.sessions = sessions;
    if (availableStreams) settings.availableStreams = availableStreams;
    if (classMultiStreams) settings.classMultiStreams = classMultiStreams;

    await settings.save();
    return res.status(200).json({ success: true, message: "School settings updated successfully in database!", data: settings });
  } catch (error) {
    console.error("Error updating school settings:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getStreamsForClass = async (req, res) => {
  try {
    const { grade } = req.query;
    let settings = await SchoolSetting.findOne();
    if (!settings) {
      settings = { availableStreams: DEFAULT_STREAMS, classMultiStreams: DEFAULT_CLASS_STREAMS };
    }

    const availableStreams = settings.availableStreams || DEFAULT_STREAMS;
    const classMultiStreams = settings.classMultiStreams || DEFAULT_CLASS_STREAMS;

    if (grade) {
      const match = String(grade).match(/\d+/);
      const numericGrade = match ? match[0] : grade;
      const enabledIds = classMultiStreams.get ? classMultiStreams.get(numericGrade) : classMultiStreams[numericGrade];

      if (enabledIds && Array.isArray(enabledIds) && enabledIds.length > 0) {
        const filtered = availableStreams.filter((st) => enabledIds.includes(st.id));
        return res.status(200).json({ success: true, data: filtered });
      }
    }

    return res.status(200).json({ success: true, data: availableStreams });
  } catch (error) {
    console.error("Error fetching streams for class:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
