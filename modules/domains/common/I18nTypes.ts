import { z } from 'zod'
import ISO6391 from 'iso-639-1'

/* =========================================================
   CONFIG
========================================================= */

const parsedEnvLangs = process.env.NEXT_PUBLIC_I18N_LANGUAGES
  ?.split(',')
  .map((l) => l.trim().toLowerCase())
  .filter((l) => ISO6391.validate(l))

const FALLBACK_LANGS = ['en'] as const

export const AppLanguageEnum = z.enum(
  (parsedEnvLangs && parsedEnvLangs.length > 0
    ? parsedEnvLangs
    : FALLBACK_LANGS) as [string, ...string[]]
)

export type AppLanguage = z.infer<typeof AppLanguageEnum>

export const AVAILABLE_LANGUAGES = AppLanguageEnum.options
export const DEFAULT_LANGUAGE: AppLanguage = AVAILABLE_LANGUAGES[0] ?? 'en'

/* =========================================================
   RTL
========================================================= */

const RTL_SET = new Set(['ar', 'he', 'fa', 'ur'])

export function isRTL(lang: AppLanguage): boolean {
  return RTL_SET.has(lang)
}

export function getDirection(lang: AppLanguage): 'rtl' | 'ltr' {
  return isRTL(lang) ? 'rtl' : 'ltr'
}

/* =========================================================
   DISPLAY
========================================================= */

export function getLanguageName(lang: AppLanguage): string {
  return ISO6391.getName(lang) || lang
}

export const LANG_NAMES: Record<AppLanguage, string> = Object.fromEntries(
  AVAILABLE_LANGUAGES.map((lang) => [
    lang,
    ISO6391.getName(lang) || lang,
  ])
) as Record<AppLanguage, string>

/* =========================================================
   FLAGS (explicit map → never a guess)
========================================================= */

/**
 * Language → region, for the two places a country is actually needed: a flag,
 * and an OpenGraph locale string.
 *
 * This was a heuristic — `lang.toUpperCase()` — and the heuristic is wrong for
 * most of the world. It is right only where a language code happens to coincide
 * with the country code of a place that speaks it, which is a mostly-European
 * accident (`tr`/`TR`, `de`/`DE`, `pl`/`PL`). Everywhere else it failed in one
 * of two ways:
 *
 *   - **Not a country at all.** `ja`→`JA`, `ko`→`KO`, `zh`→`ZH`, `hi`→`HI`,
 *     `el`→`EL`. The emoji renders as two meaningless regional-indicator
 *     letters and `flagcdn.com/w40/ja.png` is a 404.
 *   - **A real country, but the wrong one.** This is the dangerous half,
 *     because nothing errors and the result looks deliberate. `ky` (Kyrgyz) →
 *     `KY`, the **Cayman Islands** — Kyrgyzstan is `KG`. `uk` (Ukrainian) →
 *     `UK`, read as the United Kingdom, which is not even its ISO code (`GB`).
 *     `fa` (Persian) → `FA`, `sv` (Swedish) → `SV` (El Salvador).
 *
 * So the mapping is explicit, and a language that is not in it returns `null`
 * rather than a guess. A missing flag is a cosmetic gap someone will notice and
 * fix; a confident wrong flag beside someone's own language is an insult, and
 * it ships silently because nothing can tell it from a right one.
 *
 * Entries are the language's most populous region, which is a judgement call
 * and sometimes a contested one — `en`→`US`, `ar`→`SA`, `pt`→`PT`. A product
 * that needs a different default should map its own; this is a sane starting
 * set, not a claim about who owns a language.
 */
const LANG_REGION: Record<string, string> = {
  af: 'ZA', am: 'ET', ar: 'SA', az: 'AZ', be: 'BY', bg: 'BG', bn: 'BD',
  bs: 'BA', ca: 'ES', cs: 'CZ', da: 'DK', de: 'DE', el: 'GR', en: 'US',
  es: 'ES', et: 'EE', eu: 'ES', fa: 'IR', fi: 'FI', fr: 'FR', ga: 'IE',
  gl: 'ES', he: 'IL', hi: 'IN', hr: 'HR', hu: 'HU', hy: 'AM', id: 'ID',
  is: 'IS', it: 'IT', ja: 'JP', ka: 'GE', kk: 'KZ', km: 'KH', ko: 'KR',
  ky: 'KG', lo: 'LA', lt: 'LT', lv: 'LV', mk: 'MK', ms: 'MY', mt: 'MT',
  my: 'MM', nb: 'NO', ne: 'NP', nl: 'NL', nn: 'NO', no: 'NO', pl: 'PL',
  pt: 'PT', ro: 'RO', ru: 'RU', si: 'LK', sk: 'SK', sl: 'SI', sq: 'AL',
  sr: 'RS', sv: 'SE', sw: 'TZ', ta: 'IN', th: 'TH', tr: 'TR', uk: 'UA',
  ur: 'PK', uz: 'UZ', vi: 'VN', zh: 'CN', zu: 'ZA',
}

/** The region for a language, or `null` when there is no honest answer. */
export function langToRegion(lang: string): string | null {
  return LANG_REGION[lang] ?? null
}

function countryCodeToEmoji(code: string): string {
  return code
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    )
}

/** The flag emoji for a language, or `''` when the region is unknown. */
export function getLangFlag(lang: AppLanguage): string {
  const region = langToRegion(lang)
  return region === null ? '' : countryCodeToEmoji(region)
}

export const LANG_FLAGS: Record<AppLanguage, string> = Object.fromEntries(
  AVAILABLE_LANGUAGES.map((lang) => [lang, getLangFlag(lang)])
) as Record<AppLanguage, string>

/* =========================================================
   GEO FILTER (optional, no hard politics)
========================================================= */

export function isLanguageAccessible(
  _lang: AppLanguage,
  _countryCode?: string | null
): boolean {
  return true
}

export function getFilteredLanguages(): AppLanguage[] {
  return AVAILABLE_LANGUAGES
}

/* =========================================================
   SEO
========================================================= */

/**
 * `og:locale`, as `language_TERRITORY` — or the bare language when the region
 * is unknown.
 *
 * A bare `ky` is a less useful value than `ky_KG` and a far better one than
 * `ky_KY`, which told every crawler that a Kyrgyz page was Caymanian.
 */
export function getOgLocale(lang: AppLanguage): string {
  const region = langToRegion(lang)
  return region === null ? lang : `${lang}_${region}`
}

export function getHrefLang(lang: AppLanguage): string {
  return lang
}

/**
 * A flag image URL, or `null` when the region is unknown.
 *
 * Nullable rather than a best-effort URL: the old version returned
 * `flagcdn.com/w40/ja.png` for Japanese, which is a 404, and
 * `flagcdn.com/w40/ky.png` for Kyrgyz, which is a Cayman Islands flag that
 * loads perfectly. The caller has to handle "no flag" either way; this makes
 * it handle it deliberately.
 */
export function getLangFlagUrl(lang: AppLanguage): string | null {
  const region = langToRegion(lang)
  return region === null ? null : `https://flagcdn.com/w40/${region.toLowerCase()}.png`
}

/* =========================================================
   TYPES
========================================================= */

export type Locale = AppLanguage