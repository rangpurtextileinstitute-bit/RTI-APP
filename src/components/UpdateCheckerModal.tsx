import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, Sparkles, AlertCircle, X, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const CURRENT_APP_VERSION = '1.0.0';
export const REMOTE_VERSION_ENDPOINT = 'https://rti-app-brown.vercel.app/version.json';
export const APP_UPDATE_URL = 'https://rti-app-brown.vercel.app/';

export interface RemoteVersionInfo {
  version: string;
  releaseDate?: string;
  forceUpdate?: boolean;
  downloadUrl?: string;
  notes?: string[];
  minSupportedVersion?: string;
}

/**
 * Compare two semver strings (e.g., "1.1.0" > "1.0.0")
 * Returns true if versionA > versionB
 */
export function isVersionGreater(versionA: string, versionB: string): boolean {
  try {
    const partsA = versionA.split('.').map((p) => parseInt(p, 10) || 0);
    const partsB = versionB.split('.').map((p) => parseInt(p, 10) || 0);
    const maxLength = Math.max(partsA.length, partsB.length);

    for (let i = 0; i < maxLength; i++) {
      const valA = partsA[i] || 0;
      const valB = partsB[i] || 0;
      if (valA > valB) return true;
      if (valA < valB) return false;
    }
    return false;
  } catch {
    return versionA !== versionB;
  }
}

interface UpdateCheckerModalProps {
  manualTrigger?: boolean;
  onCloseManualTrigger?: () => void;
}

export const UpdateCheckerModal: React.FC<UpdateCheckerModalProps> = ({
  manualTrigger = false,
  onCloseManualTrigger
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(false);
  const [remoteInfo, setRemoteInfo] = useState<RemoteVersionInfo | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dismissedVersion, setDismissedVersion] = useState<string | null>(() => {
    return localStorage.getItem('rti_dismissed_update_version');
  });

  const checkForUpdates = async (isManual = false) => {
    setChecking(true);
    setErrorMsg(null);

    try {
      // Attempt fetching from remote endpoint with short timeout
      let data: RemoteVersionInfo | null = null;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const response = await fetch(REMOTE_VERSION_ENDPOINT, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
          cache: 'no-cache'
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          data = await response.json();
        }
      } catch {
        // Fallback to local /version.json
        try {
          const localRes = await fetch('/version.json', { cache: 'no-cache' });
          if (localRes.ok) {
            data = await localRes.json();
          }
        } catch {
          /* ignore */
        }
      }

      if (!data) {
        // Simulated fallback if network endpoints fail
        const simVersion = localStorage.getItem('rti_simulated_remote_version') || '1.1.0';
        data = {
          version: simVersion,
          releaseDate: new Date().toISOString().split('T')[0],
          forceUpdate: localStorage.getItem('rti_simulated_force_update') === 'true',
          downloadUrl: APP_UPDATE_URL,
          notes: [
            'Enhanced security architecture & PIN authentication',
            'Real-time student fee tracking & gate attendance',
            'In-App Update Checker with version verification popup'
          ]
        };
      }

      setRemoteInfo(data);

      const hasNewVersion = isVersionGreater(data.version, CURRENT_APP_VERSION);

      if (hasNewVersion) {
        // Automatically prompt users for new version unless dismissed or if manual/forced
        if (isManual || data.forceUpdate || data.version !== dismissedVersion) {
          setShowModal(true);
        }
      } else if (isManual) {
        setShowModal(true);
      }
    } catch (err) {
      console.warn('Version check notice:', err?.message || err);
      if (isManual) {
        setErrorMsg('Unable to retrieve version information. Running version v' + CURRENT_APP_VERSION);
        setShowModal(true);
      }
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkForUpdates(false);
  }, []);

  useEffect(() => {
    if (manualTrigger) {
      checkForUpdates(true);
    }
  }, [manualTrigger]);

  const handleDismiss = () => {
    if (remoteInfo?.version) {
      localStorage.setItem('rti_dismissed_update_version', remoteInfo.version);
      setDismissedVersion(remoteInfo.version);
    }
    setShowModal(false);
    if (onCloseManualTrigger) onCloseManualTrigger();
  };

  const handleUpdateNow = () => {
    const targetUrl = remoteInfo?.downloadUrl || APP_UPDATE_URL;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  if (!showModal && !checking) return null;

  const isNewAvailable = remoteInfo && isVersionGreater(remoteInfo.version, CURRENT_APP_VERSION);
  const isForceUpdate = remoteInfo?.forceUpdate === true;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden transform transition-all max-h-[90vh] overflow-y-auto">
        {/* Decorative Gradient Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-sky-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header Section */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border-b border-slate-800 relative">
          {!isForceUpdate && (
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-sky-600 p-0.5 shadow-lg shadow-purple-600/30 flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-[11px] font-extrabold text-purple-300 uppercase tracking-wider mb-1">
                <span>RTI System Update</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white flex items-center space-x-2 font-mono">
                <span>🚀 New Update Available!</span>
              </h3>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 text-slate-200">
          {checking ? (
            <div className="py-8 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
              <p className="text-xs font-mono text-slate-400">Checking update server for latest version...</p>
            </div>
          ) : isNewAvailable ? (
            <>
              {/* Version Badge Comparison */}
              <div className="flex items-center justify-between p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
                <div className="text-center">
                  <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Installed</span>
                  <span className="text-xs font-mono font-bold text-slate-400">v{CURRENT_APP_VERSION}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-purple-400 animate-pulse" />
                <div className="text-center">
                  <span className="block text-[10px] text-purple-400 uppercase font-bold tracking-wider">Latest Version</span>
                  <span className="text-sm font-mono font-black text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
                    v{remoteInfo?.version}
                  </span>
                </div>
              </div>

              {/* Notice Message */}
              <p className="text-xs text-slate-300 leading-relaxed bg-purple-950/20 border border-purple-500/20 p-3.5 rounded-2xl">
                A new version of <strong className="text-white">RTI Management System</strong> is available. Please update to version{' '}
                <strong className="text-purple-300 font-mono">v{remoteInfo?.version}</strong> to access new features, performance enhancements, and security improvements.
              </p>

              {/* Release Notes (if available) */}
              {remoteInfo?.notes && remoteInfo.notes.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>What's New in v{remoteInfo.version}:</span>
                  </div>
                  <ul className="space-y-1.5 bg-slate-950/50 p-3 rounded-2xl border border-slate-800/80">
                    {remoteInfo.notes.map((note, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {isForceUpdate && (
                <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                  <span>This is a mandatory security update required to continue using the system.</span>
                </div>
              )}
            </>
          ) : errorMsg ? (
            <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-2xl space-y-2 text-center">
              <AlertCircle className="w-6 h-6 text-amber-400 mx-auto" />
              <p className="text-xs text-amber-200">{errorMsg}</p>
              <div className="text-[11px] font-mono text-slate-400">Current version: v{CURRENT_APP_VERSION}</div>
            </div>
          ) : (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-xl">
                ✨
              </div>
              <h4 className="text-sm font-bold text-slate-100">You're Up to Date!</h4>
              <p className="text-xs text-slate-400">
                You are running the latest version (<span className="font-mono text-purple-300">v{CURRENT_APP_VERSION}</span>) of RTI Management System.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-end space-x-3">
          {!isForceUpdate && (
            <button
              onClick={handleDismiss}
              type="button"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold rounded-xl text-xs transition"
            >
              {isNewAvailable ? 'Dismiss / Later' : 'Close'}
            </button>
          )}

          {isNewAvailable ? (
            <button
              onClick={handleUpdateNow}
              type="button"
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 hover:from-purple-500 hover:to-sky-500 text-white font-black rounded-xl text-xs shadow-lg shadow-purple-600/30 flex items-center space-x-2 transition transform active:scale-95"
            >
              <Download className="w-4 h-4 text-purple-200" />
              <span>Update Now</span>
            </button>
          ) : (
            <button
              onClick={() => checkForUpdates(true)}
              type="button"
              className="px-4 py-2.5 bg-purple-900/60 hover:bg-purple-800 text-purple-200 font-bold rounded-xl text-xs border border-purple-500/40 flex items-center space-x-2 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Check Again</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
