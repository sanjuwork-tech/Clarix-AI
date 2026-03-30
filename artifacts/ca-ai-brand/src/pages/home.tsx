import { useRef, useEffect } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";

/* ── Design tokens ── */
const ST  = "rgba(28,25,23,0.68)";   // charcoal stroke
const A   = "#D4930A";               // amber
const R   = "rgba(146,64,14,0.80)";  // fail red
const P   = "rgba(21,128,61,0.84)";  // pass green
const MF  = "'IBM Plex Mono',monospace";
const SG  = "'Space Grotesk',sans-serif";

/* ── SVG doodle: Open ledger book (problem section bg accent) ── */
const LedgerDoodle = () => (
  <svg width="220" height="165" viewBox="0 0 120 90" fill="none" aria-hidden="true"
    style={{ position:"absolute", right:"4%", bottom:"10%", opacity:0.055, pointerEvents:"none", userSelect:"none" }}>
    <line x1="60" y1="10" x2="60" y2="82" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M60,12 Q30,8 18,15 L18,80 Q30,74 60,78" stroke="#1C1917" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M60,12 Q90,8 102,15 L102,80 Q90,74 60,78" stroke="#1C1917" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    {[30,40,50,60].map(y=><line key={y} x1="26" y1={y} x2="54" y2={y-2} stroke="#1C1917" strokeWidth="0.8" opacity="0.6"/>)}
    {[28,38,48,58].map(y=><line key={y} x1="66" y1={y} x2="94" y2={y+2} stroke="#1C1917" strokeWidth="0.8" opacity="0.6"/>)}
  </svg>
);

/* ── SVG doodle: Neural network (trust section bg accent) ── */
const NeuralDoodle = () => (
  <svg width="200" height="200" viewBox="0 0 100 100" fill="none" aria-hidden="true"
    style={{ position:"absolute", left:"2%", top:"15%", opacity:0.055, pointerEvents:"none", userSelect:"none" }}>
    <circle cx="50" cy="50" r="6" stroke="#1C1917" strokeWidth="1.2"/>
    {[[50,18],[78,32],[78,68],[50,82],[22,68],[22,32]].map(([cx,cy])=><circle key={`${cx}${cy}`} cx={cx} cy={cy} r="4" stroke="#1C1917" strokeWidth="1"/>)}
    {[[50,44,50,22],[56,46,74,35],[56,54,74,65],[50,56,50,78],[44,54,26,65],[44,46,26,35]].map(([x1,y1,x2,y2])=>(
      <line key={`${x1}${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1C1917" strokeWidth="0.9" strokeLinecap="round"/>
    ))}
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   CA ASPIRANT JOURNEY STRIP — horizontal animated panorama
   ══════════════════════════════════════════════════════════════ */

/* Scene 1 – BCom College */
const Scene1 = () => {
  const G = 182;
  return (
    <g>
      {/* College building */}
      <rect x={22} y={58} width={118} height={124} stroke={ST} strokeWidth={1.1} fill="none"/>
      <path d={`M22,58 L81,26 L140,58`} stroke={ST} strokeWidth={1.1} fill="none"/>
      {[36,57,78,99,120].map(x=><line key={x} x1={x} y1={58} x2={x} y2={104} stroke={ST} strokeWidth={0.7} fill="none"/>)}
      {/* Windows */}
      {[30,68,106].map(x=><rect key={x} x={x} y={112} width={16} height={20} stroke={ST} strokeWidth={0.75} fill="none"/>)}
      {[30,106].map(x=><rect key={x} x={x} y={74} width={16} height={16} stroke={ST} strokeWidth={0.75} fill="none"/>)}
      {/* Door */}
      <rect x={64} y={148} width={26} height={34} rx={2} stroke={ST} strokeWidth={0.9} fill="none"/>
      {/* Steps */}
      <line x1={16} y1={G} x2={146} y2={G} stroke={ST} strokeWidth={0.9}/>
      <line x1={20} y1={G-3} x2={142} y2={G-3} stroke={ST} strokeWidth={0.6} opacity={0.5}/>
      <text x={40} y={51} fontSize={6} fontFamily={MF} fill={ST} opacity={0.8} letterSpacing={0.8}>B·COM COLLEGE</text>

      {/* Tree */}
      <ellipse cx={170} cy={125} rx={18} ry={20} stroke={ST} strokeWidth={0.85} strokeDasharray="2,3" fill="none" opacity={0.7}/>
      <line x1={170} y1={145} x2={170} y2={G} stroke={ST} strokeWidth={1.1}/>
      <line x1={162} y1={135} x2={155} y2={G} stroke={ST} strokeWidth={0.7} opacity={0.4}/>

      {/* Happy walking student at cx=232 */}
      <circle cx={232} cy={G-58} r={9} stroke={ST} strokeWidth={1.5} fill="none"/>
      {/* Mortarboard */}
      <rect x={222} y={G-71} width={20} height={4} stroke={A} strokeWidth={1} fill="rgba(212,147,10,0.12)"/>
      <line x1={232} y1={G-71} x2={232} y2={G-67} stroke={A} strokeWidth={1}/>
      <line x1={232} y1={G-67} x2={238} y2={G-67} stroke={A} strokeWidth={0.8}/>
      {/* Body */}
      <line x1={232} y1={G-49} x2={232} y2={G-23} stroke={ST} strokeWidth={1.5}/>
      {/* Walk arms */}
      <line x1={232} y1={G-41} x2={218} y2={G-28} stroke={ST} strokeWidth={1.5}/>
      <line x1={232} y1={G-41} x2={246} y2={G-49} stroke={ST} strokeWidth={1.5}/>
      {/* Book in hand */}
      <rect x={208} y={G-34} width={11} height={14} rx={1} stroke={ST} strokeWidth={0.85} fill="none"/>
      <line x1={213} y1={G-34} x2={213} y2={G-20} stroke={ST} strokeWidth={0.5} opacity={0.5}/>
      {/* Walk legs */}
      <line x1={232} y1={G-23} x2={222} y2={G} stroke={ST} strokeWidth={1.5}/>
      <line x1={232} y1={G-23} x2={244} y2={G-8} stroke={ST} strokeWidth={1.5}/>

      {/* Sparkles */}
      <text x={258} y={G-76} fontSize={10} fill={A} opacity={0.7}>✦</text>
      <text x={274} y={G-58} fontSize={7} fill={A} opacity={0.55}>★</text>
      <text x={250} y={G-52} fontSize={7} fill={A} opacity={0.6}>✦</text>
      <text x={286} y={G-70} fontSize={6} fill={A} opacity={0.4}>✦</text>

      <text x={170} y={212} fontSize={9} fontFamily={MF} fill={ST} opacity={0.7} textAnchor="middle">BCom · Starting out</text>
    </g>
  );
};

/* Scene 2 – Coaching Institute */
const Scene2 = () => {
  const G = 182; const ox = 340;
  return (
    <g transform={`translate(${ox},0)`}>
      {/* Building */}
      <rect x={18} y={42} width={95} height={140} stroke={ST} strokeWidth={1.1} fill="none"/>
      <line x1={18} y1={95} x2={113} y2={95} stroke={ST} strokeWidth={0.7} opacity={0.5}/>
      <line x1={18} y1={140} x2={113} y2={140} stroke={ST} strokeWidth={0.7} opacity={0.5}/>
      {/* Sign */}
      <rect x={18} y={47} width={95} height={18} stroke={A} strokeWidth={0.8} fill="rgba(212,147,10,0.07)"/>
      <text x={65} y={59} fontSize={6} fontFamily={MF} fill={A} textAnchor="middle" opacity={0.9}>COACHING INSTITUTE</text>
      {/* Windows */}
      {[24,52,78].map(x=><rect key={x} x={x} y={103} width={16} height={20} stroke={ST} strokeWidth={0.75} fill="none"/>)}
      {[24,52,78].map(x=><rect key={x} x={x} y={148} width={16} height={20} stroke={ST} strokeWidth={0.75} fill="none"/>)}
      {/* Door */}
      <rect x={44} y={162} width={20} height={20} rx={1} stroke={ST} strokeWidth={0.9} fill="none"/>

      {/* Students filing in */}
      {[132, 162].map((cx, i) => (
        <g key={cx}>
          <circle cx={cx} cy={G-54} r={7} stroke={ST} strokeWidth={1.2} fill="none"/>
          <line x1={cx} y1={G-47} x2={cx} y2={G-22} stroke={ST} strokeWidth={1.2}/>
          <line x1={cx} y1={G-38} x2={cx-12} y2={G-28} stroke={ST} strokeWidth={1.2}/>
          <line x1={cx} y1={G-38} x2={cx+12} y2={G-(i===0?44:28)} stroke={ST} strokeWidth={1.2}/>
          <line x1={cx} y1={G-22} x2={cx-8} y2={G} stroke={ST} strokeWidth={1.2}/>
          <line x1={cx} y1={G-22} x2={cx+8} y2={G} stroke={ST} strokeWidth={1.2}/>
          {/* Stack of books */}
          {i===0 && <rect x={cx+12} y={G-38} width={9} height={12} rx={1} stroke={ST} strokeWidth={0.8} fill="none"/>}
          {i===0 && <rect x={cx+12} y={G-44} width={9} height={8} rx={1} stroke={ST} strokeWidth={0.7} fill="none"/>}
        </g>
      ))}

      {/* Blackboard scene */}
      <rect x={196} y={80} width={80} height={52} rx={2} stroke={A} strokeWidth={1} fill="rgba(212,147,10,0.05)"/>
      <text x={236} y={97} fontSize={7} fontFamily={MF} fill={A} textAnchor="middle" opacity={0.9}>CA FINAL</text>
      <line x1={200} y1={102} x2={272} y2={102} stroke={A} strokeWidth={0.5} opacity={0.5}/>
      {["FR","SFM","AUDIT","C.LAW"].map((s,i)=>(
        <text key={s} x={205+i*18} y={115} fontSize={5} fontFamily={MF} fill={ST} opacity={0.7}>{s}</text>
      ))}
      {/* Teacher figure */}
      <circle cx={284} cy={108} r={5} stroke={ST} strokeWidth={1} fill="none"/>
      <line x1={284} y1={113} x2={284} y2={130} stroke={ST} strokeWidth={1}/>
      <line x1={284} y1={118} x2={276} y2={125} stroke={ST} strokeWidth={1}/>
      <line x1={284} y1={118} x2={292} y2={113} stroke={ST} strokeWidth={1}/>
      <line x1={284} y1={130} x2={278} y2={G} stroke={ST} strokeWidth={1}/>
      <line x1={284} y1={130} x2={290} y2={G} stroke={ST} strokeWidth={1}/>
      {/* Pointer stick */}
      <line x1={292} y1={113} x2={278} y2={102} stroke={ST} strokeWidth={0.8} opacity={0.6}/>

      <text x={175} y={212} fontSize={9} fontFamily={MF} fill={ST} opacity={0.7} textAnchor="middle">Joins coaching · Confident</text>
    </g>
  );
};

/* Scene 3 – Exam Hall */
const Scene3 = () => {
  const G = 182; const ox = 680;
  return (
    <g transform={`translate(${ox},0)`}>
      {/* Hall walls */}
      <rect x={10} y={52} width={318} height={125} stroke={ST} strokeWidth={0.8} fill="none" opacity={0.4}/>
      <line x1={10} y1={72} x2={328} y2={72} stroke={ST} strokeWidth={0.6} opacity={0.4}/>
      <text x={169} y={65} fontSize={7} fontFamily={MF} fill={ST} textAnchor="middle" opacity={0.6} letterSpacing={1}>EXAMINATION HALL</text>
      {/* Clock */}
      <circle cx={168} cy={65} r={0} fill="none"/>
      <circle cx={298} cy={62} r={11} stroke={R} strokeWidth={0.9} fill="none"/>
      <line x1={298} y1={62} x2={298} y2={54} stroke={R} strokeWidth={1.1} strokeLinecap="round"/>
      <line x1={298} y1={62} x2={304} y2={62} stroke={ST} strokeWidth={1} strokeLinecap="round"/>
      <text x={298} y={82} fontSize={6} fontFamily={MF} fill={R} textAnchor="middle" opacity={0.7}>TIME RUNNING</text>

      {/* MAY 2024 tag */}
      <rect x={14} y={77} width={58} height={14} rx={3} stroke={R} strokeWidth={0.8} fill="rgba(146,64,14,0.06)"/>
      <text x={43} y={87} fontSize={6.5} fontFamily={MF} fill={R} textAnchor="middle" opacity={0.9}>MAY 2024</text>

      {/* 3 desks */}
      {[24, 112, 200].map((dx, i) => (
        <g key={dx}>
          {/* Desk top */}
          <rect x={dx} y={G-30} width={80} height={7} rx={1} stroke={ST} strokeWidth={0.9} fill="none"/>
          {/* Desk legs */}
          <line x1={dx+12} y1={G-23} x2={dx+12} y2={G} stroke={ST} strokeWidth={0.9}/>
          <line x1={dx+68} y1={G-23} x2={dx+68} y2={G} stroke={ST} strokeWidth={0.9}/>
          {/* Paper */}
          <rect x={dx+18} y={G-42} width={36} height={22} rx={1} stroke={i===1?R:ST} strokeWidth={i===1?0.9:0.7} fill={i===1?"rgba(146,64,14,0.03)":"none"}/>
          {/* Lines on paper */}
          {[G-38,G-34,G-30].map(py=><line key={py} x1={dx+22} y1={py} x2={dx+50} y2={py} stroke={ST} strokeWidth={0.4} opacity={0.4}/>)}
          {/* Sitting figure — main one has stress hair */}
          <circle cx={dx+40} cy={G-65} r={i===1?9:7.5} stroke={i===1?R:ST} strokeWidth={i===1?1.5:1.2} fill="none"/>
          {i===1 && [dx+33,dx+37,dx+43,dx+47].map(hx=>(
            <line key={hx} x1={hx} y1={G-72} x2={hx+1} y2={G-80} stroke={ST} strokeWidth={0.7} opacity={0.6}/>
          ))}
          {/* Body */}
          <line x1={dx+40} y1={G-56} x2={dx+40} y2={G-36} stroke={i===1?R:ST} strokeWidth={i===1?1.5:1.2}/>
          {/* Writing arm */}
          <line x1={dx+40} y1={G-48} x2={dx+56} y2={G-40} stroke={i===1?R:ST} strokeWidth={i===1?1.5:1.2}/>
          {/* Pen */}
          {i===1 && <line x1={dx+56} y1={G-40} x2={dx+60} y2={G-36} stroke={A} strokeWidth={1.1}/>}
          {/* Other arm */}
          <line x1={dx+40} y1={G-48} x2={dx+24} y2={G-40} stroke={i===1?R:ST} strokeWidth={i===1?1.5:1.2}/>
          {/* Sitting legs */}
          <line x1={dx+40} y1={G-36} x2={dx+28} y2={G-36} stroke={i===1?R:ST} strokeWidth={i===1?1.5:1.2}/>
          <line x1={dx+28} y1={G-36} x2={dx+28} y2={G} stroke={i===1?R:ST} strokeWidth={i===1?1.5:1.2}/>
          <line x1={dx+40} y1={G-36} x2={dx+52} y2={G-36} stroke={i===1?R:ST} strokeWidth={i===1?1.5:1.2}/>
          <line x1={dx+52} y1={G-36} x2={dx+52} y2={G} stroke={i===1?R:ST} strokeWidth={i===1?1.5:1.2}/>
        </g>
      ))}

      <text x={169} y={212} fontSize={9} fontFamily={MF} fill={ST} opacity={0.7} textAnchor="middle">CA Final Exam · Writing hard</text>
    </g>
  );
};

/* Scene 4 – FAIL + Loop */
const Scene4 = () => {
  const G = 182; const ox = 1020;
  return (
    <g transform={`translate(${ox},0)`}>
      {/* Big X */}
      <line x1={35} y1={55} x2={135} y2={155} stroke={R} strokeWidth={5} strokeLinecap="round" opacity={0.85}/>
      <line x1={135} y1={55} x2={35} y2={155} stroke={R} strokeWidth={5} strokeLinecap="round" opacity={0.85}/>

      {/* Scattered score sheets */}
      <g transform="rotate(-14,80,120)">
        <rect x={42} y={90} width={30} height={40} rx={2} stroke={ST} strokeWidth={0.8} fill="rgba(250,248,244,0.9)"/>
        <text x={57} y={103} fontSize={5.5} fontFamily={MF} fill={ST} textAnchor="middle" opacity={0.8}>AUDIT</text>
        <text x={57} y={114} fontSize={9} fontFamily={MF} fill={R} textAnchor="middle" fontWeight="bold" opacity={0.9}>29/100</text>
        <text x={57} y={124} fontSize={7} fill={R} textAnchor="middle" opacity={0.8}>✗</text>
      </g>
      <g transform="rotate(10,170,105)">
        <rect x={140} y={80} width={30} height={40} rx={2} stroke={ST} strokeWidth={0.8} fill="rgba(250,248,244,0.9)"/>
        <text x={155} y={93} fontSize={4.5} fontFamily={MF} fill={ST} textAnchor="middle" opacity={0.8}>CORP LAW</text>
        <text x={155} y={104} fontSize={9} fontFamily={MF} fill={R} textAnchor="middle" fontWeight="bold" opacity={0.9}>33/100</text>
        <text x={155} y={114} fontSize={7} fill={R} textAnchor="middle" opacity={0.8}>✗</text>
      </g>

      {/* FAIL stamp */}
      <g transform="rotate(-8,240,120)">
        <rect x={195} y={100} width={70} height={28} rx={3} stroke={R} strokeWidth={1.5} fill="rgba(146,64,14,0.05)"/>
        <text x={230} y={118} fontSize={16} fontFamily={MF} fill={R} fontWeight="bold" textAnchor="middle" opacity={0.9}>FAIL</text>
      </g>

      {/* Sad figure */}
      <circle cx={220} cy={G-56} r={9} stroke={ST} strokeWidth={1.5} fill="none"/>
      {/* Sad mouth */}
      <path d={`M215,${G-50} Q220,${G-46} 225,${G-50}`} stroke={ST} strokeWidth={0.8} fill="none" opacity={0.7}/>
      {/* Body slumped */}
      <line x1={220} y1={G-47} x2={220} y2={G-22} stroke={ST} strokeWidth={1.5}/>
      {/* Arms hanging */}
      <line x1={220} y1={G-40} x2={206} y2={G-26} stroke={ST} strokeWidth={1.5}/>
      <line x1={220} y1={G-40} x2={234} y2={G-26} stroke={ST} strokeWidth={1.5}/>
      <line x1={220} y1={G-22} x2={212} y2={G} stroke={ST} strokeWidth={1.5}/>
      <line x1={220} y1={G-22} x2={228} y2={G} stroke={ST} strokeWidth={1.5}/>
      {/* Teardrops */}
      <path d={`M214,${G-51} Q212,${G-45} 214,${G-41}`} stroke="#93C5FD" strokeWidth={0.9} fill="none" opacity={0.55}/>
      <path d={`M226,${G-49} Q228,${G-43} 226,${G-39}`} stroke="#93C5FD" strokeWidth={0.9} fill="none" opacity={0.55}/>

      {/* Loop / repeat arrow */}
      <path d={`M290,${G-28} Q316,${G-90} 295,${G-115} Q268,${G-130} 248,${G-80} Q240,${G-52} 268,${G-28}`}
        stroke={ST} strokeWidth={1} strokeDasharray="5,5" fill="none" opacity={0.45}/>
      <path d={`M268,${G-28} L260,${G-18} M268,${G-28} L278,${G-22}`} stroke={ST} strokeWidth={1} fill="none" opacity={0.45}/>
      <text x={300} y={G-120} fontSize={8} fontFamily={MF} fill={ST} textAnchor="middle" opacity={0.55}>repeat?</text>

      <text x={185} y={212} fontSize={9} fontFamily={MF} fill={R} opacity={0.85} textAnchor="middle">Result: FAIL · Back to square one</text>
    </g>
  );
};

/* Scene 5 – Clarix Insight */
const Scene5 = () => {
  const G = 182; const ox = 1360;
  const cx = 112, cy = G - 95; // lightbulb center
  return (
    <g transform={`translate(${ox},0)`}>
      {/* Glow */}
      <circle cx={cx} cy={cy} r={60} fill={A} opacity={0.04}/>
      <circle cx={cx} cy={cy} r={38} fill={A} opacity={0.06}/>

      {/* Laptop */}
      <rect x={20} y={G-112} width={96} height={66} rx={5} stroke={A} strokeWidth={1.4} fill="rgba(212,147,10,0.05)"/>
      <rect x={12} y={G-46} width={112} height={6} rx={2} stroke={A} strokeWidth={1} fill="rgba(212,147,10,0.08)"/>
      {/* Screen */}
      <text x={68} y={G-97} fontSize={8} fontFamily={MF} fill={A} textAnchor="middle" fontWeight="600">Clarix.ai</text>
      <line x1={26} y1={G-89} x2={110} y2={G-89} stroke={A} strokeWidth={0.5} opacity={0.4}/>
      {/* Diagnostic bars */}
      {[["Ind AS 115", 0.72], ["SA 315", 0.58], ["Corp Law §184", 0.65], ["SFM — NPV", 0.48]].map(([label, pct], i) => (
        <g key={label as string}>
          <text x={26} y={G-81+i*10} fontSize={4.8} fontFamily={MF} fill={A} opacity={0.85}>{label as string}</text>
          <rect x={86} y={G-86+i*10} width={(pct as number)*28} height={4} rx={1} fill={A} opacity={0.35}/>
          <rect x={86} y={G-86+i*10} width={28} height={4} rx={1} stroke={A} strokeWidth={0.5} fill="none" opacity={0.25}/>
        </g>
      ))}

      {/* Lightbulb */}
      <circle cx={cx} cy={cy} r={16} stroke={A} strokeWidth={1.4} fill="rgba(212,147,10,0.1)"/>
      <line x1={cx} y1={cy+16} x2={cx} y2={cy+22} stroke={A} strokeWidth={1.2}/>
      <line x1={cx-5} y1={cy+22} x2={cx+5} y2={cy+22} stroke={A} strokeWidth={1.2}/>
      {/* Rays */}
      {[0,45,90,135,180,225,270,315].map(deg => {
        const rad = deg * Math.PI / 180;
        return (
          <line key={deg}
            x1={cx + 20*Math.cos(rad)} y1={cy + 20*Math.sin(rad)}
            x2={cx + 26*Math.cos(rad)} y2={cy + 26*Math.sin(rad)}
            stroke={A} strokeWidth={0.8} opacity={0.6}/>
        );
      })}

      {/* Excited figure (x=165) */}
      <circle cx={175} cy={G-56} r={9} stroke={ST} strokeWidth={1.5} fill="none"/>
      <line x1={175} y1={G-47} x2={175} y2={G-22} stroke={ST} strokeWidth={1.5}/>
      {/* Leaning forward, arm pointing at screen */}
      <line x1={175} y1={G-40} x2={160} y2={G-50} stroke={ST} strokeWidth={1.5}/>
      <line x1={175} y1={G-40} x2={162} y2={G-30} stroke={ST} strokeWidth={1.5}/>
      <line x1={175} y1={G-22} x2={166} y2={G} stroke={ST} strokeWidth={1.5}/>
      <line x1={175} y1={G-22} x2={184} y2={G} stroke={ST} strokeWidth={1.5}/>
      {/* Pointing arrow to screen */}
      <path d={`M166,${G-48} Q148,${G-52} 122,${G-58}`} stroke={A} strokeWidth={0.9} strokeDasharray="3,3" fill="none" opacity={0.6}/>

      {/* Floating insight labels */}
      <rect x={178} y={G-140} width={70} height={13} rx={2} stroke={A} strokeWidth={0.7} fill="rgba(212,147,10,0.08)"/>
      <text x={213} y={G-131} fontSize={5.5} fontFamily={MF} fill={A} textAnchor="middle">Application gap ← root cause</text>
      <rect x={188} y={G-124} width={52} height={13} rx={2} stroke={A} strokeWidth={0.7} fill="rgba(212,147,10,0.08)"/>
      <text x={214} y={G-115} fontSize={5.5} fontFamily={MF} fill={A} textAnchor="middle">SA 315 — weakest</text>
      <rect x={200} y={G-108} width={52} height={13} rx={2} stroke={A} strokeWidth={0.7} fill="rgba(212,147,10,0.06)"/>
      <text x={226} y={G-99} fontSize={5.5} fontFamily={MF} fill={A} textAnchor="middle">8-week plan ready</text>

      <text x={145} y={212} fontSize={9} fontFamily={MF} fill={A} opacity={0.95} textAnchor="middle">Clarix · Real gaps diagnosed</text>
    </g>
  );
};

/* Scene 6 – PASS! */
const Scene6 = () => {
  const G = 182; const ox = 1700;
  return (
    <g transform={`translate(${ox},0)`}>
      {/* Green glow */}
      <circle cx={155} cy={G-90} r={65} fill={P} opacity={0.04}/>

      {/* Certificate */}
      <rect x={22} y={G-115} width={100} height={72} rx={4} stroke={P} strokeWidth={1.2} fill="rgba(21,128,61,0.05)"/>
      {/* Seal */}
      <circle cx={72} cy={G-100} r={14} stroke={P} strokeWidth={0.9} fill="rgba(21,128,61,0.07)"/>
      <text x={72} y={G-103} fontSize={8} fill={P} textAnchor="middle" fontWeight="bold" opacity={0.9}>✓</text>
      <line x1={30} y1={G-83} x2={114} y2={G-83} stroke={P} strokeWidth={0.6} opacity={0.4}/>
      <text x={72} y={G-75} fontSize={7} fontFamily={MF} fill={P} textAnchor="middle">CA FINAL</text>
      <text x={72} y={G-64} fontSize={7.5} fontFamily={MF} fill={P} textAnchor="middle" fontWeight="600">GROUP 1</text>
      <text x={72} y={G-54} fontSize={6} fontFamily={MF} fill={P} textAnchor="middle">CLEARED ✓</text>

      {/* Big check sweep */}
      <path d={`M148,${G-75} L185,${G-38} L270,${G-145}`} stroke={P} strokeWidth={4.5} strokeLinecap="round" fill="none" opacity={0.85}/>

      {/* Jumping figure at x=290 */}
      <circle cx={284} cy={G-76} r={10} stroke={ST} strokeWidth={1.5} fill="none"/>
      <line x1={284} y1={G-66} x2={284} y2={G-38} stroke={ST} strokeWidth={1.5}/>
      {/* Arms wide up — celebrating */}
      <line x1={284} y1={G-58} x2={265} y2={G-42} stroke={ST} strokeWidth={1.5}/>
      <line x1={284} y1={G-58} x2={303} y2={G-42} stroke={ST} strokeWidth={1.5}/>
      {/* Fist bump — small circle at end of right arm */}
      <circle cx={303} cy={G-42} r={3} stroke={ST} strokeWidth={1} fill="none"/>
      {/* Legs jumping spread */}
      <line x1={284} y1={G-38} x2={272} y2={G-20} stroke={ST} strokeWidth={1.5}/>
      <line x1={284} y1={G-38} x2={296} y2={G-20} stroke={ST} strokeWidth={1.5}/>

      {/* Confetti */}
      {[
        {x:142,y:G-140,r:3,c:A,rot:0},{x:158,y:G-128,r:2.5,c:P,rot:45},
        {x:195,y:G-148,r:3.5,c:A,rot:20},{x:220,y:G-135,r:2,c:P,rot:0},
        {x:240,y:G-145,r:3,c:A,rot:30},{x:256,y:G-128,r:2.5,c:P,rot:15},
        {x:272,y:G-142,r:3,c:A,rot:0},{x:300,y:G-138,r:2.5,c:P,rot:45},
        {x:316,y:G-120,r:3,c:A,rot:20},{x:330,y:G-135,r:2,c:P,rot:0},
      ].map(({x,y,r,c},i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={c} opacity={0.55}/>
      ))}
      {/* Confetti strips */}
      {[
        {x:168,y:G-158,a:25,c:A},{x:208,y:G-162,a:-18,c:P},
        {x:246,y:G-158,a:32,c:A},{x:288,y:G-155,a:-22,c:P},
        {x:320,y:G-148,a:14,c:A},{x:310,y:G-120,a:-30,c:P},
      ].map(({x,y,a,c},i) => (
        <rect key={i} x={x} y={y} width={10} height={3} rx={1} fill={c} opacity={0.6} transform={`rotate(${a},${x},${y})`}/>
      ))}

      {/* Stars */}
      <text x={150} y={G-152} fontSize={12} fill={A} opacity={0.8}>✦</text>
      <text x={228} y={G-160} fontSize={9} fill={A} opacity={0.7}>★</text>
      <text x={318} y={G-152} fontSize={11} fill={A} opacity={0.75}>✦</text>
      <text x={340} y={G-130} fontSize={8} fill={P} opacity={0.7}>✦</text>

      <text x={185} y={212} fontSize={9} fontFamily={MF} fill={P} opacity={0.95} textAnchor="middle">May 2025 · Group 1 Cleared ✓</text>
    </g>
  );
};

/* Connecting footsteps and scene separators */
const StripConnectors = () => {
  const G = 182;
  const footsteps = Array.from({length: 28}, (_, i) => i * 72 + 50);
  return (
    <>
      {/* Ground */}
      <line x1={0} y1={G} x2={2040} y2={G} stroke={ST} strokeWidth={0.6} strokeDasharray="4,9" opacity={0.35}/>
      {/* Scene separators */}
      {[340,680,1020,1360,1700].map(x => (
        <line key={x} x1={x} y1={48} x2={x} y2={208} stroke={ST} strokeWidth={0.35} strokeDasharray="3,5" opacity={0.25}/>
      ))}
      {/* Footsteps */}
      {footsteps.map((x, i) => (
        <ellipse key={i} cx={x} cy={G + (i%2===0?4:7)} rx={3} ry={4}
          stroke={ST} strokeWidth={0.6} fill="none" opacity={0.18}
          transform={`rotate(${i%2===0?-12:12},${x},${G+5})`}/>
      ))}
    </>
  );
};

/* Full strip component */
function CAJourneyStrip() {
  return (
    <section style={{
      background: "var(--c-parchment)",
      borderBottom: "1px solid var(--c-border)",
      paddingTop: 20,
      overflow: "hidden",
    }}>
      {/* Eyebrow */}
      <div style={{
        fontFamily: MF, fontSize: 10, color: A,
        letterSpacing: ".1em", textTransform: "uppercase",
        padding: "0 40px 16px",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ display: "inline-block", width: 16, height: 1, background: A }}/>
        The CA aspirant loop — animated
        <span style={{ marginLeft: "auto", color: "var(--c-muted)", fontSize: 9, letterSpacing: ".08em" }}>
          scroll →  scroll → 
        </span>
      </div>

      {/* Panoramic strip */}
      <div style={{ overflow: "hidden" }}>
        <div style={{
          display: "flex",
          width: "max-content",
          animation: "journeyPan 34s linear infinite",
        }}>
          {[0, 1].map(pass => (
            <svg key={pass} width={2040} height={230} viewBox="0 0 2040 230" fill="none" style={{ display: "block", flexShrink: 0 }}>
              <StripConnectors />
              <Scene1 />
              <Scene2 />
              <Scene3 />
              <Scene4 />
              <Scene5 />
              <Scene6 />
            </svg>
          ))}
        </div>
      </div>

      {/* Scene label row */}
      <div style={{
        display: "flex", gap: 0, paddingBottom: 14, paddingTop: 2,
        overflow: "hidden",
      }}>
        {[
          "BCom · Start",
          "Coaching · Year 1",
          "CA Exam · May 2024",
          "FAIL · Same loop",
          "Clarix · Diagnosis",
          "PASS · May 2025",
        ].map((label, i) => (
          <div key={i} style={{
            flex: "0 0 calc(100% / 6)", textAlign: "center",
            fontFamily: MF, fontSize: 8.5, letterSpacing: ".06em",
            color: i === 3 ? R : i === 4 ? A : i === 5 ? P : "var(--c-muted)",
            opacity: 0.85, paddingTop: 4,
            fontWeight: i === 5 ? 600 : 400,
          }}>
            {label}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN HOME PAGE
   ══════════════════════════════════════════════════════ */
export default function Home() {
  const howRef  = useRef<HTMLDivElement>(null);
  const ctaRef  = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const els = document.querySelectorAll(".heading-underline");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("revealed"); obs.unobserve(e.target); }
      }),
      { threshold: 0.4 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const border   = "var(--c-border)";
  const muted    = "var(--c-muted)";
  const amber    = "var(--c-amber)";
  const charcoal = "var(--c-charcoal)";
  const surface  = "var(--c-surface)";
  const parchment = "var(--c-parchment)";
  const white    = "var(--c-white)";

  return (
    <div className="clarix-page" style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section style={{ padding: "80px 40px 64px", borderBottom: `1px solid ${border}` }}>
        <div className="animate-in" style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: amber,
          letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 28,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ display: "inline-block", width: 24, height: 1, background: amber }} />
          AI-powered CA Final diagnostics
        </div>

        <h1 className="clarix-h1 animate-in" style={{ animationDelay: "80ms" }}>
          Know <em className="clarix-em">exactly</em> why you're failing.<br />Fix it.
        </h1>

        <p className="animate-in" style={{
          animationDelay: "160ms", fontSize: 15, color: muted,
          lineHeight: 1.7, maxWidth: 480, margin: "24px 0 40px",
        }}>
          Most CA repeaters study more of the same thing that failed them the last time.
          Clarix.ai analyses your weaknesses at the question-type level — mapped to ICAI's
          own papers — and builds a precision plan around them.
        </p>

        <div className="animate-in" style={{
          animationDelay: "240ms", display: "flex",
          alignItems: "center", gap: 20, flexWrap: "wrap",
        }}>
          <button className="btn-primary" onClick={() => scrollTo(ctaRef)}>
            Get Your Free Diagnostic →
          </button>
          <button className="btn-ghost" onClick={() => scrollTo(howRef)}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />
            </svg>
            See how it works
          </button>
        </div>

        <p className="price-note" style={{ marginTop: 18 }}>
          First 50 aspirants only · Normally{" "}
          <s style={{ opacity: 0.6 }}>₹499</s>{" "}
          · ICAI-specific, not generic AI
        </p>
      </section>

      {/* ── JOURNEY STRIP ─────────────────────────────────── */}
      <CAJourneyStrip />

      {/* ── STATS ──────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderBottom: `1px solid ${border}` }}>
        {[
          { num: "10", sup: "–15%", label: "CA Final pass rate per attempt. The exam is designed to fail most." },
          { num: "3",  sup: "×",    label: "Average attempts before passing. That's 18+ months of lost time." },
          { num: "₹0", sup: "",     label: "Tools that tell you exactly why you failed your last paper." },
        ].map((s, i) => (
          <div key={i} style={{
            padding: "28px 36px",
            borderRight: i < 2 ? `1px solid ${border}` : undefined,
            background: surface,
          }}>
            <div className="stat-num-serif">
              {s.num}
              {s.sup && <span style={{ color: amber, fontSize: 26 }}>{s.sup}</span>}
            </div>
            <div style={{ fontSize: 13, color: muted, lineHeight: 1.55 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── PROBLEM ────────────────────────────────────────── */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <LedgerDoodle />
        <div style={{
          padding: "64px 40px", borderBottom: `1px solid ${border}`,
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "start",
        }} className="responsive-two-col">
          <div>
            <span className="section-label">The problem</span>
            <h2 className="clarix-h2">
              You're not failing because you're not studying{" "}
              <em className="clarix-em heading-underline">enough.</em>
            </h2>
            <p style={{ fontSize: 15, color: muted, lineHeight: 1.7 }}>
              You're failing because you don't know what to study differently. Every
              coaching platform sells you more content — more videos, more notes, more mock
              tests. None of them diagnose you. Clarix.ai does.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { n: "01", title: "Concept gaps aren't visible", body: "You score 35 in Audit and don't know if it's Ind AS confusion, SA misapplication, or time pressure. Generic mock reports don't tell you." },
              { n: "02", title: "Question-type failures are ignored", body: "CA papers test judgment, not recall. If you're strong on theory but weak on application questions, no test series will catch that pattern." },
              { n: "03", title: "Revision is inefficient by default", body: "With 8 subjects, every student revises everything equally. That's precisely wrong — and it costs you attempts." },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 16,
                padding: "20px 0", borderBottom: `1px solid ${border}`,
                borderTop: i === 0 ? `1px solid ${border}` : undefined,
              }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: amber, marginTop: 3, minWidth: 24, letterSpacing: ".06em" }}>{item.n}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: charcoal, marginBottom: 5, letterSpacing: "-0.01em" }}>{item.title}</div>
                  <div style={{ fontSize: 14, color: muted, lineHeight: 1.65 }}>{item.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ───────────────────────────────────── */}
      <div ref={howRef} style={{ padding: "64px 40px", borderBottom: `1px solid ${border}`, background: surface }}>
        <span className="section-label">How it works</span>
        <h2 className="clarix-h2">
          Three steps. One{" "}
          <em className="clarix-em heading-underline">clear</em> plan.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 36 }}
          className="responsive-three-col">
          {[
            { step: "STEP 01", title: "You share your attempt data", body: "Fill a 10-minute intake form — past attempt scores, subjects appearing for, specific topics you find hard. No uploads needed.", tag: "10 min intake" },
            { step: "STEP 02", title: "AI analyses your failure pattern", body: "Clarix.ai cross-references your data against ICAI past papers, RTPs, and MTP patterns to identify your exact weakness profile.", tag: "ICAI-mapped AI" },
            { step: "STEP 03", title: "You get a precision study plan", body: "A personalised 30/60/90-day plan with topic prioritisation and question-type drills — calibrated to your actual exam date.", tag: "Delivered in 48hrs" },
          ].map((s, i) => (
            <div key={i} className="step-card">
              <div className="step-num-tag">{s.step}</div>
              <div className="step-title">{s.title}</div>
              <div style={{ fontSize: 14, color: muted, lineHeight: 1.65 }}>{s.body}</div>
              <div className="step-tag">{s.tag}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── WHY TRUST ──────────────────────────────────────── */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <NeuralDoodle />
        <div style={{
          padding: "64px 40px", borderBottom: `1px solid ${border}`,
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "start",
        }} className="responsive-two-col">
          <div>
            <span className="section-label">Why trust this</span>
            <h2 className="clarix-h2">
              Built on{" "}
              <em className="clarix-em heading-underline">ICAI's</em>{" "}
              own material. Nothing else.
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 24, marginBottom: 28 }}>
              {["BCom graduate", "CA aspirant", "AI researcher", "ICAI curriculum specialist"].map(tag => (
                <span key={tag} className="trust-pill">{tag}</span>
              ))}
            </div>
            <p style={{ fontSize: 15, color: muted, lineHeight: 1.7 }}>Clarix.ai was built by a CA aspirant who experienced the preparation gap firsthand — and spent months mapping ICAI's exam patterns, past papers, and marking schemes using AI. The diagnostic is grounded entirely in ICAI's published material: study material, RTPs, MTPs, and suggested answers. Not generic AI. Not assumptions. The same sources ICAI uses to set the papers.</p>
          </div>
          <div className="insight-card">
            <span className="insight-label">What the diagnostic is built on</span>
            {[
              { text: "ICAI CA Final past papers — last 10 attempts", sub: "Both Group 1 and Group 2, all papers mapped by question type." },
              { text: "ICAI Revision Test Papers (RTPs) and Mock Test Papers (MTPs)", sub: "Pattern-analysed across attempts to identify high-weight topics." },
              { text: "ICAI suggested answers and marking schemes", sub: "Understand exactly what the examiner awards marks for." },
              { text: "AI trained to distinguish recall vs application gaps", sub: "The question-type split that no coaching platform diagnoses." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: i < 3 ? `1px solid ${border}` : undefined }}>
                <div className="insight-dot" />
                <div>
                  <div style={{ fontSize: 14, color: charcoal, lineHeight: 1.6, fontWeight: 500 }}>{item.text}</div>
                  <div style={{ fontSize: 13, color: muted, marginTop: 3 }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── DISCLAIMER ─────────────────────────────────────── */}
      <div style={{
        padding: "20px 40px", background: "#FFFBF2",
        borderTop: `1px solid rgba(212,147,10,0.2)`, borderBottom: `1px solid rgba(212,147,10,0.2)`,
        borderLeft: `4px solid var(--c-amber)`,
        display: "flex", alignItems: "flex-start", gap: 14,
      }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 500,
          color: amber, flexShrink: 0, background: "rgba(212,147,10,0.12)",
          padding: "2px 7px", borderRadius: 3, letterSpacing: ".04em",
        }}>!</div>
        <p style={{ fontSize: 13, color: muted, lineHeight: 1.7 }}>
          <strong style={{ color: charcoal, fontWeight: 600 }}>Full transparency:</strong>{" "}
          Clarix.ai is an AI-powered diagnostic tool built by a BCom graduate and CA aspirant —
          not a registered Chartered Accountant or a CA coaching institute. The diagnostic
          analyses ICAI exam patterns using AI and is reviewed for quality before delivery.
          It is not a substitute for professional CA guidance or ICAI-approved coaching.
          Results are study planning recommendations, not guaranteed outcomes.
        </p>
      </div>

      {/* ── CTA ────────────────────────────────────────────── */}
      <div ref={ctaRef} style={{ padding: "88px 40px", textAlign: "center", background: parchment }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <div className="cta-price">
            Launch offer ·{" "}
            <span style={{ color: "var(--c-amber-lt)" }}>Free for first 50 aspirants</span>{" "}
            · Normally <s style={{ opacity: 0.55 }}>₹499</s>
          </div>
          <div className="cta-h">Get your diagnostic report.</div>
          <p style={{ fontSize: 15, color: muted, lineHeight: 1.7, marginBottom: 36 }}>
            Stop revising blindly. Find out exactly which gaps are costing you marks —
            and get a plan that fixes them before your next attempt.
          </p>
          <Link href="/diagnostic">
            <button className="btn-primary" style={{ fontSize: 13, padding: "16px 40px" }}>
              Start Free Diagnostic →
            </button>
          </Link>
          <p className="price-note" style={{ marginTop: 16 }}>
            Delivered within 48 hours ·{" "}
            <span className="price-note-amber">ICAI-mapped AI analysis</span>{" "}
            · First 50 aspirants only
          </p>
        </div>
      </div>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer style={{
        padding: "22px 40px", borderTop: `1px solid ${border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: muted,
        flexWrap: "wrap", gap: 8, background: white,
      }}>
        <span>© 2025 Clarix.ai</span>
        <span>AI-powered · ICAI-grounded · Built by a CA aspirant</span>
      </footer>

      <style>{`
        @keyframes journeyPan {
          from { transform: translateX(0) }
          to   { transform: translateX(-2040px) }
        }
        @media (max-width: 640px) {
          .responsive-two-col   { grid-template-columns: 1fr !important; gap: 40px !important; }
          .responsive-three-col { grid-template-columns: 1fr !important; }
          section, .clarix-nav,
          div[style*="padding: 64px 40px"],
          div[style*="padding: 80px 40px"],
          div[style*="padding: 88px 40px"],
          div[style*="padding: 28px 36px"],
          div[style*="padding: 20px 40px"],
          div[style*="padding: 22px 40px"],
          footer { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>
    </div>
  );
}
