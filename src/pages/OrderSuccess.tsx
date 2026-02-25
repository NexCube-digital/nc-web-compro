import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4 pt-16">
      <div className="max-w-md w-full text-center">
        {/* Animasi checkmark */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Pembayaran Berhasil! 🎉</h1>
        <p className="text-slate-600 mb-6">
          Terima kasih atas pesanan Anda. Tim kami akan segera menghubungi Anda untuk proses selanjutnya.
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

        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-200"
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