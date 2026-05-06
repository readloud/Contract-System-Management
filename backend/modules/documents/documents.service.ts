import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentsService {
  async extractTextFromPdf(fileKey: string): Promise<string> {
    // Implementasi sederhana untuk sementara
    return 'Sample text from PDF';
  }
}
