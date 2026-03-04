import { and, eq, isNull } from "drizzle-orm";
import { db } from "../client";
import { dailyLogs, userDeeds } from "../schema";
import { getCurrentHijriDate, hijriToGregorianString } from "@/helpers/hijriUtils";

export const addToUserDeeds = async (deedId: number) => {
  const todayHijri = getCurrentHijriDate();
  const todayGregorian = hijriToGregorianString(todayHijri);

  await db
    .insert(userDeeds)
    .values({
      deedId,
      addedAtHijri: todayHijri,
      addedAtGregorian: todayGregorian,
      targetCount: 1,
      removedAtHijri: null,
      removedAtGregorian: null,
    })
    .onConflictDoUpdate({
      target: userDeeds.deedId,
      set: {
        removedAtHijri: null,
        removedAtGregorian: null,
        addedAtHijri: todayHijri,
        addedAtGregorian: todayGregorian,
      },
    });
};

export const removeFromUserDeeds = async (deedId: number) => {
  const todayHijri = getCurrentHijriDate();
  const todayGregorian = hijriToGregorianString(todayHijri);

  return await db
    .update(userDeeds)
    .set({
      removedAtHijri: todayHijri,
      removedAtGregorian: todayGregorian,
    })
    .where(and(eq(userDeeds.deedId, deedId), isNull(userDeeds.removedAtHijri)));
};

export const toggleDeedCompletion = async (
  deedId: number,
  hijriDate: string,
  isCompleted: boolean,
  points: number = 0,
) => {
  console.log(`💾 [DB WRITE START] Deed: ${deedId}, Date: '${hijriDate}', Completed: ${isCompleted}, Points: ${points}`);
  const gregorianDate = hijriToGregorianString(hijriDate);

  if (isCompleted) {
    // Mark as completed
    await db
      .insert(dailyLogs)
      .values({
        deedId,
        dateHijri: hijriDate,
        dateGregorian: gregorianDate,
        isCompleted: 1,
        earnedPoints: points,
      })
      .onConflictDoUpdate({
        target: [dailyLogs.deedId, dailyLogs.dateHijri],
        set: {
          isCompleted: 1,
          earnedPoints: points,
        },
      });
  } else {
    // Unmark
    await db
      .delete(dailyLogs)
      .where(
        and(
          eq(dailyLogs.deedId, deedId),
          eq(dailyLogs.dateHijri, hijriDate)
        )
      );
  }
};
