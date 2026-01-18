// types/deed.ts (veya hooks/useDeeds.ts'nin başına)
export interface Deed {
  id: number;
  baslik: string;
  aciklama?: string;
  ikon_url?: string;
  renk_kodu?: string;
  durum_id?: number;
  durum_ad?: string;
  kategori_id?: number;
  kategori_ad?: string;
  donem_id?: number;
  donem_kodu?: string;
  start_ref?: string;
  end_ref?: string;
  is_added?: number | boolean;
  [key: string]: any;
}

export class Coordinates {
  latitude: number;
  longitude: number;

  constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }
}

export interface LocationState {
  coords: Coordinates | null;
  loading: boolean;
  error: string | null;
  fetchLocation: () => Promise<void>;
}
