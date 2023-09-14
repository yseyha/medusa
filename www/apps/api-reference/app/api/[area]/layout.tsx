import SidebarProvider from "@/providers/sidebar"
import Sidebar from "@/components/Sidebar"
import clsx from "clsx"
import "../../../css/globals.css"
import BaseSpecsProvider from "@/providers/base-specs"
import Navbar from "@/components/Navbar"
import ColorModeProvider from "@/providers/color-mode"
import { Inter } from "next/font/google"
import { Roboto_Mono } from "next/font/google"
import NavbarProvider from "@/providers/navbar"
import ModalProvider from "../../../providers/modal"
import SearchProvider from "../../../providers/search"
import { ScrollControllerProvider } from "../../../hooks/scroll-utils"
import MobileProvider from "../../../providers/mobile"
import PageLoadingProvider from "../../../providers/page-loading"
import Providers from "../../../providers"

export const metadata = {
  title: "Medusa API Reference",
  description: "Check out Medusa's API reference",
}

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500"],
})

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={clsx("h-full w-full")}>
      <body
        className={clsx(
          inter.variable,
          robotoMono.variable,
          "bg-docs-bg dark:bg-docs-bg-dark font-base text-medium h-full w-full",
          "text-medusa-fg-subtle dark:text-medusa-fg-subtle-dark"
        )}
      >
        <Providers>
          <PageLoadingProvider>
            <ModalProvider>
              <ColorModeProvider>
                <BaseSpecsProvider>
                  <SidebarProvider>
                    <NavbarProvider>
                      <ScrollControllerProvider>
                        <SearchProvider>
                          <MobileProvider>
                            <div className="w-full">
                              <Navbar />
                              <div className="max-w-xxl mx-auto flex w-full px-1.5">
                                <Sidebar />
                                <main className="lg:w-ref-main relative mt-4 w-full flex-1 lg:mt-7">
                                  {children}
                                </main>
                              </div>
                            </div>
                          </MobileProvider>
                        </SearchProvider>
                      </ScrollControllerProvider>
                    </NavbarProvider>
                  </SidebarProvider>
                </BaseSpecsProvider>
              </ColorModeProvider>
            </ModalProvider>
          </PageLoadingProvider>
        </Providers>
      </body>
    </html>
  )
}
