"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface MapComponentProps {
  geoJsonData: any;
  fillColor?: string;
  center?: [number, number];
  zoom?: number;
}

export default function MapComponent({ geoJsonData, fillColor = "#3b82f6", center = [40.7228, -73.996], zoom = 13 }: MapComponentProps) {
  // Fix Leaflet marker icons in Next.js
  useEffect(() => {
    delete (window as any).L.Icon.Default.prototype._getIconUrl;
    (window as any).L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <GeoJSON 
          data={geoJsonData} 
          style={(feature: any) => {
            let color = fillColor;
            if (feature?.properties?.status === "Fair") color = "#059669";
            if (feature?.properties?.status === "Warning") color = "#f59e0b";
            if (feature?.properties?.status === "Biased") color = "#dc2626";
            
            return {
              fillColor: color,
              fillOpacity: 0.4,
              color: color,
              weight: 2
            };
          }}
        />
      </MapContainer>
    </div>
  );
}
