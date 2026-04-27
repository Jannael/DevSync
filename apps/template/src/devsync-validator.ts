import { z } from 'zod'

const languageSchema = z.object({
  name: z.string(),
  mdBadge: z.string(),
  icon: z.string(),
})

const linkSchema = z.object({
  name: z.string(),
  url: z.string(),
  mdBadge: z.string(),
  icon: z.string(),
})

const skillsSchema = z.object({
  name: z.string(),
  mdBadge: z.string(),
  icon: z.string(),
})

const listItemSchema = z.object({
  title: z.string(),
  description: z.string(),
})

const experienceSchema = z.object({
  company: z.string(),
  position: z.string(),
  img: z.string(),
  imgLink: z.string(),
  date: z.string(),
  links: z.array(linkSchema),
  description: z.string(),
  listName: z.string(),
  list: z.array(listItemSchema),
  skills: z.array(skillsSchema),
})

const projectSchema = z.object({
  name: z.string(),
  img: z.string(),
  imgLink: z.string(),
  links: z.array(linkSchema),
  description: z.string(),
  listName: z.string(),
  list: z.array(listItemSchema),
  skills: z.array(skillsSchema),
})

const educationSchema = z.object({
  name: z.string(),
  degree: z.string(),
  img: z.string(),
  date: z.string(),
  links: z.array(linkSchema),
  listName: z.string(),
  list: z.array(listItemSchema),
})

const certificationSchema = z.object({
  name: z.string(),
  url: z.string(),
  listName: z.string(),
  list: z.array(listItemSchema),
  skills: z.array(skillsSchema),
})

export const devsyncSchema = z.object({
  title: z.string(),
  name: z.string(),
  description: z.string(),
  img: z.string(),
  status: z.object({
    status: z.string(),
    badge: z.string(),
  }),
  githubUserName: z.string(),
  socialMedia: z.array(linkSchema),
  languages: z.array(languageSchema),
  experience: z.array(experienceSchema),
  projects: z.array(projectSchema),
  education: z.array(educationSchema),
  certifications: z.array(certificationSchema),
})

export type Link = z.infer<typeof linkSchema>
export type Skills = z.infer<typeof skillsSchema>
export type ListItem = z.infer<typeof listItemSchema>
export type Devsync = z.infer<typeof devsyncSchema>
export const devsyncSchemaPartial = devsyncSchema.partial()
export type DevsyncPartial = z.infer<typeof devsyncSchemaPartial>

export const parseDevsync = (devsync: unknown): DevsyncPartial => devsyncSchemaPartial.parse(devsync)
