import { Body, HttpException, HttpStatus, Injectable, ParseIntPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { profile } from 'console';
import { Post } from 'src/typeorm/entities/Post';
import { Profile } from 'src/typeorm/entities/Profile';
import { User } from 'src/typeorm/entities/User';
import { CraeteUserPostDto } from 'src/users/dtos/CreateUserPost.dto';
import { CreateUSerProfileParams, CreateUserParams, CreateUserPostParams, UpdateUserParams } from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Profile) private profileRepository: Repository<Profile>,
        @InjectRepository(Post) private postRepository: Repository<Post>
    ) { }

    findUsers() {
        return this.userRepository.find({ relations: ['profile','posts'] });// Eğer find icine relation yazmaz isek sadace classı gösterir ama ona baglı olan profile gözüksün istiyorsak relationslarıda cekmemiz gerek
    }

    createUser(userDetails: CreateUserParams) {
        const newUser = this.userRepository.create({ ...userDetails, createdAt: new Date(), });

        return this.userRepository.save(newUser);
    }

    updateUser(id: number, updateUserDetails: UpdateUserParams) {
        return this.userRepository.update({ id }, { ...updateUserDetails });
    }

    deleteUser(id: number) {
        return this.userRepository.delete({ id });
    }

    async createUserProfile(id: number,
        createUserProfileDto: CreateUSerProfileParams) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) throw new HttpException('User not found. Cannot Create Profile', HttpStatus.BAD_REQUEST);

        const newProfile = this.profileRepository.create(createUserProfileDto);

        const savedProfile = await this.profileRepository.save(newProfile);

        user.profile = savedProfile;
        return this.userRepository.save(user);
    }

    async createUserPost(id: number, craeteUserPostDetails: CreateUserPostParams) {

        const user = await this.userRepository.findOneBy({ id });
        if (!user) throw new HttpException('User not found. Cannot Create Profile', HttpStatus.BAD_REQUEST);

        const newPost = this.postRepository.create({...craeteUserPostDetails,user,});

       return this.postRepository.save(newPost);
    }
}
