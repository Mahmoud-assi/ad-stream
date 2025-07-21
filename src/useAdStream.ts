// useAdStream.ts
import { useEffect, useState } from "react";
import fetchAds from "./fetchAds";

const useAdStream = (zoneIds: number[], key: string) => {
  const [ads, setAds] = useState<(string | null)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const results = await fetchAds(zoneIds, key);
      setAds(results);
      setLoading(false);
    };

    fetch();
  }, [zoneIds]);

  return { ads, loading };
};

export default useAdStream;
