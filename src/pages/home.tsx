import { useRef, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

/* ── Design tokens ── */
const MF  = "'IBM Plex Mono',monospace";
const A   = "#7C3F00";   // dark amber — contrast on gold bg
const R   = "rgba(100,20,0,0.92)";  // deep red — contrast on gold bg

/* ── Page bg doodles ── */
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
const NeuralDoodle = () => (
  <svg width="200" height="200" viewBox="0 0 100 100" fill="none" aria-hidden="true"
    style={{ position:"absolute", left:"2%", top:"15%", opacity:0.055, pointerEvents:"none", userSelect:"none" }}>
    <circle cx="50" cy="50" r="6" stroke="#1C1917" strokeWidth="1.2"/>
    {([[50,18],[78,32],[78,68],[50,82],[22,68],[22,32]] as [number,number][]).map(([cx,cy])=><circle key={`${cx}${cy}`} cx={cx} cy={cy} r="4" stroke="#1C1917" strokeWidth="1"/>)}
    {([[50,44,50,22],[56,46,74,35],[56,54,74,65],[50,56,50,78],[44,54,26,65],[44,46,26,35]] as [number,number,number,number][]).map(([x1,y1,x2,y2])=>(
      <line key={`${x1}${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1C1917" strokeWidth="0.9" strokeLinecap="round"/>
    ))}
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   CA ASPIRANT JOURNEY STRIP
   7 scenes × 340px = 2380px — auto-pans in seamless loop
   ══════════════════════════════════════════════════════════════ */

const SCENE_W = 340;
const G = 182;        // ground Y
const SW = 1.5;       // figure stroke width
// Color progression per scene (0-indexed) — all dark enough to show on #FFBF00
const SC = ["#1C1917","#1C1917","#4A2800","#2C2C2A","#5C5751","#7C3F00","#1A5C3A"];

function JourneyScenes() {
  const [s1, s2, s3, s4, s5, s6, s7] = SC;
  const P = "#1A5C3A";

  return (
    <>
      {/* ── Continuous ground line ── */}
      <line x1={0} y1={G} x2={2380} y2={G} stroke="rgba(28,25,23,0.35)" strokeWidth="1.5" strokeDasharray="6 4"/>
      {/* Scene separators */}
      {[340,680,1020,1360,1700,2040].map(x=>(
        <line key={x} x1={x} y1={46} x2={x} y2={208} stroke="rgba(28,25,23,0.2)" strokeWidth={0.5} strokeDasharray="3,5"/>
      ))}

      {/* ══ SCENE 1 — The Beginning (x: 0-340) ══ */}
      {/* Floating cloud */}
      <motion.g animate={{ x: [0,8,0] }} transition={{ repeat:Infinity, duration:9, ease:"easeInOut" }} style={{ willChange:"transform" }}>
        <path d="M28,42 Q38,30 48,42 Q58,27 70,42 Q74,34 80,42 Q72,50 54,50 Q36,50 28,42 Z"
          stroke={s1} strokeWidth="1.1" fill="none" opacity="0.14"/>
      </motion.g>
      {/* BCom College building */}
      <rect x={22} y={58} width={118} height={124} stroke={s1} strokeWidth={1.1} fill="none"/>
      <path d="M22,58 L81,26 L140,58" stroke={s1} strokeWidth={1.1} fill="none"/>
      {[36,57,78,99,120].map(x=><line key={x} x1={x} y1={58} x2={x} y2={104} stroke={s1} strokeWidth={0.7}/>)}
      {[30,68,106].map(x=><rect key={x} x={x} y={112} width={16} height={20} stroke={s1} strokeWidth={0.75} fill="none"/>)}
      {[30,106].map(x=><rect key={x} x={x} y={74} width={16} height={16} stroke={s1} strokeWidth={0.75} fill="none"/>)}
      <rect x={64} y={148} width={26} height={34} rx={2} stroke={s1} strokeWidth={0.9} fill="none"/>
      <text x={36} y={51} fontSize={6} fontFamily={MF} fill={s1} opacity={0.8} letterSpacing={0.5}>B·COM COLLEGE</text>
      {/* Tree */}
      <line x1={172} y1={G} x2={172} y2={G-34} stroke={s1} strokeWidth={1.2} opacity={0.18}/>
      <path d={`M160,${G-34} L172,${G-56} L184,${G-34} Z`} stroke={s1} strokeWidth={1.2} fill="none" opacity={0.18}/>
      {/* Excited figure: one arm raised high, body tilted slightly */}
      <circle cx={238} cy={G-58} r={9} stroke={s1} strokeWidth={SW} fill="none"/>
      <rect x={228} y={G-71} width={20} height={4} stroke={A} strokeWidth={1} fill="rgba(212,147,10,0.12)"/>
      <line x1={238} y1={G-71} x2={238} y2={G-67} stroke={A} strokeWidth={1}/>
      <line x1={238} y1={G-49} x2={238} y2={G-22} stroke={s1} strokeWidth={SW}/>
      <line x1={238} y1={G-41} x2={256} y2={G-58} stroke={s1} strokeWidth={SW}/>
      <line x1={238} y1={G-41} x2={222} y2={G-30} stroke={s1} strokeWidth={SW}/>
      <line x1={238} y1={G-23} x2={229} y2={G} stroke={s1} strokeWidth={SW}/>
      <line x1={238} y1={G-23} x2={247} y2={G} stroke={s1} strokeWidth={SW}/>
      {/* Animated sparkles near raised hand */}
      <motion.path d={`M258,${G-72} L263,${G-80}`} stroke={A} strokeWidth={1.5} strokeLinecap="round"
        animate={{ opacity:[0,1,0] }} transition={{ repeat:Infinity, duration:1.8, delay:0 }} style={{ willChange:"opacity" }}/>
      <motion.path d={`M266,${G-62} L271,${G-68}`} stroke={A} strokeWidth={1.4} strokeLinecap="round"
        animate={{ opacity:[0,1,0] }} transition={{ repeat:Infinity, duration:1.8, delay:0.4 }} style={{ willChange:"opacity" }}/>
      <motion.path d={`M262,${G-53} L268,${G-55}`} stroke={A} strokeWidth={1.2} strokeLinecap="round"
        animate={{ opacity:[0,1,0] }} transition={{ repeat:Infinity, duration:1.8, delay:0.8 }} style={{ willChange:"opacity" }}/>
      {/* Direction travel arrows */}
      <path d={`M305,${G-4} L316,${G} L305,${G+4}`} fill="none" stroke={A} strokeWidth={1} opacity={0.35}/>
      <path d={`M320,${G-4} L331,${G} L320,${G+4}`} fill="none" stroke={A} strokeWidth={1} opacity={0.25}/>

      {/* ══ SCENE 2 — Joins Coaching (x: 340-680) ══ */}
      {/* Small bird flying */}
      <motion.path d={`M445,38 Q451,32 457,38`} stroke={s2} strokeWidth={1.2} strokeLinecap="round" fill="none" opacity={0.18}
        animate={{ x:[0,22,0], y:[0,-5,0] }} transition={{ repeat:Infinity, duration:10, ease:"easeInOut" }} style={{ willChange:"transform" }}/>
      {/* Coaching institute building */}
      <rect x={358} y={42} width={95} height={140} stroke={s2} strokeWidth={1.1} fill="none"/>
      <line x1={358} y1={95} x2={453} y2={95} stroke={s2} strokeWidth={0.7} opacity={0.4}/>
      <line x1={358} y1={138} x2={453} y2={138} stroke={s2} strokeWidth={0.7} opacity={0.4}/>
      <rect x={358} y={47} width={95} height={18} stroke={A} strokeWidth={0.8} fill="rgba(212,147,10,0.07)"/>
      <text x={405} y={59} fontSize={5.5} fontFamily={MF} fill={A} textAnchor="middle" opacity={0.9}>COACHING INSTITUTE</text>
      {[364,390,416].map(x=><rect key={x} x={x} y={102} width={14} height={20} stroke={s2} strokeWidth={0.75} fill="none"/>)}
      {[364,390,416].map(x=><rect key={x} x={x} y={146} width={14} height={20} stroke={s2} strokeWidth={0.75} fill="none"/>)}
      <rect x={382} y={162} width={20} height={20} rx={1} stroke={s2} strokeWidth={0.9} fill="none"/>
      {/* Confident walking student with books — head slightly raised */}
      <circle cx={478} cy={G-58} r={9} stroke={s2} strokeWidth={SW} fill="none"/>
      <line x1={478} y1={G-49} x2={478} y2={G-22} stroke={s2} strokeWidth={SW}/>
      {/* Arm forward holding books */}
      <line x1={478} y1={G-41} x2={494} y2={G-50} stroke={s2} strokeWidth={SW}/>
      {/* Book stack in hand */}
      <rect x={492} y={G-60} width={9} height={5} rx={1} stroke={s2} strokeWidth={1.2} fill="none"/>
      <rect x={492} y={G-55} width={9} height={5} rx={1} stroke={s2} strokeWidth={1.2} fill="none"/>
      <rect x={491} y={G-50} width={11} height={5} rx={1} stroke={s2} strokeWidth={1.2} fill="none"/>
      <line x1={478} y1={G-41} x2={462} y2={G-28} stroke={s2} strokeWidth={SW}/>
      <line x1={478} y1={G-22} x2={468} y2={G} stroke={s2} strokeWidth={SW}/>
      <line x1={478} y1={G-22} x2={490} y2={G-10} stroke={s2} strokeWidth={SW}/>
      {/* Second student */}
      <circle cx={518} cy={G-52} r={7} stroke={s2} strokeWidth={1.2} fill="none"/>
      <line x1={518} y1={G-45} x2={518} y2={G-22} stroke={s2} strokeWidth={1.2}/>
      <line x1={518} y1={G-37} x2={507} y2={G-28} stroke={s2} strokeWidth={1.2}/>
      <line x1={518} y1={G-37} x2={529} y2={G-44} stroke={s2} strokeWidth={1.2}/>
      <line x1={518} y1={G-22} x2={510} y2={G} stroke={s2} strokeWidth={1.2}/>
      <line x1={518} y1={G-22} x2={526} y2={G} stroke={s2} strokeWidth={1.2}/>
      {/* Blackboard with subjects */}
      <rect x={548} y={82} width={76} height={50} rx={2} stroke={A} strokeWidth={0.9} fill="rgba(212,147,10,0.04)"/>
      <text x={586} y={97} fontSize={7} fontFamily={MF} fill={A} textAnchor="middle" opacity={0.9}>CA FINAL</text>
      <line x1={553} y1={102} x2={619} y2={102} stroke={A} strokeWidth={0.5} opacity={0.4}/>
      {["FR","SFM","AUDIT","C.LAW"].map((s,i)=>(
        <text key={s} x={555+i*17} y={115} fontSize={4.8} fontFamily={MF} fill={s2} opacity={0.65}>{s}</text>
      ))}
      {/* Teacher */}
      <circle cx={630} cy={108} r={5} stroke={s2} strokeWidth={1} fill="none"/>
      <line x1={630} y1={113} x2={630} y2={130} stroke={s2} strokeWidth={1}/>
      <line x1={630} y1={118} x2={621} y2={125} stroke={s2} strokeWidth={1}/>
      <line x1={630} y1={118} x2={639} y2={113} stroke={s2} strokeWidth={1}/>
      <line x1={630} y1={130} x2={624} y2={G} stroke={s2} strokeWidth={1}/>
      <line x1={630} y1={130} x2={636} y2={G} stroke={s2} strokeWidth={1}/>
      <line x1={639} y1={113} x2={624} y2={102} stroke={s2} strokeWidth={0.8} opacity={0.6}/>
      {/* Travel arrows */}
      <path d={`M645,${G-4} L656,${G} L645,${G+4}`} fill="none" stroke={A} strokeWidth={1} opacity={0.3}/>

      {/* ══ SCENE 3 — CA Final Exam (x: 680-1020) ══ */}
      {/* Hall walls */}
      <rect x={692} y={52} width={316} height={128} stroke={s3} strokeWidth={0.8} fill="none" opacity={0.4}/>
      <line x1={692} y1={72} x2={1008} y2={72} stroke={s3} strokeWidth={0.6} opacity={0.35}/>
      <text x={850} y={65} fontSize={7} fontFamily={MF} fill={s3} textAnchor="middle" opacity={0.6}>EXAMINATION HALL</text>
      {/* Animated clock */}
      <circle cx={968} cy={62} r={11} stroke={s3} strokeWidth={0.9} fill="none" opacity={0.8}/>
      <line x1={968} y1={62} x2={968} y2={54} stroke={s3} strokeWidth={1} strokeLinecap="round"/>
      <motion.line x1={968} y1={62} x2={976} y2={62} stroke={s3} strokeWidth={1.2} strokeLinecap="round"
        animate={{ rotate: 360 }} transition={{ repeat:Infinity, duration:4, ease:"linear" }}
        style={{ transformOrigin:"968px 62px", willChange:"transform" }}/>
      {/* TIME RUNNING pulsing text */}
      <motion.g animate={{ opacity:[0.45,1,0.45] }} transition={{ repeat:Infinity, duration:1.4 }}>
        <text x={968} y={82} fontSize={6} fontFamily={MF} fill={s3} textAnchor="middle" opacity={0.8}>TIME RUNNING</text>
      </motion.g>
      {/* 3 desks */}
      {[704,800,896].map((dx, i) => (
        <g key={dx}>
          <rect x={dx} y={G-30} width={80} height={7} rx={1} stroke={s3} strokeWidth={0.9} fill="none"/>
          <line x1={dx+12} y1={G-23} x2={dx+12} y2={G} stroke={s3} strokeWidth={0.9}/>
          <line x1={dx+68} y1={G-23} x2={dx+68} y2={G} stroke={s3} strokeWidth={0.9}/>
          <rect x={dx+18} y={G-42} width={36} height={22} rx={1} stroke={i===1?s3:s3} strokeWidth={0.7} fill="none"/>
          {[G-38,G-34,G-30].map(py=><line key={py} x1={dx+22} y1={py} x2={dx+50} y2={py} stroke={s3} strokeWidth={0.4} opacity={0.4}/>)}
          {/* Stressed hunched figure on middle desk */}
          <circle cx={dx+40} cy={i===1?G-68:G-64} r={i===1?9:7.5}
            stroke={s3} strokeWidth={i===1?SW:1.2} fill="none"/>
          {/* Stress hair on main figure */}
          {i===1 && [dx+33,dx+37,dx+43,dx+47].map(hx=>(
            <line key={hx} x1={hx} y1={i===1?G-75:G-70} x2={hx+1} y2={i===1?G-83:G-76} stroke={s3} strokeWidth={0.7} opacity={0.7}/>
          ))}
          {/* Body hunched forward on main */}
          <line x1={dx+40} y1={i===1?G-59:G-56} x2={i===1?dx+44:dx+40} y2={G-36}
            stroke={s3} strokeWidth={i===1?SW:1.2}/>
          {/* Writing arm */}
          <line x1={dx+40} y1={i===1?G-50:G-48} x2={dx+56} y2={G-40} stroke={s3} strokeWidth={i===1?SW:1.2}/>
          {i===1&&<line x1={dx+56} y1={G-40} x2={dx+60} y2={G-36} stroke={A} strokeWidth={1.1}/>}
          <line x1={dx+40} y1={i===1?G-50:G-48} x2={dx+24} y2={G-40} stroke={s3} strokeWidth={i===1?SW:1.2}/>
          <line x1={dx+40} y1={G-36} x2={dx+28} y2={G-36} stroke={s3} strokeWidth={i===1?SW:1.2}/>
          <line x1={dx+28} y1={G-36} x2={dx+28} y2={G} stroke={s3} strokeWidth={i===1?SW:1.2}/>
          <line x1={dx+40} y1={G-36} x2={dx+52} y2={G-36} stroke={s3} strokeWidth={i===1?SW:1.2}/>
          <line x1={dx+52} y1={G-36} x2={dx+52} y2={G} stroke={s3} strokeWidth={i===1?SW:1.2}/>
          {/* Animated sweat drops on main stressed figure */}
          {i===1&&(
            <>
              <motion.path d={`M${dx+48},${G-77} Q${dx+50},${G-73} ${dx+48},${G-69}`}
                stroke={s3} strokeWidth={1.1} strokeLinecap="round" fill="none"
                animate={{ opacity:[0.3,1,0.3] }} transition={{ repeat:Infinity, duration:0.9 }}/>
              <motion.path d={`M${dx+54},${G-74} Q${dx+56},${G-70} ${dx+54},${G-66}`}
                stroke={s3} strokeWidth={1.1} strokeLinecap="round" fill="none"
                animate={{ opacity:[0.3,1,0.3] }} transition={{ repeat:Infinity, duration:0.9, delay:0.25 }}/>
            </>
          )}
        </g>
      ))}

      {/* ══ SCENE 4 — Result: FAIL (x: 1020-1360) ══ */}
      {/* Animated rain drops */}
      {[0,1,2,3,4].map(i=>(
        <motion.line key={i}
          x1={1060+i*22} y1={28} x2={1056+i*22} y2={46}
          stroke="#78716C" strokeWidth={1} strokeLinecap="round" opacity={0.22}
          animate={{ y:[0,22,0], opacity:[0,0.28,0] }}
          transition={{ repeat:Infinity, duration:1.3, delay:i*0.22 }}
          style={{ willChange:"transform,opacity" }}/>
      ))}
      {/* Big X marks */}
      <line x1={1038} y1={58} x2={1138} y2={158} stroke={s4} strokeWidth={5} strokeLinecap="round" opacity={0.82}/>
      <line x1={1138} y1={58} x2={1038} y2={158} stroke={s4} strokeWidth={5} strokeLinecap="round" opacity={0.82}/>
      {/* Score sheets */}
      <g transform="rotate(-14,1078,120)">
        <rect x={1046} y={86} width={30} height={42} rx={2} stroke={s4} strokeWidth={0.8} fill="rgba(250,248,244,0.92)"/>
        <text x={1061} y={100} fontSize={5} fontFamily={MF} fill={s4} textAnchor="middle" opacity={0.8}>AUDIT</text>
        <text x={1061} y={113} fontSize={9} fontFamily={MF} fill={R} textAnchor="middle" fontWeight="bold" opacity={0.9}>29/100</text>
        <text x={1061} y={124} fontSize={8} fill={R} textAnchor="middle">✗</text>
      </g>
      <g transform="rotate(11,1178,108)">
        <rect x={1148} y={82} width={30} height={40} rx={2} stroke={s4} strokeWidth={0.8} fill="rgba(250,248,244,0.92)"/>
        <text x={1163} y={95} fontSize={4.5} fontFamily={MF} fill={s4} textAnchor="middle" opacity={0.8}>CORP LAW</text>
        <text x={1163} y={108} fontSize={9} fontFamily={MF} fill={R} textAnchor="middle" fontWeight="bold" opacity={0.9}>33/100</text>
        <text x={1163} y={120} fontSize={8} fill={R} textAnchor="middle">✗</text>
      </g>
      {/* FAIL stamp — animated wobble */}
      <motion.g animate={{ rotate:[-2,2,-2] }} transition={{ repeat:Infinity, duration:3, ease:"easeInOut" }}
        style={{ transformOrigin:"1252px 120px", willChange:"transform" }}>
        <rect x={1204} y={100} width={70} height={28} rx={3} stroke={R} strokeWidth={1.5} fill="rgba(146,64,14,0.06)"/>
        <text x={1239} y={119} fontSize={16} fontFamily={MF} fill={R} fontWeight="bold" textAnchor="middle" opacity={0.9}>FAIL</text>
      </motion.g>
      {/* Defeated figure — head down, shoulders slumped */}
      <circle cx={1300} cy={G-52} r={9} stroke={s4} strokeWidth={SW} fill="none"/>
      <path d={`M1295,${G-47} Q1300,${G-43} 1305,${G-47}`} stroke={s4} strokeWidth={0.8} fill="none" opacity={0.6}/>
      <line x1={1300} y1={G-43} x2={1300} y2={G-20} stroke={s4} strokeWidth={SW}/>
      {/* Arms hanging low/drooping */}
      <line x1={1300} y1={G-37} x2={1284} y2={G-24} stroke={s4} strokeWidth={SW}/>
      <line x1={1300} y1={G-37} x2={1316} y2={G-24} stroke={s4} strokeWidth={SW}/>
      <line x1={1300} y1={G-20} x2={1291} y2={G} stroke={s4} strokeWidth={SW}/>
      <line x1={1300} y1={G-20} x2={1309} y2={G} stroke={s4} strokeWidth={SW}/>
      {/* Dejection marks */}
      <path d={`M1294,${G-64} Q1292,${G-60} 1294,${G-56}`} stroke="#5A5750" strokeWidth={1.2} strokeLinecap="round" fill="none"/>
      <path d={`M1300,${G-67} Q1302,${G-63} 1300,${G-59}`} stroke="#5A5750" strokeWidth={1.2} strokeLinecap="round" fill="none"/>
      <path d={`M1306,${G-64} Q1308,${G-60} 1306,${G-56}`} stroke="#5A5750" strokeWidth={1.2} strokeLinecap="round" fill="none"/>
      {/* Teardrops */}
      <path d={`M1295,${G-48} Q1293,${G-42} 1295,${G-38}`} stroke="#93C5FD" strokeWidth={0.85} fill="none" opacity={0.55}/>
      <path d={`M1305,${G-46} Q1307,${G-40} 1305,${G-36}`} stroke="#93C5FD" strokeWidth={0.85} fill="none" opacity={0.55}/>

      {/* ══ SCENE 5 — Same Loop (x: 1360-1700) ══ */}
      {/* Faded coaching building in background */}
      <rect x={1378} y={72} width={70} height={100} stroke={s5} strokeWidth={0.9} fill="none" opacity={0.4}/>
      <rect x={1378} y={72} width={70} height={15} stroke={s5} strokeWidth={0.7} fill="none" opacity={0.35}/>
      <text x={1413} y={82} fontSize={5} fontFamily={MF} fill={s5} textAnchor="middle" opacity={0.45}>COACHING</text>
      {[1385,1402,1419,1436].map(x=><rect key={x} x={x} y={97} width={12} height={16} stroke={s5} strokeWidth={0.6} fill="none" opacity={0.3}/>)}
      {/* Repeat/loop arrow */}
      <path d={`M1580,${G-28} Q1620,${G-95} 1596,${G-120} Q1565,${G-138} 1530,${G-85} Q1514,${G-52} 1550,${G-28}`}
        stroke={s5} strokeWidth={1} strokeDasharray="5,5" fill="none" opacity={0.4}/>
      <path d={`M1550,${G-28} L1540,${G-18} M1550,${G-28} L1560,${G-22}`} stroke={s5} strokeWidth={1} fill="none" opacity={0.4}/>
      {/* "same loop?" pulsing text */}
      <motion.g animate={{ opacity:[0.4,0.95,0.4] }} transition={{ repeat:Infinity, duration:3 }}>
        <text x={1600} y={G-128} fontSize={9} fontFamily={MF} fill={s5} textAnchor="middle" fontStyle="italic">same loop?</text>
      </motion.g>
      {/* Exhausted figure — SMALL, FADED, facing LEFT (mirrored) */}
      <motion.g opacity={0.68} style={{ willChange:"opacity" }}>
        {/* mirror around cx=1500: matrix(-1,0,0,1, 2*1500, 0) = matrix(-1,0,0,1,3000,0) */}
        <g transform="matrix(-1,0,0,1,3000,0)">
          <circle cx={1500} cy={G-52} r={7.5} stroke={s5} strokeWidth={1.2} fill="none"/>
          <line x1={1500} y1={G-44} x2={1500} y2={G-20} stroke={s5} strokeWidth={1.2}/>
          <line x1={1500} y1={G-36} x2={1487} y2={G-26} stroke={s5} strokeWidth={1.2}/>
          <line x1={1500} y1={G-36} x2={1513} y2={G-44} stroke={s5} strokeWidth={1.2}/>
          <line x1={1500} y1={G-20} x2={1491} y2={G} stroke={s5} strokeWidth={1.2}/>
          <line x1={1500} y1={G-20} x2={1511} y2={G-8} stroke={s5} strokeWidth={1.2}/>
        </g>
      </motion.g>
      {/* "No progress" marks floating */}
      {[1462,1478,1494].map((x,i)=>(
        <path key={x} d={`M${x},${G-70} Q${x+2},${G-66} ${x},${G-62}`}
          stroke={s5} strokeWidth={1} strokeLinecap="round" fill="none" opacity={0.3+i*0.05}/>
      ))}

      {/* ══ SCENE 6 — Clarix Diagnoses (x: 1700-2040) ══ */}
      {/* Sun breaking through */}
      <motion.g animate={{ opacity:[0.5,1,0.5], scale:[0.95,1.05,0.95] }}
        transition={{ repeat:Infinity, duration:4, ease:"easeInOut" }}
        style={{ transformOrigin:"1750px 46px", willChange:"transform,opacity" }}>
        <circle cx={1750} cy={46} r={11} stroke={s6} strokeWidth={1.5} fill="none" opacity={0.3}/>
        {[0,60,120,180,240,300].map(deg=>(
          <line key={deg}
            x1={1750+Math.cos(deg*Math.PI/180)*15} y1={46+Math.sin(deg*Math.PI/180)*15}
            x2={1750+Math.cos(deg*Math.PI/180)*21} y2={46+Math.sin(deg*Math.PI/180)*21}
            stroke={s6} strokeWidth={1.2} strokeLinecap="round" opacity={0.45}/>
        ))}
      </motion.g>
      {/* Radial glow behind panel */}
      <circle cx={1800} cy={G-75} r={65} fill={s6} opacity={0.04}/>
      <motion.circle cx={1800} cy={G-75} r={60} fill={s6} opacity={0.05}
        animate={{ scale:[0.91,1.18,0.91] }} transition={{ repeat:Infinity, duration:3.5, ease:"easeInOut" }}
        style={{ transformOrigin:"1800px 107px", willChange:"transform" }}/>
      {/* Laptop panel */}
      <rect x={1720} y={G-118} width={96} height={68} rx={5} stroke={s6} strokeWidth={1.4} fill="rgba(212,147,10,0.05)"/>
      <rect x={1712} y={G-50} width={112} height={6} rx={2} stroke={s6} strokeWidth={1} fill="rgba(212,147,10,0.07)"/>
      {/* Clarix.ai label pulsing */}
      <motion.g animate={{ opacity:[0.7,1,0.7] }} transition={{ repeat:Infinity, duration:2 }}>
        <text x={1768} y={G-103} fontSize={8} fontFamily={MF} fill={s6} textAnchor="middle" fontWeight="600">Clarix.ai</text>
      </motion.g>
      <line x1={1726} y1={G-95} x2={1810} y2={G-95} stroke={s6} strokeWidth={0.5} opacity={0.35}/>
      {/* Typewriter diagnostic lines — draw one by one */}
      {[
        { text:"Application gap → root cause", len:52, y:G-87, delay:0.4 },
        { text:"SA 315 — weak",                len:38, y:G-77, delay:1.0 },
        { text:"8-week plan ready ✓",           len:44, y:G-67, delay:1.6 },
      ].map(({ text, len, y, delay }) => (
        <g key={text}>
          <motion.path
            d={`M1728,${y} L${1728+len*0.78},${y}`}
            stroke={s6} strokeWidth={1.4} strokeLinecap="round"
            strokeDasharray={len} strokeDashoffset={len}
            animate={{ strokeDashoffset:0 }}
            transition={{ duration:0.75, delay, repeat:Infinity, repeatDelay:4.5, ease:"linear" }}
            style={{ willChange:"stroke-dashoffset" }}/>
          <text x={1730} y={y+1} fontSize={5} fontFamily={MF} fill={s6} opacity={0.85}>{text}</text>
        </g>
      ))}
      {/* Scanline effect across panel */}
      <motion.rect x={1720} y={G-118} width={96} height={4} rx={0} fill={s6} opacity={0.07}
        animate={{ y:[G-118, G-50, G-118] }}
        transition={{ repeat:Infinity, duration:2.8, ease:"linear" }}
        style={{ willChange:"transform" }}/>
      {/* Magnifying glass scanning figure */}
      <motion.g animate={{ x:[-14,14,-14], y:[-4,4,-4] }}
        transition={{ repeat:Infinity, duration:4, ease:"easeInOut" }}
        style={{ willChange:"transform" }}>
        <circle cx={1880} cy={G-62} r={14} stroke={s6} strokeWidth={1.5} fill="none" opacity={0.65}/>
        <line x1={1890} y1={G-51} x2={1898} y2={G-43} stroke={s6} strokeWidth={2} strokeLinecap="round" opacity={0.6}/>
      </motion.g>
      {/* Leaning figure with curiosity (x≈1880) */}
      <circle cx={1880} cy={G-60} r={9} stroke={s6} strokeWidth={SW} fill="none"/>
      <line x1={1880} y1={G-51} x2={1876} y2={G-24} stroke={s6} strokeWidth={SW}/>
      <line x1={1878} y1={G-43} x2={1860} y2={G-52} stroke={s6} strokeWidth={SW}/>
      <line x1={1878} y1={G-43} x2={1862} y2={G-32} stroke={s6} strokeWidth={SW}/>
      <line x1={1876} y1={G-24} x2={1866} y2={G} stroke={s6} strokeWidth={SW}/>
      <line x1={1876} y1={G-24} x2={1886} y2={G} stroke={s6} strokeWidth={SW}/>
      {/* "Aha!" lightbulb moment — appears with delay */}
      <motion.g
        animate={{ scale:[0,1.2,1], opacity:[0,1,1] }}
        transition={{ duration:0.5, delay:2.2, repeat:Infinity, repeatDelay:4.5 }}
        style={{ transformOrigin:"1900px 115px", willChange:"transform,opacity" }}>
        <circle cx={1900} cy={G-86} r={7} stroke={s6} strokeWidth={1.5} fill="rgba(212,147,10,0.12)"/>
        <text x={1900} y={G-82} fontSize={7.5} fill={s6} textAnchor="middle" fontWeight="bold">!</text>
      </motion.g>

      {/* ══ SCENE 7 — Finally Passes (x: 2040-2380) ══ */}
      {/* Certificate */}
      <rect x={2058} y={G-118} width={100} height={72} rx={4} stroke={s7} strokeWidth={1.2} fill="rgba(45,106,79,0.04)"/>
      <circle cx={2108} cy={G-100} r={15} stroke={s7} strokeWidth={0.9} fill="rgba(45,106,79,0.06)"/>
      <text x={2108} y={G-103} fontSize={10} fill={s7} textAnchor="middle" fontWeight="bold">✓</text>
      <line x1={2065} y1={G-82} x2={2152} y2={G-82} stroke={s7} strokeWidth={0.5} opacity={0.4}/>
      <text x={2108} y={G-74} fontSize={7} fontFamily={MF} fill={s7} textAnchor="middle">CA FINAL</text>
      <text x={2108} y={G-63} fontSize={7.5} fontFamily={MF} fill={s7} textAnchor="middle" fontWeight="600">GROUP 1</text>
      <text x={2108} y={G-52} fontSize={6.5} fontFamily={MF} fill={s7} textAnchor="middle">CLEARED ✓</text>
      {/* Green checkmark drawing itself */}
      <motion.path
        d={`M2168,${G-75} L2210,${G-35} L2305,${G-148}`}
        stroke={s7} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" fill="none"
        strokeDasharray={220} strokeDashoffset={220}
        animate={{ strokeDashoffset:0 }}
        transition={{ duration:1.2, ease:"easeOut", repeat:Infinity, repeatDelay:3 }}
        style={{ willChange:"stroke-dashoffset" }}/>
      {/* Jumping bouncing figure */}
      <motion.g animate={{ y:[0,-9,0] }} transition={{ repeat:Infinity, duration:1.1, ease:"easeInOut" }}
        style={{ willChange:"transform" }}>
        <circle cx={2330} cy={G-78} r={10} stroke={s7} strokeWidth={SW} fill="none"/>
        <line x1={2330} y1={G-68} x2={2330} y2={G-38} stroke={s7} strokeWidth={SW}/>
        <line x1={2330} y1={G-58} x2={2311} y2={G-42} stroke={s7} strokeWidth={SW}/>
        <line x1={2330} y1={G-58} x2={2349} y2={G-42} stroke={s7} strokeWidth={SW}/>
        <circle cx={2311} cy={G-42} r={3} stroke={s7} strokeWidth={1} fill="none"/>
        <circle cx={2349} cy={G-42} r={3} stroke={s7} strokeWidth={1} fill="none"/>
        <line x1={2330} y1={G-38} x2={2318} y2={G-20} stroke={s7} strokeWidth={SW}/>
        <line x1={2330} y1={G-38} x2={2342} y2={G-20} stroke={s7} strokeWidth={SW}/>
      </motion.g>
      {/* Confetti */}
      {[
        {x:2180,y:G-148,r:3.5,c:A},{x:2196,y:G-134,r:2.5,c:s7},{x:2218,y:G-152,r:3,c:A},
        {x:2242,y:G-142,r:2.5,c:s7},{x:2264,y:G-150,r:3,c:A},{x:2284,y:G-136,r:2,c:s7},
        {x:2304,y:G-144,r:3,c:A},{x:2318,y:G-138,r:2.5,c:s7},{x:2344,y:G-148,r:3,c:A},
        {x:2360,y:G-130,r:2,c:s7},{x:2372,y:G-142,r:2.5,c:A},
      ].map(({x,y,r,c},i)=><circle key={i} cx={x} cy={y} r={r} fill={c} opacity={0.55}/>)}
      {[
        {x:2196,y:G-164,a:28,c:A},{x:2230,y:G-168,a:-18,c:s7},{x:2266,y:G-164,a:35,c:A},
        {x:2302,y:G-162,a:-24,c:s7},{x:2338,y:G-158,a:18,c:A},{x:2362,y:G-148,a:-30,c:s7},
      ].map(({x,y,a,c},i)=>(
        <rect key={i} x={x} y={y} width={10} height={3} rx={1} fill={c} opacity={0.6} transform={`rotate(${a},${x},${y})`}/>
      ))}
      {/* Stars */}
      <text x={2178} y={G-162} fontSize={13} fill={A} opacity={0.8}>✦</text>
      <text x={2250} y={G-170} fontSize={10} fill={A} opacity={0.7}>★</text>
      <text x={2366} y={G-164} fontSize={12} fill={A} opacity={0.75}>✦</text>
    </>
  );
}

/* Stage labels */
const STAGE_LABELS = [
  { label:"The Beginning",   color:"default" },
  { label:"Joins Coaching",  color:"default" },
  { label:"CA Final Exam",   color:"default" },
  { label:"Result: FAIL",    color:"default" },
  { label:"Same Loop",       color:"muted"   },
  { label:"Clarix Diagnoses",color:"amber"   },
  { label:"Finally Passes ✓",color:"green"   },
];

function CAJourneyStrip() {
  const TOTAL_W = SCENE_W * 7; // 2380
  return (
    <section style={{
      background:"#FFBF00",
      borderBottom:"1px solid rgba(28,25,23,0.18)",
      paddingTop:20,
      overflow:"hidden",
    }}>
      {/* Section header — Part 6 */}
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 40px 14px",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:24, height:1, background:A }}/>
          <span style={{ fontFamily:MF, fontSize:11, letterSpacing:".1em",
            textTransform:"uppercase", color:"rgba(28,25,23,0.75)" }}>
            Every CA aspirant lives this loop
          </span>
        </div>
        {/* Animated scroll indicator */}
        <motion.div
          style={{ display:"flex", alignItems:"center", gap:6,
            fontFamily:MF, fontSize:10, color:"rgba(28,25,23,0.55)", letterSpacing:".08em" }}
          animate={{ x:[0,6,0] }}
          transition={{ repeat:Infinity, duration:2, ease:"easeInOut" }}>
          <span>scroll</span>
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
            <path d="M0 5 L12 5 M9 2 L12 5 L9 8" stroke="rgba(28,25,23,0.55)" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </motion.div>
      </div>

      {/* Panoramic strip */}
      <div style={{ overflow:"hidden" }}>
        <div style={{
          display:"flex", width:"max-content",
          animation:`journeyPan 42s linear infinite`,
        }}>
          {[0,1].map(pass=>(
            <svg key={pass} width={TOTAL_W} height={222} viewBox={`0 0 ${TOTAL_W} 222`}
              fill="none" style={{ display:"block", flexShrink:0 }}>
              <JourneyScenes/>
            </svg>
          ))}
        </div>
      </div>

      {/* Stage label row — Part 5 */}
      <div style={{
        display:"grid", gridTemplateColumns:`repeat(7,${100/7}%)`,
        paddingBottom:14, paddingTop:4, paddingLeft:0, paddingRight:0,
      }}>
        {STAGE_LABELS.map(({label,color},i)=>(
          <div key={i} style={{
            textAlign:"center",
            fontFamily:MF, fontSize:9.5, letterSpacing:".06em",
            color: color==="amber" ? A
                 : color==="green" ? "#1A5C3A"
                 : color==="muted" ? "rgba(28,25,23,0.45)"
                 : "rgba(28,25,23,0.65)",
            fontWeight: color==="green" ? 600 : 400,
            padding:"4px 2px",
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
  const howRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior:"smooth" });
  };

  useEffect(() => {
    const els = document.querySelectorAll(".heading-underline");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("revealed"); obs.unobserve(e.target); }
      }),
      { threshold:0.4 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const border    = "var(--c-border)";
  const muted     = "var(--c-muted)";
  const amber     = "var(--c-amber)";
  const charcoal  = "var(--c-charcoal)";
  const surface   = "var(--c-surface)";
  const parchment = "var(--c-parchment)";
  const white     = "var(--c-white)";

  return (
    <div className="clarix-page" style={{ minHeight:"100vh" }}>
      <Navbar />
      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ padding:"80px 40px 64px", borderBottom:`1px solid ${border}` }}>
        <div className="animate-in" style={{
          fontFamily:MF, fontSize:11, color:amber,
          letterSpacing:".1em", textTransform:"uppercase", marginBottom:28,
          display:"flex", alignItems:"center", gap:10,
        }}>
          <span style={{ display:"inline-block", width:24, height:1, background:amber }}/>
          AI-powered CA Final diagnostics
        </div>
        <h1 className="clarix-h1 animate-in" style={{ animationDelay:"80ms" }}>
          Know <em className="clarix-em">exactly</em> why you're failing.<br/>Fix it.
        </h1>
        <p className="animate-in" style={{
          animationDelay:"160ms", fontSize:15, color:muted,
          lineHeight:1.7, maxWidth:480, margin:"24px 0 40px",
        }}>
          Most CA repeaters study more of the same thing that failed them the last time.
          Clarix.ai analyses your weaknesses at the question-type level — mapped to ICAI's
          own papers — and builds a precision plan around them.
        </p>
        <div className="animate-in" style={{
          animationDelay:"240ms", display:"flex",
          alignItems:"center", gap:20, flexWrap:"wrap",
        }}>
          <button className="btn-primary" onClick={()=>scrollTo(ctaRef)}>
            Get Your Free Diagnostic →
          </button>
          <button className="btn-ghost" onClick={()=>scrollTo(howRef)}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
            </svg>
            See how it works
          </button>
        </div>
        <p className="price-note" style={{ marginTop:18 }}>
          First 50 aspirants only · Normally{" "}
          <s style={{ opacity:0.6 }}>₹499</s>{" "}
          · ICAI-specific, not generic AI
        </p>
      </section>
      {/* ── CA ASPIRANT JOURNEY STRIP ────────────────────── */}
      <CAJourneyStrip />
      {/* ── STATS ──────────────────────────────────────────── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", borderBottom:`1px solid ${border}` }}>
        {[
          { num:"10", sup:"–15%", label:"CA Final pass rate per attempt. The exam is designed to fail most." },
          { num:"3",  sup:"×",    label:"Average attempts before passing. That's 18+ months of lost time." },
          { num:"₹0", sup:"",     label:"Tools that tell you exactly why you failed your last paper." },
        ].map((s,i)=>(
          <div key={i} style={{
            padding:"28px 36px",
            borderRight:i<2?`1px solid ${border}`:undefined,
            background:surface,
          }}>
            <div className="stat-num-serif">
              {s.num}
              {s.sup&&<span style={{ color:amber, fontSize:26 }}>{s.sup}</span>}
            </div>
            <div style={{ fontSize:13, color:muted, lineHeight:1.55 }}>{s.label}</div>
          </div>
        ))}
      </div>
      {/* ── PROBLEM ─────────────────────────────────────────── */}
      <div style={{ position:"relative", overflow:"hidden" }}>
        <LedgerDoodle/>
        <div style={{
          padding:"64px 40px", borderBottom:`1px solid ${border}`,
          display:"grid", gridTemplateColumns:"1fr 1fr", gap:72, alignItems:"start",
        }} className="responsive-two-col">
          <div>
            <span className="section-label">The problem</span>
            <h2 className="clarix-h2">
              You're not failing because you're not studying{" "}
              <em className="clarix-em heading-underline">enough.</em>
            </h2>
            <p style={{ fontSize:15, color:muted, lineHeight:1.7 }}>
              You're failing because you don't know what to study differently. Every
              coaching platform sells you more content — more videos, more notes, more mock
              tests. None of them diagnose you. Clarix.ai does.
            </p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
            {[
              { n:"01", title:"Concept gaps aren't visible", body:"You score 35 in Audit and don't know if it's Ind AS confusion, SA misapplication, or time pressure. Generic mock reports don't tell you." },
              { n:"02", title:"Question-type failures are ignored", body:"CA papers test judgment, not recall. If you're strong on theory but weak on application questions, no test series will catch that pattern." },
              { n:"03", title:"Revision is inefficient by default", body:"With 8 subjects, every student revises everything equally. That's precisely wrong — and it costs you attempts." },
            ].map((item,i)=>(
              <div key={i} style={{
                display:"flex", alignItems:"flex-start", gap:16,
                padding:"20px 0", borderBottom:`1px solid ${border}`,
                borderTop:i===0?`1px solid ${border}`:undefined,
              }}>
                <div style={{ fontFamily:MF, fontSize:10, color:amber, marginTop:3, minWidth:24, letterSpacing:".06em" }}>{item.n}</div>
                <div>
                  <div style={{ fontSize:15, fontWeight:500, color:charcoal, marginBottom:5, letterSpacing:"-0.01em" }}>{item.title}</div>
                  <div style={{ fontSize:14, color:muted, lineHeight:1.65 }}>{item.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <div ref={howRef} style={{ padding:"64px 40px", borderBottom:`1px solid ${border}`, background:surface }}>
        <span className="section-label">How it works</span>
        <h2 className="clarix-h2">
          Three steps. One{" "}
          <em className="clarix-em heading-underline">clear</em> plan.
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginTop:36 }}
          className="responsive-three-col">
          {[
            { step:"STEP 01", title:"You share your attempt data", body:"Fill a 10-minute intake form — past attempt scores, subjects appearing for, specific topics you find hard. No uploads needed.", tag:"10 min intake" },
            { step:"STEP 02", title:"AI analyses your failure pattern", body:"Clarix.ai cross-references your data against ICAI past papers, RTPs, and MTP patterns to identify your exact weakness profile.", tag:"ICAI-mapped AI" },
            { step:"STEP 03", title:"You get a precision study plan", body:"A personalised 30/60/90-day plan with topic prioritisation and question-type drills — calibrated to your actual exam date.", tag:"Delivered in 48hrs" },
          ].map((s,i)=>(
            <div key={i} className="step-card">
              <div className="step-num-tag">{s.step}</div>
              <div className="step-title">{s.title}</div>
              <div style={{ fontSize:14, color:muted, lineHeight:1.65 }}>{s.body}</div>
              <div className="step-tag">{s.tag}</div>
            </div>
          ))}
        </div>
      </div>
      {/* ── WHY TRUST ─────────────────────────────────────── */}
      <div style={{ position:"relative", overflow:"hidden" }}>
        <NeuralDoodle/>
        <div style={{
          padding:"64px 40px", borderBottom:`1px solid ${border}`,
          display:"grid", gridTemplateColumns:"1fr 1fr", gap:72, alignItems:"start",
        }} className="responsive-two-col">
          <div>
            <span className="section-label">Why trust this</span>
            <h2 className="clarix-h2">
              Built on{" "}
              <em className="clarix-em heading-underline">ICAI's</em>{" "}
              own material. Nothing else.
            </h2>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:24, marginBottom:28 }}>
              {["BCom graduate","CA aspirant","AI researcher","ICAI curriculum specialist"].map(tag=>(
                <span key={tag} className="trust-pill">{tag}</span>
              ))}
            </div>
            <p style={{ fontSize:15, color:muted, lineHeight:1.7 }}>Clarix.ai was built by a CA aspirant who experienced the preparation gap firsthand — and spent months mapping ICAI's exam patterns, past papers, and marking schemes using AI. The diagnostic is grounded entirely in ICAI's published material: study material, RTPs, MTPs, and suggested answers. Not generic AI. Not assumptions.</p>
          </div>
          <div className="insight-card">
            <span className="insight-label">What the diagnostic is built on</span>
            {[
              { text:"ICAI CA Final past papers — last 10 attempts", sub:"Both Group 1 and Group 2, all papers mapped by question type." },
              { text:"ICAI Revision Test Papers (RTPs) and Mock Test Papers (MTPs)", sub:"Pattern-analysed across attempts to identify high-weight topics." },
              { text:"ICAI suggested answers and marking schemes", sub:"Understand exactly what the examiner awards marks for." },
              { text:"AI trained to distinguish recall vs application gaps", sub:"The question-type split that no coaching platform diagnoses." },
            ].map((item,i)=>(
              <div key={i} style={{ display:"flex", gap:14, padding:"14px 0", borderBottom:i<3?`1px solid ${border}`:undefined }}>
                <div className="insight-dot"/>
                <div>
                  <div style={{ fontSize:14, color:charcoal, lineHeight:1.6, fontWeight:500 }}>{item.text}</div>
                  <div style={{ fontSize:13, color:muted, marginTop:3 }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* ── DISCLAIMER ──────────────────────────────────── */}
      <div style={{
        padding:"20px 40px", background:"#FFFBF2",
        borderTop:`1px solid rgba(212,147,10,0.2)`, borderBottom:`1px solid rgba(212,147,10,0.2)`,
        borderLeft:`4px solid var(--c-amber)`,
        display:"flex", alignItems:"flex-start", gap:14,
      }}>
        <div style={{
          fontFamily:MF, fontSize:12, fontWeight:500, color:amber, flexShrink:0,
          background:"rgba(212,147,10,0.12)", padding:"2px 7px", borderRadius:3, letterSpacing:".04em",
        }}>!</div>
        <p style={{ fontSize:13, color:muted, lineHeight:1.7 }}>
          <strong style={{ color:charcoal, fontWeight:600 }}>Full transparency:</strong>{" "}
          Clarix.ai is an AI-powered diagnostic tool built by a BCom graduate and CA aspirant —
          not a registered Chartered Accountant or a CA coaching institute. The diagnostic
          analyses ICAI exam patterns using AI and is reviewed for quality before delivery.
          It is not a substitute for professional CA guidance or ICAI-approved coaching.
          Results are study planning recommendations, not guaranteed outcomes.
        </p>
      </div>
      {/* ── CTA ─────────────────────────────────────────── */}
      <div ref={ctaRef} style={{ padding:"88px 40px", textAlign:"center", background:parchment }}>
        <div style={{ maxWidth:520, margin:"0 auto" }}>
          <div className="cta-price">
            Launch offer ·{" "}
            <span style={{ color:"var(--c-amber-lt)" }}>Free for first 50 aspirants</span>{" "}
            · Normally <s style={{ opacity:0.55 }}>₹499</s>
          </div>
          <div className="cta-h">Get your diagnostic report.</div>
          <p style={{ fontSize:15, color:muted, lineHeight:1.7, marginBottom:36 }}>
            Stop revising blindly. Find out exactly which gaps are costing you marks —
            and get a plan that fixes them before your next attempt.
          </p>
          <Link href="/diagnostic">
            <button className="btn-primary" style={{ fontSize:13, padding:"16px 40px" }}>
              Start Free Diagnostic →
            </button>
          </Link>
          <p className="price-note" style={{ marginTop:16 }}>
            Delivered within 48 hours ·{" "}
            <span className="price-note-amber">ICAI-mapped AI analysis</span>{" "}
            · First 50 aspirants only
          </p>
        </div>
      </div>
      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer style={{
        padding:"22px 40px", borderTop:`1px solid ${border}`,
        display:"flex", justifyContent:"space-between", alignItems:"center",
        fontFamily:MF, fontSize:11, color:muted,
        flexWrap:"wrap", gap:8, background:white,
      }}>
        <span>© 2026 Clarix.ai</span>
        <span>AI-powered · ICAI-grounded · Built by a CA aspirant</span>
      </footer>
      <style>{`
        @keyframes journeyPan {
          from { transform: translateX(0) }
          to   { transform: translateX(-2380px) }
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
