import { checkForUpdates, syncAllData } from "@/services/syncService";
import { useSyncStore } from "@/store/useSyncStore";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useUpdateManager = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  const queryClient = useQueryClient();
  const bumpVersion = useSyncStore((s) => s.bumpVersion);
  const setIsSyncing = useSyncStore((s) => s.setIsSyncing);
  const isSyncing = useSyncStore((s) => s.isSyncing);

  useEffect(() => {
    const check = async () => {
      const hasUpdate = await checkForUpdates();
      if (hasUpdate) setIsUpdateAvailable(true);
    };
    check();
  }, []);

  const triggerSync = async () => {
    setIsSyncing(true);

    try {
      const res = await syncAllData();
      console.log("✅ syncAllData tamamlandı:", res?.status);

      if (res?.status === "SUCCESS") {
        await new Promise((resolve) => setTimeout(resolve, 500));

        console.log("🔥 Version artırılıyor...");

        bumpVersion();

        await new Promise((resolve) => setTimeout(resolve, 100));

        console.log("🔥 Queries invalidate ediliyor...");

        await queryClient.invalidateQueries({
          queryKey: ["deeds"],
        });

        await queryClient.refetchQueries({
          queryKey: ["deeds"],
          type: "active",
        });

        console.log("✅ Güncelleme tamamlandı");
        setIsUpdateAvailable(false);
      }
    } catch (e) {
      console.error("❌ Sync hatası:", e);
    } finally {
      setIsSyncing(false);
    }
  };

  return { isUpdateAvailable, isSyncing, triggerSync };
};
