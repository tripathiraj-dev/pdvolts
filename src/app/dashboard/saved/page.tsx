import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Bookmark, Package, ArrowRight, Zap, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Saved Products | Client Dashboard",
};

export default async function UserSavedProductsPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login?callbackUrl=/dashboard/saved");

  const saved = await prisma.savedProduct.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        include: {
          category: true,
          images: { take: 1 },
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
          Bookmarked Industrial Products
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Quickly access saved cable designs, compare dimensions, and request tailored quotes.
        </p>
      </div>

      {saved.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center space-y-3">
          <Bookmark className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 font-heading">No Saved Products</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse our catalog and bookmark wire specifications for quick access later.
          </p>
          <Link
            href="/products"
            className="inline-block px-4 py-2 rounded-lg bg-brand-700 text-white text-xs font-semibold hover:bg-brand-800 transition"
          >
            Explore Product Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {saved.map(({ product: p }) => {
            const img = p.images && p.images.length > 0 ? p.images[0].url : null;
            return (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="relative h-44 bg-slate-950">
                  {img ? (
                    <img src={img} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <Package className="w-10 h-10" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-900/90 text-white text-[11px] font-semibold">
                    {p.category.name}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-heading line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {p.shortDescription}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/products/${p.slug}`}
                      className="text-xs font-bold text-brand-700 hover:underline inline-flex items-center gap-1"
                    >
                      Details <ArrowRight className="w-3 h-3" />
                    </Link>
                    <Link
                      href={`/quote?productId=${p.id}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-semibold hover:bg-brand-700 transition"
                    >
                      Request Quote
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
