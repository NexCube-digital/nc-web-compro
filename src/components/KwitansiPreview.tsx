import React from 'react'
import { Invoice } from '../services/api'
import { Phone, Mail, MapPin } from 'lucide-react'

interface KwitansiPreviewProps {
  invoice: Invoice
}

export const KwitansiPreview: React.FC<KwitansiPreviewProps> = ({ invoice }) => {
  // Parse price breakdown
  let breakdown: any[] = []
  if (invoice.priceBreakdown) {
    try {
      const parsed = JSON.parse(invoice.priceBreakdown)
      if (Array.isArray(parsed)) breakdown = parsed
    } catch (e) {
      console.warn('Failed to parse priceBreakdown:', e)
    }
  }

  if (breakdown.length === 0 && invoice.amount) {
    breakdown = [
      {
        id: '1',
        description: invoice.description || invoice.service || 'Layanan Digital NexCube',
        price: invoice.amount,
        qty: 1,
      },
    ]
  }

  // Calculate totals
  const subtotal = breakdown.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1), 0) || invoice.amount
  const ppn = 0
  const totalKeseluruhan = subtotal + ppn

  // Ensure minimum 8 rows for that clean official paper layout
  const minRows = 8
  const tableRows = [...breakdown]
  while (tableRows.length < minRows) {
    tableRows.push({
      id: `empty-${tableRows.length}`,
      description: '',
      price: 0,
      qty: 0,
      isEmpty: true,
    })
  }

  // Format date: e.g. "06 November 2025"
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
  }

  return (
    <div id="kwitansi-print-area" className="bg-white p-6 sm:p-10 rounded-xl text-slate-900 font-sans shadow-sm border border-slate-200 max-w-3xl mx-auto print:shadow-none print:border-none print:p-0 print:m-0">
      
      {/* ── HEADER ── */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <img src="/images/NexCube-full.png" alt="NexCube Digital" className="h-10 sm:h-12 w-auto object-contain" />
        </div>
        <div className="text-right">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-600 tracking-wider uppercase">KWITANSI</h1>
        </div>
      </div>

      <div className="border-b border-slate-300 pb-1 mb-6 flex justify-end">
        <p className="text-xs font-semibold text-slate-600">nexcubedigital@gmail.com</p>
      </div>

      {/* ── RECIPIENT & KWITANSI INFO ── */}
      {(() => {
        const phone = invoice.clientPhone || invoice.client?.phone
        const email = invoice.clientEmail || invoice.client?.email
        const address = invoice.clientAddress || invoice.client?.address || 'Bandung, Jawa Barat'

        return (
          <div className="flex justify-between items-start mb-6 text-xs sm:text-sm">
            <div>
              <p className="text-slate-600 font-medium mb-1">Ditujukan kepada :</p>
              <h2 className="text-base font-bold text-slate-900 mb-1">{invoice.clientName || invoice.client?.name || 'Nama Klien'}</h2>
              {phone && <p className="text-slate-600 leading-snug">{phone}</p>}
              {email && <p className="text-slate-600 leading-snug">{email}</p>}
              <p className="text-slate-600 leading-snug max-w-sm mt-0.5">{address}</p>
            </div>

            <div className="text-right">
              <p className="font-bold text-slate-900 text-sm sm:text-base">Kwitansi no : {invoice.invoiceNumber || '1'}</p>
              <p className="text-slate-600 mt-1 font-medium">{formatDate(invoice.issueDate)}</p>
            </div>
          </div>
        )
      })()}

      {/* ── ITEMS TABLE ── */}
      <div className="overflow-hidden border border-blue-600 rounded-xs mb-4">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white font-bold uppercase text-[11px] tracking-wider">
              <th className="py-2.5 px-3 text-center w-12 border-r border-blue-500">NO</th>
              <th className="py-2.5 px-4 border-r border-blue-500">DESKRIPSI</th>
              <th className="py-2.5 px-3 text-center w-20 border-r border-blue-500">JUMLAH</th>
              <th className="py-2.5 px-4 text-right w-28 border-r border-blue-500">HARGA</th>
              <th className="py-2.5 px-4 text-right w-28">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, idx) => {
              const isEven = idx % 2 === 1
              const bgClass = isEven ? 'bg-sky-100/60' : 'bg-white'
              return (
                <tr key={row.id || idx} className={`${bgClass} border-b border-slate-200/80`}>
                  <td className="py-2 px-3 text-center font-medium text-slate-700 border-r border-slate-200">{idx + 1}</td>
                  <td className="py-2 px-4 font-semibold text-slate-800 border-r border-slate-200">{row.description || ' '}</td>
                  <td className="py-2 px-3 text-center font-medium text-slate-700 border-r border-slate-200">{row.isEmpty ? '0' : (row.qty || 1)}</td>
                  <td className="py-2 px-4 text-right font-medium text-slate-700 border-r border-slate-200">
                    {row.isEmpty ? 'Rp 0' : `Rp. ${Math.round(row.price || 0).toLocaleString('id-ID')}`}
                  </td>
                  <td className="py-2 px-4 text-right font-semibold text-slate-900">
                    {row.isEmpty ? 'Rp 0' : `Rp. ${Math.round((row.price || 0) * (row.qty || 1)).toLocaleString('id-ID')}`}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ── SUBTOTAL & PPN ── */}
      <div className="flex justify-end mb-6 text-xs sm:text-sm">
        <div className="w-64 space-y-1">
          <div className="flex justify-between font-semibold text-slate-700">
            <span>Sub Total :</span>
            <span>Rp. {Math.round(subtotal).toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between font-semibold text-slate-700">
            <span>PPN 10% :</span>
            <span>Rp. {Math.round(ppn).toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>

      {/* ── PAYMENT & TOTAL & SIGNATURE ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        
        {/* Left Side: Payment Method & Terms */}
        <div className="text-xs">
          <div className="inline-block bg-blue-600 text-white font-bold px-3 py-1 rounded-xs uppercase tracking-wider mb-2">
            METODE PEMBAYARAN :
          </div>
          <div className="space-y-0.5 text-slate-700 font-medium mb-3">
            <p><span className="font-semibold text-slate-900">Bank Name :</span> BCA - a.n Aslam Mushtafa Karim</p>
            <p><span className="font-semibold text-slate-900">Account Number :</span> 8320476420</p>
          </div>

          <div className="border-t border-slate-300 pt-3 mt-3">
            <p className="font-bold text-slate-900 text-xs sm:text-sm mb-2">Terimakasi telah berbisnis dengan kami !</p>
            <p className="font-bold text-slate-800 text-[11px] mb-1">Syarat dan Ketentuan :</p>
            <p className="text-slate-500 text-[10px] leading-relaxed max-w-xs">
              Silakan lakukan pembayaran dalam waktu 30 hari setelah menerima invoice ini. Akan dikenakan bunga 10% per bulan untuk keterlambatan pembayaran.
            </p>
          </div>
        </div>

        {/* Right Side: Total Keseluruhan Banner & Signature */}
        <div className="flex flex-col justify-between items-end">
          <div className="w-full bg-blue-600 text-white p-2.5 rounded-xs flex justify-between items-center font-extrabold text-xs sm:text-sm tracking-wider shadow-xs mb-6">
            <span>TOTAL KESELURUHAN</span>
            <span>RP. {Math.round(totalKeseluruhan).toLocaleString('id-ID')}</span>
          </div>

          {/* Signature Block */}
          <div className="text-center relative pt-1">
            <div className="my-1 flex items-center justify-center">
              <img
                src="/images/assets/ttd.png"
                alt="Tanda Tangan & Stempel Resmi NexCube"
                className="h-16 sm:h-20 w-auto object-contain select-none"
              />
            </div>
            <p className="font-extrabold text-slate-900 text-xs sm:text-sm">Bela Amelia Nuralfiani</p>
            <p className="text-slate-500 font-semibold text-[11px]">Administrator</p>
          </div>
        </div>

      </div>

      {/* ── FOOTER ADDRESS & CONTACT BAR ── */}
      <div className="border-t-2 border-blue-600 pt-3 mt-4 text-[10px] sm:text-xs text-slate-600">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center text-center sm:text-left">
          
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <div className="p-1.5 rounded-full border border-blue-400 text-blue-600">
              <Phone className="w-3.5 h-3.5" />
            </div>
            <span className="font-medium text-slate-700">0813-1743-5622</span>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-2">
            <div className="p-1.5 rounded-full border border-blue-400 text-blue-600">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <span className="font-medium text-slate-700">nexcubedigital@gmail.com</span>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-2">
            <div className="p-1.5 rounded-full border border-blue-400 text-blue-600 flex-shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <span className="font-medium text-slate-700 leading-tight text-[10px]">
              Jln. Bukit Jarian dlm VI No.30, Kel. Hegarmanah, Kec. Cidadap, Kota Bandung, Jawa Barat
            </span>
          </div>

        </div>
      </div>

    </div>
  )
}

export default KwitansiPreview
