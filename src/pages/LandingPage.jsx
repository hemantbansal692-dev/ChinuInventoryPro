import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  BarChart3, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  TrendingUp, 
  Users2, 
  Wallet, 
  Store,
  History,
  LayoutDashboard,
  SmartphoneNfc
} from "lucide-react";  

export default function LandingPage() {

    const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-700">
      
      {/* ─── PREMIUM NAVIGATION ─── */}
        <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-8 py-5">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:bg-blue-700 transition-all">
                <Store className="text-white" size={22} />
                </div>
                <span className="text-2xl font-black tracking-tighter text-slate-900">
                CHINU<span className="text-blue-600">.</span>
                </span>
            </div>
            
            <div className="hidden md:flex items-center gap-10 text-sm font-bold text-slate-500 uppercase tracking-widest">
                <a href="#features" className="hover:text-blue-600 transition-colors">Platform</a>
                <a href="#impact" className="hover:text-blue-600 transition-colors">Impact</a>
                <button
                    onClick={() => navigate("/login")}
                    className="px-6 py-3 rounded-xl bg-slate-900 text-white hover:bg-blue-600 transition-all shadow-xl active:scale-95"
                    >
                    Open Dashboard
                </button>
            </div>
            </div>
        </nav>

      {/* ─── HERO: THE POWER OF EASE ─── */}
      <section className="relative pt-48 pb-24 px-6 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.85] mb-8 tracking-tighter">
              Run your shop. <br />
              <span className="text-blue-600">Without the noise.</span>
            </h1>

            <p className="text-xl text-slate-500 mb-10 leading-relaxed max-w-lg font-medium">
              Chinu is the command center for modern retailers. We handle the complexity of inventory and orders, so you can focus on building your brand.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 active:scale-95">
                Get Started for Free <ArrowRight size={20} />
              </button>
              <button className="px-8 py-5 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-bold text-lg hover:border-blue-200 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-2">
                Explore Features
              </button>
            </div>
            
            <div className="mt-10 flex gap-8 text-slate-400">
               <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                 <Zap size={16} className="text-amber-400 fill-amber-400"/> Instant Sync
               </div>
               <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                 <History size={16} className="text-blue-400"/> Auto-Backups
               </div>
            </div>
          </motion.div>

          {/* Immersive Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative lg:ml-10"
          >
            <div className="relative z-10 bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100 p-3">
              <div className="rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 aspect-[4/3] flex flex-col">
                 <div className="h-12 bg-white border-b border-slate-100 flex items-center px-6 justify-between">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-200"/>
                      <div className="w-2 h-2 rounded-full bg-slate-200"/>
                    </div>
                    <div className="w-32 h-2 bg-slate-100 rounded-full"/>
                 </div>
                 <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="h-24 bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                          <div className="w-8 h-1 bg-blue-500 rounded-full mb-3"/>
                          <div className="w-16 h-4 bg-slate-100 rounded-full"/>
                       </div>
                       <div className="h-24 bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                          <div className="w-8 h-1 bg-emerald-500 rounded-full mb-3"/>
                          <div className="w-16 h-4 bg-slate-100 rounded-full"/>
                       </div>
                    </div>
                    <div className="h-40 bg-white rounded-2xl shadow-sm border border-slate-100 w-full animate-pulse"/>
                 </div>
              </div>
            </div>
            {/* Decorative Element */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-100 rounded-full blur-[80px] opacity-50 -z-10" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-100 rounded-full blur-[80px] opacity-50 -z-10" />
          </motion.div>
        </div>
      </section>

      {/* ─── CORE PHILOSOPHY: EASE ─── */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-20">
            <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">The Platform</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              Designed to make your <br /> workday feel shorter.
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            <FeatureItem 
              icon={<LayoutDashboard className="text-blue-600" size={32}/>}
              title="One-Screen Clarity"
              desc="No more jumping between tabs. Your inventory, orders, and balances live in one unified interface."
            />
            <FeatureItem 
              icon={<SmartphoneNfc className="text-blue-600" size={32}/>}
              title="Business on the Go"
              desc="Check stock or approve orders from your phone while you're away. Your shop stays in your pocket."
            />
            <FeatureItem 
              icon={<Wallet className="text-blue-600" size={32}/>}
              title="Cash Flow Visibility"
              desc="Instantly see who owes you and what you're owed. Clear data for clear decisions."
            />
          </div>
        </div>
      </section>

      {/* ─── IMPACT SECTION ─── */}
      <section id="impact" className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h3 className="text-4xl font-black mb-8">Less management, <br/> more momentum.</h3>
            <div className="space-y-8">
              <ImpactRow 
                value="95%" 
                label="Reduction in manual data entry errors."
              />
              <ImpactRow 
                value="2hrs" 
                label="Average daily time saved by shop owners."
              />
              <ImpactRow 
                value="100%" 
                label="Real-time visibility into every single SKU."
              />
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-full border border-white/10 flex items-center justify-center p-12">
               <div className="aspect-square w-full rounded-full border border-white/20 flex items-center justify-center p-12">
                  <TrendingUp size={100} className="text-blue-500 opacity-50" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CALL ─── */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-8 shadow-inner">
            <Store size={32} />
          </div>
          <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Ready to ease into growth?</h2>
          <p className="text-slate-500 text-xl mb-12 font-medium">
            Join the shops that are leaving the stress behind. Start your 14-day free trial today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="px-12 py-5 bg-blue-600 text-white rounded-2xl font-bold text-xl shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
              Launch My Shop
            </button>
          </div>
          <p className="mt-8 text-slate-400 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500"/> No complex setup required
          </p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-slate-100 py-16 px-8 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2 mb-8 md:mb-0">
             <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center">
               <Store size={14} className="text-white" />
             </div>
             <span className="text-slate-900">CHINU.IO</span>
          </div>
          <div className="flex gap-10">
             <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
             <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
             <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureItem({ icon, title, desc }) {
  return (
    <div className="group">
      <div className="mb-8 transform group-hover:scale-110 transition-transform duration-300 origin-left">
        {icon}
      </div>
      <h4 className="text-2xl font-black text-slate-900 mb-4">{title}</h4>
      <p className="text-slate-500 leading-relaxed font-medium">
        {desc}
      </p>
    </div>
  );
}

function ImpactRow({ value, label }) {
  return (
    <div className="flex items-start gap-6">
      <span className="text-4xl font-black text-blue-500 min-w-[80px]">{value}</span>
      <p className="text-slate-400 font-medium leading-tight">{label}</p>
    </div>
  );
}