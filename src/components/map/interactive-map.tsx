"use client";

import { useEffect, useState } from "react";
import { MapContainer, ImageOverlay, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { POI_ICONS } from "@/lib/constants";
import type { PointOfInterest } from "@/types/karte";
import "leaflet/dist/leaflet.css";

interface InteractiveMapProps {
  minimapUrl?: string | null;
  pois: PointOfInterest[];
  className?: string;
}

// Lucide SVG paths für POI-Icons
const ICON_SVGS: Record<string, string> = {
  hof: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  verkaufsstelle: '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/>',
  produktion: '<path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/>',
  tankstelle: '<line x1="3" x2="15" y1="22" y2="22"/><line x1="4" x2="14" y1="9" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/>',
  werkstatt: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  haendler: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  sonstiges: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
};

function createPOIIcon(typ: string) {
  const config = POI_ICONS[typ] || POI_ICONS.sonstiges;
  const svgPath = ICON_SVGS[typ] || ICON_SVGS.sonstiges;

  return L.divIcon({
    className: "",
    html: `<div style="
      width: 32px; height: 32px; border-radius: 50%;
      background: white; border: 2px solid ${config.color};
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="${config.color}" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        ${svgPath}
      </svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
  });
}

function MapBounds() {
  const map = useMap();
  useEffect(() => {
    map.fitBounds([[0, 0], [100, 100]]);
  }, [map]);
  return null;
}

export function InteractiveMap({ minimapUrl, pois, className }: InteractiveMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`bg-green-50 rounded-xl animate-pulse ${className || "h-[400px]"}`} />
    );
  }

  const bounds: L.LatLngBoundsExpression = [[0, 0], [100, 100]];

  return (
    <div className={className || "h-[400px]"}>
      <MapContainer
        crs={L.CRS.Simple}
        bounds={bounds}
        maxBounds={[[-10, -10], [110, 110]]}
        maxBoundsViscosity={0.8}
        style={{ height: "100%", width: "100%", borderRadius: "0.75rem" }}
        zoomControl={true}
        minZoom={1}
        maxZoom={5}
      >
        <MapBounds />

        {minimapUrl ? (
          <ImageOverlay url={minimapUrl} bounds={bounds} />
        ) : (
          <ImageOverlay
            url="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512'%3E%3Crect fill='%23e8f0e0' width='512' height='512'/%3E%3Ctext x='256' y='256' text-anchor='middle' fill='%23a3c288' font-size='16'%3EKeine Minimap%3C/text%3E%3C/svg%3E"
            bounds={bounds}
          />
        )}

        {pois.map((poi) => (
          <Marker
            key={poi.id}
            position={[100 - poi.y, poi.x]}
            icon={createPOIIcon(poi.typ)}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold text-green-900">{poi.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {POI_ICONS[poi.typ]?.label || "Sonstiges"}
                </p>
                {poi.beschreibung && (
                  <p className="text-gray-400 text-xs mt-1">{poi.beschreibung}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
