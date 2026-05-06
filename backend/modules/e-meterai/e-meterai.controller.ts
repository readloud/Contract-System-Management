import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { EMeteraiService } from './e-meterai.service';

class ApplyMeteraiDto {
  contractId: string;
  documentUrl: string;
  provider?: 'peruri' | 'mitrakas' | 'vida';
}

@Controller('e-meterai')
export class EMeteraiController {
  constructor(private readonly eMeteraiService: EMeteraiService) {}

  @Post('apply')
  async applyMeterai(@Body() dto: ApplyMeteraiDto) {
    const provider = dto.provider || 'peruri';
    const result = await this.eMeteraiService.applyMeterai(
      dto.contractId,
      dto.documentUrl,
      provider as any,
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
}
