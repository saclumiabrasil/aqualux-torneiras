import { SiteHeader } from "@/components/site-header"
import { ProductHero } from "@/components/product-hero"
import { FeatureBanners } from "@/components/feature-banners"
import { HotCold } from "@/components/hot-cold"
import { Installation } from "@/components/installation"
import { Compatibility } from "@/components/compatibility"
import { ProductInfo } from "@/components/product-info"
import { Comparison } from "@/components/comparison"
import { UseCases } from "@/components/use-cases"
import { Faq } from "@/components/faq"
import { SiteFooter } from "@/components/site-footer"
import { StickyBuyBar } from "@/components/sticky-buy-bar"

export default function Page() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <SiteHeader />
      <main>
        <ProductHero />
        <FeatureBanners />
        <HotCold />
        <Installation />
        <Compatibility />
        <ProductInfo />
        <Comparison />
        <UseCases />
        <Faq />
      </main>
      <SiteFooter />
      <StickyBuyBar />
    </div>
  )
}
