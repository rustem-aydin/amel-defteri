import {
  CalculationMethod,
  Coordinates,
  PrayerTimes,
  SunnahTimes,
} from "adhan";
import { addDays, isAfter } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { addHijriDays, gregorianToHijriString } from "@/helpers/hijriUtils";

// --- TİPLER ---
export type PrayerRefKeys =
  | "FAJR"
  | "SUNRISE"
  | "DHUHR"
  | "ASR"
  | "MAGHRIB"
  | "ISHA"
  | "MIDNIGHT"
  | "LAST_THIRD"
  | "ISHRAK"
  | "ISTIVA"
  | "ISFIRAR";

export type TimeRefs = Record<PrayerRefKeys, Date>;

export type IslamicTimeState = {
  now: Date;

  // Miladi Tarihler (Prayer times için)
  actualDate: Date;
  effectiveDate: Date;

  // 🌙 Hicri Tarihler (UI ve DB için)
  actualDateHijri: string; // "1446-08-14"
  effectiveDateHijri: string; // Akşam sonrası "1446-08-15"

  isPostMaghrib: boolean;
  refs: TimeRefs;
  nextDayFajr: Date;
};

export type AmelStatusResult = {
  status: "active" | "future" | "expired" | "loading" | "error";
  text: string;
  color: string;
  percent: number;
};

// --- YARDIMCI FONKSİYONLAR ---
const calculateRefData = (
  date: Date,
  coords: Coordinates,
): { times: PrayerTimes; sunnah: SunnahTimes } => {
  const params = CalculationMethod.Turkey();
  const times = new PrayerTimes(coords, date, params);
  const sunnah = new SunnahTimes(times);
  return { times, sunnah };
};

const formatDuration = (ms: number) => {
  if (ms < 0) return "0 dk";
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) return `${hours} sa ${mins} dk`;
  return `${mins} dk`;
};

// --- ANA HOOK ---
export const useTimeEngine = (
  coords: { latitude: number; longitude: number } | null,
): IslamicTimeState | null => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  return useMemo(() => {
    if (!coords) return null;

    const coordinates = new Coordinates(coords.latitude, coords.longitude);
    const { times: todayTimes, sunnah: todaySunnah } = calculateRefData(
      now,
      coordinates,
    );

    const isPostMaghrib = isAfter(now, todayTimes.maghrib);
    const effectiveDate = isPostMaghrib ? addDays(now, 1) : now;

    // 🌙 Hicri Tarihler
    const actualDateHijri = gregorianToHijriString(now);
    const effectiveDateHijri = isPostMaghrib
      ? addHijriDays(actualDateHijri, 1)
      : actualDateHijri;

    let refs: TimeRefs;
    let nextDayFajr: Date;

    if (!isPostMaghrib) {
      // GÜNDÜZ MODU
      const tomorrowTimes = calculateRefData(
        addDays(now, 1),
        coordinates,
      ).times;

      refs = {
        FAJR: todayTimes.fajr,
        SUNRISE: todayTimes.sunrise,
        DHUHR: todayTimes.dhuhr,
        ASR: todayTimes.asr,
        MAGHRIB: todayTimes.maghrib,
        ISHA: todayTimes.isha,
        MIDNIGHT: todaySunnah.middleOfTheNight,
        LAST_THIRD: todaySunnah.lastThirdOfTheNight,
        ISHRAK: new Date(todayTimes.sunrise.getTime() + 45 * 60000),
        ISTIVA: new Date(todayTimes.dhuhr.getTime() - 45 * 60000),
        ISFIRAR: new Date(todayTimes.maghrib.getTime() - 45 * 60000),
      };
      nextDayFajr = tomorrowTimes.fajr;
    } else {
      // GECE MODU (Hybrid)
      const tomorrowData = calculateRefData(addDays(now, 1), coordinates);
      const tomorrowTimes = tomorrowData.times;

      refs = {
        MAGHRIB: todayTimes.maghrib, // Bugünden
        ISHA: todayTimes.isha, // Bugünden
        MIDNIGHT: todaySunnah.middleOfTheNight, // Bugünden
        LAST_THIRD: todaySunnah.lastThirdOfTheNight, // Bugünden
        FAJR: tomorrowTimes.fajr, // Yarından
        SUNRISE: tomorrowTimes.sunrise,
        DHUHR: tomorrowTimes.dhuhr,
        ASR: tomorrowTimes.asr,
        ISHRAK: new Date(tomorrowTimes.sunrise.getTime() + 45 * 60000),
        ISTIVA: new Date(tomorrowTimes.dhuhr.getTime() - 45 * 60000),
        ISFIRAR: new Date(todayTimes.maghrib.getTime() - 45 * 60000),
      };

      const dayAfterData = calculateRefData(addDays(now, 2), coordinates);
      nextDayFajr = dayAfterData.times.fajr;
    }

    return {
      now,
      actualDate: now,
      effectiveDate,
      actualDateHijri,
      effectiveDateHijri,
      isPostMaghrib,
      refs,
      nextDayFajr,
    };
  }, [now, coords]);
};

// --- GÜVENLİ STATUS HESAPLAYICI ---
export const getAmelStatus = (
  engine: IslamicTimeState | null | undefined, // undefined desteği eklendi
  startRefKey?: string | null,
  endRefKey?: string | null,
): AmelStatusResult => {
  // 1. Engine Kontrolü
  if (!engine || !engine.refs || !engine.now) {
    return {
      status: "loading",
      text: "--:--",
      color: "#9CA3AF",
      percent: 0,
    };
  }

  const { now, refs } = engine;

  // 2. Vakit Referansı Yoksa (Örn: Tüm gün süren amel)
  if (!startRefKey || !endRefKey) {
    return {
      status: "active",
      text: "Tüm Gün",
      color: "#3B82F6",
      percent: 100,
    };
  }

  // 3. Anahtar Kontrolü (Type Guard)
  // Eğer veritabanında 'GECE_YARISI' yazıyor ama bizde 'MIDNIGHT' varsa patlamaması için
  const sKey = startRefKey as PrayerRefKeys;
  const eKey = endRefKey as PrayerRefKeys;

  const startRef = refs[sKey];
  const endRef = refs[eKey];

  // 4. Tarih Nesnesi Kontrolü (En kritik yer burası)
  if (
    !startRef ||
    !endRef ||
    !(startRef instanceof Date) ||
    !(endRef instanceof Date)
  ) {
    return {
      status: "error",
      text: "Vakit Yok", // Kullanıcıya 'Hata' yerine daha yumuşak mesaj
      color: "#EF4444",
      percent: 0,
    };
  }

  const nowMs = now.getTime();
  const startMs = startRef.getTime();
  const endMs = endRef.getTime();

  // 5. Durum Analizi
  if (nowMs < startMs) {
    return {
      status: "future",
      text: `${formatDuration(startMs - nowMs)} kaldı`,
      color: "#F59E0B",
      percent: 0,
    };
  }

  if (nowMs >= startMs && nowMs < endMs) {
    const totalDuration = endMs - startMs;
    const elapsed = nowMs - startMs;
    // Sıfıra bölünme hatasını engelle
    const percent =
      totalDuration > 0 ? Math.min(100, (elapsed / totalDuration) * 100) : 100;

    return {
      status: "active",
      text: `${formatDuration(endMs - nowMs)} kaldı`,
      color: "#10B981",
      percent,
    };
  }

  return {
    status: "expired",
    text: "Vakit Çıktı",
    color: "#EF4444",
    percent: 100,
  };
};
