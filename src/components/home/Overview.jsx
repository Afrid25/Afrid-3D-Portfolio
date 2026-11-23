import { Card } from "../ui/Card";

const capabilities = [
  ["Frontend development", "Responsive React and Next.js interfaces for browsing products and discovering events."],
  ["Backend development", "Express APIs and MongoDB for creating events, managing registrations and tracking participation."],
  ["Student projects", "Bookeeds explores how students can organize their studies and collaborate."]
];

export default function Overview() {
  return <section aria-label="Development capabilities" className="portfolio-wrap grid gap-4 pb-14 md:grid-cols-3">
    {capabilities.map(([title, detail]) => <Card key={title}><h2 className="text-lg font-semibold">{title}</h2><p className="mt-3 leading-7 text-secondary">{detail}</p></Card>)}
  </section>;
}
