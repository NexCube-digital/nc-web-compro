import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import apiClient, { Contact } from '../../services/api'
import { CPanelTable } from './client/CPanelTable'
import useBackgroundRefresh from '../../hooks/useBackgroundRefresh'
import useSSE from '../../hooks/useSSE'
import { ClientDetailModal } from './client/ClientDetailModal'
import { FormClient } from './client/FormClient'
import NewDataBanner from '../../components/NewDataBanner'

interface Client extends Contact {
  // Extending Contact interface for client management
}

export const ClientManagement: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isPageTransitioning, setIsPageTransitioning] = useState(false)

  // Check if form should be shown based on URL
  const showForm = location.pathname.includes('/formclient')

  const [formData, setFormData] = useState<Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    service: undefined,
    budget: undefined,
    status: 'new',
    cpanelUrl: '',
    cpanelUsername: '',
    cpanelPassword: '',
    packageStartDate: null,
    packageDuration: null
  })

  // Load contacts/clients from backend
  const loadClients = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await apiClient.getContacts()
      if (response.success && response.data) {
        setClients(response.data)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load clients')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClients()
  }, [])

  // Background refresh for clients list
  const { hasNew: hasNewClients, newData: newClients, clearNew: clearNewClients } = useBackgroundRefresh<Contact[]>(
    'clients',
    async () => {
      try {
        const r = await apiClient.getContacts()
        return r.success && Array.isArray(r.data) ? r.data : null
      } catch { return null }
    },
    { interval: 12000 }
  )

  const [sseUpdating, setSseUpdating] = useState(false)

  // SSE temporarily disabled - backend doesn't support it yet
  // useSSE('/stream', {
  //   'contact:created': async (d: any) => { setSseUpdating(true); try { await loadClients() } catch {} finally { setTimeout(() => setSseUpdating(false), 700) } },
  //   'contact:updated': async (d: any) => { setSseUpdating(true); try { await loadClients() } catch {} finally { setTimeout(() => setSseUpdating(false), 700) } },
  //   'contact:deleted': async (d: any) => { setSseUpdating(true); try { await loadClients() } catch {} finally { setTimeout(() => setSseUpdating(false), 700) } },
  // })

  const filteredClients = Array.isArray(clients) ? clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : []

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    // Handle packageDuration as number
    if (name === 'packageDuration') {
      setFormData(prev => ({ ...prev, [name]: value ? parseInt(value) : null }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError('')

      if (editingId) {
        // Update existing contact with all fields including package
        const response = await apiClient.updateContact(editingId, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          message: formData.message,
          service: formData.service,
          budget: formData.budget,
          status: formData.status,
          cpanelUrl: formData.cpanelUrl,
          cpanelUsername: formData.cpanelUsername,
          cpanelPassword: formData.cpanelPassword,
          packageStartDate: formData.packageStartDate,
          packageDuration: formData.packageDuration
        })
        if (response.success) {
          await loadClients() // Refresh the list
        }
      } else {
        // Create new contact
        const response = await apiClient.submitContact({
          ...formData,
          message: formData.message || 'Client created from dashboard'
        })
        if (response.success) {
          await loadClients() // Refresh the list
        }
      }

      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
        service: undefined,
        budget: undefined,
        status: 'new',
        cpanelUrl: '',
        cpanelUsername: '',
        cpanelPassword: '',
        packageStartDate: null,
        packageDuration: null
      })
      setEditingId(null)
      // Navigate back to clients list after successful save
      navigate('/dashboard/clients')
    } catch (err: any) {
      setError(err.message || 'Failed to save client')
    } finally {
      setLoading(false)
    }
  }

  const handleEditClient = (client: Client) => {
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone || '',
      company: client.company || '',
      message: client.message,
      service: client.service,
      budget: client.budget,
      status: client.status,
      cpanelUrl: client.cpanelUrl || '',
      cpanelUsername: client.cpanelUsername || '',
      cpanelPassword: client.cpanelPassword || '',
      packageStartDate: client.packageStartDate || null,
      packageDuration: client.packageDuration || null
    })
    setEditingId(client.id.toString())
    // Navigate to form with edit mode
    navigate('/dashboard/clients/formclient')
  }

  const handleViewDetail = (client: Client) => {
    setSelectedClient(client)
    setShowDetailModal(true)
  }

  const handleCloseDetailModal = () => {
    setShowDetailModal(false)
    setSelectedClient(null)
  }

  const handleDeleteClient = async (clientId: number) => {
    try {
      setLoading(true)
      setError('')
      await apiClient.deleteContact(clientId.toString())
      await loadClients() // Refresh the list after delete
      setLoading(false)
    } catch (err: any) {
      setError(err.message || 'Failed to delete client')
      setLoading(false)
      throw err // Re-throw for toast notification in CPanelTable
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      message: '',
      service: undefined,
      budget: undefined,
      status: 'new',
      cpanelUrl: '',
      cpanelUsername: '',
      cpanelPassword: '',
      packageStartDate: null,
      packageDuration: null
    })
    // Navigate back to clients list
    navigate('/dashboard/clients')
  }

  const handleUpdateCPanel = async (clientId: number, cpanelData: any) => {
    try {
      setLoading(true)
      setError('')
      
      // Call API to update contact with cPanel data
      const response = await apiClient.updateContact(clientId.toString(), {
        cpanelUrl: cpanelData.cpanelUrl,
        cpanelUsername: cpanelData.cpanelUsername,
        cpanelPassword: cpanelData.cpanelPassword
      })

      if (response.success) {
        // Refresh clients list
        await loadClients()
        // Show success message (you might want to add toast notification here)
        console.log('cPanel updated successfully')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update cPanel')
      console.error('Error updating cPanel:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Helmet>
        <title>Manajemen Klien - NexCube Dashboard</title>
      </Helmet>

      {/* Page Container with Fade-In Animation */}
      <div className={`relative animate-in fade-in duration-500 ${sseUpdating ? 'ring-2 ring-blue-300/30' : ''}`}>
        {loading && (
          <div className="absolute inset-0 z-40">
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
            <div className="relative z-50 flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600" />
            </div>
          </div>
        )}
        {sseUpdating && (
          <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-white/90 px-3 py-1 rounded shadow">
            <svg className="animate-spin h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
            <span className="text-sm text-slate-700">Updating...</span>
          </div>
        )}
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Manajemen Klien</h1>
            <p className="text-slate-600 mt-2">Kelola data klien dan informasi hosting</p>
          </div>
          {!showForm && (
            <button
              onClick={() => {
                setIsPageTransitioning(true)
                setTimeout(() => navigate('/dashboard/clients/formclient'), 150)
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all hover:scale-105"
            >
              + Tambah Klien
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <FormClient
              formData={formData}
              editingId={editingId}
              loading={loading}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* Table & Stats - Only show when not in form view */}
        {!showForm && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {(hasNewClients && newClients) || (typeof (window as any)._clientsSSE !== 'undefined' && (window as any)._clientsSSE) ? (
              <NewDataBanner
                message="Data klien terbaru tersedia"
                onRefresh={async () => {
                  setLoading(true)
                  try {
                    if (hasNewClients && newClients) { setClients(newClients); clearNewClients() }
                    else if ((window as any)._clientsSSE) { await loadClients(); (window as any)._clientsSSE = false }
                  } finally { setLoading(false) }
                }}
                onDismiss={() => clearNewClients()}
              />
            ) : null}
            {/* Search & Filter */}
            <div className="mb-6 flex gap-4">
              <input
                type="text"
                placeholder="Cari klien..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Clients Table Section Header */}
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-900">Daftar Klien</h2>
              <p className="text-sm text-slate-600">Kelola dan edit informasi klien</p>
            </div>

            {/* Unified Client & cPanel Table */}
            <CPanelTable 
              clients={clients}
              onUpdate={handleUpdateCPanel}
              loading={loading}
              onEditClient={handleEditClient}
              onDeleteClient={handleDeleteClient}
              onViewDetail={handleViewDetail}
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                <p className="text-slate-600 text-sm mb-2">Total Klien</p>
                <p className="text-3xl font-bold text-slate-900">{Array.isArray(clients) ? clients.length : 0}</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                <p className="text-slate-600 text-sm mb-2">Responded</p>
                <p className="text-3xl font-bold text-green-600">{Array.isArray(clients) ? clients.filter(c => c.status === 'responded').length : 0}</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                <p className="text-slate-600 text-sm mb-2">New Leads</p>
                <p className="text-3xl font-bold text-blue-600">{Array.isArray(clients) ? clients.filter(c => c.status === 'new').length : 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* Client Detail Modal */}
        <ClientDetailModal 
          isOpen={showDetailModal}
          client={selectedClient}
          onClose={handleCloseDetailModal}
        />
      </div>
    </div>
  )
}

export default ClientManagement
