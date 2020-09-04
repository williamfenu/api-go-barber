import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import auth from '@config/auth';
import AppError from '@shared/errors/AppError';

interface TokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

export default function ensureUserAutentication(
    request: Request,
    response: Response,
    next: NextFunction,
): void {
    const { authorization } = request.headers;

    if (!authorization) {
        throw new AppError('Token is missing', 401);
    }

    const [, token] = authorization.split(' ');

    try {
        const decoded = verify(token, auth.secret);
        const { sub } = decoded as TokenPayload;

        request.user = {
            id: sub,
        };

        next();
    } catch {
        throw new AppError('Token is not valid', 401);
    }
}
