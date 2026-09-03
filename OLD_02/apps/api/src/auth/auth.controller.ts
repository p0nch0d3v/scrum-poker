import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { configService } from '../config/config.service';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from 'src/user/users.service';

@Controller('auth')
export class AuthController {
    constructor(private userService: UsersService) {
    }

    @Post('login')
    async login(@Body('token') token): Promise<boolean> {
        const client = new OAuth2Client(
            configService.getGoogleAuthClientId(),
            configService.getGooleAuthClientSecret(),
        );
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: configService.getGoogleAuthClientId(),
        });
        const rawData = ticket.getPayload()
        const { email, name, picture } = rawData;

        const user = await this.userService.login({ 
            email: email, 
            name: name, 
            picture: picture
        });
        return user !== undefined && user !== null;
    }
}
