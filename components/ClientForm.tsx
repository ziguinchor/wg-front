
import React, { useState } from 'react';
<<<<<<< HEAD
import { Key, Shield, Info } from 'lucide-react';

interface ClientFormProps {
  onSubmit: (data: { name: string; publicKey?: string }) => Promise<void>;
=======
import { CreateClientData } from '../types';
import { Key, Shield, Info, User, Lock } from 'lucide-react';

interface ClientFormProps {
  onSubmit: (data: CreateClientData) => Promise<void>;
>>>>>>> 56ee049 (Initial commit)
  isLoading: boolean;
}

export const ClientForm: React.FC<ClientFormProps> = ({ onSubmit, isLoading }) => {
  const [name, setName] = useState('');
<<<<<<< HEAD
=======
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
>>>>>>> 56ee049 (Initial commit)
  const [useCustomKey, setUseCustomKey] = useState(false);
  const [publicKey, setPublicKey] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
<<<<<<< HEAD
    if (!name) return;
    await onSubmit({ 
      name, 
=======
    if (!name || !username || !password) return;
    await onSubmit({ 
      name,
      username,
      password,
>>>>>>> 56ee049 (Initial commit)
      publicKey: useCustomKey ? publicKey : undefined 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
<<<<<<< HEAD
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
=======
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Display Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. John's iPhone"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
              <User size={14} /> VPN Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              required
              minLength={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
              <Lock size={14} /> VPN Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              required
              minLength={6}
            />
          </div>
        </div>
>>>>>>> 56ee049 (Initial commit)
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
<<<<<<< HEAD
           Provide my own Public Key
=======
          <Key size={14} /> Provide my own Public Key
>>>>>>> 56ee049 (Initial commit)
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

<<<<<<< HEAD
    
=======
      <div className="bg-indigo-50 p-3 rounded-lg flex gap-3 text-indigo-700 text-sm">
        <Info className="shrink-0" size={18} />
        <p>
          {useCustomKey 
            ? "The server will register this public key and assign an IP address." 
            : "The server will generate a new key pair and complete WireGuard configuration for you."}
        </p>
      </div>
>>>>>>> 56ee049 (Initial commit)

      <button
        type="submit"
        disabled={isLoading || !name}
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
<<<<<<< HEAD
          <> Create Client</>
=======
          <><Shield size={18} /> Create Client</>
>>>>>>> 56ee049 (Initial commit)
        )}
      </button>
    </form>
  );
};
