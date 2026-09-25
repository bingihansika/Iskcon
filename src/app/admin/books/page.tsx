'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Sparkles, Edit, Trash2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminBooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    author: 'A.C. Bhaktivedanta Swami Prabhupada',
    description: 'Transcendental literature providing deep spiritual wisdom.',
    categoryId: '',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    featured: true,
    price: '200',
    initialStock: '500',
    languageId: 'lang-1',
    editionName: 'English Deluxe Edition',
    isbn: '978-81-89574-101',
  });

  const loadData = () => {
    fetch('/api/admin/books')
      .then((res) => res.json())
      .then((data) => {
        setBooks(data.books || []);
        setCategories(data.categories || []);
        setLanguages(data.languages || []);
        if (data.categories?.[0]) {
          setFormData((prev) => ({ ...prev, categoryId: data.categories[0].id }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create book');

      setShowAddModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    const matchesCat = !selectedCat || b.categoryId === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-amber-100 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 bg-amber-100 px-3 py-1 rounded-full">
            Catalog Management
          </span>
          <h1 className="text-2xl font-serif font-bold text-maroon-900 mt-1">Book Catalog & Editions</h1>
          <p className="text-xs text-gray-500">
            Manage spiritual book titles, multi-language editions, pricing, cover images, and featured status.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-saffron-600 hover:bg-saffron-700 text-white font-extrabold px-5 py-3 rounded-2xl shadow-md text-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Book Title</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or author..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-saffron-500"
          />
        </div>

        <div className="w-full md:w-auto">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="w-full py-2 px-3 rounded-xl border border-gray-200 text-xs bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-amber-900 font-bold">Loading book catalog...</div>
        ) : filteredBooks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-amber-50/70 text-amber-900 font-serif font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Book</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Language Editions</th>
                  <th className="p-4">Price Range</th>
                  <th className="p-4 text-center">Featured</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBooks.map((b) => {
                  const eds = b.editions || [];
                  const defaultPrice = eds[0]?.price || 150;
                  return (
                    <tr key={b.id} className="hover:bg-amber-50/40">
                      <td className="p-4 font-bold font-serif text-maroon-900 text-sm flex items-center space-x-3">
                        <img
                          src={b.coverImage}
                          alt={b.name}
                          className="w-10 h-12 object-cover rounded-lg border border-amber-200"
                        />
                        <div>
                          <span>{b.name}</span>
                          <span className="text-[11px] text-gray-500 block font-sans font-normal">
                            By {b.author}
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full font-semibold">
                          {b.category?.name || 'Spiritual'}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {eds.map((e: any) => (
                            <span
                              key={e.id}
                              className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md text-[10px] font-semibold border border-gray-200"
                            >
                              {e.language?.name || 'English'} ({formatCurrency(e.price)})
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="p-4 font-extrabold text-amber-900">{formatCurrency(defaultPrice)}</td>

                      <td className="p-4 text-center">
                        {b.featured ? (
                          <span className="inline-flex items-center text-amber-600 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                            <Sparkles className="w-3 h-3 mr-1 text-amber-500" /> Yes
                          </span>
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </td>

                      <td className="p-4 text-center">
                        <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                          ACTIVE
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-gray-500">No books found matching search filters.</div>
        )}
      </div>

      {/* Add New Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-amber-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-lg font-serif font-bold text-maroon-900">Add New Spiritual Book Title</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBook} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block font-bold text-gray-700 uppercase mb-1">Book Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sri Isopanisad"
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-saffron-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Language Edition</label>
                  <select
                    value={formData.languageId}
                    onChange={(e) => setFormData({ ...formData, languageId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-white"
                  >
                    {languages.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Unit Selling Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Initial Stock Copies</label>
                  <input
                    type="number"
                    value={formData.initialStock}
                    onChange={(e) => setFormData({ ...formData, initialStock: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">ISBN Code</label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-extrabold shadow-sm"
                >
                  {submitting ? 'Saving...' : 'Add Book to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
