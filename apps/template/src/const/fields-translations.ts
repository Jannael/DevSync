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
  },
} as const

export type availableLangsType = keyof typeof translations
export const availableLangs = Object.keys(translations)
