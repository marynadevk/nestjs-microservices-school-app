import { Injectable } from '@nestjs/common';
import { RegisterDto } from './auth.controller';
import { UserRepository } from '../user/repositories/user.repository';
import { UserEntity } from '../user/entities/user.entity';
import { UserRole } from '@school-project/interfaces';
import { JwtService } from '@nestjs/jwt';

const VALIDATION_ERROR = 'Credentials are not valid';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async signup({ email, password, displayName }: RegisterDto) {
    const oldUser = await this.userRepository.findUserByEmail(email);
    if (oldUser) {
      throw new Error('User already exists');
    }
    const newUserEntity = await new UserEntity({
      displayName,
      passwordHash: '',
      email,
      role: UserRole.Student,
    }).setPasswordHash(password);
    const newUser = await this.userRepository.createUser(newUserEntity);
    return { email: newUser.email };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error(VALIDATION_ERROR);
    }
    const userEntity = new UserEntity(user);
    const isPasswordValid = await userEntity.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error(VALIDATION_ERROR);
    }
    return { id: user._id };
  }

  async login(id: string) {
    return {
      access_token: await this.jwtService.signAsync({ id }),
    };
  }
}
