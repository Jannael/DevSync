import devsync from '../DEVSYNC.json'
import { parseDevsync } from '@/devsync-validator'

export * from '@/devsync-validator'

export const languages = Object.keys(devsync).filter((key) => key !== 'defaultLang')

export default parseDevsync(devsync)
