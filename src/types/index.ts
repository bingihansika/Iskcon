export interface User {
  id: string;
  name: string;
  mobile: string;
  email: string;
  role: 'PUBLIC' | 'VOLUNTEER' | 'ADMIN' | 'SUPER_ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
}

export interface Volunteer {
  id: string;
  volunteerId: string;
  userId: string;
  fullName: string;
  mobile: string;
  email: string;
  city: string;
  address: string;
  age: number;
  preferredLanguage: string;
  emergencyContact: string;
  verificationDetails?: string;
  profilePhoto?: string;
  approvalStatus: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface BookCategory {
  id: string;
  name: string;
  description?: string;
  active: boolean;
}

export interface Language {
  id: string;
  name: string;
  code: string;
  active: boolean;
}

export interface BookEdition {
  id: string;
  bookId: string;
  languageId: string;
  language?: Language;
  editionName: string;
  isbn?: string;
  price: number;
  pages: number;
  bookSize: string;
  active: boolean;
}

export interface Book {
  id: string;
  bookId: string;
  name: string;
  author: string;
  description: string;
  categoryId: string;
  category?: BookCategory;
  coverImage?: string;
  featured: boolean;
  active: boolean;
  editions?: BookEdition[];
}

export interface Inventory {
  id: string;
  bookEditionId: string;
  bookEdition?: BookEdition;
  campaignId: string;
  totalStock: number;
  availableStock: number;
  reservedStock: number;
  allocatedStock: number;
  soldStock: number;
  returnedStock: number;
  damagedStock: number;
}

export interface VolunteerOrderItem {
  id: string;
  orderId: string;
  bookEditionId: string;
  bookEdition?: BookEdition;
  requestedQuantity: number;
  approvedQuantity: number;
}

export interface VolunteerOrder {
  id: string;
  orderId: string;
  volunteerId: string;
  volunteer?: Volunteer;
  campaignId: string;
  orderDate: string;
  status: 'PENDING' | 'APPROVED' | 'PARTIALLY_APPROVED' | 'READY_FOR_PICKUP' | 'PICKED_UP' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  items?: VolunteerOrderItem[];
}

export interface BookAllocation {
  id: string;
  allocationId: string;
  volunteerId: string;
  campaignId: string;
  bookEditionId: string;
  bookEdition?: BookEdition;
  quantity: number;
  issuedAt: string;
  issuedBy: string;
  receivedAt?: string;
  status: 'ISSUED' | 'RECEIVED_BY_VOLUNTEER' | 'RETURNED';
}

export interface Sale {
  id: string;
  saleId: string;
  volunteerId: string;
  volunteer?: Volunteer;
  campaignId: string;
  bookEditionId: string;
  bookEdition?: BookEdition;
  quantity: number;
  sellingPrice: number;
  totalAmount: number;
  paymentMethod: 'UPI' | 'CASH' | 'OTHER';
  customerReference?: string;
  saleDate: string;
}

export interface Payment {
  id: string;
  paymentId: string;
  transactionId: string;
  volunteerId: string;
  volunteer?: Volunteer;
  campaignId: string;
  saleId?: string;
  amount: number;
  paymentMethod: 'UPI' | 'CASH' | 'ONLINE';
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'REFUNDED' | 'VERIFIED';
  paymentDate: string;
  verifiedBy?: string;
}

export interface VolunteerQR {
  id: string;
  volunteerId: string;
  qrReference: string;
  qrData: string;
  active: boolean;
}

export interface ReturnItem {
  id: string;
  returnId: string;
  bookEditionId: string;
  bookEdition?: BookEdition;
  requestedQuantity: number;
  approvedQuantity: number;
  receivedQuantity: number;
}

export interface Return {
  id: string;
  returnId: string;
  volunteerId: string;
  volunteer?: Volunteer;
  campaignId: string;
  status: 'REQUESTED' | 'APPROVED' | 'RECEIVED_BY_TEMPLE' | 'PARTIALLY_RECEIVED' | 'COMPLETED' | 'REJECTED';
  requestedDate: string;
  notes?: string;
  items?: ReturnItem[];
}

export interface Settlement {
  id: string;
  settlementId: string;
  volunteerId: string;
  volunteer?: Volunteer;
  campaignId: string;
  totalSales: number;
  amountCollected: number;
  totalPaid: number;
  pendingAmount: number;
  status: 'PENDING' | 'PARTIALLY_SETTLED' | 'COMPLETED';
  settlementDate?: string;
}

export interface Campaign {
  id: string;
  campaignId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'DRAFT' | 'REGISTRATION_OPEN' | 'ACTIVE' | 'RETURN_PERIOD' | 'SETTLEMENT_PERIOD' | 'COMPLETED' | 'CANCELLED';
  registrationStart: string;
  registrationEnd: string;
  orderingStart: string;
  orderingEnd: string;
  returnDeadline: string;
  settlementDeadline: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  role: string;
  action: string;
  entityType: string;
  entityId?: string;
  oldData?: string;
  newData?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
