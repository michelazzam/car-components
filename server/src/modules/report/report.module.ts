import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from './report.schema';
import { AccountingModule } from '../accounting/accounting.module';

@Module({
  imports: [
    // configure model to be used in this Module
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
    AccountingModule,
  ],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
