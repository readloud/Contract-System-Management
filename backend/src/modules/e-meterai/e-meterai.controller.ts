import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { EMeteraiService } from './e-meterai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

class ApplyMeteraiDto {
  contractId: string;
  documentUrl: string;
  provider?: 'peruri' | 'mitrakas' | 'vida';
}

@Controller('e-meterai')
@UseGuards(JwtAuthGuard)
export class EMeteraiController {
  constructor(private readonly eMeteraiService: EMeteraiService) {}

  @Post('apply')
  async applyMeterai(@Body() dto: ApplyMeteraiDto, @Request() req) {
    const result = await this.eMeteraiService.applyMeterai(
      dto.contractId,
      dto.documentUrl,
      dto.provider,
    );
    return {
      success: true,
      data: result,
      message: 'e-Meterai berhasil diterapkan',
    };
  }

  @Get('verify/:meteraiNumber')
  async verifyMeterai(@Param('meteraiNumber') meteraiNumber: string) {
    const isValid = await this.eMeteraiService.verifyMeterai(meteraiNumber);
    return {
      success: true,
      isValid,
      message: isValid ? 'e-Meterai valid' : 'e-Meterai tidak ditemukan',
    };
  }

  @Get('contract/:contractId')
  async getContractMeteraiLogs(@Param('contractId') contractId: string) {
    const logs = await this.eMeteraiService.getContractMeteraiLogs(contractId);
    return {
      success: true,
      data: logs,
    };
  }

  @Get('statistics')
  async getStatistics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const stats = await this.eMeteraiService.getStatistics(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
    return {
      success: true,
      data: stats,
    };
  }
}