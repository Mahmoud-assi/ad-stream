// useAdStream.ts
import { useEffect, useState } from "react";
import fetchAds from "./fetchAds";

const useAdStream = (zoneIds: number[]) => {
  const [ads, setAds] = useState<(string | null)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const results = await fetchAds(zoneIds, process.env.ADSTREAM_SECRET_KEY!);
      setAds(results);
      setLoading(false);
    };

    fetch();
  }, [zoneIds]);

  return { ads, loading };
};

export default useAdStream;
