export const dynamic = "force-dynamic";

import { AnnouncementBanner } from "@/components/home/AnnouncementBanner";
import { DoctorPreview } from "@/components/home/DoctorPreview";
import { Hero } from "@/components/home/Hero";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { Testimonials } from "@/components/home/Testimonials";

export default function Page() {
  return (
    <>
      <AnnouncementBanner />
      <Hero />
      <ServicesPreview />
        <div id="about">
          <DoctorPreview />
        </div>
      <Testimonials />
    </>
  );
}