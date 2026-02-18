import React, { useState, useRef, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import html2pdf from 'html2pdf.js'
import apiClient, { Contact, Portfolio, Invoice, Finance } from '../../services/api'

interface ReportData {
  type: 'clients' | 'invoices' | 'finance'
  dateRange: {
    start: string
    end: string
  }
  data: any[]
}

export const ReportManagement: React.FC = () => {
  const [reportType, setReportType] = useState<'clients' | 'invoices' | 'finance'>('clients')
  const [dateStart, setDateStart] = useState('')
  const [dateEnd, setDateEnd] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [clientsData, setClientsData] = useState<Contact[]>([])
  const [portfoliosData, setPortfoliosData] = useState<Portfolio[]>([])
  const [invoicesData, setInvoicesData] = useState<Invoice[]>([])
  const [financesData, setFinancesData] = useState<Finance[]>([])
  const reportRef = useRef<HTMLDivElement>(null)

  // Load real data dari backend
  const loadReportData = async () => {
    try {
      setLoading(true)
      
      // Load Contacts
      const contactsResponse = await apiClient.getContacts()
      if (contactsResponse.success && Array.isArray(contactsResponse.data)) {
        setClientsData(contactsResponse.data)
      } else {
        setClientsData([])
      }

      // Load Portfolios
      const portfoliosResponse = await apiClient.getPortfolios()
      if (portfoliosResponse.success && Array.isArray(portfoliosResponse.data)) {
        setPortfoliosData(portfoliosResponse.data)
      } else {
        setPortfoliosData([])
      }

      // Load Invoices
      try {
        const invoicesResponse = await apiClient.getInvoices()
        if (invoicesResponse.success && Array.isArray(invoicesResponse.data)) {
          setInvoicesData(invoicesResponse.data)
        } else {
          setInvoicesData([])
        }
      } catch (error) {
        console.warn('Failed to load invoices:', error)
        setInvoicesData([])
      }

      // Load Finances
      try {
        const financesResponse = await apiClient.getFinances()
        if (financesResponse.success && Array.isArray(financesResponse.data)) {
          setFinancesData(financesResponse.data)
        } else {
          setFinancesData([])
        }
      } catch (error) {
        console.warn('Failed to load finances:', error)
        setFinancesData([])
      }
    } catch (error) {
      console.error('Failed to load report data:', error)
      setClientsData([])
      setPortfoliosData([])
      setInvoicesData([])
      setFinancesData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReportData()
  }, [])

  const handleGeneratePDF = () => {
    if (!reportRef.current) return

    setIsGenerating(true)

    const element = reportRef.current
    const opt = {
      margin: 10,
      filename: `report-${reportType}-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait' as const, unit: 'mm', format: 'a4' }
    }

    html2pdf().set(opt).from(element).save().then(() => {
      setIsGenerating(false)
    })
  }

  const handlePrint = () => {
    if (!reportRef.current) return

    const printWindow = window.open('', '', 'height=600,width=800')
    if (printWindow) {
      printWindow.document.write(reportRef.current.innerHTML)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div>
      <Helmet>
        <title>Laporan - NexCube Dashboard</title>
      </Helmet>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Laporan & Cetak</h1>
        <p className="text-slate-600 mt-2">Generate dan cetak laporan data bisnis Anda</p>
      </div>

      {/* Report Generation Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Buat Laporan</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Report Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tipe Laporan <span className="text-red-500">*</span>
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as 'clients' | 'invoices' | 'finance')}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="clients">Laporan Klien</option>
              <option value="invoices">Laporan Invoice</option>
              <option value="finance">Laporan Keuangan</option>
            </select>
          </div>

          {/* Date Range Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Dari Tanggal
            </label>
            <input
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Sampai Tanggal
            </label>
            <input
              type="date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-end">
            <button
              onClick={handlePrint}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Cetak
            </button>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 overflow-auto" ref={reportRef} style={{ maxHeight: '70vh' }}>
        {/* Report Header */}
        <div className="text-center mb-8 pb-8 border-b-2 border-slate-300">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">NexCube Digital</h1>
          <p className="text-slate-600">Laporan {reportType === 'clients' ? 'Klien' : reportType === 'invoices' ? 'Invoice' : 'Keuangan'}</p>
          {dateStart && dateEnd && (
            <p className="text-slate-500 text-sm mt-2">
              Periode: {formatDate(dateStart)} - {formatDate(dateEnd)}
            </p>
          )}
          <p className="text-slate-500 text-xs mt-2">Tanggal Laporan: {formatDate(new Date().toISOString().split('T')[0])}</p>
        </div>

        {/* Report Content - Clients */}
        {reportType === 'clients' && (
          <div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-slate-300">
                  <th className="px-4 py-2 text-left font-bold text-slate-800">No.</th>
                  <th className="px-4 py-2 text-left font-bold text-slate-800">Nama</th>
                  <th className="px-4 py-2 text-left font-bold text-slate-800">Email</th>
                  <th className="px-4 py-2 text-left font-bold text-slate-800">Telepon</th>
                  <th className="px-4 py-2 text-left font-bold text-slate-800">Perusahaan</th>
                  <th className="px-4 py-2 text-left font-bold text-slate-800">Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(clientsData) && clientsData.map((client, index) => (
                  <tr key={client.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-2 text-slate-700">{index + 1}</td>
                    <td className="px-4 py-2 text-slate-700 font-medium">{client.name}</td>
                    <td className="px-4 py-2 text-slate-600">{client.email}</td>
                    <td className="px-4 py-2 text-slate-600">{client.phone}</td>
                    <td className="px-4 py-2 text-slate-600">{client.company}</td>
                    <td className="px-4 py-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        client.status === 'responded' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {client.status === 'responded' ? 'Responded' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-700"><strong>Total Klien:</strong> {Array.isArray(clientsData) ? clientsData.length : 0}</p>
              <p className="text-sm text-slate-700"><strong>Klien Responded:</strong> {Array.isArray(clientsData) ? clientsData.filter(c => c.status === 'responded').length : 0}</p>
            </div>
          </div>
        )}

        {/* Report Content - Invoices */}
        {reportType === 'invoices' && (
          <div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-slate-300">
                  <th className="px-4 py-2 text-left font-bold text-slate-800">No.</th>
                  <th className="px-4 py-2 text-left font-bold text-slate-800">No. Invoice</th>
                  <th className="px-4 py-2 text-left font-bold text-slate-800">Klien</th>
                  <th className="px-4 py-2 text-left font-bold text-slate-800">Tanggal</th>
                  <th className="px-4 py-2 text-left font-bold text-slate-800">Layanan</th>
                  <th className="px-4 py-2 text-right font-bold text-slate-800">Harga</th>
                  <th className="px-4 py-2 text-left font-bold text-slate-800">Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(invoicesData) && invoicesData.length > 0 ? invoicesData.map((invoice, index) => (
                  <tr key={invoice.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-2 text-slate-700">{index + 1}</td>
                    <td className="px-4 py-2 text-slate-700 font-medium">{invoice.invoiceNumber}</td>
                    <td className="px-4 py-2 text-slate-600">{invoice.clientName}</td>
                    <td className="px-4 py-2 text-slate-600">{invoice.issueDate}</td>
                    <td className="px-4 py-2 text-slate-600">
                      {invoice.service === 'website' ? 'Website' :
                       invoice.service === 'undangan' ? 'Undangan Digital' :
                       invoice.service === 'desain' ? 'Desain Grafis' :
                       invoice.service === 'katalog' ? 'Katalog Digital' : invoice.service}
                    </td>
                    <td className="px-4 py-2 text-right text-slate-700 font-semibold">{formatCurrency(Math.round(invoice.amount))}</td>
                    <td className="px-4 py-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                        invoice.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                        invoice.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {invoice.status === 'paid' ? 'Terbayar' :
                         invoice.status === 'sent' ? 'Terkirim' :
                         invoice.status === 'draft' ? 'Draft' : 'Jatuh Tempo'}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-4 text-center text-slate-600">Tidak ada data invoice</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-700"><strong>Total Invoice:</strong> {Array.isArray(invoicesData) ? invoicesData.length : 0}</p>
              <p className="text-sm text-slate-700"><strong>Total Revenue:</strong> {formatCurrency(Array.isArray(invoicesData) ? Math.round(invoicesData.reduce((sum, inv) => sum + Number(inv.amount), 0)) : 0)}</p>
            </div>
          </div>
        )}

        {/* Report Content - Finance */}
        {reportType === 'finance' && (
          <div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-slate-300">
                  <th className="px-4 py-2 text-left font-bold text-slate-800">No.</th>
                  <th className="px-4 py-2 text-left font-bold text-slate-800">Tanggal</th>
                  <th className="px-4 py-2 text-left font-bold text-slate-800">Tipe</th>
                  <th className="px-4 py-2 text-left font-bold text-slate-800">Kategori</th>
                  <th className="px-4 py-2 text-left font-bold text-slate-800">Deskripsi</th>
                  <th className="px-4 py-2 text-left font-bold text-slate-800">Metode</th>
                  <th className="px-4 py-2 text-right font-bold text-slate-800">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(financesData) && financesData.length > 0 ? financesData.map((transaction, index) => (
                  <tr key={transaction.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-2 text-slate-700">{index + 1}</td>
                    <td className="px-4 py-2 text-slate-600">{new Date(transaction.date).toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        transaction.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-slate-600">{transaction.category}</td>
                    <td className="px-4 py-2 text-slate-600">{transaction.description}</td>
                    <td className="px-4 py-2 text-slate-600 text-xs">{transaction.paymentMethod}</td>
                    <td className="px-4 py-2 text-right font-semibold" style={{ color: transaction.type === 'income' ? '#10b981' : '#ef4444' }}>
                      {transaction.type === 'income' ? '+' : '-'} {formatCurrency(Math.round(Number(transaction.amount) || 0))}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-4 text-center text-slate-600">Tidak ada data transaksi</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="mt-6 p-4 bg-slate-50 rounded-lg space-y-2">
              <p className="text-sm text-slate-700"><strong>Total Pemasukan:</strong> <span className="text-green-700 font-bold">{formatCurrency(Math.round(Array.isArray(financesData) ? financesData.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0) : 0))}</span></p>
              <p className="text-sm text-slate-700"><strong>Total Pengeluaran:</strong> <span className="text-red-700 font-bold">{formatCurrency(Math.round(Array.isArray(financesData) ? financesData.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0) : 0))}</span></p>
              <p className="text-sm text-slate-700 pt-2 border-t border-slate-200"><strong>Net Profit:</strong> <span className="text-blue-700 font-bold">{formatCurrency(Math.round((Array.isArray(financesData) ? financesData.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0) : 0) - (Array.isArray(financesData) ? financesData.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0) : 0)))}</span></p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t-2 border-slate-300 text-center text-xs text-slate-500">
          <p>Laporan ini dihasilkan oleh sistem NexCube Digital</p>
          <p>© {new Date().getFullYear()} NexCube Digital. All Rights Reserved.</p>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Tips Penggunaan:</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Pilih tipe laporan yang ingin Anda buat</li>
          <li>Atur rentang tanggal untuk filter data (opsional)</li>
          <li>Klik "Cetak" untuk mencetak langsung ke printer</li>
          <li>Klik "Download PDF" untuk menyimpan laporan sebagai file PDF</li>
          <li>Laporan dapat digunakan untuk dokumentasi atau presentasi</li>
        </ul>
      </div>
    </div>
  )
}

export default ReportManagement
