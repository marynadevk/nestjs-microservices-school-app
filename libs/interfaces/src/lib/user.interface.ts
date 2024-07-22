import { Types } from 'mongoose';

export enum UserRole {
  Teacher = 'Teacher',
  Student = 'Student',
}

export enum PurchaseStatus {
  Started = 'Started',
  WaitingForPayment = 'WaitingForPayment',
  Paid = 'Paid',
  Cancelled = 'Cancelled',
}
export interface IUser {
  _id?: string | Types.ObjectId;
  displayName?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  courses?: IUserCourses[];
}

export interface IUserCourses {
  courseId: string;
  purchaseStatus: PurchaseStatus;
}
