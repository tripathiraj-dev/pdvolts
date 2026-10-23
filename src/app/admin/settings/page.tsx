import React from "react";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import AdminSettingsView from "@/components/admin/AdminSettingsView";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const dbSettings = await prisma.siteSetting.findMany();
  const settingsMap: Record<string, string> = {};

  dbSettings.forEach((item) => {
    settingsMap[item.key] = item.value;
  });

  const merged = {
    companyName: settingsMap["companyName"] || siteConfig.name,
    tagline: settingsMap["tagline"] || siteConfig.tagline,
    email: settingsMap["email"] || siteConfig.contact.email,
    phone: settingsMap["phone"] || siteConfig.contact.phone,
    whatsapp: settingsMap["whatsapp"] || siteConfig.contact.whatsapp,
    address: settingsMap["address"] || siteConfig.contact.address.full,
    businessHours: settingsMap["businessHours"] || siteConfig.contact.hours,
    statsYears: settingsMap["statsYears"] || "28+",
    statsCapacity: settingsMap["statsCapacity"] || "85,000 MT",
    statsClients: settingsMap["statsClients"] || "1,450+",
    statsCountries: settingsMap["statsCountries"] || "45+",
    statsProducts: settingsMap["statsProducts"] || "500+",
    linkedin: settingsMap["linkedin"] || siteConfig.social.linkedin,
    twitter: settingsMap["twitter"] || siteConfig.social.twitter,
  };

  return <AdminSettingsView initialSettings={merged} />;
}
