import { Injectable } from '@nestjs/common';
import { User } from './user';
import { Role } from './role.enum';

@Injectable()
export class UserService {
   private users: User[] = [
       new User(1, "admin", "admin", [Role.ADMIN]),
       new User(2, "prestamista", "prestamista", [Role.PRESTAMISTA]),
       new User(3, "deudor", "deudor", [Role.DEUDOR]),
   ];

   async findOne(username: string): Promise<User | undefined> {
       return this.users.find(user => user.username === username);
   }
   async findAll(): Promise<User[]> {
         return this.users;
   }

}