import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { usecalculateDeedTotalPoints } from "@/db/hooks/useAllQueries";
import React from "react";

export function DetailsStatistic({
  id,
  level,
  deedPoints,
  intentionPoints,
}: any) {
  const { data } = usecalculateDeedTotalPoints(Number(id));
  const stats = [
    { title: "Seviye", value: level },
    { title: "Amel Puanı", value: deedPoints },
    { title: "Niyet Puanı", value: intentionPoints },
    { title: "Kazanılan Puan", value: data },
  ];

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
      {stats.map((stat, index) => (
        <Card key={index} style={{ flex: 1, minWidth: 150 }}>
          <CardHeader>
            <CardTitle style={{ fontSize: 16 }}>{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 4 }}>
              {stat.value}
            </Text>
          </CardContent>
        </Card>
      ))}
    </View>
  );
}
