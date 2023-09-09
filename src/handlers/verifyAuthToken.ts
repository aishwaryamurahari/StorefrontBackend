import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const { TOKEN_SECRET } = process.env;

export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader: any = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    jwt.verify(token, TOKEN_SECRET as string);
    next();
  } catch (error) {
    console.log(error);
    res.status(401);
    res.json('Access Denied');
  }
};
