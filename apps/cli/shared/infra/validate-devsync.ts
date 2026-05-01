import { ZodError } from 'zod'
import { parseDevsync, type DevsyncPartial } from '@template/src/devsync-validator'
import { availableLangs } from '@template/src/const/fields-translations'
import { devsyncGlobalFields } from '@template/src/devsync'
import type { GConstructor } from '@/shared/infra/mixin-constructor'
import { DEVSYNC_JSON_PATH } from '@/constants/paths'
import { BadRequest, ServerError } from '@/error/error-instance'
import { readFileMixin } from '@/shared/infra/read-file'
import { SPACE } from '@/utils/icons-terminal'
import { BOLD, GREEN } from '@/utils/colors'

export function validateDevsyncMixin<TBase extends GConstructor>(Base: TBase) {
  return class extends readFileMixin(Base) {
    async validateDevsync(): Promise<DevsyncPartial> {
      let raw = ''

      try {
        raw = await this.readFile({ path: DEVSYNC_JSON_PATH })
      } catch {
        throw new ServerError(
          'Failed to read DEVSYNC.json',
          `${SPACE}${SPACE}${GREEN('1.')} Run ${BOLD('devsync init')}\n` +
            `${SPACE}${SPACE}${GREEN('2.')} Fill ${BOLD('DEVSYNC.json')} with your information\n` +
            `${SPACE}${SPACE}${GREEN('3.')} Run ${BOLD('devsync build')}`
        )
      }

      let parsed: unknown
      try {
        parsed = JSON.parse(raw)
      } catch {
        throw new ServerError(
          'Failed to parse DEVSYNC.json',
          'DEVSYNC.json must be valid JSON before running devsync build'
        )
      }

      try {
        const validated = parseDevsync(parsed)
        const configuredLangs = Object.keys(validated).filter(
          (key) => !devsyncGlobalFields.includes(key as (typeof devsyncGlobalFields)[number])
        )

        if (configuredLangs.length === 0) {
          throw new BadRequest(
            'Invalid DEVSYNC.json structure',
            'Add at least one localized object key (e.g. "en", "es") in DEVSYNC.json'
          )
        }

        const unsupportedLang = configuredLangs.find((lang) => !availableLangs.includes(lang))
        if (unsupportedLang) {
          throw new BadRequest(
            'Invalid DEVSYNC.json structure',
            `Language "${unsupportedLang}" is not supported`
          )
        }

        if (validated.defaultLang && !configuredLangs.includes(validated.defaultLang)) {
          throw new BadRequest(
            'Invalid DEVSYNC.json structure',
            `defaultLang "${validated.defaultLang}" must exist as a localized key in DEVSYNC.json`
          )
        }

        return validated
      } catch (error) {
        if (error instanceof BadRequest) {
          throw error
        }

        if (error instanceof ZodError) {
          throw new BadRequest(
            'Invalid DEVSYNC.json structure',
            `Fix schema errors in DEVSYNC.json: ${error.issues[0]?.path.join('.') ?? 'unknown field'}`
          )
        }

        throw new ServerError('Unexpected execution error')
      }
    }
  }
}
