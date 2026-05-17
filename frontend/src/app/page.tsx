"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Map, ShieldCheck, Fingerprint } from "lucide-react";
import * as THREE from "three";

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });

  // WebGL 3D Particle Simulation Initialization
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;

    // 1. Core Rendering Canvas Setup
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimize
    renderer.setSize(container.clientWidth, container.clientHeight);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 1000);
    camera.position.z = 100;

    const scene = new THREE.Scene();

    // 2. The 3D Particle Swarm (Points Object)
    const particleCount = 28000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const randoms = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 400 * Math.pow(Math.random(), 0.6);
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
      randoms[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

    // Load custom background asset image
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/hero-bg.png');

    // Shader Material for the faded reveal mask
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uTexture: { value: texture },
        uResolution: { value: new THREE.Vector2(canvas.width, canvas.height) }
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        attribute float aRandom;
        
        varying float vDistanceToMouse;
        varying float vRandom;
        
        void main() {
          vRandom = aRandom;
          vec3 pos = position;
          
          // Instant spatial disturbance field (repel)
          float dist = distance(pos.xy, uMouse);
          vDistanceToMouse = dist;
          
          float force = max(0.0, 90.0 - dist) / 90.0;
          float angle = atan(pos.y - uMouse.y, pos.x - uMouse.x);
          
          // Slightly repels the fine particle field instantly
          pos.x += cos(angle) * force * 15.0;
          pos.y += sin(angle) * force * 15.0;

          // Ambient idle drift
          pos.z += sin(uTime * 0.5 + pos.x * 0.05) * 3.0;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Razor-thin range between 1.0 and 2.0 max
          gl_PointSize = (1.0 + aRandom * 1.0) * (200.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform vec2 uResolution;
        
        varying float vDistanceToMouse;
        varying float vRandom;
        
        void main() {
          // Sharp center, smooth drop-off at outer 1-pixel boundary
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = smoothstep(0.5, 0.4, dist);
          
          // Inject Brand Color Palette
          vec3 primary = vec3(0.051, 0.302, 0.220); // #0D4D38
          vec3 secondary = vec3(0.353, 0.490, 0.486); // #5A7D7C
          vec3 neutral = vec3(0.102, 0.110, 0.106); // #1A1C1B
          
          // Mix colors dynamically based on particle noise and distance
          float proximity = smoothstep(120.0, 0.0, vDistanceToMouse);
          vec3 brandColor = mix(primary, secondary, vRandom);
          brandColor = mix(brandColor, neutral, proximity * 0.6);
          
          // Image-Revealing Sample
          vec2 screenUv = gl_FragCoord.xy / uResolution;
          vec4 texColor = texture2D(uTexture, screenUv);
          
          // Softly illuminate and distribute premium colors
          vec3 finalColor = mix(texColor.rgb, brandColor, 0.65) + (brandColor * proximity * 0.4);
          
          gl_FragColor = vec4(finalColor, alpha * (0.35 + proximity * 0.4));
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 3. Lattice Nodes (Intersection Matrix optimization)
    const nodeCount = 200;
    const nodeGeometry = new THREE.BufferGeometry();
    const nodePositions = new Float32Array(nodeCount * 3);
    for(let i=0; i<nodeCount; i++) {
       nodePositions[i*3] = (Math.random() - 0.5) * 200;
       nodePositions[i*3+1] = (Math.random() - 0.5) * 200;
       nodePositions[i*3+2] = (Math.random() - 0.5) * 40;
    }
    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x064e3b, transparent: true, opacity: 0.15 });
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(nodeCount * nodeCount * 3);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const render = () => {
      const time = clock.getElapsedTime();
      material.uniforms.uTime.value = time;
      
      // Instant Spatial Disturbance Field (Zero-lag)
      if (mouseRef.current.active) {
        mouseRef.current.x = mouseRef.current.targetX;
        mouseRef.current.y = mouseRef.current.targetY;
      }
      
      material.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);

      // Lattice Grid Physics
      const nPos = nodeGeometry.attributes.position.array as Float32Array;
      const lPos = lineGeometry.attributes.position.array as Float32Array;
      let lineIdx = 0;
      
      for(let i=0; i<nodeCount; i++) {
        nPos[i*3] += Math.sin(time + i) * 0.05;
        nPos[i*3+1] += Math.cos(time + i*0.5) * 0.05;
        
        const dx = mouseRef.current.x - nPos[i*3];
        const dy = mouseRef.current.y - nPos[i*3+1];
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 60 && mouseRef.current.active) {
           nPos[i*3] += dx * 0.02;
           nPos[i*3+1] += dy * 0.02;
        }

        for(let j=i+1; j<nodeCount; j++) {
           const ddx = nPos[i*3] - nPos[j*3];
           const ddy = nPos[i*3+1] - nPos[j*3+1];
           const ddz = nPos[i*3+2] - nPos[j*3+2];
           if(ddx*ddx + ddy*ddy + ddz*ddz < 900) { // dist < 30
              lPos[lineIdx++] = nPos[i*3]; lPos[lineIdx++] = nPos[i*3+1]; lPos[lineIdx++] = nPos[i*3+2];
              lPos[lineIdx++] = nPos[j*3]; lPos[lineIdx++] = nPos[j*3+1]; lPos[lineIdx++] = nPos[j*3+2];
           }
        }
      }
      
      nodeGeometry.attributes.position.needsUpdate = true;
      lineGeometry.setDrawRange(0, lineIdx / 3);
      lineGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
      material.uniforms.uResolution.value.set(renderer.domElement.width, renderer.domElement.height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      nodeGeometry.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert cursor coords to 3D world space approximations
    const aspect = rect.width / rect.height;
    const vFov = 45 * Math.PI / 180;
    const visibleHeight = 2 * Math.tan(vFov / 2) * 100;
    const visibleWidth = visibleHeight * aspect;

    mouseRef.current.targetX = (x / rect.width) * visibleWidth - (visibleWidth / 2);
    mouseRef.current.targetY = -(y / rect.height) * visibleHeight + (visibleHeight / 2);
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-[#f9f8f3]">

      {/* 1. Centered Hero Section with WebGL Reveal Mask */}
      <section 
        ref={containerRef}
        className="w-full flex flex-col items-center justify-center pt-32 pb-24 px-6 md:px-12 text-center relative overflow-hidden z-10 group bg-[#f9f8f3]"
        onMouseEnter={() => { setIsHovered(true); mouseRef.current.active = true; }}
        onMouseLeave={() => { setIsHovered(false); mouseRef.current.active = false; }}
        onMouseMove={handleMouseMove}
      >
        {/* Layer 1: Core Rendering WebGL Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          style={{
            opacity: isHovered ? 1 : 0,
            transition: isHovered ? "opacity 0.2s ease-in" : "none"
          }}
        />

        {/* Foreground Content Sizing Protection */}
        <div className="relative z-20 flex flex-col items-center w-full">
          <h1 className="text-5xl md:text-7xl font-extrabold font-serif text-slate-900 tracking-tight mb-8 max-w-5xl">
            VoteShield: Streamline Democratic Integrity
          </h1>
          <p className="text-xl text-slate-700 mb-12 max-w-3xl leading-relaxed font-sans">
            An AI-powered Digital Voting and Electoral District System. We ensure transparent, fair, and secure elections using advanced spatial analytics and cryptographic verification.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link href="/vote">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-[#064e3b] text-white rounded-full font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_0_rgb(6,78,59,0.39)] hover:shadow-[0_6px_20px_rgba(6,78,59,0.23)] hover:bg-[#043528]"
              >
                Start Voting <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="/transparency">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white text-slate-900 rounded-full font-semibold flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 transition-all shadow-sm hover:shadow-md"
              >
                Explore GIS Hub
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Horizontally Scrollable Monument Showcase */}
      <section 
        className="w-full py-8 overflow-hidden relative z-20 shadow-2xl"
        style={{
          backgroundColor: '#0D4D38',
          backgroundImage: 'radial-gradient(diamond at center, rgba(90, 125, 124, 0.45) 0%, #0D4D38 70%)',
          backgroundBlendMode: 'normal'
        }}
      >
        <div className="w-full overflow-x-auto flex flex-row gap-6 py-6 px-6 scrollbar-thin snap-x snap-mandatory">
          
          {[
            { img: "/monuments/faisal.png", label: "Faisal Mosque (Islamabad)" },
            { img: "/monuments/minar.png", label: "Minar-e-Pakistan (Lahore)" },
            { img: "/monuments/khyber.png", label: "Bab-e-Pakistan (Peshawar)" },
            { img: "/monuments/quaid.png", label: "Quaid's Mausoleum (Karachi)" },
            { img: "/monuments/badshahi.png", label: "Badshahi Mosque (Lahore)" },
          ].map((monument, i) => (
            <div key={i} className="flex-shrink-0 w-[320px] snap-start bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 group cursor-pointer flex flex-col items-center">
              <motion.div 
                whileHover={{ y: -5, scale: 1.02 }}
                className="w-full overflow-hidden relative shadow-lg rounded-xl mb-4"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={monument.img} alt={monument.label} className="w-full h-[400px] object-cover rounded-xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#064e3b]/80 via-transparent to-transparent opacity-60"></div>
              </motion.div>
              <span className="text-[#e2e8f0] font-sans font-medium tracking-wide text-sm md:text-base text-center">
                {monument.label}
              </span>
            </div>
          ))}
          
        </div>
        
        <div className="w-full text-center mt-8">
          <p className="text-emerald-200/60 font-sans tracking-[0.2em] text-xs font-semibold">
            ARCHITECTURAL HERITAGE OF THE REPUBLIC
          </p>
        </div>
      </section>

      {/* 3. National Utility Protocol Section */}
      <section className="w-full py-24 px-6 md:px-12 flex flex-col items-center text-center bg-[#f9f8f3] z-10 relative">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-6">
          National Utility Protocol
        </h2>
        <p className="text-lg md:text-xl text-slate-700 max-w-4xl leading-relaxed font-sans">
          A rigorous mathematical proof of equitable representation built on National Emerald Standards. 
          By combining cryptographic verification protocols with spatial boundary logic, VoteShield guarantees that 
          every citizen's vote carries equal weight, permanently archiving the integrity of the electoral process.
        </p>
      </section>

      {/* 4. Institutional Capabilities Grid */}
      <section className="w-full max-w-5xl mx-auto px-6 md:px-12 pb-24 z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          
          {/* Grid Span 1 Left: Interactive GIS Mapping */}
          <div className="col-span-1 bg-white/70 backdrop-blur-md border border-slate-200/50 rounded-2xl p-8 shadow-sm flex flex-col relative overflow-hidden group">
            <h3 className="text-xl font-bold text-slate-900 mb-2 z-10">Interactive GIS Mapping</h3>
            <p className="text-slate-600 z-10 mb-8">Auditable boundary definitions and transparent district drawing.</p>
            <div className="flex-1 w-full flex items-center justify-center min-h-[200px] z-10">
              <Map className="w-32 h-32 text-emerald-900/10 group-hover:scale-110 transition-transform duration-500" strokeWidth={1} />
            </div>
            {/* Mock map background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent z-0"></div>
          </div>

          {/* Grid Span 1 Right: Fairness Metrics */}
          <div className="col-span-1 bg-white/70 backdrop-blur-md border border-slate-200/50 rounded-2xl p-8 shadow-sm flex flex-col justify-center">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Fairness Metrics</h3>
            <p className="text-slate-600 mb-8">Statistical models verifying democratic equity.</p>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-700">Partisan Symmetry</span>
                  <span className="text-emerald-700">98.4%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: "98.4%" }} transition={{ duration: 1, ease: "easeOut" }} className="bg-[#064e3b] h-2.5 rounded-full"></motion.div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-700">Compactness Score</span>
                  <span className="text-emerald-700">0.82</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: "82%" }} transition={{ duration: 1, delay: 0.2, ease: "easeOut" }} className="bg-[#064e3b] h-2.5 rounded-full"></motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Card: Full Grid Width Split */}
          <div className="col-span-1 md:col-span-2 bg-white/70 backdrop-blur-md border border-slate-200/50 rounded-2xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative group">
            <div className="flex-1 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold mb-4">
                <ShieldCheck className="w-4 h-4" /> VERIFIED PROTOCOL
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Secure Biometric Authentication</h3>
              <p className="text-slate-600 max-w-xl leading-relaxed">
                Ensuring identity non-repudiation while maintaining absolute ballot secrecy. Utilizing localized encryption layers to protect citizen data at every touchpoint.
              </p>
            </div>
            
            <div className="w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-full bg-emerald-50 border-4 border-white shadow-xl flex items-center justify-center z-10 relative">
              <Fingerprint className="w-16 h-16 md:w-20 md:h-20 text-[#064e3b] opacity-80" strokeWidth={1.5} />
              <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-20" style={{ animationDuration: '3s' }}></div>
            </div>
            {/* Background flourish */}
            <div className="absolute right-[-10%] top-[-50%] w-[50%] h-[200%] bg-gradient-to-l from-emerald-50/80 to-transparent transform -skew-x-12 z-0"></div>
          </div>

        </div>
      </section>

      {/* 5. Institutional Mandate Footer */}
      <footer className="w-full bg-slate-900 text-slate-400 py-16 px-6 md:px-12 border-t border-slate-800 flex flex-col items-center z-10 relative">
        <div className="w-full max-w-6xl mb-12">
          <div className="flex items-center justify-center gap-4 mb-8 w-full">
            <div className="h-px bg-slate-700 flex-1 max-w-[200px]"></div>
            <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">Certified & Mandated By</span>
            <div className="h-px bg-slate-700 flex-1 max-w-[200px]"></div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-sm md:text-base font-semibold text-slate-300">
            <span>FEDERAL ELECTION COMMISSION</span>
            <span className="hidden md:block text-slate-600">•</span>
            <span>N.E.S.T.</span>
            <span className="hidden md:block text-slate-600">•</span>
            <span>Global Audit Board</span>
          </div>
        </div>

        <div className="w-full max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold mb-2">VoteShield</h4>
            <Link href="#" className="hover:text-white transition-colors">About the Protocol</Link>
            <Link href="#" className="hover:text-white transition-colors">Security Whitepaper</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold mb-2">Public Services</h4>
            <Link href="/vote" className="hover:text-white transition-colors">Citizen Voting Portal</Link>
            <Link href="/transparency" className="hover:text-white transition-colors">GIS Transparency Hub</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold mb-2">Legal</h4>
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Use</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold mb-2">Contact</h4>
            <span className="text-slate-500">Official Inquiries Only</span>
            <a href="mailto:support@voteshield.gov" className="hover:text-white transition-colors">support@voteshield.gov</a>
            <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
