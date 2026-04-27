import { z } from 'zod'

const languageSchema = z.object({
  name: z.string({ message: 'Language name is required' }),
  mdBadge: z.string({ message: 'Markdown badge is required' }),
  icon: z.string({ message: 'Icon is required' }),
})

const linkSchema = z.object({
  name: z.string({ message: 'Link name is required' }),
  url: z.string({ message: 'URL is required' }),
  mdBadge: z.string({ message: 'Markdown badge is required' }),
  icon: z.string({ message: 'Icon is required' }),
})

const skillsSchema = z.object({
  name: z.string({ message: 'Skill name is required' }),
  mdBadge: z.string({ message: 'Markdown badge is required' }),
  icon: z.string({ message: 'Icon is required' }),
})

const ListSchema = z.object({
  title: z.string({ message: 'List title is required' }),
  items: z.array(
    z.object({
      highlight: z.string({ message: 'Highlight is required' }),
      description: z.string({ message: 'Description is required' }),
    }),
  ),
})

const experienceSchema = z.object({
  company: z.string({ message: 'Company is required' }),
  position: z.string({ message: 'Position is required' }),
  img: z.string({ message: 'Image is required' }),
  web: z.string({ message: 'Web is required' }),
  date: z.string({ message: 'Date is required' }),
  links: z.array(linkSchema),
  description: z.string({ message: 'Description is required' }),
  list: ListSchema,
  skills: z.array(skillsSchema),
})

const projectSchema = z.object({
  name: z.string({ message: 'Project name is required' }),
  img: z.string({ message: 'Image is required' }),
  web: z.string({ message: 'Web is required' }),
  links: z.array(linkSchema),
  description: z.string({ message: 'Description is required' }),
  list: ListSchema,
  skills: z.array(skillsSchema),
})

const educationSchema = z.object({
  name: z.string({ message: 'Institution name is required' }),
  degree: z.string({ message: 'Degree is required' }),
  img: z.string({ message: 'Image is required' }),
  date: z.string({ message: 'Date is required' }),
  links: z.array(linkSchema),
  list: ListSchema,
})

const certificationSchema = z.object({
  name: z.string({ message: 'Certification name is required' }),
  url: z.string({ message: 'URL is required' }),
  list: ListSchema,
  skills: z.array(skillsSchema),
})

export const devsyncSchema = z.object({
  jobTitle: z.string({ message: 'Job title is required' }),
  name: z.string({ message: 'Name is required' }),
  description: z.string({ message: 'Description is required' }),
  img: z.string({ message: 'Image is required' }),
  status: z.object({
    status: z.string({ message: 'Status is required' }),
    badge: z.string({ message: 'Badge is required' }),
  }),
  githubUserName: z.string({ message: 'GitHub username is required' }),
  socialMedia: z.array(linkSchema),
  languages: z.array(languageSchema),
  experience: z.array(experienceSchema),
  projects: z.array(projectSchema),
  education: z.array(educationSchema),
  certifications: z.array(certificationSchema),
})

export type Link = z.infer<typeof linkSchema>
export type Skills = z.infer<typeof skillsSchema>
export type ListSchema = z.infer<typeof ListSchema>
export type Devsync = z.infer<typeof devsyncSchema>
export const devsyncSchemaPartial = devsyncSchema.partial()
export type DevsyncPartial = z.infer<typeof devsyncSchemaPartial>

export const parseDevsync = (devsync: unknown): DevsyncPartial =>
  devsyncSchemaPartial.parse(devsync)
