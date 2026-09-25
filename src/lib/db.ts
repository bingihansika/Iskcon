// Native Internal Database Engine for ISKCON Bookstore & Volunteer Management System
// Zero external database dependencies — Designed for 1-click serverless deployment (Vercel, Netlify, Render).

function generateId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

// Initial Data Seed
const initialLanguages = [
  { id: 'lang-1', name: 'English', code: 'en', active: true, createdAt: new Date() },
  { id: 'lang-2', name: 'Telugu', code: 'te', active: true, createdAt: new Date() },
  { id: 'lang-3', name: 'Hindi', code: 'hi', active: true, createdAt: new Date() },
  { id: 'lang-4', name: 'Kannada', code: 'kn', active: true, createdAt: new Date() },
  { id: 'lang-5', name: 'Tamil', code: 'ta', active: true, createdAt: new Date() },
  { id: 'lang-6', name: 'Malayalam', code: 'ml', active: true, createdAt: new Date() },
  { id: 'lang-7', name: 'Marathi', code: 'mr', active: true, createdAt: new Date() },
  { id: 'lang-8', name: 'Bengali', code: 'bn', active: true, createdAt: new Date() },
  { id: 'lang-9', name: 'Gujarati', code: 'gu', active: true, createdAt: new Date() },
  { id: 'lang-10', name: 'Odia', code: 'or', active: true, createdAt: new Date() },
  { id: 'lang-11', name: 'Punjabi', code: 'pa', active: true, createdAt: new Date() },
  { id: 'lang-12', name: 'Assamese', code: 'as', active: true, createdAt: new Date() },
];

const initialCategories = [
  { id: 'cat-1', name: 'Bhagavad Gita', description: 'The jewel of India’s spiritual wisdom spoken by Lord Krishna.', active: true, createdAt: new Date() },
  { id: 'cat-2', name: 'Srimad Bhagavatam', description: 'The spotless purana describing the pastimes of the Supreme Lord.', active: true, createdAt: new Date() },
  { id: 'cat-3', name: 'Krishna Books', description: 'The story of Lord Krishna’s divine lilas in Vrindavan and Mathura.', active: true, createdAt: new Date() },
  { id: 'cat-4', name: 'Spiritual Books', description: 'Introductory and intermediate guides to spiritual enlightenment.', active: true, createdAt: new Date() },
  { id: 'cat-5', name: 'Children\'s Books', description: 'Vibrant illustrated devotional stories for young minds.', active: true, createdAt: new Date() },
  { id: 'cat-6', name: 'Philosophy', description: 'Deep philosophical works analyzing consciousness, karma, and reincarnation.', active: true, createdAt: new Date() },
  { id: 'cat-7', name: 'Devotional Literature', description: 'Nectarine teachings on Bhakti-yoga and divine love.', active: true, createdAt: new Date() },
  { id: 'cat-8', name: 'Other ISKCON Publications', description: 'Specialized essays, periodicals, and temple publications.', active: true, createdAt: new Date() },
];

const initialBooks = [
  {
    id: 'book-1',
    bookId: 'BK-BG-001',
    name: 'Bhagavad-gita As It Is',
    author: 'A.C. Bhaktivedanta Swami Prabhupada',
    description: 'The definitive English translation and commentary on the Bhagavad-gita by Srila Prabhupada. Contains all 700 verses with word-for-word Sanskrit translations and profound purports.',
    categoryId: 'cat-1',
    featured: true,
    active: true,
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'book-2',
    bookId: 'BK-SB-001',
    name: 'Srimad-Bhagavatam (Canto 1)',
    author: 'A.C. Bhaktivedanta Swami Prabhupada',
    description: 'Creation - The first canto of the transcendental classic describing the history of King Pariksit and the arrival of Lord Krishna.',
    categoryId: 'cat-2',
    featured: true,
    active: true,
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'book-3',
    bookId: 'BK-CC-001',
    name: 'Sri Caitanya-caritamrta (Adi-lila Vol 1)',
    author: 'A.C. Bhaktivedanta Swami Prabhupada',
    description: 'The biography and spiritual philosophy of Sri Chaitanya Mahaprabhu, the golden avatar of divine love.',
    categoryId: 'cat-7',
    featured: true,
    active: true,
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'book-4',
    bookId: 'BK-KB-001',
    name: 'Krsna: The Supreme Personality of Godhead',
    author: 'A.C. Bhaktivedanta Swami Prabhupada',
    description: 'The summary study of the Tenth Canto of Srimad-Bhagavatam, depicting Lord Krishna’s sweet and heroic pastimes.',
    categoryId: 'cat-3',
    featured: true,
    active: true,
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'book-5',
    bookId: 'BK-NOD-001',
    name: 'The Nectar of Devotion',
    author: 'A.C. Bhaktivedanta Swami Prabhupada',
    description: 'The complete science of Bhakti-yoga, based on Srila Rupa Gosvami’s Bhakti-rasamrta-sindhu.',
    categoryId: 'cat-7',
    featured: false,
    active: true,
    coverImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600&auto=format&fit=crop&q=80',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'book-6',
    bookId: 'BK-SSR-001',
    name: 'The Science of Self-Realization',
    author: 'A.C. Bhaktivedanta Swami Prabhupada',
    description: 'Articles, conversations, and interviews with Srila Prabhupada on karma, reincarnation, superconsciousness, and meditation.',
    categoryId: 'cat-6',
    featured: true,
    active: true,
    coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'book-7',
    bookId: 'BK-CBH-001',
    name: 'Chant and Be Happy',
    author: 'A.C. Bhaktivedanta Swami Prabhupada',
    description: 'Includes famous interviews with George Harrison and John Lennon on mantra meditation.',
    categoryId: 'cat-4',
    featured: true,
    active: true,
    coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'book-8',
    bookId: 'BK-KART-001',
    name: 'Krsna Art & Illustrated Stories',
    author: 'A.C. Bhaktivedanta Swami Prabhupada & Devotee Artists',
    description: 'Large hardcover collection of classic ISKCON paintings and simple narrative stories for families.',
    categoryId: 'cat-5',
    featured: true,
    active: true,
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const initialEditions = [
  { id: 'ed-1', bookId: 'book-1', languageId: 'lang-1', editionName: 'English Deluxe Hardbound', isbn: '978-81-89574-101', price: 200, pages: 928, bookSize: 'Medium Hardbound (14x22 cm)', active: true, createdAt: new Date() },
  { id: 'ed-2', bookId: 'book-1', languageId: 'lang-2', editionName: 'Telugu Standard Edition', isbn: '978-81-89574-102', price: 180, pages: 900, bookSize: 'Paperback (14x21 cm)', active: true, createdAt: new Date() },
  { id: 'ed-3', bookId: 'book-1', languageId: 'lang-3', editionName: 'Hindi Standard Edition', isbn: '978-81-89574-103', price: 180, pages: 910, bookSize: 'Paperback (14x21 cm)', active: true, createdAt: new Date() },
  { id: 'ed-4', bookId: 'book-2', languageId: 'lang-1', editionName: 'English Deluxe Edition', isbn: '978-81-89574-201', price: 350, pages: 650, bookSize: 'Hardbound (16x24 cm)', active: true, createdAt: new Date() },
  { id: 'ed-5', bookId: 'book-3', languageId: 'lang-1', editionName: 'English Hardbound', isbn: '978-81-89574-301', price: 300, pages: 580, bookSize: 'Hardbound (16x24 cm)', active: true, createdAt: new Date() },
  { id: 'ed-6', bookId: 'book-4', languageId: 'lang-1', editionName: 'English Illustrated', isbn: '978-81-89574-401', price: 250, pages: 520, bookSize: 'Hardbound (16x24 cm)', active: true, createdAt: new Date() },
  { id: 'ed-7', bookId: 'book-5', languageId: 'lang-1', editionName: 'English Standard', isbn: '978-81-89574-501', price: 180, pages: 480, bookSize: 'Paperback (14x21 cm)', active: true, createdAt: new Date() },
  { id: 'ed-8', bookId: 'book-6', languageId: 'lang-1', editionName: 'English Paperback', isbn: '978-81-89574-601', price: 120, pages: 360, bookSize: 'Paperback (14x21 cm)', active: true, createdAt: new Date() },
];

const initialCampaign = {
  id: 'camp-1',
  campaignId: 'CAMP-2026-MARATHON',
  name: 'Annual Prabhupada Book Marathon 2026',
  startDate: new Date('2026-10-01T00:00:00Z'),
  endDate: new Date('2026-12-31T23:59:59Z'),
  status: 'ACTIVE',
  registrationStart: new Date('2026-09-01T00:00:00Z'),
  registrationEnd: new Date('2026-10-15T23:59:59Z'),
  orderingStart: new Date('2026-09-15T00:00:00Z'),
  orderingEnd: new Date('2026-12-15T23:59:59Z'),
  returnDeadline: new Date('2027-01-10T23:59:59Z'),
  settlementDeadline: new Date('2027-01-20T23:59:59Z'),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const initialUsers = [
  { id: 'usr-1', name: 'Srila Das (Super Admin)', email: 'superadmin@iskcon.org', mobile: '+91 9876543210', passwordHash: 'iskcon123', role: 'SUPER_ADMIN', status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date() },
  { id: 'usr-2', name: 'Radheshyam Das (Temple Admin)', email: 'admin@iskcon.org', mobile: '+91 9876543211', passwordHash: 'iskcon123', role: 'ADMIN', status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date() },
  { id: 'usr-3', name: 'Ravi Kumar', email: 'volunteer@iskcon.org', mobile: '+91 9876543212', passwordHash: 'iskcon123', role: 'VOLUNTEER', status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date() },
  { id: 'usr-4', name: 'Priya Sharma', email: 'priya@iskcon.org', mobile: '+91 9876543213', passwordHash: 'iskcon123', role: 'VOLUNTEER', status: 'ACTIVE', createdAt: new Date(), updatedAt: new Date() },
];

const initialVolunteers = [
  {
    id: 'vol-1',
    volunteerId: 'VOL1001',
    userId: 'usr-3',
    fullName: 'Ravi Kumar',
    email: 'volunteer@iskcon.org',
    mobile: '+91 9876543212',
    city: 'Hyderabad',
    address: 'Plot 42, Jubilee Hills, Hyderabad, Telangana',
    age: 28,
    preferredLanguage: 'Telugu',
    emergencyContact: '+91 9123456780',
    approvalStatus: 'APPROVED',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'vol-2',
    volunteerId: 'VOL1002',
    userId: 'usr-4',
    fullName: 'Priya Sharma',
    email: 'priya@iskcon.org',
    mobile: '+91 9876543213',
    city: 'Bangalore',
    address: '12th Cross, Indiranagar, Bangalore, Karnataka',
    age: 24,
    preferredLanguage: 'Kannada',
    emergencyContact: '+91 9123456781',
    approvalStatus: 'APPROVED',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const initialQRs = [
  { id: 'qr-1', volunteerId: 'vol-1', qrReference: 'QR-VOL1001', qrData: 'upi://pay?pa=temple.bookstore@upi&pn=ISKCON+Temple&tr=QR-VOL1001&cu=INR', active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 'qr-2', volunteerId: 'vol-2', qrReference: 'QR-VOL1002', qrData: 'upi://pay?pa=temple.bookstore@upi&pn=ISKCON+Temple&tr=QR-VOL1002&cu=INR', active: true, createdAt: new Date(), updatedAt: new Date() },
];

const initialInventories = initialEditions.map((ed, idx) => ({
  id: `inv-${idx + 1}`,
  bookEditionId: ed.id,
  campaignId: 'camp-1',
  totalStock: 500,
  availableStock: 350,
  reservedStock: 0,
  allocatedStock: 100,
  soldStock: 40,
  returnedStock: 10,
  damagedStock: 0,
  updatedAt: new Date(),
}));

const initialAllocations = [
  { id: 'alc-1', allocationId: 'ALC-VOL1001-01', volunteerId: 'vol-1', campaignId: 'camp-1', bookEditionId: 'ed-1', quantity: 50, issuedBy: 'Radheshyam Das', issuedAt: new Date(), status: 'RECEIVED_BY_VOLUNTEER' },
  { id: 'alc-2', allocationId: 'ALC-VOL1001-02', volunteerId: 'vol-1', campaignId: 'camp-1', bookEditionId: 'ed-2', quantity: 50, issuedBy: 'Radheshyam Das', issuedAt: new Date(), status: 'RECEIVED_BY_VOLUNTEER' },
];

const initialSales = [
  { id: 'sal-1', saleId: 'SAL-1001', volunteerId: 'vol-1', campaignId: 'camp-1', bookEditionId: 'ed-1', quantity: 35, sellingPrice: 200, totalAmount: 7000, paymentMethod: 'UPI', customerReference: 'Corporate Order', saleDate: new Date(), createdAt: new Date() },
  { id: 'sal-2', saleId: 'SAL-1002', volunteerId: 'vol-1', campaignId: 'camp-1', bookEditionId: 'ed-2', quantity: 30, sellingPrice: 180, totalAmount: 5400, paymentMethod: 'CASH', customerReference: 'Mall Stall', saleDate: new Date(), createdAt: new Date() },
];

const initialPayments = [
  { id: 'pay-1', paymentId: 'PAY-1001', transactionId: 'UPI-TXN-987123', volunteerId: 'vol-1', campaignId: 'camp-1', saleId: 'sal-1', amount: 7000, paymentMethod: 'UPI', status: 'VERIFIED', paymentDate: new Date(), verifiedBy: 'Radheshyam Das' },
  { id: 'pay-2', paymentId: 'PAY-1002', transactionId: 'CASH-REC-0012', volunteerId: 'vol-1', campaignId: 'camp-1', saleId: 'sal-2', amount: 3000, paymentMethod: 'CASH', status: 'VERIFIED', paymentDate: new Date(), verifiedBy: 'Radheshyam Das' },
];

const initialReturns = [
  { id: 'ret-1', returnId: 'RET-VOL1001-01', volunteerId: 'vol-1', campaignId: 'camp-1', status: 'APPROVED', requestedDate: new Date(), notes: 'Returning 15 English Gita copies' }
];

const initialSettlements = [
  { id: 'set-1', settlementId: 'SET-VOL1001', volunteerId: 'vol-1', campaignId: 'camp-1', totalSales: 12400, amountCollected: 12400, totalPaid: 10000, pendingAmount: 2400, status: 'PARTIALLY_SETTLED', createdAt: new Date(), updatedAt: new Date() }
];

const initialContent = [
  { id: 'cms-1', key: 'hero_headline', title: 'Hero Headline', content: 'Spread the Knowledge. Distribute the Wisdom.', updatedAt: new Date() },
  { id: 'cms-2', key: 'hero_subtitle', title: 'Hero Subtitle', content: 'Join thousands of ISKCON devotees worldwide in distributing transcendental literature written by His Divine Grace A.C. Bhaktivedanta Swami Prabhupada.', updatedAt: new Date() },
  { id: 'cms-3', key: 'temple_name', title: 'Temple Name', content: 'ISKCON Sri Sri Radha Gopinath Temple', updatedAt: new Date() },
  { id: 'cms-4', key: 'contact_email', title: 'Contact Email', content: 'books@iskcon.org', updatedAt: new Date() },
  { id: 'cms-5', key: 'contact_phone', title: 'Contact Phone', content: '+91 80 2347 1000', updatedAt: new Date() },
];

function applyOrderBy(items: any[], orderBy?: any): any[] {
  if (!orderBy) return items;
  const list = [...items];
  const keys = Object.keys(orderBy);
  if (keys.length === 0) return list;
  const key = keys[0];
  const direction = orderBy[key];
  list.sort((a, b) => {
    const valA = a[key] instanceof Date ? a[key].getTime() : a[key];
    const valB = b[key] instanceof Date ? b[key].getTime() : b[key];
    if (valA < valB) return direction === 'desc' ? 1 : -1;
    if (valA > valB) return direction === 'desc' ? -1 : 1;
    return 0;
  });
  return list;
}

class InternalStore {
  languages: any[] = [...initialLanguages];
  categories: any[] = [...initialCategories];
  books: any[] = [...initialBooks];
  editions: any[] = [...initialEditions];
  campaigns: any[] = [initialCampaign];
  users: any[] = [...initialUsers];
  volunteers: any[] = [...initialVolunteers];
  qrs: any[] = [...initialQRs];
  inventories: any[] = [...initialInventories];
  allocations: any[] = [...initialAllocations];
  sales: any[] = [...initialSales];
  payments: any[] = [...initialPayments];
  returns: any[] = [...initialReturns];
  returnItems: any[] = [];
  settlements: any[] = [...initialSettlements];
  orders: any[] = [];
  orderItems: any[] = [];
  notifications: any[] = [];
  auditLogs: any[] = [];
  contents: any[] = [...initialContent];

  matchWhere(item: any, where?: any): boolean {
    if (!where) return true;
    for (const key of Object.keys(where)) {
      if (key === 'OR' && Array.isArray(where.OR)) {
        const orMatch = where.OR.some((subWhere: any) => this.matchWhere(item, subWhere));
        if (!orMatch) return false;
        continue;
      }
      if (key === 'AND' && Array.isArray(where.AND)) {
        const andMatch = where.AND.every((subWhere: any) => this.matchWhere(item, subWhere));
        if (!andMatch) return false;
        continue;
      }
      const targetVal = where[key];
      if (typeof targetVal === 'object' && targetVal !== null) {
        if ('contains' in targetVal) {
          const fieldStr = String(item[key] || '').toLowerCase();
          if (!fieldStr.includes(String(targetVal.contains).toLowerCase())) return false;
        } else if ('equals' in targetVal) {
          if (item[key] !== targetVal.equals) return false;
        } else if ('in' in targetVal && Array.isArray(targetVal.in)) {
          if (!targetVal.in.includes(item[key])) return false;
        }
      } else {
        if (item[key] !== targetVal) return false;
      }
    }
    return true;
  }

  populateBook(b: any, include?: any) {
    if (!b) return null;
    const res = { ...b };
    if (include?.category) {
      res.category = this.categories.find((c) => c.id === b.categoryId) || null;
    }
    if (include?.editions) {
      let eds = this.editions.filter((e) => e.bookId === b.id);
      if (include.editions.include?.language) {
        eds = eds.map((e) => ({
          ...e,
          language: this.languages.find((l) => l.id === e.languageId) || null,
          inventories: this.inventories.filter((inv) => inv.bookEditionId === e.id),
        }));
      }
      res.editions = eds;
    }
    return res;
  }

  populateVolunteer(v: any, include?: any) {
    if (!v) return null;
    const res = { ...v };
    if (include?.user) {
      res.user = this.users.find((u) => u.id === v.userId) || null;
    }
    if (include?.qrCode) {
      res.qrCode = this.qrs.find((q) => q.volunteerId === v.id) || null;
    }
    return res;
  }

  populateEdition(e: any, include?: any) {
    if (!e) return null;
    const res = { ...e };
    if (include?.book) {
      res.book = this.populateBook(
        this.books.find((b) => b.id === e.bookId),
        include.book.include
      );
    }
    if (include?.language) {
      res.language = this.languages.find((l) => l.id === e.languageId) || null;
    }
    if (include?.inventories) {
      res.inventories = this.inventories.filter((inv) => inv.bookEditionId === e.id);
    }
    return res;
  }

  populateOrder(o: any, include?: any) {
    if (!o) return null;
    const res = { ...o };
    if (include?.volunteer) {
      res.volunteer = this.populateVolunteer(
        this.volunteers.find((v) => v.id === o.volunteerId),
        include.volunteer.include
      );
    }
    const rawItems = this.orderItems.filter((oi) => oi.orderId === o.id);
    res.items = rawItems.map((oi) => {
      const copy = { ...oi };
      if (include?.items?.include?.bookEdition) {
        copy.bookEdition = this.populateEdition(
          this.editions.find((e) => e.id === oi.bookEditionId),
          include.items.include.bookEdition.include
        );
      }
      return copy;
    });
    return res;
  }
}

const globalForDb = globalThis as unknown as { __ISKCON_STORE__?: InternalStore };
const store = globalForDb.__ISKCON_STORE__ || new InternalStore();
if (process.env.NODE_ENV !== 'production') {
  globalForDb.__ISKCON_STORE__ = store;
}

export const db: any = {
  $disconnect: async () => {},
  $transaction: async (arg: any) => {
    if (typeof arg === 'function') return await arg(db);
    if (Array.isArray(arg)) return Promise.all(arg);
  },

  websiteContent: {
    findMany: async () => [...store.contents],
    findUnique: async (args: any) => store.contents.find((c) => store.matchWhere(c, args.where)) || null,
    upsert: async (args: any) => {
      let item = store.contents.find((c) => store.matchWhere(c, args.where));
      if (item) {
        Object.assign(item, args.update, { updatedAt: new Date() });
      } else {
        item = { id: generateId('cms'), ...args.create, updatedAt: new Date() };
        store.contents.push(item);
      }
      return item;
    },
    update: async (args: any) => {
      const item = store.contents.find((c) => store.matchWhere(c, args.where));
      if (item) Object.assign(item, args.data, { updatedAt: new Date() });
      return item;
    },
  },

  campaign: {
    findFirst: async (args?: any) => store.campaigns.find((c) => store.matchWhere(c, args?.where)) || null,
    findUnique: async (args: any) => store.campaigns.find((c) => store.matchWhere(c, args.where)) || null,
    findMany: async () => [...store.campaigns],
    create: async (args: any) => {
      const item = { id: generateId('camp'), ...args.data, createdAt: new Date(), updatedAt: new Date() };
      store.campaigns.push(item);
      return item;
    },
    update: async (args: any) => {
      const item = store.campaigns.find((c) => store.matchWhere(c, args.where));
      if (item) Object.assign(item, args.data, { updatedAt: new Date() });
      return item;
    },
  },

  bookCategory: {
    findMany: async () => [...store.categories],
    findUnique: async (args: any) => store.categories.find((c) => store.matchWhere(c, args.where)) || null,
    create: async (args: any) => {
      const item = { id: generateId('cat'), ...args.data, createdAt: new Date() };
      store.categories.push(item);
      return item;
    },
  },

  book: {
    findMany: async (args?: any) => {
      let items = store.books.filter((b) => store.matchWhere(b, args?.where));
      items = applyOrderBy(items, args?.orderBy);
      if (args?.take) items = items.slice(0, args.take);
      return items.map((b) => store.populateBook(b, args?.include));
    },
    findUnique: async (args: any) => {
      const item = store.books.find((b) => store.matchWhere(b, args.where));
      return store.populateBook(item, args?.include);
    },
    findFirst: async (args?: any) => {
      let items = store.books.filter((b) => store.matchWhere(b, args?.where));
      items = applyOrderBy(items, args?.orderBy);
      return store.populateBook(items[0], args?.include);
    },
    count: async (args?: any) => store.books.filter((b) => store.matchWhere(b, args?.where)).length,
    create: async (args: any) => {
      const item = { id: generateId('book'), ...args.data, createdAt: new Date(), updatedAt: new Date() };
      store.books.push(item);
      return store.populateBook(item);
    },
    update: async (args: any) => {
      const item = store.books.find((b) => store.matchWhere(b, args.where));
      if (item) Object.assign(item, args.data, { updatedAt: new Date() });
      return store.populateBook(item);
    },
  },

  language: {
    findMany: async (args?: any) => store.languages.filter((l) => store.matchWhere(l, args?.where)),
    findUnique: async (args: any) => store.languages.find((l) => store.matchWhere(l, args.where)) || null,
    create: async (args: any) => {
      const item = { id: generateId('lang'), ...args.data, createdAt: new Date() };
      store.languages.push(item);
      return item;
    },
  },

  bookEdition: {
    findMany: async (args?: any) => {
      const items = store.editions.filter((e) => store.matchWhere(e, args?.where));
      return items.map((e) => store.populateEdition(e, args?.include));
    },
    findUnique: async (args: any) => {
      const item = store.editions.find((e) => store.matchWhere(e, args.where));
      return store.populateEdition(item, args?.include);
    },
    create: async (args: any) => {
      const item = { id: generateId('ed'), ...args.data, createdAt: new Date() };
      store.editions.push(item);
      return store.populateEdition(item);
    },
  },

  user: {
    findFirst: async (args?: any) => {
      let items = store.users.filter((u) => store.matchWhere(u, args?.where));
      items = applyOrderBy(items, args?.orderBy);
      return items[0] || null;
    },
    findUnique: async (args: any) => store.users.find((u) => store.matchWhere(u, args.where)) || null,
    findMany: async (args?: any) => {
      let items = store.users.filter((u) => store.matchWhere(u, args?.where));
      return applyOrderBy(items, args?.orderBy);
    },
    create: async (args: any) => {
      const item = { id: generateId('usr'), ...args.data, createdAt: new Date(), updatedAt: new Date() };
      store.users.push(item);
      return item;
    },
    update: async (args: any) => {
      const item = store.users.find((u) => store.matchWhere(u, args.where));
      if (item) Object.assign(item, args.data, { updatedAt: new Date() });
      return item;
    },
  },

  volunteer: {
    findFirst: async (args?: any) => {
      let items = store.volunteers.filter((v) => store.matchWhere(v, args?.where));
      items = applyOrderBy(items, args?.orderBy);
      return store.populateVolunteer(items[0], args?.include);
    },
    findUnique: async (args: any) => {
      const item = store.volunteers.find((v) => store.matchWhere(v, args.where));
      return store.populateVolunteer(item, args?.include);
    },
    findMany: async (args?: any) => {
      let items = store.volunteers.filter((v) => store.matchWhere(v, args?.where));
      items = applyOrderBy(items, args?.orderBy);
      return items.map((v) => store.populateVolunteer(v, args?.include));
    },
    count: async (args?: any) => store.volunteers.filter((v) => store.matchWhere(v, args?.where)).length,
    create: async (args: any) => {
      const item = { id: generateId('vol'), ...args.data, createdAt: new Date(), updatedAt: new Date() };
      store.volunteers.push(item);
      return store.populateVolunteer(item);
    },
    update: async (args: any) => {
      const item = store.volunteers.find((v) => store.matchWhere(v, args.where));
      if (item) Object.assign(item, args.data, { updatedAt: new Date() });
      return store.populateVolunteer(item);
    },
  },

  volunteerQR: {
    findFirst: async (args?: any) => store.qrs.find((q) => store.matchWhere(q, args?.where)) || null,
    findUnique: async (args: any) => store.qrs.find((q) => store.matchWhere(q, args.where)) || null,
    create: async (args: any) => {
      const item = { id: generateId('qr'), ...args.data, createdAt: new Date(), updatedAt: new Date() };
      store.qrs.push(item);
      return item;
    },
  },

  inventory: {
    findFirst: async (args?: any) => store.inventories.find((i) => store.matchWhere(i, args?.where)) || null,
    findMany: async (args?: any) => {
      const items = store.inventories.filter((i) => store.matchWhere(i, args?.where));
      return items.map((inv) => ({
        ...inv,
        bookEdition: args?.include?.bookEdition ? store.populateEdition(store.editions.find((e) => e.id === inv.bookEditionId), args.include.bookEdition.include) : null,
      }));
    },
    update: async (args: any) => {
      const item = store.inventories.find((i) => store.matchWhere(i, args.where));
      if (item) Object.assign(item, args.data, { updatedAt: new Date() });
      return item;
    },
    upsert: async (args: any) => {
      let item = store.inventories.find((i) => store.matchWhere(i, args.where));
      if (item) {
        Object.assign(item, args.update, { updatedAt: new Date() });
      } else {
        item = { id: generateId('inv'), ...args.create, updatedAt: new Date() };
        store.inventories.push(item);
      }
      return item;
    },
  },

  bookAllocation: {
    findMany: async (args?: any) => {
      let items = store.allocations.filter((a) => store.matchWhere(a, args?.where));
      items = applyOrderBy(items, args?.orderBy);
      return items.map((a) => ({
        ...a,
        bookEdition: args?.include?.bookEdition ? store.populateEdition(store.editions.find((e) => e.id === a.bookEditionId), args.include.bookEdition.include) : null,
        volunteer: args?.include?.volunteer ? store.populateVolunteer(store.volunteers.find((v) => v.id === a.volunteerId), args.include.volunteer.include) : null,
      }));
    },
    create: async (args: any) => {
      const item = { id: generateId('alc'), ...args.data, issuedAt: new Date() };
      store.allocations.push(item);
      return item;
    },
    update: async (args: any) => {
      const item = store.allocations.find((a) => store.matchWhere(a, args.where));
      if (item) Object.assign(item, args.data);
      return item;
    },
  },

  sale: {
    findMany: async (args?: any) => {
      let items = store.sales.filter((s) => store.matchWhere(s, args?.where));
      items = applyOrderBy(items, args?.orderBy);
      if (args?.take) items = items.slice(0, args.take);
      return items.map((s) => ({
        ...s,
        bookEdition: args?.include?.bookEdition ? store.populateEdition(store.editions.find((e) => e.id === s.bookEditionId), args.include.bookEdition.include) : null,
        volunteer: args?.include?.volunteer ? store.populateVolunteer(store.volunteers.find((v) => v.id === s.volunteerId), args.include.volunteer.include) : null,
      }));
    },
    create: async (args: any) => {
      const item = { id: generateId('sal'), ...args.data, saleDate: new Date(), createdAt: new Date() };
      store.sales.push(item);
      return item;
    },
    aggregate: async (args?: any) => {
      const items = store.sales.filter((s) => store.matchWhere(s, args?.where));
      const quantity = items.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
      const totalAmount = items.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
      return { _sum: { quantity, totalAmount } };
    },
  },

  payment: {
    findMany: async (args?: any) => {
      let items = store.payments.filter((p) => store.matchWhere(p, args?.where));
      items = applyOrderBy(items, args?.orderBy);
      return items.map((p) => ({
        ...p,
        volunteer: args?.include?.volunteer ? store.populateVolunteer(store.volunteers.find((v) => v.id === p.volunteerId), args.include.volunteer.include) : null,
      }));
    },
    create: async (args: any) => {
      const item = { id: generateId('pay'), ...args.data, paymentDate: new Date() };
      store.payments.push(item);
      return item;
    },
  },

  return: {
    findMany: async (args?: any) => {
      let items = store.returns.filter((r) => store.matchWhere(r, args?.where));
      items = applyOrderBy(items, args?.orderBy);
      return items.map((r) => ({
        ...r,
        volunteer: args?.include?.volunteer ? store.populateVolunteer(store.volunteers.find((v) => v.id === r.volunteerId), args.include.volunteer.include) : null,
        items: store.returnItems.filter((ri) => ri.returnId === r.id),
      }));
    },
    create: async (args: any) => {
      const item = { id: generateId('ret'), ...args.data, requestedDate: new Date() };
      store.returns.push(item);
      return item;
    },
    update: async (args: any) => {
      const item = store.returns.find((r) => store.matchWhere(r, args.where));
      if (item) Object.assign(item, args.data);
      return item;
    },
  },

  returnItem: {
    create: async (args: any) => {
      const item = { id: generateId('ri'), ...args.data };
      store.returnItems.push(item);
      return item;
    },
  },

  volunteerOrder: {
    findMany: async (args?: any) => {
      let items = store.orders.filter((o) => store.matchWhere(o, args?.where));
      items = applyOrderBy(items, args?.orderBy);
      if (args?.take) items = items.slice(0, args.take);
      return items.map((o) => store.populateOrder(o, args?.include));
    },
    findFirst: async (args?: any) => {
      let items = store.orders.filter((o) => store.matchWhere(o, args?.where));
      items = applyOrderBy(items, args?.orderBy);
      return items[0] ? store.populateOrder(items[0], args?.include) : null;
    },
    findUnique: async (args: any) => {
      const item = store.orders.find((o) => store.matchWhere(o, args.where));
      return store.populateOrder(item, args?.include);
    },
    create: async (args: any) => {
      const { items, ...orderData } = args.data;
      const id = generateId('ord');
      const item = { id, ...orderData, orderDate: new Date(), createdAt: new Date(), updatedAt: new Date() };
      store.orders.push(item);
      if (items?.create && Array.isArray(items.create)) {
        items.create.forEach((it: any) => {
          store.orderItems.push({
            id: generateId('voi'),
            orderId: id,
            ...it,
          });
        });
      }
      return store.populateOrder(item, args?.include);
    },
    update: async (args: any) => {
      const item = store.orders.find((o) => store.matchWhere(o, args.where));
      if (item) Object.assign(item, args.data, { updatedAt: new Date() });
      return store.populateOrder(item, args?.include);
    },
  },

  volunteerOrderItem: {
    create: async (args: any) => {
      const item = { id: generateId('voi'), ...args.data };
      store.orderItems.push(item);
      return item;
    },
  },

  settlement: {
    findFirst: async (args?: any) => store.settlements.find((s) => store.matchWhere(s, args?.where)) || null,
    findMany: async (args?: any) => {
      let items = store.settlements.filter((s) => store.matchWhere(s, args?.where));
      items = applyOrderBy(items, args?.orderBy);
      return items.map((s) => ({
        ...s,
        volunteer: args?.include?.volunteer ? store.populateVolunteer(store.volunteers.find((v) => v.id === s.volunteerId), args.include.volunteer.include) : null,
      }));
    },
    upsert: async (args: any) => {
      let item = store.settlements.find((s) => store.matchWhere(s, args.where));
      if (item) {
        Object.assign(item, args.update, { updatedAt: new Date() });
      } else {
        item = { id: generateId('set'), ...args.create, createdAt: new Date(), updatedAt: new Date() };
        store.settlements.push(item);
      }
      return item;
    },
    update: async (args: any) => {
      const item = store.settlements.find((s) => store.matchWhere(s, args.where));
      if (item) Object.assign(item, args.data, { updatedAt: new Date() });
      return item;
    },
  },

  notification: {
    findMany: async (args?: any) => {
      let items = store.notifications.filter((n) => store.matchWhere(n, args?.where));
      return applyOrderBy(items, args?.orderBy);
    },
    create: async (args: any) => {
      const item = { id: generateId('notif'), ...args.data, createdAt: new Date() };
      store.notifications.push(item);
      return item;
    },
    updateMany: async (args: any) => {
      store.notifications.forEach((n) => {
        if (store.matchWhere(n, args.where)) Object.assign(n, args.data);
      });
      return { count: 1 };
    },
  },

  auditLog: {
    findMany: async (args?: any) => {
      let items = store.auditLogs.filter((a) => store.matchWhere(a, args?.where));
      return applyOrderBy(items, args?.orderBy);
    },
    create: async (args: any) => {
      const item = { id: generateId('audit'), ...args.data, createdAt: new Date() };
      store.auditLogs.push(item);
      return item;
    },
  },
};

export const prisma = db;
export default db;
