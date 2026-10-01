import React, { useState, useEffect } from 'react';
import { Users, Search, ShoppingBag } from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getCustomers({ q: search || undefined });
      setCustomers(data.items || []);
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadCustomers();
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-[#2A2A2A] pb-6">
        <h1 className="font-serif text-2xl md:text-3xl text-white">Répertoire Clients</h1>
        <p className="text-xs text-[#8E8881] mt-1">
          Historique d'achat, coordonnées et paniers cumulés des clients enregistrés.
        </p>
      </div>

      <div className="bg-[#141414] border border-[#2A2A2A] p-4">
        <form onSubmit={handleSearchSubmit} className="relative max-w-sm">
          <Search className="w-4 h-4 text-[#8E8881] absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email ou tél..."
            className="w-full bg-[#1C1C1C] border border-[#333] px-9 py-2 text-xs text-white focus:outline-none focus:border-[#C5A880]"
          />
        </form>
      </div>

      <div className="bg-[#141414] border border-[#2A2A2A] overflow-x-auto">
        {loading ? (
          <div className="text-center py-16 text-[#8E8881] text-xs">
            Chargement des clients...
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-16 text-[#8E8881] text-xs space-y-2">
            <Users className="w-8 h-8 mx-auto text-[#444]" />
            <p className="text-white text-sm">Aucun compte client trouvé.</p>
          </div>
        ) : (
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="border-b border-[#2A2A2A] bg-[#181818] text-[#8E8881]">
                <th className="py-3 px-4 text-start font-normal">Client</th>
                <th className="py-3 px-4 text-start font-normal">Contact</th>
                <th className="py-3 px-4 text-center font-normal">Commandes</th>
                <th className="py-3 px-4 text-end font-normal">Dépense Totale</th>
                <th className="py-3 px-4 text-end font-normal">Date Inscription</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-[#1A1A1A]">
                  <td className="py-3 px-4">
                    <p className="font-medium text-white">{c.name || 'Client'}</p>
                  </td>
                  <td className="py-3 px-4 text-[#ECE7DF]">
                    <p>{c.email}</p>
                    <p className="text-[11px] text-[#8E8881]">{c.phone}</p>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-semibold text-[#C5A880]">{c.ordersCount}</span>
                  </td>
                  <td className="py-3 px-4 text-end font-semibold text-white">
                    {c.totalSpent.toLocaleString()} MAD
                  </td>
                  <td className="py-3 px-4 text-end text-[#8E8881]">
                    {new Date(c.createdAt).toLocaleDateString('fr-FR')}
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
