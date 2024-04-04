// import {
//   CanActivate,
//   ExecutionContext,
//   HttpException,
//   HttpStatus,
//   Injectable,
// } from '@nestjs/common';
// import * as jwt from 'jsonwebtoken';
// import { UserRepository } from 'src/repositories/user.repository';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor() {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();

//     const accessToken = request.cookie();

//     if (!accessToken) {
//       throw new HttpException(
//         { message: '토큰이 존재하지 않습니다.' },
//         HttpStatus.UNAUTHORIZED,
//       );
//     }

//     // try {
//     //   const { userId } = await jwt.verify(accessToken, process.env.JWT_SECRET);
//     // } catch (error) {}

//     return true;
//   }
// }
