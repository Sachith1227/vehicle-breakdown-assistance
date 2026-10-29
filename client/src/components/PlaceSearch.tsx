import { useState } from "react";

// =====================================================
// PLACE SEARCH (OpenStreetMap Nominatim, no API key)
// =====================================================

interface PlaceResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
}

interface PlaceSearchProps {
  onSelect: (latitude: number, longitude: number) => void;
}

export default function PlaceSearch({ onSelect }: PlaceSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState("");

  const search = async () => {
    if (query.trim().length < 2) return;

    setSearching(true);
    setMessage("");
    setResults([]);

    try {
      const url =
        "https://nominatim.openstreetmap.org/search?format=json&limit=5" +
        "&countrycodes=lk&q=" +
        encodeURIComponent(query.trim());

      const response = await fetch(url, {
        headers: { "Accept-Language": "en" },
      });

      const data: PlaceResult[] = await response.json();

      if (data.length === 0) {
        setMessage("No places found. Try a nearby town or road name.");
      }

      setResults(data);
    } catch (error) {
      console.error("Place search error:", error);
      setMessage("Search is unavailable right now. Drag the pin instead.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex gap-2">
        <input
          type="search"
          value={query}
          placeholder="Search a town, road or landmark..."
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              search();
            }
          }}
          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
        />

        <button
          type="button"
          onClick={search}
          disabled={searching}
          className="shrink-0 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
        >
          {searching ? "Searching..." : "Search"}
        </button>
      </div>

      {message && (
        <p className="mt-2 text-xs text-slate-500">{message}</p>
      )}

      {results.length > 0 && (
        <ul className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {results.map((place) => (
            <li key={place.place_id}>
              <button
                type="button"
                onClick={() => {
                  onSelect(Number(place.lat), Number(place.lon));
                  setResults([]);
                  setQuery(place.display_name.split(",")[0]);
                }}
                className="w-full border-b border-slate-100 px-4 py-3 text-left text-sm text-slate-700 transition last:border-0 hover:bg-blue-50"
              >
                📍 {place.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
