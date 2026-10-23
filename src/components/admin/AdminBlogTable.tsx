"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";
import { Plus, Edit, Trash2, BookOpen, ExternalLink, Calendar, X } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  isPublished: boolean;
  publishedAt: string | Date;
  coverImage: string | null;
}

interface AdminBlogTableProps {
  posts: BlogPost[];
}

export default function AdminBlogTable({ posts: initialPosts }: AdminBlogTableProps) {
  const { success, error } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const togglePublished = async (post: BlogPost) => {
    try {
      const res = await fetch(`/api/blog/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !post.isPublished }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, isPublished: !p.isPublished } : p))
      );
      success(`Article marked as ${!post.isPublished ? "Published" : "Draft"}`);
    } catch (err: any) {
      error(err.message || "Failed to update article");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete post");

      setPosts((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirmId(null);
      success("Article deleted");
    } catch (err: any) {
      error(err.message || "Failed to delete article");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
            Publishing CMS
          </span>
          <h1 className="text-2xl font-extrabold text-white font-heading">
            Technical Blog & Insights
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Author engineering guides, fire standard breakdowns, and industrial manufacturing news.
          </p>
        </div>

        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow transition"
        >
          <Plus className="w-4 h-4" /> Write New Article
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase bg-slate-950/60">
                <th className="py-3 px-4">Article Title & Category</th>
                <th className="py-3 px-4">Publish Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="space-y-0.5">
                      <span className="font-bold text-white block text-sm max-w-md line-clamp-1">
                        {post.title}
                      </span>
                      <span className="text-[11px] text-brand-400 font-semibold">{post.category}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-400">{formatDate(post.publishedAt)}</td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => togglePublished(post)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition border ${
                        post.isPublished
                          ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}
                    >
                      {post.isPublished ? "Published" : "Draft"}
                    </button>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        title="View Live Article"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="p-1.5 rounded-lg text-brand-400 hover:text-white hover:bg-brand-900/60 transition"
                        title="Edit Article"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>

                      {deleteConfirmId === post.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="px-2 py-1 rounded bg-rose-600 text-white text-[10px] font-bold"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="p-1 text-slate-400 hover:bg-slate-800 rounded"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(post.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition"
                          title="Delete Article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
