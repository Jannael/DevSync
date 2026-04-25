import { BG_YELLOW, BLACK, GREEN, RED } from '@/utils/colors'

export const X = (text: string) => RED(` ✖ ${text}`)
export const CHECK = (text: string) => `${GREEN('✔')}  ${text}`
export const WARNING = (text: string) => BG_YELLOW(BLACK(` ⚠ ${text}`))
