import React from "react";
import { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import UserProfileEditor from "@/components/shared/UserProfileEditor";

export const metadata: Metadata = {
  title: "Profile & Security | Client Dashboard",
};

export default async function UserProfilePage() {
  const session = await getSessionUser();
  if (!session) redirect("/login?callbackUrl=/dashboard/profile");

  const user = await prisma.user.findUnique({
    where: { id: session.id },
  });

  if (!user) redirect("/login");

  return (
    <div className="space-y-6">
      <UserProfileEditor user={user as any} />
    </div>
  );
}
