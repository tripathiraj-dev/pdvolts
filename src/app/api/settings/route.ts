import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { siteConfig } from "@/config/site";

export async function GET() {
  try {
    const dbSettings = await prisma.siteSetting.findMany();
    const settingsMap: Record<string, string> = {};

    dbSettings.forEach((item) => {
      settingsMap[item.key] = item.value;
    });

    // Merge default siteConfig with dynamic DB settings
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

    return NextResponse.json({ settings: merged });
  } catch (error) {
    console.error("Fetch settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();

    // Upsert key-values
    const updates = Object.entries(body).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    );

    await Promise.all(updates);

    return NextResponse.json({ success: true, message: "Site settings updated successfully" });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
