import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import jwtConstants from '../shared/security/constants';

@Module({
   imports: [
       UserModule,
       PassportModule,
       JwtModule.register({
         secret: jwtConstants.JWT_SECRET,
         signOptions: { expiresIn: jwtConstants.JWT_EXPIRES_IN },
       })
     ],
   providers: [AuthService, UserService, LocalStrategy, JwtStrategy],
   exports: [AuthService]
  
})
export class AuthModule {}