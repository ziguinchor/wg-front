
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  Search, 
  Plus, 
  Trash2, 
  LogOut, 
  RefreshCw, 
  Activity, 
  Database,
  ChevronLeft,
  ChevronRight,
  User,
  AlertCircle
} from 'lucide-react';
import { ApiService } from './services/api';
import { Client, AuthState, CreateClientResponse } from './types';
import { Modal } from './components/Modal';
import { ClientForm } from './components/ClientForm';
import { ClientConfigView } from './components/ClientConfigView';

const ITEMS_PER_PAGE = 8;

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('wg_token');
    return {
      token: saved,
      isAuthenticated: !!saved
    };
  });

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // UI States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createdClient, setCreatedClient] = useState<CreateClientResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchClients();
    }
  }, [auth.isAuthenticated]);

  const fetchClients = async () => {
    if (!auth.token) return;
    setLoading(true);
    try {
      const data = await ApiService.getClients(auth.token);
      setClients(data);
    } catch (err: any) {
      if (err.message === 'unauthorized') {
        handleLogout();
      }
      setError('Could not load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { token } = await ApiService.login(username, password);
      localStorage.setItem('wg_token', token);
      setAuth({ token, isAuthenticated: true });
    } catch (err: any) {
      setError(err.message === 'invalid_credentials' ? 'Invalid username or password' : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('wg_token');
    setAuth({ token: null, isAuthenticated: false });
    setClients([]);
  };

  const handleCreateClient = async (data: { name: string; publicKey?: string }) => {
    if (!auth.token) return;
    setLoading(true);
    try {
      let response: CreateClientResponse;
      if (data.publicKey) {
        response = await ApiService.createClientWithKey(auth.token, data.name, data.publicKey);
      } else {
        response = await ApiService.createClient(auth.token, data.name);
      }
      setCreatedClient(response);
      setSuccess(`Client ${response.name} created successfully.`);
      fetchClients();
    } catch (err: any) {
      setError(err.message || 'Failed to create client');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (id: string, name: string) => {
    if (!auth.token || !window.confirm(`Revoke access for "${name}"? This will remove the peer immediately.`)) return;
    try {
      await ApiService.deleteClient(auth.token, id);
      setClients(prev => prev.filter(c => c.id !== id));
      setSuccess(`Revoked access for ${name}`);
    } catch (err) {
      setError('Failed to revoke client');
    }
  };

  const handleSync = async () => {
    if (!auth.token) return;
    setIsSyncing(true);
    try {
      const res = await ApiService.sync(auth.token);
      setSuccess(`Successfully synced ${res.appliedPeers} peers to WireGuard kernel.`);
    } catch (err) {
      setError('Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredClients = useMemo(() => {
    return clients.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.ip.includes(searchTerm) ||
      c.publicKey.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredClients.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredClients, currentPage]);

  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);

  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="inline-flex p-4 bg-indigo-600 rounded-2xl mb-4 shadow-xl shadow-indigo-900/40">
              <Shield size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">WireGuard Admin</h1>
          </div>
          
          <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-2xl space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex gap-3">
                <AlertCircle size={18} className="shrink-0" />
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign In'}
            </button>
          </form>
          
          <p className="text-center text-slate-500 text-sm mt-8">
            WireGuard Manager
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
           
            <h1 className="text-lg font-bold text-slate-900 hidden sm:block">WG Manager</h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-sm font-medium text-slate-600 border border-slate-200">
              <Activity size={14} className="text-emerald-500" />
              <span>Network Active</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm font-medium"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts Section */}
        <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
          {success && (
            <div className="animate-in slide-in-from-right duration-300 pointer-events-auto p-4 bg-emerald-600 text-white rounded-xl shadow-xl flex items-center justify-between gap-4">
              <span>{success}</span>
              <button onClick={() => setSuccess(null)} className="text-white/80 hover:text-white">
                <Trash2 size={16} />
              </button>
            </div>
          )}
          {error && (
            <div className="animate-in slide-in-from-right duration-300 pointer-events-auto p-4 bg-red-600 text-white rounded-xl shadow-xl flex items-center justify-between gap-4">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-white/80 hover:text-white">
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Dashboard Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Clients Registry</h2>
            <p className="text-slate-500 text-sm mt-1">Manage VPN clients</p>
          </div>
          
          <div className="flex items-center gap-3">
           
            <button
              onClick={() => {
                setCreatedClient(null);
                setIsCreateModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              <Plus size={20} />
              <span>New Client</span>
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <User size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Clients</p>
              <p className="text-2xl font-bold text-slate-900">{clients.length}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Database size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Active IPs</p>
              <p className="text-2xl font-bold text-slate-900">{clients.filter(c => !c.revoked).length}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Storage Status</p>
              <p className="text-2xl font-bold text-slate-900">Synchronized</p>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, IP or public key..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Client Name</th>
                  <th className="px-6 py-4">IP Address</th>
                  <th className="px-6 py-4">Public Key</th>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && clients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-3 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
                        <p>Loading clients...</p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedClients.length > 0 ? (
                  paginatedClients.map((client) => (
                    <tr key={client.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{client.name}</div>
                        <div className="text-xs text-slate-400 font-mono">ID: {client.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md border border-indigo-100">
                          {client.ip}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-mono text-slate-500 max-w-[120px] truncate" title={client.publicKey}>
                          {client.publicKey}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(client.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteClient(client.id, client.name)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                      No clients found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-sm text-slate-500 font-medium">
              Showing {paginatedClients.length} of {filteredClients.length} clients
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 text-sm font-semibold rounded-lg transition-all ${
                      currentPage === i + 1 
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                        : 'text-slate-500 hover:bg-white hover:border-slate-200 border border-transparent'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={createdClient ? 'Connection Details' : 'Add New Client'}
      >
        {createdClient ? (
          <ClientConfigView client={createdClient} />
        ) : (
          <ClientForm onSubmit={handleCreateClient} isLoading={loading} />
        )}
      </Modal>

      <footer className="py-6 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm text-slate-500">
          <p>WireGuard Manager.</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <Activity size={14} className="text-emerald-500" /> API: Healthy
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
