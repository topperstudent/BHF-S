import React, { useState, useEffect } from 'react';
import { adminAPI, type DatabaseInfo } from '../../lib/api';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import {
  Database,
  ShieldCheck,
  Download,
  HardDrive,
  Lock,
  FileCheck,
  Server,
  KeyRound,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';

export const DatabaseSettings: React.FC = () => {
  const [dbInfo, setDbInfo] = useState<DatabaseInfo | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6" data-testid="database-settings">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1F7A4C] uppercase tracking-wider mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span>Storage & Security Architecture</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900" style={{ fontFamily: 'Playfair Display' }}>
            Where & How Your BHFS Data is Stored
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Zero vendor lock-in. Full ownership of your customer profiles, product catalog, and orders.
          </p>
        </div>

        <Button
          onClick={handleDownloadBackup}
          className="bg-[#1F7A4C] hover:bg-[#175C39] text-white font-bold rounded-2xl text-xs h-10 px-5 flex items-center gap-2 shadow-sm shrink-0"
        >
          <Download className="h-4 w-4" />
          <span>Export Full Database Backup</span>
        </Button>
      </div>

      {/* Cards breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Storage Location Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <FolderOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base" style={{ fontFamily: 'Playfair Display' }}>
                Storage Location & Format
              </h3>
              <p className="text-xs text-stone-500">Self-contained file database on your server</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#FAF6F0] rounded-xl border border-stone-200">
              <div className="text-stone-400 font-medium">Exact File Path:</div>
              <div className="font-mono font-bold text-stone-900 mt-0.5 break-all">
                {dbInfo?.storagePath || './data/store.json'}
              </div>
            </div>

            <div className="space-y-2 text-stone-600 leading-relaxed">
              <p>
                <strong>How it works:</strong> All customer accounts, products added by your staff, and order records are stored in a structured JSON database in the <code>/data</code> directory.
              </p>
              <p>
                <strong>Portability:</strong> When you host this site on Google Cloud Run, a VPS, Render, or any Linux server, you can copy the <code>data/</code> folder or hit "Export Full Database Backup" anytime. You never have to pay Emergent or MongoDB monthly charges.
              </p>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-700">
              <span>Database Size:</span>
              <span className="font-mono text-[#1F7A4C]">
                {dbInfo ? `${(dbInfo.sizeBytes / 1024).toFixed(2)} KB` : 'Loading...'}
              </span>
            </div>
          </div>
        </div>

        {/* Security & Protection Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
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
                  Passwords are never stored in plain text. Even if someone inspects the raw database, passwords cannot be decoded.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <ShieldCheck className="h-4 w-4 text-[#1F7A4C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900">Cryptographically Signed JWT Tokens:</strong>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Sessions are authenticated using HMAC SHA-256 tokens with 14-day expiry. Admin routes strictly verify administrator privileges.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <FileCheck className="h-4 w-4 text-[#1F7A4C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900">Admin Authorization Filter:</strong>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Product modification, deletion, and order status updates are restricted exclusively to your phone number <code>8888092855</code>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
