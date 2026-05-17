"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full px-6 py-4 flex flex-col md:flex-row md:items-center justify-between text-white sticky top-0 z-50 shadow-md bg-[#0D4D38]">
      <div className="flex items-center justify-between w-full md:w-auto">
        <Link href="/" className="text-2xl font-bold tracking-tighter text-white z-10 hover:text-[#5A7D7C] transition-colors duration-300">
          VoteShield
        </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="block md:hidden text-white focus:outline-none p-2"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Links */}
      <nav className="hidden md:flex items-center gap-6 font-medium text-white z-10">
        <Link href="/transparency" className="hover:text-[#5A7D7C] transition-colors duration-300">Transparency Hub</Link>
        <Link href="/vote" className="hover:text-[#5A7D7C] transition-colors duration-300">Vote Portal</Link>
        <Link href="/admin/dashboard" className="hover:text-[#5A7D7C] transition-colors duration-300">Admin</Link>
        <Link href="/contact" className="hover:text-[#5A7D7C] transition-colors duration-300">Contact Us</Link>
      </nav>

      {/* Mobile Dropdown Navigation Panel */}
      {isOpen && (
        <nav className="absolute top-full left-0 w-full bg-[#0D4D38] border-t border-emerald-800 flex flex-col p-4 gap-4 z-50 shadow-lg text-white md:hidden">
          <Link href="/transparency" onClick={() => setIsOpen(false)} className="hover:text-[#5A7D7C] py-2 font-medium transition-colors duration-300">Transparency Hub</Link>
          <Link href="/vote" onClick={() => setIsOpen(false)} className="hover:text-[#5A7D7C] py-2 font-medium transition-colors duration-300">Vote Portal</Link>
          <Link href="/admin/dashboard" onClick={() => setIsOpen(false)} className="hover:text-[#5A7D7C] py-2 font-medium transition-colors duration-300">Admin</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)} className="hover:text-[#5A7D7C] py-2 font-medium transition-colors duration-300">Contact Us</Link>
        </nav>
      )}
    </header>
  );
}
