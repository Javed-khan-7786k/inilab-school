export interface Student {
  id: string | number;
  photo: string;
  name: string;
  roll: string;
  email: string;
  className: string;
}

export interface StudentListItem {
  id: string | number;
  rawId: string | number;
  photo: string;
  name: string;
  roll: string;
  email: string;
  className: string;
  status: string;
  source: string;
}

export interface DocumentObject {
  name: string;
  file: string;
}

export interface Teacher {
  id: string | number;
  photo: string;
  name: string;
  email: string;
  designation: string;
  infiniteDocuments?: DocumentObject[];
}

export interface Parent {
  id: string | number;
  photo: string;
  name: string;
  email: string;
  phone: string;
}

export interface Visitor {
  id: string | number;
  visitorId: string;
  name: string;
  toMeet: string;
  checkIn: string;
  checkOut: string;
  status: 'in' | 'out';
}

export interface NoticeItem {
  id: string | number;
  title: string;
  date: string;
  notice: string;
  targetRoles?: string[];
}

export interface EventItem {
  id: string | number;
  title: string;
  date: string;
  details: string;
  targetRoles?: string[];
}

export interface HolidayItem {
  id: string | number;
  title: string;
  date: string;
  details: string;
}

export interface LeaveApplication {
  id: string | number;
  applicationTo: string;
  category: string;
  date: string;
  schedule: string;
  days: number;
  attachment: string;
  status: string;
}

export interface DocumentItem {
  id: string | number;
  title: string;
  date: string;
}

export interface ProfileDetails {
  name: string;
  roleLabel: string;
  photo: string;
  gender: string;
  dob: string;
  phone: string;
  joiningDate: string;
  religion: string;
  email: string;
  address: string;
  username: string;
  class?: string;
  section?: string;
  roll?: string;
  designation?: string;
  department?: string;
  documents?: DocumentObject[];
}

export interface UserItem {
  id: string | number;
  photo: string;
  name: string;
  email: string;
  role: string;
}

export interface Enquiry {
  id: string | number;
  studentName: string;
  applyingClass: string;
  dob: string;
  gender: string;
  
  fatherName: string;
  fatherOccupation: string;
  fatherContact: string;
  fatherEmail: string;
  fatherAadhaar?: string;
  
  motherName: string;
  motherOccupation: string;
  motherContact: string;
  motherEmail: string;
  motherAadhaar?: string;
  
  address: string;
  state: string;
  district: string;
  pinCode: string;
  
  childAadhaar?: string;
  aparId?: string;
  penNumber?: string;
  
  previousSchool?: string;
  previousSchoolAddress?: string;
  previousSchoolId?: string;
  lastClassAttended?: string;

  photo?: string;
  documents?: DocumentObject[];
  status: 'New' | 'Contacted' | 'Follow-up' | 'Admission Confirmed' | 'Rejected' | 'Closed';
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string | Record<string, any>;
}

// Combined item for Admin's Student page (Admitted students + Not-yet-admitted enquiries)
export interface Student {
  id: string | number;
  photo: string;
  name: string;
  roll: string;
  email: string;
  className: string;

  // Extended admission profile (optional — filled when added via full Student form)
  dob?: string;
  gender?: string;
  fatherName?: string;
  fatherOccupation?: string;
  fatherContact?: string;
  fatherEmail?: string;
  fatherAadhaar?: string;
  motherName?: string;
  motherOccupation?: string;
  motherContact?: string;
  motherEmail?: string;
  motherAadhaar?: string;
  address?: string;
  state?: string;
  district?: string;
  pinCode?: string;
  childAadhaar?: string;
  aparId?: string;
  penNumber?: string;
  previousSchool?: string;
  previousSchoolAddress?: string;
  previousSchoolId?: string;
  lastClassAttended?: string;
  documents?: DocumentObject[];
}
