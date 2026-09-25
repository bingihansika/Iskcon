import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | null | undefined): string {
  const num = typeof amount === 'number' && !isNaN(amount) ? amount : Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusBadgeClass(status: string): string {
  switch (status?.toUpperCase()) {
    case 'APPROVED':
    case 'ACTIVE':
    case 'SUCCESSFUL':
    case 'VERIFIED':
    case 'COMPLETED':
    case 'RECEIVED_BY_VOLUNTEER':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'PENDING':
    case 'REQUESTED':
    case 'RETURN_REQUESTED':
    case 'UNDER_REVIEW':
    case 'PARTIALLY_SETTLED':
    case 'PARTIALLY_RECEIVED':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'REJECTED':
    case 'CANCELLED':
    case 'FAILED':
    case 'SUSPENDED':
    case 'INACTIVE':
      return 'bg-rose-100 text-rose-800 border-rose-300';
    case 'READY_FOR_PICKUP':
    case 'ISSUED':
      return 'bg-sky-100 text-sky-800 border-sky-300';
    case 'LOW_STOCK':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'OUT_OF_STOCK':
      return 'bg-gray-100 text-gray-700 border-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}
