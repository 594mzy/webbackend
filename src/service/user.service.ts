import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { User } from '../entity';
import {Repository} from 'typeorm';

@Provide()
export class UserService {

  @InjectEntityModel(User)
  private userModel: Repository<User>;
    // ...existing code...
    public async register(username: string, password: string): Promise<boolean> {
      try {
        const existingUser = await this.userModel.findOne({ where: { username } });
        if (existingUser) {
          return false; // 用户名已存在
        }
        const user = this.userModel.create({ username, password });
        await this.userModel.save(user);
        return true;
      } catch (err) {
        // 可以根据需要记录日志或处理错误
        console.error('注册失败:', err);
        return false;
      }
    }
  // ...existing
}
