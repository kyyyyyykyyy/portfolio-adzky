import React, { useState, useEffect, useRef, useCallback } from 'react'; 
import './App.css';
import { 
  motion, useScroll, useSpring, AnimatePresence, 
  useTransform, useMotionValue, useAnimationFrame, useVelocity 
} from 'framer-motion'; 
import { TypeAnimation } from 'react-type-animation'; 
import Tilt from 'react-parallax-tilt'; 
import confetti from 'canvas-confetti';
import Particles from "react-tsparticles"; 
import { loadSlim } from "tsparticles-slim"; 

import { 
  FaGithub, FaInstagram, FaWhatsapp, FaTiktok, FaArrowUp, 
  FaGamepad, FaPython, FaReact, FaLaravel, FaDatabase, 
  FaJs, FaCode, FaPhp, FaLeaf, FaServer, FaLayerGroup, FaBriefcase, FaGraduationCap, FaTrophy
} from "react-icons/fa"; 

// --- KOMPONEN MARQUEE ---
function ParallaxText({ children, baseVelocity = 100 }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);
  const directionFactor = useRef(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) { directionFactor.current = -1; } 
    else if (velocityFactor.get() > 0) { directionFactor.current = 1; }
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });
  return (
    <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', display: 'flex', letterSpacing: '-2px' }}>
      <motion.div style={{ x, display: 'flex', gap: '30px', fontSize: '4rem', fontWeight: '900', textTransform: 'uppercase', color: 'rgba(255,255,255,0.05)' }}>
        <span>{children} </span><span>{children} </span><span>{children} </span><span>{children} </span>
      </motion.div>
    </div>
  );
}
const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

// --- KOMPONEN ACHIEVEMENT POPUP ---
function AchievementToast({ title, desc }) {
  return (
    <motion.div 
      initial={{ x: 100, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }} 
      exit={{ x: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        position: 'fixed', bottom: '30px', left: '30px',
        background: 'rgba(20, 20, 30, 0.95)', border: '1px solid #00f2ea',
        borderRadius: '15px', padding: '15px 25px', display: 'flex', alignItems: 'center', gap: '15px',
        boxShadow: '0 0 20px rgba(0, 242, 234, 0.4)', zIndex: 10000,
        backdropFilter: 'blur(10px)', minWidth: '300px'
      }}
    >
      <div style={{ 
        width: '50px', height: '50px', borderRadius: '50%', background: '#00f2ea', 
        display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', color: '#000' 
      }}>
        <FaTrophy />
      </div>
      <div>
        <h4 style={{ margin: 0, color: '#00f2ea', fontSize: '0.9rem', textTransform: 'uppercase' }}>Achievement Unlocked!</h4>
        <h3 style={{ margin: '5px 0 0 0', color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>{title}</h3>
        <p style={{ margin: 0, color: '#aaa', fontSize: '0.8rem' }}>{desc}</p>
      </div>
    </motion.div>
  );
}

function App() {
  
  // STATE UTAMA
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // STATE ACHIEVEMENT
  const [achievement, setAchievement] = useState(null); 
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);

  // FUNGSI TRIGGER ACHIEVEMENT
  const triggerAchievement = (id, title, desc) => {
    if (!unlockedAchievements.includes(id)) {
      setAchievement({ title, desc });
      setUnlockedAchievements(prev => [...prev, id]);
      setTimeout(() => { setAchievement(null); }, 4000);
    }
  };

  // INIT PARTICLES
  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    const mouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    const checkScroll = () => {
        window.scrollY > 400 ? setShowTopBtn(true) : setShowTopBtn(false);
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
            triggerAchievement('footer', 'The Final Boss', 'You reached the end of the page!');
        }
    };
    
    window.addEventListener("mousemove", mouseMove);
    window.addEventListener('scroll', checkScroll);
    
    setTimeout(() => {
        triggerAchievement('welcome', 'Hello World!', 'Welcome to my digital playground.');
    }, 1500);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener('scroll', checkScroll);
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const variants = {
    default: { x: mousePosition.x - 16, y: mousePosition.y - 16 },
    text: { height: 80, width: 80, x: mousePosition.x - 40, y: mousePosition.y - 40, backgroundColor: "rgba(0, 242, 234, 0.3)", mixBlendMode: "difference" }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault(); 
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#00f2ea', '#ff0055', '#ffffff'] });
    triggerAchievement('contact', 'Social Butterfly', 'You sent a message!'); 
    alert("Pesan Terkirim! (Mode Demo)");
    e.target.reset();
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    triggerAchievement('flip', 'Curious Mind', 'You flipped the profile card!');
  };

  const myProjects = [
    { id: 1, title: "SIBILING V2", category: "Web App", tech: "Laravel • Filament", desc: "Sistem cerdas Bimbingan Konseling.", link: "https://github.com/kyyyyyykyyy/sibiling-v2", color: "#ff0055" },
    { id: 2, title: "GATOTKACA", category: "Game Dev", tech: "Python • Pygame", desc: "Aksi heroik lokal Platformer 2D.", link: "https://github.com/kyyyyyykyyy/gatotkaca-gebukan-maut", color: "#00ccff" },
    { id: 3, title: "WHISPERING WOODS", category: "Game Dev", tech: "Python • Pygame", desc: "Survival Shooter AI cerdas.", link: "https://github.com/kyyyyyykyyy/whispering-woods", color: "#00ff99" },
    { id: 4, title: "COOKING TIME", category: "Game Dev", tech: "Python • Pygame", desc: "Simulasi dapur interaktif.", link: "https://github.com/kyyyyyykyyy/cooking-time", color: "#ff99cc" },
    { id: 5, title: "KUCING DAPUR", category: "Game Dev", tech: "Python • Pygame", desc: "Manajemen waktu dapur.", link: "https://github.com/kyyyyyykyyy/kucing-dapur", color: "#ffaa00" },
    { id: 6, title: "GARDEN FRESH", category: "Game Dev", tech: "Python • Pygame", desc: "Farming Sim kamera geser.", link: "https://github.com/kyyyyyykyyy/garden-fresh", color: "#ccff00" },
    { id: 7, title: "ULAR KLASIK", category: "Game Dev", tech: "Python • Pygame", desc: "Snake Game modern.", link: "https://github.com/kyyyyyykyyy/ular-klasik", color: "#aa00ff" },
  ];

  const mySkillsIconOnly = [
    { icon: <FaLaravel />, color: "#F05340", name: "Laravel" },
    { icon: <FaReact />, color: "#61DAFB", name: "React" },
    { icon: <FaPhp />, color: "#777BB4", name: "PHP" },
    { icon: <FaPython />, color: "#3776AB", name: "Python" },
    { icon: <FaDatabase />, color: "#00758F", name: "SQL" },
    { icon: <FaLeaf />, color: "#25812F", name: "HeidiSQL" },
    { icon: <FaServer />, color: "#6C78AF", name: "phpMyAdmin" },
    { icon: <FaCode />, color: "#38B2AC", name: "Tailwind" },
    { icon: <FaLayerGroup />, color: "#F28832", name: "Filament" },
    { icon: <FaGamepad />, color: "#00f2ea", name: "Game Dev" },
    { icon: <FaJs />, color: "#F7DF1E", name: "JS" },
  ];

  const journeyData = [
    { year: "2026", title: "Professional Developer", desc: "Membangun solusi kompleks untuk klien & merilis game indie.", icon: <FaBriefcase /> },
    { year: "2025", title: "Full Stack Mastery", desc: "Menguasai Laravel & React, membangun sistem sekolah (SIBILING).", icon: <FaCode /> },
    { year: "2024", title: "Game Dev Journey", desc: "Mulai serius di Python/Pygame. Gatotkaca & Whispering Woods lahir.", icon: <FaGamepad /> },
    { year: "2023", title: "Hello World", desc: "Awal mula menyentuh baris kode pertama. The passion begins.", icon: <FaGraduationCap /> },
  ];

  const [filter, setFilter] = useState("All");
  const filteredProjects = filter === "All" ? myProjects : myProjects.filter(p => p.category === filter);
  
  const fadeInUp = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
  const sentence = { hidden: { opacity: 1 }, visible: { opacity: 1, transition: { delay: 0.5, staggerChildren: 0.08 } } };
  const letter = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="App" style={{ cursor: 'none' }}>
      
      {/* ACHIEVEMENT POPUP */}
      <AnimatePresence>
        {achievement && (
            <AchievementToast title={achievement.title} desc={achievement.desc} />
        )}
      </AnimatePresence>

      {/* BACKGROUND PARTICLES */}
      <Particles
        id="tsparticles" init={particlesInit}
        options={{
          background: { color: { value: "#0b0b0f" } }, fpsLimit: 120,
          interactivity: { events: { onHover: { enable: true, mode: "repulse" }, resize: true }, modes: { repulse: { distance: 100, duration: 0.4 } } },
          particles: { color: { value: "#00f2ea" }, links: { color: "#a855f7", distance: 150, enable: true, opacity: 0.2, width: 1 }, move: { enable: true, speed: 1 }, number: { value: 80 }, opacity: { value: 0.5 }, size: { value: { min: 1, max: 3 } } },
        }}
        style={{ position: 'fixed', zIndex: -10, top: 0, left: 0, width: '100%', height: '100%' }} 
      />

      {/* CURSOR & SCROLL */}
      <motion.div variants={variants} animate={cursorVariant} style={{ position: 'fixed', left: 0, top: 0, width: '32px', height: '32px', border: '2px solid #00f2ea', borderRadius: '50%', pointerEvents: 'none', zIndex: 99999, boxShadow: '0 0 10px #00f2ea' }} />
      <motion.div animate={{ x: mousePosition.x - 4, y: mousePosition.y - 4 }} style={{ position: 'fixed', left: 0, top: 0, width: '8px', height: '8px', backgroundColor: '#ff0055', borderRadius: '50%', pointerEvents: 'none', zIndex: 99999 }} />
      <motion.div style={{ scaleX: scaleX, position: 'fixed', top: 0, left: 0, right: 0, height: '5px', background: '#00f2ea', transformOrigin: '0%', zIndex: 9999 }} />

      {/* NAVBAR */}
      <motion.nav 
        initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.8, type: "spring" }}
        style={{ position: 'fixed', top: '20px', left: 0, right: 0, margin: '0 auto', width: 'fit-content', padding: '12px 40px', borderRadius: '50px', background: 'rgba(20, 20, 30, 0.7)', backdropFilter: 'blur(15px)', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', zIndex: 1000 }}
        onMouseEnter={() => setCursorVariant("text")} onMouseLeave={() => setCursorVariant("default")}
      >
        <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#fff', cursor: 'pointer' }}>Porto<span style={{ color: '#00f2ea' }}>folio.</span></div>
        <div style={{ display: 'flex', gap: '25px' }}>
          {['Home', 'About', 'Project', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>{item}</a>
          ))}
        </div>
      </motion.nav>

      {/* HERO SECTION */}
      <header id="home" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '100vh', padding: '0 10%', marginTop: '50px', position: 'relative', zIndex: 10 }}>
        
        {/* TEXT AREA */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} style={{ maxWidth: '650px' }}>
          <div style={{ display: 'inline-block', padding: '8px 20px', borderRadius: '20px', background: 'rgba(0, 242, 234, 0.1)', color: '#00f2ea', fontSize: '0.9rem', marginBottom: '20px', border: '1px solid rgba(0, 242, 234, 0.2)' }}>
            <TypeAnimation sequence={['Full Stack Developer', 2000, 'Game Creator', 2000, 'Laravel Enthusiast', 2000]} wrapper="span" speed={50} repeat={Infinity} />
          </div>
          <h1 style={{ fontSize: '3.5rem', lineHeight: '1.2', margin: '0 0 20px 0', color: '#fff' }}>
            Hi, I'm <br />
            <motion.span variants={sentence} initial="hidden" animate="visible" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {"Muhamad Adzky Maulana".split(" ").map((word, i) => (
                <span key={i} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                    {word.split("").map((char, index) => (
                        <motion.span key={index} variants={letter} style={{ display: 'inline-block', background: 'linear-gradient(90deg, #fff, #a0a0a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{char}</motion.span>
                    ))}
                </span>
              ))}
            </motion.span>
          </h1>
          <p style={{ color: '#a0a0a0', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '30px' }}>Merancang pengalaman digital yang tak terlupakan. Memadukan estetika desain dengan performa kode tingkat tinggi untuk menciptakan website futuristik dan game yang imersif.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#project" style={{ padding: '12px 30px', borderRadius: '8px', border: '1px solid #333', background: 'transparent', color: '#fff', fontWeight: 'bold', textDecoration: 'none' }}>View Projects</a>
          </div>
        </motion.div>
        
        {/* 🔥 KARTU PROFIL DENGAN NEON BORDER ANIMATION 🔥 */}
        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} scale={1.05}>
            <motion.div 
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
            className="neon-card" // CLASS UNTUK EFEK BINGKAI BERPUTAR
            style={{ width: '320px', padding: '20px', borderRadius: '20px', textAlign: 'center' }}
            onMouseEnter={() => setCursorVariant("text")} onMouseLeave={() => setCursorVariant("default")}
            >
            <div style={{ width: '100%', height: '300px', borderRadius: '15px', overflow: 'hidden', marginBottom: '20px', background: '#222', position: 'relative', zIndex: 2 }}>
                <img src="/images/adzky.jpeg" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ position: 'relative', zIndex: 2 }}>
                <h3 style={{ margin: '0 0 5px 0' }}>Muhamad Adzky Maulana</h3>
                <p style={{ color: '#00f2ea', fontSize: '0.9rem', margin: 0 }}>@adzky</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <a href="https://github.com/kyyyyyykyyy" target="_blank" style={{ color: '#ccc', fontSize: '1.5rem' }}><FaGithub /></a>
                    <a href="https://www.tiktok.com/@mhmmdadzkyy?_r=1&_t=ZS-934KiKrRl9c" target="_blank" style={{ color: '#ccc', fontSize: '1.5rem' }}><FaTiktok /></a>
                    <a href="https://www.instagram.com/mhmmdadzkyy?igsh=MW9scHduaml2dnJiZA==" target="_blank" style={{ color: '#ccc', fontSize: '1.5rem' }}><FaInstagram /></a>
                    <a href="https://wa.me/6282238247865" target="_blank" style={{ color: '#ccc', fontSize: '1.5rem' }}><FaWhatsapp /></a>
                </div>
                <a href="#contact" style={{ display: 'block', width: '100%', padding: '10px', marginTop: '20px', borderRadius: '8px', background: 'linear-gradient(90deg, #00f2ea, #ff0055)', border: 'none', color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Contact Me</a>
            </div>
            </motion.div>
        </Tilt>
      </header>

      <section style={{ padding: '20px 0', background: 'rgba(255,255,255,0.02)' }}>
        <ParallaxText baseVelocity={-5}>FULL STACK DEVELOPER • GAME CREATOR • </ParallaxText>
      </section>

      {/* ABOUT & SKILLS */}
      <section id="about" style={{ padding: '100px 10%' }}>
        <motion.div 
          initial="hidden" whileInView="visible" variants={fadeInUp}
          onViewportEnter={() => triggerAchievement('about_view', 'Stalker Mode', 'You are reading about me!')}
          style={{ background: 'rgba(5, 5, 5, 0.8)', borderRadius: '30px', border: '2px solid #a855f7', boxShadow: '0 0 30px rgba(168, 85, 247, 0.3)', padding: '50px', display: 'flex', gap: '50px', alignItems: 'center', flexWrap: 'wrap', backdropFilter: 'blur(10px)' }}
          onMouseEnter={() => setCursorVariant("text")} onMouseLeave={() => setCursorVariant("default")}
        >
          <div style={{ flex: '1 1 400px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '30px', color: '#fff' }}>About Me</h2>
            <p style={{ color: '#ccc', lineHeight: '1.8', marginBottom: '40px', fontSize: '1.1rem' }}>Saya adalah seorang full-stack developer dan game creator yang bersemangat membangun aplikasi modern berperforma tinggi. Dengan pengalaman dalam teknologi terbaru, saya berkomitmen memberikan solusi digital yang berdampak dan estetis.</p>
            <div style={{ marginTop: '30px' }}>
                <h4 style={{ color: '#a855f7', marginBottom: '15px' }}>MY JOURNEY</h4>
                <div style={{ borderLeft: '2px solid rgba(168, 85, 247, 0.3)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {journeyData.map((item, index) => (
                        <div key={index} style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '-26px', top: '5px', width: '10px', height: '10px', background: '#a855f7', borderRadius: '50%' }}></div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontWeight: 'bold' }}>{item.icon} {item.year} - {item.title}</div>
                            <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '5px' }}>{item.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          <div style={{ flex: '0 0 auto' }}>
            <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.3} glareColor="#a855f7">
              <div className={`flip-card ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip} onMouseEnter={() => setIsFlipped(true)} onMouseLeave={() => setIsFlipped(false)}>
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div style={{ width: '100%', height: '300px', borderRadius: '15px', overflow: 'hidden', marginBottom: '20px', background: '#222' }}>
                        <img src="/images/adzky.jpeg" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <h3 style={{ margin: '0 0 5px 0', color: '#fff' }}>Muhamad Adzky Maulana</h3>
                    <p style={{ color: '#a855f7', fontSize: '0.9rem', margin: 0 }}>@adzky</p>
                  </div>
                  <div className="flip-card-back">
                    <h4 style={{ color: '#a855f7', marginBottom: '25px', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Tech Stack</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', width: '100%' }}>
                      {mySkillsIconOnly.map((skill, index) => (
                        <motion.div key={index} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05, type: "spring" }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                          <div style={{ fontSize: '2.5rem', color: skill.color, filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.2))' }}>{skill.icon}</div>
                          <span style={{ fontSize: '0.7rem', color: '#ccc' }}>{skill.name}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Tilt>
          </div>
        </motion.div>
      </section>

      <section id="project" style={{ padding: '50px 10%' }}>
        <motion.h2 initial="hidden" whileInView="visible" variants={fadeInUp} style={{ fontSize: '2rem', marginBottom: '10px' }}>Featured Projects</motion.h2>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {['All', 'Web App', 'Game Dev'].map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} style={{ padding: '10px 25px', borderRadius: '30px', border: 'none', cursor: 'pointer', background: filter === cat ? '#00f2ea' : 'rgba(255,255,255,0.1)', color: filter === cat ? '#000' : '#fff', fontWeight: 'bold', transition: '0.3s' }}>{cat}</button>
          ))}
        </div>
        <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }} onViewportEnter={() => triggerAchievement('projects_view', 'Project Hunter', 'Checking out my work?')}>
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <Tilt key={project.id} tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02}>
                  <motion.div 
                    layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                    style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '20px', padding: '25px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden', height: '100%' }}
                    onMouseEnter={() => setCursorVariant("text")} onMouseLeave={() => setCursorVariant("default")}
                  >
                    <div style={{ display: 'inline-block', padding: '5px 10px', borderRadius: '5px', background: `${project.color}20`, color: project.color, fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '15px' }}>{project.category}</div>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>{project.title}</h3>
                    <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>{project.desc}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: '#666' }}>{project.tech}</span>
                      <a href={project.link} target="_blank" style={{ textDecoration: 'none', color: '#fff', borderBottom: `1px solid ${project.color}`, paddingBottom: '2px' }}>View Code &rarr;</a>
                    </div>
                  </motion.div>
              </Tilt>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <section id="contact" style={{ padding: '50px 10%', paddingBottom: '100px' }}>
        <motion.h2 initial="hidden" whileInView="visible" variants={fadeInUp} style={{ fontSize: '2rem', marginBottom: '40px', textAlign: 'center' }}>Get In Touch</motion.h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', background: 'rgba(255,255,255,0.02)', padding: '40px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} style={{ textAlign: 'center' }} onMouseEnter={() => setCursorVariant("text")} onMouseLeave={() => setCursorVariant("default")}>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Let's Work Together! 🚀</h3>
            <p style={{ color: '#aaa', lineHeight: '1.8', marginBottom: '30px' }}>Punya ide project gila? Atau mau bikin game impian? Jangan ragu buat ngobrol! Saya selalu terbuka untuk kolaborasi seru.</p>
            <div style={{ marginBottom: '15px' }}><span style={{ color: '#00f2ea', fontWeight: 'bold', fontSize: '1.1rem' }}>Email:</span><p style={{ color: '#fff', margin: '5px 0' }}>m.azdkymaulana002@gmail.com</p></div>
            <div style={{ marginBottom: '15px' }}><span style={{ color: '#25D366', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><FaWhatsapp size={20} /> WhatsApp Business:</span><p style={{ color: '#fff', margin: '5px 0' }}>+62 822-3824-7865</p></div>
            <div><span style={{ color: '#ff0055', fontWeight: 'bold', fontSize: '1.1rem' }}>Location:</span><p style={{ color: '#fff', margin: '5px 0' }}>Banda Aceh, Indonesia</p></div>
          </motion.div>
          <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input required type="text" placeholder="Your Name" style={{ padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', outline: 'none' }} />
            <input required type="email" placeholder="Your Email" style={{ padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', outline: 'none' }} />
            <textarea required rows="4" placeholder="Your Message" style={{ padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', outline: 'none', resize: 'none' }}></textarea>
            <button style={{ padding: '15px', borderRadius: '10px', border: 'none', background: 'linear-gradient(90deg, #00f2ea, #ff0055)', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>Send Message ✈️</button>
          </form>
        </div>
      </section>

      <footer style={{ textAlign: 'center', padding: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#666' }}>
        &copy; 2026 Muhamad Adzky Maulana. Built with React & Passion.
      </footer>

      <AnimatePresence>
        {showTopBtn && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} onClick={scrollToTop} style={{ position: 'fixed', bottom: '40px', right: '40px', width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#00f2ea', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', zIndex: 1000, boxShadow: '0 0 20px rgba(0,242,234,0.5)' }}>
            <FaArrowUp size={24} color="#000" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;