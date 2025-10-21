"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { SessionProvider } from "next-auth/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { ThemeProvider } from "@/components/theme-provider";

export function Providers({
  children,
}: //   session,
//props,
{
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any;
  props?: { disableCustomTheme: boolean };
}) {
  // Create a client
  const queryClient = new QueryClient();
  return (
    // <SessionProvider session={session}>
    <QueryClientProvider client={queryClient}>
      {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > */}
      {children}
      {/* </ThemeProvider> */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    // </SessionProvider>
  );
}
