import { IsEmail, IsOptional, IsString } from 'class-validator';

export namespace AccountSignup {
	export const topic = 'account.signup.command';

	export class Request {
		@IsEmail()
    email: string;

		@IsString()
		password: string;

    @IsOptional()
		@IsString()
    displayName?: string;
	}

	export class Response {
    email: string;
	}
}
