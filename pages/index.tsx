import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Testimonial from "@/models/Testimonial";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SchedulerButton } from "@/components/scheduler/SchedulerButton";
import { 
  ArrowRight, 
  ShoppingBag, 
  Shield, 
  Truck, 
  Award,
  Package,
  CheckCircle,
  Star,
  Users,
  Factory,
  Globe
} from "lucide-react";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
};

interface HomePageProps {
  products: any[];
  categories: any[];
  testimonials: any[];
}

export default function HomePage({ products, categories, testimonials }: HomePageProps) {
  const baseUrl = getBaseUrl();

  return (
    <>
      <Head>
        <title>BulkLeather - Premium Wholesale Leather Goods Manufacturer & Supplier</title>
        <meta
          name="description"
          content="Leading wholesale leather goods manufacturer offering premium bags, jackets, wallets, belts & accessories. Flexible MOQ, custom branding, global shipping. Perfect for retailers & distributors."
        />
        <meta
          name="keywords"
          content="wholesale leather, bulk leather goods, leather manufacturer, leather supplier, wholesale leather bags, wholesale leather jackets, custom leather products, private label leather, leather distributor, B2B leather"
        />
        <meta property="og:title" content="BulkLeather - Premium Wholesale Leather Goods Manufacturer" />
        <meta property="og:description" content="Leading wholesale leather goods manufacturer offering premium bags, jackets, wallets, belts & accessories. Flexible MOQ, custom branding, global shipping." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={baseUrl} />
        <meta property="og:site_name" content="BulkLeather" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="BulkLeather - Premium Wholesale Leather Goods" />
        <meta name="twitter:description" content="Leading wholesale leather goods manufacturer offering premium products with flexible MOQ and custom branding." />
        <link rel="canonical" href={baseUrl} />
      </Head>

      <div>
        {/* Hero Section */}
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1599108859613-88a1fff8e2e4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1287"
              alt="Premium Leather Products"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg)] via-[var(--color-bg)]/80 to-transparent" />
          </div>
          
          <div className="container mx-auto px-4 z-10">
            <div className="max-w-3xl">
              <h1 className="hero-title font-serif text-[var(--color-text)] mb-6">
                Premium Leather Goods for{" "}
                <span className="text-gradient">Wholesale Buyers</span>
              </h1>
              
              <p className="hero-subtitle text-[var(--color-body)] mb-8">
                Trusted by global retailers and distributors for exceptional quality, 
                craftsmanship, and competitive wholesale pricing. Minimum order quantities 
                designed for your business growth.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button size="lg" className="group">
                    Browse Catalog
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <SchedulerButton variant="outline" size="lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-[var(--color-secondary)]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif text-center mb-12">Why Choose BulkLeather</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { icon: Shield, title: "Quality Guarantee", description: "Premium materials and craftsmanship" },
                { icon: Truck, title: "Global Shipping", description: "Reliable delivery worldwide" },
                { icon: Award, title: "20+ Years Experience", description: "Trusted leather manufacturer" },
                { icon: ShoppingBag, title: "Flexible MOQ", description: "Minimum orders from 30 units" },
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-accent)] mb-4">
                    <feature.icon className="w-8 h-8 text-[var(--color-text)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--color-body)]">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-text)] mb-4">
                Explore Our <span className="text-gradient">Categories</span>
              </h2>
              <p className="text-lg text-[var(--color-body)] max-w-3xl mx-auto">
                Discover our diverse range of premium leather products.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category: any) => {
                const categoryId = category._id || category.id;
                return (
                  <Link key={categoryId} href={`/categories/${category.slug}`}>
                    <Card className="group cursor-pointer overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="relative h-64">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-2xl font-serif text-[var(--color-text)] mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-[var(--color-body)]">{category.description}</p>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-[var(--color-accent)]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-text)] mb-4">
                Numbers That <span className="text-[var(--color-text)]">Speak Excellence</span>
              </h2>
              <p className="text-lg text-[var(--color-text)]/80">
                Two decades of delivering premium leather goods to wholesale partners worldwide
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "20+", label: "Years in Business", description: "Industry expertise" },
                { value: "500+", label: "Global Partners", description: "Retailers worldwide" },
                { value: "100K+", label: "Products Delivered", description: "Monthly production" },
                { value: "40+", label: "Countries", description: "International reach" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-5xl md:text-6xl font-bold text-[var(--color-text)] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xl font-semibold text-[var(--color-text)] mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-[var(--color-text)]/70">
                    {stat.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brand Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-text)] mb-6">
                  Craftsmanship Meets <span className="text-gradient">Excellence</span>
                </h2>
                <p className="text-lg text-[var(--color-body)] mb-6">
                  For over two decades, BulkLeather has been the preferred choice for retailers
                  and distributors seeking exceptional leather products at competitive wholesale prices.
                </p>
                <p className="text-lg text-[var(--color-body)] mb-8">
                  Our commitment to quality, flexible MOQs, and custom branding solutions
                  make us the ideal partner for your leather goods supply.
                </p>
                <Link href="/about">
                  <Button size="lg" variant="outline">
                    Learn Our Story
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>

              <div className="relative h-[500px] rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800"
                  alt="Leather Craftsmanship"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-text)] mb-4">
                Trusted by <span className="text-gradient">Global Retailers</span>
              </h2>
              <p className="text-lg text-[var(--color-body)] max-w-3xl mx-auto">
                Hear from our wholesale partners about their experience working with us
                for their leather goods supply.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial: any) => {
                const testimonialId = testimonial._id || testimonial.id;
                return (
                  <Card key={testimonialId}>
                    <div className="flex items-center gap-4 mb-4">
                      {testimonial.avatar && (
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          width={60}
                          height={60}
                          className="rounded-full"
                        />
                      )}
                      <div>
                        <h4 className="font-semibold text-[var(--color-text)]">{testimonial.name}</h4>
                        <p className="text-sm text-[var(--color-body)]">{testimonial.role} at {testimonial.company}</p>
                      </div>
                    </div>
                    <p className="text-[var(--color-body)] italic mb-4">"{testimonial.content}"</p>
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[var(--color-accent)] text-[var(--color-accent)]" />
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[var(--color-accent)]">
          <div className="container mx-auto px-4 text-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-text)] mb-6">
                Ready to Start Your <span className="text-[var(--color-text)]">Order?</span>
              </h2>
              <p className="text-xl text-[var(--color-text)]/80 mb-8 max-w-2xl mx-auto">
                Join hundreds of satisfied wholesale partners. Get started with flexible MOQs
                and competitive pricing today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/products">
                  <Button size="lg" variant="secondary">
                    Browse Products
                    <Package className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <SchedulerButton size="lg" variant="secondary" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

// getServerSideProps - Fetches data on every request (SSR)
export const getServerSideProps: GetServerSideProps = async () => {
  console.log("🚀 [Homepage SSR] Fetching data with getServerSideProps...");
  
  try {
    await connectDB();
    console.log("✅ [Homepage SSR] MongoDB connected");

    const [productsData, categoriesData, testimonialsData] = await Promise.all([
      Product.find({ isActive: true })
        .select('-__v')
        .sort({ createdAt: -1 })
        .limit(20)
        .lean(),
      Category.find({ isActive: true })
        .select('-__v')
        .sort({ name: 1 })
        .lean(),
      Testimonial.find({ isActive: true })
        .select('-__v')
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    console.log(`✅ [Homepage SSR] Fetched ${productsData.length} products, ${categoriesData.length} categories, ${testimonialsData.length} testimonials`);

    const products = JSON.parse(JSON.stringify(productsData));
    const categories = JSON.parse(JSON.stringify(categoriesData));
    const testimonials = JSON.parse(JSON.stringify(testimonialsData));

    return {
      props: {
        products,
        categories,
        testimonials,
      },
    };
  } catch (error: any) {
    console.error("❌ [Homepage SSR] Error fetching data:", error?.message || error);
    return {
      props: {
        products: [],
        categories: [],
        testimonials: [],
      },
    };
  }
};
