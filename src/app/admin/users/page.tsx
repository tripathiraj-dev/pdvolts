import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import AdminUsersView from "@/components/admin/AdminUsersView";

export const metadata: Metadata = {
  title: "User & Role Management | Admin CMS",
};

export const revalidate = 0;

export default async function AdminUsersPage() {
  const session = await getSessionUser();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      company: true,
      role: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: {
          quoteRequests: true,
          enquiries: true,
        },
      },
    },
  });

  return (
    <div>
      <AdminUsersView initialUsers={users as any} currentUserId={session?.id} />
    </div>
  );
}
