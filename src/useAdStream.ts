// hooks/useAdStream.ts
import { useEffect, useState } from "react";

const useAdStream = (zoneIds: number[]) => {
  const [ads, setAds] = useState<(string | null)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      const results = await Promise.all(
        zoneIds.map(async (zoneId) => {
          try {
            const res = await fetch(
              `https://addstream.net/www/delivery/afr.php?zoneid=${zoneId}&cb=${Math.floor(
                Math.random() * 999999
              )}`
            );
            const data = await res.text();
            return `
              <html>
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                  <style>
                    body { margin: 0; padding: 0; overflow: hidden; }
                    img { width: 100%; height: 100%; object-fit: fill; }
                  </style>
                </head>
                <body>${data}</body>
              </html>
            `;
          } catch (e) {
            console.error("Ad fetch error for zone:", zoneId, e);
            return null;
          }
        })
      );
      setAds(results);
      setLoading(false);
    };

    fetchAds();
  }, [zoneIds]);

  return { ads, loading };
};

export default useAdStream;
