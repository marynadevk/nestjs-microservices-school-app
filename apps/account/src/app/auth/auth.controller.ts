import { Body, Controller, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountLogin, AccountSignup } from '@school/contracts';
import { Message, RMQMessage, RMQRoute, RMQValidate } from 'nestjs-rmq';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @RMQValidate()
  @RMQRoute(AccountSignup.topic)
  async signup(
    dto: AccountSignup.Request,
    @RMQMessage msg: Message
  ): Promise<AccountSignup.Response> {
    const rid = msg.properties.headers['requestId'];
    this.logger.log(`Received signup request with ID: ${rid}`);

    try {
      const response = await this.authService.signup(dto);
      this.logger.log(`Signup successful for request ID: ${rid}`);
      return response;
    } catch (error) {
      this.logger.error(`Signup failed for request ID: ${rid}`, error.stack);
      throw error;
    }
  }

  @RMQValidate()
  @RMQRoute(AccountLogin.topic)
  async login(
    @Body() { email, password }: AccountLogin.Request
  ): Promise<AccountLogin.Response> {
    this.logger.log(`Received login request for email: ${email}`);

    try {
      const { id } = await this.authService.validateUser(email, password);
      const response = await this.authService.login(id);
      this.logger.log(`Login successful for user ID: ${id}`);
      return response;
    } catch (error) {
      this.logger.error(`Login failed for email: ${email}`, error.stack);
      throw error;
    }
  }
}
