import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import {
  Shield,
  ShieldCheck,
  Palette,
  Code2,
  Users,
  Check,
  RotateCcw,
  Save,
  CheckSquare,
  Square,
  HelpCircle,
  Sparkles,
  LayoutDashboard,
  FileText,
  Briefcase,
  DollarSign,
  Printer,
  Image,
  MessageSquare,
  Globe,
  Tag,
  Calendar,
  BookOpen,
  Share2,
} from 'lucide-react';
import apiClient from '../../services/api';

interface MenuDefinition {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface MenuGroup {
  groupName: string;
  badge: string;
  items: MenuDefinition[];
}

const MENU_GROUPS: MenuGroup[] = [
  {
    groupName: 'Utama',
    badge: 'Core',
    items: [
      {
        id: 'overview',
        label: 'Overview',
        description: 'Ringkasan statistik, aktivitas, dan metrik performa',
        icon: <LayoutDashboard className="w-4 h-4 text-blue-500" />,
      },
    ],
  },
  {
    groupName: 'Manajemen Akun & Sistem',
    badge: 'Admin',
    items: [
      {
        id: 'users',
        label: 'Users & Tim',
        description: 'Manajemen akun pengguna, profil tim, dan status',
        icon: <Users className="w-4 h-4 text-purple-500" />,
      },
      {
        id: 'hak-akses',
        label: 'Hak Akses',
        description: 'Konfigurasi izin akses menu berdasarkan role',
        icon: <ShieldCheck className="w-4 h-4 text-indigo-500" />,
      },
      {
        id: 'reports',
        label: 'Laporan',
        description: 'Laporan performa, aktivitas, dan analitik bisnis',
        icon: <FileText className="w-4 h-4 text-emerald-500" />,
      },
    ],
  },
  {
    groupName: 'Operasional & Bisnis',
    badge: 'Finansial',
    items: [
      {
        id: 'clients',
        label: 'Klien',
        description: 'Data klien, kontak proyek, dan kredensial cPanel',
        icon: <Briefcase className="w-4 h-4 text-amber-500" />,
      },
      {
        id: 'invoices',
        label: 'Invoice & Termin',
        description: 'Faktur tagihan, termin pembayaran DP/pelunasan',
        icon: <DollarSign className="w-4 h-4 text-green-500" />,
      },
      {
        id: 'finances',
        label: 'Keuangan NexCube',
        description: 'Pencatatan kas masuk/keluar divisi NexCube',
        icon: <DollarSign className="w-4 h-4 text-teal-500" />,
      },
      {
        id: 'finances/printing',
        label: 'Keuangan Printing',
        description: 'Pencatatan kas, biaya cetak, dan import CSV printing',
        icon: <Printer className="w-4 h-4 text-cyan-500" />,
      },
    ],
  },
  {
    groupName: 'Konten Publik',
    badge: 'Showcase',
    items: [
      {
        id: 'portfolios',
        label: 'Portofolio',
        description: 'Galeri karya dan studi kasus website/desain',
        icon: <Image className="w-4 h-4 text-rose-500" />,
      },
      {
        id: 'testimonials',
        label: 'Testimonial',
        description: 'Moderasi ulasan dan kepuasan pelanggan',
        icon: <MessageSquare className="w-4 h-4 text-orange-500" />,
      },
    ],
  },
  {
    groupName: 'Layanan & Paket',
    badge: 'Paket',
    items: [
      {
        id: 'paket/website',
        label: 'Paket Website',
        description: 'Katalog paket pembuatan website & web app',
        icon: <Globe className="w-4 h-4 text-blue-500" />,
      },
      {
        id: 'paket/desain',
        label: 'Paket Desain Grafis',
        description: 'Katalog paket desain visual, branding, dan logo',
        icon: <Palette className="w-4 h-4 text-pink-500" />,
      },
      {
        id: 'paket/event',
        label: 'Paket Event',
        description: 'Katalog paket undangan & perlengkapan event digital',
        icon: <Calendar className="w-4 h-4 text-violet-500" />,
      },
      {
        id: 'paket/katalog',
        label: 'Paket Katalog Digital',
        description: 'Katalog paket buku menu & profil interaktif',
        icon: <BookOpen className="w-4 h-4 text-amber-500" />,
      },
      {
        id: 'paket/affiliate',
        label: 'Paket Affiliate',
        description: 'Program kemitraan dan komisi affiliate',
        icon: <Share2 className="w-4 h-4 text-red-500" />,
      },
    ],
  },
];

interface RoleMeta {
  role: string;
  label: string;
  description: string;
  badgeClass: string;
  bgLight: string;
  accentColor: string;
  icon: React.ReactNode;
}

const ROLES: RoleMeta[] = [
  {
    role: 'admin',
    label: 'Admin',
    description: 'Akses penuh ke seluruh menu dan pengaturan sistem',
    badgeClass: 'bg-purple-100 text-purple-700 border-purple-200',
    bgLight: 'bg-purple-50/50',
    accentColor: 'text-purple-600',
    icon: <ShieldCheck className="w-4 h-4 text-purple-600" />,
  },
  {
    role: 'designer',
    label: 'Designer',
    description: 'Fokus pada Portofolio, Paket Desain, Katalog, & Konten',
    badgeClass: 'bg-pink-100 text-pink-700 border-pink-200',
    bgLight: 'bg-pink-50/50',
    accentColor: 'text-pink-600',
    icon: <Palette className="w-4 h-4 text-pink-600" />,
  },
  {
    role: 'teknis',
    label: 'Teknis',
    description: 'Fokus pada Website, Development, Event, & Operasional',
    badgeClass: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    bgLight: 'bg-cyan-50/50',
    accentColor: 'text-cyan-600',
    icon: <Code2 className="w-4 h-4 text-cyan-600" />,
  },
  {
    role: 'user',
    label: 'User',
    description: 'Akses pengguna standar dan klien',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    bgLight: 'bg-slate-50/50',
    accentColor: 'text-slate-600',
    icon: <Users className="w-4 h-4 text-slate-600" />,
  },
];

export const HakAksesManagement: React.FC = () => {
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load current permissions from BE
  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getRolePermissions();
      if (res.success && res.data) {
        setPermissions(res.data);
      }
    } catch (err: any) {
      toast.error(err.message || 'Gagal memuat hak akses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  // Check if role has a menu
  const hasAccess = (role: string, menuId: string) => {
    if (role === 'admin') return true; // Admin always has full access
    const rolePerms = permissions[role] || [];
    return rolePerms.includes(menuId);
  };

  // Toggle single menu access
  const toggleAccess = (role: string, menuId: string) => {
    if (role === 'admin') {
      toast('Role Admin memiliki akses penuh secara permanen.', { icon: '🛡️' });
      return;
    }

    setPermissions((prev) => {
      const current = prev[role] || [];
      const updated = current.includes(menuId)
        ? current.filter((id) => id !== menuId)
        : [...current, menuId];

      return {
        ...prev,
        [role]: updated,
      };
    });
    setHasChanges(true);
  };

  // Select all menus for a role
  const selectAll = (role: string) => {
    if (role === 'admin') return;
    const allMenuIds = MENU_GROUPS.flatMap((g) => g.items.map((i) => i.id));
    setPermissions((prev) => ({
      ...prev,
      [role]: allMenuIds,
    }));
    setHasChanges(true);
  };

  // Clear all menus for a role
  const clearAll = (role: string) => {
    if (role === 'admin') return;
    // Always keep overview for safety
    setPermissions((prev) => ({
      ...prev,
      [role]: ['overview'],
    }));
    setHasChanges(true);
  };

  // Save all changes
  const handleSave = async () => {
    try {
      setSaving(true);
      for (const roleMeta of ROLES) {
        if (roleMeta.role === 'admin') continue;
        const rolePerms = permissions[roleMeta.role] || [];
        await apiClient.updateRolePermissions(roleMeta.role, rolePerms);
      }

      toast.success('Hak akses berhasil disimpan!');
      setHasChanges(false);

      // Notify Sidebar and current session immediately
      window.dispatchEvent(new CustomEvent('permissionsUpdated'));
      // Update local storage cache
      localStorage.setItem('rolePermissionsCache', JSON.stringify(permissions));
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan perubahan');
    } finally {
      setSaving(false);
    }
  };

  // Reset to default
  const handleReset = async () => {
    if (!window.confirm('Apakah Anda yakin ingin mereset seluruh hak akses ke konfigurasi bawaan?')) {
      return;
    }
    try {
      setSaving(true);
      const res = await apiClient.resetRolePermissions();
      if (res.success && res.data) {
        setPermissions(res.data);
        setHasChanges(false);
        toast.success('Hak akses berhasil direset ke default');
        window.dispatchEvent(new CustomEvent('permissionsUpdated'));
        localStorage.setItem('rolePermissionsCache', JSON.stringify(res.data));
      }
    } catch (err: any) {
      toast.error(err.message || 'Gagal mereset hak akses');
    } finally {
      setSaving(false);
    }
  };

  const totalMenus = MENU_GROUPS.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <>
      <Helmet>
        <title>Hak Akses Role | Dashboard NexCube</title>
      </Helmet>

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-xl shadow-md shadow-indigo-500/20">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Hak Akses & Otorisasi Role
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Atur menu dan fitur yang dapat dilihat oleh setiap role pengguna menggunakan checkbox.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleReset}
              disabled={saving || loading}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Default</span>
            </button>

            <button
              onClick={handleSave}
              disabled={saving || loading || !hasChanges}
              className={`inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-semibold text-white rounded-xl shadow-md transition-all duration-200 ${
                hasChanges
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25 scale-[1.02]'
                  : 'bg-slate-400 opacity-60 cursor-not-allowed shadow-none'
              }`}
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </div>

        {/* Changes Alert Banner */}
        {hasChanges && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-amber-800 text-xs sm:text-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Ada perubahan hak akses yang belum disimpan. Klik <strong>Simpan Perubahan</strong> untuk menerapkan ke sidebar.</span>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="underline font-bold text-amber-900 hover:text-amber-700"
            >
              Simpan Sekarang
            </button>
          </div>
        )}

        {/* Roles Quick Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROLES.map((role) => {
            const activeCount = role.role === 'admin' ? totalMenus : (permissions[role.role] || []).length;
            const percent = Math.round((activeCount / totalMenus) * 100);

            return (
              <div
                key={role.role}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${role.badgeClass}`}>
                        {role.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-snug">{role.description}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    {role.icon}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-black text-slate-800">{activeCount}</span>
                    <span className="text-xs text-slate-400"> / {totalMenus} Menu</span>
                  </div>
                  <span className="text-xs font-bold text-slate-600">{percent}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      role.role === 'admin'
                        ? 'bg-purple-600'
                        : role.role === 'designer'
                        ? 'bg-pink-500'
                        : role.role === 'teknis'
                        ? 'bg-cyan-500'
                        : 'bg-slate-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {role.role !== 'admin' && (
                  <div className="flex items-center gap-2 pt-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => selectAll(role.role)}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Pilih Semua
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={() => clearAll(role.role)}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      Kosongkan
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Matrix Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div>
              <h2 className="text-base font-bold text-slate-900">Matriks Hak Akses Menu</h2>
              <p className="text-xs text-slate-500">
                Centang kotak pada baris menu untuk memberikan hak akses kepada masing-masing role.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-blue-600" /> Aktif
              </span>
              <span className="flex items-center gap-1.5">
                <Square className="w-3.5 h-3.5 text-slate-300" /> Nonaktif
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3.5 px-6 min-w-[260px]">Menu & Fitur</th>
                  {ROLES.map((role) => (
                    <th key={role.role} className="py-3.5 px-4 text-center min-w-[120px]">
                      <div className="flex items-center justify-center gap-1.5">
                        {role.icon}
                        <span>{role.label}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MENU_GROUPS.map((group) => (
                  <React.Fragment key={group.groupName}>
                    {/* Group Header Row */}
                    <tr className="bg-slate-50/80">
                      <td
                        colSpan={1 + ROLES.length}
                        className="py-2.5 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider"
                      >
                        <div className="flex items-center gap-2">
                          <span>{group.groupName}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                            {group.badge}
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Menu Item Rows */}
                    {group.items.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/60 transition-colors duration-150"
                      >
                        <td className="py-3 px-6">
                          <div className="flex items-start gap-3">
                            <div className="p-1.5 rounded-lg bg-slate-100 border border-slate-200/60 mt-0.5">
                              {item.icon}
                            </div>
                            <div>
                              <div className="font-semibold text-sm text-slate-800">{item.label}</div>
                              <div className="text-xs text-slate-400">{item.description}</div>
                            </div>
                          </div>
                        </td>

                        {ROLES.map((role) => {
                          const checked = hasAccess(role.role, item.id);
                          const isAdminRole = role.role === 'admin';

                          return (
                            <td key={role.role} className="py-3 px-4 text-center">
                              <label
                                className={`inline-flex items-center justify-center p-2 rounded-xl transition-all duration-200 ${
                                  isAdminRole
                                    ? 'cursor-not-allowed opacity-90'
                                    : 'cursor-pointer hover:bg-slate-100'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  className="sr-only"
                                  checked={checked}
                                  disabled={isAdminRole || saving}
                                  onChange={() => toggleAccess(role.role, item.id)}
                                />
                                <div
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 border ${
                                    checked
                                      ? isAdminRole
                                        ? 'bg-purple-600 border-purple-600 text-white shadow-sm'
                                        : role.role === 'designer'
                                        ? 'bg-pink-600 border-pink-600 text-white shadow-sm shadow-pink-500/20'
                                        : role.role === 'teknis'
                                        ? 'bg-cyan-600 border-cyan-600 text-white shadow-sm shadow-cyan-500/20'
                                        : 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/20'
                                      : 'bg-white border-slate-300 text-transparent hover:border-slate-400'
                                  }`}
                                >
                                  <Check className="w-4 h-4 stroke-[2.5]" />
                                </div>
                              </label>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>
                Role Admin memiliki hak akses mutlak dan tidak dapat dinonaktifkan untuk menjaga integritas sistem.
              </span>
            </div>
            <button
              onClick={handleSave}
              disabled={saving || loading || !hasChanges}
              className={`inline-flex items-center gap-2 px-5 py-2 font-semibold text-white rounded-xl transition-all ${
                hasChanges
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25'
                  : 'bg-slate-400 opacity-60 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HakAksesManagement;
