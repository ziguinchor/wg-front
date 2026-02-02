
import React, { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';
import { CreateClientResponse } from '../types';

interface ClientConfigViewProps {
  client: CreateClientResponse;
}

export const ClientConfigView: React.FC<ClientConfigViewProps> = ({ client }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!client.config) return;
    navigator.clipboard.writeText(client.config);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!client.config) return;
    const element = document.createElement('a');
    const file = new Blob([client.config], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `wg-${client.name}.conf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
        <h4 className="font-semibold text-emerald-800">Client Created Successfully!</h4>
        <p className="text-sm text-emerald-700 mt-1">
          IP Address assigned: <strong>{client.ip}</strong>
        </p>
      </div>

      {client.config ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 uppercase tracking-wider">Configuration</span>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
          <pre className="p-4 bg-slate-900 text-slate-300 rounded-lg overflow-x-auto text-xs font-mono leading-relaxed max-h-[300px] border border-slate-800">
            {client.config}
          </pre>
        </div>
      ) : (
        <div className="p-4 bg-slate-50 rounded-lg border text-sm text-slate-600 italic">
          No config was generated (External key used). Please use your client-side generated configuration.
        </div>
      )}
    </div>
  );
};
