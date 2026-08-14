import React, { useState } from 'react';
import { Bus, Home, Clock, MapPin, Building2, ShieldCheck, UserCheck, Users, Lock } from 'lucide-react';
import { HostelFloor } from '../types';

interface HostelAndTransportProps {
  isMainAdmin?: boolean;
}

export const HostelAndTransport: React.FC<HostelAndTransportProps> = ({ isMainAdmin = false }) => {
  const [activeTab, setActiveTab] = useState<'hostel' | 'transport'>('hostel');

  // Initial Mock Hostel Data
  const [hostelData, setHostelData] = useState<{ boys: HostelFloor[]; girls: HostelFloor[] }>({
    boys: [
      {
        floorNumber: 1,
        rooms: [
          { roomNumber: 'B-101', capacity: 4, occupied: 4 },
          { roomNumber: 'B-102', capacity: 4, occupied: 3 },
          { roomNumber: 'B-103', capacity: 2, occupied: 2 },
        ]
      },
      {
        floorNumber: 2,
        rooms: [
          { roomNumber: 'B-201', capacity: 4, occupied: 2 },
          { roomNumber: 'B-202', capacity: 4, occupied: 4 },
        ]
      }
    ],
    girls: [
      {
        floorNumber: 1,
        rooms: [
          { roomNumber: 'G-101', capacity: 3, occupied: 3 },
          { roomNumber: 'G-102', capacity: 3, occupied: 1 },
        ]
      }
    ]
  });

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-indigo-400" />
          Hostel & Transport Management
        </h2>
        <p className="text-slate-400 text-xs mb-4">
          View bus routes, schedules, and complete hostel room allocations.
        </p>

        <div className="flex gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('hostel')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'hostel'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Home className="w-4 h-4" />
            Hostel Allocation
          </button>
          <button
            onClick={() => setActiveTab('transport')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'transport'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Bus className="w-4 h-4" />
            Transport Schedules
          </button>
        </div>
      </div>

      {/* Hostel Section */}
      {activeTab === 'hostel' && (
        <div className="space-y-6">
          {!isMainAdmin && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-3 rounded-xl text-xs flex items-center gap-2">
              <Lock className="w-4 h-4 flex-shrink-0" />
              <span>Room allocation & management is restricted exclusively to the Main Admin (RBAC Protected).</span>
            </div>
          )}

          {/* Boys Hostel */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-md font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Boys' Hostel Overview
            </h3>

            <div className="space-y-4">
              {hostelData.boys.map((floor) => (
                <div key={floor.floorNumber} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-800/50">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
                    Floor {floor.floorNumber}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {floor.rooms.map((room) => (
                      <div key={room.roomNumber} className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{room.roomNumber}</p>
                          <p className="text-[10px] text-slate-500">Capacity: {room.capacity}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${
                          room.occupied >= room.capacity
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {room.occupied}/{room.capacity} Occupied
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Girls Hostel */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-md font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-pink-500" />
              Girls' Hostel Overview
            </h3>

            <div className="space-y-4">
              {hostelData.girls.map((floor) => (
                <div key={floor.floorNumber} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-800/50">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
                    Floor {floor.floorNumber}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {floor.rooms.map((room) => (
                      <div key={room.roomNumber} className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{room.roomNumber}</p>
                          <p className="text-[10px] text-slate-500">Capacity: {room.capacity}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${
                          room.occupied >= room.capacity
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {room.occupied}/{room.capacity} Occupied
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Transport Section */}
      {activeTab === 'transport' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center mb-3">
              <Bus className="w-5 h-5 mr-2 text-indigo-500" /> Bus Schedules
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="font-bold">Route 1: City Center</span>
                <span className="text-slate-500 font-semibold">07:30 AM</span>
              </div>
              <div className="flex justify-between items-center text-xs p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="font-bold">Route 2: Residential Area</span>
                <span className="text-slate-500 font-semibold">08:00 AM</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center mb-3">
              <MapPin className="w-5 h-5 mr-2 text-indigo-500" /> Route Coverage
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Institute buses cover all major hubs across the city with real-time GPS tracking enabled in student apps.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
