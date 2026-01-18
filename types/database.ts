export interface Kaynak {
  id: number;
  tur: "AYET" | "HADIS" | "DIGER";
  metin: string;
  kaynak_bilgisi: string;
}

export interface AmelBase {
  id: number;
  baslik: string;
  aciklama: string;
  fazilet_metni: string;
  puan_niyet: number;
  puan_amel: number;
  renk_kodu: string;
  durum_ad: string;
  kategori_ad: string;
  ikon_url: string;
}

export interface AmelDetail extends AmelBase {
  kaynaklar: Kaynak[];
}
