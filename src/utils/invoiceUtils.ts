import { Invoice } from '../services/api'

/**
 * Generate next invoice number based on existing invoices
 * Format: INV-YYYY-##
 * Example: INV-2025-01, INV-2025-02, etc.
 */
export const generateNextInvoiceNumber = (invoices: Invoice[]): string => {
  const currentYear = new Date().getFullYear()
  const yearPrefix = `INV-${currentYear}-`
  
  // Filter invoices for current year
  const currentYearInvoices = invoices.filter(inv => 
    inv.invoiceNumber?.startsWith(yearPrefix)
  )
  
  if (currentYearInvoices.length === 0) {
    return `${yearPrefix}01`
  }
  
  // Extract numbers and find the highest
  const numbers = currentYearInvoices
    .map(inv => {
      const match = inv.invoiceNumber?.match(/INV-\d{4}-(\d+)/)
      return match ? parseInt(match[1]) : 0
    })
    .filter(num => num > 0)
  
  const maxNumber = Math.max(...numbers)
  const nextNumber = maxNumber + 1
  
  return `${yearPrefix}${String(nextNumber).padStart(2, '0')}`
}

/**
 * Calculate due date: 3 days after issue date
 */
export const calculateDueDate = (issueDate: string): string => {
  const date = new Date(issueDate)
  date.setDate(date.getDate() + 3)
  return date.toISOString().split('T')[0]
}
