// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { localeNames, locales, localeFlags } from "@/i18n/routing";
// import { Languages, Check } from "lucide-react";
// import { useLocale } from "next-intl";
// // import { locales, localeNames, localeFlags, Locale } from "../lib/i18n/config";

// export function LanguageSwitcher() {
//   const defaultValue = useLocale();
//   const router = useRouter();
//   const { locale, setLocale } = useLocale();

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline" size="sm" className="gap-2">
//           <Languages className="h-4 w-4" />
//           <span className="hidden sm:inline">
//             {localeFlags[locale]} {localeNames[locale]}
//           </span>
//           <span className="sm:hidden">{localeFlags[locale]}</span>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         {locales.map((loc: string) => (
//           <DropdownMenuItem
//             key={loc}
//             onClick={() => setLocale(loc)}
//             className="gap-2 cursor-pointer"
//           >
//             <span className="text-lg">{localeFlags[loc]}</span>
//             <span>{localeNames[loc]}</span>
//             {locale === loc && <Check className="h-4 w-4 ml-auto" />}
//           </DropdownMenuItem>
//         ))}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
export {};
