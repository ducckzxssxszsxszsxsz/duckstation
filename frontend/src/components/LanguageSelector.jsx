import React, { useState, useRef, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { lang, setLang, t } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ];

  const currentLang = languages.find(l => l.code === lang);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all"
        title="Change language"
      >
        <Globe size={16} className="text-gray-400" />
        <span className="text-sm font-semibold text-gray-300 hidden sm:inline">
          {currentLang?.flag} {lang.toUpperCase()}
        </span>
        <span className="text-sm font-semibold text-gray-300 sm:hidden">
          {currentLang?.flag}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a24] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-3 border-b border-white/5 bg-white/5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Language</p>
          </div>
          <div className="space-y-1 p-2">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  setLang(language.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                  lang === language.code
                    ? 'bg-brand-primary/20 border border-brand-primary/50 text-white'
                    : 'hover:bg-white/5 text-gray-300'
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{language.name}</p>
                  <p className="text-xs text-gray-500">{language.code.toUpperCase()}</p>
                </div>
                {lang === language.code && (
                  <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
