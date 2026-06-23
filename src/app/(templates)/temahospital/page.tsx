"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Activity, Heart, Bone, Baby, PlayCircle } from "lucide-react";

export default function TemaHospital() {
  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans text-[#1a1a1a] overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-50">
        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg">+</div>
          MabroHospital
        </div>
        <div className="hidden lg:flex items-center gap-10 text-sm font-semibold text-gray-600">
          <Link href="#" className="text-black flex items-center gap-1">Home <span className="w-1.5 h-1.5 bg-blue-600 rounded-full inline-block ml-1"></span></Link>
          <Link href="#" className="hover:text-black transition-colors">About Us</Link>
          <Link href="#" className="hover:text-black transition-colors">Departments</Link>
          <Link href="#" className="hover:text-black transition-colors">Patient Care</Link>
        </div>
        <div className="hidden lg:flex items-center gap-4">
           <button className="px-6 py-2.5 rounded-full border border-gray-300 text-sm font-bold hover:border-black transition-colors">Login</button>
           <button className="px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors">Register</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 px-6 text-center">
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="inline-flex items-center gap-3 bg-white px-5 py-2 rounded-full shadow-sm mb-12 border border-gray-100"
        >
           <span className="w-2 h-2 rounded-full bg-orange-500"></span>
           <span className="text-xs font-bold tracking-widest uppercase">High quality patient care</span>
        </motion.div>

        <div className="relative max-w-5xl mx-auto flex flex-col items-center justify-center mb-16">
           {/* CTA Left overlapping */}
           <motion.button 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.3 }}
             className="absolute left-0 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-3 rounded-full font-bold flex items-center gap-3 hover:bg-blue-700 shadow-lg hidden md:flex"
           >
              Get A Consult <div className="w-6 h-6 rounded-full bg-white text-blue-600 flex items-center justify-center"><ArrowRight size={14} /></div>
           </motion.button>
           
           <h1 className="text-6xl md:text-[110px] font-black tracking-tighter leading-[0.9] text-[#1a1a1a] z-10 relative">
             Healing
           </h1>
           <div className="flex items-end justify-center gap-6 mt-2 relative z-10">
              <h1 className="text-6xl md:text-[110px] font-black tracking-tighter text-transparent bg-clip-text" style={{ WebkitTextStroke: '2px #d1d5db' }}>
                Tomorrow
              </h1>
              <p className="text-left text-sm font-bold text-gray-500 max-w-[140px] leading-tight pb-4 hidden md:block">
                World-class healthcare solutions
              </p>
           </div>
           
           {/* Decorative abstract pill */}
           <div className="absolute top-10 left-1/4 w-20 h-6 rounded-full bg-yellow-400/80 -rotate-12 blur-sm -z-10"></div>
        </div>

        {/* Massive Hero Image */}
        <div className="max-w-7xl mx-auto relative px-2">
           <motion.div 
             initial={{ opacity: 0, y: 40 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2, duration: 0.8 }}
             className="relative w-full h-[500px] md:h-[650px] rounded-[3rem] overflow-hidden shadow-2xl"
           >
              <Image src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1600&auto=format&fit=crop" alt="Doctors Team" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/10"></div>
           </motion.div>

           {/* Overlapping Info Card */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.6 }}
             className="absolute bottom-8 right-8 md:bottom-12 md:right-12 bg-white/95 backdrop-blur-md p-8 rounded-[2rem] max-w-sm shadow-xl"
           >
              <h3 className="text-xl font-bold mb-4 leading-snug">Advanced diagnostics and rapid treatment for optimal recovery</h3>
              <a href="#" className="inline-flex items-center gap-3 text-sm font-bold text-blue-600 hover:gap-4 transition-all bg-blue-50 px-5 py-3 rounded-2xl">
                 Learn More About Our Process <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center"><ArrowRight size={14} /></div>
              </a>
           </motion.div>
        </div>
      </section>

      {/* ABOUT US SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-6">
           <span className="bg-orange-100 text-orange-600 text-xs font-bold px-4 py-2 rounded-full tracking-widest uppercase">About Us</span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-[64px] font-black tracking-tight leading-tight mb-16 max-w-4xl">
           Trusted partner for over 20 years <span className="text-gray-300">of healthcare excellence</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
           <div className="lg:col-span-5 relative">
              {/* Overlapping Avatars */}
              <div className="flex -space-x-4 mb-8">
                 {[
                   "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=150&auto=format&fit=crop",
                   "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=150&auto=format&fit=crop",
                   "https://images.unsplash.com/photo-1594824436998-d8869c944369?q=80&w=150&auto=format&fit=crop",
                   "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=150&auto=format&fit=crop"
                 ].map((img, i) => (
                    <div key={i} className="w-16 h-16 rounded-full border-4 border-[#f8f9fa] overflow-hidden relative shadow-sm">
                       <Image src={img} alt="Doctor" fill className="object-cover" />
                    </div>
                 ))}
              </div>
              
              <div className="relative w-full md:w-[350px] h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl z-10">
                 <Image src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=800&auto=format&fit=crop" alt="Surgeon" fill className="object-cover" />
              </div>
           </div>

           <div className="lg:col-span-7 pl-0 lg:pl-12">
              <p className="text-gray-500 font-medium mb-16 max-w-md ml-auto text-right">
                 We are committed to quality healthcare and patient satisfaction, ensuring a comfortable journey to recovery.
              </p>
              <p className="text-gray-500 leading-relaxed mb-12 max-w-xl text-sm">
                 Our hospital excels in delivering premium medical services tailored to meet the diverse needs of patients, from consultations to complex surgeries.
              </p>
              <div className="grid grid-cols-2 gap-8">
                 <div>
                    <h4 className="text-5xl md:text-[64px] font-black tracking-tighter mb-2">1M<span className="text-orange-500">+</span></h4>
                    <p className="text-gray-500 text-sm font-medium">Patients treated with care</p>
                 </div>
                 <div>
                    <h4 className="text-5xl md:text-[64px] font-black tracking-tighter mb-2">98<span className="text-orange-500">%</span></h4>
                    <p className="text-gray-500 text-sm font-medium">Patient recovery rate</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* SERVICES (DARK SECTION) */}
      <section className="bg-[#0f1115] text-white rounded-t-[4rem] rounded-b-[4rem] py-32 px-6 mt-12 mx-2 md:mx-6 shadow-2xl relative overflow-hidden">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
            
            <div className="flex flex-col justify-between">
               <div>
                  <span className="bg-yellow-500/20 text-yellow-500 text-xs font-bold px-4 py-2 rounded-full tracking-widest uppercase mb-8 inline-block">Our Departments</span>
                  <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-8">
                     Comprehensive Medical Services
                  </h2>
               </div>
               <div className="flex items-center gap-4 mt-8 lg:mt-0">
                  <button className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center hover:bg-white hover:text-black transition-colors"><ChevronLeft size={20} /></button>
                  <button className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors"><ChevronRight size={20} /></button>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
               {[
                 { icon: <Heart size={24}/>, title: "Cardiology", desc: "Expert care for complex heart conditions." },
                 { icon: <Activity size={24}/>, title: "Neurology", desc: "Advanced diagnostics for nervous system." },
                 { icon: <Bone size={24}/>, title: "Orthopedics", desc: "Bone, joint, and muscle specialized treatments." },
                 { icon: <Baby size={24}/>, title: "Pediatrics", desc: "Compassionate care for children and infants." }
               ].map((svc, i) => (
                  <div key={i} className="border-t border-gray-800 pt-8 group cursor-pointer">
                     <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                        {svc.icon}
                     </div>
                     <h4 className="text-xl font-bold mb-3">{svc.title}</h4>
                     <p className="text-gray-400 text-sm leading-relaxed">{svc.desc}</p>
                  </div>
               ))}
            </div>

         </div>
      </section>

      {/* CUSTOMER STORIES */}
      <section className="max-w-7xl mx-auto px-6 py-32">
         <div className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-20 relative">
            <div className="relative">
               <h2 className="text-6xl md:text-[80px] font-black tracking-tighter leading-[0.9]">
                  Patient
               </h2>
               <div className="flex items-center gap-4 relative">
                  <h2 className="text-6xl md:text-[80px] font-black tracking-tighter text-transparent bg-clip-text" style={{ WebkitTextStroke: '2px #d1d5db' }}>
                     Stories
                  </h2>
                  <span className="bg-yellow-400 text-black text-[10px] font-bold px-3 py-1 rounded-full absolute -right-16 top-0 rotate-12">Success</span>
               </div>
            </div>
            
            <div className="max-w-xs text-right">
               <p className="text-sm font-medium text-gray-500 mb-6">Exploring the Transformative impact of our treatments on Patients</p>
               <div className="flex items-center justify-end gap-3">
                  <button className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition-colors"><ChevronLeft size={18} /></button>
                  <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"><ChevronRight size={18} /></button>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
               { img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop", name: "David Clark", title: "Heart Surgery Patient" },
               { img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop", name: "John Smith", title: "Orthopedic Patient" },
               { img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop", name: "Jane Doe", title: "Maternity Care" }
            ].map((story, i) => (
               <div key={i} className="relative group cursor-pointer h-[400px]">
                  <div className="absolute inset-0 rounded-[2rem] overflow-hidden">
                     <Image src={story.img} alt={story.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                     <div className="absolute inset-0 bg-black/20"></div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 bg-white rounded-2xl p-4 flex justify-between items-center shadow-lg">
                     <div>
                        <h4 className="font-bold text-sm">{story.name}</h4>
                        <p className="text-gray-500 text-xs">{story.title}</p>
                     </div>
                     <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <PlayCircle size={20} className="fill-current" />
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative py-32 overflow-hidden border-t border-gray-200/60">
         {/* Circular wireframes background */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-dashed border-gray-300 -z-10"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-gray-200 -z-10"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-gray-100 bg-white shadow-2xl -z-10"></div>

         <div className="max-w-4xl mx-auto px-6 text-center relative">
            {/* Floating Image 1 */}
            <div className="absolute -left-32 top-10 w-48 h-56 rounded-[2rem] overflow-hidden shadow-2xl hidden lg:block border-4 border-white">
               <Image src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=400&auto=format&fit=crop" alt="Nurse" fill className="object-cover" />
            </div>
            
            {/* Floating Image 2 */}
            <div className="absolute -right-32 -top-10 w-48 h-48 rounded-full overflow-hidden shadow-2xl hidden lg:block border-4 border-white">
               <Image src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?q=80&w=400&auto=format&fit=crop" alt="Medical Tech" fill className="object-cover" />
            </div>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Ready To Prioritize<br/>Your Health?</h2>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-10 leading-relaxed">Let's discuss how we can help you achieve optimal wellness today.</p>
            <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold inline-flex items-center gap-3 hover:bg-blue-700 shadow-xl shadow-blue-600/30 transition-all">
               Book Appointment <div className="w-6 h-6 rounded-full bg-white text-blue-600 flex items-center justify-center"><ArrowRight size={14} /></div>
            </button>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white pt-24 pb-8 overflow-hidden relative">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32 relative z-10">
            <h2 className="text-4xl md:text-[44px] font-black tracking-tight leading-tight max-w-sm">
               Building Tomorrow's Healthy Stories
            </h2>
            <div className="bg-white p-2 rounded-full border border-gray-200 shadow-sm flex items-center justify-between max-w-md ml-auto w-full">
               <input type="email" placeholder="Enter your email" className="bg-transparent border-none outline-none pl-6 text-sm w-full" />
               <button className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 hover:bg-blue-700 transition-colors">
                  <ArrowRight size={18} />
               </button>
            </div>
         </div>

         {/* Giant Watermark */}
         <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full text-center select-none pointer-events-none overflow-hidden whitespace-nowrap opacity-[0.03]">
            <h1 className="text-[150px] md:text-[250px] font-black tracking-tighter">[HOSPITAL]</h1>
         </div>

         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs font-semibold text-gray-500 gap-6 border-t border-gray-100 pt-8 relative z-10">
            <div className="flex gap-6">
               <a href="#" className="hover:text-black">FB</a>
               <a href="#" className="hover:text-black">TW</a>
               <a href="#" className="hover:text-black">IN</a>
               <a href="#" className="hover:text-black">IG</a>
            </div>
            <p>© Copyright 2026, All Rights Reserved</p>
            <div className="flex gap-6">
               <a href="#" className="hover:text-black">Privacy Policy</a>
               <a href="#" className="hover:text-black">Terms & Conditions</a>
               <a href="#" className="hover:text-black">Support</a>
            </div>
         </div>
      </footer>
    </div>
  );
}
