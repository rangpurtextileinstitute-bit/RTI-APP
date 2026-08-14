import React, { useState } from 'react';
import { Bus, Home, Info, Plus, Trash2 } from 'lucide-react';
import { HostelAllocation } from '../types';

interface HostelAndTransportProps {
  isMasterAdmin: boolean;
}

export const HostelAndTransport: React.FC<HostelAndTransportProps> = ({ isMasterAdmin }) => {
  const [allocations, setAllocations] = useState<HostelAllocation[]>([
    {
      id: 'h1',
      hostelName: 'Begum Rokeya Female Hostel',
      type: 'Girls',
      floors: [{ floorNumber: 1, rooms: [{ roomNumber: '101', capacity: 4, occupied: 3 }, { roomNumber: '102', capacity: 4, occupied: 4 }] }]
    },
    {
      id: 'h2',
      hostelName: 'Shahid Titumir Male Hostel',
      type: 'Boys',
      floors: [{ floorNumber: 1, rooms: [{ roomNumber: '101', capacity: 4, occupied: 4 }, { roomNumber: '102', capacity: 4, occupied: 2 }] }]
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
        <h2 className="text-xl font-black text-white mb-2">Hostel & Transport Info</h2>
        <p className="text-slate-400 text-xs">Bus schedules, routes, and hostel facility details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ... Transport (kept as is) ... */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
           <h3 className="font-black text-slate-900 dark:text-white flex items-center">
            <Bus className="w-5 h-5 mr-2 text-indigo-500" /> Transport Schedules
          </h3>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-black text-slate-900 dark:text-white flex items-center justify-between">
            <span className="flex items-center"><Home className="w-5 h-5 mr-2 text-indigo-500" /> Hostel Allocations</span>
            {isMasterAdmin && <button className="p-1 bg-indigo-100 dark:bg-indigo-900 rounded"><Plus className="w-4 h-4" /></button>}
          </h3>
          
          <div className="space-y-4">
            {allocations.map(hostel => (
                <div key={hostel.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex justify-between font-bold text-xs mb-2">
                        <span>{hostel.hostelName} ({hostel.type})</span>
                    </div>
                    {hostel.floors.map(floor => (
                        <div key={floor.floorNumber} className="ml-4 text-[10px] space-y-1">
                            <span className="font-bold">Floor {floor.floorNumber}</span>
                            {floor.rooms.map(room => (
                                <div key={room.roomNumber} className="flex justify-between px-2 py-1 bg-white dark:bg-slate-700 rounded">
                                    <span>Room {room.roomNumber}</span>
                                    <span>{room.occupied}/{room.capacity}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
