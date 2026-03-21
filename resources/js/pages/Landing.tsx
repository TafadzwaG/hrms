import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef, type ReactNode } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import heroImage from '@/assets/hero-team.jpg';
import {
  Search,
  MapPin,
  Briefcase,
  Users,
  ShieldCheck,
  LayoutDashboard,
  UserRound,
  ArrowRight,
  Globe,
  CheckCircle2,
  Menu,
  X,
  Upload,
  Zap,
  TrendingUp,
  Github,
  Twitter,
  Linkedin,
  Building2,
  Star,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Stats = {
  candidates: number;
  companies: number;
  vacancies: number;
};

type Vacancy = {
  id: number | string;
  title: string;
  company_name: string;
  location?: string | null;
  work_mode?: string | null;
};

type Props = {
  auth?: { user?: unknown | null };
  stats?: Stats;
  featuredVacancies?: Vacancy[];
};

const routes = {
  home: '/',
  browseJobs: '/candidate/register',
  talentPool: '/candidate/register',
  forCompanies: '/employer/register',
  pricing: '#pricing',
  login: '/login',
  dashboard: '/dashboard',
  candidateLogin: '/candidate/login',
  employerLogin: '/employer/login',
};

const defaultStats: Stats = {
  candidates: 12847,
  companies: 340,
  vacancies: 1923,
};

const defaultFeaturedVacancies: Vacancy[] = [
  { id: 1, title: 'Senior Product Engineer', company_name: 'Meridian Labs', location: 'Berlin', work_mode: 'Hybrid' },
  { id: 2, title: 'Growth Marketing Lead', company_name: 'Canopy Health', location: 'London', work_mode: 'Remote' },
  { id: 3, title: 'DevOps Architect', company_name: 'Stratos Inc', location: 'Singapore', work_mode: 'On-Site' },
  { id: 4, title: 'UX Research Director', company_name: 'Prism Digital', location: 'New York', work_mode: 'Remote' },
];

const navLinks = [
  { label: 'Browse Jobs', href: routes.browseJobs, isAnchor: false },
  { label: 'Talent Pool', href: routes.talentPool, isAnchor: false },
  { label: 'For Companies', href: routes.forCompanies, isAnchor: false },
  { label: 'Pricing', href: routes.pricing, isAnchor: true },
];

// --- Animated counter ---
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.floor(v).toLocaleString());
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(count, target, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
    });

    const unsub = rounded.on('change', (v) => setDisplay(v));

    return () => {
      controls.stop();
      unsub();
    };
  }, [isInView, target, count, rounded]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

// --- Scroll reveal wrapper ---
function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// --- Scrolling logo ticker ---
const partnerLogos = [
  'Meridian Labs',
  'Canopy Health',
  'Stratos Inc',
  'Prism Digital',
  'Vortex AI',
  'Northwave',
  'Petal Finance',
  'Lumen Studio',
  'Relay Logistics',
  'Cortex Labs',
  'Nimbus Tech',
  'Ascend Capital',
];

function LogoTicker() {
  return (
    <section className="py-12 border-t border-border overflow-hidden">
      <div className="container mx-auto px-6 mb-6">
        <Reveal>
          <p className="text-center text-xs font-mono tracking-widest uppercase text-muted-foreground">
            Trusted by leading organizations worldwide
          </p>
        </Reveal>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

        <motion.div
          className="flex gap-12 items-center whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        >
          {[...partnerLogos, ...partnerLogos].map((name, i) => (
            <span
              key={i}
              className="text-sm font-semibold text-muted-foreground/40 tracking-wide uppercase select-none"
            >
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// --- Navigation ---
function Navigation({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const portalHref = isAuthenticated ? routes.dashboard : routes.login;
  const portalLabel = isAuthenticated ? 'Dashboard' : 'Portal Login';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <Link href={routes.home} className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground tracking-tight">HRX Exchange</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) =>
            l.isAnchor ? (
              <a key={l.label} href={l.href} className="nav-link">
                {l.label}
              </a>
            ) : (
              <Link key={l.label} href={l.href} className="nav-link">
                {l.label}
              </Link>
            ),
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href={portalHref}>{portalLabel}</Link>
          </Button>

          <Button asChild variant="outline" size="sm">
            <Link href={routes.browseJobs}>
              <Upload className="h-3.5 w-3.5" />
              Upload CV
            </Link>
          </Button>

          <Button asChild size="sm">
            <Link href={routes.forCompanies}>Post a Job</Link>
          </Button>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-foreground" type="button">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl"
        >
          <div className="px-6 py-4 space-y-3">
            {navLinks.map((l) =>
              l.isAnchor ? (
                <a key={l.label} href={l.href} className="block py-2 nav-link">
                  {l.label}
                </a>
              ) : (
                <Link key={l.label} href={l.href} className="block py-2 nav-link">
                  {l.label}
                </Link>
              ),
            )}

            <Link href={portalHref} className="block py-2 nav-link">
              {portalLabel}
            </Link>

            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href={routes.browseJobs}>
                  <Upload className="h-3.5 w-3.5" />
                  Upload CV
                </Link>
              </Button>

              <Button asChild size="sm" className="w-full">
                <Link href={routes.forCompanies}>Post a Job</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}

// --- Hero Section ---
function HeroSection({ stats }: { stats: Stats }) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (location) params.set('location', location);
    router.visit(`/search?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/85 backdrop-blur-[2px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 py-28">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <div className="flex items-center justify-center gap-6 mb-8">
              <span className="flex items-center gap-2">
                <span className="ticker-pulse" />
                <span className="stat-number">{stats.vacancies.toLocaleString()}+ Live Exchanges</span>
              </span>
              <span className="hidden sm:inline-block w-px h-4 bg-border" />
              <span className="hidden sm:flex items-center gap-2">
                <span className="stat-number">{stats.companies.toLocaleString()}+ Partners</span>
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[0.95] mb-6 text-foreground">
              Find Talent. <span className="text-primary">Find Opportunity.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-lg sm:text-xl max-w-xl mx-auto mb-10 text-muted-foreground">
              The high-frequency marketplace for the global workforce. Verified, secure, and integrated into the HRX ecosystem.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row items-stretch gap-3 max-w-2xl mx-auto bg-background/90 backdrop-blur-md border border-border rounded-xl p-2 shadow-lg">
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Job title, skill, or keyword…"
                  className="bg-transparent outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="hidden sm:flex items-center gap-2 flex-1 px-3 border-l border-border">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Location or Remote"
                  className="bg-transparent outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <Button className="sm:px-8" onClick={handleSearch}>
                Search
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="flex items-center justify-center flex-wrap gap-2 mt-6">
              <span className="text-xs text-muted-foreground">Popular:</span>
              {['React', 'Remote', 'DevOps', 'Marketing', 'Design'].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setQuery(term);
                    router.visit(`/search?q=${term}`);
                  }}
                  className="px-3 py-1 rounded-full text-xs bg-background/60 border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors active:scale-95"
                >
                  {term}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// --- Big Stats ---
function StatsSection({ stats }: { stats: Stats }) {
  const bigStats = [
    { value: stats.candidates, suffix: '+', label: 'Active Candidates', icon: Users },
    { value: stats.companies, suffix: '+', label: 'Partner Companies', icon: Building2 },
    { value: stats.vacancies, suffix: '+', label: 'Live Job Listings', icon: Briefcase },
    { value: 96, suffix: '%', label: 'Placement Rate', icon: TrendingUp },
  ];

  return (
    <section className="py-16 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {bigStats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <div className="text-center group">
                <div className="h-10 w-10 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Hub Cards ---
const hubs = [
  {
    title: 'Candidate Hub',
    desc: 'Secure your professional identity, trade skills for global roles with one-click settle.',
    icon: UserRound,
    btn: 'Start My Journey',
    href: routes.browseJobs,
  },
  {
    title: 'Employer Hub',
    desc: 'Deploy roles across the exchange and leverage AI-powered liquidity for hiring.',
    icon: Building2,
    btn: 'Hire Talent',
    href: routes.forCompanies,
  },
  {
    title: 'System Portal',
    desc: 'Administrative governance and multi-tenant nodes for enterprise core operations.',
    icon: LayoutDashboard,
    btn: 'Go to Portal',
    href: routes.login,
  },
];

function HubCards() {
  return (
    <section id="hubs" className="py-24 relative">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="text-center mb-14">
            <p className="font-mono text-xs tracking-widest uppercase text-primary mb-3">// Choose Your Path</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">One Platform, Three Gateways</h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {hubs.map((hub, i) => (
            <Reveal key={hub.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className="group surface-elevated gradient-border rounded-xl p-8 flex flex-col h-full"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                  <hub.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2">{hub.title}</h3>
                <p className="text-sm leading-relaxed flex-1 mb-6 text-muted-foreground">{hub.desc}</p>

                <Button asChild variant="outline" size="sm" className="w-fit">
                  <Link href={hub.href}>
                    {hub.btn} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Live Opportunities ---
function JobsSection({ featuredVacancies }: { featuredVacancies: Vacancy[] }) {
  return (
    <section id="jobs" className="py-24 border-t border-border">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-2">Live Opportunities</h2>
              <p className="text-muted-foreground">Synced in real-time with the global HRX network.</p>
            </div>

            <Link href={routes.browseJobs}>
              <Button variant="ghost" className="hidden sm:inline-flex text-primary">
                View All Jobs <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredVacancies.slice(0, 4).map((job, i) => (
            <Reveal key={job.id} delay={i * 0.07}>
              <Link href={routes.browseJobs}>
                <motion.div
                  whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                  className="surface-elevated rounded-xl p-5 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center font-mono text-xs font-semibold text-primary">
                      {job.company_name.substring(0, 2).toUpperCase()}
                    </div>
                    <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                      Active
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">
                    {job.title}
                  </h3>

                  <p className="text-xs mb-3 text-muted-foreground">
                    {job.company_name} · {job.location || 'Remote'}
                  </p>

                  <Badge variant="secondary" className="text-[10px]">
                    {job.work_mode || 'Remote'}
                  </Badge>
                </motion.div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Testimonials ---
const testimonials = [
  {
    name: 'Sarah Okonkwo',
    role: 'Product Designer at Lumen Studio',
    quote: 'HRX matched me with my dream role in 72 hours. The process was seamless — from profile to offer letter.',
    rating: 5,
  },
  {
    name: 'Marcus Chen',
    role: 'CTO at Vortex AI',
    quote: 'We filled three senior engineering positions in under two weeks. The talent quality on HRX is unmatched.',
    rating: 5,
  },
  {
    name: 'Elena Vasquez',
    role: 'HR Director at Relay Logistics',
    quote: 'The exchange protocol completely transformed our hiring pipeline. Our time-to-hire dropped by 60%.',
    rating: 5,
  },
];

function TestimonialsSection() {
  return (
    <section className="py-24 border-t border-border">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="text-center mb-14">
            <p className="font-mono text-xs tracking-widest uppercase text-primary mb-3">// Success Stories</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">What People Are Saying</h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className="border border-border bg-card rounded-xl p-7 flex flex-col h-full"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>

                <p className="text-sm text-foreground leading-relaxed flex-1 mb-6">"{t.quote}"</p>

                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-sm text-primary">
                    {t.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Protocol Section ---
const steps = [
  {
    t: 'Synthesize',
    d: 'Create your verified digital twin profile once. AI scans your resume and builds a rich, searchable candidate profile.',
    icon: Zap,
  },
  {
    t: 'Exchange',
    d: 'Get matched through automated placement nodes. Our algorithm connects you with opportunities that fit your exact skill graph.',
    icon: Globe,
  },
  {
    t: 'Settle',
    d: 'Transparent onboarding into HRX core systems. From offer to day one, every step is tracked and streamlined.',
    icon: CheckCircle2,
  },
];

function ProtocolSection() {
  return (
    <section id="protocol" className="py-24 bg-secondary border-t border-b border-border relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <p className="font-mono text-xs tracking-widest uppercase text-primary mb-4">// How It Works</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-tight mb-6">
                The <span className="text-primary">Exchange</span> Protocol.
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-md mb-8">
                HRX operates on a high-velocity exchange protocol. We automate the friction between talent and opportunity.
              </p>

              <Link href={routes.browseJobs}>
                <Button>
                  Explore Jobs <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </Reveal>
          </div>

          <div className="space-y-6">
            {steps.map((step, idx) => (
              <Reveal key={step.t} delay={idx * 0.12}>
                <motion.div
                  whileHover={{ x: 6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                  className="flex items-start gap-5 group bg-background/60 backdrop-blur-sm border border-border rounded-xl p-6"
                >
                  <div className="h-12 w-12 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                    <step.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs text-primary/50">0{idx + 1}</span>
                      <h3 className="font-semibold text-foreground">{step.t}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.d}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// --- CTA Banner ---
function CTASection() {
  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="relative bg-primary rounded-2xl px-8 py-16 sm:px-16 text-center overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary-foreground/10" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-primary-foreground/5" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground tracking-tight mb-4">
                Ready to join the exchange?
              </h2>

              <p className="text-primary-foreground/80 max-w-md mx-auto mb-8">
                Whether you're hiring or looking, HRX connects you to the right match faster than any traditional platform.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button asChild size="lg" variant="secondary" className="active:scale-[0.97]">
                  <Link href={routes.browseJobs}>
                    <Upload className="h-4 w-4" />
                    Upload Your CV
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 active:scale-[0.97]"
                >
                  <Link href={routes.forCompanies}>
                    Post a Job <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// --- Footer ---
const footerLinks = [
  {
    heading: 'Platform',
    links: [
      { label: 'Browse Jobs', href: routes.browseJobs },
      { label: 'Talent Pool', href: routes.talentPool },
      { label: 'For Companies', href: routes.forCompanies },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Candidate Login', href: routes.candidateLogin },
      { label: 'Employer Login', href: routes.employerLogin },
      { label: 'System Portal', href: routes.login },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Get Started', href: routes.browseJobs },
      { label: 'Post a Job', href: routes.forCompanies },
      { label: 'Contact Us', href: routes.login },
    ],
  },
];

function Footer() {
  return (
    <footer className="pt-16 pb-8 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2">
            <Link href={routes.home} className="flex items-center gap-2.5 mb-4">
              <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
                <ShieldCheck className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground text-sm tracking-wide uppercase">HRX Exchange</span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Engineering the future of recruitment and talent management at global scale.
            </p>
          </div>

          {footerLinks.map((col) => (
            <div key={col.heading}>
              <h4 className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-4">{col.heading}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-border gap-4">
          <p className="font-mono text-xs text-muted-foreground tracking-wide">
            © {new Date().getFullYear()} HRX HUMAN RESOURCES EXCHANGE. ALL RIGHTS RESERVED.
          </p>

          <div className="flex items-center gap-4">
            {[Github, Twitter, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// --- Main Page ---
export default function Landing({ auth, stats, featuredVacancies }: Props) {
  const resolvedStats = stats ?? defaultStats;
  const resolvedFeaturedVacancies =
    featuredVacancies && featuredVacancies.length > 0 ? featuredVacancies : defaultFeaturedVacancies;
  const isAuthenticated = !!auth?.user;

  return (
    <>
      <Head title="HRX — Human Resources Exchange" />

      <div className="min-h-screen bg-background">
        <Navigation isAuthenticated={isAuthenticated} />
        <HeroSection stats={resolvedStats} />
        <LogoTicker />
        <StatsSection stats={resolvedStats} />
        <HubCards />
        <JobsSection featuredVacancies={resolvedFeaturedVacancies} />
        <TestimonialsSection />
        <ProtocolSection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}