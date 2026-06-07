import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import StatCard from '../components/StatCard';
import ServiceCard from '../components/ServiceCard';
import TestimonialCard from '../components/TestimonialCard';
import WhyFeature from '../components/WhyFeature';
const API_URL = import.meta.env.VITE_API_URL;

/* ─── Icons ───────────────────────────────────────────────────────────────── */
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

/* ─── Time slots ──────────────────────────────────────────────────────────── */
const TIME_SLOTS = [
  "09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM",
  "02:00 PM","02:30 PM","03:00 PM","03:30 PM","04:00 PM","04:30 PM","05:00 PM",
];

/* ─── Dental image slides ─────────────────────────────────────────────────── */
const SLIDES = [
  {
    img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1168&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tag: "Advanced Technology",
    heading: "Dental Care\nYou Can Trust",
    sub: "State-of-the-art equipment for precise, painless treatment.",
  },
  {
    img: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=1200&h=700&fit=crop&q=85",
    tag: "Expert Team",
    heading: "1,700+ Certified\nDentists",
    sub: "Board-certified specialists with 15+ years of clinical experience.",
  },
  {
    img: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&h=700&fit=crop&q=85",
    tag: "ISO Certified Clinic",
    heading: "Hygiene &\nSafety First",
    sub: "ISO-certified sterilisation and strict hygiene protocols every visit.",
  },
  {
    img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&h=700&fit=crop&q=85",
    tag: "30,000+ Happy Patients",
    heading: "Smiles We've\nTransformed",
    sub: "Join thousands who chose MediBridge for life-changing dental care.",
  },
];

/* ─── useScrollReveal hook ────────────────────────────────────────────────── */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─── RevealSection wrapper ───────────────────────────────────────────────── */
function RevealSection({ children, className = '', delay = 0, direction = 'up' }) {
  const [ref, visible] = useScrollReveal(0.12);
  const transforms = { up: 'translateY(40px)', left: 'translateX(-40px)', right: 'translateX(40px)', scale: 'scale(0.95) translateY(20px)' };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : (transforms[direction] || transforms.up),
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Main Home component ─────────────────────────────────────────────────── */
function Home() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isAuth = !!localStorage.getItem("token");

  const [formData, setFormData] = useState({ name: '', phone: '', date: '', time: '', service: '' });
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  /* Carousel state */
  const [slide, setSlide] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback((idx) => {
    if (animating) return;
    setAnimating(true);
    setSlide(idx);
    setTimeout(() => setAnimating(false), 700);
  }, [animating]);

  const next = useCallback(() => goTo((slide + 1) % SLIDES.length), [slide, goTo]);
  const prev = useCallback(() => goTo((slide - 1 + SLIDES.length) % SLIDES.length), [slide, goTo]);

  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
  }, [next]);

  const pauseAuto = () => clearInterval(timerRef.current);
  const resumeAuto = () => { timerRef.current = setInterval(next, 5000); };

  const stats = [
    { number: '30K+', label: t('happyPatients') || 'Happy Patients', icon: <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center"><PatientsIcon /></div> },
    { number: '1.7K+', label: t('expertDentists') || 'Expert Dentists', icon: <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center"><DentistIcon /></div> },
    { number: '700+', label: t('modernClinics') || 'Modern Clinics', icon: <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/30 rounded-xl flex items-center justify-center"><ClinicIcon /></div> },
    { number: '7', label: t('daysOpen') || 'Days Open', icon: <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center"><CalendarIcon /></div> },
  ];

  const services = [
    { title: t('generalCheckup'), description: t('generalCheckupDesc') || 'Comprehensive oral health examination and preventive care.', iconKey: 'checkup' },
    { title: t('implant'), description: t('implantDesc') || 'Permanent tooth replacement with advanced titanium implants.', iconKey: 'implants' },
    { title: t('braces'), description: t('bracesDesc') || 'Invisible braces and aligners for a perfect smile.', iconKey: 'braces' },
    { title: t('whitening') || 'Teeth Whitening', description: t('whiteningDesc') || 'Professional laser whitening for sparkling results.', iconKey: 'whitening' },
    { title: t('emergencyCare') || 'Emergency Care', description: t('emergencyCareDesc') || '24/7 urgent dental treatment available.', iconKey: 'emergency' },
  ];

  const testimonials = [
    { name: 'Priya S.', text: 'Transformed my smile with invisible braces in just 12 months. Professional team and amazing results!', rating: 5, avatar: 'P' },
    { name: 'Rahul M.', text: 'Painless implant procedure with quick recovery. Highly recommend MediBridge for advanced treatments.', rating: 5, avatar: 'R' },
    { name: 'Anita K.', text: 'Best dental experience ever! Clean clinic, caring staff, and whitening results exceeded expectations.', rating: 5, avatar: 'A' },
  ];

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleBookClick = (e) => {
    e.preventDefault();
    if (!isAuth) navigate("/login", { state: { from: "/appointment" } });
    else navigate("/appointment");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuth) { navigate("/login", { state: { from: "/" } }); return; }
    setSubmitting(true); setMsg('');
    try {
      const token = localStorage.getItem("token");
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${API_URL}/appointments`, {
        method: 'POST', headers,
        body: JSON.stringify(formData),
      });
      if (res.ok) { setMsg(t('bookingSuccess')); setFormData({ name: '', phone: '', date: '', time: '', service: '' }); }
      else { const d = await res.json(); setMsg(d.message || 'Booking failed.'); }
    } catch { setMsg('Server error. Please call +91 95119 36441'); }
    finally { setSubmitting(false); }
  };

  const inputClass = "w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');

        .home-root { font-family: 'DM Sans', sans-serif; }
        .home-root h1, .home-root h2, .home-root h3 { font-family: 'Sora', sans-serif; }

        /* ── Carousel ── */
        .carousel-track {
          display: flex;
          transition: transform 0.75s cubic-bezier(0.77,0,0.175,1);
          will-change: transform;
          height: 100%;
        }
        .carousel-slide {
          min-width: 100%;
          position: relative;
          overflow: hidden;
        }
        .carousel-slide img {
          width: 100%; height: 100%; object-fit: cover;
          transform: scale(1.08);
          transition: transform 8s ease;
        }
        .carousel-slide.active img { transform: scale(1); }

        .slide-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(105deg, rgba(3,7,18,0.72) 0%, rgba(3,7,18,0.35) 55%, rgba(3,7,18,0.1) 100%);
        }

        /* Slide text fade-up */
        @keyframes slideTextIn {
          from { opacity:0; transform: translateY(22px); }
          to   { opacity:1; transform: translateY(0); }
        }
        .slide-tag   { animation: slideTextIn 0.5s ease 0.15s both; }
        .slide-title { animation: slideTextIn 0.55s ease 0.28s both; }
        .slide-sub   { animation: slideTextIn 0.55s ease 0.4s both; }
        .slide-btns  { animation: slideTextIn 0.55s ease 0.52s both; }

        /* Dot indicator */
        .dot { width:8px; height:8px; border-radius:4px; background:rgba(255,255,255,0.45); transition: all 0.35s ease; cursor:pointer; }
        .dot.active { width:24px; background:#ffffff; }

        /* ── Stats number gradient ── */
        .stat-num {
          background: linear-gradient(135deg, #1d4ed8, #0ea5e9);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .dark .stat-num {
          background: linear-gradient(135deg, #60a5fa, #38bdf8);
          -webkit-background-clip: text; background-clip: text;
        }

        /* ── Service card hover ── */
        .svc-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .svc-card:hover { transform: translateY(-7px); box-shadow: 0 20px 40px rgba(37,99,235,0.11); }

        /* ── Testimonial hover ── */
        .tmn-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .tmn-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(0,0,0,0.08); }

        /* ── CTA gradient ── */
        .cta-bg {
          background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 45%, #1e3a8a 100%);
          position: relative; overflow: hidden;
        }
        .cta-bg::before {
          content:''; position:absolute; top:-40%; right:-8%; width:480px; height:480px;
          border-radius:50%; background:rgba(255,255,255,0.04);
        }
        .cta-bg::after {
          content:''; position:absolute; bottom:-35%; left:-4%; width:380px; height:380px;
          border-radius:50%; background:rgba(255,255,255,0.03);
        }

        /* ── Why section bg ── */
        .why-bg {
          background: linear-gradient(135deg,#f0f9ff 0%,#f8fafc 50%,#f0fdf4 100%);
        }
        .dark .why-bg { background: linear-gradient(135deg,#0c1a2e 0%,#0f172a 50%,#0a1a0f 100%); }

        /* ── Heading pill ── */
        .section-pill {
          display:inline-block; padding:4px 14px; border-radius:999px; font-size:11px;
          font-weight:600; letter-spacing:0.07em; text-transform:uppercase; margin-bottom:12px;
        }
        .section-pill-blue { background:#eff6ff; color:#1d4ed8; }
        .dark .section-pill-blue { background:rgba(30,58,138,0.25); color:#93c5fd; }
        .section-pill-amber { background:#fffbeb; color:#b45309; }
        .dark .section-pill-amber { background:rgba(120,53,15,0.25); color:#fcd34d; }

        /* ── Floating badges ── */
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        .float-anim { animation: floatY 4s ease-in-out infinite; }
        .float-anim-d { animation: floatY 4s ease-in-out 2s infinite; }

        /* ── Form shadow ── */
        .form-card { box-shadow: 0 4px 32px rgba(0,0,0,0.06); }
      `}</style>

      <div className="home-root min-h-screen bg-white dark:bg-gray-950">

        {/* ══════════════════════════════════════════════════════════════
            HERO — Full-screen image carousel, flush to top of content
        ══════════════════════════════════════════════════════════════ */}
        <section className="relative w-full overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>

          {/* Carousel track */}
          <div className="carousel-track" style={{ transform: `translateX(-${slide * 100}%)` }}>
            {SLIDES.map((s, i) => (
              <div key={i} className={`carousel-slide ${i === slide ? 'active' : ''}`} style={{ height: 'calc(100vh - 64px)' }}>
                <img src={s.img} alt={s.tag} loading={i === 0 ? 'eager' : 'lazy'} />
                <div className="slide-overlay" />
              </div>
            ))}
          </div>

          {/* Slide text content */}
          <div key={slide} className="absolute inset-0 flex flex-col justify-end pb-20 px-8 lg:px-20 max-w-7xl mx-auto w-full left-0 right-0 pointer-events-none">
            <div className="pointer-events-auto max-w-2xl">
              <span className="slide-tag inline-block px-3 py-1.5 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-sm text-white border border-white/20 mb-4">
                {SLIDES[slide].tag}
              </span>
              <h1 className="slide-title font-bold text-white leading-[1.1] tracking-tight" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', whiteSpace: 'pre-line' }}>
                {SLIDES[slide].heading}
              </h1>
              <p className="slide-sub mt-4 text-white/75 text-lg leading-relaxed max-w-lg">
                {SLIDES[slide].sub}
              </p>
              <div className="slide-btns flex flex-col sm:flex-row gap-3 mt-8">
                <button onClick={handleBookClick}
                  className="px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-lg shadow-blue-900/40 hover:-translate-y-0.5 flex items-center gap-2 w-fit">
                  {t('bookAppointment')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                <a href="tel:+919511936441"
                  className="px-7 py-3.5 border-2 border-white/30 text-white hover:bg-white/10 font-semibold rounded-xl text-sm transition-all duration-200 flex items-center gap-2 w-fit backdrop-blur-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call +91 95119 36441
                </a>
              </div>
            </div>
          </div>

          {/* Arrows */}
          <button
            onClick={() => { pauseAuto(); prev(); resumeAuto(); }}
            className="absolute left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white border border-white/20 transition-all duration-200 hover:scale-110 z-10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => { pauseAuto(); next(); resumeAuto(); }}
            className="absolute right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white border border-white/20 transition-all duration-200 hover:scale-110 z-10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => { pauseAuto(); goTo(i); resumeAuto(); }}
                className={`dot ${i === slide ? 'active' : ''}`} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-10">
            <div key={slide} className="h-full bg-blue-400"
              style={{ animation: 'progressBar 5s linear forwards' }} />
          </div>
          <style>{`@keyframes progressBar { from{width:0%} to{width:100%} }`}</style>

          {/* Trust badges row */}
          <div className="absolute top-6 right-6 hidden lg:flex flex-col gap-2 z-10">
            <div className="float-anim bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl border border-white/40 dark:border-gray-700">
              <p className="text-xl font-bold text-gray-900 dark:text-white leading-none">4.9 ★</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Patient Rating</p>
            </div>
            <div className="float-anim-d bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl border border-white/40 dark:border-gray-700">
              <p className="text-xl font-bold text-gray-900 dark:text-white leading-none">1,700+</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Expert Dentists</p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            STATS — scroll reveal
        ══════════════════════════════════════════════════════════════ */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <RevealSection className="text-center mb-12">
              <p className="section-pill section-pill-blue">{t('trustedByThousands') || 'Trusted By Thousands'}</p>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Numbers That Speak</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">{t('trustedDesc') || 'Patients who chose excellence in dental care'}</p>
            </RevealSection>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <RevealSection key={i} delay={i * 90} direction="up">
                  <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 h-full">
                    <div className="mb-4">{stat.icon}</div>
                    <p className="stat-num text-3xl font-bold mb-1">{stat.number}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SERVICES — scroll reveal stagger
        ══════════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <RevealSection className="text-center mb-14">
              <p className="section-pill section-pill-blue">What We Offer</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">{t('ourServices') || 'Our Services'}</h2>
              <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">{t('ourServicesDesc') || 'Comprehensive care from routine checkups to advanced procedures'}</p>
            </RevealSection>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-5">
              {services.map((service, i) => (
                <RevealSection key={service.title} delay={i * 80} direction="up">
                  <div className="svc-card bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:border-blue-200 dark:hover:border-blue-700 h-full cursor-default">
                    <ServiceCard {...service} index={i} />
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            WHY CHOOSE US — split reveal
        ══════════════════════════════════════════════════════════════ */}
        <section className="py-24 why-bg">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <RevealSection direction="left">
                <div className="hidden lg:block relative rounded-3xl overflow-hidden" style={{ aspectRatio: '4/5' }}>
                  <img
                    src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=700&h=875&fit=crop&q=80&crop=top"
                    alt="Dental team"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-6 left-6 right-6 bg-white/92 dark:bg-gray-900/92 backdrop-blur-sm rounded-2xl p-5 border border-white dark:border-gray-700 shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">15+ Years of Excellence</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Board-certified specialists you can trust</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-2xl -z-10"></div>
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-green-100 dark:bg-green-900/20 rounded-2xl -z-10"></div>
                </div>
              </RevealSection>

              <RevealSection direction="right">
                <div className="space-y-8">
                  <div>
                    <p className="section-pill section-pill-blue">Why Us</p>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                      {t('whyChooseMediBridge') || 'Why Choose MediBridge?'}
                    </h2>
                    <p className="mt-3 text-gray-500 dark:text-gray-400 text-lg">
                      {t('whyChooseDesc') || 'Compassionate care combined with cutting-edge technology.'}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {Array.from({ length: 4 }, (_, i) => (
                      <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-200 overflow-hidden">
                        <WhyFeature index={i} />
                      </div>
                    ))}
                  </div>
                </div>
              </RevealSection>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            APPOINTMENT FORM — scroll reveal
        ══════════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-white dark:bg-gray-950">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <RevealSection className="text-center mb-14">
              <p className="section-pill section-pill-blue">Book Online</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">{t('bookYourAppointment')}</h2>
              <p className="mt-3 text-gray-500 dark:text-gray-400">{t('quickEasyBooking') || 'Quick & easy booking. Our team confirms within 2 hours.'}</p>
            </RevealSection>

            <div className="grid lg:grid-cols-5 gap-8">
              <RevealSection className="lg:col-span-3" direction="left">
                <form onSubmit={handleSubmit}
                  className="form-card bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8"
                  noValidate>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-6 text-lg">{t('appointmentDetails')}</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('fullName')} *</label>
                      <input name="name" value={formData.name} onChange={handleInputChange} required placeholder="Enter your full name" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('phoneNumber')} *</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        </span>
                        <input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required placeholder="+91 95119 36441" className={`${inputClass} pl-11`} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('preferredDate')} *</label>
                        <input name="date" type="date" value={formData.date} onChange={handleInputChange} required className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time Slot *</label>
                        <select name="time" value={formData.time} onChange={handleInputChange} required className={`${inputClass} appearance-none`}>
                          <option value="">Select Time</option>
                          {TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('serviceType')} *</label>
                        <select name="service" value={formData.service} onChange={handleInputChange} required className={`${inputClass} appearance-none`}>
                          <option value="">{t('selectService')}</option>
                          <option value="General Checkup">{t('generalCheckup')}</option>
                          <option value="Cleaning">{t('cleaning')}</option>
                          <option value="Dental Implants">{t('implant')}</option>
                          <option value="Braces">{t('braces')}</option>
                          <option value="Teeth Whitening">{t('whitening') || 'Teeth Whitening'}</option>
                          <option value="Root Canal">{t('rootCanal')}</option>
                          <option value="Emergency Care">{t('emergencyCare') || 'Emergency Care'}</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" disabled={submitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-0.5 mt-2">
                      {submitting
                        ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> {t('scheduling') || 'Scheduling...'}</>
                        : <>{t('bookAppointment')} <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></>
                      }
                    </button>
                  </div>
                  {msg && (
                    <div className={`mt-5 p-3.5 rounded-xl text-center text-sm font-medium ${
                      msg.includes('success') || msg.includes('सफल') || msg.includes('यशस्वी')
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                    }`}>{msg}</div>
                  )}
                </form>
              </RevealSection>

              <RevealSection className="lg:col-span-2" direction="right" delay={100}>
                <div className="space-y-4 h-full">
                  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </span>
                      {t('whyBookWithUs') || 'Why Book With Us?'}
                    </h4>
                    <ul className="divide-y divide-gray-50 dark:divide-gray-800">
                      {[
                        [t('instantConfirmation') || 'Instant Confirmation', t('instantConfirmationDesc') || 'Within 2 hours via call/SMS', '🕐'],
                        [t('isoCertified') || 'ISO Certified', t('isoCertifiedDesc') || 'Highest hygiene standards', '🏆'],
                        [t('zeroHiddenCosts') || 'Zero Hidden Costs', t('zeroHiddenCostsDesc') || 'Transparent pricing', '💎'],
                        [t('expertDentists') || 'Expert Dentists', t('expertDentistsDesc') || '15+ years experience', '👨‍⚕️'],
                      ].map(([title, desc, emoji]) => (
                        <li key={title} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                          <span className="text-lg flex-shrink-0 mt-0.5">{emoji}</span>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{desc}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/20 border border-red-100 dark:border-red-900/30 rounded-3xl p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{t('needImmediateHelp') || 'Need Immediate Help?'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('emergencySupport') || '24/7 Emergency support available'}</p>
                      </div>
                    </div>
                    <a href="tel:+919511936441"
                      className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 shadow-md shadow-green-600/20">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      Call +91 95119 36441
                    </a>
                  </div>
                </div>
              </RevealSection>
            </div>

            {/* Map */}
            <RevealSection className="mt-10">
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="px-6 py-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{t('visitOurClinic') || 'Visit Our Clinic'}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Maulana Azad Road, Vasai West — easily accessible</p>
                    </div>
                  </div>
                  <a href="https://maps.google.com/?q=Samruddhi+Dental+Clinic+Vasai" target="_blank" rel="noopener noreferrer"
                    className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                    Get Directions →
                  </a>
                </div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d240929.44578613993!2d72.68065505024119!3d19.34651192574675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ad4c1f3d1893%3A0x8e0aaf15105eec5d!2sSamruddhi%20Dental%20Clinic%20and%20Implantology%20Centre!5e0!3m2!1sen!2sin!4v1761881469818!5m2!1sen!2sin"
                  width="100%" height="280" style={{ border: 'none', display: 'block' }}
                  allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </RevealSection>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            TESTIMONIALS — scroll reveal stagger
        ══════════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <RevealSection className="text-center mb-14">
              <p className="section-pill section-pill-amber">Patient Stories</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">{t('whatPatientsSay') || 'What Our Patients Say'}</h2>
              <p className="mt-3 text-gray-500 dark:text-gray-400">{t('trustedForQuality') || 'Trusted by thousands for quality care'}</p>
            </RevealSection>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, i) => (
                <RevealSection key={i} delay={i * 100} direction="up">
                  <div className="tmn-card h-full">
                    <TestimonialCard {...testimonial} />
                  </div>
                </RevealSection>
              ))}
            </div>
            <RevealSection className="mt-12" delay={200}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 max-w-sm mx-auto text-center">
                <p className="text-4xl font-bold text-gray-900 dark:text-white">4.9</p>
                <div className="flex items-center justify-center gap-1 mt-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Based on 30,000+ patient reviews</p>
              </div>
            </RevealSection>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            FOOTER CTA — scroll reveal
        ══════════════════════════════════════════════════════════════ */}
        <section className="cta-bg py-24">
          <RevealSection className="max-w-3xl mx-auto px-6 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white/80 text-xs font-medium rounded-full mb-6 border border-white/10">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Currently accepting new patients
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
              {t('readyToTransform') || 'Ready to Transform Your Smile?'}
            </h2>
            <p className="mt-4 text-blue-100 text-lg leading-relaxed">
              {t('readyToTransformDesc') || 'Join thousands of satisfied patients and experience dental care like never before.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <button onClick={handleBookClick}
                className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl text-sm hover:bg-gray-50 transition-all duration-200 shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2">
                {t('bookAppointment')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
              <a href="tel:+919511936441"
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl text-sm hover:bg-white/10 transition-all duration-200 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                Call Us Now
              </a>
            </div>
          </RevealSection>
        </section>

      </div>
    </>
  );
}

export default Home;