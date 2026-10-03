import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Package,
  Edit,
  Eye,
  Trash2,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deletingId, setDeletingId] = useState(null);

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getProducts({
        q: search || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });
      setProducts(data.items || []);
    } catch (err) {
      console.error('Failed to load products', err);
      setError('Impossible de récupérer la liste des produits.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadProducts();
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Supprimer définitivement « ${product.name} » (SKU ${product.sku}) ?\n\nCette action est irréversible. Les commandes passées conservent l'historique sans lien produit.`
    );
    if (!confirmed) return;

    setDeletingId(product.id);
    setError('');
    try {
      await adminService.deleteProduct(product.id);
      setProducts((prev) => prev.filter((item) => item.id !== product.id));
    } catch (err) {
      const msg =
        err.response?.data?.error?.message ||
        'Impossible de supprimer ce produit.';
      setError(msg);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#2A2A2A] pb-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-white">Gestion du Catalogue</h1>
          <p className="text-xs text-[#8E8881] mt-1">
            Création, modification des formules, contenances (30ml, 50ml, 100ml) et stocks.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="px-4 py-2.5 bg-[#C5A880] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#d5ba94] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Créer un parfum</span>
        </Link>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#141414] border border-[#2A2A2A] p-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#8E8881] absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, SKU ou slug..."
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
            <option value="PUBLISHED">Publiés</option>
            <option value="DRAFT">Brouillons</option>
            <option value="ARCHIVED">Archivés</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
          {error}
        </div>
      )}

      {/* Products Table */}
      <div className="bg-[#141414] border border-[#2A2A2A] overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-[#8E8881] text-xs">
            Chargement du catalogue en cours...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-[#8E8881] text-xs space-y-3">
            <Package className="w-10 h-10 mx-auto text-[#444]" />
            <p className="text-sm text-white">Aucun parfum trouvé.</p>
            <p className="text-[#666]">
              Créez une première création olfactive ou lancez le seed de données.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="border-b border-[#2A2A2A] bg-[#181818] text-[#8E8881]">
                  <th className="py-3 px-4 text-start font-normal">Visuel</th>
                  <th className="py-3 px-4 text-start font-normal">Nom & SKU</th>
                  <th className="py-3 px-4 text-start font-normal">Univers</th>
                  <th className="py-3 px-4 text-end font-normal">Prix Base</th>
                  <th className="py-3 px-4 text-center font-normal">Stock Global</th>
                  <th className="py-3 px-4 text-center font-normal">Statut</th>
                  <th className="py-3 px-4 text-end font-normal">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#1A1A1A] transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-12 h-14 bg-[#222] border border-[#333] overflow-hidden flex items-center justify-center">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-5 h-5 text-[#555]" />
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-serif text-sm font-medium text-white">{p.name}</p>
                      <p className="font-mono text-[10px] text-[#8E8881] mt-0.5">
                        SKU : {p.sku} | /{p.slug}
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[11px] text-[#C5A880] uppercase tracking-wider">
                        {p.genderCategory === 'MEN'
                          ? 'Homme'
                          : p.genderCategory === 'WOMEN'
                          ? 'Femme'
                          : 'Unisexe'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-end">
                      <span className="font-semibold text-white">{p.basePrice} MAD</span>
                      {p.salePrice && (
                        <span className="block text-[10px] text-red-400 line-through">
                          {p.salePrice} MAD
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-mono ${
                          p.totalStock > 10
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : p.totalStock > 0
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {p.totalStock} unités ({p.variantsCount} vol.)
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                          p.status === 'PUBLISHED'
                            ? 'bg-emerald-500/15 text-emerald-300'
                            : p.status === 'DRAFT'
                            ? 'bg-amber-500/15 text-amber-300'
                            : 'bg-gray-700/30 text-gray-400'
                        }`}
                      >
                        {p.status === 'PUBLISHED' ? 'Actif' : p.status === 'DRAFT' ? 'Brouillon' : 'Archivé'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-end">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/product/${p.slug}`}
                          target="_blank"
                          title="Voir sur la boutique"
                          className="p-1.5 text-[#888] hover:text-[#C5A880] transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/products/${p.id}/edit`}
                          title="Modifier"
                          className="p-1.5 text-[#888] hover:text-[#C5A880] transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          title="Supprimer"
                          disabled={deletingId === p.id}
                          onClick={() => handleDelete(p)}
                          className="p-1.5 text-[#888] hover:text-red-400 transition-colors disabled:opacity-40"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
