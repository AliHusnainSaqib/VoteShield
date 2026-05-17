"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanFace, CheckCircle2, MapPin, ShieldCheck } from "lucide-react";

export default function VotePortal() {
  const [step, setStep] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      setTimeout(() => {
        nextStep();
      }, 800); // Move to next step shortly after success
    }, 2500); // 2.5s scanning simulation
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 relative overflow-hidden min-h-screen">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50 opacity-50 skew-x-12 transform origin-top-right z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white p-10 rounded-3xl shadow-xl z-10 border border-slate-100"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Secure Voting Portal</h1>
          <p className="text-slate-500 mt-2">AI-verified, end-to-end encrypted ballot casting.</p>
        </div>

        {/* Stepper (Shows 3 steps, 4th is success) */}
        <div className="flex gap-2 mb-10">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${step >= i ? 'bg-primary' : 'bg-slate-100'}`} />
          ))}
        </div>

        <div className="min-h-[350px]">
          <AnimatePresence mode="wait">
            {/* STEP 1: IDENTITY VERIFICATION */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center h-full text-center"
              >
                <h2 className="text-xl font-semibold mb-2 text-slate-800">Step 1: Identity Verification</h2>
                <p className="text-slate-500 mb-8 text-sm">Please position your face in the camera frame for biometric verification.</p>
                
                <div className="relative w-48 h-48 mb-8 flex items-center justify-center rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300">
                  {!isScanning && !scanComplete && (
                    <ScanFace className="w-16 h-16 text-slate-400" />
                  )}
                  
                  {isScanning && (
                    <motion.div className="relative flex items-center justify-center w-full h-full">
                      <ScanFace className="w-16 h-16 text-primary z-10" />
                      {/* Scanning laser line */}
                      <motion.div 
                        initial={{ top: "0%" }}
                        animate={{ top: "100%" }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                        className="absolute w-full h-1 bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.5)] z-20"
                      />
                    </motion.div>
                  )}

                  {scanComplete && (
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      className="text-emerald-500 flex flex-col items-center"
                    >
                      <CheckCircle2 className="w-16 h-16 mb-2" />
                      <span className="font-semibold text-sm">Verified</span>
                    </motion.div>
                  )}
                </div>

                {!scanComplete && (
                  <button 
                    onClick={handleSimulateScan}
                    disabled={isScanning}
                    className={`w-full max-w-xs py-3 rounded-xl font-semibold transition-all ${isScanning ? 'bg-slate-100 text-slate-400' : 'bg-primary text-white hover:bg-emerald-800 shadow-lg'}`}
                  >
                    {isScanning ? 'Scanning Biometrics...' : 'Start Verification'}
                  </button>
                )}
              </motion.div>
            )}

            {/* STEP 2: DISTRICT SELECTION */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800">Step 2: Confirm District</h2>
                </div>
                <p className="text-slate-600 mb-6 text-sm">Based on your verified identity, you are registered to vote in the following district. Please confirm to proceed to your ballot.</p>
                
                <div className="p-6 border border-primary/20 bg-emerald-50/50 rounded-2xl mb-8">
                  <div className="text-sm font-medium text-slate-500 mb-1">Registered District</div>
                  <div className="text-2xl font-bold text-slate-900 mb-2">Rawalpindi Cantt (NA-59)</div>
                  <div className="flex gap-2 mt-4">
                    <span className="px-3 py-1 bg-white border border-slate-200 text-xs font-medium rounded-full text-slate-600">Active Voter</span>
                    <span className="px-3 py-1 bg-white border border-slate-200 text-xs font-medium rounded-full text-emerald-700">Eligible</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: ENCRYPTED BALLOT */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-primary">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800">Step 3: Encrypted Ballot</h2>
                </div>
                <p className="text-slate-600 mb-6 text-sm">Select your preferred candidate. Your vote will be cryptographically hashed before leaving your device.</p>
                
                <div className="space-y-3">
                  {["Candidate A - Democratic Progress", "Candidate B - National Unity", "Candidate C - Independent"].map(candidate => (
                    <label key={candidate} className="flex items-center p-5 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-primary/50 transition-all group">
                      <input type="radio" name="vote" className="w-5 h-5 text-primary focus:ring-primary border-slate-300" />
                      <span className="ml-4 font-medium text-slate-800 group-hover:text-primary transition-colors">{candidate}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 4: SUCCESS */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center flex flex-col items-center justify-center h-full pt-10"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6"
                >
                  <ShieldCheck className="w-12 h-12 text-primary" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-3 text-slate-900">Vote Secured</h2>
                <p className="text-slate-600 mb-8 max-w-md">Your ballot has been successfully encrypted, cast, and recorded on the immutable ledger.</p>
                
                <div className="w-full text-left bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <div className="text-sm text-slate-500 mb-1">Encrypted Receipt TXID:</div>
                  <code className="text-slate-800 font-mono text-sm tracking-wider break-all">
                    0x8f92a41cb7d3e99fa231018cbb2...
                  </code>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons (Hidden on Step 1 since it auto-advances, and Step 4) */}
        {step > 1 && step < 4 && (
          <div className="mt-8 flex justify-between pt-6 border-t border-slate-100">
            <button 
              onClick={prevStep} 
              className="px-6 py-3 font-medium rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Back
            </button>
            
            <button 
              onClick={nextStep}
              className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-emerald-800 transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
            >
              {step === 2 ? 'Confirm District' : 'Cast Encrypted Vote'}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
             <button 
              onClick={() => setStep(1)}
              className="px-8 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-md flex items-center justify-center"
            >
              Return to Home
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
