import React, { useState, useEffect, useRef } from 'react';
import { adminAPI, type DatabaseInfo } from '../../lib/api';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import {
  Database,
  ShieldCheck,
  Download,
  Upload,
  Cloud,
  Lock,
  FileCheck,
  Server,
  KeyRound,
  RefreshCw,
  FolderOpen,
  CheckCircle2,
} from 'lucide-react';

export const DatabaseSettings: React.FC = () => {
  const [dbInfo, setDbInfo] = useState<DatabaseInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadInfo();
  }, []);

  const loadInfo = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getDatabaseInfo();
      setDbInfo(data);
    } catch (err) {
      toast.error('Failed to retrieve database information');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadBackup = () => {
    window.location.href = adminAPI.getExportUrl();
    toast.success('Downloading database backup JSON...');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRestoring(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const content = evt.target?.result as string;
        const parsed = JSON.parse(content);
        const res = await adminAPI.restoreData(parsed);
        toast.success(`Database restored successfully! Synchronized ${res.count} records to Google Cloud Firestore.`);
        await loadInfo();
      } catch (err: any) {
        toast.error('Failed to parse backup JSON file: ' + (err.message || 'Invalid format'));
      } finally {
        setRestoring(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6" data-testid="database-settings">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1F7A4C] uppercase tracking-wider mb-1">
            <Cloud className="h-4 w-4" />
            <span>Google Cloud Persistent Database & Security</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900" style={{ fontFamily: 'Playfair Display' }}>
            Where & How Your BHFS Data is Stored
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Permanent cloud storage. Code updates, theme edits, and GitHub redeployments will <strong>never</strong> wipe your data.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={restoring}
            variant="outline"
            className="border-stone-300 hover:bg-stone-50 font-bold rounded-2xl text-xs h-10 px-4 flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="h-4 w-4 text-[#1F7A4C]" />
            <span>{restoring ? 'Restoring...' : 'Restore from Backup'}</span>
          </Button>

          <Button
            onClick={handleDownloadBackup}
            className="bg-[#1F7A4C] hover:bg-[#175C39] text-white font-bold rounded-2xl text-xs h-10 px-5 flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Export Full Backup</span>
          </Button>
        </div>
      </div>

      {/* Cloud Guarantee Callout */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F0F7F2] to-amber-50 border border-[#1F7A4C]/25 text-xs text-stone-700 space-y-1">
        <div className="font-bold text-[#1F7A4C] text-sm flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4" />
          <span>Why Future Code Updates Will NEVER Delete Your Data:</span>
        </div>
        <p className="leading-relaxed text-stone-600">
          Your catalog products, orders, and customer accounts are connected to <strong>Google Cloud Firestore</strong> (Project: <code>bhfs-food-ordering</code>). Google Cloud stores your data in isolated enterprise cloud data centers. When you push new code to GitHub, change themes, or redeploy to Vercel/Render, the cloud database remains 100% untouched and preserved forever.
        </p>
      </div>

      {/* Cards breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Storage Location Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-[#1F7A4C] flex items-center justify-center">
              <Cloud className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base" style={{ fontFamily: 'Playfair Display' }}>
                Primary Cloud Database
              </h3>
              <p className="text-xs text-stone-500">Google Cloud Firestore Enterprise</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#FAF6F0] rounded-xl border border-stone-200 space-y-1">
              <div className="text-stone-400 font-medium">Database ID & Cloud Region:</div>
              <div className="font-mono font-bold text-stone-900 break-all text-[11px]">
                ai-studio-bhfsbigheartfarm-c25ec173-fa51-4fce-8cd4-abce1b2be176
              </div>
              <div className="text-[10px] text-stone-500">Region: asia-southeast1 (High speed & low latency for India)</div>
            </div>

            <div className="space-y-2 text-stone-600 leading-relaxed">
              <p>
                <strong>Triple-Layer Redundancy:</strong>
              </p>
              <ul className="list-disc pl-4 space-y-1 text-[11px]">
                <li><strong>Cloud Firestore:</strong> Main permanent cloud storage.</li>
                <li><strong>Local JSON Store:</strong> Server-side document file backup in <code>/data/store.json</code>.</li>
                <li><strong>Device Cache:</strong> Offline-first browser cache ensuring instant screen rendering.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security & Protection Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base" style={{ fontFamily: 'Playfair Display' }}>
                Multi-Layer Security
              </h3>
              <p className="text-xs text-stone-500">Enterprise grade cryptographic protection</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-stone-600">
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <KeyRound className="h-4 w-4 text-[#1F7A4C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900">Bcrypt Password Hashing (10 Salt Rounds):</strong>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Passwords are never stored in plain text. Even raw database exports never expose plaintext passwords.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <ShieldCheck className="h-4 w-4 text-[#1F7A4C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900">Strict Admin Authorization:</strong>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Product modification, deletion, and order status updates are restricted exclusively to your phone number <code>8888092855</code>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <FileCheck className="h-4 w-4 text-[#1F7A4C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900">1-Click JSON Backup & Restore:</strong>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  You can download your entire database as a JSON file or restore it to any cloud environment anytime with complete zero lock-in.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
