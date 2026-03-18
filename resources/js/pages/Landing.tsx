import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, MapPin, Briefcase, Users, ShieldCheck, 
    LayoutDashboard, UserRound, ArrowRight, Globe, 
    Lock, CheckCircle2, Menu, X, Upload, Github, 
    Twitter, Linkedin, Building2, Star
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

const hoverCard = {
    initial: { scale: 1, y: 0 },
    hover: { 
        y: -12, 
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 10 } 
    }
};

type Props = {
    stats: { candidates: number; companies: number; vacancies: number };
    featuredVacancies: Array<any>;
    auth: { user: any };
};

export default function Landing({ stats, featuredVacancies, auth }: Props) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const isAuthenticated = !!auth?.user;
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head title="HRX — Human Resources Exchange" />

            <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
                
                {/* ===== NAVIGATION (Animated) ===== */}
                <motion.nav 
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
                        scrolled ? 'bg-white/90 backdrop-blur-md py-3 shadow-sm border-slate-200' : 'bg-transparent py-5 border-transparent'
                    }`}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center">
                            <Link href="/" className="flex items-center gap-2 group">
                                <motion.div 
                                    whileHover={{ rotate: 180 }}
                                    className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center transition-transform"
                                >
                                    <ShieldCheck className="text-white h-5 w-5" />
                                </motion.div>
                                <span className="font-black text-xl tracking-tighter text-slate-900 uppercase">
                                    HRX <span className="text-slate-400 font-medium italic">Exchange</span>
                                </span>
                            </Link>

                            <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-slate-500 uppercase tracking-tight">
                                {[
                                    { label: 'Browse Jobs', href: '/candidate/register' },
                                    { label: 'Talent Pool', href: '/candidate/register' },
                                    { label: 'For Companies', href: '/employer/register' },
                                    { label: 'Pricing', href: '#pricing' },
                                ].map((l) => (
                                    <Link key={l.label} href={l.href} className="hover:text-slate-900 transition-colors relative group">
                                        {l.label}
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-900 transition-all group-hover:w-full" />
                                    </Link>
                                ))}
                            </div>

                            <div className="hidden md:flex items-center space-x-4">
                                <Link href={isAuthenticated ? '/dashboard' : '/login'} className="text-sm font-bold text-slate-500 hover:text-slate-900 uppercase">
                                    {isAuthenticated ? 'Dashboard' : 'Portal Login'}
                                </Link>
                                <Button asChild variant="outline" className="rounded-xl border-slate-200 font-bold hover:bg-slate-100 transition-all active:scale-95">
                                    <Link href="/candidate/register">
                                        <Upload className="mr-2 h-4 w-4" /> Upload CV
                                    </Link>
                                </Button>
                                <Button asChild className="bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-lg active:scale-95 transition-transform">
                                    <Link href="/employer/register">Post a Job</Link>
                                </Button>
                            </div>

                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
                                {mobileMenuOpen ? <X /> : <Menu />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <AnimatePresence>
                        {mobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="md:hidden bg-white border-t border-slate-200 overflow-hidden"
                            >
                                <div className="px-4 py-6 space-y-2">
                                    <Link href="/candidate/register" className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 uppercase tracking-tight">Browse Jobs</Link>
                                    <Link href="/candidate/register" className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 uppercase tracking-tight">Talent Pool</Link>
                                    <Link href="/employer/register" className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 uppercase tracking-tight">For Companies</Link>
                                    <Link href={isAuthenticated ? '/dashboard' : '/login'} className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 uppercase tracking-tight">
                                        {isAuthenticated ? 'Dashboard' : 'Portal Login'}
                                    </Link>
                                    <div className="pt-4 space-y-3">
                                        <Button asChild variant="outline" className="w-full rounded-xl font-bold">
                                            <Link href="/candidate/register"><Upload className="mr-2 h-4 w-4" /> Upload CV</Link>
                                        </Button>
                                        <Button asChild className="w-full rounded-xl bg-slate-900 text-white font-bold">
                                            <Link href="/employer/register">Post a Job</Link>
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.nav>

                {/* ===== HERO SECTION ===== */}
                <main className="relative pt-48 pb-32 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-center max-w-4xl mx-auto"
                        >
                            <motion.div variants={itemVariants} className="flex justify-center gap-3 mb-12">
                                <Badge variant="outline" className="bg-white border-slate-200 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-slate-600 shadow-sm">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                                    {stats.vacancies.toLocaleString()}+ Live Exchanges
                                </Badge>
                                <Badge variant="outline" className="bg-white border-slate-200 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-slate-600 shadow-sm">
                                    {stats.companies.toLocaleString()}+ Partners
                                </Badge>
                            </motion.div>

                            <motion.h1 variants={itemVariants} className="text-7xl md:text-9xl font-black tracking-tighter text-slate-900 mb-8 leading-[0.85]">
                                Find Talent. <br />
                                <span className="text-slate-300">Find Opportunity.</span>
                            </motion.h1>

                            <motion.p variants={itemVariants} className="text-xl text-slate-500 mb-16 max-w-2xl mx-auto leading-relaxed font-medium">
                                The high-frequency marketplace for the global workforce. Verified, secure, and integrated into the <span className="text-slate-900 font-bold underline decoration-slate-300">HRX ecosystem</span>.
                            </motion.p>

                            {/* Search Bar with Floating Animation */}
                            <motion.div 
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                                className="p-2 bg-white rounded-[2rem] border border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] max-w-3xl mx-auto flex flex-col md:flex-row gap-2"
                            >
                                <div className="flex-1 flex items-center px-6 py-4">
                                    <Search className="text-slate-400 mr-3 h-5 w-5" />
                                    <Input className="border-none focus-visible:ring-0 p-0 text-slate-900 placeholder:text-slate-400 font-bold text-lg" placeholder="Job title or keywords" />
                                </div>
                                <div className="w-px bg-slate-100 hidden md:block h-10 my-auto" />
                                <div className="flex-1 flex items-center px-6 py-4">
                                    <MapPin className="text-slate-400 mr-3 h-5 w-5" />
                                    <Input className="border-none focus-visible:ring-0 p-0 text-slate-900 placeholder:text-slate-400 font-bold text-lg" placeholder="Location" />
                                </div>
                                <Button size="lg" className="bg-slate-900 text-white px-12 py-8 rounded-2xl font-black hover:bg-slate-800 transition-all text-lg uppercase tracking-widest active:scale-95">
                                    Search
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Background Decorative Element */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-slate-100/50 to-transparent -z-0 pointer-events-none" />
                </main>

                {/* ===== HUB CARDS (Icon Fix Applied) ===== */}
                <section className="py-24 bg-white relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {[
                                { title: 'Candidate Hub', desc: 'Secure your professional identity, trade skills for global roles with one-click settle.', icon: <UserRound />, btn: 'Start My Journey', href: '/candidate/register' },
                                { title: 'Employer Hub', desc: 'Deploy roles across the exchange and leverage AI-powered liquidity for hiring.', icon: <Briefcase />, btn: 'Hire Talent', href: '/employer/register' },
                                { title: 'System Portal', desc: 'Administrative governance and multi-tenant nodes for enterprise core operations.', icon: <LayoutDashboard />, btn: 'Go to Portal', href: '/login' },
                            ].map((hub, i) => (
                                <motion.div
                                    key={i}
                                    variants={hoverCard}
                                    initial="initial"
                                    whileHover="hover"
                                    className="group p-12 bg-slate-50 rounded-[3rem] border border-slate-100 flex flex-col justify-between transition-colors hover:bg-slate-950 duration-500"
                                >
                                    <div>
                                        {/* ICON FIX: Ensure stroke color transitions to white on parent hover */}
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-10 shadow-sm border border-slate-100 group-hover:bg-slate-800 transition-colors duration-500">
                                            <div className="text-slate-950 group-hover:text-white transition-colors duration-500">
                                                {hub.icon}
                                            </div>
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-900 group-hover:text-white mb-6 tracking-tighter transition-colors duration-500">{hub.title}</h3>
                                        <p className="text-slate-500 group-hover:text-slate-400 mb-12 leading-relaxed font-medium text-lg transition-colors duration-500">{hub.desc}</p>
                                    </div>
                                    <Button asChild variant="outline" className="w-full py-7 border-slate-200 rounded-2xl font-black text-slate-900 group-hover:bg-white group-hover:text-slate-950 group-hover:border-white transition-all duration-500 uppercase tracking-widest">
                                        <Link href={hub.href}>{hub.btn}</Link>
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ===== TRENDING SECTION ===== */}
                <section className="py-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
                            <motion.div 
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Live Opportunities</h2>
                                <p className="text-slate-500 font-bold text-lg">Synced in real-time with the global HRX network.</p>
                            </motion.div>
                            <Link className="text-sm font-black text-slate-900 flex items-center gap-2 hover:gap-4 transition-all uppercase tracking-widest" href="/candidate/register">
                                View All Jobs <ArrowRight className="h-5 w-5" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {featuredVacancies.slice(0, 4).map((job, i) => (
                                <Link key={i} href="/candidate/register">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        className="p-10 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all cursor-pointer group"
                                    >
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center font-black text-white text-xs group-hover:scale-110 transition-transform">
                                                {job.company_name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <Badge className="bg-slate-100 text-slate-900 border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">Active</Badge>
                                        </div>
                                        <h4 className="font-black text-slate-900 text-xl mb-2 group-hover:underline underline-offset-4 tracking-tight">{job.title}</h4>
                                        <p className="text-sm font-bold text-slate-400 mb-8 uppercase tracking-tight">{job.company_name} • {job.location || 'Remote'}</p>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="outline" className="px-4 py-1 text-[10px] font-black text-slate-500 rounded-full border-slate-100 uppercase bg-slate-50">{job.work_mode || 'Remote'}</Badge>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ===== HOW IT WORKS (Simplified Dark Section) ===== */}
                <section className="py-32 bg-slate-950 text-white">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                <div className="absolute -top-20 -left-20 w-64 h-64 bg-slate-800/20 rounded-full blur-[100px]" />
                                <h2 className="text-7xl md:text-8xl font-black mb-8 tracking-tighter uppercase leading-none">The <br /> Protocol.</h2>
                                <p className="text-slate-400 text-xl font-medium leading-relaxed">
                                    HRX operates on a high-velocity exchange protocol. We automate the friction between talent and opportunity.
                                </p>
                            </motion.div>
                            <div className="space-y-12">
                                {[
                                    { t: 'Synthesize', d: 'Create your digital twin profile once.' },
                                    { t: 'Exchange', d: 'Secure placement through automated nodes.' },
                                    { t: 'Settle', d: 'Transparent onboarding into HRX core.' }
                                ].map((step, idx) => (
                                    <motion.div 
                                        key={idx} 
                                        initial={{ x: 50, opacity: 0 }}
                                        whileInView={{ x: 0, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.2 }}
                                        className="flex gap-8 group"
                                    >
                                        <div className="text-4xl font-black text-slate-800 group-hover:text-white transition-colors italic">0{idx + 1}</div>
                                        <div>
                                            <h4 className="text-2xl font-black uppercase tracking-tight mb-2">{step.t}</h4>
                                            <p className="text-slate-400 font-medium">{step.d}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== FOOTER ===== */}
                <footer className="bg-white pt-32 pb-12 border-t border-slate-200">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-16 mb-24">
                            <div className="col-span-2">
                                <Link href="/" className="flex items-center gap-2 mb-8">
                                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                                        <ShieldCheck className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="font-black text-2xl tracking-tighter text-slate-900 uppercase">HRX EXCHANGE</span>
                                </Link>
                                <p className="text-slate-400 font-bold max-w-xs leading-relaxed uppercase text-xs tracking-widest">
                                    Engineering the future of recruitment and talent management for a global scale.
                                </p>
                            </div>
                            <div>
                                <h5 className="font-black text-slate-900 mb-8 text-[10px] uppercase tracking-[0.3em]">Platform</h5>
                                <ul className="space-y-4 text-sm text-slate-500 font-black">
                                    <li><Link href="/candidate/register" className="hover:text-slate-950 transition-colors uppercase tracking-tight">Browse Jobs</Link></li>
                                    <li><Link href="/candidate/register" className="hover:text-slate-950 transition-colors uppercase tracking-tight">Talent Pool</Link></li>
                                    <li><Link href="/employer/register" className="hover:text-slate-950 transition-colors uppercase tracking-tight">For Companies</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="font-black text-slate-900 mb-8 text-[10px] uppercase tracking-[0.3em]">Company</h5>
                                <ul className="space-y-4 text-sm text-slate-500 font-black">
                                    <li><Link href="/candidate/login" className="hover:text-slate-950 transition-colors uppercase tracking-tight">Candidate Login</Link></li>
                                    <li><Link href="/employer/login" className="hover:text-slate-950 transition-colors uppercase tracking-tight">Employer Login</Link></li>
                                    <li><Link href="/login" className="hover:text-slate-950 transition-colors uppercase tracking-tight">System Portal</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="font-black text-slate-900 mb-8 text-[10px] uppercase tracking-[0.3em]">Support</h5>
                                <ul className="space-y-4 text-sm text-slate-500 font-black">
                                    <li><Link href="/candidate/register" className="hover:text-slate-950 transition-colors uppercase tracking-tight">Get Started</Link></li>
                                    <li><Link href="/employer/register" className="hover:text-slate-950 transition-colors uppercase tracking-tight">Post a Job</Link></li>
                                    <li><Link href="/login" className="hover:text-slate-950 transition-colors uppercase tracking-tight">Contact Us</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                © {currentYear} HRX HUMAN RESOURCES EXCHANGE. ALL RIGHTS RESERVED.
                            </p>
                            <div className="flex gap-8 items-center text-slate-400">
                                <Twitter className="h-5 w-5 hover:text-slate-900 cursor-pointer" />
                                <Linkedin className="h-5 w-5 hover:text-slate-900 cursor-pointer" />
                                <Github className="h-5 w-5 hover:text-slate-900 cursor-pointer" />
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}