import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('MANAGER');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password || !firstName.trim() || !lastName.trim()) return;

    setIsSubmitting(true);
    try {
      await adminService.createUser({
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role,
      });
      setModalOpen(false);
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      loadUsers();
    } catch (err) {
      console.error('Create user error', err);
      alert('Erreur lors de la création du compte collaborateur.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#2A2A2A] pb-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-white">Équipe & Gestion des Droits (RBAC)</h1>
          <p className="text-xs text-[#8E8881] mt-1">
            Gestion des rôles : SUPER_ADMIN, ADMIN, MANAGER, EDITOR, SUPPORT.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-[#C5A880] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#d5ba94] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Collaborateur</span>
        </button>
      </div>

      <div className="bg-[#141414] border border-[#2A2A2A] overflow-x-auto">
        <table className="w-full text-start text-xs">
          <thead>
            <tr className="border-b border-[#2A2A2A] bg-[#181818] text-[#8E8881]">
              <th className="py-3 px-4 text-start font-normal">Collaborateur</th>
              <th className="py-3 px-4 text-start font-normal">Email</th>
              <th className="py-3 px-4 text-center font-normal">Rôle</th>
              <th className="py-3 px-4 text-center font-normal">Sécurité</th>
              <th className="py-3 px-4 text-end font-normal">Dernière Connexion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222]">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-[#1A1A1A]">
                <td className="py-3 px-4 font-medium text-white">
                  {u.firstName} {u.lastName}
                </td>
                <td className="py-3 px-4 text-[#ECE7DF] font-mono">{u.email}</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 text-[10px] bg-[#C5A880]/15 text-[#C5A880] border border-[#C5A880]/30 rounded">
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  {u.mustChangePassword ? (
                    <span className="text-[10px] text-amber-400">Mot de passe temporaire</span>
                  ) : (
                    <span className="text-[10px] text-emerald-400">Sécurisé</span>
                  )}
                </td>
                <td className="py-3 px-4 text-end text-[#8E8881]">
                  {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString('fr-FR') : 'Jamais'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2A2A2A] w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h2 className="font-serif text-lg text-white border-b border-[#2A2A2A] pb-3">
              Créer un Compte Collaborateur
            </h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#C5A880] mb-1">Prénom *</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#C5A880] mb-1">Nom *</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#C5A880] mb-1">Email / Identifiant *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-[#C5A880] mb-1">Mot de passe temporaire initial *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 caractères"
                  className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white"
                  required
                />
                <span className="text-[10px] text-[#8E8881] block mt-1">
                  Le collaborateur devra obligatoirement le changer lors de son premier accès.
                </span>
              </div>

              <div>
                <label className="block text-xs text-[#C5A880] mb-1">Rôle et permissions *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white"
                >
                  <option value="ADMIN">ADMIN (Gestion générale)</option>
                  <option value="MANAGER">MANAGER (Produits, commandes, stocks)</option>
                  <option value="EDITOR">EDITOR (Contenus et catalogue)</option>
                  <option value="SUPPORT">SUPPORT (Commandes et messages)</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Accès total)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-[#1C1C1C] text-[#8E8881] text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#C5A880] text-black font-semibold text-xs uppercase tracking-wider"
                >
                  {isSubmitting ? 'Création...' : 'Créer le collaborateur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
