"use client";

import { motion } from "framer-motion";
import { Activity, ShieldAlert, CheckCircle, Users } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="flex-1 p-8 lg:p-12 bg-slate-50">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Fairness & Security Dashboard</h1>
          <p className="text-slate-600">Real-time monitoring of election integrity.</p>
        </div>
        <div className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          System Secure
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { title: "Total Votes Cast", value: "142,854", icon: <Activity />, trend: "+2.4% this hour", color: "text-blue-600", bg: "bg-blue-50" },
          { title: "Avg. Efficiency Gap", value: "1.2%", icon: <CheckCircle />, trend: "Within acceptable limits", color: "text-emerald-600", bg: "bg-emerald-50" },
          { title: "Anomalies Detected", value: "0", icon: <ShieldAlert />, trend: "No suspicious activity", color: "text-slate-600", bg: "bg-slate-100" },
          { title: "Active Districts", value: "24", icon: <Users />, trend: "All systems online", color: "text-purple-600", bg: "bg-purple-50" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">{stat.title}</h3>
            <div className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</div>
            <div className="text-xs font-medium text-slate-400">{stat.trend}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Efficiency Gap by District</h2>
          <div className="space-y-4">
            {[
              { id: "District 1", gap: 1.2, status: "Fair" },
              { id: "District 2", gap: 0.8, status: "Fair" },
              { id: "District 3", gap: 6.4, status: "Warning" },
              { id: "District 4", gap: 2.1, status: "Fair" }
            ].map(d => (
              <div key={d.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                <span className="font-medium text-slate-700">{d.id}</span>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-slate-900">{d.gap}%</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-md ${d.status === 'Fair' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {d.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-800 mb-6">System Security Log</h2>
          <div className="space-y-4">
            {[
              { time: "10:42 AM", event: "Node 4 synced successfully", type: "info" },
              { time: "10:38 AM", event: "New ballot batch encrypted", type: "success" },
              { time: "10:15 AM", event: "Admin login from 192.168.1.45", type: "info" },
              { time: "09:59 AM", event: "Database backup completed", type: "success" }
            ].map((log, i) => (
              <div key={i} className="flex gap-4">
                <div className="text-sm font-medium text-slate-400 w-16 shrink-0">{log.time}</div>
                <div className="flex gap-3">
                  <div className={`mt-1.5 w-2 h-2 rounded-full ${log.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                  <p className="text-sm text-slate-700">{log.event}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
