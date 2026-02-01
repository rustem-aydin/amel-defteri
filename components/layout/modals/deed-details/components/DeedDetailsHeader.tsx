import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";
import { getDeedHeaderImage } from "../helpers/getDeedHeaderImage";

interface HeaderProps {
  title: string;
  color: string;
  type: string;
  categoryName: string;
  description: string;
  periodTitle: string;
}

const DeedDetailsHeader = ({
  description,
  color,
  title,
  periodTitle,
  categoryName,
  type,
}: HeaderProps) => {
  const imageSource = getDeedHeaderImage(type);
  return (
    <View style={{ position: "relative", width: "100%", height: "100%" }}>
      <Image
        source={imageSource}
        style={{ width: "100%", height: "100%" }}
        contentFit="cover"
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.7)"]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "60%",
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: 10,
          left: 20,
          right: 20,
        }}
      >
        <View
          style={{
            backgroundColor: color,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
            alignSelf: "flex-start",
            marginBottom: 2,
          }}
        >
          <Text style={{ color: "white", fontSize: 12, fontWeight: "600" }}>
            {type}
          </Text>
        </View>
        <Text
          style={{
            color: "white",
            fontSize: 24,
            fontWeight: "bold",
            lineHeight: 32,
            textShadowColor: "rgba(0,0,0,0.5)",
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            color: "#e0e0e0",
            fontSize: 14,
            marginTop: 2,
            textShadowColor: "rgba(0,0,0,0.5)",
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
          }}
        >
          {description} • {periodTitle} • {categoryName}
        </Text>
      </View>
    </View>
  );
};

export default DeedDetailsHeader;
