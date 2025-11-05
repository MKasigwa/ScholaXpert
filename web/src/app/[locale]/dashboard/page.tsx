import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { Layout } from "@/components/Layout";

export default async function Page({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  return (
    <Layout locale={locale}>
      <DashboardPage />
    </Layout>
  );
}
