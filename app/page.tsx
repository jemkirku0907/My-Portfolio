import Image from "next/image";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { AskPalette } from "@/components/AskPalette";
import { GitHubContributions } from "@/components/GitHubContributions";
import { HeaderDropdown } from "@/components/HeaderDropdown";
import { LightboxGallery } from "@/components/LightboxGallery";
import { VisitorPresence } from "@/components/VisitorPresence";
import { certificates, designSamples, profile, projects, skills, timeline } from "@/data/portfolio";

const sectionClass = "mx-auto w-full max-w-6xl px-5 py-16 sm:px-8";

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

      <section className={`${sectionClass} grid min-h-[78vh] content-center gap-10 lg:grid-cols-[0.72fr_1fr] lg:items-center`}>
        <div className="relative mx-auto w-full max-w-[18rem] sm:max-w-xs lg:order-none lg:max-w-sm">
          <div className="absolute -inset-3 rounded-[2rem] bg-white/70 dark:bg-paper/10" />
          <div className="relative overflow-hidden rounded-[1.6rem] border border-transparent bg-white shadow-sm dark:border-moss dark:bg-ink">
            <div className="relative aspect-[4/5]">
              <Image
                src="/profile/hero-face.jpg"
                alt={`${profile.name} portrait`}
                fill
                priority
                sizes="(min-width: 1024px) 360px, 80vw"
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>
        <div className="max-w-3xl space-y-8">
          <VisitorPresence />
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-moss">{profile.title}</p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] text-ink dark:text-paper sm:text-7xl">{profile.name}</h1>
            <p className="max-w-2xl text-xl leading-8 text-steel dark:text-paper">{profile.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a className="focus-ring min-h-11 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white dark:bg-paper dark:text-ink" href="#projects">
              View Projects
            </a>
            <a className="focus-ring min-h-11 rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-ink dark:border-moss dark:bg-ink dark:text-paper" href={`mailto:${profile.email}`}>
              Contact Me
            </a>
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

      <section id="projects" className={sectionClass}>
        <SectionHeading eyebrow="Selected work" title="Projects" />
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <article key={project.name} className="group overflow-hidden rounded-lg border border-line bg-white text-ink shadow-sm transition duration-300 hover:-translate-y-1 hover:border-moss hover:shadow-soft dark:border-moss dark:bg-ink dark:text-paper">
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
          ))}
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
        <SectionHeading eyebrow="Proof of work" title="Certificates" />
        <div className="mt-8">
          <LightboxGallery items={certificates} type="certificates" />
        </div>
      </section>

      <section id="design" className={`${sectionClass} border-y border-line dark:border-moss`}>
        <SectionHeading eyebrow="Visual work" title="Design Samples" />
        <div className="mt-8">
          <LightboxGallery items={designSamples} type="design" />
        </div>
      </section>

      <section className={sectionClass}>
        <SectionHeading eyebrow="Activity" title="GitHub Contributions" />
        <div className="mt-8 grid gap-4">
          <GitHubContributions username={githubUser} />
          <a
            href={`https://github.com/${githubUser}`}
            target="_blank"
            rel="noreferrer"
            className="group overflow-hidden rounded-lg border border-line bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-moss hover:shadow-soft dark:border-moss dark:bg-ink"
            aria-label={`${githubUser} GitHub stats`}
          >
            <img
              src={`https://github-readme-stats.vercel.app/api?username=${githubUser}&show_icons=true&hide_border=true&theme=default`}
              alt={`${githubUser} GitHub stats`}
              className="h-auto w-full"
            />
          </a>
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
