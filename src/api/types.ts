/** @format */

export interface ApiResponse<T> {
  token: string;
  data: T;
}

export interface ApiError {
  ErrorType: string;
  ErrorMessage: string;
  fields?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  emailConfirmed: boolean;
  dateCreated: string;
  isActive: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterAdminRequest {
  firstName: string;
  lastName: string;
  email: string;
  roleName: string;
}

export interface VerifyEmailRequest {
  email: string;
  token: string;
}



export interface SetPasswordRequest {
  email: string;
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}


export interface Job {
  id: string;
  title: string;
  department: string;
  description: string;
  location: string;
  employmentType: number;
  status: number;
  skills: string;
  experienceLevel: number;
  type: number;
  paymentAmount: number;
}

export interface CreateJobRequest {
  title: string;
  department: string;
  description: string;
  location: string;
  employmentType: number;
  status: number;
  skills: string;
  experienceLevel: number;
  type: number;
  paymentAmount: number;
}

export interface UpdateJobRequest extends CreateJobRequest {
  id: string;
}

export interface GetJobsRequest {
  title?: string;
  department?: string;
  type?: number;
  status?: number;
  pageNumber?: number;
  pageSize?: number;
}

// Application Types
export interface Application {
  id: string;
  jobId: string;
  email: string;
  phoneNumber: string;
  location: string;
  yearsOfExperience: number;
  cv: string;
  status: string;
  dateApplied: string;
}

export interface CreateApplicationRequest {
  jobId: string;
  email: string;
  phoneNumber: string;
  location: string;
  yearsOfExperience: number;
  cv: string;
}

export interface GetApplicationsRequest {
  status?: string;
  pageNumber?: number;
  pageSize?: number;
}

// Interview types
export interface Interview {
  id: string;
  title: string;
  applicationId: string;
  candidateName: string;
  scheduledTime: string;
  meetingLink: string;
  status: number; // use numeric statuses 0-4
  reason?: string;
}

export interface ScheduleInterviewRequest {
  title: string;
  applicationId: string;
  candidateName: string;
  scheduledTime: string;
  meetingLink: string;
}

export interface RescheduleInterviewRequest extends ScheduleInterviewRequest {
  id: string;
  reason?: string;
}

export interface UpdateInterviewStatusRequest {
  id: string;
  status: number;
}

export interface GetInterviewsRequest {
  title?: string;
  status?: number;
  candidateName?: string;
  startDate?: string;
  endDate?: string;
  pageNumber?: number;
  pageSize?: number;
}
