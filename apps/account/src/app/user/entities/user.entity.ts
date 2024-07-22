import { AccountChangedCourse } from '@school/contracts';
import { IDomainEvent, IUser, IUserCourses, PurchaseStatus, UserRole } from '@school/interfaces';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';

export class UserEntity implements IUser {
  _id?: string | Types.ObjectId;
  displayName?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  courses?: IUserCourses[];
  events: IDomainEvent[] = [];

  constructor(user: IUser) {
    this._id = user._id;
    this.passwordHash = user.passwordHash;
    this.displayName = user.displayName;
    this.email = user.email;
    this.role = user.role;
    this.courses = user.courses;
  }

  public getPublicProfile() {
    return {
      email: this.email,
      role: this.role,
      displayName: this.displayName,
    };
  }

  public setCourseStatus(courseId: string, state: PurchaseStatus) {
    const exist = this.courses.find((course) => course.courseId === courseId);
    if (!exist) {
      this.courses.push({
        courseId,
        purchaseStatus: state,
      });
      return this;
    }
    if (state === PurchaseStatus.Cancelled) {
      this.courses = this.courses.filter(
        (course) => course.courseId !== courseId
      );
      return this;
    }
    this.courses = this.courses.map((course) => {
      if (course.courseId === courseId) {
        course.purchaseStatus = state;
        return course;
      }
      return course;
    });
    this.events.push({
      topic: AccountChangedCourse.topic,
      data: { courseId, userId: this._id, state },
    });
    return this;
  }

  public getCourseStatus(courseId: string): PurchaseStatus {
    return (
      this.courses.find((course) => course.courseId === courseId)
        ?.purchaseStatus ?? PurchaseStatus.Started
    );
  }

  public async setPasswordHash(password: string) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(password, salt);
    return this;
  }

  public comparePassword(password: string) {
    return bcrypt.compare(password, this.passwordHash);
  }

  public updateProfile(displayName: string) {
    this.displayName = displayName;
    return this;
  }
}
