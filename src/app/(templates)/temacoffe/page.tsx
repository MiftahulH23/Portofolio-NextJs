"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Coffee, HeadphonesIcon, Hexagon } from "lucide-react";

export default function TemaCoffee() {
  return (
    <div className="bg-white min-h-screen font-sans text-[#1a1a1a]">
      {/* NAVBAR */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <Hexagon className="text-primary fill-primary" />
          MabroCoffee
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="#" className="text-black font-semibold border-b-2 border-black pb-1">Home</Link>
          <Link href="#" className="hover:text-black transition-colors">Menu</Link>
          <Link href="#" className="hover:text-black transition-colors">About</Link>
          <Link href="#" className="hover:text-black transition-colors">Blog</Link>
          <Link href="#" className="hover:text-black transition-colors">Contact</Link>
        </div>
        <div className="hidden md:block">
           <button className="text-sm font-bold opacity-0">Hidden Spacer</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative">
        
        {/* Abstract Lines Background (Left) */}
        <div className="absolute top-0 left-0 w-1/3 h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
           <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full stroke-gray-200" fill="none" strokeWidth="1">
             <path d="M0,50 Q100,100 200,50" />
             <path d="M0,70 Q100,120 200,70" />
             <path d="M0,90 Q100,140 200,90" />
             <path d="M0,110 Q100,160 200,110" />
             <path d="M0,130 Q100,180 200,130" />
           </svg>
        </div>

        <div className="max-w-xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            We Serve Great <br /> Coffee Every Day
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-lg mb-10 max-w-sm leading-relaxed"
          >
            Our carefully crafted beverages and warm atmosphere provide the perfect combination for your daily routine.
          </motion.p>
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#111827] text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            Explore Menu
          </motion.button>
        </div>

        {/* Hero Collage */}
        <div className="relative h-[600px] w-full hidden md:block">
          {/* Dot Pattern */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-8 grid grid-cols-4 gap-2 opacity-20">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-black rounded-full" />
            ))}
          </div>

          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.7 }}
             className="absolute top-0 right-12 w-64 h-80 rounded-[40px] rounded-bl-none overflow-hidden shadow-2xl z-10"
          >
            <Image src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop" alt="Coffee Shop" fill className="object-cover" />
          </motion.div>
          
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.7, delay: 0.2 }}
             className="absolute top-32 left-8 w-48 h-48 rounded-[40px] rounded-br-none overflow-hidden shadow-xl z-20 border-8 border-white"
          >
            <Image src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600&auto=format&fit=crop" alt="Pouring Coffee" fill className="object-cover" />
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.7, delay: 0.4 }}
             className="absolute bottom-12 right-24 w-72 h-64 rounded-[40px] rounded-tl-none overflow-hidden shadow-2xl z-10"
          >
            <Image src="https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=800&auto=format&fit=crop" alt="Barista" fill className="object-cover" />
          </motion.div>
        </div>
      </section>

      {/* ABOUT US SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-12">
          <p className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-widest">About us</p>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">We are more than a Coffee Shop</h2>
        </div>

        {/* Collage - Full width */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[500px] mb-16">
           <div className="relative rounded-2xl overflow-hidden h-[300px] md:h-full">
              <Image src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop" alt="Cafe Interior" fill className="object-cover" />
           </div>
           <div className="grid grid-rows-2 gap-6 h-[500px] md:h-full">
              <div className="relative rounded-2xl overflow-hidden">
                 <Image src="https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800&auto=format&fit=crop" alt="Coffee Brewing" fill className="object-cover" />
              </div>
              <div className="relative rounded-2xl overflow-hidden">
                 <Image src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=800&auto=format&fit=crop" alt="Latte Art" fill className="object-cover" />
              </div>
           </div>
           <div className="relative rounded-2xl overflow-hidden h-[300px] md:h-full">
              <Image src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop" alt="Barista Working" fill className="object-cover" />
           </div>
        </div>

        {/* Text blocks - Below the collage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
           <div>
              <h3 className="text-3xl font-bold mb-6">Who are we</h3>
              <p className="text-gray-500 leading-relaxed mb-8">
                We're a team of passionate baristas and roasters helping coffee lovers find their perfect cup. We conduct a thorough review of our beans against a variety of best practices and quality criteria to ensure every drop satisfies your cravings.
              </p>
              <a href="#" className="font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">Learn More <ArrowRight size={16} /></a>
           </div>
           <div>
              <h3 className="text-3xl font-bold mb-6">What we do</h3>
              <p className="text-gray-500 leading-relaxed mb-8">
                To achieve the ideal coffee experience for your daily routine, we recommend conducting user research, experiencing different origins, and tasting activities to gather insights. We craft our menu based on what our community loves most.
              </p>
              <a href="#" className="font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">Learn More <ArrowRight size={16} /></a>
           </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="bg-gray-50/50 py-24">
         <div className="max-w-7xl mx-auto px-6 text-center mb-16">
            <p className="text-sm font-bold text-gray-500 mb-4">Our Services</p>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">We are Master of Coffee Brewers</h2>
         </div>
         <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Espresso Bar", "Pour Over Station", "Cold Brews",
              "Artisan Pastries", "Coffee Roasting", "Barista Classes"
            ].map((service, idx) => (
              <div key={idx} className={`p-6 border border-gray-100 rounded-xl flex justify-between items-center cursor-pointer transition-all shadow-sm ${idx === 3 ? 'bg-[#111827] text-white shadow-xl' : 'bg-white hover:border-gray-300'}`}>
                 <span className="font-semibold">{service}</span>
                 <ArrowRight size={20} className={idx === 3 ? 'text-white' : 'text-gray-400'} />
              </div>
            ))}
         </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
         <div>
            <p className="text-sm font-bold text-gray-500 mb-4">Why Choose us</p>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-8">
               Premium Beans<br/>& Exceptional Service
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
               If it doesn't exist already, we'll recommend an assessment of the factors outside your daily routine that might impact your mood. Our coffee shop is the best career option and it provides long-term opportunities in comparison to some other shops which are boring.
            </p>
            <button className="bg-[#111827] text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors">
               Schedule A Tasting
            </button>
         </div>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-100 shadow-xl shadow-gray-200/50 p-8 rounded-2xl relative translate-y-8">
               <Coffee size={40} className="mb-6 text-[#111827]" />
               <h4 className="font-bold text-lg mb-4 uppercase tracking-wide">Quality Beans</h4>
               <p className="text-gray-500 text-sm leading-relaxed">
                 Customer analytics use to capture and analyze customer data to make better decisions. These insights power businesses' sales.
               </p>
            </div>
            <div className="bg-white border border-gray-100 shadow-xl shadow-gray-200/50 p-8 rounded-2xl">
               <HeadphonesIcon size={40} className="mb-6 text-[#111827]" />
               <h4 className="font-bold text-lg mb-4 uppercase tracking-wide">Cozy Space</h4>
               <p className="text-gray-500 text-sm leading-relaxed">
                 A support company should have an excellent working knowledge of hardware and software structures. Moreover to establish trust.
               </p>
            </div>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0b0f19] text-white pt-20 pb-10">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
               <div className="flex items-center gap-2 font-bold text-xl tracking-tight mb-6">
                 <Hexagon className="text-white fill-white" />
                 MabroCoffee
               </div>
               <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                 We're a team of passionate baristas and roasters helping coffee lovers find their perfect cup.
               </p>
            </div>
            <div>
               <h5 className="font-bold mb-6 tracking-widest text-sm uppercase">About Us</h5>
               <ul className="space-y-4 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Who We Are</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Our Team</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
               </ul>
            </div>
            <div>
               <h5 className="font-bold mb-6 tracking-widest text-sm uppercase">Resources</h5>
               <ul className="space-y-4 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Locations</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-6 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2026 MabroCoffee. All rights reserved.</p>
            <div className="flex items-center gap-6">
               <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
         </div>
      </footer>
    </div>
  );
}
