import { Controller, Post , Body, Inject} from "@midwayjs/core";
import { UserService } from "../service/user.service";

@Controller('/user')
export class UserController {

    @Inject()
    userService: UserService;

    @Post('/register')
    async register(
        @Body('username') username: string,
        @Body('password') password: string
    ): Promise<boolean> {
        this.userService.register(username, password);
        return true;
    }
}