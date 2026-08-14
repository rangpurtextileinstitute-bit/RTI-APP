import React, { useState } from 'react';
import { Bus, Home, Info, Plus, Trash2, Edit2, Check, X, Shield, Users, BedDouble } from 'lucide-react';
import { HostelAllocation, HostelRoom, HostelFloor } from '../types';

interface HostelAndTransportProps {
  isMasterAdmin: boolean;
}

const INITIAL_HOSTEL_ALLOCATIONS: HostelAllocation[] = [
  {
    id: 'h1',
    hostelName: 'Begum Rokeya Female Hostel',
    type: 'Girls',
    floors: [
      {
        floorNumber: 1,
        rooms: [
          { roomNumber: '101', capacity: 4, occupied: 3 },
          { roomNumber: '102', capacity: 4, occupied: 4 },
          { roomNumber: '103', capacity: 4, occupied: 2 },
          { roomNumber: '104', capacity: 2, occupied: 1 },
        ]
      },
      {
        floorNumber: 2,
        rooms: [
          { roomNumber: '201', capacity: 4, occupied: 4 },
          { roomNumber: '202', capacity: 4, occupied: 3 },
          { roomNumber: '203', capacity: 4, occupied: 1 },
        ]
      }
    ]
  },
  {
    id: 'h2',
    hostelName: 'Shahid Titumir Male Hostel',
    type: 'Boys',
    floors: [
      {
        floorNumber: 1,
        rooms: [
          { roomNumber: '101', capacity: 4, occupied: 4 },
          { roomNumber: '102', capacity: 4, occupied: 2 },
          { roomNumber: '103', capacity: 4, occupied: 3 },
        ]
      },
      {
        floorNumber: 2,
        rooms: [
          { roomNumber: '201', capacity: 4, occupied: 3 },
          { roomNumber: '202', capacity: 4, occupied: 4 },
        ]
      }
    ]
  }
];

export const HostelAndTransport: React.FC<HostelAndTransportProps> = ({ isMasterAdmin }) => {
  const [allocations, setAllocations] = useState<HostelAllocation[]>(() => {
    const saved = localStorage.getItem('rti_hostel_allocations');
    return saved ? JSON.parse(saved) : INITIAL_HOSTEL_ALLOCATIONS;
  });

  const [editingRoom, setEditingRoom] = useState<{
    hostelId: string;
    floorNum: number;
    roomIndex: number;
    roomNumber: string;
    capacity: number;
    occupied: number;
  } | null>(null);

  const [showAddRoomModal, setShowAddRoomModal] = useState<{
    hostelId: string;
    floorNum: number;
  } | null>(null);

  const [newRoomNum, setNewRoomNum] = useState('');
  const [newRoomCap, setNewRoomCap] = useState(4);
  const [newRoomOcc, setNewRoomOcc] = useState(0);

  const saveAllocations = (updated: HostelAllocation[]) => {
    setAllocations(updated);
    localStorage.setItem('rti_hostel_allocations', JSON.stringify(updated));
  };

  const handleStartEdit = (hostelId: string, floorNum: number, roomIndex: number, room: HostelRoom) => {
    if (!isMasterAdmin) return;
    setEditingRoom({
      hostelId,
      floorNum,
      roomIndex,
      roomNumber: room.roomNumber,
      capacity: room.capacity,
      occupied: room.occupied
    });
  };

  const handleSaveEdit = () => {
    if (!editingRoom) return;
    const updated = allocations.map(hostel => {
      if (hostel.id !== editingRoom.hostelId) return hostel;
      return {
        ...hostel,
        floors: hostel.floors.map(floor => {
          if (floor.floorNumber !== editingRoom.floorNum) return floor;
          const newRooms = [...floor.rooms];
          newRooms[editingRoom.roomIndex] = {
            roomNumber: editingRoom.roomNumber.trim(),
            capacity: Math.max(1, editingRoom.capacity),
            occupied: Math.min(editingRoom.capacity, Math.max(0, editingRoom.occupied))
          };
          return { ...floor, rooms: newRooms };
        })
      };
    });
    saveAllocations(updated);
    setEditingRoom(null);
  };

  const handleDeleteRoom = (hostelId: string, floorNum: number, roomIndex: number) => {
    if (!isMasterAdmin) return;
    if (!confirm('Are you sure you want to delete this room allocation?')) return;
    const updated = allocations.map(hostel => {
      if (hostel.id !== hostelId) return hostel;
      return {
        ...hostel,
        floors: hostel.floors.map(floor => {
          if (floor.floorNumber !== floorNum) return floor;
          return {
            ...floor,
            rooms: floor.rooms.filter((_, idx) => idx !== roomIndex)
          };
        })
      };
    });
    saveAllocations(updated);
  };

  const handleAddRoom = () => {
    if (!showAddRoomModal || !newRoomNum.trim()) return;
    const { hostelId, floorNum } = showAddRoomModal;
    const updated = allocations.map(hostel => {
      if (hostel.id !== hostelId) return hostel;
      return {
        ...hostel,
        floors: hostel.floors.map(floor => {
          if (floor.floorNumber !== floorNum) return floor;
          return {
            ...floor,
            rooms: [
              ...floor.rooms,
              {
                roomNumber: newRoomNum.trim(),
                capacity: newRoomCap,
                occupied: Math.min(newRoomCap, newRoomOcc)
              }
            ]
          };
        })
      };
    });
    saveAllocations(updated);
    setShowAddRoomModal(null);
    setNewRoomNum('');
    setNewRoomCap(4);
    setNewRoomOcc(0);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 border border-indigo-900/40 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Home className="w-6 h-6 text-indigo-400" />
            <h2 className="text-2xl font-black text-white">Hostel & Transport Management</h2>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Complete details on Girls & Boys Hostel room allocations, floor capacities, and bus transport schedules.
          </p>
        </div>
        {isMasterAdmin && (
          <div className="px-3 py-1.5 bg-purple-950/80 border border-purple-500/50 rounded-xl text-xs font-bold text-purple-300 flex items-center space-x-1.5">
            <Shield className="w-4 h-4 text-purple-400" />
            <span>Main Admin Controls Enabled</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Transport Schedules */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-black text-slate-900 dark:text-white flex items-center text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
              <Bus className="w-4 h-4 mr-2 text-indigo-500" /> Bus Transport Schedules
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700/60">
                <div className="flex justify-between items-center text-xs font-bold text-slate-900 dark:text-white">
                  <span>Route 1: City Center Express</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">07:30 AM</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Stops: Grand Hotel More ➔ Jahaz Marani ➔ RTI Campus
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700/60">
                <div className="flex justify-between items-center text-xs font-bold text-slate-900 dark:text-white">
                  <span>Route 2: RK Road & Modern More</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">08:00 AM</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Stops: Modern More ➔ Bus Terminal ➔ RTI Campus
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700/60">
                <div className="flex justify-between items-center text-xs font-bold text-slate-900 dark:text-white">
                  <span>Evening Return Bus</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">05:15 PM</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Departs RTI Campus to all major city points
                </p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-950/40 p-4 rounded-2xl border border-indigo-800/40 text-xs space-y-2 text-indigo-200">
            <div className="flex items-center space-x-2 font-bold text-indigo-300">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>Hostel Regulations</span>
            </div>
            <p className="text-[11px] text-indigo-300/80 leading-relaxed">
              Hostel gates close strictly at 9:00 PM for all residents. Emergency leave requests must be approved by the Hostel Warden via the RTI Management System.
            </p>
          </div>
        </div>

        {/* Right Column: Hostel Room Allocations (Boys & Girls) */}
        <div className="lg:col-span-2 space-y-6">
          {allocations.map(hostel => {
            const totalCap = hostel.floors.reduce((acc, f) => acc + f.rooms.reduce((rAcc, r) => rAcc + r.capacity, 0), 0);
            const totalOcc = hostel.floors.reduce((acc, f) => acc + f.rooms.reduce((rAcc, r) => rAcc + r.occupied, 0), 0);

            return (
              <div key={hostel.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Hostel Header */}
                <div className={`p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b ${
                  hostel.type === 'Girls' 
                    ? 'bg-rose-950/20 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/40' 
                    : 'bg-indigo-950/20 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/40'
                }`}>
                  <div>
                    <div className="flex items-center space-x-2">
                      <BedDouble className={`w-5 h-5 ${hostel.type === 'Girls' ? 'text-rose-400' : 'text-indigo-400'}`} />
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{hostel.hostelName}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        hostel.type === 'Girls' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}>
                        {hostel.type} Hostel
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Structured Floor & Room Allocations
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-mono">
                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 font-bold">
                      Occupancy: <strong className="text-indigo-500">{totalOcc}</strong>/{totalCap}
                    </span>
                  </div>
                </div>

                {/* Floors List */}
                <div className="p-4 space-y-4">
                  {hostel.floors.map(floor => (
                    <div key={floor.floorNumber} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3.5 border border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center">
                          <Users className="w-3.5 h-3.5 mr-1 text-slate-400" /> Floor {floor.floorNumber}
                        </span>
                        {isMasterAdmin && (
                          <button
                            onClick={() => setShowAddRoomModal({ hostelId: hostel.id, floorNum: floor.floorNumber })}
                            className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-extrabold flex items-center space-x-1 cursor-pointer transition-all"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Room</span>
                          </button>
                        )}
                      </div>

                      {/* Rooms Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                        {floor.rooms.map((room, roomIdx) => {
                          const isFull = room.occupied >= room.capacity;
                          return (
                            <div
                              key={room.roomNumber}
                              className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                                isFull 
                                  ? 'bg-amber-950/10 dark:bg-amber-950/20 border-amber-500/30' 
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/60'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-mono font-black text-xs text-slate-900 dark:text-white">
                                  Room #{room.roomNumber}
                                </span>
                                {isMasterAdmin && (
                                  <div className="flex items-center space-x-1">
                                    <button
                                      onClick={() => handleStartEdit(hostel.id, floor.floorNumber, roomIdx, room)}
                                      className="p-1 text-slate-400 hover:text-indigo-400 transition-colors"
                                      title="Edit Room Details"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteRoom(hostel.id, floor.floorNumber, roomIdx)}
                                      className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                                      title="Delete Room"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                              </div>

                              <div className="mt-2 flex justify-between items-center text-[11px]">
                                <span className="text-slate-500 dark:text-slate-400">Capacity & Occupancy:</span>
                                <span className={`font-mono font-bold px-1.5 py-0.5 rounded ${
                                  isFull ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                                }`}>
                                  {room.occupied} / {room.capacity} Beds
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Room Modal (Main Admin Only) */}
      {editingRoom && isMasterAdmin && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl max-w-sm w-full p-5 shadow-2xl text-white space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="font-black text-sm text-indigo-300 flex items-center space-x-1.5">
                <Edit2 className="w-4 h-4" />
                <span>Edit Room #{editingRoom.roomNumber}</span>
              </h4>
              <button onClick={() => setEditingRoom(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Room Number *</label>
                <input
                  type="text"
                  value={editingRoom.roomNumber}
                  onChange={e => setEditingRoom({ ...editingRoom, roomNumber: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl font-mono text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Max Capacity *</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editingRoom.capacity}
                    onChange={e => setEditingRoom({ ...editingRoom, capacity: parseInt(e.target.value, 10) || 1 })}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Occupied Beds *</label>
                  <input
                    type="number"
                    min="0"
                    max={editingRoom.capacity}
                    value={editingRoom.occupied}
                    onChange={e => setEditingRoom({ ...editingRoom, occupied: parseInt(e.target.value, 10) || 0 })}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl font-mono text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setEditingRoom(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Room Modal (Main Admin Only) */}
      {showAddRoomModal && isMasterAdmin && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl max-w-sm w-full p-5 shadow-2xl text-white space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="font-black text-sm text-indigo-300 flex items-center space-x-1.5">
                <Plus className="w-4 h-4" />
                <span>Add Room to Floor {showAddRoomModal.floorNum}</span>
              </h4>
              <button onClick={() => setShowAddRoomModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Room Number *</label>
                <input
                  type="text"
                  placeholder="e.g., 105"
                  value={newRoomNum}
                  onChange={e => setNewRoomNum(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl font-mono text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Capacity *</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newRoomCap}
                    onChange={e => setNewRoomCap(parseInt(e.target.value, 10) || 1)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Occupied *</label>
                  <input
                    type="number"
                    min="0"
                    max={newRoomCap}
                    value={newRoomOcc}
                    onChange={e => setNewRoomOcc(parseInt(e.target.value, 10) || 0)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl font-mono text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowAddRoomModal(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRoom}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Room</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
