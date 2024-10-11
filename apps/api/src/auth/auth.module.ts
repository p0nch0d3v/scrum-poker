import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/user/users.module';

@Module({
    imports: [JwtModule, UsersModule],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}
