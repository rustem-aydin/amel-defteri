import { and, eq, isNull } from "drizzle-orm";
import { db } from "../client";
import { userDeeds } from "../schema";

export const addToUserDeeds = async (deedId: number) => {
  const today = new Date().toISOString().split("T")[0];

  await db
    .insert(userDeeds)
    .values({
      deedId,
      addedAt: today,
      targetCount: 1,
      removedAt: null,
    })
    .onConflictDoUpdate({
      target: userDeeds.deedId,
      set: {
        removedAt: null,
        addedAt: today,
      },
    });
};
export const removeFromUserDeeds = async (deedId: number) => {
  const today = new Date().toISOString().split("T")[0];

  return await db
    .update(userDeeds)
    .set({ removedAt: today })
    .where(and(eq(userDeeds.deedId, deedId), isNull(userDeeds.removedAt)));
};
