import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <Helmet>
        <title>Halaman Tidak Ditemukan - NexCube Digital</title>
      </Helmet>
      <div className="text-center">
        <div className="inline-block p-6 rounded-full bg-slate-100 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">404 - Halaman Tidak Ditemukan</h1>
        <p className="text-slate-500 mb-6">Maaf, halaman yang Anda cari tidak tersedia.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/" className="btn-primary">
            Kembali ke Home
          </Link>
          <Link to="/contact" className="btn-secondary">
            Hubungi Kami
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
