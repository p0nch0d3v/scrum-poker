import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { configService } from '../config/config.service';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from 'src/user/users.service';
import { json } from 'stream/consumers';
import { UserDTO } from 'models';

@Controller('auth')
export class AuthController {
    constructor(private userService: UsersService) {
    }

    @Post('login')
    async login(@Body('token') token): Promise<UserDTO> {
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

        const user = this.userService.login({ email: email, name: name, image: picture, rawData: JSON.stringify(rawData) });
        return user;
    }
}
