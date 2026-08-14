 import React from 'react';

export const CURRENT_APP_VERSION = '1.1.0';
export const REMOTE_VERSION_ENDPOINT = 'https://rti-app-brown.vercel.app/version.json';
export const APP_UPDATE_URL = 'https://rti-app-brown.vercel.app/';

export interface RemoteVersionInfo {
  version: string;
  releaseDate?: string;
  isForceUpdate?: boolean;
  downloadUrl?: string;
  notes?: string[];
  minSupportedVersion?: string;
}

export function isVersionGreater(versionA: string, versionB: string): boolean {
  return false;
}

interface UpdateCheckerModalProps {
  manualTrigger?: boolean;
  onCloseManualTrigger?: () => void;
}

export const UpdateCheckerModal: React.FC<UpdateCheckerModalProps> = () => {
  // Update popup is permanently disabled
  return null;
};
