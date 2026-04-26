import { z } from 'astro/zod'
import devsync from '../DEVSYNC.json'

const socialMediaSchema = z.object({
  name: z.string(),
  url: z.string(),
  icon: z.string(),
})

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

// ---------------------------------------------- //
const experienceSchema = z.object({
  company: z.string(),
  position: z.string(),
  img: z.string(),
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

// ---------------------------------------------- //
const devsyncSchema = z.object({
  name: z.string(),
  description: z.string(),
  img: z.string(),
  socialMedia: z.array(socialMediaSchema),
  languages: z.array(languageSchema),
  experience: z.array(experienceSchema),
  projects: z.array(projectSchema),
  education: z.array(educationSchema),
  certifications: z.array(certificationSchema),
})

export type Devsync = z.infer<typeof devsyncSchema>
const devsyncSchemaPartial = devsyncSchema.partial()

export default devsyncSchemaPartial.parse(devsync)
