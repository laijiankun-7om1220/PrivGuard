export type Locale = 'zh-CN' | 'en-US';

export interface TranslationKeys {
  // Header
  header: {
    home: string;
    detect: string;
    help: string;
    personalCenter: string;
    login: string;
    register: string;
    logout: string;
    welcome: string;
  };
  // Home
  home: {
    title: string;
    subtitle: string;
    description: string;
    startDetection: string;
    learnMore: string;
    stats: {
      appsDetected: string;
      accuracy: string;
      timeSaved: string;
      speed: string;
      seconds: string;
    };
    whyChooseUs: string;
    features: {
      fastDetection: {
        title: string;
        description: string;
      };
      accurateRecognition: {
        title: string;
        description: string;
      };
      detailedReport: {
        title: string;
        description: string;
      };
      secure: {
        title: string;
        description: string;
      };
    };
    stepsTitle: string;
    steps: {
      fillInfo: {
        title: string;
        description: string;
      };
      selectDimensions: {
        title: string;
        description: string;
      };
      uploadFile: {
        title: string;
        description: string;
      };
      viewReport: {
        title: string;
        description: string;
      };
    };
  };
  // Auth
  auth: {
    login: {
      title: string;
      username: string;
      password: string;
      submit: string;
      switchToRegister: string;
      remember: string;
      usernamePlaceholder: string;
      passwordPlaceholder: string;
      usernameRequired: string;
      passwordRequired: string;
      loginSuccess: string;
      userNotRegistered: string;
      wrongCredentials: string;
    };
    register: {
      title: string;
      username: string;
      password: string;
      confirmPassword: string;
      phone: string;
      code: string;
      submit: string;
      switchToLogin: string;
      usernamePlaceholder: string;
      phonePlaceholder: string;
      codePlaceholder: string;
      passwordPlaceholder: string;
      confirmPasswordPlaceholder: string;
      sendCode: string;
      resendCode: string;
      usernameRequired: string;
      phoneRequired: string;
      codeRequired: string;
      passwordRequired: string;
      confirmPasswordRequired: string;
      phoneInputFirst: string;
      codeSent: string;
      registerSuccess: string;
      registerFailed: string;
    };
  };
  // Detect
  detect: {
    steps: {
      info: { title: string; description: string };
      upload: { title: string; description: string };
      options: { title: string; description: string };
      result: { title: string; description: string };
    };
    modelSelector: string;
    softwareInfo: {
      title: string;
      name: string;
      category: string;
      titleLabel: string;
      description: string;
      submit: string;
      namePlaceholder: string;
      categoryPlaceholder: string;
      titlePlaceholder: string;
      descriptionPlaceholder: string;
      nameRequired: string;
      categoryRequired: string;
      titleRequired: string;
      descriptionRequired: string;
    };
    fileUpload: {
      title: string;
      uploadFile: string;
      pasteText: string;
      uploadHint: string;
      fileFormats: string;
      textPlaceholder: string;
      uploadSuccess: string;
      uploadError: string;
      fileParseError: string;
    };
    options: {
      title: string;
      selectAll: string;
      submit: string;
      back: string;
    };
    result: {
      title: string;
      summary: string;
      back: string;
    };
    actions: {
      next: string;
      back: string;
      uploadFileFirst: string;
      inputTextFirst: string;
      uploadContentFirst: string;
      detecting: string;
      detectComplete: string;
      detectFailed: string;
    };
  };
  // Personal Center
  personalCenter: {
    history: string;
    userInfoLabel: string;
    defaultUser: string;
    adminRole: string;
    userRole: string;
    totalDetections: string;
    monthlyDetections: string;
    recentDetections: string;
    passRate: string;
    detectionHistory: {
      title: string;
      softwareName: string;
      category: string;
      aiModel: string;
      detectTime: string;
      actions: string;
      viewDetail: string;
      export: string;
      delete: string;
      noData: string;
      exportSuccess: string;
      exportFailed: string;
      deleteConfirm: string;
      deleteSuccess: string;
      deleteFailed: string;
      detailTitle: string;
      detailItem: string;
      detailStatus: string;
      detailPassed: string;
      detailFailed: string;
      detailNotDetected: string;
      detailLoading: string;
      detailNoResult: string;
      loadFailed: string;
      loadResultFailed: string;
      resultNotFound: string;
      close: string;
      deleteConfirmTitle: string;
      deleteConfirmMessage: string;
      paginationTotal: string;
    };
    userInfo: {
      title: string;
      username: string;
      phone: string;
      email: string;
      password: string;
      update: string;
      reset: string;
      updateSuccess: string;
      updateFailed: string;
      noChanges: string;
      passwordPlaceholder: string;
      emailInvalid: string;
      basicInfo: string;
      securitySettings: string;
      passwordHint: string;
      noEmail: string;
    };
  };
  // Common
  common: {
    loading: string;
    confirm: string;
    cancel: string;
    delete: string;
    submit: string;
    reset: string;
  };
  // Help
  help: {
    title: string;
    subtitle: string;
    content: Array<{ title: string; desc: string }>;
  };
  // Constants
  constants: {
    softwareCategories: string[];
    detectOptions: Array<{ key: string; label: string }>;
    aiDetectCategories: Array<{ key: string; name: string; description: string }>;
    aiModels: Array<{ value: string; label: string; description: string }>;
  };
}

export type Translations = {
  [K in Locale]: TranslationKeys;
};
