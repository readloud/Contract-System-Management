import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { MeteraiLog, MeteraiProvider, MeteraiStatus } from './entities/meterai-log.entity';
import { Contract } from '../contracts/entities/contract.entity';

@Injectable()
export class EMeteraiService {
  constructor(
    @InjectRepository(MeteraiLog)
    private meteraiLogRepo: Repository<MeteraiLog>,
    @InjectRepository(Contract)
    private contractRepo: Repository<Contract>,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  /**
   * Apply e-Meterai to a contract document
   */
  async applyMeterai(
    contractId: string,
    documentUrl: string,
    provider: MeteraiProvider = MeteraiProvider.PERURI,
  ): Promise<MeteraiLog> {
    const contract = await this.contractRepo.findOne({ where: { id: contractId } });
    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    // Create log entry
    const meteraiLog = this.meteraiLogRepo.create({
      contractId,
      provider,
      status: MeteraiStatus.PENDING,
      amount: 10000, // Fixed amount for e-Meterai (Rp 10,000)
      apiRequest: { documentUrl, provider },
    });
    await this.meteraiLogRepo.save(meteraiLog);

    try {
      let result;
      switch (provider) {
        case MeteraiProvider.PERURI:
          result = await this.applyPeruriMeterai(documentUrl, meteraiLog.id);
          break;
        case MeteraiProvider.MITRAKAS:
          result = await this.applyMitrakasMeterai(documentUrl, meteraiLog.id);
          break;
        case MeteraiProvider.VIDA:
          result = await this.applyVidaMeterai(documentUrl, meteraiLog.id);
          break;
        default:
          throw new BadRequestException(`Unsupported provider: ${provider}`);
      }

      // Update log with success
      meteraiLog.meteraiNumber = result.meteraiNumber;
      meteraiLog.meteraiCode = result.meteraiCode;
      meteraiLog.qrCode = result.qrCode;
      meteraiLog.verificationUrl = result.verificationUrl;
      meteraiLog.appliedAt = new Date();
      meteraiLog.status = MeteraiStatus.APPLIED;
      meteraiLog.apiResponse = result;
      await this.meteraiLogRepo.save(meteraiLog);

      return meteraiLog;
    } catch (error) {
      // Update log with error
      meteraiLog.status = MeteraiStatus.FAILED;
      meteraiLog.errorMessage = error.message;
      meteraiLog.apiResponse = { error: error.response?.data || error.message };
      await this.meteraiLogRepo.save(meteraiLog);
      throw new BadRequestException(`Failed to apply e-Meterai: ${error.message}`);
    }
  }

  /**
   * Peruri e-Meterai API Integration
   * Peruri Digital Security (PDS) is the official e-Meterai provider
   */
  private async applyPeruriMeterai(documentUrl: string, logId: string): Promise<any> {
    const apiBaseUrl = this.configService.get('PERURI_API_BASE_URL', 'https://api.peruri.co.id/v1');
    const clientId = this.configService.get('PERURI_CLIENT_ID');
    const clientSecret = this.configService.get('PERURI_CLIENT_SECRET');
    const vendorCode = this.configService.get('PERURI_VENDOR_CODE');

    // Get access token
    const tokenResponse = await firstValueFrom(
      this.httpService.post(`${apiBaseUrl}/oauth/token`, {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      }),
    );

    const accessToken = tokenResponse.data.access_token;

    // Apply e-Meterai
    const stampResponse = await firstValueFrom(
      this.httpService.post(
        `${apiBaseUrl}/stamp`,
        {
          document_url: documentUrl,
          vendor_code: vendorCode,
          metadata: {
            transaction_id: logId,
            document_type: 'contract',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    return {
      meteraiNumber: stampResponse.data.stamp_number,
      meteraiCode: stampResponse.data.stamp_code,
      qrCode: stampResponse.data.qr_code,
      verificationUrl: `https://verify.peruri.co.id/${stampResponse.data.stamp_number}`,
      provider: 'peruri',
    };
  }

  /**
   * Mitrakas e-Meterai API Integration
   * Mitrakas is an authorized distributor of Peruri e-Meterai
   */
  private async applyMitrakasMeterai(documentUrl: string, logId: string): Promise<any> {
    const apiBaseUrl = this.configService.get('MITRAKAS_API_BASE_URL', 'https://api.mitrakas.com/v1');
    const apiKey = this.configService.get('MITRAKAS_API_KEY');
    const apiSecret = this.configService.get('MITRAKAS_API_SECRET');

    const response = await firstValueFrom(
      this.httpService.post(
        `${apiBaseUrl}/e-meterai/stamp`,
        {
          document_url: documentUrl,
          transaction_id: logId,
          stamp_type: 'electronic',
        },
        {
          headers: {
            'X-API-Key': apiKey,
            'X-API-Secret': apiSecret,
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    return {
      meteraiNumber: response.data.stamp_number,
      meteraiCode: response.data.stamp_code,
      qrCode: response.data.qr_code,
      verificationUrl: `https://verify.mitrakas.com/${response.data.stamp_number}`,
      provider: 'mitrakas',
    };
  }

  /**
   * VIDA e-Meterai API Integration
   * VIDA is a certified PSrE provider that also offers e-Meterai
   */
  private async applyVidaMeterai(documentUrl: string, logId: string): Promise<any> {
    const apiBaseUrl = this.configService.get('VIDA_API_BASE_URL', 'https://api.vida.id/v1');
    const clientId = this.configService.get('VIDA_CLIENT_ID');
    const clientSecret = this.configService.get('VIDA_CLIENT_SECRET');

    const response = await firstValueFrom(
      this.httpService.post(
        `${apiBaseUrl}/esign/stamp`,
        {
          document_url: documentUrl,
          transaction_id: logId,
          stamp_position: 'bottom-right',
        },
        {
          headers: {
            'X-Client-ID': clientId,
            'X-Client-Secret': clientSecret,
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    return {
      meteraiNumber: response.data.stamp_id,
      meteraiCode: response.data.stamp_code,
      qrCode: response.data.qr_code_url,
      verificationUrl: response.data.verification_url,
      provider: 'vida',
    };
  }

  /**
   * Verify e-Meterai validity
   */
  async verifyMeterai(meteraiNumber: string): Promise<boolean> {
    const meteraiLog = await this.meteraiLogRepo.findOne({
      where: { meteraiNumber },
    });

    if (!meteraiLog) {
      return false;
    }

    // Update status to verified if not already
    if (meteraiLog.status !== MeteraiStatus.VERIFIED) {
      meteraiLog.status = MeteraiStatus.VERIFIED;
      await this.meteraiLogRepo.save(meteraiLog);
    }

    return true;
  }

  /**
   * Get e-Meterai logs for a contract
   */
  async getContractMeteraiLogs(contractId: string): Promise<MeteraiLog[]> {
    return this.meteraiLogRepo.find({
      where: { contractId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get e-Meterai usage statistics
   */
  async getStatistics(startDate?: Date, endDate?: Date): Promise<any> {
    const queryBuilder = this.meteraiLogRepo.createQueryBuilder('log');

    if (startDate) {
      queryBuilder.andWhere('log.createdAt >= :startDate', { startDate });
    }
    if (endDate) {
      queryBuilder.andWhere('log.createdAt <= :endDate', { endDate });
    }

    const totalApplied = await queryBuilder
      .where('log.status = :status', { status: MeteraiStatus.APPLIED })
      .getCount();

    const totalAmount = await queryBuilder
      .select('SUM(log.amount)', 'total')
      .where('log.status = :status', { status: MeteraiStatus.APPLIED })
      .getRawOne();

    const byProvider = await queryBuilder
      .select('log.provider', 'provider')
      .addSelect('COUNT(*)', 'count')
      .groupBy('log.provider')
      .getRawMany();

    return {
      totalApplied,
      totalAmount: Number(totalAmount?.total || 0),
      byProvider,
    };
  }
}