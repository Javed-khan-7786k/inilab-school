import apiClient from "./apiClient";

export interface AttendanceRecord {
  id?: string;
  studentId?: string;
  userId?: string;
  date: string;
  status: "Present" | "Absent" | "Late" | "Half Day";
  className?: string;
  remarks?: string;
  userInfo?: {
    _id?: string;
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    photo?: string;
  };
}

export const attendanceApi = {
  async getByDate(date: string, className?: string): Promise<AttendanceRecord[]> {
    const response = await apiClient.get("/attendance", { params: { date, className } });
    return response.data.data;
  },

  async saveAttendance(date: string, records: { studentId: string; status: string; className?: string }[]): Promise<AttendanceRecord[]> {
    const response = await apiClient.post("/attendance", { date, records });
    return response.data.data;
  },

  async getStaffByDate(date: string): Promise<AttendanceRecord[]> {
    const response = await apiClient.get("/attendance/staff", { params: { date } });
    return response.data.data;
  },

  async saveStaffAttendance(date: string, records: { userId: string; status: string; remarks?: string }[]): Promise<AttendanceRecord[]> {
    const response = await apiClient.post("/attendance/staff", { date, records });
    return response.data.data;
  },

  async getUserAttendance(type: string, id: string | number, month?: string): Promise<AttendanceRecord[]> {
    console.log("API Response:",type, id, month);
    const response = await apiClient.get(`/attendance/user/${type}/${id}`, { params: { month } });
    return response.data.data;
  },
};
