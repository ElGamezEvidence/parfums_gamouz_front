import React, { useState, useEffect } from 'react';
import {
  Boxes,
  Plus,
  Minus,
  AlertTriangle,
  RefreshCw,
  Search,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantityChange, setQuantityChange] = useState('');
  const [reason, setReason] = useState('');
  const [movementType, setMovementType] = useState('IN');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminService.getProducts({ limit: 100 });
      setProducts(data.items || []);
    } catch (err) {
      console.error('Failed to load inventory', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAdjustmentModal = (variant, type = 'IN') => {
    setSelectedVariant(variant);
    setMovementType(type);
    setQuantityChange('');
    setReason(type === 'IN' ? 'Réception réassort atelier' : 'Correction inventaire physique');
    setModalOpen(true);
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVariant || !quantityChange || !reason) return;

    setIsSubmitting(true);
    try {
      const qty = movementType === 'OUT' ? -Math.abs(Number(quantityChange)) : Math.abs(Number(quantityChange));
      await adminService.adjustStock(selectedVariant.id, qty, reason, movementType);
      setModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Inventory adjustment failed', err);
      alert('Erreur lors du mouvement de stock.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#2A2A2A] pb-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-white">Inventaire & Gestion des Stocks</h1>
          <p className="text-xs text-[#8E8881] mt-1">
            Suivi en temps réel des flacons par contenance (30ml, 50ml, 100ml) et mouvements tracés.
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-4 py-2 bg-[#1C1C1C] border border-[#333] hover:border-[#C5A880] text-[#C5A880] text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Inventory table by product */}
      <div className="space-y-4">
        {products.map((p) => (
          <div key={p.id} className="bg-[#141414] border border-[#2A2A2A] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#222] border border-[#333] flex items-center justify-center">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-5 h-5 text-[#666]" />
                  )}
                </div>
                <div>
                  <h2 className="font-serif text-base text-white">{p.name}</h2>
                  <p className="font-mono text-[10px] text-[#8E8881]">SKU : {p.sku}</p>
                </div>
              </div>

              <div className="text-end">
                <span className="text-xs text-[#8E8881]">Total Stock : </span>
                <span className="font-semibold text-[#C5A880]">{p.totalStock} unités</span>
              </div>
            </div>

            {/* Variants table */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {p.variants && p.variants.length > 0 ? (
                p.variants.map((v) => (
                  <div
                    key={v.id}
                    className="bg-[#181818] border border-[#2A2A2A] p-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-serif text-xs font-semibold text-white">{v.volume}</p>
                      <p className="text-[10px] text-[#8E8881]">{v.price} MAD</p>
                      <p
                        className={`text-[11px] font-mono font-medium mt-1 ${
                          v.stockQuantity <= 5 ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        {v.stockQuantity} en stock
                      </p>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => openAdjustmentModal(v, 'IN')}
                        title="Ajouter du stock (+)"
                        className="p-1.5 bg-[#222] hover:bg-emerald-950 text-emerald-400 border border-[#333] rounded"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openAdjustmentModal(v, 'OUT')}
                        title="Retirer du stock (-)"
                        className="p-1.5 bg-[#222] hover:bg-red-950 text-red-400 border border-[#333] rounded"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-[#8E8881] py-2 col-span-3">
                  Stock initial : {p.totalStock} unités
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Movement Modal */}
      {modalOpen && selectedVariant && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2A2A2A] w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="border-b border-[#2A2A2A] pb-3">
              <h2 className="font-serif text-lg text-white">
                {movementType === 'IN' ? 'Entrée de Stock (+)' : 'Sortie / Ajustement de Stock (-)'}
              </h2>
              <p className="text-xs text-[#C5A880] mt-1">
                Contenance : {selectedVariant.volume} | Stock actuel : {selectedVariant.stockQuantity}
              </p>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
                  Quantité de flacons à {movementType === 'IN' ? 'ajouter' : 'déduire'} *
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantityChange}
                  onChange={(e) => setQuantityChange(e.target.value)}
                  placeholder="Ex: 25"
                  className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
                  Motif du mouvement (traçabilité) *
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Réapprovisionnement atelier, casse, inventaire..."
                  className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-[#1C1C1C] text-[#8E8881] text-xs hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#C5A880] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#d5ba94]"
                >
                  {isSubmitting ? 'Validation...' : 'Valider le mouvement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
