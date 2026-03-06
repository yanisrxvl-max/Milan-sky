'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'zh-CN', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
];

export default function GoogleTranslate() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLang, setActiveLang] = useState('fr');
  const [isLoaded, setIsLoaded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Read cookie on mount to set correct initial flag
  useEffect(() => {
    const match = document.cookie.match(/(^|;) ?googtrans=([^;]*)(;|$)/);
    if (match && match[2]) {
      const lang = match[2].split('/').pop();
      if (lang && LANGUAGES.some(l => l.code === lang)) {
        setActiveLang(lang);
      }
    }

    // --- REACT vs GOOGLE TRANSLATE CRASH FIX ---
    // Google Translate replaces text nodes with <font> tags.
    // When React tries to update or unmount those nodes, it crashes the entire app with:
    // "Failed to execute 'insertBefore' on 'Node'" or "Failed to execute 'removeChild' on 'Node'".
    // We monkey-patch the native DOM methods to swallow these specific errors gracefully.
    if (typeof window !== 'undefined' && typeof window.Node !== 'undefined') {
      const originalRemoveChild = Node.prototype.removeChild;
      Node.prototype.removeChild = function <T extends Node>(child: T): T {
        if (child.parentNode !== this) {
          // Google Translate moved or removed this node. Swallow the error.
          if (console) console.debug('React/GoogleTranslate conflict prevented: removeChild');
          return child;
        }
        return originalRemoveChild.call(this, child) as T;
      };

      const originalInsertBefore = Node.prototype.insertBefore;
      Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
        if (referenceNode && referenceNode.parentNode !== this) {
          // Google Translate moved the reference node. Swallow the error.
          if (console) console.debug('React/GoogleTranslate conflict prevented: insertBefore');
          return newNode;
        }
        return originalInsertBefore.call(this, newNode, referenceNode) as T;
      };
    }
  }, []);

  // Load Google Translate script (hidden)
  useEffect(() => {
    if (document.getElementById('google-translate-script')) {
      setIsLoaded(true);
      return;
    }

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'fr',
          includedLanguages: LANGUAGES.map(l => l.code).join(','),
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        'gt-hidden-element'
      );
      setIsLoaded(true);
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Programmatically trigger Google Translate language change
  function changeLanguage(langCode: string) {
    setActiveLang(langCode);
    setIsOpen(false);

    // Set the cookie so the language persists and applies on load.
    // Explicitly set cookie without 'domain' first for aggressive iOS Safari ITP bypass.
    if (langCode === 'fr') {
      document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
      document.cookie = 'googtrans=; path=/; domain=' + window.location.hostname + '; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    } else {
      document.cookie = `googtrans=/fr/${langCode}; path=/`;
      document.cookie = `googtrans=/fr/${langCode}; path=/; domain=${window.location.hostname}`;
    }

    // Attempt to change the language without a full reload by firing the combo box event.
    // Our previous React crash (`insertBefore`) monkey-patch handles this safely now.
    try {
      const gtCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (gtCombo) {
        gtCombo.value = langCode;
        gtCombo.dispatchEvent(new Event('change', { bubbles: true }));
      }
    } catch (err) { }

    // Force a reliable hard navigation to pick up the cookie
    setTimeout(() => {
      window.location.reload();
    }, 150);
  }

  const currentLang = LANGUAGES.find(l => l.code === activeLang) || LANGUAGES[0];

  return (
    <>
      {/* Hidden Google Translate element — never visible */}
      <div id="gt-hidden-element" style={{ display: 'none', position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0, overflow: 'hidden' }} />

      {/* Custom premium dropdown */}
      <div ref={dropdownRef} className="relative z-[300]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-white/5 transition-all duration-300 touch-manipulation group"
          aria-label="Change language"
        >
          <span className="text-base leading-none">{currentLang.flag}</span>
          <span className="text-[9px] uppercase tracking-[0.15em] text-white/40 font-bold hidden sm:inline group-hover:text-white/60 transition-colors">
            {currentLang.code === 'zh-CN' ? 'ZH' : currentLang.code.toUpperCase()}
          </span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-[298]"
                onClick={() => setIsOpen(false)}
              />

              {/* Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-full right-0 mt-3 z-[299] bg-dark-300/95 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] min-w-[180px]"
              >
                {/* Header */}
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-gold/60 font-bold flex items-center gap-1.5">
                    <Globe size={10} />
                    Langue
                  </p>
                </div>

                {/* Language list */}
                <div className="py-1.5 max-h-[320px] overflow-y-auto scrollbar-hide">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-200 hover:bg-white/[0.06] active:scale-[0.98] ${activeLang === lang.code
                        ? 'bg-gold/[0.08] text-gold'
                        : 'text-white/50 hover:text-white/80'
                        }`}
                    >
                      <span className="text-lg leading-none w-6 text-center">{lang.flag}</span>
                      <span className="text-[11px] tracking-wide font-medium flex-1">{lang.label}</span>
                      {activeLang === lang.code && (
                        <motion.span
                          layoutId="active-lang"
                          className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_6px_rgba(201,168,76,0.5)]"
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t border-white/[0.06]">
                  <p className="text-[8px] uppercase tracking-[0.15em] text-white/15 text-center">
                    Powered by Google Translate
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Global styles to COMPLETELY hide the default Google Translate UI */}
      <style jsx global>{`
        /* Kill the Google Translate top bar that pushes the page down */
        .goog-te-banner-frame,
        .skiptranslate > iframe,
        #goog-gt-tt,
        .goog-te-balloon-frame,
        .goog-tooltip,
        .goog-tooltip:hover,
        .goog-text-highlight {
          display: none !important;
          visibility: hidden !important;
          height: 0 !important;
          width: 0 !important;
          overflow: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }

        /* Prevent the body from being pushed down */
        body {
          top: 0 !important;
          position: static !important;
        }

        /* Hide ALL default Google Translate elements */
        .skiptranslate,
        .goog-te-gadget,
        .goog-te-gadget-simple,
        #google_translate_element,
        .goog-te-spinner-pos,
        .goog-te-spinner-animation,
        div.goog-te-ftab-frame {
          display: none !important;
          visibility: hidden !important;
          height: 0 !important;
          width: 0 !important;
          overflow: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          position: absolute !important;
          left: -9999px !important;
        }

        /* Keep the hidden element functional but invisible */
        #gt-hidden-element {
          display: none !important;
          position: absolute !important;
          opacity: 0 !important;
          pointer-events: none !important;
          width: 0 !important;
          height: 0 !important;
          overflow: hidden !important;
        }

        /* But keep the combo box accessible for our script */
        #gt-hidden-element .goog-te-combo {
          display: block !important;
          position: fixed !important;
          opacity: 0 !important;
          pointer-events: none !important;
          left: -9999px !important;
          top: -9999px !important;
          width: 1px !important;
          height: 1px !important;
        }

        /* Remove the Google Translate logo/icon that appears on page */
        .goog-logo-link,
        .goog-te-gadget > span,
        .goog-te-gadget-icon,
        .VIpgJd-ZVi9od-ORHb-OEVmcd,
        .VIpgJd-ZVi9od-xl07Ob-OEVmcd,
        .VIpgJd-ZVi9od-SmfAz,
        .VIpgJd-ZVi9od-aZ2wEe,
        .VIpgJd-ZVi9od-SmfAz-OEVmcd,
        div[class*="VIpgJd"],
        div[id*="goog-gt"],
        .goog-te-ftab-frame {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          height: 0 !important;
          width: 0 !important;
          position: fixed !important;
          left: -9999px !important;
          top: -9999px !important;
          z-index: -1 !important;
        }

        /* Kill any Google injected floating elements at top of body */
        body > .skiptranslate {
          display: none !important;
          height: 0 !important;
          width: 0 !important;
          overflow: hidden !important;
        }

        /* Override the iframe that sometimes appears */
        iframe.goog-te-menu-frame,
        iframe[name="google_translate_element"],
        iframe.skiptranslate {
          display: none !important;
          height: 0 !important;
          width: 0 !important;
        }

        /* Smooth scrollbar for language list */
        .scrollbar-hide::-webkit-scrollbar {
          width: 3px;
        }
        .scrollbar-hide::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-hide::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}
