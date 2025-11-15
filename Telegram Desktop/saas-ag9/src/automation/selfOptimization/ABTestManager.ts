import { logger } from '../core/Logger';

export type Variant = 'A' | 'B';

export interface ABConfig {
  key: string;
  weights: Record<Variant, number>; // sum to 1
}

const DEFAULT_CONFIG: ABConfig = { key: 'landing_final_cta', weights: { A: 0.5, B: 0.5 } };

export class ABTestManager {
  constructor(private config: ABConfig = DEFAULT_CONFIG) {}

  chooseVariant(): Variant {
    const stored = localStorage.getItem(this.config.key) as Variant | null;
    if (stored === 'A' || stored === 'B') return stored;
    const r = Math.random();
    const variant = r < this.config.weights.A ? 'A' : 'B';
    localStorage.setItem(this.config.key, variant);
    logger.info('AB variant chosen', { key: this.config.key, variant });
    return variant;
  }

  ctaTextFor(variant: Variant): string {
    return variant === 'A' ? 'ทดลองใช้ฟรี 7 วัน' : 'เริ่มเลย – ฟรี 7 วัน';
  }
}