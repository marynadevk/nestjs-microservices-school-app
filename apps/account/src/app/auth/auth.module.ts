import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from '../../configs/jwt.config';

@Module({
  imports: [UserModule, JwtModule.registerAsync(getJwtConfig())],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
