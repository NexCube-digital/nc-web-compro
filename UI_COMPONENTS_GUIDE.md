# NexCube UI Component Library

Dokumentasi lengkap untuk menggunakan komponen UI yang telah di-improve dengan Tailwind CSS dan GSAP animations.

## Instalasi & Setup

Semua CSS dan animasi sudah dikonfigurasi di `src/index.css` dan `src/styles/animations.css`.

### Import Komponen

```typescript
import { 
  Button, 
  Card, 
  Input, 
  Modal,
  Badge,
  Alert,
  // ... import komponen lainnya
} from '@/components/ui'
```

## Button Components

### Basic Button

```tsx
import { Button } from '@/components/ui'

export function MyComponent() {
  return (
    <Button variant="primary" size="md">
      Click Me
    </Button>
  )
}
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'success' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean (shows loading spinner)
- `icon`: React.ReactNode
- `fullWidth`: boolean

### Icon Button

```tsx
import { IconButton } from '@/components/ui'

export function MyComponent() {
  return (
    <IconButton icon={<TrashIcon />} variant="danger" tooltip="Delete item" />
  )
}
```

## Form Components

### Input

```tsx
import { Input } from '@/components/ui'

export function MyForm() {
  const [value, setValue] = useState('')

  return (
    <Input
      label="Email"
      type="email"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Enter email"
      error={value && !isValidEmail(value) ? 'Invalid email' : undefined}
      helper="We'll never share your email"
      fullWidth
    />
  )
}
```

### Select

```tsx
import { Select } from '@/components/ui'

export function MyForm() {
  return (
    <Select
      label="Country"
      options={[
        { value: 'id', label: 'Indonesia' },
        { value: 'my', label: 'Malaysia' }
      ]}
      fullWidth
    />
  )
}
```

### TextArea

```tsx
import { TextArea } from '@/components/ui'

export function MyForm() {
  return (
    <TextArea
      label="Message"
      placeholder="Enter your message"
      rows={4}
      fullWidth
    />
  )
}
```

### Checkbox & Radio

```tsx
import { Checkbox, Radio } from '@/components/ui'

export function MyForm() {
  return (
    <>
      <Checkbox label="I agree to terms" />
      <Radio label="Option 1" name="option" />
    </>
  )
}
```

## Card Components

### Basic Card

```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui'

export function MyComponent() {
  return (
    <Card variant="elevated" hover>
      <CardHeader title="Card Title" subtitle="Subtitle" />
      <CardBody>
        <p>Content here</p>
      </CardBody>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  )
}
```

### Stats Card

```tsx
import { StatsCard } from '@/components/ui'

export function Dashboard() {
  return (
    <StatsCard
      icon={<DollarIcon />}
      title="Total Revenue"
      value="$10,000"
      change={{ value: 25, type: 'increase' }}
      color="blue"
    />
  )
}
```

## Table Components

### DataTable (With Sorting)

```tsx
import { DataTable } from '@/components/ui'

export function MyTable() {
  const data = [
    { id: 1, name: 'John', email: 'john@example.com' },
    { id: 2, name: 'Jane', email: 'jane@example.com' }
  ]

  return (
    <DataTable
      columns={[
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        {
          key: 'actions',
          label: 'Actions',
          render: (_, row) => (
            <Button onClick={() => handleEdit(row)}>Edit</Button>
          )
        }
      ]}
      data={data}
      loading={false}
      emptyMessage="No data found"
    />
  )
}
```

## Modal Components

### Basic Modal

```tsx
import { Modal } from '@/components/ui'
import { Button } from '@/components/ui'

export function MyComponent() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="My Modal"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button>Submit</Button>
          </>
        }
      >
        <p>Modal content here</p>
      </Modal>
    </>
  )
}
```

### Confirm Dialog

```tsx
import { ConfirmDialog } from '@/components/ui'

export function MyComponent() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Delete</Button>
      <ConfirmDialog
        isOpen={open}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={() => {
          handleDelete()
          setOpen(false)
        }}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}
```

## Pagination

```tsx
import { Pagination } from '@/components/ui'

export function MyTable() {
  const [page, setPage] = useState(1)

  return (
    <Pagination
      currentPage={page}
      totalPages={10}
      totalItems={100}
      itemsPerPage={10}
      onPageChange={setPage}
    />
  )
}
```

## Utility Components

### Badge

```tsx
import { Badge } from '@/components/ui'

<Badge label="Active" variant="success" size="md" />
<Badge label="Pending" variant="warning" size="sm" />
```

### Alert

```tsx
import { Alert } from '@/components/ui'

export function MyComponent() {
  return (
    <Alert
      title="Success"
      message="Your action completed successfully"
      type="success"
      onClose={() => {}}
    />
  )
}
```

### Empty State

```tsx
import { EmptyState } from '@/components/ui'

<EmptyState
  title="No Data"
  description="There's no data to display"
  action={<Button>Create Item</Button>}
/>
```

## Custom Hooks

### useToast

```typescript
import { useToast } from '@/hooks/useCustom'

export function MyComponent() {
  const { success, error, warning, info, toasts, removeToast } = useToast()

  const handleAction = async () => {
    try {
      // do something
      success('Action completed!')
    } catch (err) {
      error('Something went wrong')
    }
  }

  return (
    <>
      <Button onClick={handleAction}>Do Something</Button>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
```

### useLoading

```typescript
import { useLoading } from '@/hooks/useCustom'

export function MyComponent() {
  const { loading, withLoading, startLoading, stopLoading } = useLoading()

  const handleAsync = withLoading(async () => {
    const result = await fetchData()
    return result
  })

  return (
    <Button isLoading={loading} onClick={handleAsync}>
      Load Data
    </Button>
  )
}
```

### useAsync

```typescript
import { useAsync } from '@/hooks/useCustom'

export function MyComponent() {
  const { execute, status, value, error } = useAsync(
    async () => {
      const res = await fetch('/api/data')
      return res.json()
    },
    true // immediate
  )

  return (
    <div>
      {status === 'pending' && <p>Loading...</p>}
      {status === 'success' && <p>{JSON.stringify(value)}</p>}
      {status === 'error' && <p>Error: {error}</p>}
    </div>
  )
}
```

### useLocalStorage

```typescript
import { useLocalStorage } from '@/hooks/useCustom'

export function MyComponent() {
  const [user, setUser] = useLocalStorage('user', null)

  return (
    <div>
      <p>User: {user?.name}</p>
      <button onClick={() => setUser({ name: 'John' })}>
        Set User
      </button>
    </div>
  )
}
```

### useDebounce

```typescript
import { useDebounce } from '@/hooks/useCustom'

export function SearchComponent() {
  const [query, setQuery] = useState('')

  const handleSearch = useDebounce((q: string) => {
    // API call
    fetchResults(q)
  }, 300)

  return (
    <Input
      value={query}
      onChange={(e) => {
        setQuery(e.target.value)
        handleSearch(e.target.value)
      }}
      placeholder="Search..."
    />
  )
}
```

### useClickOutside

```typescript
import { useClickOutside } from '@/hooks/useCustom'

export function MyComponent() {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)

  useClickOutside(ref, () => setOpen(false))

  return (
    <div ref={ref}>
      {open && <p>Click outside to close</p>}
      <button onClick={() => setOpen(!open)}>Toggle</button>
    </div>
  )
}
```

## Animation Classes

Semua animasi tersedia sebagai Tailwind class:

```tsx
// Fade in animation
<div className="animate-fadeInUp">Content</div>

// Scale animation
<div className="animate-scaleIn">Content</div>

// Slide animation
<div className="animate-fadeInLeft">Content</div>

// Pulse glow effect
<div className="pulse-glow">Content</div>

// Float animation
<div className="float">Content</div>

// Shimmer loading effect
<div className="shimmer">Loading...</div>

// Smooth transitions
<div className="transition-smooth hover:shadow-lg">Hover me</div>
```

## Responsive Utilities

```tsx
// Responsive typography
<h1 className="text-responsive-xl">Big Title</h1>
<p className="text-responsive">Normal text</p>

// Smooth scroll
<div className="scroll-smooth">Content</div>

// Custom scrollbar
<div className="scrollbar-custom overflow-y-auto">Content</div>
```

## Best Practices

1. **Always use fullWidth for form inputs** dalam form layouts
2. **Use variants consistently** - primary untuk aksi utama, secondary untuk aksi sekunder
3. **Provide feedback** dengan useToast untuk setiap aksi penting
4. **Handle loading states** dengan isLoading prop
5. **Use proper semantic HTML** - Modal, Alert, Button sudah accessibility-friendly
6. **Debounce search inputs** dengan useDebounce untuk performa lebih baik
7. **Use DataTable untuk data besar** dengan sorting dan pagination

## Responsive Design

Semua komponen sudah responsive di mobile, tablet, dan desktop. Tailwind breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Gunakan breakpoint prefixes untuk responsive behavior:
```tsx
<div className="hidden md:block">
  Only visible on tablet and up
</div>
```

---

**Last Updated:** January 17, 2026
**Version:** 2.0.0
