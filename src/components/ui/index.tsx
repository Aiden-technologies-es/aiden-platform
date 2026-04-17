'use client'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

// ═══════════════ BUTTON ═══════════════
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'brand'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-aiden-sm transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none'
    const variants = {
      primary:   'bg-[#1D1D1F] text-white hover:bg-[#2A2A35] active:scale-[.97]',
      brand:     'bg-brand text-white hover:bg-brand-dark active:scale-[.97] shadow-sm',
      secondary: 'bg-black/6 text-[#3A3A4A] hover:bg-black/10 active:scale-[.97]',
      ghost:     'bg-transparent text-[#3A3A4A] border border-black/10 hover:bg-black/5 active:scale-[.97]',
      danger:    'bg-red-50 text-red-600 hover:bg-red-100 active:scale-[.97]',
    }
    const sizes = {
      sm:   'px-3 py-1.5 text-xs',
      md:   'px-4 py-2.5 text-sm',
      lg:   'px-6 py-3 text-base',
      icon: 'p-2 w-9 h-9',
    }
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? <Spinner className="w-4 h-4" /> : children}
      </button>
    )
  }
)
Button.displayName = 'Button'

// ═══════════════ BADGE ═══════════════
interface BadgeProps { label: string; color?: string; className?: string }
export function Badge({ label, color = '#9E9E9E', className }: BadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap', className)}
      style={{ background: color + '20', color }}
    >
      {label}
    </span>
  )
}

// ═══════════════ CARD ═══════════════
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}
export function Card({ className, hover, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white/80 border border-[rgba(180,190,210,.35)] rounded-aiden shadow-aiden',
        hover && 'transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-aiden-md cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center justify-between p-5 pb-3', className)} {...props}>{children}</div>
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-sm font-bold text-[#0A0A0F] tracking-tight', className)} {...props}>{children}</h3>
}

export function CardBody({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-5 pb-5', className)} {...props}>{children}</div>
}

// ═══════════════ INPUT ═══════════════
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="text-xs font-bold text-[#7A7A8C] uppercase tracking-wider">{label}</label>}
      <input
        ref={ref}
        id={id}
        className={cn(
          'w-full px-3 py-2.5 border-[1.5px] rounded-aiden-sm text-sm text-[#0A0A0F] bg-black/[.03] outline-none transition-colors',
          'border-black/10 focus:border-brand focus:bg-white/90',
          error && 'border-red-400',
          className
        )}
        {...props}
      />
      {hint && !error && <p className="text-xs text-[#7A7A8C]">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'

// ═══════════════ SELECT ═══════════════
export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }>(
  ({ className, label, id, children, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="text-xs font-bold text-[#7A7A8C] uppercase tracking-wider">{label}</label>}
      <select
        ref={ref}
        id={id}
        className={cn(
          'w-full px-3 py-2.5 border-[1.5px] rounded-aiden-sm text-sm text-[#0A0A0F] bg-black/[.03] outline-none transition-colors border-black/10 focus:border-brand focus:bg-white/90',
          className
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  )
)
Select.displayName = 'Select'

// ═══════════════ SPINNER ═══════════════
export function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn('animate-spin text-current', className)} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  )
}

// ═══════════════ STAT CARD ═══════════════
interface StatCardProps {
  value: string | number
  label: string
  icon: React.ReactNode
  color?: string
  onClick?: () => void
  alert?: boolean
}
export function StatCard({ value, label, icon, color = '#13967e', onClick, alert }: StatCardProps) {
  return (
    <Card
      hover={!!onClick}
      onClick={onClick}
      className={alert ? 'border-red-200' : ''}
    >
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-[11px] flex items-center justify-center flex-shrink-0" style={{ background: color + '18' }}>
          <span style={{ color }}>{icon}</span>
        </div>
        <div>
          <div className={cn('text-xl font-bold tracking-tight', alert && 'text-red-500')}>{value}</div>
          <div className="text-[11px] text-[#7A7A8C] font-medium mt-0.5">{label}</div>
        </div>
      </div>
    </Card>
  )
}

// ═══════════════ EMPTY STATE ═══════════════
export function EmptyState({ icon, title, description, action }: {
  icon: string
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="text-center py-12 px-6">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-sm font-bold text-[#0A0A0F] mb-1.5">{title}</h3>
      <p className="text-sm text-[#7A7A8C] max-w-xs mx-auto leading-relaxed mb-4">{description}</p>
      {action}
    </div>
  )
}

// ═══════════════ SECTION CARD ═══════════════
export function SectionCard({ title, action, children, className }: {
  title?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <Card className={cn('mb-3', className)}>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {action}
        </CardHeader>
      )}
      <CardBody className={title ? 'pt-0' : ''}>{children}</CardBody>
    </Card>
  )
}
