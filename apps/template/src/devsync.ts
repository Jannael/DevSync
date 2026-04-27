import devsync from '../DEVSYNC.json'
import { parseDevsync } from './devsync-validator'

export * from './devsync-validator'

export default parseDevsync(devsync)
