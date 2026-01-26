# Quick Start - UI Components

Panduan cepat untuk menggunakan UI component library yang telah diupdate.

## 🚀 Quick Setup (5 Menit)

### 1. Import Toast Container ke App.tsx

```tsx
import { useToast } from '@/hooks/useCustom'
import { ToastContainer } from '@/components/Toast'

function App() {
  const { toasts, removeToast } = useToast()

  return (
    <div>
      {/* Your app */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
```

### 2. Basic Form Page

```tsx
import { useState } from 'react'
import { Button, Input, TextArea, Select, Card, CardHeader, CardBody, CardFooter } from '@/components/ui'
import { useToast } from '@/hooks/useCustom'

export function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const { success, error } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Submit logic
      success('Form submitted successfully!')
      setFormData({ name: '', email: '', message: '' })
    } catch (err) {
      error('Failed to submit form')
    }
  }

  return (
    <Card variant="elevated" className="max-w-2xl mx-auto">
      <CardHeader title="Contact Us" subtitle="Get in touch with our team" />
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your name"
            required
            fullWidth
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your@email.com"
            required
            fullWidth
          />

          <TextArea
            label="Message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Your message"
            rows={5}
            required
            fullWidth
          />

          <Button type="submit" variant="primary" fullWidth>
            Send Message
          </Button>
        </form>
      </CardBody>
    </Card>
  )
}
```

### 3. Data Table dengan Sorting & Pagination

```tsx
import { useState } from 'react'
import { DataTable, Pagination } from '@/components/ui'

export function ClientsTable() {
  const [page, setPage] = useState(1)
  const itemsPerPage = 10

  const clients = [
    { id: 1, name: 'PT Maju Jaya', email: 'contact@majujaya.com', phone: '021-1234567', status: 'active' },
    { id: 2, name: 'CV Inovasi', email: 'info@inovasi.co.id', phone: '021-7654321', status: 'pending' },
    // ... more clients
  ]

  return (
    <div className="space-y-4">
      <DataTable
        columns={[
          { key: 'name', label: 'Nama Klien', sortable: true },
          { key: 'email', label: 'Email', sortable: true },
          { key: 'phone', label: 'Telepon', sortable: false },
          {
            key: 'status',
            label: 'Status',
            render: (status) => (
              <Badge
                label={status === 'active' ? 'Aktif' : 'Pending'}
                variant={status === 'active' ? 'success' : 'warning'}
              />
            )
          },
          {
            key: 'actions',
            label: 'Aksi',
            render: (_, client) => (
              <div className="flex gap-2">
                <IconButton icon={<EditIcon />} variant="primary" />
                <IconButton icon={<DeleteIcon />} variant="danger" />
              </div>
            )
          }
        ]}
        data={clients.slice((page - 1) * itemsPerPage, page * itemsPerPage)}
      />

      <Pagination
        currentPage={page}
        totalPages={Math.ceil(clients.length / itemsPerPage)}
        totalItems={clients.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setPage}
      />
    </div>
  )
}
```

### 4. Modal Dialog

```tsx
import { useState } from 'react'
import { Button, Modal, Input } from '@/components/ui'

export function UserModal() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="primary">
        Add User
      </Button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Add New User"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Handle submit
                setOpen(false)
              }}
            >
              Create
            </Button>
          </>
        }
      >
        <Input
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          fullWidth
        />
      </Modal>
    </>
  )
}
```

### 5. Stats Dashboard

```tsx
import { StatsCard } from '@/components/ui'
import { TrendingUpIcon, UsersIcon, FileTextIcon } from 'lucide-react'

export function StatsDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatsCard
        icon={<TrendingUpIcon className="w-6 h-6" />}
        title="Total Revenue"
        value="$45,231.89"
        change={{ value: 20.1, type: 'increase' }}
        color="blue"
      />

      <StatsCard
        icon={<UsersIcon className="w-6 h-6" />}
        title="Active Clients"
        value="2,543"
        change={{ value: 15.3, type: 'increase' }}
        color="green"
      />

      <StatsCard
        icon={<FileTextIcon className="w-6 h-6" />}
        title="Pending Invoices"
        value="14"
        change={{ value: 5.2, type: 'decrease' }}
        color="yellow"
      />
    </div>
  )
}
```

## 🎨 Common Patterns

### Loading State
```tsx
const { loading, withLoading } = useLoading()

const handleFetch = withLoading(async () => {
  return await fetchData()
})

<Button isLoading={loading} onClick={handleFetch}>
  Load Data
</Button>
```

### Async Data Fetching
```tsx
const { execute, status, value, error } = useAsync(
  async () => await fetchClients(),
  true
)

{status === 'pending' && <LoadingSkeleton />}
{status === 'success' && <ClientsTable data={value} />}
{status === 'error' && <Alert type="error" title="Error" message={error} />}
```

### Form with Toast Feedback
```tsx
const { success, error } = useToast()

const handleSubmit = async (data) => {
  try {
    await submitForm(data)
    success('Form submitted!')
  } catch (err) {
    error('Failed to submit')
  }
}
```

### Search with Debounce
```tsx
const [query, setQuery] = useState('')
const debouncedSearch = useDebounce((q: string) => {
  searchUsers(q)
}, 300)

<Input
  value={query}
  onChange={(e) => {
    setQuery(e.target.value)
    debouncedSearch(e.target.value)
  }}
  placeholder="Search..."
/>
```

## 🔄 Common Tasks

### Ganti Component Lama ke Baru

**Sebelum:**
```tsx
<button className="btn-premium">Click</button>
<input className="input-premium" />
<div className="card-glass">Content</div>
```

**Sesudah:**
```tsx
<Button variant="primary">Click</Button>
<Input fullWidth />
<Card variant="glass">Content</Card>
```

### Add Responsive Animation
```tsx
<div className="animate-fadeInUp transition-smooth hover:shadow-lg">
  Content with animation
</div>
```

### Create Loading Page
```tsx
<div className="min-h-screen flex items-center justify-center">
  <div className="space-y-4 w-full max-w-md">
    <CardSkeleton count={3} />
  </div>
</div>
```

## 📱 Responsive Classes

```tsx
// Hidden on mobile, visible on tablet+
<div className="hidden md:block">...</div>

// Full width on mobile, half on tablet+
<div className="w-full md:w-1/2">...</div>

// Stack on mobile, horizontal on tablet+
<div className="flex flex-col md:flex-row gap-4">...</div>
```

## 🎯 Next Steps

1. **Update Your Pages**
   - Buka satu halaman
   - Ganti komponen lama dengan baru
   - Test responsive di mobile

2. **Add Animations**
   - Gunakan `animate-fadeInUp` untuk page load
   - Gunakan `transition-smooth` untuk hover effect
   - Gunakan `pulse-glow` untuk important elements

3. **Integrate Hooks**
   - Gunakan `useToast` untuk user feedback
   - Gunakan `useAsync` untuk data fetching
   - Gunakan `useDebounce` untuk search

4. **Test Everything**
   - Test di mobile (375px)
   - Test di tablet (768px)
   - Test keyboard navigation
   - Test touch interactions

---

**Butuh bantuan?** Baca file lengkap: `UI_COMPONENTS_GUIDE.md`
