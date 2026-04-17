import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAmount(cents: number, currency = 'eur'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100)
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  }).format(new Date(date))
}

export function daysUntil(date: string | Date | null | undefined): number | null {
  if (!date) return null
  const diff = new Date(date).getTime() - Date.now()
  return Math.ceil(diff / 86400000)
}

export function initials(name: string | null | undefined): string {
  if (!name) return 'U'
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    active:         '#34C759',
    open:           '#2196F3',
    in_progress:    '#FF9800',
    waiting_admin:  '#9C27B0',
    waiting_client: '#E91E63',
    resolved:       '#4CAF50',
    closed:         '#9E9E9E',
    past_due:       '#FF3B30',
    canceled:       '#9E9E9E',
    trialing:       '#FF9F0A',
    expired:        '#FF3B30',
    suspended:      '#FF9500',
  }
  return map[status] ?? '#9E9E9E'
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    active:         'Activo',
    open:           'Abierto',
    in_progress:    'En progreso',
    waiting_admin:  'Esperando respuesta',
    waiting_client: 'Necesita tu respuesta',
    resolved:       'Resuelto',
    closed:         'Cerrado',
    past_due:       'Pago pendiente',
    canceled:       'Cancelado',
    trialing:       'Prueba gratuita',
    expired:        'Expirado',
    suspended:      'Suspendido',
    pending:        'Pendiente',
    free:           'Gratuito',
  }
  return map[status] ?? status
}
