"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import type { Asset, Telemetry, Zone } from "@/types/data";

const getMarkerColor = (state?: Telemetry["state"]) => {
  if (state === "FAULT") return "#ff5a3d";
  if (state === "DIMMED") return "#f4a340";
  if (state === "ON") return "#4cd3a9";
  return "#9aa6b2";
};

type MapPanelProps = {
  assets: Asset[];
  telemetry: Telemetry[];
  zones: Zone[];
  selectedPoleId?: string | null;
  onSelectPole: (poleId: string) => void;
};

export default function MapPanel({
  assets,
  telemetry,
  zones,
  selectedPoleId,
  onSelectPole,
}: MapPanelProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.CircleMarker>>({});
  const zoneCirclesRef = useRef<Record<string, L.Circle>>({});

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

    const bounds = L.latLngBounds([]);
    assets.forEach((asset) => bounds.extend([asset.gps.lat, asset.gps.lng]));
    zones.forEach((zone) => bounds.extend([zone.latitude, zone.longitude]));

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40] });
    } else {
      map.setView([center.lat, center.lng], map.getZoom());
    }

    Object.values(zoneCirclesRef.current).forEach((circle) => circle.remove());
    zoneCirclesRef.current = {};

    zones.forEach((zone) => {
      const radiusMeters = (zone.lengthKm * 1000) / 2;
      const circle = L.circle([zone.latitude, zone.longitude], {
        radius: radiusMeters,
        color: "#4b5563",
        weight: 1,
        fillColor: "#94a3b8",
        fillOpacity: 0.12,
      });

      circle.addTo(map);
      zoneCirclesRef.current[zone.zoneId] = circle;
    });

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
  }, [
    assets,
    center.lat,
    center.lng,
    onSelectPole,
    selectedPoleId,
    telemetryByPole,
    zones,
  ]);

  return (
    <div className="map-wrapper">
      <div ref={mapRef} className="map-canvas" />
    </div>
  );
}
