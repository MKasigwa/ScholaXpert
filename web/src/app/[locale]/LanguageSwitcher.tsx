import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, usePathname } from "@/i18n/navigation";
import { localeNames, locales, localeFlags, Locale } from "@/i18n/routing";
import { Languages, Check } from "lucide-react";
import { useLocale } from "next-intl";
import { startTransition } from "react";
import { useParams } from "next/navigation";

export function LanguageSwitcher() {
  const defaultValue = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLanguageChange = (event: any) => {
    const newLang = event as Locale;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: newLang }
      );
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">
            {localeFlags[defaultValue]} {defaultValue}
            {/* {localeNames[defaultValue] */}
          </span>
          <span className="sm:hidden">{localeFlags[defaultValue]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((loc: Locale) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLanguageChange(loc)}
            className="gap-2 cursor-pointer"
          >
            <span className="text-lg">{localeFlags[loc]}</span>
            <span>{localeNames[loc]}</span>
            {defaultValue === loc && <Check className="h-4 w-4 ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
