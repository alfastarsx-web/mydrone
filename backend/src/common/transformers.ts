import { ValueTransformer } from 'typeorm';

/** bigint ustunlari TypeORM'da string bo'lib qaytadi — raqamga o'giramiz.
 *  Narxlar so'mda, butun son sifatida saqlanadi (tiyin yo'q). */
export const bigintToNumber: ValueTransformer = {
  // undefined bo'lsa null emas, undefined qaytaramiz — shunda ustunning
  // DEFAULT qiymati ishlaydi (aks holda NOT NULL cheklovi buziladi)
  to: (v?: number | null) => (v === undefined || v === null ? undefined : v),
  from: (v?: string | null) => (v === null || v === undefined ? null : Number(v))
};

/** numeric(3,2) — reyting uchun */
export const numericToNumber: ValueTransformer = {
  to: (v?: number | null) => (v === undefined || v === null ? undefined : v),
  from: (v?: string | null) => (v === null || v === undefined ? null : Number(v))
};
