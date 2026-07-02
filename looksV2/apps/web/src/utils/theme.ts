import { TOKENS } from './tokens';

export const THEME = {
  card: 'bg-white border border-borderColor rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300',
  cardFlat: 'bg-surface border border-borderColor rounded-2xl p-5',
  buttonPrimary: 'bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 uppercase text-xs tracking-wider flex items-center justify-center gap-2 shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed',
  buttonSecondary: 'border border-borderColor hover:bg-surface text-ink font-bold px-6 py-3 rounded-xl transition-all duration-200 uppercase text-xs tracking-wider flex items-center justify-center gap-2',
  buttonAccent: 'bg-accent hover:bg-accent/90 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 uppercase text-xs tracking-wider flex items-center justify-center gap-2 shadow-md shadow-accent/15',
  buttonError: 'bg-semantic-error hover:bg-red-600 text-white font-bold px-4 py-2.5 rounded-xl transition-all duration-200 uppercase text-[10px] tracking-wider flex items-center justify-center gap-1.5',
  input: 'bg-surface border border-borderColor rounded-xl px-4 py-3 text-sm font-semibold text-ink outline-none focus:border-primary transition-all w-full placeholder:text-muted/60',
  label: 'text-xs font-bold text-muted uppercase tracking-wider mb-1 block',
  badge: 'text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wide border',
  heading: 'text-2xl font-black text-ink tracking-tight',
  subheading: 'text-xs font-semibold text-muted leading-relaxed',
};

// CSS-in-JS style object to expose CSS tokens directly if needed in canvas elements
export const CSS_TOKENS = {
  primaryColor: TOKENS.colors.primary,
  accentColor: TOKENS.colors.accent,
  canvasColor: TOKENS.colors.canvas,
  surfaceColor: TOKENS.colors.surface,
  surface2Color: TOKENS.colors.surface2,
  inkColor: TOKENS.colors.ink,
  mutedColor: TOKENS.colors.muted,
  borderColor: TOKENS.colors.border,
};
