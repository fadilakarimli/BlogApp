import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminDashboard from "./admin-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  const [posts, categories, about] = await Promise.all([
    prisma.post.findMany({ include: { translations: true, categories: true }, orderBy: { updatedAt: "desc" } }),
    prisma.category.findMany({ include: { translations: true }, orderBy: { slug: "asc" } }),
    prisma.siteSetting.findUnique({ where: { key: "about" } }),
  ]);
  return <AdminDashboard initialPosts={JSON.parse(JSON.stringify(posts))} categories={JSON.parse(JSON.stringify(categories))} initialAbout={about?.value && typeof about.value === "object" ? JSON.parse(JSON.stringify(about.value)) : {}} adminName={admin.name} />;
}
