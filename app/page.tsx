import { Fragment } from "react";
import Image from "next/image";
import { ArrowUpRight, BadgeCheck, Github, Linkedin, Mail } from "lucide-react";
import { AskPalette } from "@/components/AskPalette";
import { GitHubContributions } from "@/components/GitHubContributions";
import { HeaderDropdown } from "@/components/HeaderDropdown";
import { LightboxGallery } from "@/components/LightboxGallery";
import { VisitorPresence } from "@/components/VisitorPresence";
import { certificates, profile, projects, skills, timeline } from "@/data/portfolio";

const sectionClass = "mx-auto w-full max-w-6xl px-5 py-16 sm:px-8";
const beyondCodeTags = ["Visual design", "Music", "Games", "Learning", "Quiet reset"];
const beyondCodePhotos = [
  { src: "/profile/hero-face.jpg", alt: `${profile.name} portrait`, rotation: "-rotate-6", hover: "group-hover:-rotate-9 group-hover:-translate-x-2" },
  { src: "/profile/avatar.jpg", alt: `${profile.name} casual portrait`, rotation: "rotate-3", hover: "group-hover:rotate-6 group-hover:translate-x-2" },
  { src: "/profile/hero-face.jpg", alt: `${profile.name} profile photo`, rotation: "-rotate-2", hover: "group-hover:-rotate-4 group-hover:translate-y-2" }
];
const avatarSlices = Array.from({ length: 8 }, (_, index) => index);

export default function Home() {
  const githubUser = process.env.NEXT_PUBLIC_GITHUB_USERNAME || profile.github;

  return (
    <main>
      <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur dark:border-moss dark:bg-ink/90">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-8">
          <a href="/" className="text-xs font-semibold tracking-[0.14em] text-ink dark:text-paper sm:text-sm">
            {profile.name}
          </a>
          <div className="hidden items-center gap-5 text-sm text-steel md:flex">
            <a href="#projects" className="hover:text-ink dark:text-paper dark:hover:text-moss">Projects</a>
            <a href="#skills" className="hover:text-ink dark:text-paper dark:hover:text-moss">Skills</a>
            <a href="#certificates" className="hover:text-ink dark:text-paper dark:hover:text-moss">Certificates</a>
            <a href="#contact" className="hover:text-ink dark:text-paper dark:hover:text-moss">Contact</a>
          </div>
          <div className="flex items-center gap-2">
            <AskPalette />
            <HeaderDropdown />
          </div>
        </nav>
      </header>

      <section className={`${sectionClass} flex min-h-[68vh] items-center`}>
        <div className="w-full max-w-5xl space-y-9">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-center">
            <div className="group relative w-32 shrink-0 sm:w-40">
              <div className="absolute -inset-2 rounded-full bg-white/70 shadow-sm dark:bg-paper/10" />
              <button
                type="button"
                className="focus-ring avatar-swap relative block w-full overflow-hidden rounded-full border border-line bg-white shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-soft dark:border-moss dark:bg-ink"
                aria-label="Toggle portrait style"
              >
                <div className="relative aspect-square">
                  <Image
                    src="/profile/hero-face.jpg"
                    alt={`${profile.name} portrait`}
                    fill
                    priority
                    sizes="160px"
                    className="scale-110 object-cover object-top transition duration-700 group-hover:scale-[1.16] group-focus-within:scale-[1.16]"
                  />
                  <div className="absolute inset-0" aria-hidden>
                    {avatarSlices.map((slice) => (
                      <span
                        key={slice}
                        className="avatar-slice absolute top-0 h-full"
                        style={{
                          left: `${slice * 12.5}%`,
                          width: "12.5%",
                          backgroundImage: "url('/profile/avatar.jpg')",
                          backgroundPosition: `${slice === 0 ? 0 : (slice / 7) * 100}% center`,
                          transitionDelay: `${slice * 45}ms`
                        }}
                      />
                    ))}
                  </div>
                  <span className="avatar-scan absolute inset-y-0 -left-1/3 w-1/3 rotate-12 bg-white/25 blur-md" aria-hidden />
                </div>
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-semibold leading-tight text-ink dark:text-paper sm:text-5xl">{profile.name}</h1>
                <BadgeCheck className="h-7 w-7 fill-[#1d9bf0] text-white" aria-hidden />
              </div>
              <div className="flex gap-3 text-steel dark:text-paper">
                <a className="transition hover:text-ink dark:hover:text-moss" href={`https://github.com/${githubUser}`} aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </a>
                <a className="transition hover:text-ink dark:hover:text-moss" href={profile.linkedin} aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a className="transition hover:text-ink dark:hover:text-moss" href={`mailto:${profile.email}`} aria-label="Email">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="max-w-5xl space-y-7">
            <VisitorPresence />
            <h2 className="text-4xl font-light leading-tight text-ink dark:text-paper sm:text-5xl">
              Web Developer <span className="text-steel dark:text-paper">— Next.js &amp; PHP</span>
            </h2>
            <p className="max-w-4xl text-xl leading-9 text-steel dark:text-paper">
              I build practical web systems across frontend, backend, databases, and deployment with{" "}
              <span className="inline-flex rounded-full border border-line bg-white px-3 py-1 text-base text-ink dark:border-moss dark:bg-ink dark:text-paper">Next.js</span>
              ,{" "}
              <span className="inline-flex rounded-full border border-line bg-white px-3 py-1 text-base text-ink dark:border-moss dark:bg-ink dark:text-paper">React</span>
              ,{" "}
              <span className="inline-flex rounded-full border border-line bg-white px-3 py-1 text-base text-ink dark:border-moss dark:bg-ink dark:text-paper">Supabase</span>
              , and PHP/MySQL.
            </p>
            <div className="flex flex-wrap gap-3">
              <a className="focus-ring min-h-11 rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white dark:bg-paper dark:text-ink" href="#projects">
                View Projects
              </a>
              <a className="focus-ring min-h-11 rounded-lg border border-line bg-white px-5 py-3 text-sm font-semibold text-ink dark:border-moss dark:bg-ink dark:text-paper" href={`mailto:${profile.email}`}>
                Contact Me
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className={`${sectionClass} border-t border-line dark:border-moss`}>
        <div className="grid gap-8 md:grid-cols-[0.7fr_1.3fr]">
          <h2 className="text-2xl font-semibold dark:text-paper">About</h2>
          <p className="text-lg leading-8 text-steel dark:text-paper">
            I am a developer working on practical, real-world projects across frontend, backend, database, and deployment work.
            My current experience includes Officium / Marajo Group work in a general, non-confidential capacity, plus portfolio
            projects like PharSayo and academic systems. I enjoy building systems that are clear, useful, and maintainable.
          </p>
        </div>
      </section>

      <section className={`${sectionClass} border-t border-line dark:border-moss`}>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <SectionHeading eyebrow="Beyond the code" title="Outside the editor" />
            <p className="mt-6 max-w-2xl text-lg leading-8 text-steel dark:text-paper">
              I like keeping a little room for creative resets outside development, from visual ideas and music to casual games
              and learning things that make the next build feel sharper.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {beyondCodeTags.map((tag) => (
                <span key={tag} className="rounded-full border border-line bg-white px-4 py-2 text-sm text-steel dark:border-moss dark:bg-ink dark:text-paper">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="group grid gap-4 sm:grid-cols-3 lg:relative lg:min-h-[24rem] lg:block">
            {beyondCodePhotos.map((photo, index) => (
              <div
                key={`${photo.src}-${index}`}
                className={`relative aspect-[4/5] overflow-hidden rounded-xl border border-line bg-white p-2 shadow-soft transition duration-300 dark:border-moss dark:bg-ink lg:absolute lg:w-[42%] ${photo.rotation} ${photo.hover} ${
                  index === 0 ? "lg:left-6 lg:top-8" : index === 1 ? "lg:left-[30%] lg:top-0" : "lg:right-6 lg:top-16"
                }`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 260px, (min-width: 640px) 30vw, 80vw"
                  className="rounded-lg object-cover object-top p-2"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className={sectionClass}>
        <SectionHeading eyebrow="Selected work" title="Projects" />
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {projects.map((project) =>
            project.name === "NC III Graphic Design Work" ? (
              <Fragment key={project.name}>
                {/* Temporarily hidden: <ProjectCard project={project} /> */}
              </Fragment>
            ) : (
              <ProjectCard key={project.name} project={project} />
            )
          )}
        </div>
      </section>

      <section id="skills" className={`${sectionClass} border-y border-line dark:border-moss`}>
        <SectionHeading eyebrow="Capabilities" title="Skills" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((skill) => (
            <div key={skill.group} className="rounded-lg border border-line bg-white p-5 dark:border-moss dark:bg-ink dark:text-paper">
              <h3 className="font-semibold text-ink dark:text-paper">{skill.group}</h3>
              <ul className="mt-4 space-y-2 text-sm text-steel dark:text-paper">
                {skill.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="certificates" className={sectionClass}>
        <div className="flex items-center justify-between gap-4">
          <SectionHeading eyebrow="Proof of work" title="Certificates" />
          <a className="hidden text-sm font-medium text-steel transition hover:text-moss dark:text-paper sm:inline-flex" href="#certificates">
            View All →
          </a>
        </div>
        <div className="mt-10 space-y-12">
          {certificates.map((certificate) => (
            <CertificateRow key={`${certificate.name}-${certificate.date}`} certificate={certificate} />
          ))}
        </div>
      </section>

      {/*
      <section id="design" className={`${sectionClass} border-y border-line dark:border-moss`}>
        <SectionHeading eyebrow="Visual work" title="Design Samples" />
        <div className="mt-8">
          <LightboxGallery items={designSamples} type="design" />
        </div>
      </section>
      */}

      <section className={sectionClass}>
        <SectionHeading eyebrow="Activity" title="GitHub Contributions" />
        <div className="mt-8 grid gap-4">
          <GitHubContributions username={githubUser} />
        </div>
      </section>

      <section className={`${sectionClass} border-y border-line dark:border-moss`}>
        <SectionHeading eyebrow="Timeline" title="Experience" />
        <div className="mt-8 space-y-0 border-l border-line dark:border-moss">
          {timeline.map((item) => (
            <div key={`${item.year}-${item.title}`} className="relative pb-8 pl-6">
              <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-moss" />
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-coral">{item.year}</p>
              <h3 className="mt-2 text-lg font-semibold text-ink dark:text-paper">{item.title}</h3>
              <p className="mt-2 max-w-2xl leading-7 text-steel dark:text-paper">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer id="contact" className={sectionClass}>
        <div className="flex flex-col justify-between gap-6 border-t border-line pt-8 dark:border-moss md:flex-row md:items-end">
          <div>
            <p className="text-2xl font-semibold text-ink dark:text-paper">Let&apos;s build something useful.</p>
            <p className="mt-2 text-steel dark:text-paper">{profile.location}</p>
          </div>
          <div className="flex gap-3">
            <a className="focus-ring min-h-11 min-w-11 rounded-full border border-line bg-white p-3 text-ink dark:border-moss dark:bg-ink dark:text-paper" href={`mailto:${profile.email}`} aria-label="Email">
              <Mail className="h-5 w-5" />
            </a>
            <a className="focus-ring min-h-11 min-w-11 rounded-full border border-line bg-white p-3 text-ink dark:border-moss dark:bg-ink dark:text-paper" href={`https://github.com/${githubUser}`} aria-label="GitHub">
              <Github className="h-5 w-5" />
            </a>
            <a className="focus-ring min-h-11 min-w-11 rounded-full border border-line bg-white p-3 text-ink dark:border-moss dark:bg-ink dark:text-paper" href={profile.linkedin} aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-moss">{eyebrow}</p>
      <h2 className="text-3xl font-semibold text-ink dark:text-paper sm:text-4xl">{title}</h2>
    </div>
  );
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-line bg-white text-ink shadow-sm transition duration-300 hover:-translate-y-1 hover:border-moss hover:shadow-soft dark:border-moss dark:bg-ink dark:text-paper">
      <div className="relative aspect-[16/10] bg-[#ebe6da] p-3">
        <Image
          src={project.image}
          alt={`${project.name} preview`}
          fill
          className="object-contain p-3 transition duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-moss">{project.status}</p>
            <h3 className="mt-1 text-xl font-semibold text-ink dark:text-paper">{project.name}</h3>
          </div>
          {project.href ? (
            <a className="focus-ring min-h-11 min-w-11 rounded-full border border-line p-2 hover:border-moss dark:border-moss dark:text-paper" href={project.href} aria-label={`Open ${project.name}`}>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          ) : (
            <span className="rounded-full border border-line px-3 py-1 text-xs font-medium text-steel dark:border-moss dark:text-paper" aria-label={`${project.name} is private and not deployed`}>
              Private
            </span>
          )}
        </div>
        <p className="leading-7 text-steel dark:text-paper">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <span key={item} className="rounded-full border border-line px-3 py-1 text-xs text-steel dark:border-moss dark:text-paper">{item}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

function CertificateRow({ certificate }: { certificate: (typeof certificates)[number] }) {
  return (
    <article className="grid gap-4 border-b border-line pb-10 last:border-b-0 last:pb-0 dark:border-moss sm:grid-cols-[11rem_1fr]">
      <p className="text-sm font-semibold text-steel dark:text-paper">{certificate.date}</p>
      <div className="space-y-3">
        <h3 className="max-w-3xl text-xl font-semibold leading-7 text-ink dark:text-paper">{certificate.name}</h3>
        <div className="space-y-1">
          <p className="text-lg text-steel dark:text-paper">{certificate.issuer}</p>
          {certificate.verifyUrl ? <p className="text-sm text-steel dark:text-paper">{certificate.verifyUrl}</p> : null}
        </div>
        <a
          href={certificate.fileUrl || certificate.image}
          target="_blank"
          rel="noreferrer"
          className="group inline-block overflow-hidden rounded-md border border-line bg-white p-1 transition hover:-translate-y-0.5 hover:border-moss hover:shadow-soft dark:border-moss dark:bg-ink"
          aria-label={`Open ${certificate.name}`}
        >
          <span className="relative block h-16 w-28 overflow-hidden rounded bg-[#ebe6da]">
            <Image
              src={certificate.image}
              alt={`${certificate.name} preview`}
              fill
              sizes="112px"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          </span>
        </a>
      </div>
    </article>
  );
}
