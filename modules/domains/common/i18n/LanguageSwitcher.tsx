'use client';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import * as Flags from 'country-flag-icons/react/3x2';
import { Button } from '@/modules/ui/Button';
import {
  AVAILABLE_LANGUAGES,
  DEFAULT_LANGUAGE,
  getLanguageName,
  langToRegion,
  type AppLanguage,
} from '../I18nTypes';
import { DropdownMenu, type DropdownItem } from '@/modules/ui/DropdownMenu';

type LanguageSwitcherProps = {
  value?: AppLanguage;
  onChange?: (lang: AppLanguage) => void;
  languages?: AppLanguage[];
  className?: string;
};

/**
 * The SVG flag for a language, or `null` when there is no honest one.
 *
 * This file used to carry its own five-entry `langToCountry` map — a second
 * copy of the mapping in `I18nTypes`, and the two disagreed by construction:
 * the local one covered `en, tr, de, fr, ar` and everything else fell through
 * to an emoji derived from `lang.toUpperCase()`. That fallback is what turned
 * Kyrgyz into the Cayman Islands, so the map is now in one place and there is
 * no guessing fallback left to reach.
 *
 * `null` rather than an emoji when the region is unknown. The two are not
 * interchangeable anyway — every other row renders an SVG, so an emoji row
 * already looked wrong — and a language with no flag is a smaller problem than
 * a language with somebody else's.
 */
function getFlag(lang: string) {
  const region = langToRegion(lang);
  if (region === null) return null;

  const FlagComp = Flags[region as keyof typeof Flags] as
    | React.ComponentType<React.SVGProps<SVGSVGElement>>
    | undefined;

  return FlagComp ? <FlagComp className="w-4 h-auto rounded-[2px] shadow-sm" /> : null;
}

export function LanguageSwitcher({
  value,
  onChange,
  languages = AVAILABLE_LANGUAGES as AppLanguage[],
  className,
}: LanguageSwitcherProps) {
  const [internal, setInternal] = useState<AppLanguage>(DEFAULT_LANGUAGE);
  const current = value !== undefined ? value : internal;

  const items: DropdownItem[] = languages.map((lang) => ({
    type: 'item',
    label: getLanguageName(lang),
    // No cast. The comment here used to say DropdownMenu expects a string, and it
    // does not — `DropdownItem.icon` is `React.ReactNode`, which an element and
    // `undefined` both satisfy. The `as any` was load-bearing for nothing and hid
    // the fact that this had always type-checked.
    //
    // `?? undefined` rather than null so a flagless row renders with no icon slot
    // at all: `DropdownMenu` guards with `item.icon && …`, which treats both the
    // same, but `undefined` is what "absent optional prop" means.
    icon: getFlag(lang) ?? undefined,
    onClick: () => {
      setInternal(lang);
      onChange?.(lang);
    },
  }));

  return (
    <DropdownMenu
      className={className}
      trigger={
        <Button variant="outline" size="sm" className="gap-2">
          <span className="w-4 flex items-center justify-center shrink-0" aria-hidden="true">
            {getFlag(current)}
          </span>
          <span>{getLanguageName(current)}</span>
          <FontAwesomeIcon icon={faChevronDown} className="w-3 h-3 text-text-disabled" />
        </Button>
      }
      items={items}
    />
  );
} 