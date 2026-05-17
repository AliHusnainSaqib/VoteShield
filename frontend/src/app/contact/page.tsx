"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Phone, Mail, X } from "lucide-react";

export default function ContactPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex-1 min-h-screen flex items-center justify-center relative overflow-hidden bg-[linear-gradient(135deg,#064e3b_0%,#0f766e_50%,#042f2e_100%)]">
      
      {/* Decorative crystal/poly background mesh effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='a' patternUnits='userSpaceOnUse' width='100' height='100'%3E%3Cpath d='M50 0L100 50L50 100L0 50Z' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cpath d='M0 0L50 50L0 100' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cpath d='M100 0L50 50L100 100' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23a)'/%3E%3C/svg%3E")`,
        backgroundSize: '100px 100px'
      }}></div>

      <div className="w-full max-w-6xl px-6 py-12 md:px-12 z-10">
        <div className="flex flex-col lg:flex-row gap-10 items-center justify-between">
          
          {/* Left Column: Text Content */}
          <div className="flex flex-col text-white">
            <span className="text-[#6ee7b7] font-bold tracking-widest text-sm mb-4 uppercase">Contact Us</span>
            <h1 className="text-4xl md:text-6xl font-extrabold font-serif mb-6 leading-tight">
              Reach Out With Your Enquiries
            </h1>
            <p className="text-[#e2e8f0] text-lg mb-10 leading-relaxed font-sans max-w-lg">
              Our support team is available to assist citizens, election officials, and auditors with any technical or protocol-related questions regarding VoteShield.
            </p>
            
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Phone className="text-[#6ee7b7] w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-[#e2e8f0] mb-1">Official Support Line</p>
                  <p className="font-semibold text-xl">+92 51 920 1234</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Mail className="text-[#6ee7b7] w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-[#e2e8f0] mb-1">General Inquiries</p>
                  <p className="font-semibold text-xl">support@voteshield.gov</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Glassmorphism Form Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl relative"
          >
            <form onSubmit={(e) => { e.preventDefault(); setIsOpen(true); }} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-white text-sm font-medium">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  required
                  className="w-full min-h-[48px] bg-white text-slate-900 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#10b981] transition-all"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-white text-sm font-medium">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  required
                  className="w-full min-h-[48px] bg-white text-slate-900 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#10b981] transition-all"
                  placeholder="name@example.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-white text-sm font-medium">Your Message</label>
                <textarea 
                  id="message" 
                  required
                  rows={4}
                  className="w-full min-h-[48px] bg-white text-slate-900 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#10b981] transition-all resize-none"
                  placeholder="How can we help you today?"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="bg-[#10b981] hover:bg-[#059669] text-white font-medium py-3 px-6 min-h-[48px] rounded-full flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl mt-2"
              >
                Send Message <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
          
        </div>
      </div>

      {/* Submission Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            ></motion.div>
            
            {/* Modal Box */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full relative z-10 shadow-2xl flex flex-col items-center text-center"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors bg-slate-100 hover:bg-slate-200 rounded-full p-2"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                <Send className="w-8 h-8 ml-1" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Message Sent!</h3>
              <p className="text-slate-600 leading-relaxed">
                Thank you! Your form has been successfully submitted. Our team will review your query and respond within 24 hours.
              </p>
              
              <button 
                onClick={() => setIsOpen(false)}
                className="mt-8 w-full bg-[#064e3b] text-white py-3 rounded-full font-semibold hover:bg-[#043528] transition-colors"
              >
                Close Window
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
