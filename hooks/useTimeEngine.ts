import {
  CalculationMethod,
  Coordinates,
  PrayerTimes,
  SunnahTimes,
} from "adhan";
import { useMemo } from "react";
import tzLookup from "tz-lookup";

// --- TİPLER ---

export type TimeRefs = {
  FAJR: Date;
  SUNRISE: Date;
  DHUHR: Date;
  ASR: Date;
  MAGHRIB: Date;
  ISHA: Date;
  ISHRAK: Date;
  ISTIVA: Date;
  ISFIRAR: Date;
  MIDNIGHT: Date;
  LAST_THIRD: Date;
  offset: number;
};

export type AmelStatusResult = {
  status:
    | "loading"
    | "all_day"
    | "not_started"
    | "active"
    | "expired"
    | "error";
  text: string;
  message: string;
  color: string;
};

const toTimeZone = (date: Date, timeZone: string) => {
  try {
    const options: Intl.DateTimeFormatOptions = {
      timeZone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    };

    const formatter = new Intl.DateTimeFormat("en-US", options);
    const parts = formatter.formatToParts(date);
    const getPart = (type: string) => {
      const part = parts.find((p) => p.type === type);
      return part ? parseInt(part.value, 10) : 0;
    };

    const shiftedTime = Date.UTC(
      getPart("year"),
      getPart("month") - 1,
      getPart("day"),
      getPart("hour"),
      getPart("minute"),
      getPart("second"),
    );
    return new Date(shiftedTime);
  } catch (error) {
    return date;
  }
};

const formatMs = (ms: number) => {
  if (ms < 0) ms = 0;
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

// --- HOOK ---
export const useTimeEngine = (coords: Coordinates | null | undefined) => {
  const references = useMemo(() => {
    if (!coords || !coords.latitude || !coords.longitude) return null;

    const coord = new Coordinates(coords.latitude, coords.longitude);
    const date = new Date();
    const params = CalculationMethod.Turkey();

    let timeZone;
    try {
      timeZone = tzLookup(coords.latitude, coords.longitude);
    } catch (e) {
      timeZone = "Europe/Istanbul";
    }

    const p = new PrayerTimes(coord, date, params);
    const s = new SunnahTimes(p);

    const nowSystem = new Date();
    const nowShifted = toTimeZone(nowSystem, timeZone);
    const offset = nowShifted.getTime() - nowSystem.getTime();

    return {
      FAJR: toTimeZone(p.fajr, timeZone),
      SUNRISE: toTimeZone(p.sunrise, timeZone),
      DHUHR: toTimeZone(p.dhuhr, timeZone),
      ASR: toTimeZone(p.asr, timeZone),
      MAGHRIB: toTimeZone(p.maghrib, timeZone),
      ISHA: toTimeZone(p.isha, timeZone),
      ISHRAK: toTimeZone(
        new Date(p.sunrise.getTime() + 45 * 60 * 1000),
        timeZone,
      ),
      ISTIVA: toTimeZone(
        new Date(p.dhuhr.getTime() - 45 * 60 * 1000),
        timeZone,
      ),
      ISFIRAR: toTimeZone(
        new Date(p.maghrib.getTime() - 45 * 60 * 1000),
        timeZone,
      ),
      MIDNIGHT: toTimeZone(s.middleOfTheNight, timeZone),
      LAST_THIRD: toTimeZone(s.lastThirdOfTheNight, timeZone),
      offset: offset,
    };
  }, [coords?.latitude, coords?.longitude]);

  return references;
};

// --- STATUS HESAPLAYICI ---
export const getAmelStatus = (
  references: TimeRefs | null,
  startRef: string | null | undefined,
  endRef: string | null | undefined,
): AmelStatusResult => {
  if (!references) {
    return {
      status: "loading",
      text: "--:--:--",
      message: "Yükleniyor",
      color: "#9CA3AF",
    };
  }

  const nowShifted = Date.now() + references.offset;

  if (!startRef || !endRef) {
    const endOfDay = new Date(nowShifted);
    endOfDay.setUTCHours(23, 59, 59, 999);

    return {
      status: "all_day",
      text: formatMs(endOfDay.getTime() - nowShifted),
      message: "Bitmesine:", // <-- BURASI GÜNCELLENDİ (Günün Bitimine -> Bitmesine)
      color: "#3B82F6",
    };
  }

  // TypeScript Düzeltmesi: as keyof TimeRefs
  const startDate = references[startRef as keyof TimeRefs];
  const endDate = references[endRef as keyof TimeRefs];

  if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
    return {
      status: "error",
      text: "Hata",
      message: "Veri Hatası",
      color: "#EF4444",
    };
  }

  const startMs = startDate.getTime();
  const endMs = endDate.getTime();

  if (nowShifted < startMs) {
    return {
      status: "not_started",
      text: formatMs(startMs - nowShifted),
      message: "Başlamasına:",
      color: "#F59E0B",
    };
  }
  if (nowShifted >= startMs && nowShifted < endMs) {
    return {
      status: "active",
      text: formatMs(endMs - nowShifted),
      message: "Bitmesine:",
      color: "#10B981",
    };
  }

  return {
    status: "expired",
    text: "Vakit Geçti",
    message: "",
    color: "#EF4444",
  };
};
