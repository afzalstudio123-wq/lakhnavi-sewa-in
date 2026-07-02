import { EXHAUSTIVE_SERVICES } from '../../../database/exhaustiveServices';
import ServiceDetailsClient from './ServiceDetailsClient';

// Enable static pre-rendering parameters for all services and fallbacks
export async function generateStaticParams() {
  const serviceIds = EXHAUSTIVE_SERVICES.map((s) => s.id);
  const fallbackIds = [
    "srv_beauty_1",
    "srv_repair_1",
    "srv_cleaning_1",
    "srv_smart_1",
    "srv_labour_1",
    "srv_contractor_1",
    "beauty_1",
    "repairs_1",
    "cleaning_1",
    "smart_1",
    "labour_1",
    "contractor_1"
  ];
  
  // Combine and deduplicate
  const allIds = Array.from(new Set([...serviceIds, ...fallbackIds]));
  
  return allIds.map((id) => ({
    id: id,
  }));
}

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  return <ServiceDetailsClient params={params} />;
}
