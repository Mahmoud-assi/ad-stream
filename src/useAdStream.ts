// useAdStream.ts
import { useEffect, useState } from "react";
import fetchAds from "./fetchAds";

const useAdStream = (zoneIds: number[], key: string) => {
  const [ads, setAds] = useState<(string | null)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!key || !Array.isArray(zoneIds) || zoneIds.length === 0) return;
    const fetch = async () => {
      setLoading(true);
      const results = await fetchAds(zoneIds, key);
      setAds(results);
      setLoading(false);
    };

    fetch();
  }, [zoneIds, key]);

  return { ads, loading };
};

export default useAdStream;
