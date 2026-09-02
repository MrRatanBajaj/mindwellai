import { motion } from "framer-motion";
import { User, Compass, Stethoscope, Code2, Quote } from "lucide-react";
import BrandLogo from "@/components/layout/BrandLogo";

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

interface Member {
  name: string;
  role: string;
  info: string;
  image?: string;
}

const groups: { heading: string; caption: string; icon: typeof User; members: Member[] }[] = [
  {
    heading: "Founding team",
    caption: "The people who carry the first version of this on their backs.",
    icon: Compass,
    members: [
      {
        name: "Ratan Bajaj",
        role: "Founder, CEO",
        info: "Sets the product direction and the safety line it can never cross.",
        image: "/founder-image.jpg",
      },
      { name: "Open seat", role: "Co-founder, Clinical", info: "Owns therapeutic quality end to end." },
      { name: "Open seat", role: "Founding Engineer", info: "Voice, chat and the systems underneath them." },
    ],
  },
  {
    heading: "Clinical council",
    caption: "Reviews framing, escalation and every claim we make.",
    icon: Stethoscope,
    members: [
      { name: "Open seat", role: "Clinical Psychologist", info: "CBT / DBT / ACT protocol review." },
      { name: "Open seat", role: "Psychiatric Advisor", info: "DSM-5 & ICD-11 language and thresholds." },
      { name: "Open seat", role: "Crisis Lead", info: "Risk detection and helpline routing." },
    ],
  },
  {
    heading: "Advisory board",
    caption: "Outside eyes who are free to tell us we are wrong.",
    icon: User,
    members: [
      { name: "Open seat", role: "Ethics Advisor", info: "Consent, privacy and vulnerable users." },
      { name: "Open seat", role: "Public Health Advisor", info: "Access, affordability and reach." },
      { name: "Open seat", role: "Lived-Experience Advisor", info: "Reviews tone before anything ships." },
    ],
  },
  {
    heading: "Product & engineering",
    caption: "Builds it, measures it, and takes it down when it misbehaves.",
    icon: Code2,
    members: [
      { name: "Open seat", role: "Product Designer", info: "Calm interfaces, low-arousal interaction." },
      { name: "Open seat", role: "Backend Engineer", info: "Privacy-first data and access control." },
      { name: "Open seat", role: "Evaluation Engineer", info: "Latency, accuracy and adherence scoring." },
    ],
  },
];

const TeamShowcase = () => (
  <section className="bg-background px-6 py-20">
    <div className="mx-auto max-w-5xl">
      {/* Big top block */}
      <motion.div
        {...fadeUp}
        className="relative overflow-hidden rounded-[2.5rem] border border-border/50 bg-gradient-to-br from-calm-sage-light/60 via-calm-sky/25 to-calm-lavender/35 p-8 md:p-14"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-calm-sage/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-calm-lavender/25 blur-3xl" />

        <div className="relative">
          <BrandLogo size={48} withText={false} />
          <h2 className="mt-6 max-w-3xl font-display text-3xl font-bold leading-tight text-foreground md:text-5xl">
            A small team, a very old problem.
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            We are building the kind of support we wish existed at 3 a.m. — steady, private and never in a hurry. Below
            is the shape of the team: who is here, and the seats we are still filling.
          </p>

          {/* Team image block */}
          <div className="mt-9 overflow-hidden rounded-3xl border border-border/40 bg-card/70 backdrop-blur-md">
            <div className="grid gap-0 sm:grid-cols-3">
              {["Listening", "Building", "Reviewing"].map((label, i) => (
                <div
                  key={label}
                  className="flex aspect-[4/3] flex-col items-center justify-center gap-3 border-border/40 p-6 text-center sm:aspect-auto sm:min-h-[190px] sm:border-r last:sm:border-r-0"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-calm-sage/15">
                    {[User, Code2, Stethoscope][i]({ className: "w-5 h-5 text-calm-sage" } as never)}
                  </div>
                  <p className="font-display text-lg text-foreground">{label}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Team photography arrives as each seat is filled.
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Signature — bottom right */}
          <div className="mt-8 flex justify-end">
            <div className="text-right">
              <p className="font-hand text-4xl leading-none text-calm-sage">Ratan Bajaj</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">Founder &amp; CEO</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Section-wise team */}
      <div className="mt-8 space-y-6">
        {groups.map((g, gi) => (
          <motion.div
            key={g.heading}
            {...fadeUp}
            transition={{ duration: 0.5, delay: gi * 0.05 }}
            className="rounded-[2rem] border border-border/50 bg-card p-7 md:p-9"
          >
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-calm-sage/15">
                <g.icon className="h-5 w-5 text-calm-sage" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold">{g.heading}</h3>
                <p className="text-sm text-muted-foreground">{g.caption}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.members.map((m) => (
                <div
                  key={`${g.heading}-${m.role}`}
                  className="group rounded-2xl border border-border/50 bg-background p-5 transition-shadow hover:shadow-lg"
                >
                  <div className="mb-4 h-28 w-full overflow-hidden rounded-xl bg-gradient-to-br from-calm-sage-light/70 to-calm-sky/40">
                    {m.image ? (
                      <img
                        src={m.image}
                        alt={`${m.name}, ${m.role}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="h-7 w-7 text-calm-sage/60" />
                      </div>
                    )}
                  </div>
                  <p className="font-semibold text-foreground">{m.name}</p>
                  <p className="text-sm text-calm-sage">{m.role}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{m.info}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        {...fadeUp}
        className="mt-8 flex items-start gap-4 rounded-[2rem] border border-dashed border-border p-7"
      >
        <Quote className="mt-1 h-5 w-5 shrink-0 text-calm-sage" />
        <p className="text-sm leading-relaxed text-muted-foreground">
          We would rather show you empty seats honestly than fill this page with faces that do not exist. If one of these
          roles is your life's work, write to us.
        </p>
      </motion.div>
    </div>
  </section>
);

export default TeamShowcase;
