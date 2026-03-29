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

function createPOIIcon(typ: string) {
  const config = POI_ICONS[typ] || POI_ICONS.sonstiges;
  return L.divIcon({
    className: "custom-poi-marker",
    html: `<div style="
      width: 24px; height: 24px; border-radius: 50%;
      background: ${config.color}; border: 2px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      display: flex; align-items: center; justify-content: center;
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -16],
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
      <div className={`bg-zinc-800 rounded-xl animate-pulse ${className || "h-[400px]"}`} />
    );
  }

  const bounds: L.LatLngBoundsExpression = [[0, 0], [100, 100]];

  return (
    <div className={className || "h-[400px]"}>
      <MapContainer
        crs={L.CRS.Simple}
        bounds={bounds}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        style={{ height: "100%", width: "100%", borderRadius: "0.75rem" }}
        zoomControl={true}
        minZoom={1}
        maxZoom={4}
      >
        <MapBounds />

        {minimapUrl ? (
          <ImageOverlay url={minimapUrl} bounds={bounds} />
        ) : (
          <ImageOverlay
            url="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1024' height='1024'%3E%3Crect fill='%231a3a1a' width='1024' height='1024'/%3E%3Crect fill='%23234d23' x='100' y='100' width='200' height='300' rx='4'/%3E%3Crect fill='%23c4a44a' x='400' y='200' width='250' height='200' rx='4'/%3E%3Crect fill='%23234d23' x='700' y='400' width='200' height='250' rx='4'/%3E%3Crect fill='%232d5a2d' x='150' y='500' width='300' height='200' rx='4'/%3E%3Crect fill='%23c4a44a' x='550' y='100' width='180' height='250' rx='4'/%3E%3Crect fill='%232d5a2d' x='500' y='600' width='250' height='300' rx='4'/%3E%3Cpath d='M50,50 L150,50 L150,80 L350,80 L350,50 L950,50 L950,120 L800,120 L800,350 L950,350 L950,950 L50,950 Z' fill='none' stroke='%23555' stroke-width='3'/%3E%3C/svg%3E"
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
                <p className="font-semibold">{poi.name}</p>
                <p className="text-zinc-400 text-xs mt-0.5">
                  {POI_ICONS[poi.typ]?.label || "Sonstiges"}
                </p>
                {poi.beschreibung && (
                  <p className="text-zinc-500 text-xs mt-1">{poi.beschreibung}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
