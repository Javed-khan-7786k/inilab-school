import { schoolSettingApi } from "../services/api/schoolSettingApi";

export interface StreamOptionItem {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export const DEFAULT_SCHOOL_STREAMS: StreamOptionItem[] = [
  { id: "str-pcm", name: "Science (PCM)", code: "SCI-PCM", description: "Physics, Chemistry, Maths & CS" },
  { id: "str-pcb", name: "Science (PCB)", code: "SCI-PCB", description: "Physics, Chemistry, Biology & Psych" },
  { id: "str-com", name: "Commerce", code: "COM-ACC", description: "Accountancy, Business Studies, Economics" },
  { id: "str-art", name: "Arts / Humanities", code: "ART-HUM", description: "History, Pol Science, Geography, Sociology" },
  { id: "str-voc", name: "Vocational & IT", code: "VOC-IT", description: "Information Technology & Web Design" },
];

export const DEFAULT_CLASS_STREAMS: Record<number, string[]> = {
  9: ["str-pcm", "str-pcb"],
  10: ["str-pcm"],
  11: ["str-pcm", "str-com", "str-art"],
  12: ["str-pcm", "str-com"],
};

export const STREAM_STORAGE_KEY = "inilab_school_streams";
export const CLASS_STREAM_STORAGE_KEY = "inilab_class_streams";

/**
 * Synchronous local retrieval with localStorage fallback
 */
export function getAvailableStreamsForClass(classNameStr: string): StreamOptionItem[] {
  if (!classNameStr) return [];

  const match = classNameStr.match(/\d+/);
  const grade = match ? parseInt(match[0], 10) : 0;

  if (grade < 9 || grade > 12) {
    return [];
  }

  let streams = DEFAULT_SCHOOL_STREAMS;
  try {
    const savedStreams = localStorage.getItem(STREAM_STORAGE_KEY);
    if (savedStreams) {
      streams = JSON.parse(savedStreams);
    }
  } catch (e) {
    console.error("Error reading saved streams:", e);
  }

  let classStreamsMap = DEFAULT_CLASS_STREAMS;
  try {
    const savedClassStreams = localStorage.getItem(CLASS_STREAM_STORAGE_KEY);
    if (savedClassStreams) {
      classStreamsMap = JSON.parse(savedClassStreams);
    }
  } catch (e) {
    console.error("Error reading saved class streams:", e);
  }

  const enabledStreamIds = classStreamsMap[grade];
  if (enabledStreamIds && Array.isArray(enabledStreamIds) && enabledStreamIds.length > 0) {
    return streams.filter((st) => enabledStreamIds.includes(st.id));
  }

  return streams;
}

/**
 * Async API fetch directly from MongoDB Express Backend Server
 */
export async function fetchStreamsFromBackend(classNameStr?: string): Promise<StreamOptionItem[]> {
  try {
    const match = classNameStr ? classNameStr.match(/\d+/) : null;
    const grade = match ? match[0] : "";
    const backendStreams = await schoolSettingApi.getStreams(grade);
    if (backendStreams && Array.isArray(backendStreams) && backendStreams.length > 0) {
      return backendStreams;
    }
  } catch (err) {
    console.warn("Backend stream fetch fallback to local:", err);
  }
  return getAvailableStreamsForClass(classNameStr || "");
}
