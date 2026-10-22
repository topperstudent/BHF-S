import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Globe, CheckCircle2, Copy, Check, Server, Shield, Github, ExternalLink, HelpCircle } from 'lucide-react';
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2.5 text-[#1F7A4C] mb-1">
            <Globe className="h-6 w-6" />
            <DialogTitle className="text-xl font-bold" style={{ fontFamily: 'Playfair Display' }}>
              How to Connect Your Domain (bhfs.in) for FREE via GitHub
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-stone-600">
            Avoid paying Google Cloud or Emergent fees. Deploy your GitHub repository to Render.com for 100% free hosting with automatic free SSL on <code>bhfs.in</code>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-xs text-stone-700 mt-2">
          {/* Why GitHub Pages alone doesn't work */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-1">
            <h4 className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-amber-600" />
              Why GitHub Pages alone cannot run this app
            </h4>
            <p className="text-stone-600 leading-relaxed text-[11px]">
              <strong>GitHub Pages only hosts static HTML/CSS files</strong>, but BHFS requires a Node.js server for Admin login, order tracking, and product database storage. Connecting your GitHub repository to <strong>Render.com (Free)</strong> solves this in 2 minutes for ₹0/month!
            </p>
          </div>

          {/* Step 1: Push to GitHub & Connect Render */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-white space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
              <span className="h-6 w-6 rounded-full bg-[#1F7A4C] text-white flex items-center justify-center text-xs">
                1
              </span>
              <Github className="h-4 w-4 text-stone-700" />
              <span>Connect GitHub Repository to Render (100% Free)</span>
            </div>
            <ol className="list-decimal pl-5 space-y-1 text-stone-600">
              <li>Go to <a href="https://render.com" target="_blank" rel="noopener noreferrer" className="text-[#1F7A4C] font-bold underline inline-flex items-center gap-0.5">render.com <ExternalLink className="h-2.5 w-2.5" /></a> and sign in with your GitHub account.</li>
              <li>Click <strong>New +</strong> and select <strong>Web Service</strong>.</li>
              <li>Choose your GitHub repository where you pushed the code.</li>
              <li>Fill in the settings:
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 mt-1 space-y-1 font-mono text-[11px]">
                  <div><strong>Runtime:</strong> Node</div>
                  <div><strong>Build Command:</strong> npm install && npm run build</div>
                  <div><strong>Start Command:</strong> npm start</div>
                  <div><strong>Instance Type:</strong> Free ($0/mo)</div>
                </div>
              </li>
              <li>Click <strong>Create Web Service</strong>. Render will build and launch your site in ~2 minutes!</li>
            </ol>
          </div>

          {/* Step 2: Add Custom Domain */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-white space-y-3">
            <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
              <span className="h-6 w-6 rounded-full bg-[#1F7A4C] text-white flex items-center justify-center text-xs">
                2
              </span>
              <span>Add DNS Records at your Domain Registrar (GoDaddy, Hostinger, BigRock)</span>
            </div>
            <p className="text-stone-600">
              In your Render service dashboard, click <strong>Settings &rarr; Custom Domains</strong> and add both <code>bhfs.in</code> and <code>www.bhfs.in</code>. Then add these records in your domain's DNS manager:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500">
                    <th className="py-1.5 px-2">Type</th>
                    <th className="py-1.5 px-2">Name / Host</th>
                    <th className="py-1.5 px-2">Points To / Value</th>
                    <th className="py-1.5 px-2 text-right">Copy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                  <tr>
                    <td className="py-2 px-2 font-bold text-[#1F7A4C]">CNAME</td>
                    <td className="py-2 px-2">www</td>
                    <td className="py-2 px-2 text-stone-800">[your-app].onrender.com</td>
                    <td className="py-2 px-2 text-right">
                      <button
                        onClick={() => copyToClipboard('onrender.com', 1)}
                        className="p-1 hover:bg-stone-100 rounded text-stone-500 cursor-pointer"
                        title="Copy"
                      >
                        {copiedIndex === 1 ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 font-bold text-[#1F7A4C]">A Record</td>
                    <td className="py-2 px-2">@ (root)</td>
                    <td className="py-2 px-2 text-stone-800">216.24.57.1</td>
                    <td className="py-2 px-2 text-right">
                      <button
                        onClick={() => copyToClipboard('216.24.57.1', 2)}
                        className="p-1 hover:bg-stone-100 rounded text-stone-500 cursor-pointer"
                        title="Copy"
                      >
                        {copiedIndex === 2 ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-[11px] flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#1F7A4C] shrink-0" />
              <span><strong>Free SSL / HTTPS Certificate:</strong> Render automatically generates and renews Let's Encrypt SSL certificates for <code>bhfs.in</code> completely free.</span>
            </div>
          </div>

          {/* Alternative: Railway */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-white space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
              <Server className="h-4 w-4 text-[#1F7A4C]" />
              <span>Alternative Free/Low-Cost Option: Railway.app</span>
            </div>
            <p className="text-[11px] text-stone-600">
              Railway is another 1-click GitHub deployment alternative: Just select your GitHub repo, click Deploy, and link <code>bhfs.in</code> in the Custom Domains tab.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-200 flex justify-end">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-[#1F7A4C] hover:bg-[#175C39] text-white font-bold rounded-xl text-xs px-5 cursor-pointer"
          >
            Close Guide
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
