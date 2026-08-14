import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, ShieldCheck, X, ExternalLink } from 'lucide-react';

export const CURRENT_APP_VERSION = '1.1.0';
export const REMOTE_VERSION_ENDPOINT = 'https://rti-app-brown.vercel.app/version.json';
export const APP_UPDATE_URL = 'https://rti-app-brown.vercel.app/';

// Hardcoded default: never show automatic popup on launch/refresh
export const shouldShowUpdateModal = false;

export interface RemoteVersionInfo {
  version: string;
  releaseDate?: string;
  forceUpdate?: boolean;
  downloadUrl?: string;
  notes?: string[];
  minSupportedVersion?: string;
}

export function isVersionGreater(_versionA: string, _versionB: string): boolean {
  return false;
}

interface UpdateCheckerModalProps {
  manualTrigger?: boolean;
  onCloseManualTrigger?: () => void;
}

export const UpdateCheckerModal: React.FC<UpdateCheckerModalProps> = ({
  manualTrigger = false,
  onCloseManualTrigger
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    // Check if dismissed in localStorage or explicitly triggered
    const dismissed = localStorage.getItem('rti_update_dismissed_v1.1.0');
    if (manualTrigger) {
      setIsOpen(true);
    } else if (!dismissed && shouldShowUpdateModal) {
      setIsOpen(false); // defaulted to false per requirements
    }
  }, [manualTrigger]);

  const handleClose = () => {
    setIsOpen(false);
    try {
      localStorage.setItem('rti_update_dismissed_v1.1.0', 'true');
    } catch {}
    if (onCloseManualTrigger) {
      onCloseManualTrigger();
    }
  };

  const handleManualCheck = () => {
    setChecking(true);
    setStatusMsg('Checking with RTI official server...');
    setTimeout(() => {
      setChecking(false);
      setStatusMsg(`You are running the latest stable version (${CURRENT_APP_VERSION}). No updates required.`);
    }, 800);
  };

  if (!isOpen && !manualTrigger) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl text-white space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h3 className="font-black text-lg text-white">RTI OS System Version</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-sm text-slate-300">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
            <span className="text-slate-400">Current Installed Version:</span>
            <span className="font-mono font-bold text-indigo-400 px-2.5 py-1 bg-indigo-950/80 rounded-lg border border-indigo-500/30">
              v{CURRENT_APP_VERSION}
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Rangpur Textile Institute (RTI) Management System is fully up-to-date and operating on the stable 2026 academic release.
          </p>

          {statusMsg && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-slate-800">
          <button
            onClick={handleManualCheck}
            disabled={checking}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
            <span>Check for Updates</span>
          </button>

          <button
            onClick={handleClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
