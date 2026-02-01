import { Text } from "@/components/ui/text";
import { useLocationStore } from "@/store/useLocationStore";
import * as Location from "expo-location";
import { MapPin } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { MenuItem } from "./LeftSheetMenuItem";

const LeftSheetLocation = () => {
  const { coords, fetchLocation } = useLocationStore();
  const [locationName, setLocationName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resolveLocationName = async (latitude: number, longitude: number) => {
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const city = address.city || address.region || "";
        const country = address.country || "";

        const display = [city, country].filter(Boolean).join(", ");
        setLocationName(display || "Konum Belirlendi");
      }
    } catch (error) {
      console.error("Adres çözümlenemedi:", error);
      setLocationName("Konum Alınamadı");
    }
  };

  useEffect(() => {
    if (coords) {
      resolveLocationName(coords.latitude, coords.longitude);
    }
  }, [coords]);

  const handleUpdateLocation = async () => {
    setLoading(true);
    try {
      await fetchLocation();
    } catch (error) {
      console.error("Konum güncellenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text
        style={{
          color: "#64748b",
          fontSize: 11,
          fontWeight: "700",
          letterSpacing: 1.2,
          marginBottom: 10,
          marginLeft: 12,
          textTransform: "uppercase",
        }}
      >
        Konum Değiştir
      </Text>
      <View
        style={{
          gap: 10,
          marginBottom: 20,
        }}
      >
        <MenuItem
          icon={
            loading
              ? () => <ActivityIndicator size="small" color="#888" />
              : MapPin
          }
          title={coords ? locationName || "Konum aranıyor..." : "Konum Belirle"}
          onPress={handleUpdateLocation}
        />
      </View>
    </View>
  );
};

export default LeftSheetLocation;
