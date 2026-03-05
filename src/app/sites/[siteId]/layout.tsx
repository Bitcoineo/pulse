import SiteNav from "@/components/SiteNav";

export default function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { siteId: string };
}) {
  return (
    <>
      <SiteNav siteId={params.siteId} />
      {children}
    </>
  );
}
