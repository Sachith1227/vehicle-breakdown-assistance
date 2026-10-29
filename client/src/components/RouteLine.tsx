import { useEffect, useState } from "react";
import { Polyline, useMap } from "react-leaflet";
import L from "leaflet";

// =====================================================
// DRIVING ROUTE (OSRM public demo server, no API key)
// =====================================================

export interface RouteSummary {
  distanceKm: number;
  durationMin: number;
}

interface RouteLineProps {
  from: [number, number];
  to: [number, number];
  onRoute?: (summary: RouteSummary | null) => void;
}

export default function RouteLine({ from, to, onRoute }: RouteLineProps) {
  const map = useMap();
  const [path, setPath] = useState<[number, number][]>([]);

  const [fromLat, fromLng] = from;
  const [toLat, toLng] = to;

  useEffect(() => {
    const controller = new AbortController();

    // OSRM expects longitude,latitude
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${fromLng},${fromLat};${toLng},${toLat}` +
      `?overview=full&geometries=geojson`;

    fetch(url, { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => {
        const route = data.routes?.[0];

        if (!route) {
          setPath([]);
          onRoute?.(null);
          return;
        }

        const points: [number, number][] = route.geometry.coordinates.map(
          ([lng, lat]: [number, number]) => [lat, lng]
        );

        setPath(points);

        map.fitBounds(L.latLngBounds(points), { padding: [40, 40] });

        onRoute?.({
          distanceKm: route.distance / 1000,
          durationMin: route.duration / 60,
        });
      })
      .catch((error) => {
        if (error.name === "AbortError") return;

        console.error("Route error:", error);
        setPath([]);
        onRoute?.(null);
      });

    return () => controller.abort();

    // onRoute is a callback prop; re-fetch only when the points change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromLat, fromLng, toLat, toLng, map]);

  if (path.length === 0) return null;

  return (
    <Polyline
      positions={path}
      pathOptions={{ color: "#2563eb", weight: 6, opacity: 0.85 }}
    />
  );
}
