import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./LanguageContext";

export function LoginRequiredModal({ onClose }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-10 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-5 text-center">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-white font-bold text-lg">{t("loginRequired")}</h2>
        </div>

        <div className="px-6 py-6 text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {t("loginRequiredDesc")}
          </p>
          <button
            onClick={() => { onClose(); navigate("/login"); }}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors"
          >
            {t("loginBtn")}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 font-medium transition-colors"
          >
            {t("continueAsGuest")}
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook — use this anywhere to guard an action
export function useAuthGuard() {
  const [showModal, setShowModal] = React.useState(false);

  const isAuth = !!localStorage.getItem("token");

  // Call this before any protected action
  function guard(action) {
    if (!isAuth) {
      setShowModal(true);
      return false; // blocked
    }
    if (action) action();
    return true; // allowed
  }

  const Modal = showModal
    ? () => <LoginRequiredModal onClose={() => setShowModal(false)} />
    : () => null;

  return { guard, Modal, isAuth };
}