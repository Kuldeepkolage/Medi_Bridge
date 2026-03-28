import React from "react";
import { useLanguage } from "../context/LanguageContext.jsx";

function AwarenessGuide() {
  const { t } = useLanguage();

  const tips = [
    {
      icon: (
        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t("tip1Title") || "Brush Twice Daily",
      desc: t("tip1Desc") || "Use fluoride toothpaste and brush for at least 2 minutes, morning and night.",
      bg: "bg-blue-50 dark:bg-blue-900/30",
    },
    {
      icon: (
        <svg className="w-5 h-5 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
      title: t("tip2Title") || "Reduce Sugar Intake",
      desc: t("tip2Desc") || "Cut down on sugary foods and drinks to prevent tooth decay and cavities.",
      bg: "bg-red-50 dark:bg-red-900/30",
    },
    {
      icon: (
        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      title: t("tip3Title") || "Regular Checkups",
      desc: t("tip3Desc") || "Visit your dentist every 6 months for a professional cleaning and examination.",
      bg: "bg-green-50 dark:bg-green-900/30",
    },
    {
      icon: (
        <svg className="w-5 h-5 text-orange-500 dark:text-orange-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: t("tip4Title") || "Wear a Mouthguard",
      desc: t("tip4Desc") || "Protect your teeth during contact sports with a proper-fitting mouthguard.",
      bg: "bg-orange-50 dark:bg-orange-900/30",
    },
    {
      icon: (
        <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: t("tip5Title") || "Follow Post-Treatment Care",
      desc: t("tip5Desc") || "Always follow your dentist's advice after any dental procedure for best results.",
      bg: "bg-purple-50 dark:bg-purple-900/30",
    },
    {
      icon: (
        <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: t("tip6Title") || "Floss Daily",
      desc: t("tip6Desc") || "Flossing removes plaque from areas your toothbrush can't reach between teeth.",
      bg: "bg-teal-50 dark:bg-teal-900/30",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-4">
            {t("dentalHealthGuide") || "Dental Health Guide"}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("awarenessTitle") || "Dental Awareness Guidelines"}
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            {t("awarenessDesc") || "Simple habits that protect your smile for a lifetime. Follow these expert-recommended tips."}
          </p>
        </div>

        {/* Tips Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {tips.map((tip, i) => (
            <div key={i}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md dark:hover:shadow-gray-800 transition-shadow duration-200">
              <div className={`w-10 h-10 ${tip.bg} rounded-lg flex items-center justify-center mb-4`}>
                {tip.icon}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{tip.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>

        {/* Privacy notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-blue-900 dark:text-blue-300 text-sm">
              {t("dataProtected") || "Patient Data Protected"}
            </p>
            <p className="text-blue-700 dark:text-blue-400 text-sm mt-1">
              {t("dataProtectedDesc") || "All patient records are stored securely with end-to-end encryption as per our backend security protocols."}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AwarenessGuide;