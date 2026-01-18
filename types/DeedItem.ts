export interface DeedItem {
  id: number;
  baslik: string;
  aciklama: string;
  puan_amel: number;
  puan_niyet: number; // Bunu da ekleyelim, detayda lazım olacak
  durum_id: number; // <--- Eklendi
  kategori_id: number; // <--- Eklendi
  durum_ad: string;
  renk_kodu: string;
  kategori_ad: string;
  end_ref: string;
  start_ref: string;
  donem_kodu?: string;
  ikon_url: string;
  is_added?: boolean;
}
