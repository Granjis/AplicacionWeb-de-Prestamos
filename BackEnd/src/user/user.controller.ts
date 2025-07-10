import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../auth/guards/local-auth/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { Role } from './role.enum';
import { Roles } from './roles.decorator';

@Controller('users')
export class UserController {

    constructor(private readonly authService: AuthService) { }
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req) {
        return this.authService.login(req);
    }

    @UseGuards(LocalAuthGuard)
    @Roles(Role.ADMIN)
    @Post('/')
    async findAll() {
        return await this.authService.findAll();
    }
}