import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CraeteUserDto } from 'src/users/dtos/CraeteUser.dto';
import { CraeteUserPostDto } from 'src/users/dtos/CreateUserPost.dto';
import { CreateUserProfileDto } from 'src/users/dtos/CreateUserProfile.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { UsersService } from 'src/users/services/users/users.service';


@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @Get()
    async getUsers() {
        return this.userService.findUsers();
    }


    @Post()
    createUser(@Body() createUserDto: CraeteUserDto) {
        this.userService.createUser(createUserDto);
    }

    @Put(':id')
    async updateUserById(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateUserDto) {
        this.userService.updateUser(id, updateDto)
    }

    @Delete(':id')
    async deleteUserById(@Param('id', ParseIntPipe) id: number) {
        this.userService.deleteUser(id)
    }

    @Post(':id/profiles')
    createUserProfile(@Param('id', ParseIntPipe) id: number,
        @Body() createUserProfileDto: CreateUserProfileDto) {
        return this.userService.createUserProfile(id, createUserProfileDto);
    }

    @Post(':id/posts')
    createUserPost(@Param('id', ParseIntPipe) id: number, @Body() createUserPostDto: CraeteUserPostDto) {
        return this.userService.createUserPost(id, createUserPostDto);
    }
}
