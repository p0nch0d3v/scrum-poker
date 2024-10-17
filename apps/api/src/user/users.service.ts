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
            await this.userRepository.update({ id: existingUser.id }, { name: userToLogin.name, picture: userToLogin.picture });
            return { name: existingUser.name, email: existingUser.email, picture: existingUser.picture };
        }

        const newUser = await this.userRepository.create(userToLogin);
        await this.userRepository.save(newUser);
        if (newUser !== undefined && newUser !== null) {
            return { name: newUser.name, email: newUser.email, picture: newUser.picture };
        }
        return null;
    }
}
