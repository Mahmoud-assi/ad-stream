// fetchAds.ts
import CryptoJS from "crypto-js";

export default async function fetchAds(
  zoneIds: number[],
  key: string
): Promise<(string | null)[]> {
  return await Promise.all(
    zoneIds.map(async (zoneId) => {
      try {
        const timestamp = Math.floor(Date.now() / 1000);
        const message = `timestamp=${timestamp}`;
        const signature = CryptoJS.HmacSHA256(message, key).toString(
          CryptoJS.enc.Hex
        );
        const res = await fetch(
          `https://addstream.net/www/delivery/afr.php?zoneid=${zoneId}&cb=${Math.floor(
            Math.random() * 999999
          )}`,
          {
            method: "GET",
            headers: {
              signature: signature,
              timestamp: String(timestamp),
            },
          }
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
}
