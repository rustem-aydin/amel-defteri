import { Text } from "@/components/ui/text";
import { useColors } from "@/theme/useColors";
import React from "react";
import { View } from "react-native";
const getColor = (type: string) => {
  const { surahResources, hadithResources, othersResources } = useColors();

  if (type === "AYET") {
    return surahResources;
  }
  if (type === "HADİS" || type === "HADIS") {
    return hadithResources;
  } else {
    return othersResources;
  }
};
const DeedStatusCards = ({ resources }: { resources: any[] }) => {
  return (
    <View>
      {resources?.map((item: any) => (
        <View
          key={item?.id}
          style={{
            padding: 16,
            borderRadius: 8,
            borderLeftWidth: 4,
            borderLeftColor: getColor(item?.type),
            marginBottom: 16,
          }}
        >
          {/* Note: If you want to use data from 'item', access it here. 
              Currently, it is still showing hardcoded text. */}
          <Text style={{ fontSize: 16, lineHeight: 24, fontStyle: "italic" }}>
            {item?.content}
          </Text>
          <Text
            style={{
              fontSize: 16,
              marginTop: 4,
              lineHeight: 24,
              textAlign: "right",
              fontStyle: "italic",
            }}
          >
            - {item?.sourceInfo}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default DeedStatusCards;
