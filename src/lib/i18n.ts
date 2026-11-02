import { enUS, ru, de, fr, pl } from 'date-fns/locale'
import type { Locale } from 'date-fns'

export type Language = 'en' | 'ru' | 'de' | 'fr' | 'pl'

export interface SupportedLanguageInfo {
  code: Language
  label: string
  flag: string
}

export const SUPPORTED_LANGUAGES: SupportedLanguageInfo[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
]

export function getDateLocale(lang: Language): Locale {
  switch (lang) {
    case 'ru':
      return ru
    case 'de':
      return de
    case 'fr':
      return fr
    case 'pl':
      return pl
    default:
      return enUS
  }
}

export interface TranslationDictionary {
  // App Header
  appTitle: string
  appSubtitle: string
  backupAndExport: string
  aboutRule: string
  addTrip: string
  trip: string

  // Offline & Updates
  offlineBadge: string
  onlineBadge: string
  updateAvailableTitle: string
  updateNowBtn: string

  // Profiles
  profilesTitle: string
  addProfile: string
  profileNamePlaceholder: string
  deleteProfile: string
  cannotDeleteOnlyProfile: string
  myPassport: string
  activeProfileLabel: string

  // Mode Switcher (Schengen vs Resident)
  profileModeLabel: string
  modeSchengen: string
  modeSchengenDesc: string
  modeResident: string
  modeResidentDesc: string
  homeCountryLabel: string
  taxTargetDaysLabel: string

  // Cloudflare Sync
  syncModalTitle: string
  syncActiveBadge: string
  syncDisabledBadge: string
  syncNowBtn: string
  syncingText: string
  lastSyncedAt: (time: string) => string
  createSyncKeyBtn: string
  connectExistingDeviceBtn: string
  enterSyncKeyPlaceholder: string
  connectBtn: string
  pairingUrlCopied: string
  copyPairingLinkBtn: string
  copyKeyBtn: string
  copiedBtn: string
  disconnectSyncBtn: string
  autoSyncToggleTitle: string
  autoSyncToggleDesc: string
  syncExplainerTitle: string
  syncExplainerDesc: string
  syncSetupInstructionsTitle: string
  syncSetupInstructionsDesc: string

  // Status Card (Schengen Visitor Mode)
  referenceDate: string
  resetToday: string
  overstayWarningTitle: string
  overstayWarningDesc: (firstDate?: string) => string
  daysRemaining: string
  of90: string
  daysUsed: string
  days: string
  last180Days: string
  quotaUsage: string
  inSchengen: string
  outsideSchengen: string
  limitExhausted: string
  stayPermitted: string
  entryPermitted: string
  continuousStayRemaining: (days: number) => string
  canEnterConsecutively: (days: number) => string
  recoveryTitle: string
  daysGained: (days: number) => string

  // Status Card (EU Resident & Tax Mode)
  residentHeaderBadge: (countryName: string) => string
  taxYearTitle: (year: number) => string
  daysInCountry: (countryName: string) => string
  daysOutsideCountry: string
  taxSecuredBadge: string
  taxNotYetSecuredBadge: string
  taxRequirementMet: (target: number, countryName?: string) => string
  taxDaysNeeded: (needed: number) => string
  safeRemainingAbroad: (days: number) => string
  taxLimitExceeded: string
  taxMilestone183: string
  abroadTripListTitle: string
  logAbroadTripBtn: string
  abroadTripModalTitle: string
  abroadTripEditModalTitle: string
  abroadDuration: (days: number) => string
  permResidence5YearTitle: string
  permResidence5YearDesc: (used: number, limit: number) => string
  permResidenceSafe: string
  permResidenceWarning: string
  singleTripViolationAlert: string
  switchToResidentBtn: string
  switchToSchengenBtn: string

  // Tabs & Navigation
  tabTrips: string
  tabPlanner: string
  tabCalendar: string

  // Trip List
  tripsHistoryTitle: string
  noTripsTitle: string
  noTripsDesc: string
  addFirstTrip: string
  loadSamples: string
  plannedBadge: string
  singleDay: string
  durationDays: (days: number) => string
  editTrip: string
  deleteTrip: string

  // Trip Modal
  modalNewTripTitle: string
  modalEditTripTitle: string
  entryDateLabel: string
  exitDateLabel: string
  titleLabel: string
  titlePlaceholder: string
  notesLabel: string
  notesPlaceholder: string
  plannedCheckboxTitle: string
  plannedCheckboxSubtitle: string
  cancelBtn: string
  saveBtn: string
  errSelectDates: string
  errExitBeforeEntry: string
  maxUsedDuringTrip: (used: number) => string
  overstayAlert: string
  overstayStartsFrom: (date: string) => string

  // Planner
  plannerModeEarliest: string
  plannerModeCheck: string
  earliestSearchTitle: string
  earliestSearchDesc: string
  desiredDaysLabel: string
  searchFromDateLabel: string
  tripPossibleTitle: string
  tripPossibleDesc: (duration: number) => string
  addAsPlanBtn: string
  noDatesFoundTitle: (days: number) => string
  noDatesFoundDesc: string
  checkDatesTitle: string
  checkDatesDesc: string
  tripLegalTitle: string
  tripViolationTitle: string
  violationStartsFrom: (date: string) => string
  selectValidDatesHint: string

  // Calendar
  todayBtn: string
  legendTrip: string
  legendPlan: string
  legendOverstay: string
  legendToday: string
  dayDetailsInSchengen: (title?: string) => string
  dayDetailsOutside: string
  remainingAllowance: (rem: number) => string

  // Backup & Data
  backupModalTitle: string
  browserPersistenceTitle: string
  browserPersistenceActive: string
  browserPersistenceStandard: string
  enablePersistenceBtn: string
  persistenceProtectedBadge: string
  persistenceGrantedToast: string
  persistenceDeniedHint: string
  fileBackupSectionTitle: string
  exportFileBtn: string
  importFileBtn: string
  cloudSyncTitle: string
  cloudSyncDesc: string
  dangerZoneClearAll: string
  dangerZoneConfirmText: string
  confirmClearAllBtn: string
  importSuccess: (count: number) => string
  importError: (err: string) => string

  // Info Modal
  infoModalTitle: string
  infoMainPrincipleTitle: string
  infoMainPrincipleText: string
  infoSlidingWindowTitle: string
  infoSlidingWindowText: string
  infoKeyRulesTitle: string
  infoRule1: string
  infoRule2: string
  infoRule3: string
  infoOpenSourceBadge: string

  // Desktop shortcuts
  desktopShortcutsHint: string
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appTitle: 'Schengen 90/180',
    appSubtitle: 'Visa & Residence Travel Suite',
    backupAndExport: 'Backup & Data',
    aboutRule: 'About 90/180 Rule & Residence',
    addTrip: 'Add Trip',
    trip: 'Trip',

    offlineBadge: 'Offline Mode',
    onlineBadge: 'Online',
    updateAvailableTitle: 'New update available!',
    updateNowBtn: 'Update App',

    profilesTitle: 'Manage Profiles',
    addProfile: 'Add Profile',
    profileNamePlaceholder: 'e.g. My TIE / Blue Card, Partner, Child',
    deleteProfile: 'Delete Profile',
    cannotDeleteOnlyProfile: 'Cannot delete the only profile.',
    myPassport: 'My Passport',
    activeProfileLabel: 'Active Profile',

    profileModeLabel: 'Calculation Mode',
    modeSchengen: '🇪🇺 Schengen Visitor (90/180)',
    modeSchengenDesc: 'For short-stay tourists & visitors without EU residency (max 90 days per 180-day window).',
    modeResident: '🌍 EU Resident & Tax Tracker',
    modeResidentDesc:
      'Pan-European tax residency (≥183 days) & absence limits for EU residence permit holders in any member state (Germany, Spain, Portugal, France, Italy, etc.).',
    homeCountryLabel: 'Home Country of Residence (EU Member State)',
    taxTargetDaysLabel: 'Tax Residency Target Days',

    syncModalTitle: 'Cloudflare Cloud Sync',
    syncActiveBadge: 'Cloud Sync Active',
    syncDisabledBadge: 'Local Offline Storage',
    syncNowBtn: 'Sync Now',
    syncingText: 'Syncing with Cloudflare...',
    lastSyncedAt: (time) => `Last synced: ${time}`,
    createSyncKeyBtn: 'Generate New Sync Key',
    connectExistingDeviceBtn: 'Pair with Existing Key',
    enterSyncKeyPlaceholder: 'Paste your sync key (e.g. vg_...)',
    connectBtn: 'Connect',
    pairingUrlCopied: 'Pairing link copied to clipboard!',
    copyPairingLinkBtn: 'Copy 1-Click Pairing Link',
    copyKeyBtn: 'Copy Sync Key',
    copiedBtn: 'Copied!',
    disconnectSyncBtn: 'Disconnect Sync',
    autoSyncToggleTitle: 'Automatic Cloud Sync',
    autoSyncToggleDesc: 'Automatically sync changes to your Cloudflare D1 database after adding or editing trips.',
    syncExplainerTitle: 'Zero-Password Cloud Pairing',
    syncExplainerDesc:
      'Your anonymous high-entropy sync key encrypts and isolates your trips in your private Cloudflare D1 table. No email or password needed.',
    syncSetupInstructionsTitle: 'How to pair devices in 5 seconds:',
    syncSetupInstructionsDesc:
      'Generate a key on this device, then click "Copy 1-Click Pairing Link" and open that URL on your phone or tablet. All devices will pair instantly.',

    referenceDate: 'Reference Date:',
    resetToday: 'Reset to Today',
    overstayWarningTitle: 'Overstay detected!',
    overstayWarningDesc: (firstDate) =>
      `Trip records contain stays exceeding the 90/180 rule limit (first violation on ${firstDate || 'unknown'}).`,
    daysRemaining: 'Days Remaining',
    of90: 'of 90',
    daysUsed: 'Days Used',
    days: 'days',
    last180Days: 'In the rolling 180-day window',
    quotaUsage: '90-day quota consumed',
    inSchengen: 'Currently in Schengen',
    outsideSchengen: 'Currently outside Schengen',
    limitExhausted: 'Limit Exhausted',
    stayPermitted: 'Stay Permitted',
    entryPermitted: 'Entry Allowed',
    continuousStayRemaining: (days) => `Can stay for ${days} more days continuously`,
    canEnterConsecutively: (days) => `Can enter for ${days} consecutive days`,
    recoveryTitle: 'Upcoming allowance recoveries:',
    daysGained: (days) => `+${days} days`,

    residentHeaderBadge: (countryName) => `EU Resident: ${countryName}`,
    taxYearTitle: (year) => `EU Tax & Residence Year ${year}`,
    daysInCountry: (countryName) => `Days in ${countryName}`,
    daysOutsideCountry: 'Days Abroad (Absences)',
    taxSecuredBadge: 'EU Tax Residency Secured (≥183 Days)',
    taxNotYetSecuredBadge: 'Tax Target in Progress',
    taxRequirementMet: (target, countryName) =>
      `Requirement met! Spent ≥${target} days in ${countryName || 'home country'} this calendar year (EU tax residency secured).`,
    taxDaysNeeded: (needed) =>
      `Need ${needed} more days in home country to secure 183-day EU tax residency.`,
    safeRemainingAbroad: (days) => `Safe remaining absence allowance: ${days} days`,
    taxLimitExceeded: 'Exceeded 182-day absence limit (risk for tax residency)',
    taxMilestone183: 'Pan-European 183-Day Tax Threshold',
    abroadTripListTitle: 'Trips Abroad & Absences',
    logAbroadTripBtn: 'Log Trip Abroad',
    abroadTripModalTitle: 'Log Trip Abroad / Absence',
    abroadTripEditModalTitle: 'Edit Trip Abroad',
    abroadDuration: (days) => `Abroad for ${days} days`,
    permResidence5YearTitle: 'EU Permanent Residence (Directive 2003/109/EC)',
    permResidence5YearDesc: (used, limit) => `Absence in last 5 years: ${used} / ${limit} days allowed (max 10 months).`,
    permResidenceSafe: '5-Year Larga Duración quota is healthy',
    permResidenceWarning: 'Warning: 5-year absence exceeds 300-day EU threshold',
    singleTripViolationAlert: 'Warning: A single trip exceeded 6 months continuous absence.',
    switchToResidentBtn: 'Switch to EU Resident',
    switchToSchengenBtn: 'Switch to Schengen 90/180',

    tabTrips: 'Trips',
    tabPlanner: 'Planner',
    tabCalendar: 'Calendar',

    tripsHistoryTitle: 'Trip History & Plans',
    noTripsTitle: 'No trips added yet',
    noTripsDesc: 'Add your past trips or plan future visits to compute your allowance.',
    addFirstTrip: 'Add first trip',
    loadSamples: 'Load sample trips',
    plannedBadge: 'Planned',
    singleDay: '1 day',
    durationDays: (days) => `${days} days`,
    editTrip: 'Edit trip',
    deleteTrip: 'Delete trip',

    modalNewTripTitle: 'Add New Trip',
    modalEditTripTitle: 'Edit Trip',
    entryDateLabel: 'Entry Date (First Day in Schengen)',
    exitDateLabel: 'Exit Date (Last Day in Schengen)',
    titleLabel: 'Trip Title (Optional)',
    titlePlaceholder: 'e.g. Rome Vacation, Business in Berlin',
    notesLabel: 'Notes (Optional)',
    notesPlaceholder: 'Flight info, hotel, companion details...',
    plannedCheckboxTitle: 'Mark as planned / future trip',
    plannedCheckboxSubtitle: 'Helps forecast your visa balance without affecting historical stats',
    cancelBtn: 'Cancel',
    saveBtn: 'Save Trip',
    errSelectDates: 'Please select both entry and exit dates.',
    errExitBeforeEntry: 'Exit date cannot be earlier than entry date.',
    maxUsedDuringTrip: (used) => `Peak usage during this trip: ${used}/90 days`,
    overstayAlert: 'This trip causes an overstay of the 90/180 rule!',
    overstayStartsFrom: (date) => `Violation starts on ${date}`,

    plannerModeEarliest: 'When can I travel?',
    plannerModeCheck: 'Check my dates',
    earliestSearchTitle: 'Earliest Available Entry Date',
    earliestSearchDesc: 'Finds the nearest date you can enter for your desired stay without violating the 90/180 rule.',
    desiredDaysLabel: 'How many days do you want to stay?',
    searchFromDateLabel: 'Search starting from date:',
    tripPossibleTitle: 'TRIP IS FULLY COMPLIANT!',
    tripPossibleDesc: (duration) => `Duration: ${duration} consecutive days without any 90/180 rule violation.`,
    addAsPlanBtn: 'Add to planned trips',
    noDatesFoundTitle: (days) => `No legal period found for ${days} days within next 365 days.`,
    noDatesFoundDesc: 'Try reducing the stay duration or deleting overlapping planned trips.',
    checkDatesTitle: 'Check Planned Dates',
    checkDatesDesc: 'Simulate specific travel dates against your past trips to verify compliance.',
    tripLegalTitle: 'Proposed stay is compliant! (Max 90 days used)',
    tripViolationTitle: 'Proposed stay causes an overstay!',
    violationStartsFrom: (date) => `Violation occurs on ${date}.`,
    selectValidDatesHint: 'Select valid entry and exit dates to check compliance.',

    todayBtn: 'Today',
    legendTrip: 'Trip',
    legendPlan: 'Planned',
    legendOverstay: 'Overstay (>90)',
    legendToday: 'Today',
    dayDetailsInSchengen: (title) => `In Schengen ${title ? `(${title})` : ''}`,
    dayDetailsOutside: 'Outside Schengen',
    remainingAllowance: (rem) => `Remaining: ${rem} days`,

    backupModalTitle: 'Backup & Data Management',
    browserPersistenceTitle: 'Browser Eviction Protection',
    browserPersistenceActive: 'Persistent Storage Granted',
    browserPersistenceStandard: 'Standard Storage',
    enablePersistenceBtn: 'Enable Persistent Storage',
    persistenceProtectedBadge: 'Protected',
    persistenceGrantedToast: 'Persistent storage granted! Your trips are protected from automatic browser eviction.',
    persistenceDeniedHint: 'Browser requires adding the app to Home Screen (or bookmarking) before granting persistence. Your trips are already safe in IndexedDB and Cloud Sync.',
    fileBackupSectionTitle: 'File Backup (JSON)',
    exportFileBtn: 'Export JSON Backup',
    importFileBtn: 'Import JSON Backup',
    cloudSyncTitle: 'Cloudflare Cloud Sync (D1 Database)',
    cloudSyncDesc:
      'Connect anonymous cloud synchronization to access and manage your trips seamlessly across all your devices.',
    dangerZoneClearAll: 'Clear All Trips',
    dangerZoneConfirmText: 'Are you sure you want to delete all trips in the active profile? This cannot be undone.',
    confirmClearAllBtn: 'Yes, Delete All',
    importSuccess: (count) => `Successfully imported ${count} trips!`,
    importError: (err) => `Failed to import: ${err}`,

    infoModalTitle: 'How Do Schengen & Residence Rules Work?',
    infoMainPrincipleTitle: '1. Schengen 90/180 Rule (For Visitors)',
    infoMainPrincipleText:
      'Non-EU citizens visiting the Schengen Area on visa-free travel or short-stay Type C visas can stay for a maximum of 90 days within any 180-day rolling period (EU Regulation 2016/399).',
    infoSlidingWindowTitle: '2. Pan-European 183-Day Tax Residency',
    infoSlidingWindowText:
      'Across all EU member states (Germany, Spain, Portugal, France, Italy, etc.), staying ≥183 days in your country of residence within a calendar year secures tax residency and demonstrates compliance for work/residence permits.',
    infoKeyRulesTitle: '3. EU Permanent Residence (Directive 2003/109/EC):',
    infoRule1:
      'For EU Long-Term / Permanent Residence (Larga Duración / Niederlassungserlaubnis), cumulative absences over 5 years must not exceed 10 months (300 days), and no single trip may exceed 6 consecutive months.',
    infoRule2:
      'Schengen Allowance Recovery: As time advances past 180 days since an old tourist trip, those days drop out of the rolling lookback window.',
    infoRule3:
      'Multi-Profile Freedom: Maintain separate profiles on the same device — e.g. one for your EU Residence & Tax status, and another for visiting family members under the 90/180 rule.',
    infoOpenSourceBadge: 'Open-Source (MIT License)',

    desktopShortcutsHint: 'Shortcuts: N — new trip, Esc — close modal, 1/2/3 — switch views',
  },

  de: {
    appTitle: 'Schengen 90/180',
    appSubtitle: 'Visum & Residenz Reise-Suite',
    backupAndExport: 'Sicherung & Daten',
    aboutRule: 'Über die 90/180-Regel & Residenz',
    addTrip: 'Reise hinzufügen',
    trip: 'Reise',

    offlineBadge: 'Offline-Modus',
    onlineBadge: 'Online',
    updateAvailableTitle: 'Neues Update verfügbar!',
    updateNowBtn: 'App aktualisieren',

    profilesTitle: 'Profile verwalten',
    addProfile: 'Profil hinzufügen',
    profileNamePlaceholder: 'z.B. Blaue Karte, Partner, Kind',
    deleteProfile: 'Profil löschen',
    cannotDeleteOnlyProfile: 'Das einzige Profil kann nicht gelöscht werden.',
    myPassport: 'Mein Pass',
    activeProfileLabel: 'Aktives Profil',

    profileModeLabel: 'Berechnungsmodus',
    modeSchengen: '🇪🇺 Schengen-Besucher (90/180)',
    modeSchengenDesc: 'Für Touristen und Gäste ohne EU-Aufenthaltstitel (max. 90 Tage pro 180-Tage-Fenster).',
    modeResident: '🌍 EU-Residenz & Steuer-Tracker',
    modeResidentDesc:
      'Paneuropäische Steueransässigkeit (≥183 Tage) & Abwesenheitskontrolle für Inhaber von EU-Aufenthaltstiteln (Deutschland, Spanien, Frankreich usw.).',
    homeCountryLabel: 'Wohnsitzland (EU-Mitgliedstaat)',
    taxTargetDaysLabel: 'Steueransässigkeits-Ziel (Tage)',

    syncModalTitle: 'Cloudflare Cloud-Sync',
    syncActiveBadge: 'Cloud-Sync aktiv',
    syncDisabledBadge: 'Lokaler Offline-Speicher',
    syncNowBtn: 'Jetzt synchronisieren',
    syncingText: 'Synchronisiere mit Cloudflare...',
    lastSyncedAt: (time) => `Zuletzt synchronisiert: ${time}`,
    createSyncKeyBtn: 'Neuen Sync-Schlüssel erstellen',
    connectExistingDeviceBtn: 'Mit vorhandenem Schlüssel verbinden',
    enterSyncKeyPlaceholder: 'Sync-Schlüssel einfügen (z.B. vg_...)',
    connectBtn: 'Verbinden',
    pairingUrlCopied: 'Kopplungslink in Zwischenablage kopiert!',
    copyPairingLinkBtn: '1-Klick-Kopplungslink kopieren',
    copyKeyBtn: 'Sync-Schlüssel kopieren',
    copiedBtn: 'Kopiert!',
    disconnectSyncBtn: 'Sync trennen',
    autoSyncToggleTitle: 'Automatische Cloud-Synchronisierung',
    autoSyncToggleDesc: 'Änderungen nach dem Hinzufügen oder Bearbeiten von Reisen automatisch in die Cloudflare D1-Datenbank übertragen.',
    syncExplainerTitle: 'Passwortlose Cloud-Kopplung',
    syncExplainerDesc:
      'Ihr anonymer Sync-Schlüssel isoliert Ihre Daten in Ihrer privaten Cloudflare D1-Tabelle. Keine Registrierung nötig.',
    syncSetupInstructionsTitle: 'Geräte in 5 Sekunden koppeln:',
    syncSetupInstructionsDesc:
      'Erstellen Sie einen Schlüssel, kopieren Sie den 1-Klick-Link und öffnen Sie ihn auf Ihrem Telefon oder Tablet.',

    referenceDate: 'Stichtag:',
    resetToday: 'Auf heute zurücksetzen',
    overstayWarningTitle: 'Überziehung festgestellt!',
    overstayWarningDesc: (firstDate) =>
      `Aufenthalte überschreiten das 90/180-Tage-Limit (erste Verletzung am ${firstDate || 'unbekannt'}).`,
    daysRemaining: 'Verbleibende Tage',
    of90: 'von 90',
    daysUsed: 'Verbrauchte Tage',
    days: 'Tage',
    last180Days: 'Im rollierenden 180-Tage-Fenster',
    quotaUsage: '90-Tage-Kontingent verbraucht',
    inSchengen: 'Derzeit im Schengen-Raum',
    outsideSchengen: 'Derzeit außerhalb des Schengen-Raums',
    limitExhausted: 'Kontingent erschöpft',
    stayPermitted: 'Aufenthalt erlaubt',
    entryPermitted: 'Einreise erlaubt',
    continuousStayRemaining: (days) => `Noch ${days} Tage am Stück erlaubt`,
    canEnterConsecutively: (days) => `Für ${days} aufeinanderfolgende Tage einreisen`,
    recoveryTitle: 'Kommende Tage-Rückgewinnung:',
    daysGained: (days) => `+${days} Tage`,

    residentHeaderBadge: (countryName) => `EU-Resident: ${countryName}`,
    taxYearTitle: (year) => `EU-Steuer- & Aufenthaltsjahr ${year}`,
    daysInCountry: (countryName) => `Tage in ${countryName}`,
    daysOutsideCountry: 'Tage im Ausland (Abwesenheit)',
    taxSecuredBadge: 'EU-Steueransässigkeit gesichert (≥183 Tage)',
    taxNotYetSecuredBadge: 'Tage bis 183 in Arbeit',
    taxRequirementMet: (target, countryName) =>
      `Bedingung erfüllt! ≥${target} Tage in ${countryName || 'Wohnsitzland'} in diesem Kalenderjahr verbracht (Steueransässigkeit gesichert).`,
    taxDaysNeeded: (needed) =>
      `Noch ${needed} Tage im Wohnsitzland erforderlich, um die 183-Tage-Steueransässigkeit zu sichern.`,
    safeRemainingAbroad: (days) => `Sichere verbleibende Abwesenheit: ${days} Tage`,
    taxLimitExceeded: '182-Tage-Abwesenheitsgrenze überschritten (Risiko für Steueransässigkeit)',
    taxMilestone183: 'Paneuropäische 183-Tage-Steuergrenze',
    abroadTripListTitle: 'Auslandsreisen & Abwesenheiten',
    logAbroadTripBtn: 'Auslandsaufenthalt erfassen',
    abroadTripModalTitle: 'Auslandsaufenthalt erfassen',
    abroadTripEditModalTitle: 'Auslandsaufenthalt bearbeiten',
    abroadDuration: (days) => `Im Ausland für ${days} Tage`,
    permResidence5YearTitle: 'Daueraufenthalt-EU (Richtlinie 2003/109/EG)',
    permResidence5YearDesc: (used, limit) =>
      `Abwesenheit in 5 Jahren: ${used} von ${limit} erlaubten Tagen (max. 10 Monate).`,
    permResidenceSafe: 'Kontingent für Daueraufenthalt ist im sicheren Bereich',
    permResidenceWarning: 'Warnung: 5-Jahres-Abwesenheit überschreitet das 300-Tage-Limit',
    singleTripViolationAlert: 'Warnung: Eine einzelne Reise überschritt 6 Monate ununterbrochene Abwesenheit.',
    switchToResidentBtn: 'Zu EU-Residenz wechseln',
    switchToSchengenBtn: 'Zu Schengen 90/180 wechseln',

    tabTrips: 'Reisen',
    tabPlanner: 'Planer',
    tabCalendar: 'Kalender',

    tripsHistoryTitle: 'Reiseverlauf & Pläne',
    noTripsTitle: 'Noch keine Reisen erfasst',
    noTripsDesc: 'Tragen Sie vergangene oder geplante Reisen ein, um Ihr Guthaben zu berechnen.',
    addFirstTrip: 'Erste Reise hinzufügen',
    loadSamples: 'Beispieldaten laden',
    plannedBadge: 'Geplant',
    singleDay: '1 Tag',
    durationDays: (days) => `${days} Tage`,
    editTrip: 'Reise bearbeiten',
    deleteTrip: 'Reise löschen',

    modalNewTripTitle: 'Neue Reise hinzufügen',
    modalEditTripTitle: 'Reise bearbeiten',
    entryDateLabel: 'Einreisedatum (Erster Tag im Schengen-Raum)',
    exitDateLabel: 'Ausreisedatum (Letzter Tag im Schengen-Raum)',
    titleLabel: 'Reisebezeichnung (Optional)',
    titlePlaceholder: 'z.B. Rom Urlaub, Geschäftstermin Berlin',
    notesLabel: 'Notizen (Optional)',
    notesPlaceholder: 'Flugdaten, Hotel, Begleitung...',
    plannedCheckboxTitle: 'Als geplante (zukünftige) Reise markieren',
    plannedCheckboxSubtitle: 'Ermöglicht Prognosen ohne Auswirkung auf vergangene Statistiken',
    cancelBtn: 'Abbrechen',
    saveBtn: 'Reise speichern',
    errSelectDates: 'Bitte Einreise- und Ausreisedatum angeben.',
    errExitBeforeEntry: 'Ausreisedatum darf nicht vor dem Einreisedatum liegen.',
    maxUsedDuringTrip: (used) => `Spitzenauslastung bei dieser Reise: ${used}/90 Tage`,
    overstayAlert: 'Diese Reise führt zu einer Überziehung der 90/180-Regel!',
    overstayStartsFrom: (date) => `Verletzung beginnt am ${date}`,

    plannerModeEarliest: 'Wann kann ich reisen?',
    plannerModeCheck: 'Daten prüfen',
    earliestSearchTitle: 'Frühestmögliches Einreisedatum',
    earliestSearchDesc: 'Findet das nächstmögliche Datum für die gewünschte Aufenthaltsdauer ohne 90/180-Verletzung.',
    desiredDaysLabel: 'Wie viele Tage möchten Sie bleiben?',
    searchFromDateLabel: 'Suche ab Datum:',
    tripPossibleTitle: 'REISE VOLLSTÄNDIG ERLAUBT!',
    tripPossibleDesc: (duration) => `Dauer: ${duration} Tage am Stück ohne Verletzung der 90/180-Regel.`,
    addAsPlanBtn: 'Zu geplanten Reisen hinzufügen',
    noDatesFoundTitle: (days) => `Kein zulässiger Zeitraum für ${days} Tage in den nächsten 365 Tagen gefunden.`,
    noDatesFoundDesc: 'Versuchen Sie, die Dauer zu verkürzen oder überschneidende geplante Reisen zu löschen.',
    checkDatesTitle: 'Konkrete Reisedaten prüfen',
    checkDatesDesc: 'Simulieren Sie Reisedaten im Abgleich mit vergangenen Aufenthalten.',
    tripLegalTitle: 'Geplanter Aufenthalt ist zulässig! (Max. 90 Tage genutzt)',
    tripViolationTitle: 'Geplanter Aufenthalt führt zu Überziehung!',
    violationStartsFrom: (date) => `Verletzung tritt auf am ${date}.`,
    selectValidDatesHint: 'Gültige Ein- und Ausreisedaten auswählen.',

    todayBtn: 'Heute',
    legendTrip: 'Reise',
    legendPlan: 'Planung',
    legendOverstay: 'Überziehung (>90)',
    legendToday: 'Heute',
    dayDetailsInSchengen: (title) => `Im Schengen-Raum ${title ? `(${title})` : ''}`,
    dayDetailsOutside: 'Außerhalb des Schengen-Raums',
    remainingAllowance: (rem) => `Guthaben: ${rem} Tage`,

    backupModalTitle: 'Sicherung & Datenverwaltung',
    browserPersistenceTitle: 'Browser-Bereinigungsschutz',
    browserPersistenceActive: 'Dauerhafter Speicher aktiv',
    browserPersistenceStandard: 'Standardspeicher',
    enablePersistenceBtn: 'Dauerhaften Speicher aktivieren',
    persistenceProtectedBadge: 'Geschützt',
    persistenceGrantedToast: 'Dauerhafter Speicher aktiv! Ihre Daten sind vor automatischer Bereinigung geschützt.',
    persistenceDeniedHint: 'Der Browser erfordert das Hinzufügen zum Startbildschirm oder Lesezeichen für dauerhaften Speicher. Ihre Reisen sind bereits lokal und in Cloud Sync gesichert.',
    fileBackupSectionTitle: 'Datei-Sicherung (JSON)',
    exportFileBtn: 'JSON-Sicherung exportieren',
    importFileBtn: 'JSON-Sicherung importieren',
    cloudSyncTitle: 'Cloudflare Cloud-Sync (D1-Datenbank)',
    cloudSyncDesc:
      'Verbinden Sie die Cloud-Synchronisierung, um Ihre Reisen auf all Ihren Geräten nahtlos abzugleichen.',
    dangerZoneClearAll: 'Alle Reisen löschen',
    dangerZoneConfirmText: 'Möchten Sie wirklich alle Reisen im aktiven Profil löschen? Dies kann nicht rückgängig gemacht werden.',
    confirmClearAllBtn: 'Ja, alle löschen',
    importSuccess: (count) => `${count} Reisen erfolgreich importiert!`,
    importError: (err) => `Fehler beim Import: ${err}`,

    infoModalTitle: 'Wie funktionieren Schengen- & Residenzregeln?',
    infoMainPrincipleTitle: '1. Schengen 90/180-Regel (Für Besucher)',
    infoMainPrincipleText:
      'Drittstaatsangehörige dürfen sich visumfrei oder mit Visum Typ C maximal 90 Tage innerhalb jedes 180-Tage-Fensters im Schengen-Raum aufhalten (EU-Verordnung 2016/399).',
    infoSlidingWindowTitle: '2. Paneuropäische 183-Tage-Steueransässigkeit',
    infoSlidingWindowText:
      'In allen EU-Ländern (Deutschland, Spanien, Frankreich usw.) sichert ein Aufenthalt von mindestens 183 Tagen im Kalenderjahr die Steueransässigkeit und Rechtssicherheit.',
    infoKeyRulesTitle: '3. Daueraufenthalt-EU (Richtlinie 2003/109/EG):',
    infoRule1:
      'Für die Niederlassungserlaubnis / Daueraufenthalt-EU darf die Gesamtabwesenheit in 5 Jahren 10 Monate (300 Tage) nicht überschreiten, und keine Einzelreise länger als 6 Monate dauern.',
    infoRule2:
      'Tage-Rückgewinnung: Vergehen 180 Tage seit einer früheren Reise, fallen diese Tage aus dem rollierenden Fenster heraus.',
    infoRule3:
      'Mehrere Profile: Sie können Profile für Ihre EU-Residenz und separate Profile für touristische Visa von Familienmitgliedern anlegen.',
    infoOpenSourceBadge: 'Open-Source (MIT-Lizenz)',

    desktopShortcutsHint: 'Tastenkürzel: N — neue Reise, Esc — schließen, 1/2/3 — Ansichten',
  },

  fr: {
    appTitle: 'Schengen 90/180',
    appSubtitle: 'Calculateur Visa & Résidence',
    backupAndExport: 'Sauvegarde & Données',
    aboutRule: 'Règle 90/180 & Résidence',
    addTrip: 'Ajouter un séjour',
    trip: 'Séjour',

    offlineBadge: 'Mode hors-ligne',
    onlineBadge: 'En ligne',
    updateAvailableTitle: 'Mise à jour disponible !',
    updateNowBtn: 'Mettre à jour',

    profilesTitle: 'Gérer les profils',
    addProfile: 'Ajouter un profil',
    profileNamePlaceholder: 'ex. Titre de séjour, Conjoint, Enfant',
    deleteProfile: 'Supprimer le profil',
    cannotDeleteOnlyProfile: 'Impossible de supprimer l\'unique profil.',
    myPassport: 'Mon Passeport',
    activeProfileLabel: 'Profil actif',

    profileModeLabel: 'Mode de calcul',
    modeSchengen: '🇪🇺 Visiteur Schengen (90/180)',
    modeSchengenDesc: 'Pour les touristes et courts séjours sans titre de séjour UE (max. 90 jours sur 180 jours).',
    modeResident: '🌍 Résidence UE & Fiscalité',
    modeResidentDesc:
      'Résidence fiscale paneuropéenne (≥183 jours) et suivi des absences pour les résidents dans l\'UE (France, Espagne, Allemagne, etc.).',
    homeCountryLabel: 'Pays de résidence (État membre de l\'UE)',
    taxTargetDaysLabel: 'Objectif de résidence fiscale (jours)',

    syncModalTitle: 'Synchronisation Cloudflare',
    syncActiveBadge: 'Synchronisation active',
    syncDisabledBadge: 'Stockage local hors-ligne',
    syncNowBtn: 'Synchroniser',
    syncingText: 'Synchronisation avec Cloudflare...',
    lastSyncedAt: (time) => `Dernière synchro : ${time}`,
    createSyncKeyBtn: 'Générer une clé de synchro',
    connectExistingDeviceBtn: 'Associer avec une clé existante',
    enterSyncKeyPlaceholder: 'Collez votre clé (ex. vg_...)',
    connectBtn: 'Connecter',
    pairingUrlCopied: 'Lien d\'association copié !',
    copyPairingLinkBtn: 'Copier le lien en 1 clic',
    copyKeyBtn: 'Copier la clé',
    copiedBtn: 'Copié !',
    disconnectSyncBtn: 'Déconnecter',
    autoSyncToggleTitle: 'Synchronisation automatique',
    autoSyncToggleDesc: 'Synchronisez automatiquement vos voyages vers votre base Cloudflare D1 après chaque modification.',
    syncExplainerTitle: 'Association Cloud sans mot de passe',
    syncExplainerDesc:
      'Votre clé anonyme isole vos voyages dans votre table privée Cloudflare D1. Aucun compte ni mot de passe requis.',
    syncSetupInstructionsTitle: 'Associer vos appareils en 5 secondes :',
    syncSetupInstructionsDesc:
      'Générez une clé, cliquez sur "Copier le lien en 1 clic" et ouvrez-le sur votre téléphone ou tablette.',

    referenceDate: 'Date de référence :',
    resetToday: 'Aujourd\'hui',
    overstayWarningTitle: 'Dépassement détecté !',
    overstayWarningDesc: (firstDate) =>
      `Des séjours dépassent la limite des 90/180 jours (première infraction le ${firstDate || 'inconnue'}).`,
    daysRemaining: 'Jours restants',
    of90: 'sur 90',
    daysUsed: 'Jours utilisés',
    days: 'jours',
    last180Days: 'Sur la période glissante de 180 jours',
    quotaUsage: 'Quota de 90 jours consommé',
    inSchengen: 'Actuellement dans Schengen',
    outsideSchengen: 'Actuellement hors Schengen',
    limitExhausted: 'Quota épuisé',
    stayPermitted: 'Séjour autorisé',
    entryPermitted: 'Entrée autorisée',
    continuousStayRemaining: (days) => `Encore ${days} jours continus autorisés`,
    canEnterConsecutively: (days) => `Entrée possible pour ${days} jours consécutifs`,
    recoveryTitle: 'Récupération de jours à venir :',
    daysGained: (days) => `+${days} jours`,

    residentHeaderBadge: (countryName) => `Résident UE : ${countryName}`,
    taxYearTitle: (year) => `Année fiscale et de résidence ${year}`,
    daysInCountry: (countryName) => `Jours en ${countryName}`,
    daysOutsideCountry: 'Jours à l\'étranger (Absences)',
    taxSecuredBadge: 'Résidence fiscale UE validée (≥183 jours)',
    taxNotYetSecuredBadge: 'Objectif de 183 jours en cours',
    taxRequirementMet: (target, countryName) =>
      `Condition remplie ! ≥${target} jours passés en ${countryName || 'pays de résidence'} cette année (résidence fiscale acquise).`,
    taxDaysNeeded: (needed) =>
      `Encore ${needed} jours dans votre pays de résidence pour sécuriser les 183 jours fiscaux.`,
    safeRemainingAbroad: (days) => `Absence maximale autorisée : ${days} jours`,
    taxLimitExceeded: 'Limite de 182 jours d\'absence dépassée (risque fiscal)',
    taxMilestone183: 'Seuil fiscal paneuropéen des 183 jours',
    abroadTripListTitle: 'Voyages à l\'étranger & Absences',
    logAbroadTripBtn: 'Enregistrer séjour à l\'étranger',
    abroadTripModalTitle: 'Enregistrer un séjour à l\'étranger',
    abroadTripEditModalTitle: 'Modifier le séjour à l\'étranger',
    abroadDuration: (days) => `À l\'étranger pendant ${days} jours`,
    permResidence5YearTitle: 'Résidence permanente UE (Directive 2003/109/CE)',
    permResidence5YearDesc: (used, limit) =>
      `Absence sur 5 ans : ${used} / ${limit} jours autorisés (max. 10 mois).`,
    permResidenceSafe: 'Quota de résidence permanente dans les limites',
    permResidenceWarning: 'Attention : les absences sur 5 ans dépassent 300 jours',
    singleTripViolationAlert: 'Attention : un séjour dépasse 6 mois consécutifs hors du pays.',
    switchToResidentBtn: 'Passer en mode Résident UE',
    switchToSchengenBtn: 'Passer en mode Schengen 90/180',

    tabTrips: 'Séjours',
    tabPlanner: 'Planificateur',
    tabCalendar: 'Calendrier',

    tripsHistoryTitle: 'Historique des séjours & Projets',
    noTripsTitle: 'Aucun séjour enregistré',
    noTripsDesc: 'Enregistrez vos séjours passés ou prévus pour calculer votre solde de jours.',
    addFirstTrip: 'Ajouter un premier séjour',
    loadSamples: 'Charger des exemples',
    plannedBadge: 'Prévu',
    singleDay: '1 jour',
    durationDays: (days) => `${days} jours`,
    editTrip: 'Modifier',
    deleteTrip: 'Supprimer',

    modalNewTripTitle: 'Nouveau séjour',
    modalEditTripTitle: 'Modifier le séjour',
    entryDateLabel: 'Date d\'entrée (Premier jour dans Schengen)',
    exitDateLabel: 'Date de sortie (Dernier jour dans Schengen)',
    titleLabel: 'Titre du séjour (Optionnel)',
    titlePlaceholder: 'ex. Vacances à Rome, Conférence à Berlin',
    notesLabel: 'Notes (Optionnel)',
    notesPlaceholder: 'Vol, hôtel, accompagnants...',
    plannedCheckboxTitle: 'Marquer comme séjour prévu (futur)',
    plannedCheckboxSubtitle: 'Permet d\'anticiper votre solde sans impacter l\'historique',
    cancelBtn: 'Annuler',
    saveBtn: 'Enregistrer',
    errSelectDates: 'Veuillez sélectionner les dates d\'entrée et de sortie.',
    errExitBeforeEntry: 'La date de sortie ne peut pas précéder la date d\'entrée.',
    maxUsedDuringTrip: (used) => `Pic de consommation pendant ce séjour : ${used}/90 jours`,
    overstayAlert: 'Ce séjour entraîne un dépassement de la règle 90/180 !',
    overstayStartsFrom: (date) => `Infraction à compter du ${date}`,

    plannerModeEarliest: 'Quand puis-je partir ?',
    plannerModeCheck: 'Vérifier mes dates',
    earliestSearchTitle: 'Date d\'entrée la plus proche',
    earliestSearchDesc: 'Trouve la date la plus proche pour voyager la durée souhaitée sans infraction 90/180.',
    desiredDaysLabel: 'Combien de jours souhaitez-vous séjourner ?',
    searchFromDateLabel: 'Rechercher à partir de la date :',
    tripPossibleTitle: 'SÉJOUR ENTIÈREMENT CONFORME !',
    tripPossibleDesc: (duration) => `Durée : ${duration} jours consécutifs sans infraction à la règle 90/180.`,
    addAsPlanBtn: 'Ajouter aux séjours prévus',
    noDatesFoundTitle: (days) => `Aucune période légale de ${days} jours trouvée sur les 365 prochains jours.`,
    noDatesFoundDesc: 'Réduisez la durée ou supprimez des séjours prévus chevauchants.',
    checkDatesTitle: 'Tester des dates précises',
    checkDatesDesc: 'Simulez un séjour futur et vérifiez sa conformité avec vos séjours passés.',
    tripLegalTitle: 'Séjour conforme ! (90 jours max respectés)',
    tripViolationTitle: 'Le séjour entraîne un dépassement !',
    violationStartsFrom: (date) => `Infraction constatée le ${date}.`,
    selectValidDatesHint: 'Sélectionnez des dates d\'entrée et de sortie valides.',

    todayBtn: 'Aujourd\'hui',
    legendTrip: 'Séjour',
    legendPlan: 'Projet',
    legendOverstay: 'Dépassement (>90)',
    legendToday: 'Aujourd\'hui',
    dayDetailsInSchengen: (title) => `Dans l\'espace Schengen ${title ? `(${title})` : ''}`,
    dayDetailsOutside: 'Hors espace Schengen',
    remainingAllowance: (rem) => `Solde : ${rem} jours`,

    backupModalTitle: 'Sauvegarde & Données',
    browserPersistenceTitle: 'Protection anti-nettoyage navigateur',
    browserPersistenceActive: 'Stockage persistant activé',
    browserPersistenceStandard: 'Stockage standard',
    enablePersistenceBtn: 'Activer le stockage persistant',
    persistenceProtectedBadge: 'Protégé',
    persistenceGrantedToast: 'Stockage persistant accordé ! Vos données sont protégées contre le nettoyage automatique.',
    persistenceDeniedHint: "Le navigateur nécessite d'ajouter l'application à l'écran d'accueil pour accorder la persistance. Vos données sont déjà sécurisées localement et dans Cloud Sync.",
    fileBackupSectionTitle: 'Sauvegarde sur fichier (JSON)',
    exportFileBtn: 'Exporter la sauvegarde JSON',
    importFileBtn: 'Importer la sauvegarde JSON',
    cloudSyncTitle: 'Synchronisation Cloudflare (Base D1)',
    cloudSyncDesc:
      'Synchronisez vos voyages de façon transparente entre votre ordinateur, téléphone et tablette.',
    dangerZoneClearAll: 'Effacer tous les séjours',
    dangerZoneConfirmText: 'Voulez-vous vraiment supprimer tous les séjours de ce profil ? Action irréversible.',
    confirmClearAllBtn: 'Oui, tout supprimer',
    importSuccess: (count) => `${count} séjours importés avec succès !`,
    importError: (err) => `Erreur lors de l\'import : ${err}`,

    infoModalTitle: 'Comprendre les règles Schengen & Résidence',
    infoMainPrincipleTitle: '1. Règle Schengen 90/180 (Pour les touristes)',
    infoMainPrincipleText:
      'Les ressortissants d\'États tiers sans visa ou munis d\'un visa court séjour C peuvent séjourner au maximum 90 jours sur toute période de 180 jours glissants (Règlement UE 2016/399).',
    infoSlidingWindowTitle: '2. Résidence fiscale européenne (183 jours)',
    infoSlidingWindowText:
      'Dans tous les pays de l\'UE (France, Espagne, Allemagne, Portugal, etc.), résider au moins 183 jours par an dans son pays de résidence sécurise le statut fiscal.',
    infoKeyRulesTitle: '3. Résidence de longue durée UE (Directive 2003/109/CE) :',
    infoRule1:
      'Pour la carte de résident permanent / longue durée UE, les absences cumulées sur 5 ans ne doivent pas dépasser 10 mois (300 jours), et aucun séjour unique ne doit dépasser 6 mois consécutifs.',
    infoRule2:
      'Récupération du quota : dès qu\'un séjour dépasse 180 jours d\'ancienneté, ses jours sortent de la fenêtre de calcul.',
    infoRule3:
      'Multi-profils : gérez un profil pour votre résidence fiscale et un profil séparé pour vos proches en visite touristique.',
    infoOpenSourceBadge: 'Open-Source (Licence MIT)',

    desktopShortcutsHint: 'Raccourcis : N — nouveau séjour, Échap — fermer, 1/2/3 — onglets',
  },

  pl: {
    appTitle: 'Schengen 90/180',
    appSubtitle: 'Kalkulator Wizy i Rezydentury',
    backupAndExport: 'Kopia zapasowa i dane',
    aboutRule: 'O zasadzie 90/180 i rezydenturze',
    addTrip: 'Dodaj wyjazd',
    trip: 'Wyjazd',

    offlineBadge: 'Tryb offline',
    onlineBadge: 'Online',
    updateAvailableTitle: 'Dostępna nowa aktualizacja!',
    updateNowBtn: 'Zaktualizuj aplikację',

    profilesTitle: 'Zarządzaj profilami',
    addProfile: 'Dodaj profil',
    profileNamePlaceholder: 'np. Karta Pobytu, Partner, Dziecko',
    deleteProfile: 'Usuń profil',
    cannotDeleteOnlyProfile: 'Nie można usunąć jedynego profilu.',
    myPassport: 'Mój Paszport',
    activeProfileLabel: 'Aktywny profil',

    profileModeLabel: 'Tryb kalkulacji',
    modeSchengen: '🇪🇺 Gość Schengen (90/180)',
    modeSchengenDesc: 'Dla turystów i gości bez rezydentury w UE (maks. 90 dni w dowolnym 180-dniowym oknie).',
    modeResident: '🌍 Rezydent UE i Podatki',
    modeResidentDesc:
      'Ogólnoeuropejska rezydentura podatkowa (≥183 dni) i kontrola nieobecności dla posiadaczy karty pobytu w UE (Niemcy, Hiszpania, Polska itp.).',
    homeCountryLabel: 'Kraj rezydentury (Państwo członkowskie UE)',
    taxTargetDaysLabel: 'Cel rezydentury podatkowej (dni)',

    syncModalTitle: 'Synchronizacja Cloudflare',
    syncActiveBadge: 'Synchronizacja aktywna',
    syncDisabledBadge: 'Lokalna pamięć offline',
    syncNowBtn: 'Synchronizuj teraz',
    syncingText: 'Synchronizowanie z Cloudflare...',
    lastSyncedAt: (time) => `Ostatnia synchronizacja: ${time}`,
    createSyncKeyBtn: 'Wygeneruj nowy klucz',
    connectExistingDeviceBtn: 'Połącz za pomocą klucza',
    enterSyncKeyPlaceholder: 'Wklej swój klucz (np. vg_...)',
    connectBtn: 'Połącz',
    pairingUrlCopied: 'Link parujący skopiowany do schowka!',
    copyPairingLinkBtn: 'Kopiuj link do szybkiego parowania',
    copyKeyBtn: 'Kopiuj klucz',
    copiedBtn: 'Skopiowano!',
    disconnectSyncBtn: 'Odłącz synchronizację',
    autoSyncToggleTitle: 'Automatyczna synchronizacja',
    autoSyncToggleDesc: 'Automatycznie zapisuj zmiany w chmurze Cloudflare D1 po każdej edycji podróży.',
    syncExplainerTitle: 'Parowanie w chmurze bez haseł',
    syncExplainerDesc:
      'Twój anonimowy klucz izoluje Twoje dane w prywatnej tabeli Cloudflare D1. Bez logowania i haseł.',
    syncSetupInstructionsTitle: 'Jak sparować urządzenia w 5 sekund:',
    syncSetupInstructionsDesc:
      'Wygeneruj klucz na tym urządzeniu, skopiuj link i otwórz go na telefonie lub tablecie.',

    referenceDate: 'Data odniesienia:',
    resetToday: 'Ustaw dzisiaj',
    overstayWarningTitle: 'Wykryto przekroczenie pobytu!',
    overstayWarningDesc: (firstDate) =>
      `Pobyty przekraczają limit reguły 90/180 (pierwsze naruszenie ${firstDate || 'nieznane'}).`,
    daysRemaining: 'Pozostałe dni',
    of90: 'z 90',
    daysUsed: 'Wykorzystane dni',
    days: 'dni',
    last180Days: 'W ruchomym oknie 180 dni',
    quotaUsage: 'Wykorzystany limit 90 dni',
    inSchengen: 'Obecnie w Schengen',
    outsideSchengen: 'Obecnie poza Schengen',
    limitExhausted: 'Limit wyczerpany',
    stayPermitted: 'Pobyt dozwolony',
    entryPermitted: 'Wjazd dozwolony',
    continuousStayRemaining: (days) => `Możesz zostać jeszcze ${days} dni bez przerwy`,
    canEnterConsecutively: (days) => `Wjazd dozwolony na ${days} kolejnych dni`,
    recoveryTitle: 'Nadchodzące odzyskiwanie limitu:',
    daysGained: (days) => `+${days} dni`,

    residentHeaderBadge: (countryName) => `Rezydent UE: ${countryName}`,
    taxYearTitle: (year) => `Rok podatkowy i pobytowy ${year}`,
    daysInCountry: (countryName) => `Dni w ${countryName}`,
    daysOutsideCountry: 'Dni za granicą (Nieobecności)',
    taxSecuredBadge: 'Rezydentura podatkowa UE zabezpieczona (≥183 dni)',
    taxNotYetSecuredBadge: 'Gromadzenie 183 dni w toku',
    taxRequirementMet: (target, countryName) =>
      `Warunek spełniony! Spędzono ≥${target} dni w ${countryName || 'kraju rezydentury'} w tym roku (rezydentura podatkowa zabezpieczona).`,
    taxDaysNeeded: (needed) =>
      `Potrzeba jeszcze ${needed} dni w kraju rezydentury, aby zabezpieczyć status 183 dni.`,
    safeRemainingAbroad: (days) => `Bezpieczny pozostały limit wyjazdów: ${days} dni`,
    taxLimitExceeded: 'Przekroczono limit 182 dni nieobecności (ryzyko utraty statusu)',
    taxMilestone183: 'Ogólnoeuropejski próg podatkowy 183 dni',
    abroadTripListTitle: 'Wyjazdy zagraniczne i nieobecności',
    logAbroadTripBtn: 'Zapisz wyjazd zagraniczny',
    abroadTripModalTitle: 'Zapisz wyjazd zagraniczny',
    abroadTripEditModalTitle: 'Edytuj wyjazd zagraniczny',
    abroadDuration: (days) => `Za granicą przez ${days} dni`,
    permResidence5YearTitle: 'Pobyt stały / Rezydent długoterminowy UE (Dyrektywa 2003/109/WE)',
    permResidence5YearDesc: (used, limit) =>
      `Nieobecności w ciągu 5 lat: ${used} z ${limit} dozwolonych dni (maks. 10 miesięcy).`,
    permResidenceSafe: 'Limit nieobecności do pobytu stałego jest bezpieczny',
    permResidenceWarning: 'Uwaga: nieobecności w ciągu 5 lat przekraczają 300 dni',
    singleTripViolationAlert: 'Uwaga: jeden z wyjazdów przekroczył 6 miesięcy ciągłej nieobecności.',
    switchToResidentBtn: 'Przełącz na Rezydent UE',
    switchToSchengenBtn: 'Przełącz na Schengen 90/180',

    tabTrips: 'Wyjazdy',
    tabPlanner: 'Planer',
    tabCalendar: 'Kalendarz',

    tripsHistoryTitle: 'Historia wyjazdów i plany',
    noTripsTitle: 'Brak dodanych podróży',
    noTripsDesc: 'Wprowadź swoje przeszłe lub planowane podróże, aby obliczyć limit.',
    addFirstTrip: 'Dodaj pierwszą podróż',
    loadSamples: 'Załaduj przykłady',
    plannedBadge: 'Plan',
    singleDay: '1 dzień',
    durationDays: (days) => `${days} dni`,
    editTrip: 'Edytuj podróż',
    deleteTrip: 'Usuń podróż',

    modalNewTripTitle: 'Nowy wyjazd',
    modalEditTripTitle: 'Edytuj wyjazd',
    entryDateLabel: 'Data wjazdu (Pierwszy dzień w Schengen)',
    exitDateLabel: 'Data wyjazdu (Ostatni dzień w Schengen)',
    titleLabel: 'Nazwa podróży (Opcjonalnie)',
    titlePlaceholder: 'np. Urlop w Rzymie, Konferencja w Berlinie',
    notesLabel: 'Notatki (Opcjonalnie)',
    notesPlaceholder: 'Numer lotu, hotel, osoby towarzyszące...',
    plannedCheckboxTitle: 'Oznacz jako podróż planowaną (przyszłą)',
    plannedCheckboxSubtitle: 'Umożliwia prognozowanie limitu bez wpływu na przeszłą historię',
    cancelBtn: 'Anuluj',
    saveBtn: 'Zapisz wyjazd',
    errSelectDates: 'Proszę wybrać datę wjazdu i wyjazdu.',
    errExitBeforeEntry: 'Data wyjazdu nie może być wcześniejsza niż data wjazdu.',
    maxUsedDuringTrip: (used) => `Szczytowe zużycie podczas tego wyjazdu: ${used}/90 dni`,
    overstayAlert: 'Ten wyjazd spowoduje przekroczenie reguły 90/180!',
    overstayStartsFrom: (date) => `Naruszenie rozpoczyna się ${date}`,

    plannerModeEarliest: 'Kiedy mogę jechać?',
    plannerModeCheck: 'Sprawdź konkretne daty',
    earliestSearchTitle: 'Najwcześniejsza dostępna data wjazdu',
    earliestSearchDesc: 'Wyszukuje najbliższą datę, od której możesz wjechać na żądany czas bez naruszenia 90/180.',
    desiredDaysLabel: 'Ile dni planujesz spędzić w podróży?',
    searchFromDateLabel: 'Szukaj od daty:',
    tripPossibleTitle: 'WYJAZD CAŁKOWICIE ZGODNY Z PRZEPISAMI!',
    tripPossibleDesc: (duration) => `Czas trwania: ${duration} kolejnych dni bez naruszenia reguły 90/180.`,
    addAsPlanBtn: 'Dodaj do zaplanowanych',
    noDatesFoundTitle: (days) => `Nie znaleziono legalnego terminu na ${days} dni w ciągu najbliższych 365 dni.`,
    noDatesFoundDesc: 'Spróbuj skrócić czas pobytu lub usunąć nakładające się plany.',
    checkDatesTitle: 'Sprawdź planowane daty',
    checkDatesDesc: 'Przeprowadź symulację podróży w wybranych datach.',
    tripLegalTitle: 'Wyjazd dozwolony! (Limit do 90 dni zachowany)',
    tripViolationTitle: 'Wyjazd spowoduje przekroczenie limitu!',
    violationStartsFrom: (date) => `Przekroczenie nastąpi w dniu ${date}.`,
    selectValidDatesHint: 'Wybierz poprawne daty wjazdu i wyjazdu.',

    todayBtn: 'Dzisiaj',
    legendTrip: 'Pobyt',
    legendPlan: 'Plan',
    legendOverstay: 'Przekroczenie (>90)',
    legendToday: 'Dzisiaj',
    dayDetailsInSchengen: (title) => `W strefie Schengen ${title ? `(${title})` : ''}`,
    dayDetailsOutside: 'Poza strefą Schengen',
    remainingAllowance: (rem) => `Pozostało: ${rem} dni`,

    backupModalTitle: 'Kopia zapasowa i zarządzanie danymi',
    browserPersistenceTitle: 'Ochrona pamięci przeglądarki',
    browserPersistenceActive: 'Trwała pamięć włączona',
    browserPersistenceStandard: 'Pamięć standardowa',
    enablePersistenceBtn: 'Włącz trwałą pamięć',
    persistenceProtectedBadge: 'Chronione',
    persistenceGrantedToast: 'Trwała pamięć przyznana! Twoje dane są chronione przed automatycznym usunięciem.',
    persistenceDeniedHint: 'Przeglądarka wymaga dodania aplikacji do ekranu głównego przed przyznaniem trwałej pamięci. Twoje podróże są już bezpieczne w pamięci lokalnej i Cloud Sync.',
    fileBackupSectionTitle: 'Kopia w pliku (JSON)',
    exportFileBtn: 'Eksportuj kopię JSON',
    importFileBtn: 'Importuj kopię JSON',
    cloudSyncTitle: 'Synchronizacja w chmurze (Cloudflare D1)',
    cloudSyncDesc:
      'Połącz anonimową synchronizację, aby mieć natychmiastowy dostęp do swoich podróży na każdym urządzeniu.',
    dangerZoneClearAll: 'Wyczyść wszystkie podróże',
    dangerZoneConfirmText: 'Czy na pewno chcesz usunąć wszystkie wyjazdy w tym profilu? Operacja jest nieodwracalna.',
    confirmClearAllBtn: 'Tak, usuń wszystko',
    importSuccess: (count) => `Pomyślnie zaimportowano ${count} podróży!`,
    importError: (err) => `Błąd importu: ${err}`,

    infoModalTitle: 'Jak działają przepisy Schengen i rezydentury?',
    infoMainPrincipleTitle: '1. Reguła Schengen 90/180 (Dla gości)',
    infoMainPrincipleText:
      'Obywatele państw trzecich w ruchu bezwizowym lub z wizą krótkoterminową C mogą przebywać w strefie Schengen maksymalnie 90 dni w dowolnym 180-dniowym ruchomym oknie (Rozporządzenie UE 2016/399).',
    infoSlidingWindowTitle: '2. Ogólnoeuropejska rezydentura podatkowa (183 dni)',
    infoSlidingWindowText:
      'We wszystkich krajach UE pobyt przez co najmniej 183 dni w roku kalendarzowym w kraju rezydentury gwarantuje status podatkowy i brak problemów z urzędami.',
    infoKeyRulesTitle: '3. Pobyt stały / Rezydent długoterminowy UE (Dyrektywa 2003/109/WE):',
    infoRule1:
      'W przypadku ubiegania się o pobyt stały łączna nieobecność w ciągu 5 lat nie może przekroczyć 10 miesięcy (300 dni), a żaden pojedynczy wyjazd nie może trwać dłużej niż 6 miesięcy.',
    infoRule2:
      'Odzyskiwanie limitu: w miarę upływu 180 dni od dawnej podróży dni te wypadają z ruchomego okna kalkulacji.',
    infoRule3:
      'Wiele profili: możesz prowadzić jeden profil dla swojej rezydentury UE, a inny dla turystycznych podróży członków rodziny.',
    infoOpenSourceBadge: 'Open-Source (Licencja MIT)',

    desktopShortcutsHint: 'Skróty: N — nowa podróż, Esc — zamknij, 1/2/3 — zakładki',
  },

  ru: {
    appTitle: 'Шенген 90/180',
    appSubtitle: 'Калькулятор визы и резиденции',
    backupAndExport: 'Бэкап и данные',
    aboutRule: 'О правиле 90/180 и резиденции',
    addTrip: 'Добавить поездку',
    trip: 'Поездка',

    offlineBadge: 'Офлайн режим',
    onlineBadge: 'Онлайн',
    updateAvailableTitle: 'Доступно обновление!',
    updateNowBtn: 'Обновить приложение',

    profilesTitle: 'Управление профилями',
    addProfile: 'Добавить профиль',
    profileNamePlaceholder: 'Например: Мой TIE / Blue Card, Супруг(а), Ребёнок',
    deleteProfile: 'Удалить профиль',
    cannotDeleteOnlyProfile: 'Нельзя удалить единственный профиль.',
    myPassport: 'Мой паспорт',
    activeProfileLabel: 'Активный профиль',

    profileModeLabel: 'Режим расчёта',
    modeSchengen: '🇪🇺 Гость Шенгена (90/180)',
    modeSchengenDesc: 'Для туристов и краткосрочных поездок без ВНЖ в ЕС (максимум 90 дней за 180-дневный период).',
    modeResident: '🌍 Резидент ЕС и налоги',
    modeResidentDesc:
      'Общеевропейское налоговое резидентство (≥183 дней) и лимиты выездов для обладателей ВНЖ/TIE/Autónomo в любой стране ЕС (Германия, Испания, Франция и др.).',
    homeCountryLabel: 'Страна проживания (государство ЕС)',
    taxTargetDaysLabel: 'Целевое число дней для налогового статуса',

    syncModalTitle: 'Облачная синхронизация Cloudflare',
    syncActiveBadge: 'Синхронизация активна',
    syncDisabledBadge: 'Локальное хранилище',
    syncNowBtn: 'Синхронизировать',
    syncingText: 'Синхронизация с Cloudflare...',
    lastSyncedAt: (time) => `Синхронизировано: ${time}`,
    createSyncKeyBtn: 'Создать ключ синхронизации',
    connectExistingDeviceBtn: 'Подключить существующий ключ',
    enterSyncKeyPlaceholder: 'Вставьте ваш ключ синхронизации (например, vg_...)',
    connectBtn: 'Подключить',
    pairingUrlCopied: 'Ссылка для подключения скопирована!',
    copyPairingLinkBtn: 'Скопировать ссылку для подключения',
    copyKeyBtn: 'Скопировать ключ',
    copiedBtn: 'Скопировано!',
    disconnectSyncBtn: 'Отключить синхронизацию',
    autoSyncToggleTitle: 'Автоматическая синхронизация',
    autoSyncToggleDesc: 'Автоматически отправлять изменения в вашу базу данных Cloudflare D1 при добавлении или редактировании поездок.',
    syncExplainerTitle: 'Подключение устройств без паролей',
    syncExplainerDesc:
      'Ваш уникальный секретный ключ изолирует данные в вашей личной таблице Cloudflare D1. Регистрация и пароли не требуются.',
    syncSetupInstructionsTitle: 'Как подключить второе устройство за 5 секунд:',
    syncSetupInstructionsDesc:
      'Нажмите "Скопировать ссылку для подключения" и откройте её на телефоне или планшете. Все поездки сразу подтянутся.',

    referenceDate: 'Дата расчёта:',
    resetToday: 'Сбросить на сегодня',
    overstayWarningTitle: 'Обнаружен оверстей!',
    overstayWarningDesc: (firstDate) =>
      `В поездках есть превышение правила 90/180 (первое нарушение: ${firstDate || 'неизвестно'}).`,
    daysRemaining: 'Осталось дней',
    of90: 'из 90',
    daysUsed: 'Использовано',
    days: 'дн.',
    last180Days: 'В текущем окне 180 дней',
    quotaUsage: 'Использовано от 90-дневного лимита',
    inSchengen: 'Сейчас в зоне Шенгена',
    outsideSchengen: 'Сейчас вне зоны Шенгена',
    limitExhausted: 'Лимит исчерпан',
    stayPermitted: 'Пребывание разрешено',
    entryPermitted: 'Въезд разрешён',
    continuousStayRemaining: (days) => `Можно непрерывно находиться ещё ${days} дн.`,
    canEnterConsecutively: (days) => `Можно въехать на ${days} дней подряд`,
    recoveryTitle: 'Ближайшие дни возврата лимита:',
    daysGained: (days) => `+${days} дн.`,

    residentHeaderBadge: (countryName) => `Резидент ЕС: ${countryName}`,
    taxYearTitle: (year) => `Налоговый и миграционный год ${year}`,
    daysInCountry: (countryName) => `Дней в стране проживания (${countryName})`,
    daysOutsideCountry: 'Дней за границей (выезды)',
    taxSecuredBadge: 'Налоговый статус ЕС подтверждён (≥183 дн.)',
    taxNotYetSecuredBadge: 'Набор дней до 183 в процессе',
    taxRequirementMet: (target, countryName) =>
      `Условие выполнено! Проведено ≥${target} дней в ${countryName || 'стране проживания'} в этом году (налоговый статус ЕС подтверждён).`,
    taxDaysNeeded: (needed) =>
      `Нужно провести ещё ${needed} дн. в стране проживания для закрепления 183-дневного статуса ЕС.`,
    safeRemainingAbroad: (days) => `Осталось безопасных дней выезда: ${days} дн.`,
    taxLimitExceeded: 'Превышен лимит отсутствия (182 дня) — риск для налогового статуса',
    taxMilestone183: 'Общеевропейский налоговый порог 183 дней',
    abroadTripListTitle: 'Выезды за границу и отсутствие',
    logAbroadTripBtn: 'Записать выезд',
    abroadTripModalTitle: 'Записать выезд за границу',
    abroadTripEditModalTitle: 'Редактировать выезд',
    abroadDuration: (days) => `За границей ${days} дн.`,
    permResidence5YearTitle: 'ПМЖ ЕС (Директива 2003/109/EC — Larga Duración / Niederlassung)',
    permResidence5YearDesc: (used, limit) =>
      `Выездов за последние 5 лет: ${used} из ${limit} разрешённых дней (максимум 10 месяцев).`,
    permResidenceSafe: 'Квота отсутствия для ПМЖ в отличной форме',
    permResidenceWarning: 'Внимание: выезды за 5 лет превышают лимит 300 дней',
    singleTripViolationAlert: 'Внимание: один из выездов длился более 6 месяцев непрерывно.',
    switchToResidentBtn: 'Переключить на Резидент ЕС',
    switchToSchengenBtn: 'Переключить на Шенген 90/180',

    tabTrips: 'Поездки',
    tabPlanner: 'Планировщик',
    tabCalendar: 'Календарь',

    tripsHistoryTitle: 'История и планы поездок',
    noTripsTitle: 'Поездки пока не добавлены',
    noTripsDesc: 'Внесите ваши прошлые поездки или запланируйте будущие для расчета остатка дней.',
    addFirstTrip: 'Добавить первую поездку',
    loadSamples: 'Загрузить примеры поездок',
    plannedBadge: 'План',
    singleDay: '1 день',
    durationDays: (days) => `${days} дн.`,
    editTrip: 'Редактировать поездку',
    deleteTrip: 'Удалить поездку',

    modalNewTripTitle: 'Новая поездка',
    modalEditTripTitle: 'Редактировать поездку',
    entryDateLabel: 'Дата въезда (первый день в Шенгене)',
    exitDateLabel: 'Дата выезда (последний день в Шенгене)',
    titleLabel: 'Название поездки (необязательно)',
    titlePlaceholder: 'Например: Отпуск в Риме, Конференция в Берлине',
    notesLabel: 'Заметки (необязательно)',
    notesPlaceholder: 'Номер рейса, отель, попутчики...',
    plannedCheckboxTitle: 'Запланированная (будущая) поездка',
    plannedCheckboxSubtitle: 'Позволяет спрогнозировать баланс дней без влияния на прошлую историю',
    cancelBtn: 'Отмена',
    saveBtn: 'Сохранить поездку',
    errSelectDates: 'Пожалуйста, укажите даты въезда и выезда.',
    errExitBeforeEntry: 'Дата выезда не может быть раньше даты въезда.',
    maxUsedDuringTrip: (used) => `Пиковое использование квоты за поездку: ${used}/90 дней`,
    overstayAlert: 'Эта поездка приведёт к нарушению правила 90/180!',
    overstayStartsFrom: (date) => `Нарушение начнётся с ${date}`,

    plannerModeEarliest: 'Когда можно ехать?',
    plannerModeCheck: 'Проверить даты',
    earliestSearchTitle: 'Ближайшая дата въезда',
    earliestSearchDesc: 'Находит самую раннюю дату, когда можно въехать на желаемый срок без нарушения правила 90/180.',
    desiredDaysLabel: 'Сколько дней планируете провести в поездке?',
    searchFromDateLabel: 'Искать начиная с даты:',
    tripPossibleTitle: 'ПОЕЗДКА ПОЛНОСТЬЮ РАЗРЕШЕНА!',
    tripPossibleDesc: (duration) => `Длительность: ${duration} дн. подряд без нарушения правила 90/180.`,
    addAsPlanBtn: 'Добавить в планы',
    noDatesFoundTitle: (days) => `Не найдено доступных дат на ${days} дн. в ближайшие 365 дней.`,
    noDatesFoundDesc: 'Попробуйте уменьшить срок поездки или скорректировать пересекающиеся планы.',
    checkDatesTitle: 'Проверить конкретные даты',
    checkDatesDesc: 'Смоделируйте поездку в заданные даты и проверьте соответствие правилу 90/180.',
    tripLegalTitle: 'Поездка легальна! (Лимит до 90 дней соблюдён)',
    tripViolationTitle: 'Поездка приведёт к превышению лимита!',
    violationStartsFrom: (date) => `Превышение лимита начинается с даты ${date}.`,
    selectValidDatesHint: 'Выберите корректные даты (выезд позже или равен въезду)',

    todayBtn: 'Сегодня',
    legendTrip: 'Поездка',
    legendPlan: 'План',
    legendOverstay: 'Оверстей (>90)',
    legendToday: 'Сегодня',
    dayDetailsInSchengen: (title) => `В зоне Шенгена ${title ? `(${title})` : ''}`,
    dayDetailsOutside: 'Вне зоны Шенгена',
    remainingAllowance: (rem) => `Остаток: ${rem} дн.`,

    backupModalTitle: 'Резервное копирование и данные',
    browserPersistenceTitle: 'Защита от очистки браузером',
    browserPersistenceActive: 'Включена (Persistent Storage)',
    browserPersistenceStandard: 'Стандартный кэш',
    enablePersistenceBtn: 'Закрепить в памяти',
    persistenceProtectedBadge: 'Защищено',
    persistenceGrantedToast: 'Защита включена! Браузер не удалит ваши данные при автоматической очистке кэша.',
    persistenceDeniedHint: 'Браузер требует добавить приложение на экран «Домой» (PWA) или в закладки для бессрочного закрепления. Ваши данные уже надёжно сохранены в локальной базе и Cloud Sync.',
    fileBackupSectionTitle: 'Файловый бэкап (JSON)',
    exportFileBtn: 'Экспорт в файл',
    importFileBtn: 'Импорт из файла',
    cloudSyncTitle: 'Облачная синхронизация (Cloudflare D1)',
    cloudSyncDesc:
      'Вы сможете подключить синхронизацию со своим аккаунтом Cloudflare Workers + D1 для мгновенного доступа к поездкам на любых устройствах.',
    dangerZoneClearAll: 'Очистить всю базу поездок',
    dangerZoneConfirmText: 'Удалить абсолютно все поездки? Это действие нельзя отменить.',
    confirmClearAllBtn: 'Да, удалить всё',
    importSuccess: (count) => `Успешно импортировано ${count} поездок!`,
    importError: (err) => `Ошибка импорта: ${err}`,

    infoModalTitle: 'Как работают правила Шенгена и резиденции ЕС?',
    infoMainPrincipleTitle: '1. Правило Шенгена 90/180 (для гостей и туристов)',
    infoMainPrincipleText:
      'Граждане стран с безвизовым режимом или обладатели краткосрочных виз категории C могут находиться в странах Шенгенского соглашения максимум 90 дней в течение любого 180-дневного скользящего периода (Регламент ЕС 2016/399).',
    infoSlidingWindowTitle: '2. Общеевропейское налоговое резидентство (183 дня)',
    infoSlidingWindowText:
      'Во всех странах ЕС (Германия, Испания, Португалия, Франция, Италия и др.) проживание не менее 183 дней в календарном году в стране резиденции гарантирует налоговый статус и отсутствие претензий со стороны налоговых органов (Finanzamt / Hacienda).',
    infoKeyRulesTitle: '3. ПМЖ ЕС (Директива 2003/109/EC):',
    infoRule1:
      'Для бессрочного ПМЖ (Larga Duración / Niederlassungserlaubnis / Daueraufenthalt-EU) суммарное отсутствие в стране за 5 лет не должно превышать 10 месяцев (300 дней), и ни один выезд не должен длиться дольше 6 месяцев подряд.',
    infoRule2:
      'Возврат дней в Шенгене: когда проходит 180 дней с момента давней туристической поездки, эти дни «сгорают» из расчёта, освобождая ваш лимит.',
    infoRule3:
      'Раздельные профили: в нашем приложении вы можете создать один профиль для своего ВНЖ/Автономо в любой стране ЕС, а другой — для туристического шенгенского паспорта родственников.',
    infoOpenSourceBadge: 'Open-Source (MIT License)',

    desktopShortcutsHint: 'Горячие клавиши: N — новая поездка, Esc — закрыть, 1/2/3 — вкладки',
  },
}
