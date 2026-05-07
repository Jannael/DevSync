//  cSpell:disable

export const translations = {
  en: {
    Description: 'Description',
    jobTitle: 'Job Title',
    Status: 'Status',
    Languages: 'Languages',
    'Professional Experience': 'Professional Experience',
    Projects: 'Projects',
    Education: 'Education',
    Certifications: 'Certifications',
    'Core Skills': 'Core Skills',
    credential: 'Credential',

    academics: 'Academics',
    'View Certificate': 'View Certificate',
    'Selected projects': 'Selected projects',
    "Let's connect": "Let's connect",
    'Github Profile': 'Github Profile',
    'I am': 'I am',
    Links: 'Links',
  },
  es: {
    Description: 'Descripción',
    jobTitle: 'Puesto',
    Status: 'Estado',
    Languages: 'Idiomas',
    'Professional Experience': 'Experiencia profesional',
    Projects: 'Proyectos',
    Education: 'Educación',
    Certifications: 'Certificaciones',
    'Core Skills': 'Habilidades principales',
    credential: 'Credencial',

    academics: 'Historial académico',
    'View Certificate': 'Ver certificado',
    'Selected projects': 'Proyectos destacados',
    "Let's connect": 'Conectemos',
    'Github Profile': 'Perfil de Github',
    'I am': 'Soy',
    Links: 'Enlaces',
  },
  fr: {
    Description: 'Description',
    jobTitle: 'Titre du poste',
    Status: 'Statut',
    Languages: 'Langues',
    'Professional Experience': 'Expérience professionnelle',
    Projects: 'Projets',
    Education: 'Éducation',
    Certifications: 'Certifications',
    'Core Skills': 'Compétences essentielles',
    credential: 'Titre de compétence',

    academics: 'Historique académique',
    'View Certificate': 'Voir le certificat',
    'Selected projects': 'Projets sélectionnés',
    "Let's connect": 'Connectons-nous',
    'Github Profile': 'Profil GitHub',
    'I am': 'Je suis',
    Links: 'Liens',
  },
  pt: {
    Description: 'Descrição',
    jobTitle: 'Cargo',
    Status: 'Estado',
    Languages: 'Idiomas',
    'Professional Experience': 'Experiência profissional',
    Projects: 'Projetos',
    Education: 'Educação',
    Certifications: 'Certificações',
    'Core Skills': 'Habilidades principais',
    credential: 'Credencial',

    academics: 'Formação acadêmica',
    'View Certificate': 'Ver certificado',
    'Selected projects': 'Projetos selecionados',
    "Let's connect": 'Vamos nos conectar',
    'Github Profile': 'Perfil do Github',
    'I am': 'Sou',
    Links: 'Links',
  },
  de: {
    Description: 'Beschreibung',
    jobTitle: 'Berufsbezeichnung',
    Status: 'Status',
    Languages: 'Sprachen',
    'Professional Experience': 'Berufserfahrung',
    Projects: 'Projekte',
    Education: 'Ausbildung',
    Certifications: 'Zertifizierungen',
    'Core Skills': 'Kernkompetenzen',
    credential: 'Zertifikat',

    academics: 'Akademischer Werdegang',
    'View Certificate': 'Zertifikat ansehen',
    'Selected projects': 'Ausgewählte Projekte',
    "Let's connect": 'Lass uns vernetzen',
    'Github Profile': 'Github-Profil',
    'I am': 'Ich bin',
    Links: 'Links',
  },
  zh: {
    Description: '描述',
    jobTitle: '职位',
    Status: '状态',
    Languages: '语言',
    'Professional Experience': '工作经验',
    Projects: '项目',
    Education: '教育',
    Certifications: '证书',
    'Core Skills': '核心技能',
    credential: '资质',

    academics: '学术经历',
    'View Certificate': '查看证书',
    'Selected projects': '精选项目',
    "Let's connect": '让我们联系',
    'Github Profile': 'Github 主页',
    'I am': '我是',
    Links: '链接',
  },
  ja: {
    Description: '概要',
    jobTitle: '職種',
    Status: 'ステータス',
    Languages: '言語',
    'Professional Experience': '職務経験',
    Projects: 'プロジェクト',
    Education: '学歴',
    Certifications: '資格',
    'Core Skills': 'コアスキル',
    credential: '資格証明',

    academics: '学歴詳細',
    'View Certificate': '証明書を見る',
    'Selected projects': '主なプロジェクト',
    "Let's connect": 'つながりましょう',
    'Github Profile': 'Githubプロフィール',
    'I am': '私は',
    Links: 'リンク',
  },
  ko: {
    Description: '설명',
    jobTitle: '직함',
    Status: '상태',
    Languages: '언어',
    'Professional Experience': '경력',
    Projects: '프로젝트',
    Education: '학력',
    Certifications: '자격증',
    'Core Skills': '핵심 역량',
    credential: '자격 증명',

    academics: '학력 사항',
    'View Certificate': '자격증 보기',
    'Selected projects': '주요 프로젝트',
    "Let's connect": '연결해요',
    'Github Profile': 'Github 프로필',
    'I am': '저는',
    Links: '링크',
  },
} as const

export type availableLangsType = keyof typeof translations
export const availableLangs = Object.keys(translations)

export const localeMap: Record<availableLangsType, string> = {
  en: 'en_US', // english
  es: 'es_ES', // spanish
  fr: 'fr_FR', // french
  pt: 'pt_PT', // portuguese
  de: 'de_DE', // german
  zh: 'zh_CN', // chinese
  ja: 'ja_JP', // japanese
  ko: 'ko_KR', // korean
} as const
export const ogLocale = (lang: string) => localeMap[lang as keyof typeof localeMap] ?? 'en_US'
