import prisma from "@/lib/prisma";
import SiteNav from "@/components/SiteNav";

export default async function PublicLayout({ children }) {
  const settingsArray = await prisma.setting.findMany();
  const settings = settingsArray.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  return (
    <>
      <SiteNav siteName={settings.site_name} />
      {children}
    </>
  );
}
