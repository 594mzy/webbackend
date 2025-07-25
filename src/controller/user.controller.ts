import { Controller, Post, Body, Inject } from '@midwayjs/core';
import { UserService } from '../service/user.service';
import { RegisterDto } from '../dto/register.dto';

@Controller('/user')
export class UserController {

    @Inject()
    userService: UserService;


    @Post('/register')
    async register(@Body() dto: RegisterDto): Promise<boolean> {
        const result = await this.userService.register(dto.username, dto.password);
        return result;
    }

    @Post('/login')
    async login(@Body() dto: RegisterDto): Promise<boolean> {
        const result = await this.userService.login(dto.username, dto.password);
        return result;
    }
}