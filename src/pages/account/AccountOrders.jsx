import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Package, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';

export const AccountOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [trackNumber, setTrackNumber] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLocalOrders = async () => {
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('gamouze_orders');
          if (raw) setOrders(JSON.parse(raw));
        } catch (e) {
          console.warn('Orders read error', e);
        }
      }
    };
    fetchLocalOrders();
  }, []);

  const handleTrack = async (e) => {
    e.preventDefault();
    setSearchError('');
    setTrackedOrder(null);
    if (!trackNumber.trim()) return;

    setLoading(true);
    try {
      const found = await orderService.getOrderByNumber(trackNumber.trim());
      if (found) {
        setTrackedOrder(found);
      } else {
        setSearchError('Aucune commande ne correspond à ce numéro.');
      }
    } catch (err) {
      setSearchError('Erreur lors de la recherche de la commande.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 font-sans">
      <div className="border-b border-brand-black/10 pb-6 mb-8 flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl text-brand-black">Mes Commandes</h1>
          <p className="text-xs text-brand-muted mt-1">
            {user ? `Connecté en tant que ${user.email}` : 'Suivi de commande et historique de vos achats'}
          </p>
        </div>

        <Link
          to="/shop"
          className="px-4 py-2 bg-brand-black text-brand-cream text-xs uppercase tracking-wider hover:bg-brand-surface"
        >
          Découvrir la collection
        </Link>
      </div>

      {/* Guest tracker box */}
      <div className="bg-white border border-brand-black/10 p-6 shadow-luxury mb-10">
        <h2 className="font-serif text-base text-brand-black mb-2">Suivre une commande invitée</h2>
        <form onSubmit={handleTrack} className="flex gap-3">
          <input
            type="text"
            value={trackNumber}
            onChange={(e) => setTrackNumber(e.target.value)}
            placeholder="Numéro de commande (ex: GZ-2026-12345)"
            className="flex-1 bg-brand-cream border border-brand-black/10 px-3 py-2 text-xs text-brand-black focus:outline-none focus:border-brand-gold font-mono"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-brand-gold text-brand-black font-semibold text-xs uppercase tracking-wider hover:bg-brand-gold-light"
          >
            {loading ? 'Recherche...' : 'Suivre'}
          </button>
        </form>

        {searchError && (
          <p className="text-xs text-red-600 mt-2">{searchError}</p>
        )}

        {trackedOrder && (
          <div className="mt-4 p-4 bg-brand-cream border border-brand-gold/30 space-y-2 text-xs">
            <div className="flex justify-between font-bold">
              <span>Commande N° {trackedOrder.orderNumber || trackedOrder.orderId}</span>
              <span className="text-brand-gold-dark">{trackedOrder.orderStatus || trackedOrder.status}</span>
            </div>
            <p>Destinataire : {trackedOrder.customerFirstName} {trackedOrder.customerLastName} ({trackedOrder.shippingCity})</p>
            <p className="font-semibold text-brand-black">Total : {trackedOrder.totalAmount || trackedOrder.total} MAD</p>
          </div>
        )}
      </div>

      {/* Orders list */}
      <div className="space-y-4">
        <h2 className="font-serif text-lg text-brand-black">Historique récent</h2>
        {orders.length === 0 ? (
          <div className="bg-white border border-brand-black/10 p-12 text-center text-xs text-brand-muted">
            <ShoppingBag className="w-8 h-8 mx-auto text-brand-muted/40 mb-3" />
            <p>Vous n'avez pas encore passé de commande.</p>
          </div>
        ) : (
          orders.map((o, idx) => (
            <div key={idx} className="bg-white border border-brand-black/10 p-5 flex justify-between items-center text-xs shadow-sm">
              <div className="space-y-1">
                <span className="font-mono font-bold text-brand-black text-sm">
                  {o.orderNumber || o.orderId}
                </span>
                <p className="text-brand-muted">
                  {new Date(o.createdAt).toLocaleDateString('fr-FR')} • {o.items?.length || 1} article(s)
                </p>
              </div>

              <div className="text-end space-y-1">
                <span className="font-semibold text-brand-black block text-sm">
                  {o.totalAmount || o.total} MAD
                </span>
                <span className="inline-block px-2 py-0.5 text-[10px] bg-amber-50 text-amber-700 border border-amber-200">
                  {o.orderStatus || o.status || 'PENDING'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
