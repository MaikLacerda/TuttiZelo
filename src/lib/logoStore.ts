export const DEFAULT_OFFICIAL_LOGO = '';

export function useOfficialLogo() {
  return {
    logoUrl: null,
    setLogoUrl: () => {},
    clearLogo: () => {},
  };
}
