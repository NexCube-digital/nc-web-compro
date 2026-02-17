import React, { useState } from 'react'
import { Contact } from '../../../services/api'

interface ClientDetailModalProps {
  isOpen: boolean;
  client: Contact | null;
  onClose: () => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({ isOpen, client, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen || !client) return null;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'read': return 'bg-yellow-100 text-yellow-700';
      case 'responded': return 'bg-green-100 text-green-700';
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'inactive': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'new': return 'New';
      case 'read': return 'Read';
      case 'responded': return 'Responded';
      case 'active': return 'Active';
      case 'inactive': return 'Inactive';
      default: return status;
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{client.name}</h2>
              <p className="text-blue-100 text-sm mt-1">{client.email}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Status */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Status</h3>
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(client.status)}`}>
                {getStatusLabel(client.status)}
              </span>
            </div>

            {/* Client Info */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Informasi Klien</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">Perusahaan</p>
                  <p className="font-semibold text-slate-900">{client.company || '-'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">Nomor Telepon</p>
                  <p className="font-semibold text-slate-900">{client.phone || '-'}</p>
                </div>
              </div>
            </div>

            {/* Description/Message */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Deskripsi</h3>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-slate-700 whitespace-pre-wrap">{client.message}</p>
              </div>
            </div>

            {/* cPanel Info */}
            {(client.cpanelUrl || client.cpanelUsername || client.cpanelPassword) && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Informasi Hosting cPanel</h3>
                <div className="space-y-3">
                  {client.cpanelUrl && (
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-sm text-slate-600 mb-2">URL cPanel</p>
                      <a 
                        href={client.cpanelUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-mono text-sm break-all"
                      >
                        {client.cpanelUrl}
                      </a>
                    </div>
                  )}
                  {client.cpanelUsername && (
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-sm text-slate-600 mb-2">Username</p>
                      <p className="font-mono text-slate-900">{client.cpanelUsername}</p>
                    </div>
                  )}
                  {client.cpanelPassword && (
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-slate-600">Password</p>
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-semibold transition-colors"
                          title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                        >
                          {showPassword ? (
                            <>
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" fillRule="evenodd" />
                                <path d="M15.171 13.576l1.407 1.407A10.019 10.019 0 0020 10c-1.274-4.057-5.065-7-9.541-7a9.986 9.986 0 00-5.59 1.773l1.432 1.432c1.331-.676 2.84-1.05 4.158-1.05a7 7 0 017 7c0 1.317-.374 2.826-1.049 4.158z" />
                              </svg>
                              Sembunyikan
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                              Tampilkan
                            </>
                          )}
                        </button>
                      </div>
                      <p className="font-mono text-slate-900">
                        {showPassword ? client.cpanelPassword : '●'.repeat(Math.min(client.cpanelPassword.length, 12))}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-50 p-6 border-t border-slate-200 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="bg-slate-300 text-slate-700 px-6 py-2.5 rounded-lg font-bold hover:bg-slate-400 transition-all"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientDetailModal;
