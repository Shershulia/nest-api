import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from './auth.service';
import { AuthDto } from "./dto";
import * as argon from 'argon2';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  signup(@Body() dto : AuthDto) {
    return this.authService.signup(dto);
  }
  @Post('signin')
  signing(@Body() dto : AuthDto) {
    return this.authService.signin(dto);
  }
}
