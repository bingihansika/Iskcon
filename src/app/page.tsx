import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  UserCheck,
  Sparkles,
  ChevronRight,
  Globe,
  Award,
  Users,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { BookCard } from '@/components/BookCard';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  // Fetch website CMS contents
  const cmsContents = await prisma.websiteContent.findMany();
  const contentMap = new Map(cmsContents.map((c) => [c.key, c.content]));

  const heroHeadline = contentMap.get('hero_headline') || 'Spread the Knowledge. Distribute the Wisdom.';
  const heroSubtitle = contentMap.get('hero_subtitle') || 'Join ISKCON devotees worldwide in distributing transcendental literature by His Divine Grace A.C. Bhaktivedanta Swami Prabhupada. Request book packages, manage allocations, collect QR payments, and track campaign settlements seamlessly.';

  // Fetch active campaign
  const activeCampaign = await prisma.campaign.findFirst({
    where: { status: 'ACTIVE' },
  });

  // Fetch featured books
  const featuredBooks = await prisma.book.findMany({
    where: { featured: true, active: true },
    include: {
      category: true,
      editions: {
        include: { language: true },
      },
    },
    take: 6,
  });

  // Fetch languages
  const languages = await prisma.language.findMany({
    where: { active: true },
  });

  // Aggregate live database statistics
  const totalDistributedAgg = await prisma.sale.aggregate({
    _sum: { quantity: true, totalAmount: true },
  });
  const booksDistributed = totalDistributedAgg._sum.quantity || 0;

  const activeVolunteersCount = await prisma.volunteer.count({
    where: { approvalStatus: 'APPROVED' },
  });

  const booksCount = await prisma.book.count();

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-maroon-950 via-maroon-900 to-amber-950 text-white overflow-hidden py-20 px-4 sm:px-6 lg:px-8 border-b-4 border-saffron-500 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-saffron-500/20 border border-saffron-400/50 text-saffron-300 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-saffron-400 animate-pulse" />
              <span>Prabhupada Marathon Book Distribution</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight leading-tight text-white drop-shadow-md">
              {heroHeadline.includes('.') ? (
                <>
                  <span className="text-white block sm:inline">{heroHeadline.split('.')[0]}.</span>{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-300 via-amber-200 to-yellow-300 block sm:inline">
                    {heroHeadline.split('.').slice(1).join('.')}
                  </span>
                </>
              ) : (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-300 via-amber-200 to-yellow-300">
                  {heroHeadline}
                </span>
              )}
            </h1>

            <p className="text-base sm:text-lg text-amber-100/95 leading-relaxed font-sans max-w-2xl mx-auto lg:mx-0 drop-shadow-sm">
              {heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/bookstore"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-saffron-500 to-amber-500 hover:from-saffron-400 hover:to-amber-400 text-maroon-950 font-black px-7 py-3.5 rounded-2xl shadow-xl shadow-saffron-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <BookOpen className="w-5 h-5" />
                <span>Browse Bookstore</span>
              </Link>

              <Link
                href="/volunteer/register"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-maroon-900/80 hover:bg-maroon-800 text-white border border-saffron-400/60 font-bold px-7 py-3.5 rounded-2xl backdrop-blur-md transition shadow-md"
              >
                <UserCheck className="w-5 h-5 text-saffron-400" />
                <span>Become a Volunteer</span>
              </Link>

              <Link
                href="/login"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 text-saffron-300 hover:text-white font-bold px-4 py-3.5 transition underline underline-offset-4 decoration-saffron-500/40"
              >
                <span>Volunteer Login</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Hero Feature Card */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-b from-maroon-900/90 to-amber-950/90 border-2 border-saffron-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-saffron-500/30 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-saffron-500 to-amber-400 flex items-center justify-center text-maroon-950 font-bold shadow-lg">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-bold text-white">Active Campaign</h3>
                    <p className="text-xs text-saffron-300 font-semibold">Live Distribution Marathon</p>
                  </div>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 text-xs px-3 py-1 rounded-full font-extrabold flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>ACTIVE</span>
                </span>
              </div>

              {activeCampaign ? (
                <div className="space-y-4 text-xs text-amber-100">
                  <div className="bg-maroon-950/70 p-4 rounded-2xl border border-saffron-500/30 space-y-2">
                    <p className="text-base font-serif font-bold text-saffron-300">{activeCampaign.name}</p>
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-amber-200">
                      <div>Start Date: <span className="font-bold text-white">{formatDate(activeCampaign.startDate)}</span></div>
                      <div>End Date: <span className="font-bold text-white">{formatDate(activeCampaign.endDate)}</span></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div className="bg-maroon-950/80 p-3 rounded-xl border border-amber-800/60">
                      <span className="text-saffron-400 font-bold block mb-0.5">Return Deadline</span>
                      <span className="text-white font-semibold">{formatDate(activeCampaign.returnDeadline)}</span>
                    </div>
                    <div className="bg-maroon-950/80 p-3 rounded-xl border border-amber-800/60">
                      <span className="text-saffron-400 font-bold block mb-0.5">Settlement Deadline</span>
                      <span className="text-white font-semibold">{formatDate(activeCampaign.settlementDeadline)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-amber-200">No active campaign at this moment.</p>
              )}

              <div className="pt-2">
                <Link
                  href="/volunteer/register"
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-saffron-500 to-amber-500 hover:from-saffron-600 hover:to-amber-600 text-maroon-950 py-3.5 rounded-xl font-extrabold shadow-lg shadow-saffron-500/20 transition"
                >
                  <span>Register for Campaign</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE DISTRIBUTION STATISTICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-amber-100 p-8 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Verified Database Metrics
            </span>
            <h2 className="text-2xl font-serif font-bold text-maroon-900 mt-2">
              Book Distribution Statistics
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
              <BookOpen className="w-8 h-8 text-saffron-600 mx-auto mb-2" />
              <p className="text-3xl font-serif font-black text-maroon-900">{booksDistributed}</p>
              <p className="text-xs font-semibold text-amber-900 mt-1">Books Distributed</p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
              <Users className="w-8 h-8 text-saffron-600 mx-auto mb-2" />
              <p className="text-3xl font-serif font-black text-maroon-900">{activeVolunteersCount}</p>
              <p className="text-xs font-semibold text-amber-900 mt-1">Active Volunteers</p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
              <Globe className="w-8 h-8 text-saffron-600 mx-auto mb-2" />
              <p className="text-3xl font-serif font-black text-maroon-900">{languages.length}</p>
              <p className="text-xs font-semibold text-amber-900 mt-1">Languages Available</p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
              <Award className="w-8 h-8 text-saffron-600 mx-auto mb-2" />
              <p className="text-3xl font-serif font-black text-maroon-900">{booksCount}</p>
              <p className="text-xs font-semibold text-amber-900 mt-1">Book Titles</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED BOOKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Spiritual Wisdom
            </span>
            <h2 className="text-3xl font-serif font-bold text-maroon-900 mt-2">
              Featured ISKCON Books
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Explore authentic translations and commentaries by Srila Prabhupada.
            </p>
          </div>

          <Link
            href="/bookstore"
            className="flex items-center space-x-1.5 text-saffron-700 hover:text-saffron-800 font-bold text-sm bg-amber-50 px-4 py-2 rounded-xl border border-amber-200 transition"
          >
            <span>View All Books</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book as any} />
          ))}
        </div>
      </section>

      {/* AVAILABLE LANGUAGES SECTION */}
      <section className="bg-gradient-to-b from-amber-50/80 to-orange-50/40 py-12 border-y border-amber-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-maroon-900">
              Multilingual Book Distributions
            </h2>
            <p className="text-xs text-amber-900/80 mt-1">
              Spiritual literature available in 12 major Indian languages for global outreach.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {languages.map((lang) => (
              <Link
                key={lang.id}
                href={`/bookstore?language=${lang.id}`}
                className="bg-white p-4 rounded-2xl border border-amber-200/80 text-center hover:shadow-md hover:border-saffron-500 transition group"
              >
                <span className="text-xl block mb-1">🌐</span>
                <span className="text-sm font-bold font-serif text-maroon-900 group-hover:text-saffron-600">
                  {lang.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION (10-step visual workflow) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            End-to-End Workflow
          </span>
          <h2 className="text-3xl font-serif font-bold text-maroon-900">
            How the Book Distribution System Works
          </h2>
          <p className="text-sm text-gray-600">
            From registration to final campaign settlement in 10 seamless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'Register', desc: 'Volunteer creates profile and gets Volunteer ID (e.g. VOL1001).' },
            { step: '02', title: 'Admin Approval', desc: 'Temple admin verifies volunteer details and activates account.' },
            { step: '03', title: 'Request Books', desc: 'Volunteer submits book order request for current campaign.' },
            { step: '04', title: 'Allocation', desc: 'Temple approves quantities and issues physical books.' },
            { step: '05', title: 'Distribution', desc: 'Volunteer receives books and begins field distribution.' },
            { step: '06', title: 'Sales Entry', desc: 'Record sales via mobile portal validating remaining stock.' },
            { step: '07', title: 'QR Payment', desc: 'Customers scan unique volunteer UPI QR (QR-VOL1001).' },
            { step: '08', title: 'Unsold Return', desc: 'Submit return request for remaining unsold copies.' },
            { step: '09', title: 'Reconciliation', desc: 'Admin verifies physically received return quantities.' },
            { step: '10', title: 'Settlement', desc: 'Calculate sales, payments, and complete campaign settlement.' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm relative group hover:border-saffron-400 transition"
            >
              <span className="text-2xl font-serif font-black text-saffron-500 opacity-80 mb-2 block">
                {item.step}
              </span>
              <h3 className="text-sm font-bold font-serif text-maroon-900 mb-1">{item.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BECOME A VOLUNTEER CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-maroon-950 via-amber-900 to-maroon-900 text-white rounded-3xl p-8 sm:p-12 border-2 border-saffron-500/40 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="bg-saffron-600/30 text-saffron-300 text-xs px-3 py-1 rounded-full font-bold border border-saffron-500/30">
              Devotional Service
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
              Ready to Distribute Srila Prabhupada's Books?
            </h2>
            <p className="text-sm text-amber-100/90 leading-relaxed">
              Register as an official ISKCON volunteer today. Access your personal portal, receive book allocations, collect digital payments through your unique QR code, and track campaign settlements.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/volunteer/register"
                className="bg-saffron-500 hover:bg-saffron-600 text-maroon-950 font-extrabold px-8 py-3.5 rounded-2xl shadow-lg transition"
              >
                Register Now
              </Link>
              <Link
                href="/about"
                className="bg-white/10 hover:bg-white/20 text-white border border-amber-400/30 font-bold px-6 py-3.5 rounded-2xl transition"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
