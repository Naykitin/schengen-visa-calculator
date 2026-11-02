export type Language = 'en' | 'ru'

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
    logAbroadTripBtn: '+ Log Trip Abroad',
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
  ru: {
    appTitle: 'Шенген 90/180',
    appSubtitle: 'Калькулятор визы и резиденции',
    backupAndExport: 'Бэкап и данные',
    aboutRule: 'О правиле 90/180 и резиденции',
    addTrip: 'Добавить поездку',
    trip: 'Поездка',

    offlineBadge: 'Офлайн режим',
    onlineBadge: 'В сети',
    updateAvailableTitle: 'Доступно обновление!',
    updateNowBtn: 'Обновить сейчас',

    profilesTitle: 'Управление профилями',
    addProfile: 'Добавить профиль',
    profileNamePlaceholder: 'Например: ВНЖ / Blue Card / Autónomo, Супруг, Ребёнок',
    deleteProfile: 'Удалить профиль',
    cannotDeleteOnlyProfile: 'Нельзя удалить единственный профиль.',
    myPassport: 'Мой паспорт',
    activeProfileLabel: 'Текущий профиль',

    profileModeLabel: 'Режим расчёта',
    modeSchengen: '🇪🇺 Гость Шенгена (90/180)',
    modeSchengenDesc: 'Для туристов и визитёров без ВНЖ ЕС (максимум 90 дней за скользящие 180 дней).',
    modeResident: '🌍 Резидент ЕС и налоги (183 дня)',
    modeResidentDesc:
      'Общеевропейское налоговое резидентство (≥183 дней) и лимиты выездов для обладателей ВНЖ/ПМЖ в любой стране ЕС (Германия, Испания, Португалия, Франция, Италия и др.).',
    homeCountryLabel: 'Страна постоянного проживания (страна ЕС)',
    taxTargetDaysLabel: 'Дней для налогового резидентства',

    syncModalTitle: 'Облачная синхронизация Cloudflare',
    syncActiveBadge: 'Синхронизация активна',
    syncDisabledBadge: 'Локальное хранилище',
    syncNowBtn: 'Синхронизировать сейчас',
    syncingText: 'Синхронизация с Cloudflare...',
    lastSyncedAt: (time) => `Последняя синхронизация: ${time}`,
    createSyncKeyBtn: 'Сгенерировать новый ключ',
    connectExistingDeviceBtn: 'Подключить существующий ключ',
    enterSyncKeyPlaceholder: 'Вставьте ваш ключ синхронизации (vg_...)',
    connectBtn: 'Подключить',
    pairingUrlCopied: 'Ссылка для сопряжения скопирована!',
    copyPairingLinkBtn: 'Скопировать ссылку сопряжения в 1 клик',
    copyKeyBtn: 'Скопировать ключ',
    copiedBtn: 'Скопировано!',
    disconnectSyncBtn: 'Отключить синхронизацию',
    autoSyncToggleTitle: 'Автоматическая синхронизация',
    autoSyncToggleDesc:
      'Автоматически отправлять изменения в вашу базу данных Cloudflare D1 при добавлении или редактировании поездок.',
    syncExplainerTitle: 'Облачное сопряжение без паролей',
    syncExplainerDesc:
      'Анонимный криптографический ключ изолирует ваши данные в персональной базе Cloudflare D1. Никаких паролей и логинов.',
    syncSetupInstructionsTitle: 'Как подключить второй телефон за 5 секунд:',
    syncSetupInstructionsDesc:
      'Нажмите «Скопировать ссылку сопряжения в 1 клик» и откройте её на смартфоне или планшете. Все устройства мгновенно свяжутся.',

    referenceDate: 'Дата расчёта:',
    resetToday: 'Сбросить на сегодня',
    overstayWarningTitle: 'Обнаружен оверстей!',
    overstayWarningDesc: (firstDate) =>
      `В журнале поездок зафиксировано превышение лимита 90/180 (первое нарушение: ${firstDate || 'неизвестно'}).`,
    daysRemaining: 'Осталось дней',
    of90: 'из 90',
    daysUsed: 'Использовано',
    days: 'дн.',
    last180Days: 'В текущем 180-дневном окне',
    quotaUsage: 'Израсходовано от квоты 90 дней',
    inSchengen: 'Сейчас в Шенгене',
    outsideSchengen: 'Сейчас вне Шенгена',
    limitExhausted: 'Лимит исчерпан',
    stayPermitted: 'Пребывание разрешено',
    entryPermitted: 'Въезд разрешён',
    continuousStayRemaining: (days) => `Можно непрерывно находиться ещё ${days} дн.`,
    canEnterConsecutively: (days) => `Можно въехать на ${days} дн. подряд`,
    recoveryTitle: 'Ближайшие дни возврата лимита:',
    daysGained: (days) => `+${days} дн.`,

    residentHeaderBadge: (countryName) => `Резидент ЕС: ${countryName}`,
    taxYearTitle: (year) => `Налоговый год ЕС ${year}`,
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
    logAbroadTripBtn: '+ Записать выезд',
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
