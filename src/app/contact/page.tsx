import React from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-8 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
          Temple Contact & Support
        </span>
        <h1 className="text-3xl font-serif font-bold text-maroon-900 mt-2">Distribution Support Desk</h1>
        <p className="text-xs text-amber-900/80 mt-1">
          Have questions regarding book allocations, marathon campaign deadlines, or QR payments? Reach out to our team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-saffron-600 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-serif font-bold text-maroon-900">Temple Address</h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  ISKCON Temple Campus, Hare Krishna Hill, Rajajinagar, Main Sankirtan Book Depot
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-3 border-t border-gray-100">
              <Phone className="w-5 h-5 text-saffron-600 shrink-0" />
              <div>
                <h4 className="text-sm font-serif font-bold text-maroon-900">Distribution Helpline</h4>
                <p className="text-xs text-gray-600">+91 80 2347 1000 / +91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-3 border-t border-gray-100">
              <Mail className="w-5 h-5 text-saffron-600 shrink-0" />
              <div>
                <h4 className="text-sm font-serif font-bold text-maroon-900">Email Address</h4>
                <p className="text-xs text-gray-600">books@iskcon.org</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-3 border-t border-gray-100">
              <Clock className="w-5 h-5 text-saffron-600 shrink-0" />
              <div>
                <h4 className="text-sm font-serif font-bold text-maroon-900">Working Hours</h4>
                <p className="text-xs text-gray-600">8:00 AM – 8:00 PM IST (Daily)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Send Inquiry Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-amber-100 shadow-sm space-y-4">
          <h3 className="text-xl font-serif font-bold text-maroon-900">Send an Inquiry</h3>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Name</label>
                <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-saffron-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Mobile / Volunteer ID</label>
                <input type="text" placeholder="Mobile or VOL1001" className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-saffron-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Message</label>
              <textarea rows={4} placeholder="Describe your question..." className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-saffron-500"></textarea>
            </div>

            <button type="button" className="px-6 py-3 rounded-2xl bg-saffron-600 hover:bg-saffron-700 text-white font-extrabold text-sm shadow-md transition flex items-center space-x-2">
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
