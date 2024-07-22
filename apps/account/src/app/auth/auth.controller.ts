import { Body, Controller, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountLogin, AccountSignup } from '@school/contracts';
import { Message, RMQMessage, RMQRoute, RMQValidate } from 'nestjs-rmq';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @RMQValidate()
  @RMQRoute(AccountSignup.topic)
  async signup(dto: AccountSignup.Request, @RMQMessage msg: Message): Promise<AccountSignup.Response> {
		const rid = msg.properties.headers['requestId'];
		const logger = new Logger(rid);
		logger.error('Error message');
		return this.authService.signup(dto);
	}


  @RMQValidate()
  @RMQRoute(AccountLogin.topic)
  async login(@Body() { email, password }: AccountLogin.Request): Promise<AccountLogin.Response> {
    const { id } = await this.authService.validateUser(email, password);
    return this.authService.login(id);
  }
}
