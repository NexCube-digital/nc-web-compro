import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const OrderPending: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result;

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white flex items-center justify-center px-4 pt-16">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-200">
          <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Menunggu Pembayaran ⏳</h1>
        <p className="text-slate-600 mb-6">
          Pesanan Anda sedang menunggu konfirmasi pembayaran. Selesaikan pembayaran sebelum batas waktu habis.
        </p>

        {result?.order_id && (
          <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 text-left space-y-2 shadow-sm">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Order ID</span>
              <span className="font-semibold text-slate-800 font-mono text-xs">{result.order_id}</span>
            </div>
            {result.payment_type && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Metode Bayar</span>
                <span className="font-semibold text-slate-800 capitalize">{result.payment_type.replace(/_/g, ' ')}</span>
              </div>
            )}
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm text-yellow-800 font-medium">ℹ️ Info Penting</p>
          <p className="text-xs text-yellow-700 mt-1">
            Status pesanan akan diperbarui otomatis setelah pembayaran dikonfirmasi. Cek email Anda untuk instruksi pembayaran.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full py-3.5 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-yellow-200"
          >
            Kembali ke Beranda
          </button>
          <button
            onClick={() => navigate('/paket')}
            className="w-full py-3 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
          >
            Lihat Paket Lainnya
          </button>
        </div>
      </div>
    </div>
  );
};