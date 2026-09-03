import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'node:path';

/** SPA qobig'i: barcha noma'lum yo'llar index.html ga (haqiqiy manzillar uchun) */
@Controller()
export class RootController {
  @Get()
  index(@Res() res: Response) {
    res.sendFile(join(process.cwd(), '..', 'index.html'));
  }
}
