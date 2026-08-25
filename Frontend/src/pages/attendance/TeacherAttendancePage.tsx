import React from "react";
import { StaffAttendancePage } from "./StaffAttendancePage";

export const TeacherAttendancePage: React.FC = () => {
  return <StaffAttendancePage title="Teacher Attendance" targetRole="Teacher" />;
};
