import React, { useState } from 'react';
import apiClient from '../services/api';

interface InvoicePayButtonProps {
  invoiceId: number;
  invoiceNumber: string;
  onSuccess?: (result: unknown) => void;
  onPending?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'outline' | 'ghost';
  className?: string;
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const variantClasses = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-600',
  outline: 'bg-transparent hover:bg-blue-50 text-blue-600 border border-blue-600',
  ghost: 'bg-transparent hover:bg-blue-50 text-blue-600 border border-transparent',
};

export const InvoicePayButton: React.FC<InvoicePayButtonProps> = ({
  invoiceId,
  invoiceNumber,
  onSuccess,
  onPending,
  size = 'md',
  variant = 'primary',
  className = '',
}) => {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await apiClient.checkoutGeneratePaymentLink(invoiceId);
      if (res.success && res.data?.paymentUrl) {
        if (onPending) onPending();
        window.open(res.data.paymentUrl, '_blank', 'noopener,noreferrer');
        if (onSuccess) onSuccess(res.data);
      }
    } catch (err) {
      console.error(`[InvoicePayButton] Gagal generate payment link untuk invoice ${invoiceNumber}:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handlePay}
      disabled={loading}
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {loading ? 'Memproses...' : 'Bayar Sekarang'}
    </button>
  );
};