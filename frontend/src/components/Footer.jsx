import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold tracking-tight text-white">
              NewsPortal
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              আপনার বিশ্বস্ত সত্য ও নিরপেক্ষ সংবাদের উৎস। দেশের ও দশের সর্বশেষ খবর সবার আগে জানতে আমাদের সাথেই থাকুন।
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#facebook" aria-label="Facebook" className="text-slate-400 hover:text-blue-500 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </a>
              <a href="#twitter" aria-label="Twitter" className="text-slate-400 hover:text-sky-400 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg>
              </a>
              <a href="#youtube" aria-label="YouTube" className="text-slate-400 hover:text-red-500 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">কুইক লিংকস</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/about" className="hover:text-white transition-colors">আমাদের সম্পর্কে</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">যোগাযোগ করুন</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors">প্রাইভেসি পলিসি</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">শর্তাবলী</a></li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">বিভাগসমূহ</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/news?category=national" className="hover:text-white transition-colors">জাতীয়</a></li>
              <li><a href="/news?category=international" className="hover:text-white transition-colors">আন্তর্জাতিক</a></li>
              <li><a href="/news?category=technology" className="hover:text-white transition-colors">প্রযুক্তি</a></li>
              <li><a href="/news?category=sports" className="hover:text-white transition-colors">খেলাধুলা</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">নিউজলেটার</h4>
            <p className="text-sm text-slate-400 mb-3">সবচেয়ে গুরুত্বপূর্ণ খবরগুলো সরাসরি আপনার ইমেইলে পেতে সাবস্ক্রাইব করুন।</p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input 
                type="email5" 
                placeholder="ваши email (আপনার ইমেইল)" 
                className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit" 
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                সাবস্ক্রাইব
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Copyright Section */}
        <div className="mt-10 border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} NewsPortal. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Designed with Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}