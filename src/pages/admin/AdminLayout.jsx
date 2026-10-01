import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Boxes,
  TicketPercent,
  Star,
  FileText,
  Users,
  Settings,
  ShieldCheck,
  FileClock,
  LogOut,
  ExternalLink,
  AlertTriangle,
  Menu,
  X,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LanguageSwitcher } from '../../components/ui/LanguageSwitcher';
import { useLanguage } from '../../hooks/useLanguage';

export const AdminLayout = () => {
  const { user, logout, isSuperAdmin, mustChangePassword } = useAuth();
  const { isRtl } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const fullNavItems = [
    { to: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'Produits & Parfums', icon: Package },
    { to: '/admin/categories', label: 'Catégories', icon: FolderTree },
    { to: '/admin/orders', label: 'Commandes', icon: ShoppingBag },
    { to: '/admin/inventory', label: 'Inventaire & Stocks', icon: Boxes },
    { to: '/admin/coupons', label: 'Codes Promos', icon: TicketPercent },
    { to: '/admin/reviews', label: 'Avis Clients', icon: Star },
    { to: '/admin/content', label: 'Contenu & CMS', icon: FileText },
    { to: '/admin/customers', label: 'Clients', icon: Users },
    { to: '/admin/settings', label: 'Paramètres Boutique', icon: Settings },
    { to: '/admin/change-password', label: 'Mot de passe', icon: KeyRound },
  ];

  if (isSuperAdmin) {
    fullNavItems.push(
      { to: '/admin/users', label: 'Équipe & Droits', icon: ShieldCheck },
      { to: '/admin/audit-logs', label: "Journal d'Audit", icon: FileClock }
    );
  }

  const navItems = mustChangePassword
    ? fullNavItems.filter((item) => item.to === '/admin/change-password')
    : fullNavItems;

  const sidebarContent = (
    <>
      <div className="p-4 sm:p-6 border-b border-[#2A2A2A] flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-3">
          <span className="font-serif text-xl sm:text-2xl tracking-widest text-[#C5A880] font-semibold">
            GAAMOUZE
          </span>
          <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 bg-[#C5A880]/15 text-[#C5A880] border border-[#C5A880]/30 rounded">
            Admin
          </span>
        </Link>
        <button
          type="button"
          className="md:hidden p-2 text-[#A0988E] hover:text-white"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Fermer le menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="p-4 space-y-1 overflow-y-auto flex-1 max-h-[calc(100vh-220px)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileNavOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 sm:py-2.5 rounded-sm text-xs font-medium transition-colors min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C5A880] ${
                  isActive
                    ? 'bg-[#C5A880] text-black font-semibold shadow-gold-glow'
                    : 'text-[#A0988E] hover:text-white hover:bg-[#1E1E1E]'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#2A2A2A] bg-[#111111] space-y-3">
        <div className="flex items-center justify-between text-xs gap-2">
          <div className="truncate min-w-0">
            <p className="font-medium text-white truncate">{user?.email || 'Administrateur'}</p>
            <p className="text-[10px] text-[#C5A880] uppercase tracking-wider">{user?.role || 'STAFF'}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Se déconnecter"
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#888] hover:text-red-400 hover:bg-[#222] rounded transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C5A880]"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-2 border-t border-[#222] flex items-center justify-between gap-2">
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] text-[#A0988E] hover:text-[#C5A880] transition-colors py-2"
          >
            <span>Voir la boutique</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </>
  );

  return (
    <div
      className={`min-h-screen bg-[#0E0E0E] text-[#ECE7DF] flex flex-col md:flex-row font-sans ${isRtl ? 'font-arabic' : ''}`}
    >
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-[#141414] border-b border-[#2A2A2A]">
        <Link to="/admin" className="font-serif text-lg tracking-widest text-[#C5A880]">
          GAAMOUZE
        </Link>
        <button
          type="button"
          className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#ECE7DF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C5A880]"
          onClick={() => setMobileNavOpen(true)}
          aria-expanded={mobileNavOpen}
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <button
            type="button"
            className="flex-1 bg-black/60"
            aria-label="Fermer le menu"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside
            className={`w-[min(100%,20rem)] max-w-full bg-[#141414] border-[#2A2A2A] flex flex-col h-full shadow-2xl ${
              isRtl ? 'border-s' : 'border-e'
            }`}
          >
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 bg-[#141414] border-e border-[#2A2A2A] flex-col justify-between shrink-0">
        {sidebarContent}
      </aside>

      <div className="flex-1 flex flex-col min-w-0 bg-[#0C0C0C]">
        {mustChangePassword && (
          <div className="bg-amber-950/70 border-b border-amber-600/50 px-4 sm:px-6 py-3 text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
            <div className="flex items-start sm:items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
              <span>
                <strong>Sécurité requise :</strong> Vous utilisez le mot de passe initial. Vous devez le modifier pour sécuriser votre accès.
              </span>
            </div>
            <Link
              to="/admin/change-password"
              className="px-3 py-2 sm:py-1 bg-amber-500 text-black text-[11px] font-semibold hover:bg-amber-400 transition-colors uppercase tracking-wider text-center min-h-[44px] sm:min-h-0 flex items-center justify-center"
            >
              Changer maintenant
            </Link>
          </div>
        )}

        <main className="p-4 sm:p-6 md:p-10 flex-1 overflow-x-auto max-w-[1920px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
