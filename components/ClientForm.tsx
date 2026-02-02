
import React, { useState } from 'react';
import { Key, Shield, Info } from 'lucide-react';

interface ClientFormProps {
  onSubmit: (data: { name: string; publicKey?: string }) => Promise<void>;
  isLoading: boolean;
}

export const ClientForm: React.FC<ClientFormProps> = ({ onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [useCustomKey, setUseCustomKey] = useState(false);
  const [publicKey, setPublicKey] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    await onSubmit({ 
      name, 
      publicKey: useCustomKey ? publicKey : undefined 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Client Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. android-phone"
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          required
        />
      </div>

      <div className="flex items-center gap-2 py-2">
        <input
          type="checkbox"
          id="customKey"
          checked={useCustomKey}
          onChange={(e) => setUseCustomKey(e.target.checked)}
          className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
        />
        <label htmlFor="customKey" className="text-sm text-slate-600 flex items-center gap-1 cursor-pointer">
           Provide my own Public Key
        </label>
      </div>

      {useCustomKey && (
        <div className="animate-in slide-in-from-top-2 duration-200">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Public Key
          </label>
          <input
            type="text"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            placeholder="BASE64_WG_PUBLIC_KEY="
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-mono text-sm"
            required={useCustomKey}
          />
        </div>
      )}

    

      <button
        type="submit"
        disabled={isLoading || !name}
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <> Create Client</>
        )}
      </button>
    </form>
  );
};
