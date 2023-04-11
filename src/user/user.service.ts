import { User } from './entities/user.entity';
import { UserRequestDto } from './dto/users.request.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(body: UserRequestDto) {
    const { userId, nickname, password } = body;
    const isUserExist = await this.userRepository.findOneBy({ userId });

    if (isUserExist) {
      throw new UnauthorizedException('이미 존재하는 아이디 입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // 암호화
    const userObj = await this.userRepository.create({
      userId,
      nickname,
      password: hashedPassword,
    });
    const user = await this.userRepository.save(userObj);
    const payload = { userId: userId, sub: user.id };

    const jwtToken = this.jwtService.sign(payload);
    return { userId, nickname, jwtToken };
  }

  async updateNickname(token: string, nickname: string) {
    const pureToken = token.substring(7);
    const response = this.jwtService.decode(pureToken);
    const id = response.sub;
    const result = await this.userRepository.update(
      { id: id },
      { nickname: nickname },
    );
    return result;
  }

  async deleteUser(token: string) {
    const pureToken = token.substring(7);
    const response = this.jwtService.decode(pureToken);
    const id = response.sub;

    const result = await this.userRepository.delete({ id: id });
    return result;
  }
}
