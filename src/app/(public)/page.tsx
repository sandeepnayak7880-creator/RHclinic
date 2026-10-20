export const dynamic = "force-dynamic";

import { AnnouncementBanner } from "@/components/home/AnnouncementBanner";
import { DoctorPreview } from "@/components/home/DoctorPreview";
import { Hero } from "@/components/home/Hero";
import { Testimonials } from "@/components/home/Testimonials";
import { TreatmentsSection } from "@/components/TreatmentsSection";

export default function Page() {
  return (
    <>
      <AnnouncementBanner />
      <Hero />
      <TreatmentsSection />
      <div id="about">
        <DoctorPreview />
      </div>
      <Testimonials />
    </>
  );
}