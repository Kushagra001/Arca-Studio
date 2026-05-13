import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Tag } from "@/components/ui/Tag";
import { CASE_STUDIES, getCaseStudy, WORK_PROJECTS } from "@/lib/projects";

// Replace with sanity.fetch() for production.
const projects = CASE_STUDIES;

export function generateStaticParams() {
  return WORK_PROJECTS.map((project) => ({ slug: project.slug }));
}

const projectShots: Record<string, string> = {
  flow: "/project-shots/flow-home.png",
  arca: "/project-shots/arca-home.png",
  medica: "/project-shots/medica-home.png",
  kern: "/project-shots/kern-home.png",
};

const projectShotPosition: Record<string, string> = {
  flow: "center top",
  arca: "center top",
  medica: "center top",
  kern: "center top",
};

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getCaseStudy(slug);
  if (!project) return notFound();

  const currentIndex = WORK_PROJECTS.findIndex((p) => p.slug === slug);
  const next = WORK_PROJECTS[(currentIndex + 1) % WORK_PROJECTS.length];
  const screenshot = projectShots[slug];

  return (
    <main className="px-8 md:px-16 py-32 bg-paper text-ink">
      <div className="max-w-4xl mx-auto">
        <Link href="/#work" className="text-[12px] text-dim hover:text-ink transition-colors" data-magnetic>
          {"<-"} All work
        </Link>

        <div className="mt-8 flex flex-wrap gap-2">
          <Tag>{project.clientType}</Tag>
          <Tag>{project.year}</Tag>
          {project.services.map((service) => <Tag key={service}>{service}</Tag>)}
        </div>

        <h1 className="mt-8 font-display text-[46px] md:text-[72px] leading-[0.95]">{project.title}</h1>

        <div className="mt-10 w-full aspect-video relative overflow-hidden bg-mist border border-stone">
          {screenshot ? (
            <Image
              src={screenshot}
              alt={`${project.title} project screenshot`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover"
              style={{ objectPosition: projectShotPosition[slug] ?? "center top" }}
            />
          ) : null}
        </div>

        <div className="mt-8 grid md:grid-cols-4 gap-4 text-[12px] text-dim">
          <div><p className="text-dust">Client</p><p className="text-ink mt-1">{project.clientType}</p></div>
          <div><p className="text-dust">Year</p><p className="text-ink mt-1">{project.year}</p></div>
          <div><p className="text-dust">Services</p><p className="text-ink mt-1">{project.services.join(", ")}</p></div>
          <div><p className="text-dust">Live</p><a className="text-ink mt-1 underline" href={project.liveUrl} target="_blank">Visit site</a></div>
        </div>

        <p className="mt-10 text-[17px] leading-relaxed text-dim max-w-3xl">{project.overview}</p>

        <section className="mt-14">
          <h2 className="font-display text-[34px]">The brief</h2>
          <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-dim">
            {project.brief.map((line) => <p key={line}>{line}</p>)}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-[34px]">What we built</h2>
          <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-dim">
            {project.solution.map((line) => <p key={line}>{line}</p>)}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.services.map((service) => <Tag key={service}>{service}</Tag>)}
          </div>
        </section>

        <section className="mt-16 grid md:grid-cols-3 gap-4">
          {project.resultStats.map((stat) => (
            <div key={stat.label} className="border border-stone p-5">
              <p className="font-display text-[38px] leading-none">{stat.value}</p>
              <p className="text-[12px] text-dim mt-2">{stat.label}</p>
            </div>
          ))}
        </section>

        <section className="mt-16 grid md:grid-cols-2 gap-4">
          <div className="aspect-4/3 relative overflow-hidden bg-mist border border-stone">
            {screenshot ? (
              <Image
                src={screenshot}
                alt={`${project.title} project detail screenshot`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                style={{ objectPosition: "center center" }}
              />
            ) : null}
          </div>
          <div className="aspect-4/3 relative overflow-hidden bg-mist border border-stone">
            {screenshot ? (
              <Image
                src={screenshot}
                alt={`${project.title} project detail screenshot crop`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                style={{ objectPosition: "center bottom" }}
              />
            ) : null}
          </div>
        </section>

        <Link href={`/work/${next.slug}`} className="block mt-16 border border-stone p-8 hover:bg-mist transition-colors" data-magnetic>
          <p className="text-[12px] text-dust">Next project</p>
          <p className="font-display text-[36px] mt-2">Next {"->"} {next.name}</p>
        </Link>
      </div>
    </main>
  );
}
