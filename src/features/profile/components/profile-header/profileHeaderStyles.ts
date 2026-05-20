/**
 * Shared Tailwind class strings for compact action buttons in the profile header.
 * Keeps button styling consistent across friend actions, logout, and report controls.
 */

const compactActionBtn =
  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 sm:px-3 sm:py-1.5 sm:text-sm";

export const compactBtnPrimary = `${compactActionBtn} bg-gradient-to-r from-ds-brand-600 to-ds-brand-500 text-white shadow-sm hover:from-ds-brand-700 hover:to-ds-brand-600 focus-visible:ring-ds-brand-500/40`;

export const compactBtnReport = `${compactActionBtn} border border-ds-state-danger/30 bg-ds-surface-card font-medium text-ds-state-danger hover:border-ds-state-danger/50 hover:bg-ds-state-dangerSoft focus-visible:ring-ds-state-danger/30`;

export const compactBtnWarning = `${compactActionBtn} border border-ds-state-warning/30 bg-ds-state-warningSoft font-medium text-ds-state-warning hover:bg-ds-state-warning/20 focus-visible:ring-ds-state-warning/30`;

export const compactStatusSuccess = `${compactActionBtn} border border-ds-brand-100 bg-ds-state-successSoft font-medium text-ds-state-success`;

export const compactIcon = "h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4";
