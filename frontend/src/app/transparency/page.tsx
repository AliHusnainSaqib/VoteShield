"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { useState, useEffect } from "react";

// Dynamically import the map to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("../../components/MapComponent"), { ssr: false });

export default function TransparencyHub() {
  const [districtData, setDistrictData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDistricts() {
      try {
        const response = await fetch("http://localhost:8000/api/districts");
        const data = await response.json();
        setDistrictData(data);
      } catch (error) {
        console.error("Failed to fetch districts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDistricts();
  }, []);

  return (
    <div className="flex-1 flex flex-col p-8 lg:p-12 bg-slate-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">GIS Transparency Hub</h1>
          <p className="text-slate-600">Live district boundaries and AI fairness metrics.</p>
        </div>
        
        {/* Efficiency Gap Legend */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Info className="w-4 h-4 text-slate-400" />
            Efficiency Gap Scale:
          </div>
          <div className="flex items-center gap-3 text-xs font-medium">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-emerald-600"></span> 0-4% (Fair)
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span> 4-7% (Warning)
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-600"></span> &gt;7% (Biased)
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex-1">
        
        {/* Live Data Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full"
        >
          <div className="mb-4 flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Live District Map (Pakistan)</h2>
              <p className="text-sm text-slate-500">Fetched dynamically from the backend.</p>
            </div>
            <div className="text-right">
              {loading ? (
                <div className="text-sm font-medium text-slate-500">Loading...</div>
              ) : (
                <>
                  <div className="text-sm font-medium text-slate-500">Districts Loaded</div>
                  <div className="text-2xl font-bold text-indigo-600">{districtData?.features?.length || 0}</div>
                </>
              )}
            </div>
          </div>
          
          <div className="flex-1 min-h-[500px]">
            {loading ? (
              <div className="w-full h-full bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center">
                <span className="text-slate-400">Loading map data...</span>
              </div>
            ) : districtData ? (
              <MapComponent 
                geoJsonData={districtData} 
                center={[33.63, 73.04]}
                zoom={10}
              />
            ) : (
              <div className="w-full h-full bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
                <span className="text-red-500">Failed to load data</span>
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
