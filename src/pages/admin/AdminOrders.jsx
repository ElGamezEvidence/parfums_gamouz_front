import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Download,
  Eye,
  MessageCircle,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await adminService.getOrders({
        q: search || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });
      setOrders(data.items || []);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadOrders();
  };

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setStatusComment('');
    setStatusModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsUpdating(true);
    try {
      await adminService.updateOrderStatus(selectedOrder.id, {
        status: newStatus,
        comment: statusComment || undefined,
      });
      setStatusModalOpen(false);
      loadOrders();
    } catch (err) {
      console.error('Status update failed', err);
      alert('Erreur lors de la mise à jour du statut.');
    } finally {
      setIsUpdating(false);
    }
  };

  const exportCSV = () => {
    if (orders.length === 0) return;
    const headers = ['OrderNumber', 'Customer', 'Phone', 'City', 'Total_MAD', 'Status', 'PaymentMethod', 'Date'];
    const rows = orders.map((o) => [
      o.orderNumber,
      `"${o.customerName}"`,
      o.customerPhone,
      `"${o.shippingCity}"`,
      o.totalAmount,
      o.orderStatus,
      o.paymentMethod,
      o.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gamouze_commandes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2 py-0.5 text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30">En attente</span>;
      case 'CONFIRMED':
        return <span className="px-2 py-0.5 text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/30">Confirmée</span>;
      case 'PROCESSING':
        return <span className="px-2 py-0.5 text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">En préparation</span>;
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
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#2A2A2A] pb-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-white">Gestion des Commandes</h1>
          <p className="text-xs text-[#8E8881] mt-1">
            Suivi des ventes, gestion des expéditions et contact direct client via WhatsApp.
          </p>
        </div>

        <button
          onClick={exportCSV}
          disabled={orders.length === 0}
          className="px-4 py-2.5 bg-[#1C1C1C] border border-[#333] hover:border-[#C5A880] text-[#C5A880] text-xs uppercase tracking-wider flex items-center gap-2 transition-colors disabled:opacity-40"
        >
          <Download className="w-4 h-4" />
          <span>Exporter CSV</span>
        </button>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#141414] border border-[#2A2A2A] p-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#8E8881] absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="N° commande, téléphone, client..."
            className="w-full bg-[#1C1C1C] border border-[#333] px-9 py-2 text-xs text-white focus:outline-none focus:border-[#C5A880]"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-[#8E8881]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-[#ECE7DF] focus:outline-none focus:border-[#C5A880]"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="PENDING">En attente</option>
            <option value="CONFIRMED">Confirmée</option>
            <option value="PROCESSING">En préparation</option>
            <option value="SHIPPED">Expédiée</option>
            <option value="DELIVERED">Livrée</option>
            <option value="CANCELLED">Annulée</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#141414] border border-[#2A2A2A] overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-[#8E8881] text-xs">
            Chargement des commandes en cours...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-[#8E8881] text-xs space-y-3">
            <ShoppingBag className="w-10 h-10 mx-auto text-[#444]" />
            <p className="text-sm text-white">Aucune commande trouvée.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="border-b border-[#2A2A2A] bg-[#181818] text-[#8E8881]">
                  <th className="py-3 px-4 text-start font-normal">N° Commande</th>
                  <th className="py-3 px-4 text-start font-normal">Client & Ville</th>
                  <th className="py-3 px-4 text-start font-normal">Paiement</th>
                  <th className="py-3 px-4 text-center font-normal">Statut</th>
                  <th className="py-3 px-4 text-end font-normal">Total</th>
                  <th className="py-3 px-4 text-end font-normal">Date</th>
                  <th className="py-3 px-4 text-end font-normal">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                {orders.map((o) => {
                  const cleanPhone = o.customerPhone ? o.customerPhone.replace(/[^0-9]/g, '') : '';
                  const whatsappMessage = encodeURIComponent(
                    `Bonjour ${o.customerName}, Maison GAMOUZE vous contacte au sujet de votre commande N° ${o.orderNumber}.`
                  );
                  const whatsappUrl = `https://wa.me/${cleanPhone.startsWith('0') ? '212' + cleanPhone.slice(1) : cleanPhone}?text=${whatsappMessage}`;

                  return (
                    <tr key={o.id} className="hover:bg-[#1A1A1A] transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-white">
                        {o.orderNumber}
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-medium text-white">{o.customerName}</p>
                        <p className="text-[11px] text-[#8E8881]">{o.shippingCity} • {o.customerPhone}</p>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-[11px] uppercase tracking-wider text-[#A0988E]">
                          {o.paymentMethod === 'COD' ? 'Livraison (Espèces)' : 'Paiement en ligne'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        {getStatusBadge(o.orderStatus)}
                      </td>

                      <td className="py-3 px-4 text-end font-semibold text-white">
                        {o.totalAmount} MAD
                      </td>

                      <td className="py-3 px-4 text-end text-[#8E8881]">
                        {new Date(o.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>

                      <td className="py-3 px-4 text-end">
                        <div className="flex items-center justify-end gap-2">
                          {/* Direct WhatsApp client follow-up button */}
                          {cleanPhone && (
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noreferrer"
                              title="Contacter le client sur WhatsApp"
                              className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 rounded transition-colors"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}

                          <button
                            onClick={() => openStatusModal(o)}
                            title="Modifier le statut de la commande"
                            className="px-2.5 py-1 bg-[#1C1C1C] border border-[#333] hover:border-[#C5A880] text-[11px] text-[#C5A880] transition-colors"
                          >
                            Statut
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Update Order Status */}
      {statusModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2A2A2A] w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="border-b border-[#2A2A2A] pb-3">
              <h2 className="font-serif text-lg text-white">Modifier le statut de la commande</h2>
              <p className="font-mono text-xs text-[#C5A880] mt-1">{selectedOrder.orderNumber}</p>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
                  Nouveau statut
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                >
                  <option value="PENDING">En attente (PENDING)</option>
                  <option value="CONFIRMED">Confirmée (CONFIRMED)</option>
                  <option value="PROCESSING">En préparation (PROCESSING)</option>
                  <option value="SHIPPED">Expédiée (SHIPPED)</option>
                  <option value="DELIVERED">Livrée (DELIVERED)</option>
                  <option value="CANCELLED">Annulée (CANCELLED - Restaure le stock)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
                  Commentaire / Note d'expédition
                </label>
                <textarea
                  rows={2}
                  value={statusComment}
                  onChange={(e) => setStatusComment(e.target.value)}
                  placeholder="Ex: Expédié avec le transporteur Amana / Colis remis au livreur..."
                  className="w-full bg-[#1C1C1C] border border-[#333] p-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStatusModalOpen(false)}
                  className="px-4 py-2 bg-[#1C1C1C] text-[#8E8881] text-xs hover:text-white"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-[#C5A880] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#d5ba94] disabled:opacity-50"
                >
                  {isUpdating ? 'Mise à jour...' : 'Confirmer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
