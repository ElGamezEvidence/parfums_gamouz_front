import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Package,
  Users,
  Calendar,
  ArrowUpRight,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminDashboard = () => {
  const [period, setPeriod] = useState('30d');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = async (selectedPeriod) => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getDashboardStats(selectedPeriod);
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
      setError('Impossible de charger les métriques PostgreSQL réelles. Vérifiez la connexion backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats(period);
  }, [period]);

  const metrics = stats?.metrics;
  const recentOrders = stats?.recentOrders || [];
  const topSelling = stats?.topSelling || [];

  const periods = [
    { id: 'today', label: "Aujourd'hui" },
    { id: '7d', label: '7 derniers jours' },
    { id: '30d', label: '30 derniers jours' },
    { id: 'month', label: 'Mois courant' },
    { id: 'all', label: 'Tout' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2 py-0.5 text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30">En attente</span>;
      case 'CONFIRMED':
        return <span className="px-2 py-0.5 text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/30">Confirmée</span>;
      case 'SHIPPED':
        return <span className="px-2 py-0.5 text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/30">Expédiée</span>;
      case 'DELIVERED':
        return <span className="px-2 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Livrée</span>;
      case 'CANCELLED':
        return <span className="px-2 py-0.5 text-[10px] bg-red-500/10 text-red-400 border border-red-500/30">Annulée</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] bg-gray-500/10 text-gray-400">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#2A2A2A] pb-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-white">Tableau de Bord Commercial</h1>
          <p className="text-xs text-[#8E8881] mt-1">
            Métriques d'activité réelles consolidées depuis la base de données.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto overflow-x-auto">
          <div className="flex bg-[#161616] p-1 border border-[#333] rounded">
            {periods.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  period === p.id
                    ? 'bg-[#C5A880] text-black font-semibold'
                    : 'text-[#8E8881] hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => loadStats(period)}
            title="Rafraîchir les métriques"
            className="p-2 bg-[#161616] border border-[#333] text-[#8E8881] hover:text-[#C5A880] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => loadStats(period)}
            className="underline hover:text-white"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="bg-[#141414] border border-[#2A2A2A] p-5">
          <div className="flex items-center justify-between text-[#8E8881] mb-2">
            <span className="text-xs uppercase tracking-wider">Chiffre d'Affaires</span>
            <TrendingUp className="w-4 h-4 text-[#C5A880]" />
          </div>
          <div className="font-serif text-2xl md:text-3xl text-white font-medium">
            {loading ? '—' : `${(metrics?.totalRevenue || 0).toLocaleString()} MAD`}
          </div>
          <p className="text-[11px] text-[#8E8881] mt-2">
            Commandes actives sur la période sélectionnée
          </p>
        </div>

        {/* Orders Count */}
        <div className="bg-[#141414] border border-[#2A2A2A] p-5">
          <div className="flex items-center justify-between text-[#8E8881] mb-2">
            <span className="text-xs uppercase tracking-wider">Commandes Totales</span>
            <ShoppingBag className="w-4 h-4 text-[#C5A880]" />
          </div>
          <div className="font-serif text-2xl md:text-3xl text-white font-medium">
            {loading ? '—' : metrics?.totalOrders || 0}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[#8E8881] mt-2">
            <span className="text-amber-400">{metrics?.pendingOrders || 0} en attente</span>
            <span>•</span>
            <span className="text-emerald-400">{metrics?.deliveredOrders || 0} livrées</span>
          </div>
        </div>

        {/* Panier Moyen */}
        <div className="bg-[#141414] border border-[#2A2A2A] p-5">
          <div className="flex items-center justify-between text-[#8E8881] mb-2">
            <span className="text-xs uppercase tracking-wider">Panier Moyen</span>
            <Calendar className="w-4 h-4 text-[#C5A880]" />
          </div>
          <div className="font-serif text-2xl md:text-3xl text-white font-medium">
            {loading ? '—' : `${(metrics?.averageOrderValue || 0).toLocaleString()} MAD`}
          </div>
          <p className="text-[11px] text-[#8E8881] mt-2">
            Dépense moyenne par commande
          </p>
        </div>

        {/* Inventory Status Alert */}
        <div className="bg-[#141414] border border-[#2A2A2A] p-5">
          <div className="flex items-center justify-between text-[#8E8881] mb-2">
            <span className="text-xs uppercase tracking-wider">Alertes de Stock</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-serif text-2xl md:text-3xl text-amber-300 font-medium">
            {loading ? '—' : (metrics?.lowStockVariants || 0) + (metrics?.outOfStockVariants || 0)}
          </div>
          <div className="flex items-center gap-2 text-[11px] mt-2">
            <span className="text-red-400">{metrics?.outOfStockVariants || 0} rupture(s)</span>
            <span>•</span>
            <span className="text-amber-400">{metrics?.lowStockVariants || 0} stock faible</span>
          </div>
        </div>
      </div>

      {/* Orders & Best Sellers split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-[#141414] border border-[#2A2A2A] p-6">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4 mb-4">
            <h2 className="font-serif text-lg text-white">Dernières Commandes</h2>
            <Link
              to="/admin/orders"
              className="text-xs text-[#C5A880] hover:underline inline-flex items-center gap-1"
            >
              <span>Voir tout</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-12 text-[#8E8881] text-xs">
              <ShoppingBag className="w-8 h-8 mx-auto text-[#444] mb-3" />
              <p>Aucune commande enregistrée pour le moment.</p>
              <p className="text-[10px] text-[#666] mt-1">
                Les commandes passées par les clients apparaîtront ici en temps réel.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead>
                  <tr className="text-[#8E8881] border-b border-[#222]">
                    <th className="pb-3 font-normal text-start">N° Commande</th>
                    <th className="pb-3 font-normal text-start">Client</th>
                    <th className="pb-3 font-normal text-start">Statut</th>
                    <th className="pb-3 font-normal text-end">Montant</th>
                    <th className="pb-3 font-normal text-end">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222]">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#1A1A1A] transition-colors">
                      <td className="py-3 font-mono font-medium text-white">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 text-[#ECE7DF]">{order.customer}</td>
                      <td className="py-3">{getStatusBadge(order.status)}</td>
                      <td className="py-3 text-end font-semibold text-white">
                        {order.total} MAD
                      </td>
                      <td className="py-3 text-end text-[#8E8881]">
                        {new Date(order.date).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Selling Parfums */}
        <div className="lg:col-span-4 bg-[#141414] border border-[#2A2A2A] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4 mb-4">
              <h2 className="font-serif text-lg text-white">Meilleures Ventes</h2>
              <Link to="/admin/products" className="text-xs text-[#C5A880] hover:underline">
                Catalogue
              </Link>
            </div>

            {topSelling.length === 0 ? (
              <div className="text-center py-10 text-[#8E8881] text-xs">
                <Package className="w-8 h-8 mx-auto text-[#444] mb-3" />
                <p>Aucune vente enregistrée sur cette période.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topSelling.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="truncate pr-2">
                      <p className="font-medium text-white truncate">{item.name}</p>
                      <p className="text-[10px] text-[#8E8881]">{item.soldQuantity} flacon(s) vendu(s)</p>
                    </div>
                    <span className="font-semibold text-[#C5A880] whitespace-nowrap">
                      {item.revenue.toLocaleString()} MAD
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-[#222]">
            <Link
              to="/admin/inventory"
              className="block w-full py-2.5 bg-[#1C1C1C] border border-[#333] hover:border-[#C5A880] text-center text-xs text-[#C5A880] uppercase tracking-wider transition-colors"
            >
              Gérer les approvisionnements
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
