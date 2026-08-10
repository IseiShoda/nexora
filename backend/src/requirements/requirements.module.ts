import { Module } from '@nestjs/common';

import { RequirementService } from './requirement.service';
import { PrismaService } from '../Prisma/prisma.service';

@Module({
  providers: [
    PrismaService,
    RequirementService,
  ],
  exports: [
    RequirementService,
  ],
})
export class RequirementsModule {}