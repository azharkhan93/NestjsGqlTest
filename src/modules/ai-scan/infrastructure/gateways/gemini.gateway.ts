import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAiScanGateway } from '../../domain/ports/ai-scan-gateway.interface';
import { VehicleScanResultEntity } from '../../domain/entities/vehicle-scan-result.entity';
import {
  GEMINI_VEHICLE_ANALYSIS_PROMPT,
  FALLBACK_SCAN_RESULT,
} from '../prompts/gemini-prompt.constants';

@Injectable()
export class GeminiGateway implements IAiScanGateway {
  private readonly logger = new Logger(GeminiGateway.name);
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey =
      this.configService.get<string>('GEMINI_API_KEY') ||
      'DUMMY_GEMINI_API_KEY';
  }

  async analyze(
    imageBuffers: readonly Buffer[],
  ): Promise<VehicleScanResultEntity> {
    if (!this.apiKey || this.apiKey.startsWith('DUMMY')) {
      this.logger.log('Gemini gateway running with fallback (Dummy key)');
      return FALLBACK_SCAN_RESULT;
    }

    try {
      const parts = [
        { text: GEMINI_VEHICLE_ANALYSIS_PROMPT },
        ...imageBuffers.map((b) => ({
          inline_data: { mime_type: 'image/jpeg', data: b.toString('base64') },
        })),
      ];

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: { response_mime_type: 'application/json' },
          }),
        },
      );

      if (!res.ok) throw new Error(`Status ${res.status}: ${await res.text()}`);

      const data = (await res.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };

      const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return rawJson
        ? new VehicleScanResultEntity(
            JSON.parse(rawJson) as VehicleScanResultEntity,
          )
        : FALLBACK_SCAN_RESULT;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(
        `Gemini API failed (${msg}). Returning fallback result.`,
      );
      return FALLBACK_SCAN_RESULT;
    }
  }
}
