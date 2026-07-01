import { Star, ShoppingCart } from "lucide-react"

const products = [
  {
    name: "Garrafa Motivacional 2L",
    image: "/images/product-motivacional.png",
    price: "79,90",
    oldPrice: "129,90",
    rating: 5,
    reviews: 342,
    tag: "Mais vendida",
  },
  {
    name: "Garrafa Térmica Inox 750ml",
    image: "/images/product-termica.png",
    price: "119,90",
    oldPrice: "179,90",
    rating: 5,
    reviews: 218,
    tag: "Premium",
  },
  {
    name: "Squeeze Esportiva 1L",
    image: "/images/product-squeeze.png",
    price: "49,90",
    oldPrice: "89,90",
    rating: 4,
    reviews: 176,
    tag: null,
  },
  {
    name: "Garrafa Infusora de Frutas",
    image: "/images/product-infusora.png",
    price: "69,90",
    oldPrice: "99,90",
    rating: 5,
    reviews: 129,
    tag: "Novidade",
  },
]

export function FeaturedProducts() {
  return (
    <section id="produtos" className="mx-auto max-w-6xl px-4 py-14 md:py-20">
      <div className="mb-8 text-center">
        <span className="text-sm font-bold uppercase tracking-widest text-accent">Coleção AquaLux</span>
        <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Os queridinhos da hidratação
        </h2>
        <p className="mx-auto mt-3 max-w-md text-pretty text-muted-foreground">
          Modelos selecionados a dedo para acompanhar cada momento do seu dia.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {products.map((product) => (
          <article
            key={product.name}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg"
          >
            <div className="relative aspect-square overflow-hidden bg-secondary/50">
              {product.tag && (
                <span className="absolute left-3 top-3 z-10 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
                  {product.tag}
                </span>
              )}
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="size-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <div className="flex items-center gap-1">
                <div className="flex text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={i < product.rating ? "size-3.5 fill-current" : "size-3.5 text-muted-foreground/30"}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">({product.reviews})</span>
              </div>
              <h3 className="mt-2 text-sm font-semibold leading-snug text-foreground">{product.name}</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-lg font-bold text-foreground">R$ {product.price}</span>
                <span className="text-xs text-muted-foreground line-through">R$ {product.oldPrice}</span>
              </div>
              <button
                type="button"
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-navy"
              >
                <ShoppingCart className="size-4" />
                Comprar
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
