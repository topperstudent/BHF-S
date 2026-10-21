import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Globe, CheckCircle2, Copy, Check, Server, Shield, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

interface DomainModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DomainModal: React.FC<DomainModalProps> = ({ open, onOpenChange }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2.5 text-[#1F7A4C] mb-1">
            <Globe className="h-6 w-6" />
            <DialogTitle className="text-xl font-bold" style={{ fontFamily: 'Playfair Display' }}>
              How to Connect Your Domain (bhfs.in) & Save Hosting Costs
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-stone-600">
            You don't need to pay high monthly Emergent fees anymore! Your entire BHFS storefront and backend are now self-contained and can run on Google Cloud Run, Render, Vercel, or VPS.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-xs text-stone-700 mt-2">
          {/* Highlight Box */}
          <div className="bg-[#F0F7F2] border border-[#1F7A4C]/25 rounded-2xl p-4">
            <h4 className="font-bold text-[#1F7A4C] text-sm flex items-center gap-1.5 mb-1.5">
              <CheckCircle2 className="h-4 w-4" />
              100% Zero-Lockin Codebase Ready
            </h4>
            <p className="text-stone-600 leading-relaxed">
              We have recovered and built your complete BHFS website with stone-ground Aata items, cold-pressed oils, customer authentication, live order tracking, WhatsApp 1-click ordering, and the Admin portal.
            </p>
          </div>

          {/* Step 1 */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-white space-y-2">
            <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
              <span className="h-6 w-6 rounded-full bg-[#1F7A4C] text-white flex items-center justify-center text-xs">
                1
              </span>
              <span>Where is bhfs.in Registered?</span>
            </div>
            <p className="text-stone-600">
              Log into your domain provider (such as GoDaddy, Hostinger, BigRock, Namecheap, or Cloudflare) and click <strong>Manage DNS</strong> for <code>bhfs.in</code>.
            </p>
          </div>

          {/* Step 2 */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-white space-y-3">
            <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
              <span className="h-6 w-6 rounded-full bg-[#1F7A4C] text-white flex items-center justify-center text-xs">
                2
              </span>
              <span>DNS Records for bhfs.in</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500">
                    <th className="py-1.5 px-2">Type</th>
                    <th className="py-1.5 px-2">Host / Name</th>
                    <th className="py-1.5 px-2">Value / Target</th>
                    <th className="py-1.5 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                  <tr>
                    <td className="py-2 px-2 font-bold text-[#1F7A4C]">CNAME</td>
                    <td className="py-2 px-2">www</td>
                    <td className="py-2 px-2 text-stone-800">ghs.googlehosted.com</td>
                    <td className="py-2 px-2 text-right">
                      <button
                        onClick={() => copyToClipboard('ghs.googlehosted.com', 1)}
                        className="p-1 hover:bg-stone-100 rounded text-stone-500"
                        title="Copy"
                      >
                        {copiedIndex === 1 ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 font-bold text-[#1F7A4C]">A</td>
                    <td className="py-2 px-2">@ (root)</td>
                    <td className="py-2 px-2 text-stone-800">216.239.32.21</td>
                    <td className="py-2 px-2 text-right">
                      <button
                        onClick={() => copyToClipboard('216.239.32.21', 2)}
                        className="p-1 hover:bg-stone-100 rounded text-stone-500"
                        title="Copy"
                      >
                        {copiedIndex === 2 ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-stone-500 italic">
              SSL / HTTPS certificate is automatically generated for free by Google Cloud Run / Cloudflare once DNS propagates!
            </p>
          </div>

          {/* Step 3 */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-white space-y-2">
            <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
              <span className="h-6 w-6 rounded-full bg-[#1F7A4C] text-white flex items-center justify-center text-xs">
                3
              </span>
              <span>Free / Low Cost Hosting Options (No Emergent Fees)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div className="font-bold text-stone-900 flex items-center gap-1.5 mb-1">
                  <Server className="h-4 w-4 text-[#1F7A4C]" />
                  Google Cloud Run (Recommended)
                </div>
                <p className="text-[11px] text-stone-600">
                  Built right into Google AI Studio. Generous free tier (2 million requests/month free). Simply link custom domain in Cloud Run console.
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div className="font-bold text-stone-900 flex items-center gap-1.5 mb-1">
                  <Shield className="h-4 w-4 text-[#1F7A4C]" />
                  Render.com or Vercel
                </div>
                <p className="text-[11px] text-stone-600">
                  Connect your GitHub repository to Render/Vercel for automatic free hosting with 1-click custom domain SSL for bhfs.in.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-200 flex justify-end">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-[#1F7A4C] hover:bg-[#175C39] text-white font-bold rounded-xl text-xs px-5"
          >
            Got it, thanks!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
