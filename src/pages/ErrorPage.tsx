import React from 'react';
import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { FaHome, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import { IoMdCube } from 'react-icons/io';

export const ErrorPage: React.FC = () => {
  const error = useRouteError();
  let errorMessage = 'Terjadi kesalahan yang tidak terduga';
  let errorStatus = '500';
  let errorTitle = 'Oops! Ada yang Salah';

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status.toString();
    errorMessage = error.statusText || error.data?.message || errorMessage;
    
    if (error.status === 404) {
      errorTitle = 'Halaman Tidak Ditemukan';
      errorMessage = 'Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.';
    }
  }

  return (
    <Layout>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-orange-50/30">
        {/* Background Elements */}
        <div className="fixed top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-orange-400/10 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
        <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-blue-500/10 rounded-full blur-3xl translate-x-48 translate-y-48"></div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(#0066FF 1px, transparent 1px), linear-gradient(90deg, #0066FF 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="container relative py-20">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            {/* Error Icon with Animation */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative backdrop-blur-xl bg-white/80 border border-white/40 rounded-3xl p-8 shadow-2xl">
                  {errorStatus === '404' ? (
                    <div className="relative">
                      <IoMdCube className="w-24 h-24 text-blue-600 animate-bounce" />
                      <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                        ?
                      </div>
                    </div>
                  ) : (
                    <FaExclamationTriangle className="w-24 h-24 text-orange-500 animate-pulse" />
                  )}
                </div>
              </div>
            </div>

            {/* Error Status Code */}
            <div>
              <h1 className="text-8xl md:text-9xl font-black bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 bg-clip-text text-transparent mb-2">
                {errorStatus}
              </h1>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
                {errorTitle}
              </h2>
              <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
                {errorMessage}
              </p>
            </div>

            {/* Helpful Suggestions */}
            <div className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-2xl p-6 shadow-lg">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Saran untuk Anda:</h3>
              <ul className="text-sm text-slate-600 space-y-2 text-left max-w-md mx-auto">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Periksa kembali URL yang Anda masukkan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Kembali ke halaman sebelumnya dan coba lagi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Hubungi kami jika masalah terus berlanjut</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center pt-4">
              <button
                onClick={() => window.history.back()}
                className="group bg-white hover:bg-gray-50 border-2 border-slate-200 hover:border-blue-500 text-slate-700 hover:text-blue-600 px-6 py-3 rounded-xl text-sm md:text-base font-bold transition-all duration-300 hover:shadow-xl inline-flex items-center gap-2"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
              
              <Link
                to="/"
                className="group bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3 rounded-xl text-sm md:text-base font-bold transition-all duration-300 hover:shadow-xl inline-flex items-center gap-2"
              >
                <FaHome className="w-4 h-4" />
                <span>Ke Halaman Utama</span>
              </Link>
            </div>

            {/* Contact Support */}
            <div className="pt-6">
              <p className="text-sm text-slate-500">
                Butuh bantuan? {' '}
                <Link to="/contact" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                  Hubungi Tim Support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ErrorPage;
