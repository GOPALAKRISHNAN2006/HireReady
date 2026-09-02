import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const DEFAULT_CONSENT = {
  necessary: true, // Always true and locked
  preferences: true,
  analytics: false,
  marketing: false,
};

export const useCookieStore = create(
  persist(
    (set, get) => ({
      hasConsented: false,
      isModalOpen: false,
      preferences: { ...DEFAULT_CONSENT },

      acceptAll: () => {
        const fullConsent = {
          necessary: true,
          preferences: true,
          analytics: true,
          marketing: true,
        };
        set({
          hasConsented: true,
          preferences: fullConsent,
          isModalOpen: false,
        });
      },

      rejectNonEssential: () => {
        const minimalConsent = {
          necessary: true,
          preferences: false,
          analytics: false,
          marketing: false,
        };
        set({
          hasConsented: true,
          preferences: minimalConsent,
          isModalOpen: false,
        });
      },

      savePreferences: newPreferences => {
        set({
          hasConsented: true,
          preferences: {
            ...newPreferences,
            necessary: true, // Force necessary to true
          },
          isModalOpen: false,
        });
      },

      openModal: () => set({ isModalOpen: true }),
      closeModal: () => set({ isModalOpen: false }),
      resetConsent: () => set({ hasConsented: false, isModalOpen: true }),
    }),
    {
      name: 'hireready_cookie_consent',
    }
  )
);
