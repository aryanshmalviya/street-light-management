"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import type { Asset, Telemetry } from "@/types/data";

const getMarkerColor = (state?: Telemetry["state"]) => {
  if (state === "FAULT") return "#ff5a3d";
  if (state === "DIMMED") return "#f4a340";
  if (state === "ON") return "#4cd3a9";
  return "#9aa6b2";
};

type MapPanelProps = {
  assets: Asset[];
  telemetry: Telemetry[];
  selectedPoleId?: string | null;
  onSelectPole: (poleId: string) => void;
};

export default function MapPanel({
  assets,
  telemetry,
  selectedPoleId,
  onSelectPole,
}: MapPanelProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.CircleMarker>>({});

  const telemetryByPole = useMemo(
    () => new Map(telemetry.map((item) => [item.poleId, item])),
    [telemetry]
  );

  const center = assets[0]?.gps ?? { lat: 28.6139, lng: 77.209 };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView([center.lat, center.lng], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    mapInstanceRef.current = map;
  }, [center.lat, center.lng]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.setView([center.lat, center.lng], map.getZoom());

    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    assets.forEach((asset) => {
      const status = telemetryByPole.get(asset.poleId);
      const isSelected = asset.poleId === selectedPoleId;
      const marker = L.circleMarker([asset.gps.lat, asset.gps.lng], {
        radius: isSelected ? 8 : 6,
        color: "#0f172a",
        weight: 2,
        fillColor: getMarkerColor(status?.state),
        fillOpacity: 1,
      });

      marker.on("click", () => onSelectPole(asset.poleId));
      marker.addTo(map);
      markersRef.current[asset.poleId] = marker;
    });
  }, [assets, center.lat, center.lng, onSelectPole, selectedPoleId, telemetryByPole]);

  return (
    <div className="map-wrapper">
      <div ref={mapRef} className="map-canvas" />
    </div>
  );
}
