import React, { useState, useEffect } from 'react';
import { FileClock, ShieldCheck, RefreshCw } from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAuditLogs({ limit: 100 });
      setLogs(data.items || []);
    } catch (err) {
      console.error('Failed to load audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#2A2A2A] pb-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-white">Journal d'Audit de Sécurité</h1>
          <p className="text-xs text-[#8E8881] mt-1">
            Traçabilité immuable des connexions, changements de mots de passe et modifications de données.
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="px-4 py-2 bg-[#1C1C1C] border border-[#333] hover:border-[#C5A880] text-[#C5A880] text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualiser</span>
        </button>
      </div>

      <div className="bg-[#141414] border border-[#2A2A2A] overflow-x-auto">
        {loading ? (
          <div className="text-center py-16 text-[#8E8881] text-xs">
            Chargement du journal d'audit...
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 text-[#8E8881] text-xs space-y-2">
            <FileClock className="w-8 h-8 mx-auto text-[#444]" />
            <p className="text-white text-sm">Aucun événement d'audit enregistré.</p>
          </div>
        ) : (
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="border-b border-[#2A2A2A] bg-[#181818] text-[#8E8881]">
                <th className="py-3 px-4 text-start font-normal">Date & Heure</th>
                <th className="py-3 px-4 text-start font-normal">Action</th>
                <th className="py-3 px-4 text-start font-normal">Entité</th>
                <th className="py-3 px-4 text-start font-normal">Utilisateur</th>
                <th className="py-3 px-4 text-start font-normal">Adresse IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-[#1A1A1A]">
                  <td className="py-3 px-4 text-[#8E8881] whitespace-nowrap">
                    {new Date(l.createdAt).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-[#C5A880]">
                    {l.action}
                  </td>
                  <td className="py-3 px-4 text-white">
                    {l.entity} {l.entityId ? `(#${l.entityId})` : ''}
                  </td>
                  <td className="py-3 px-4 text-[#ECE7DF]">
                    <span className="font-medium">{l.userEmail}</span>
                    <span className="text-[10px] text-[#8E8881] block">Rôle : {l.userRole}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#8E8881]">
                    {l.ipAddress || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
