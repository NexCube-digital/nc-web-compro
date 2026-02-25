// Di halaman list invoice / detail / dashboard
import { InvoicePayButton } from '@/components/InvoicePayButton';

<InvoicePayButton
  invoiceId={invoice.id}
  invoiceNumber={invoice.invoiceNumber}
  onSuccess={(result) => {
    toast.success('Pembayaran berhasil!');
    refetchInvoices(); // refresh data
  }}
  onPending={() => toast.info('Menunggu konfirmasi pembayaran...')}
  size="sm"        // 'sm' | 'md' | 'lg'
  variant="primary" // 'primary' | 'outline' | 'ghost'
/>