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

  // Status Card
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
    appSubtitle: 'Visa Allowance Calculator',
    backupAndExport: 'Backup & Export',
    aboutRule: 'About 90/180 Rule',
    addTrip: 'Add Trip',
    trip: 'Trip',

    offlineBadge: 'Offline mode',
    onlineBadge: 'Online',
    updateAvailableTitle: 'New version available',
    updateNowBtn: 'Update',

    profilesTitle: 'Profiles & Passports',
    addProfile: 'Add Profile',
    profileNamePlaceholder: 'e.g. Partner, Child, 2nd Passport',
    deleteProfile: 'Delete Profile',
    cannotDeleteOnlyProfile: 'Cannot delete the only profile',
    myPassport: 'My Passport',
    activeProfileLabel: 'Active profile:',

    syncModalTitle: 'Cloudflare Cloud Sync',
    syncActiveBadge: 'Cloud Sync Active',
    syncDisabledBadge: 'Local-Only Mode',
    syncNowBtn: 'Sync Now',
    syncingText: 'Syncing...',
    lastSyncedAt: (time) => `Last synced: ${time}`,
    createSyncKeyBtn: 'Enable Cloud Sync (New Key)',
    connectExistingDeviceBtn: 'Connect Existing Device',
    enterSyncKeyPlaceholder: 'Paste your secret sync key (e.g. vg_...)',
    connectBtn: 'Connect',
    pairingUrlCopied: 'Pairing link copied to clipboard!',
    copyPairingLinkBtn: 'Copy Pairing Link',
    copyKeyBtn: 'Copy Key',
    copiedBtn: 'Copied!',
    disconnectSyncBtn: 'Disconnect Cloud Sync',
    autoSyncToggleTitle: 'Automatic Synchronization',
    autoSyncToggleDesc: 'Automatically sync changes to Cloudflare D1 when trips are modified.',
    syncExplainerTitle: 'Private Multi-Device Sync',
    syncExplainerDesc:
      'Sync all your devices without accounts or passwords. Data is secured by your high-entropy sync key and stored in your Cloudflare D1 serverless database.',
    syncSetupInstructionsTitle: 'Cloudflare D1 Setup Guide',
    syncSetupInstructionsDesc:
      'To host this on your Cloudflare account, run: npx wrangler d1 create schengen-db and add the binding DB in wrangler.toml or Cloudflare Dashboard.',

    referenceDate: 'Reference Date:',
    resetToday: 'Reset to today',
    overstayWarningTitle: 'Overstay detected!',
    overstayWarningDesc: (firstDate) =>
      `Trip records contain stays exceeding the 90/180 rule limit${firstDate ? ` (first violation on ${firstDate})` : ''}.`,
    daysRemaining: 'Days Remaining',
    of90: 'of 90',
    daysUsed: 'Days Used',
    days: 'days',
    last180Days: 'In the rolling 180-day window',
    quotaUsage: '90-day quota consumed',
    inSchengen: 'Currently in Schengen Area',
    outsideSchengen: 'Currently outside Schengen',
    limitExhausted: 'Allowance Exhausted',
    stayPermitted: 'Stay Permitted',
    entryPermitted: 'Entry Allowed',
    continuousStayRemaining: (days) => `Continuous stay left: ${days} days`,
    canEnterConsecutively: (days) => `Can enter for ${days} consecutive days`,
    recoveryTitle: 'Upcoming allowance recoveries:',
    daysGained: (days) => `+${days} days`,

    tabTrips: 'Trips',
    tabPlanner: 'Planner',
    tabCalendar: 'Calendar',

    tripsHistoryTitle: 'Trip History & Plans',
    noTripsTitle: 'No trips added yet',
    noTripsDesc: 'Add your past Schengen stays or plan future visits to compute your exact remaining allowance.',
    addFirstTrip: 'Add first trip',
    loadSamples: 'Load sample trips',
    plannedBadge: 'Planned',
    singleDay: 'Single day',
    durationDays: (days) => `${days} ${days === 1 ? 'day' : 'days'}`,
    editTrip: 'Edit trip',
    deleteTrip: 'Delete trip',

    modalNewTripTitle: 'New Schengen Trip',
    modalEditTripTitle: 'Edit Trip',
    entryDateLabel: 'Entry Date (inclusive)',
    exitDateLabel: 'Exit Date (inclusive)',
    titleLabel: 'Trip Title / Country (optional)',
    titlePlaceholder: 'e.g. Italy, Rome or Business Trip',
    notesLabel: 'Notes (optional)',
    notesPlaceholder: 'Flight, hotel, purpose of visit...',
    plannedCheckboxTitle: 'Planned Trip',
    plannedCheckboxSubtitle: 'Mark as a tentative future plan rather than an actual completed visit',
    cancelBtn: 'Cancel',
    saveBtn: 'Save',
    errSelectDates: 'Please specify both entry and exit dates',
    errExitBeforeEntry: 'Exit date cannot be before entry date',
    maxUsedDuringTrip: (used) => `Peak usage: ${used}/90 days`,
    overstayAlert: 'Overstay detected (>90 days)!',
    overstayStartsFrom: (date) => `Overstay starts from ${date}.`,

    plannerModeEarliest: 'When can I travel?',
    plannerModeCheck: 'Check my dates',
    earliestSearchTitle: 'Earliest Available Entry Date',
    earliestSearchDesc: 'Finds the nearest date you can enter for your desired stay without violating the 90/180 rule.',
    desiredDaysLabel: 'How many days do you want to stay?',
    searchFromDateLabel: 'Search starting from date:',
    tripPossibleTitle: 'Trip is fully compliant!',
    tripPossibleDesc: (duration) =>
      `Duration: ${duration} consecutive days without any 90/180 rule violation.`,
    addAsPlanBtn: 'Add to planned trips',
    noDatesFoundTitle: (days) => `Cannot stay for ${days} continuous days in the next 365 days`,
    noDatesFoundDesc: 'Try reducing the requested duration or review earlier trip dates.',
    checkDatesTitle: 'Validate Specific Travel Dates',
    checkDatesDesc: 'Enter proposed entry and exit dates to check compliance.',
    tripLegalTitle: 'Trip is legal & compliant',
    tripViolationTitle: 'Violation of the 90/180 rule!',
    violationStartsFrom: (date) => `Rule violation begins on ${date}.`,
    selectValidDatesHint: 'Please choose valid dates (exit date on or after entry date)',

    todayBtn: 'Today',
    legendTrip: 'Trip',
    legendPlan: 'Plan',
    legendOverstay: 'Overstay (>90)',
    legendToday: 'Today',
    dayDetailsInSchengen: (title) => `In Schengen area ${title ? `(${title})` : ''}`,
    dayDetailsOutside: 'Outside Schengen area',
    remainingAllowance: (rem) => `Remaining: ${rem} days`,

    backupModalTitle: 'Backup & Data Management',
    browserPersistenceTitle: 'Browser Eviction Protection',
    browserPersistenceActive: 'Enabled (Persistent Storage)',
    browserPersistenceStandard: 'Standard cache storage',
    enablePersistenceBtn: 'Enable Persistent Storage',
    persistenceProtectedBadge: 'Protected',
    fileBackupSectionTitle: 'JSON File Backup',
    exportFileBtn: 'Export to JSON',
    importFileBtn: 'Import from JSON',
    cloudSyncTitle: 'Cloudflare D1 Cloud Sync',
    cloudSyncDesc:
      'Connect your own Cloudflare Workers & D1 database to securely sync your trips across all your devices.',
    dangerZoneClearAll: 'Clear all trips database',
    dangerZoneConfirmText: 'Delete absolutely all trips? This action cannot be undone.',
    confirmClearAllBtn: 'Yes, delete all',
    importSuccess: (count) => `Successfully imported ${count} trips!`,
    importError: (err) => `Import error: ${err}`,

    infoModalTitle: 'How the 90/180 Rule Works',
    infoMainPrincipleTitle: 'Core Principle',
    infoMainPrincipleText:
      'Non-EU citizens on short-stay visas (Category C) or visa-free regimes may spend a maximum of 90 days in the Schengen area within any rolling 180-day window (EU Regulation 2016/399).',
    infoSlidingWindowTitle: 'What is a "rolling/sliding window"?',
    infoSlidingWindowText:
      'The 180-day window is not fixed to calendar halves or quarters. For every single day of your stay, border control counts backward exactly 180 days. In that 180-day interval, your total stay days must never exceed 90.',
    infoKeyRulesTitle: 'Crucial Calculation Rules:',
    infoRule1:
      'Both entry and exit dates count as full days of stay, even if entering at 23:59 or departing at 00:01.',
    infoRule2:
      'Days naturally restore when an older trip passes past the 180-day lookback threshold.',
    infoRule3:
      'Stays under national long-stay visas (Type D) or residence permits do not consume Schengen short-stay days.',
    infoOpenSourceBadge: 'Open-Source (MIT License)',

    desktopShortcutsHint: 'Shortcuts: N — new trip, Esc — close modal, 1/2/3 — switch views',
  },

  ru: {
    appTitle: 'Шенген 90/180',
    appSubtitle: 'Калькулятор визовых дней',
    backupAndExport: 'Резервное копирование',
    aboutRule: 'Как работает правило 90/180',
    addTrip: 'Добавить поездку',
    trip: 'Поездка',

    offlineBadge: 'Офлайн режим',
    onlineBadge: 'Онлайн',
    updateAvailableTitle: 'Доступна новая версия',
    updateNowBtn: 'Обновить',

    profilesTitle: 'Профили и паспорта',
    addProfile: 'Добавить профиль',
    profileNamePlaceholder: 'Например: Супруг(а), Ребенок, Второй паспорт',
    deleteProfile: 'Удалить профиль',
    cannotDeleteOnlyProfile: 'Нельзя удалить единственный профиль',
    myPassport: 'Мой паспорт',
    activeProfileLabel: 'Активный профиль:',

    syncModalTitle: 'Облачная синхронизация Cloudflare',
    syncActiveBadge: 'Синхронизация активна',
    syncDisabledBadge: 'Локальный режим',
    syncNowBtn: 'Синхронизировать сейчас',
    syncingText: 'Синхронизация...',
    lastSyncedAt: (time) => `Посл. синхронизация: ${time}`,
    createSyncKeyBtn: 'Включить синхронизацию (Новый ключ)',
    connectExistingDeviceBtn: 'Подключить существующее устройство',
    enterSyncKeyPlaceholder: 'Вставьте ваш секретный ключ (например, vg_...)',
    connectBtn: 'Подключить',
    pairingUrlCopied: 'Ссылка для подключения скопирована!',
    copyPairingLinkBtn: 'Скопировать ссылку сопряжения',
    copyKeyBtn: 'Скопировать ключ',
    copiedBtn: 'Скопировано!',
    disconnectSyncBtn: 'Отключить облачную синхронизацию',
    autoSyncToggleTitle: 'Автоматическая синхронизация',
    autoSyncToggleDesc: 'Автоматически синхронизировать изменения с Cloudflare D1 при редактировании поездок.',
    syncExplainerTitle: 'Приватная синхронизация без паролей',
    syncExplainerDesc:
      'Синхронизируйте телефон, планшет и ноутбук без регистрации и почты. Доступ защищен криптографическим ключом сопряжения в базе Cloudflare D1.',
    syncSetupInstructionsTitle: 'Инструкция по настройке Cloudflare D1',
    syncSetupInstructionsDesc:
      'Для собственного хостинга создайте базу: npx wrangler d1 create schengen-db и привяжите DB в wrangler.toml или в панели Cloudflare.',

    referenceDate: 'Контрольная дата:',
    resetToday: 'Вернуть сегодня',
    overstayWarningTitle: 'Зафиксировано превышение лимита!',
    overstayWarningDesc: (firstDate) =>
      `В истории поездок есть дни с превышением правила 90/180${firstDate ? ` (первое нарушение: ${firstDate})` : ''}.`,
    daysRemaining: 'Осталось дней',
    of90: 'из 90',
    daysUsed: 'Использовано',
    days: 'дней',
    last180Days: 'За последние 180 дней',
    quotaUsage: 'Заполненность 90-дневного лимита',
    inSchengen: 'Сейчас в зоне Шенгена',
    outsideSchengen: 'Сейчас вне зоны Шенгена',
    limitExhausted: 'Лимит исчерпан',
    stayPermitted: 'Пребывание разрешено',
    entryPermitted: 'Въезд открыт',
    continuousStayRemaining: (days) => `Непрерывно еще: ${days} дн.`,
    canEnterConsecutively: (days) => `Можно въехать на ${days} дн. подряд`,
    recoveryTitle: 'Когда начнут возвращаться дни:',
    daysGained: (days) => `+${days} дн.`,

    tabTrips: 'Поездки',
    tabPlanner: 'Планировщик',
    tabCalendar: 'Календарь',

    tripsHistoryTitle: 'История и планы поездок',
    noTripsTitle: 'Пока нет добавленных поездок',
    noTripsDesc: 'Добавьте прошлые поездки в страны Шенгена или запланируйте будущие, чтобы рассчитать доступные дни.',
    addFirstTrip: 'Добавить первую поездку',
    loadSamples: 'Загрузить примеры',
    plannedBadge: 'План',
    singleDay: 'Один день',
    durationDays: (days) => `${days} дн.`,
    editTrip: 'Редактировать',
    deleteTrip: 'Удалить',

    modalNewTripTitle: 'Новая поездка в Шенген',
    modalEditTripTitle: 'Редактировать поездку',
    entryDateLabel: 'Дата въезда (включ.)',
    exitDateLabel: 'Дата выезда (включ.)',
    titleLabel: 'Название / Страна (необязательно)',
    titlePlaceholder: 'Например: Италия, Рим или Деловая поездка',
    notesLabel: 'Заметки (необязательно)',
    notesPlaceholder: 'Отель, перелет, цель визита...',
    plannedCheckboxTitle: 'Запланированная поездка',
    plannedCheckboxSubtitle: 'Отметьте, если это ещё не свершившаяся поездка',
    cancelBtn: 'Отмена',
    saveBtn: 'Сохранить',
    errSelectDates: 'Укажите дату въезда и выезда',
    errExitBeforeEntry: 'Дата выезда не может быть раньше даты въезда',
    maxUsedDuringTrip: (used) => `Макс. использовано: ${used}/90`,
    overstayAlert: 'Превышение 90 дней!',
    overstayStartsFrom: (date) => `Лимит будет превышен начиная с даты ${date}.`,

    plannerModeEarliest: 'Когда можно поехать?',
    plannerModeCheck: 'Проверить мои даты',
    earliestSearchTitle: 'Поиск ближайшей доступной даты',
    earliestSearchDesc: 'Калькулятор найдёт день, когда лимит позволит совершить поездку без нарушений.',
    desiredDaysLabel: 'Сколько дней хотите пробыть?',
    searchFromDateLabel: 'Искать начиная с даты:',
    tripPossibleTitle: 'Поездка возможна!',
    tripPossibleDesc: (duration) =>
      `Длительность: ${duration} дней подряд без каких-либо нарушений правила 90/180.`,
    addAsPlanBtn: 'Добавить в запланированные поездки',
    noDatesFoundTitle: (days) => `В ближайшие 365 дней невозможно непрерывно провести ${days} дней`,
    noDatesFoundDesc: 'Попробуйте уменьшить желаемое количество дней или проверьте существующие поездки.',
    checkDatesTitle: 'Проверка конкретных дат',
    checkDatesDesc: 'Укажите планируемые даты въезда и выезда для проверки соответствия.',
    tripLegalTitle: 'Поездка легальна',
    tripViolationTitle: 'Нарушение правила 90/180!',
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

    infoModalTitle: 'Как работает правило 90/180?',
    infoMainPrincipleTitle: 'Основной принцип',
    infoMainPrincipleText:
      'Граждане стран с безвизовым режимом или обладатели краткосрочных виз категории C могут находиться в странах Шенгенского соглашения максимум 90 дней в течение любого 180-дневного скользящего периода (Регламент ЕС 2016/399).',
    infoSlidingWindowTitle: 'Что такое «скользящий период»?',
    infoSlidingWindowText:
      'Период не привязан к календарным полугодиям. В каждый отдельный день вашего нахождения в Шенгене пограничник отсчитывает ровно 180 дней назад. В этом отрезке сумма дней не должна превышать 90.',
    infoKeyRulesTitle: 'Важные правила подсчёта:',
    infoRule1:
      'День въезда и день выезда: оба дня считаются полными днями пребывания в Шенгене, даже если вы прилетели в 23:55 или улетели в 00:05.',
    infoRule2:
      'Возврат дней: когда проходит 180 дней с момента давней поездки, эти дни «сгорают» из расчёта, и ваш доступный лимит восстанавливается.',
    infoRule3:
      'Национальные визы D и ВНЖ: дни пребывания по виду на жительство или визе типа D конкретной страны не засчитываются в лимит 90/180 шенгенских краткосрочных поездок.',
    infoOpenSourceBadge: 'Open-Source (MIT License)',

    desktopShortcutsHint: 'Горячие клавиши: N — новая поездка, Esc — закрыть, 1/2/3 — вкладки',
  },
}
