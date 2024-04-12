import { NextFunction, Request, Response } from 'express';
import { GlobalService } from 'src/lib/globalservice';

export function SetResponseHeader(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (GlobalService.isDisableKeepAlive) {
    res.set('Connection', 'close');
  }
  next();
}
