export interface User {
  id: string;
  displayName: string;
  department: string;
  email: string;
  role?: 'admin' | 'manager' | 'user';
}

export type Shift = '1勤' | '2勤' | '3勤';

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  shift: Shift;
  clockIn: string;
  clockOut?: string;
  breakStart?: string;
  breakEnd?: string;
  status: 'present' | 'late' | 'absent' | 'early_leave';
  notes: string;
}

export interface Thread {
  id: string;
  title: string;
  department: string;
  shift?: Shift;
  createdBy: string;
  createdAt: string;
  messageCount: number;
}

export interface Message {
  id: string;
  threadId: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  shift: Shift;
  department: string;
  reportedBy: string;
  reportedAt: string;
  photos: string[];
  comments: any[];
}

export interface VacationRequest {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  type: 'paid_leave' | 'sick_leave' | 'personal_leave' | 'compensatory_leave';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export interface WorkScheduleEntry {
  id: string;
  userId: string;
  date: string;
  shift: Shift;
  startTime: string;
  endTime: string;
  department: string;
  status: 'scheduled' | 'confirmed' | 'completed';
}
