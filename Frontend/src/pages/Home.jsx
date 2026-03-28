import React, { useState } from 'react';
import StatCard from '../components/StatCard';
import ServiceCard from '../components/ServiceCard';
import TestimonialCard from '../components/TestimonialCard';
import WhyFeature from '../components/WhyFeature';

// ── SVG icons replacing emojis in stats ──────────────────────────────────────
const PatientsIcon = () => (
  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const DentistIcon = () => (
  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const ClinicIcon = () => (
  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);
const CalendarIcon = () => (
  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const stats = [
  { number: '30K+', label: 'Happy Patients', icon: <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center"><PatientsIcon /></div> },
  { number: '1.7K+', label: 'Expert Dentists', icon: <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center"><DentistIcon /></div> },
  { number: '700+', label: 'Modern Clinics', icon: <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center"><ClinicIcon /></div> },
  { number: '7', label: 'Days Open', icon: <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center"><CalendarIcon /></div> },
];

const services = [
  { title: 'General Checkup', description: 'Comprehensive oral health examination and preventive care.', iconKey: 'checkup' },
  { title: 'Dental Implants', description: 'Permanent tooth replacement with advanced titanium implants.', iconKey: 'implants' },
  { title: 'Orthodontics', description: 'Invisible braces and aligners for perfect smile.', iconKey: 'braces' },
  { title: 'Teeth Whitening', description: 'Professional laser whitening for sparkling results.', iconKey: 'whitening' },
  { title: 'Emergency Care', description: '24/7 urgent dental treatment available.', iconKey: 'emergency' },
];

const testimonials = [
  { name: 'Priya S.', text: 'Transformed my smile with invisible braces in just 12 months. Professional team and amazing results!', rating: 5, avatar: 'P' },
  { name: 'Rahul M.', text: 'Painless implant procedure with quick recovery. Highly recommend MediBridge for advanced treatments.', rating: 5, avatar: 'R' },
  { name: 'Anita K.', text: 'Best dental experience ever! Clean clinic, caring staff, and whitening results exceeded expectations.', rating: 5, avatar: 'A' },
];

function Home() {
  const [formData, setFormData] = useState({ name: '', phone: '', date: '', service: '' });
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ── All logic unchanged ───────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg('');
    try {
      const res = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setMsg("Appointment booked successfully! We'll call to confirm.");
        setFormData({ name: '', phone: '', date: '', service: '' });
      } else {
        setMsg('Booking failed. Please try again or call us.');
      }
    } catch (error) {
      setMsg('Server error. Please call +91 95119 36441');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="pt-16 pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[85vh]">

            {/* Left */}
            <div className="space-y-8 py-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-sm font-medium text-blue-700">
                <span className="w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                4.9/5 Rating · 30,000+ Happy Patients
              </div>

              <div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                  Dental Care<br />
                  <span className="text-blue-600">You Can Trust</span>
                </h1>
                <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-md">
                  Advanced technology, expert dentists, and compassionate care — all under one roof.
                </p>
              </div>

              <div className="flex items-center gap-8 py-2">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">ISO Certified</p>
                  <p className="text-gray-400 text-xs">Quality assured</p>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">700+ Clinics</p>
                  <p className="text-gray-400 text-xs">Across India</p>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Open 7 Days</p>
                  <p className="text-gray-400 text-xs">Including weekends</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a href="/appointment" className="px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 text-center text-sm">
                  Book Appointment
                </a>
                <a href="tel:+919511936441" className="px-7 py-3.5 border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 font-semibold rounded-lg transition-colors duration-200 text-center text-sm">
                  Call +91 95119 36441
                </a>
              </div>
            </div>

            {/* Right */}
            <div className="hidden lg:block relative">
              <div className="relative rounded-2xl overflow-hidden bg-gray-100" style={{ aspectRatio: '4/5' }}>
                <img
                  src="https://img.freepik.com/premium-vector/professional-dentist-man-woman-with-patient-cartoon-vector-illustration_1048368-670.jpg?w=1800"
                  alt="Professional dentist"
                  className="w-full h-full object-cover"
                />
                {/* Floating stat card */}
                <div className="absolute bottom-6 left-6 bg-white rounded-xl px-5 py-4 shadow-lg border border-gray-100">
                  <p className="text-2xl font-bold text-gray-900">1,700+</p>
                  <p className="text-sm text-gray-500">Expert Dentists</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Trusted By Thousands</h2>
            <p className="mt-2 text-gray-500">Patients who chose excellence in dental care</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Services</h2>
            <p className="mt-2 text-gray-500">Comprehensive care from routine checkups to advanced procedures</p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {services.map((service, i) => (
              <ServiceCard key={service.title} {...service} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="hidden lg:block rounded-2xl overflow-hidden bg-gray-200" style={{ aspectRatio: '1/1' }}>
              <img
                src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=700&h=700&fit=crop&q=80"
                alt="Dental team"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 leading-tight">Why Choose MediBridge?</h2>
                <p className="mt-3 text-gray-500">
                  Compassionate care combined with cutting-edge technology.
                </p>
              </div>
              <ul className="space-y-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <WhyFeature key={i} index={i} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── APPOINTMENT FORM ──────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Book Your Appointment</h2>
            <p className="mt-2 text-gray-500">Quick & easy booking. Our team confirms within 2 hours.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-8" noValidate>
              <h3 className="font-semibold text-gray-900 mb-6">Appointment Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                  <input
                    name="name" value={formData.name} onChange={handleInputChange} required
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                  <input
                    name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required
                    placeholder="+91 95119 36441"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Date *</label>
                    <input
                      name="date" type="date" value={formData.date} onChange={handleInputChange} required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Service *</label>
                    <select
                      name="service" value={formData.service} onChange={handleInputChange} required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                    >
                      <option value="">Select Service</option>
                      <option>General Checkup</option>
                      <option>Cleaning & Polishing</option>
                      <option>Dental Implants</option>
                      <option>Braces & Aligners</option>
                      <option>Teeth Whitening</option>
                      <option>Root Canal</option>
                      <option>Emergency Care</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit" disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg text-sm transition-colors duration-200 flex items-center justify-center gap-2 mt-2"
                >
                  {submitting ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Scheduling...</>
                  ) : 'Book Appointment'}
                </button>
              </div>
              {msg && (
                <div className={`mt-5 p-3.5 rounded-lg text-center text-sm font-medium ${msg.includes('successfully') || msg.includes('confirm') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {msg}
                </div>
              )}
            </form>

            {/* Info sidebar */}
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-2xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4 text-sm">Why Book With Us?</h4>
                <ul className="space-y-3">
                  {[
                    ['Instant Confirmation', 'Within 2 hours via call/SMS'],
                    ['ISO Certified', 'Highest hygiene standards'],
                    ['Zero Hidden Costs', 'Transparent pricing'],
                    ['Expert Dentists', '15+ years experience'],
                  ].map(([title, desc]) => (
                    <li key={title} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{title}</p>
                        <p className="text-xs text-gray-400">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50">
                <p className="font-semibold text-gray-900 text-sm mb-1">Need Immediate Help?</p>
                <p className="text-xs text-gray-400 mb-4">24/7 Emergency support available</p>
                <a href="tel:+919511936441" className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg text-center text-sm transition-colors duration-200">
                  Call +91 95119 36441
                </a>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="mt-10 border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <p className="font-semibold text-gray-900">Visit Our Clinic</p>
              <p className="text-xs text-gray-400 mt-0.5">Maulana Azad Road, Vasai West — easily accessible</p>
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d240929.44578613993!2d72.68065505024119!3d19.34651192574675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ad4c1f3d1893%3A0x8e0aaf15105eec5d!2sSamruddhi%20Dental%20Clinic%20and%20Implantology%20Centre!5e0!3m2!1sen!2sin!4v1761881469818!5m2!1sen!2sin"
              width="100%" height="300" style={{ border: 'none' }}
              allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What Our Patients Say</h2>
            <p className="mt-2 text-gray-500">Trusted by thousands for quality care</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA BANNER ─────────────────────────────────────────────── */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to Transform Your Smile?</h2>
          <p className="mt-3 text-blue-100 text-lg">
            Join thousands of satisfied patients and experience dental care like never before.
          </p>
          <a
            href="/appointment"
            className="inline-block mt-8 px-8 py-4 bg-white text-blue-600 font-bold rounded-lg text-sm hover:bg-gray-50 transition-colors duration-200"
          >
            Book Your Appointment Now
          </a>
        </div>
      </section>

    </div>
  );
}

export default Home;