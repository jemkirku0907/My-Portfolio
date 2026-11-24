import Image from "next/image";
import { ContactSection } from "@/components/ContactSection";
import { GitHubContributions } from "@/components/GitHubContributions";
import {
  CertificatesRowsSection,
  ExperienceListSection,
  HeroIdentityBlock,
  HeroMetricsAndSpotlights,
  ProjectsRowsSection,
  ServicesAndAboutSection,
  StackKeyValueSection
} from "@/components/MarwieHomeContent";
import { profile } from "@/data/portfolio";

const beyondCodePhotos = [
  { src: "/profile/outside-football.jpeg", alt: "Football team huddle after a game", label: "Football" },
  { src: "/profile/outside-taekwondo.jpg", alt: "Taekwondo sparring practice", label: "Taekwondo" },
  { src: "/profile/outside-basketball.jpg", alt: "Basketball team photo on court", label: "Basketball" },
  { src: "/profile/outside-gym.jpg", alt: "Gym mirror photo with friends", label: "Gym" },
  { src: "/profile/outside-acting.jpg", alt: "Acting performance preparation", label: "Acting" },
  { src: "/profile/outside-friends.jpeg", alt: "Friends taking a group photo outside", label: "Campus life" }
];

export default function Home() {
  const githubUser = process.env.NEXT_PUBLIC_GITHUB_USERNAME || profile.github;

  return (
    <main className="flex w-full min-w-0 justify-center px-5 pb-24 pt-10 sm:px-8 lg:pb-28 lg:pt-24">
      <div className="flex w-full max-w-[656px] flex-col gap-20">
        {/* Hero Identity + Metrics + Dual Spotlight Cards */}
        <section className="flex flex-col gap-10">
          <HeroIdentityBlock />
          <HeroMetricsAndSpotlights />
        </section>

        {/* Experience (collapsible bullets) */}
        <ExperienceListSection />

        {/* Selected Client, Hackathon & Mini-Game Projects */}
        <ProjectsRowsSection />

        {/* Services & Focus */}
        <ServicesAndAboutSection />

        {/* Stack Key-Value Table */}
        <StackKeyValueSection />

        {/* Certificates */}
        <CertificatesRowsSection />

        {/* GitHub Contribution Graph */}
        <section id="github" className="scroll-mt-16 flex flex-col gap-4 lg:scroll-mt-10">
          <GitHubContributions username={githubUser} />
        </section>

        {/* Outside the Editor — Minimal Photo Grid */}
        <section id="beyond-code" className="scroll-mt-16 flex flex-col gap-4 lg:scroll-mt-10">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[14px] font-medium text-[#6e6e73] dark:text-[#8b8b91]">
              Outside the editor
            </h2>
            <span className="text-[13px] text-[#9a9a9e] dark:text-[#66666c]">
              Football · Taekwondo · Gym · Acting
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
            {beyondCodePhotos.map((photo) => (
              <div
                key={photo.label}
                className="group relative aspect-[4/5] overflow-hidden rounded-[10px] border border-[#ebebea] bg-[#ededec] dark:border-[#232327] dark:bg-[#1c1c20]"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 33vw, 110px"
                  className="object-cover grayscale-[35%] transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pb-1.5 pt-4 text-[11px] font-medium text-white opacity-90">
                  {photo.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <ContactSection sectionClass="scroll-mt-16 lg:scroll-mt-10" githubUser={githubUser} />
      </div>
    </main>
  );
}
