import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserCreateDTO, UserDTO } from 'models';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    async login(userToLogin: UserCreateDTO): Promise<UserDTO> {
        const existingUser = await this.userRepository.findOne({ where: { email: userToLogin.email } });
        if (existingUser !== null && existingUser !== undefined) {
            existingUser.name = userToLogin.name;
            existingUser.picture = userToLogin.picture;
            await this.userRepository.save(userToLogin);
            return { name: existingUser.name, email: existingUser.email, picture: existingUser.picture };
        }

        const newUser = await this.userRepository.create(userToLogin);
        await this.userRepository.save(newUser);
        if (newUser !== null && newUser !== newUser) {
            return { name: newUser.name, email: newUser.email, picture: newUser.picture };
        }
        return null;
    }
}
