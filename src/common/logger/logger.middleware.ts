import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const ms = Date.now() - start;
      const requestId = (req as any).requestId ?? '-';
      this.logger.log(
        `[${requestId}] ${method} ${originalUrl} ${statusCode} - ${ms}ms`,
      );
    });

    next();
  }
}
