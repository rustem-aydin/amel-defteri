import {
  CalculationMethod,
  Coordinates,
  PrayerTimes,
  SunnahTimes,
} from "adhan";
import React, { Component } from "react";
import { Alert, StyleSheet } from "react-native";
import {
  CalendarProvider,
  ExpandableCalendar,
  TimelineEventProps,
  TimelineList,
  TimelineProps,
} from "react-native-calendars";

type TimeRefTypes = {
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
};

interface LogData {
  logId?: number;
  addedAt: string;
  title: string;
  description?: string;
  statusColor?: string;
  startRef?: string;
  endRef?: string;
  [key: string]: any;
}

// --- YARDIMCI FONKSİYONLAR (Lodash yerine) ---

// Kendi groupBy fonksiyonumuz
const groupEventsByDate = (events: TimelineEventProps[]) => {
  return events.reduce(
    (groups, event) => {
      const date = event.start.split(" ")[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
      return groups;
    },
    {} as { [key: string]: TimelineEventProps[] },
  );
};

const MY_COORDS = { latitude: 41.0082, longitude: 28.9784 };
const INITIAL_TIME = { hour: 5, minutes: 0 };

const RAW_LOGS: LogData[] = [
  {
    addedAt: "2026-01-21",
    categoryIcon: "...",
    categoryName: "Namaz",
    deedId: 1,
    deedPoints: 40,
    description: "Günün ilk nuru ve bereketi.",
    earnedPoints: 0,
    endRef: "SUNRISE",
    intentionPoints: 10,
    isCompleted: 0,
    isIntended: 0,
    logId: 128,
    periodCode: null,
    startRef: "FAJR",
    statusColor: "#EF4444",
    statusName: "FARZ",
    targetCount: 1,
    title: "Sabah Namazı",
    userDeedId: 1,
    virtueText: "Sabah namazını kılan Allah'ın himayesindedir.",
  },
  {
    addedAt: "2026-01-20",
    categoryIcon: "...",
    categoryName: "Kur'an",
    deedId: 2,
    deedPoints: 30,
    description: "Günlük en az 3 sayfa tilavet.",
    earnedPoints: 0,
    endRef: "",
    intentionPoints: 10,
    isCompleted: 0,
    isIntended: 0,
    logId: 129,
    periodCode: null,
    startRef: "",
    statusColor: "#ffb703",
    statusName: "SÜNNET",
    targetCount: 1,
    title: "Kur'an Okumak",
    userDeedId: 3,
    virtueText: "Kur'an okuyun...",
  },
  {
    addedAt: "2026-01-18",
    categoryIcon: "...",
    categoryName: "Zikir",
    deedId: 7,
    deedPoints: 10000,
    description: "Günde 100 salavat",
    earnedPoints: 0,
    endRef: "",
    intentionPoints: 100,
    isCompleted: 0,
    isIntended: 0,
    logId: 130,
    periodCode: null,
    startRef: "",
    statusColor: "#3B82F6",
    statusName: "NAFİLE",
    targetCount: 1,
    title: "100 Salavat",
    userDeedId: 4,
    virtueText: "Günde 100 salavat",
  },
  {
    addedAt: "2026-01-18",
    categoryIcon: "...",
    categoryName: "Namaz",
    deedId: 5,
    deedPoints: 150,
    description: "Gecenin en kıymetli vaktinde.",
    earnedPoints: null,
    endRef: "FAJR",
    intentionPoints: 20,
    isCompleted: null,
    isIntended: null,
    periodCode: null,
    startRef: "LAST_THIRD",
    statusColor: "#ffb703",
    statusName: "SÜNNET",
    targetCount: 1,
    title: "Teheccüd Namazı",
    userDeedId: 5,
    virtueText: "Farzlardan sonra...",
  },
  {
    addedAt: "2026-01-20",
    categoryIcon: "...",
    categoryName: "Namaz",
    deedId: 3,
    deedPoints: 60,
    description: "Güneş doğup kerahat çıktıktan sonra.",
    earnedPoints: 0,
    endRef: "ISHRAK",
    intentionPoints: 10,
    isCompleted: 0,
    isIntended: 0,
    logId: 132,
    periodCode: null,
    startRef: "SUNRISE",
    statusColor: "#ffb703",
    statusName: "SÜNNET",
    targetCount: 1,
    title: "İşrak Namazı",
    userDeedId: 6,
    virtueText: "Kim sabah namazını...",
  },
  {
    addedAt: "2026-01-20",
    categoryIcon: "...",
    categoryName: "Genel",
    deedId: 4,
    deedPoints: 80,
    description: "Sağ elin verdiğini sol el görmesin.",
    earnedPoints: 0,
    endRef: "",
    intentionPoints: 20,
    isCompleted: 0,
    isIntended: 0,
    logId: 131,
    periodCode: null,
    startRef: "",
    statusColor: "#A855F7",
    statusName: "VACİP",
    targetCount: 1,
    title: "Gizli Sadaka",
    userDeedId: 7,
    virtueText: "Gizli sadaka...",
  },
];

const calculateDayTimes = (
  dateString: string,
  coords: { latitude: number; longitude: number },
): TimeRefTypes => {
  const dateObj = new Date(dateString);
  const coord = new Coordinates(coords.latitude, coords.longitude);
  const params = CalculationMethod.Turkey();

  const p = new PrayerTimes(coord, dateObj, params);
  const s = new SunnahTimes(p);

  return {
    FAJR: p.fajr,
    SUNRISE: p.sunrise,
    DHUHR: p.dhuhr,
    ASR: p.asr,
    MAGHRIB: p.maghrib,
    ISHA: p.isha,
    ISHRAK: new Date(p.sunrise.getTime() + 45 * 60 * 1000),
    ISTIVA: new Date(p.dhuhr.getTime() - 45 * 60 * 1000),
    ISFIRAR: new Date(p.maghrib.getTime() - 45 * 60 * 1000),
    MIDNIGHT: s.middleOfTheNight,
    LAST_THIRD: s.lastThirdOfTheNight,
  };
};

const formatDateForTimeline = (date: Date) => {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const processEvents = (
  logs: LogData[],
  coords: { latitude: number; longitude: number },
) => {
  const events: TimelineEventProps[] = [];

  logs.forEach((log) => {
    const dateStr = log.addedAt;
    const times = calculateDayTimes(dateStr, coords);

    let startStr = "";
    let endStr = "";

    if (log.startRef && log.endRef) {
      const startKey = log.startRef as keyof TimeRefTypes;
      const endKey = log.endRef as keyof TimeRefTypes;

      if (times[startKey] && times[endKey]) {
        startStr = formatDateForTimeline(times[startKey]);
        endStr = formatDateForTimeline(times[endKey]);
      }
    }

    if (!startStr || !endStr) {
      startStr = `${dateStr} 09:00:00`;
      endStr = `${dateStr} 10:00:00`;
    }

    events.push({
      id: log.logId ? log.logId.toString() : `temp_${Math.random()}`,
      start: startStr,
      end: endStr,
      title: log.title,
      summary: log.description,
      color: log.statusColor || "#333",
      // @ts-ignore
      rawLog: log,
    });
  });

  return events;
};

export default class TimelineCalendarScreen extends Component {
  state = {
    currentDate: "2026-01-21",
    eventsByDate: {} as { [key: string]: TimelineEventProps[] },
  };

  componentDidMount() {
    this.loadEvents();
  }

  loadEvents = () => {
    const processedEvents = processEvents(RAW_LOGS, MY_COORDS);

    // Lodash 'groupBy' yerine kendi yazdığımız fonksiyonu kullanıyoruz
    const grouped = groupEventsByDate(processedEvents);

    this.setState({
      eventsByDate: grouped,
    });
  };

  marked = {
    "2026-01-18": { marked: true },
    "2026-01-20": { marked: true },
    "2026-01-21": { marked: true },
  };

  onDateChanged = (date: string, source: string) => {
    this.setState({ currentDate: date });
  };

  onMonthChange = (month: any, updateSource: any) => {
    console.log("Month changed", month);
  };

  createNewEvent: TimelineProps["onBackgroundLongPress"] = (
    timeString,
    timeObject,
  ) => {
    const { eventsByDate } = this.state;
    const hourString = `${(timeObject.hour + 1).toString().padStart(2, "0")}`;
    const minutesString = `${timeObject.minutes.toString().padStart(2, "0")}`;

    const newEvent = {
      id: "draft",
      start: `${timeString}`,
      end: `${timeObject.date} ${hourString}:${minutesString}:00`,
      title: "Yeni Amel",
      color: "white",
    };

    if (timeObject.date) {
      if (eventsByDate[timeObject.date]) {
        eventsByDate[timeObject.date] = [
          ...eventsByDate[timeObject.date],
          newEvent,
        ];
        this.setState({ eventsByDate });
      } else {
        eventsByDate[timeObject.date] = [newEvent];
        this.setState({ eventsByDate: { ...eventsByDate } });
      }
    }
  };

  approveNewEvent: TimelineProps["onBackgroundLongPressOut"] = (
    _timeString,
    timeObject,
  ) => {
    const { eventsByDate } = this.state;

    Alert.prompt("Yeni Amel", "Amel başlığını giriniz", [
      {
        text: "İptal",
        onPress: () => {
          if (timeObject.date) {
            // Lodash filter yerine native JS filter
            eventsByDate[timeObject.date] = eventsByDate[
              timeObject.date
            ].filter((e) => e.id !== "draft");
            this.setState({ eventsByDate });
          }
        },
      },
      {
        text: "Oluştur",
        onPress: (eventTitle: any) => {
          if (timeObject.date) {
            // Lodash find yerine native JS find
            const draftEvent = eventsByDate[timeObject.date].find(
              (e) => e.id === "draft",
            );
            if (draftEvent) {
              draftEvent.id = undefined;
              draftEvent.title = eventTitle ?? "Yeni Amel";
              draftEvent.color = "lightgreen";
              // Array referansını yeniliyoruz ki re-render olsun
              eventsByDate[timeObject.date] = [
                ...eventsByDate[timeObject.date],
              ];
              this.setState({ eventsByDate });
            }
          }
        },
      },
    ]);
  };

  private timelineProps: Partial<TimelineProps> = {
    format24h: true,
    onBackgroundLongPress: this.createNewEvent,
    onBackgroundLongPressOut: this.approveNewEvent,
    unavailableHours: [
      { start: 0, end: 4 },
      { start: 23, end: 24 },
    ],
    overlapEventsSpacing: 8,
    rightEdgeSpacing: 24,
  };

  render() {
    const { currentDate, eventsByDate } = this.state;

    return (
      <CalendarProvider
        date={currentDate}
        onDateChanged={this.onDateChanged}
        onMonthChange={this.onMonthChange}
        showTodayButton
        disabledOpacity={0.6}
      >
        <ExpandableCalendar
          firstDay={1}
          markedDates={this.marked}
          leftArrowImageSource={require("../assets/images/next.svg")}
          rightArrowImageSource={require("../assets/images/next.svg")}
        />
        <TimelineList
          events={eventsByDate}
          timelineProps={this.timelineProps}
          showNowIndicator
          scrollToFirst
          initialTime={INITIAL_TIME}
        />
      </CalendarProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
