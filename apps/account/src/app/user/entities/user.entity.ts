import { IUser, UserRole } from '@school/interfaces';
import * as bcrypt from 'bcrypt';

export class UserEntity implements IUser {
  _id?: string;
  displayName?: string;
  email: string;
  passwordHash: string;
  role: UserRole;

  constructor(user: IUser) {
    this._id = user._id;
    this.passwordHash = user.passwordHash;
    this.displayName = user.displayName;
    this.email = user.email;
    this.role = user.role;
  }

  public async setPasswordHash(password: string) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(password, salt);
    return this;
  }

  public comparePassword(password: string) {
    return bcrypt.compare(password, this.passwordHash);
  }
}
