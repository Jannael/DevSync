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
} as const

export type availableLangsType = keyof typeof translations
export const availableLangs = Object.keys(translations)

export const localeMap: Record<availableLangsType, string> = {
  en: 'en_US',
  es: 'es_ES',
} as const
export const ogLocale = (lang: string) => localeMap[lang as keyof typeof localeMap] ?? 'en_US'
