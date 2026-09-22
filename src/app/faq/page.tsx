import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    { q: 'How do I register as an official ISKCON volunteer?', a: 'Click on "Become a Volunteer" in the header navigation, fill out your contact details, and submit. Upon verification by the temple administration, your account will be activated with a unique Volunteer ID (e.g. VOL1001).' },
    { q: 'How do book allocations work?', a: 'Once logged into your Volunteer Portal, navigate to "My Book Orders", select book titles, language editions, and requested quantities. Admin reviews your request against available stock and approves your allocation package.' },
    { q: 'How is my unique payment QR code generated?', a: 'Each volunteer automatically receives a unique static payment QR code mapped to their Volunteer ID (e.g. QR-VOL1001). Customers scan your QR using GPay, PhonePe, Paytm, or BHIM UPI to pay directly for books.' },
    { q: 'How do I record sales in the field?', a: 'Use your mobile device to open the Volunteer Portal -> "Record Sale". Select the book edition sold and quantity. The system automatically validates that you cannot sell more copies than your remaining allocated inventory.' },
    { q: 'What happens to unsold books at campaign end?', a: 'At the conclusion of the marathon campaign, submit an unsold book return request via "Return Books" in your portal. Physically return the copies to the temple sankirtan desk for verification and final financial settlement calculation.' },
    { q: 'How is the final campaign settlement calculated?', a: 'Settlement Formula: Pending Settlement = Total Book Sales Amount - Amount Collected & Settled with Temple. Final settlements are linked specifically to each annual campaign.' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-8 shadow-sm text-center">
        <HelpCircle className="w-12 h-12 text-saffron-600 mx-auto mb-2" />
        <h1 className="text-3xl font-serif font-bold text-maroon-900">Frequently Asked Questions</h1>
        <p className="text-xs text-amber-900/80 mt-1">
          Everything you need to know about ISKCON book distribution, allocations, QR payments, and campaign settlements.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm space-y-2">
            <h3 className="text-base font-serif font-bold text-maroon-900 flex items-start">
              <span className="text-saffron-600 mr-2">Q:</span> {faq.q}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed pl-6">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
