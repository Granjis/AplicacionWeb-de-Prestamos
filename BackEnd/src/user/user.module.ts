import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Module({
  providers: [UserService, AuthService, JwtService, Reflector],
  controllers: [UserController],
})
export class UserModule {}
