import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting ISKCON Bookstore Database Seed...');

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.settlement.deleteMany();
  await prisma.returnItem.deleteMany();
  await prisma.return.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.bookAllocation.deleteMany();
  await prisma.volunteerOrderItem.deleteMany();
  await prisma.volunteerOrder.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.volunteerQR.deleteMany();
  await prisma.volunteer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.bookEdition.deleteMany();
  await prisma.book.deleteMany();
  await prisma.bookCategory.deleteMany();
  await prisma.language.deleteMany();
  await prisma.websiteContent.deleteMany();

  console.log('✓ Cleared old database tables');

  // 1. Languages (12 Indian Languages)
  const languagesData = [
    { name: 'English', code: 'en' },
    { name: 'Telugu', code: 'te' },
    { name: 'Hindi', code: 'hi' },
    { name: 'Kannada', code: 'kn' },
    { name: 'Tamil', code: 'ta' },
    { name: 'Malayalam', code: 'ml' },
    { name: 'Marathi', code: 'mr' },
    { name: 'Bengali', code: 'bn' },
    { name: 'Gujarati', code: 'gu' },
    { name: 'Odia', code: 'or' },
    { name: 'Punjabi', code: 'pa' },
    { name: 'Assamese', code: 'as' },
  ];

  const languagesMap = new Map<string, any>();
  for (const lang of languagesData) {
    const created = await prisma.language.create({ data: lang });
    languagesMap.set(lang.name, created);
  }
  console.log(`✓ Seeded ${languagesData.length} Languages`);

  // 2. Book Categories
  const categoriesData = [
    { name: 'Bhagavad Gita', description: 'The jewel of India’s spiritual wisdom spoken by Lord Krishna.' },
    { name: 'Srimad Bhagavatam', description: 'The spotless purana describing the pastimes of the Supreme Lord.' },
    { name: 'Krishna Books', description: 'The story of Lord Krishna’s divine lilas in Vrindavan and Mathura.' },
    { name: 'Spiritual Books', description: 'Introductory and intermediate guides to spiritual enlightenment.' },
    { name: 'Children\'s Books', description: 'Vibrant illustrated devotional stories for young minds.' },
    { name: 'Philosophy', description: 'Deep philosophical works analyzing consciousness, karma, and reincarnation.' },
    { name: 'Devotional Literature', description: 'Nectarine teachings on Bhakti-yoga and divine love.' },
    { name: 'Other ISKCON Publications', description: 'Specialized essays, periodicals, and temple publications.' },
  ];

  const categoriesMap = new Map<string, any>();
  for (const cat of categoriesData) {
    const created = await prisma.bookCategory.create({ data: cat });
    categoriesMap.set(cat.name, created);
  }
  console.log(`✓ Seeded ${categoriesData.length} Book Categories`);

  // 3. Books (22 books)
  const booksData = [
    {
      bookId: 'BK-BG-001',
      name: 'Bhagavad-gita As It Is',
      author: 'A.C. Bhaktivedanta Swami Prabhupada',
      description: 'The definitive English translation and commentary on the Bhagavad-gita by Srila Prabhupada. Contains all 700 verses with word-for-word Sanskrit translations and profound purports.',
      categoryName: 'Bhagavad Gita',
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    },
    {
      bookId: 'BK-SB-001',
      name: 'Srimad-Bhagavatam (Canto 1)',
      author: 'A.C. Bhaktivedanta Swami Prabhupada',
      description: 'Creation - The first canto of the transcendental classic describing the history of King Pariksit and the arrival of Lord Krishna.',
      categoryName: 'Srimad Bhagavatam',
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    },
    {
      bookId: 'BK-CC-001',
      name: 'Sri Caitanya-caritamrta (Adi-lila Vol 1)',
      author: 'A.C. Bhaktivedanta Swami Prabhupada',
      description: 'The biography and spiritual philosophy of Sri Chaitanya Mahaprabhu, the golden avatar of divine love.',
      categoryName: 'Devotional Literature',
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    },
    {
      bookId: 'BK-KB-001',
      name: 'Krsna: The Supreme Personality of Godhead',
      author: 'A.C. Bhaktivedanta Swami Prabhupada',
      description: 'The summary study of the Tenth Canto of Srimad-Bhagavatam, depicting Lord Krishna’s sweet and heroic pastimes.',
      categoryName: 'Krishna Books',
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80',
    },
    {
      bookId: 'BK-NOD-001',
      name: 'The Nectar of Devotion',
      author: 'A.C. Bhaktivedanta Swami Prabhupada',
      description: 'The complete science of Bhakti-yoga, based on Srila Rupa Gosvami’s Bhakti-rasamrta-sindhu.',
      categoryName: 'Devotional Literature',
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600&auto=format&fit=crop&q=80',
    },
    {
      bookId: 'BK-TLC-001',
      name: 'Teachings of Lord Caitanya',
      author: 'A.C. Bhaktivedanta Swami Prabhupada',
      description: 'A masterwork detailing Lord Chaitanya’s discussions with Sanatana Gosvami, Rupa Gosvami, and Ramananda Raya.',
      categoryName: 'Philosophy',
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80',
    },
    {
      bookId: 'BK-ISO-001',
      name: 'Sri Isopanisad',
      author: 'A.C. Bhaktivedanta Swami Prabhupada',
      description: 'Eighteen essential Vedic mantras offering deep knowledge about the Supreme Lord and our relationship with Him.',
      categoryName: 'Philosophy',
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
    },
    {
      bookId: 'BK-SSR-001',
      name: 'The Science of Self-Realization',
      author: 'A.C. Bhaktivedanta Swami Prabhupada',
      description: 'Articles, conversations, and interviews with Srila Prabhupada on karma, reincarnation, superconsciousness, and meditation.',
      categoryName: 'Philosophy',
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80',
    },
    {
      bookId: 'BK-PQPA-001',
      name: 'Perfect Questions, Perfect Answers',
      author: 'A.C. Bhaktivedanta Swami Prabhupada',
      description: 'Conversations between Srila Prabhupada and a Peace Corps volunteer Bob Cohen in Mayapur, India.',
      categoryName: 'Spiritual Books',
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&auto=format&fit=crop&q=80',
    },
    {
      bookId: 'BK-LOB-001',
      name: 'Light of the Bhagavata',
      author: 'A.C. Bhaktivedanta Swami Prabhupada',
      description: 'Poetic verses from the autumn chapter of Srimad-Bhagavatam accompanied by vivid Chinese brushwork illustrations.',
      categoryName: 'Spiritual Books',
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600&auto=format&fit=crop&q=80',
    },
    {
      bookId: 'BK-POP-001',
      name: 'Path of Perfection',
      author: 'A.C. Bhaktivedanta Swami Prabhupada',
      description: 'A clear analysis of the sixth chapter of Bhagavad-gita on yoga practice and mind control.',
      categoryName: 'Spiritual Books',
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80',
    },
    {
      bookId: 'BK-RVK-001',
      name: 'Raja-Vidya: The King of Knowledge',
      author: 'A.C. Bhaktivedanta Swami Prabhupada',
      description: 'Lectures on the ninth chapter of Bhagavad-gita explaining confidential knowledge of devotional service.',
      categoryName: 'Philosophy',
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1474366521946-c3d4b507abf2?w=600&auto=format&fit=crop&q=80',
    },
    {
      bookId: 'BK-BBD-001',
      name: 'Beyond Birth and Death',
      author: 'A.C. Bhaktivedanta Swami Prabhupada',
      description: 'Explores the transmigrational journey of the eternal soul beyond physical death.',
      categoryName: 'Spiritual Books',
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    },
    {
      bookId: 'BK-POY-001',
      name: 'Perfection of Yoga',
      author: 'A.C. Bhaktivedanta Swami Prabhupada',
      description: 'Unveils genuine yoga as a spiritual discipline for awakening love of God.',
      categoryName: 'Spiritual Books',
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
    },
    {
      bookId: 'BK-OWK-001',
      name: 'On the Way to Krsna',
      author: 'A.C. Bhaktivedanta Swami Prabhupada',
      description: 'Illuminating guide on escaping material anxiety and connecting with Lord Krishna.',
      categoryName: 'Spiritual Books',
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=600&auto=format&fit=crop&q=80',
    },
    {
      bookId: 'BK-KTY-001',
      name: 'Krsna Consciousness: Topmost Yoga System',
      author: 'A.C. Bhaktivedanta Swami Prabhupada',
      description: 'Explains why chanting the Hare Krishna maha-mantra is the ultimate yoga for this age.',
      categoryName: 'Spiritual Books',
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    },
    {
      bookId: 'BK-MOG-001',
      name: 'Message of Godhead',
      author: 'A.C. Bhaktivedanta Swami Prabhupada',
      description: 'Written in 1940s India, presenting Vedic answers to modern societal and moral dilemmas.',
      categoryName: 'Philosophy',
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
    },
    {
      bookId: 'BK-EKC-001',
      name: 'Elevation to Krsna Consciousness',
      author: 'A.C. Bhaktivedanta Swami Prabhupada',
      description: 'Step-by-step guidance on elevating human life to transcendental joy.',
      categoryName: 'Spiritual Books',
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600&auto=format&fit=crop&q=80',
    },
    {
      bookId: 'BK-CBH-001',
      name: 'Chant and Be Happy',
      author: 'A.C. Bhaktivedanta Swami Prabhupada',
      description: 'Includes famous interviews with George Harrison and John Lennon on mantra meditation.',
      categoryName: 'Spiritual Books',
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80',
    },
    {
      bookId: 'BK-KART-001',
      name: 'Krsna Art & Illustrated Stories',
      author: 'A.C. Bhaktivedanta Swami Prabhupada & Devotee Artists',
      description: 'Large hardcover collection of classic ISKCON paintings and simple narrative stories for families.',
      categoryName: 'Children\'s Books',
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    },
    {
      bookId: 'BK-TMB-001',
      name: 'Tales from Mahabharata for Children',
      author: 'BBT Authors',
      description: 'Inspiring stories of Arjuna, Bhishma, and Lord Krishna tailored for young readers.',
      categoryName: 'Children\'s Books',
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80',
    },
    {
      bookId: 'BK-LCL-001',
      name: 'Life Comes from Life',
      author: 'A.C. Bhaktivedanta Swami Prabhupada',
      description: 'Morning walk discussions critiquing modern mechanistic theories on the origin of life.',
      categoryName: 'Philosophy',
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const booksMap = new Map<string, any>();
  for (const b of booksData) {
    const category = categoriesMap.get(b.categoryName);
    const created = await prisma.book.create({
      data: {
        bookId: b.bookId,
        name: b.name,
        author: b.author,
        description: b.description,
        categoryId: category.id,
        featured: b.featured,
        coverImage: b.coverImage,
      }
    });
    booksMap.set(b.name, created);
  }
  console.log(`✓ Seeded ${booksData.length} ISKCON Books`);

  // 4. Campaign (Active Marathon 2026)
  const campaign = await prisma.campaign.create({
    data: {
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
    }
  });
  console.log(`✓ Seeded Campaign: ${campaign.name}`);

  // 5. Book Editions & Inventory Setup
  const editionPrices: Record<string, number> = {
    'Bhagavad-gita As It Is': 200,
    'Srimad-Bhagavatam (Canto 1)': 350,
    'Sri Caitanya-caritamrta (Adi-lila Vol 1)': 300,
    'Krsna: The Supreme Personality of Godhead': 250,
    'The Nectar of Devotion': 180,
    'Teachings of Lord Caitanya': 150,
    'Sri Isopanisad': 50,
    'The Science of Self-Realization': 120,
    'Perfect Questions, Perfect Answers': 40,
    'Light of the Bhagavata': 160,
    'Path of Perfection': 60,
    'Raja-Vidya: The King of Knowledge': 50,
    'Beyond Birth and Death': 30,
    'Perfection of Yoga': 30,
    'On the Way to Krsna': 30,
    'Krsna Consciousness: Topmost Yoga System': 30,
    'Message of Godhead': 70,
    'Elevation to Krsna Consciousness': 40,
    'Chant and Be Happy': 50,
    'Krsna Art & Illustrated Stories': 400,
    'Tales from Mahabharata for Children': 150,
    'Life Comes from Life': 90,
  };

  const editionsList: any[] = [];
  const primaryLangs = ['English', 'Telugu', 'Hindi', 'Kannada', 'Tamil', 'Bengali'];

  for (const [bookName, bookObj] of booksMap.entries()) {
    const basePrice = editionPrices[bookName] || 100;
    
    // Create English edition
    const engLang = languagesMap.get('English');
    const engEdition = await prisma.bookEdition.create({
      data: {
        bookId: bookObj.id,
        languageId: engLang.id,
        editionName: 'Deluxe Hardbound',
        isbn: `978-81-89574-${Math.floor(100 + Math.random() * 900)}`,
        price: basePrice,
        pages: bookName.includes('Gita') ? 928 : 450,
        bookSize: 'Medium Hardbound (14x22 cm)',
      }
    });
    editionsList.push(engEdition);

    // Create 2-3 regional language editions for each book
    const otherLangs = primaryLangs.filter(l => l !== 'English');
    for (let i = 0; i < 2; i++) {
      const lName = otherLangs[(bookObj.name.length + i) % otherLangs.length];
      const langObj = languagesMap.get(lName);
      if (langObj) {
        const regionalEdition = await prisma.bookEdition.create({
          data: {
            bookId: bookObj.id,
            languageId: langObj.id,
            editionName: `${lName} Standard Edition`,
            isbn: `978-81-89574-${Math.floor(100 + Math.random() * 900)}`,
            price: Math.max(20, basePrice - 20),
            pages: 400,
            bookSize: 'Paperback (14x21 cm)',
          }
        });
        editionsList.push(regionalEdition);
      }
    }
  }

  // Seed inventory for all created editions under active campaign
  for (const ed of editionsList) {
    const total = 300 + Math.floor(Math.random() * 200);
    const allocated = 50 + Math.floor(Math.random() * 40);
    const sold = 30 + Math.floor(Math.random() * 20);
    const returned = 5;
    const available = total - (allocated + sold);

    await prisma.inventory.create({
      data: {
        bookEditionId: ed.id,
        campaignId: campaign.id,
        totalStock: total,
        availableStock: available,
        allocatedStock: allocated,
        soldStock: sold,
        returnedStock: returned,
        damagedStock: 0,
      }
    });
  }
  console.log(`✓ Seeded ${editionsList.length} Book Editions & Campaign Inventory`);

  // 6. Demo Users (Admin, Super Admin, Volunteers)
  const passwordHash = await bcrypt.hash('iskcon123', 10);

  const superAdminUser = await prisma.user.create({
    data: {
      name: 'Srila Das (Super Admin)',
      email: 'superadmin@iskcon.org',
      mobile: '+91 9876543210',
      passwordHash,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    }
  });

  const adminUser = await prisma.user.create({
    data: {
      name: 'Radheshyam Das (Temple Admin)',
      email: 'admin@iskcon.org',
      mobile: '+91 9876543211',
      passwordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
    }
  });

  // Demo Volunteer Users
  const volunteersData = [
    {
      name: 'Ravi Kumar',
      email: 'volunteer@iskcon.org',
      mobile: '+91 9876543212',
      volunteerId: 'VOL1001',
      city: 'Hyderabad',
      address: 'Plot 42, Jubilee Hills, Hyderabad, Telangana',
      age: 28,
      preferredLanguage: 'Telugu',
      emergencyContact: '+91 9123456780',
      approvalStatus: 'APPROVED',
    },
    {
      name: 'Priya Sharma',
      email: 'priya@iskcon.org',
      mobile: '+91 9876543213',
      volunteerId: 'VOL1002',
      city: 'Bangalore',
      address: '12th Cross, Indiranagar, Bangalore, Karnataka',
      age: 24,
      preferredLanguage: 'Kannada',
      emergencyContact: '+91 9123456781',
      approvalStatus: 'APPROVED',
    },
    {
      name: 'Amit Patel',
      email: 'amit@iskcon.org',
      mobile: '+91 9876543214',
      volunteerId: 'VOL1003',
      city: 'Mumbai',
      address: 'Juhu Tara Road, Juhu, Mumbai, Maharashtra',
      age: 32,
      preferredLanguage: 'Hindi',
      emergencyContact: '+91 9123456782',
      approvalStatus: 'PENDING',
    }
  ];

  const createdVolunteers: any[] = [];
  for (const v of volunteersData) {
    const u = await prisma.user.create({
      data: {
        name: v.name,
        email: v.email,
        mobile: v.mobile,
        passwordHash,
        role: 'VOLUNTEER',
        status: v.approvalStatus === 'APPROVED' ? 'ACTIVE' : 'INACTIVE',
      }
    });

    const volObj = await prisma.volunteer.create({
      data: {
        volunteerId: v.volunteerId,
        userId: u.id,
        fullName: v.name,
        mobile: v.mobile,
        email: v.email,
        city: v.city,
        address: v.address,
        age: v.age,
        preferredLanguage: v.preferredLanguage,
        emergencyContact: v.emergencyContact,
        approvalStatus: v.approvalStatus,
      }
    });

    // Generate Unique QR for volunteer
    const qrRef = `QR-${v.volunteerId}`;
    await prisma.volunteerQR.create({
      data: {
        volunteerId: volObj.id,
        qrReference: qrRef,
        qrData: `upi://pay?pa=temple.bookstore@upi&pn=ISKCON+Temple&tr=${qrRef}&cu=INR`,
      }
    });

    createdVolunteers.push(volObj);
  }
  console.log(`✓ Seeded Demo Users & ${createdVolunteers.length} Volunteers with Unique Payment QRs`);

  // 7. Allocations, Sales, Payments & Settlement for Volunteer 1 (Ravi - VOL1001)
  const vol1 = createdVolunteers[0];
  const bgGitaEnglish = editionsList[0]; // Bhagavad Gita English
  const bgGitaTelugu = editionsList[1];  // Bhagavad Gita Telugu

  // Book Allocations
  await prisma.bookAllocation.create({
    data: {
      allocationId: 'ALC-VOL1001-01',
      volunteerId: vol1.id,
      campaignId: campaign.id,
      bookEditionId: bgGitaEnglish.id,
      quantity: 50,
      issuedBy: adminUser.name,
      status: 'RECEIVED_BY_VOLUNTEER',
    }
  });

  await prisma.bookAllocation.create({
    data: {
      allocationId: 'ALC-VOL1001-02',
      volunteerId: vol1.id,
      campaignId: campaign.id,
      bookEditionId: bgGitaTelugu.id,
      quantity: 50,
      issuedBy: adminUser.name,
      status: 'RECEIVED_BY_VOLUNTEER',
    }
  });

  // Sales (65 copies total sold: 35 English, 30 Telugu)
  const sale1 = await prisma.sale.create({
    data: {
      saleId: 'SAL-1001',
      volunteerId: vol1.id,
      campaignId: campaign.id,
      bookEditionId: bgGitaEnglish.id,
      quantity: 35,
      sellingPrice: bgGitaEnglish.price,
      totalAmount: 35 * bgGitaEnglish.price,
      paymentMethod: 'UPI',
      customerReference: 'Bulk Corporate Order - HDFC Devotees',
    }
  });

  const sale2 = await prisma.sale.create({
    data: {
      saleId: 'SAL-1002',
      volunteerId: vol1.id,
      campaignId: campaign.id,
      bookEditionId: bgGitaTelugu.id,
      quantity: 30,
      sellingPrice: bgGitaTelugu.price,
      totalAmount: 30 * bgGitaTelugu.price,
      paymentMethod: 'CASH',
      customerReference: 'Book Stall at City Mall',
    }
  });

  const totalSalesAmount = (35 * bgGitaEnglish.price) + (30 * bgGitaTelugu.price); // ₹7000 + ₹5400 = ₹12,400

  // Payments
  await prisma.payment.create({
    data: {
      paymentId: 'PAY-1001',
      transactionId: 'UPI-TXN-9871236541',
      volunteerId: vol1.id,
      campaignId: campaign.id,
      saleId: sale1.id,
      amount: 7000,
      paymentMethod: 'UPI',
      status: 'VERIFIED',
      verifiedBy: adminUser.name,
    }
  });

  await prisma.payment.create({
    data: {
      paymentId: 'PAY-1002',
      transactionId: 'CASH-REC-0012',
      volunteerId: vol1.id,
      campaignId: campaign.id,
      saleId: sale2.id,
      amount: 3000,
      paymentMethod: 'CASH',
      status: 'VERIFIED',
      verifiedBy: adminUser.name,
    }
  });

  // Return Request (Unsold books: 15 English copies)
  const returnObj = await prisma.return.create({
    data: {
      returnId: 'RET-VOL1001-01',
      volunteerId: vol1.id,
      campaignId: campaign.id,
      status: 'APPROVED',
      notes: 'Returning unsold 15 Bhagavad Gita English copies at campaign midpoint',
    }
  });

  await prisma.returnItem.create({
    data: {
      returnId: returnObj.id,
      bookEditionId: bgGitaEnglish.id,
      requestedQuantity: 15,
      approvedQuantity: 15,
      receivedQuantity: 15,
    }
  });

  // Campaign Settlement Record
  const paidAmount = 10000;
  await prisma.settlement.create({
    data: {
      settlementId: 'SET-VOL1001',
      volunteerId: vol1.id,
      campaignId: campaign.id,
      totalSales: totalSalesAmount,
      amountCollected: totalSalesAmount,
      totalPaid: paidAmount,
      pendingAmount: totalSalesAmount - paidAmount,
      status: 'PARTIALLY_SETTLED',
    }
  });

  console.log('✓ Seeded Allocations, Sales, Payments, Returns, and Settlement for VOL1001');

  // 8. Notifications & Audit Logs
  await prisma.notification.create({
    data: {
      userId: vol1.userId,
      type: 'VOLUNTEER_APPROVED',
      title: 'Volunteer Registration Approved',
      message: 'Hare Krishna! Your volunteer registration has been approved. Your Volunteer ID is VOL1001.',
      read: true,
    }
  });

  await prisma.notification.create({
    data: {
      userId: vol1.userId,
      type: 'ORDER_UPDATE',
      title: 'Book Allocation Confirmed',
      message: '50 copies of Bhagavad Gita (English) and 50 copies (Telugu) have been allocated to you.',
      read: false,
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      role: 'ADMIN',
      action: 'VOLUNTEER_APPROVED',
      entityType: 'VOLUNTEER',
      entityId: vol1.id,
      newData: JSON.stringify({ volunteerId: 'VOL1001', status: 'APPROVED' }),
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      role: 'ADMIN',
      action: 'ALLOCATION_CREATED',
      entityType: 'BOOK_ALLOCATION',
      entityId: 'ALC-VOL1001-01',
      newData: JSON.stringify({ quantity: 50, bookEdition: bgGitaEnglish.editionName }),
    }
  });

  // 9. Website Content
  const contents = [
    { key: 'hero_headline', title: 'Hero Headline', content: 'Spread the Knowledge. Distribute the Wisdom.' },
    { key: 'hero_subtitle', title: 'Hero Subtitle', content: 'Join thousands of ISKCON devotees worldwide in distributing transcendental literature written by His Divine Grace A.C. Bhaktivedanta Swami Prabhupada.' },
    { key: 'temple_name', title: 'Temple Name', content: 'ISKCON Sri Sri Radha Gopinath Temple' },
    { key: 'temple_address', title: 'Temple Address', content: 'Hare Krishna Hill, Rajajinagar / Cultural Centre, Main Temple Campus' },
    { key: 'contact_email', title: 'Contact Email', content: 'books@iskcon.org' },
    { key: 'contact_phone', title: 'Contact Phone', content: '+91 80 2347 1000' },
  ];

  for (const c of contents) {
    await prisma.websiteContent.create({ data: c });
  }

  console.log('✓ Seeded Audit Logs, Notifications, and Website Content');
  console.log('🎉 Database Seeding Complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
