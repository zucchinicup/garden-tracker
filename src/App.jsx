import { useState, useMemo, useCallback, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── Supabase client ──────────────────────────────────────────────────────────
const SUPABASE_URL  = "https://joviblmhctpfqrltyivc.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvdmlibG1oY3RwZnFybHR5aXZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4NDMwODQsImV4cCI6MjA5ODQxOTA4NH0.FKOwHg2Qn9TpTSf5B_VTpdDlYrYA9TFv5Sc2ftpUGPQ";
const sb = createClient(SUPABASE_URL, SUPABASE_ANON);

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html, body { height:100%; }
  body {
    font-family:'Atkinson Hyperlegible',sans-serif;
    background: linear-gradient(160deg, #E8F0E4 0%, #F5EFE6 50%, #EBE5D8 100%);
    min-height:100vh; color:#2D3B2D; -webkit-font-smoothing:antialiased;
  }
  /* ── Desktop: sidebar layout ── */
  .shell      { display:flex; min-height:100vh; }
  .sidebar    { width:220px; flex-shrink:0; background:#1B3A2D; display:flex; flex-direction:column; padding:28px 0 24px; position:fixed; top:0; left:0; bottom:0; z-index:50; }
  .sidebar-logo { padding:0 20px 24px; border-bottom:1px solid rgba(255,255,255,.1); margin-bottom:12px; }
  .screen     { flex:1; margin-left:220px; padding:32px 40px 60px; overflow-y:auto; }
  .home-grid  { display:grid; grid-template-columns:300px 1fr; gap:32px; align-items:start; }
  .two-col    { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
  .three-col  { display:grid; grid-template-columns:1fr 1fr 1fr; gap:20px; }

  /* ── Sidebar nav ── */
  .nav-btn    { display:flex; align-items:center; gap:12px; padding:11px 20px; background:none; border:none; border-left:3px solid transparent; cursor:pointer; font-family:inherit; transition:all .18s; width:100%; text-align:left; }
  .nav-btn:hover { background:rgba(255,255,255,.07); }
  .nav-btn.active { background:rgba(255,255,255,.1); border-left-color:#7ED4A8; }
  .nav-icon   { font-size:18px; line-height:1; flex-shrink:0; }
  .nav-label  { font-size:13px; font-weight:700; letter-spacing:.03em; color:#9DC4AF; transition:color .18s; }
  .nav-btn.active .nav-label { color:#7ED4A8; }
  .nav-btn:hover .nav-label  { color:#C5DDD0; }
  .px { padding-left:0; padding-right:0; }
  .hero       { padding:0 0 24px; text-align:left; }

  .hero-date  { font-size:12px; color:#8FAD8F; letter-spacing:.08em; text-transform:uppercase; font-weight:700; margin-bottom:6px; }
  .hero-title { font-size:28px; font-weight:700; color:#1E3A1E; line-height:1.2; }
  .orb-wrap   { display:flex; flex-direction:column; align-items:center; padding:8px 0 28px; }
  .orb-ring   { filter:drop-shadow(0 6px 20px rgba(58,125,90,.18)); }
  .orb-caption{ font-size:13px; color:#6B8F6B; margin-top:12px; font-weight:700; }
  .sec-label  { font-size:11px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:#8FAD8F; margin-bottom:10px; }
  .task-pill  { display:flex; align-items:center; gap:14px; padding:14px 16px; border-radius:16px; background:rgba(255,255,255,.75); border:1.5px solid rgba(255,255,255,.9); margin-bottom:10px; cursor:default; transition:background .15s; backdrop-filter:blur(4px); }
  .task-pill:hover { background:rgba(255,255,255,.92); }
  .task-pill.done  { opacity:.45; }
  .task-pill.urgent{ border-color:rgba(232,96,74,.3); background:rgba(255,248,246,.85); }
  .task-pill.warn  { border-color:rgba(244,164,53,.3); background:rgba(255,252,242,.85); }
  .chk-circle { width:26px; height:26px; border-radius:50%; border:2.5px solid #B5CEB5; background:transparent; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .2s; }
  .chk-circle.on { background:#3A7D5A; border-color:#3A7D5A; }
  .stype      { display:inline-block; padding:2px 9px; border-radius:20px; font-size:11px; font-weight:700; }
  .cat-rings  { display:flex; gap:16px; overflow-x:auto; padding:0 22px 4px; scrollbar-width:none; }
  .cat-rings::-webkit-scrollbar { display:none; }
  .cat-ring-item { flex-shrink:0; display:flex; flex-direction:column; align-items:center; gap:5px; cursor:pointer; }
  .cat-ring-label { font-size:11px; font-weight:700; color:#6B8F6B; }
  .cal-header { display:flex; align-items:center; justify-content:space-between; padding:0 22px 16px; }
  .cal-month  { font-size:18px; font-weight:700; color:#1E3A1E; }
  .cal-grid   { display:grid; grid-template-columns:repeat(7,1fr); gap:4px; padding:0 22px; }
  .cal-dow    { text-align:center; font-size:10px; font-weight:700; color:#8FAD8F; letter-spacing:.05em; padding:4px 0 8px; }
  .cal-cell   { min-height:64px; border-radius:12px; padding:6px 5px; background:rgba(255,255,255,.55); cursor:pointer; transition:all .15s; }
  .cal-cell:hover { background:rgba(255,255,255,.85); }
  .cal-cell.is-today { background:rgba(58,125,90,.12); border:2px solid #3A7D5A; }
  .cal-cell.is-sel   { background:rgba(255,255,255,.95); border:2px solid #1E3A1E; }
  .cal-cell.dim      { opacity:.3; pointer-events:none; }
  .cal-num    { font-size:12px; font-weight:700; color:#3B4A3B; margin-bottom:3px; }
  .cal-dot    { width:6px; height:6px; border-radius:50%; display:inline-block; margin:1px; }
  .plant-row  { display:flex; align-items:center; gap:12px; padding:12px 16px; border-radius:14px; background:rgba(255,255,255,.7); margin-bottom:8px; }
  .overlay    { position:fixed; inset:0; background:#fff; z-index:80; display:flex; align-items:flex-start; justify-content:center; overflow-y:auto; }
  .sheet      { background:#fff; border-radius:0; padding:56px 22px 60px; width:100%; max-width:480px; min-height:100vh; }
  .sheet-handle { display:none; }
  .sheet-close { position:fixed; top:16px; right:16px; z-index:90; width:36px; height:36px; border-radius:50%; background:#F3F4F6; border:none; cursor:pointer; font-size:18px; display:flex; align-items:center; justify-content:center; color:#6B7280; }
  .sheet-close:hover { background:#E5E7EB; }
  .field      { display:flex; flex-direction:column; gap:6px; margin-bottom:16px; }
  .field label{ font-size:11px; font-weight:700; color:#6B8F6B; letter-spacing:.08em; text-transform:uppercase; }
  .field input,.field select,.field textarea { padding:12px 14px; border:2px solid rgba(0,0,0,.08); border-radius:12px; font-family:inherit; font-size:15px; color:#2D3B2D; background:rgba(255,255,255,.8); transition:border-color .15s; }
  .field input:focus,.field select:focus,.field textarea:focus { outline:none; border-color:#3A7D5A; background:#fff; }
  .big-btn    { width:100%; padding:16px; border-radius:14px; font-family:inherit; font-size:16px; font-weight:700; border:none; cursor:pointer; transition:all .2s; }
  .big-btn-green { background:#3A7D5A; color:#fff; }
  .big-btn-green:hover { background:#2D6347; }
  .big-btn-green:disabled { opacity:.4; cursor:not-allowed; }
  .sm-btn     { display:inline-flex; align-items:center; gap:5px; padding:8px 14px; border-radius:10px; font-family:inherit; font-size:13px; font-weight:700; border:none; cursor:pointer; transition:all .15s; }
  .sm-btn-green { background:#3A7D5A; color:#fff; }
  .sm-btn-ghost { background:rgba(58,125,90,.1); color:#3A7D5A; }
  .sm-btn-ghost:hover { background:rgba(58,125,90,.18); }
  .rec-chip   { display:inline-flex; align-items:center; gap:3px; padding:2px 8px; border-radius:20px; font-size:10px; font-weight:700; background:rgba(129,140,248,.15); color:#4338CA; }
  .empty      { text-align:center; padding:40px 20px; color:#8FAD8F; }
  .empty-icon { font-size:40px; margin-bottom:10px; }
  .empty-msg  { font-size:15px; font-weight:700; color:#5A7A5A; }
  .empty-sub  { font-size:13px; margin-top:4px; }
  .auth-card  { background:rgba(255,255,255,.85); backdrop-filter:blur(12px); border-radius:24px; padding:36px 28px; margin:32px 22px; box-shadow:0 8px 32px rgba(0,0,0,.08); }
  .google-btn { width:100%; padding:14px; border-radius:12px; background:#fff; border:2px solid #E2E8E2; font-family:inherit; font-size:15px; font-weight:700; color:#2D3B2D; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; transition:all .2s; }
  .google-btn:hover { background:#F5F5F5; border-color:#C0D0C0; }
  .code-box   { background:rgba(58,125,90,.1); border:2px solid rgba(58,125,90,.25); border-radius:12px; padding:14px 18px; font-family:monospace; font-size:20px; font-weight:700; color:#1E3A1E; letter-spacing:.15em; text-align:center; margin:16px 0; }
  .member-chip{ display:inline-flex; align-items:center; gap:6px; padding:6px 12px; border-radius:20px; background:rgba(58,125,90,.1); font-size:13px; font-weight:700; color:#1E3A1E; margin:4px; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes breathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.03)} }
  @keyframes spin { to{transform:rotate(360deg)} }
  .fade-up { animation:fadeUp .28s ease both; }
  .breathe { animation:breathe 4s ease-in-out infinite; }
  .spin { animation:spin 1s linear infinite; }
  .err { background:#FDECEA; border:1.5px solid rgba(184,76,76,.3); border-radius:10px; padding:10px 14px; font-size:13px; color:#8B2E2E; margin-bottom:14px; }

  /* ── Personal Projects ── */
  .proj-pill  { display:flex; align-items:flex-start; gap:12px; padding:14px 16px; border-radius:16px; background:rgba(255,255,255,.8); border:1.5px solid rgba(255,255,255,.95); margin-bottom:10px; transition:background .15s; }
  .proj-pill:hover { background:rgba(255,255,255,.95); }
  .proj-pill.done { opacity:.45; }
  .chk-proj { width:22px; height:22px; border-radius:6px; border:2.5px solid #C5C0D0; background:transparent; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .2s; margin-top:1px; }
  .proj-priority { display:inline-block; padding:1px 8px; border-radius:20px; font-size:10px; font-weight:700; }
  .nav-btn.proj-active { background:rgba(255,255,255,.08); }

  /* ── Property module — earthy brown & tan ── */
  body.prop-mode { background: linear-gradient(160deg, #EDE5D8 0%, #F5EDE0 50%, #EAE0CE 100%); }
  .prop-screen   { background: linear-gradient(160deg, #EDE5D8 0%, #F5EDE0 50%, #EAE0CE 100%); min-height:100%; }
  .prop-pill     { display:flex; align-items:center; gap:14px; padding:14px 16px; border-radius:16px; background:rgba(255,250,242,.85); border:1.5px solid rgba(255,250,242,.95); margin-bottom:10px; backdrop-filter:blur(4px); transition:background .15s; }
  .prop-pill:hover { background:rgba(255,255,255,.95); }
  .prop-pill.done  { opacity:.45; }
  .prop-pill.urgent{ border-color:rgba(180,94,40,.3); background:rgba(255,248,240,.9); }
  .prop-pill.warn  { border-color:rgba(180,140,60,.3); background:rgba(255,252,235,.9); }
  .chk-prop { width:26px; height:26px; border-radius:50%; border:2.5px solid #C9B89A; background:transparent; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .2s; }
  .chk-prop.on { background:#7A5C3A; border-color:#7A5C3A; }
  .prop-tag  { display:inline-block; padding:2px 9px; border-radius:20px; font-size:11px; font-weight:700; }
  .prop-area-hdr { display:flex; align-items:center; justify-content:space-between; padding:12px 16px; border-radius:12px; background:rgba(180,140,100,.12); border:none; cursor:pointer; font-family:inherit; width:100%; margin-bottom:8px; }
  .nav-btn.prop-active { background:rgba(255,255,255,.1); border-left-color:#D4A574; }
  .nav-btn.prop-active .nav-label { color:#D4A574; }
  .sidebar-divider { margin:12px 20px; border:none; border-top:1px solid rgba(255,255,255,.1); }
  .sidebar-section-label { padding:8px 20px 4px; font-size:10px; font-weight:700; color:rgba(255,255,255,.35); letter-spacing:.1em; text-transform:uppercase; }
  .sm-btn-brown { background:#7A5C3A; color:#fff; }
  .sm-btn-brown:hover { background:#5E4429; }
  .sm-btn-brown-ghost { background:rgba(122,92,58,.1); color:#7A5C3A; }
  .sm-btn-brown-ghost:hover { background:rgba(122,92,58,.2); }
  .big-btn-brown { background:#7A5C3A; color:#fff; }
  .big-btn-brown:hover { background:#5E4429; }
  .prop-home-grid { display:grid; grid-template-columns:300px 1fr; gap:32px; align-items:start; }
`;

// ─── Constants ────────────────────────────────────────────────────────────────
const CATS = [
  { id:"fruit",   label:"Fruit Trees", emoji:"🌳", color:"#3A7D5A", light:"rgba(58,125,90,.1)"  },
  { id:"berries", label:"Berries",     emoji:"🫐", color:"#7C5CBF", light:"rgba(124,92,191,.1)" },
  { id:"edibles", label:"Edibles",     emoji:"🌿", color:"#B07B2A", light:"rgba(176,123,42,.1)" },
  { id:"garden",  label:"Garden",      emoji:"🌸", color:"#B84C4C", light:"rgba(184,76,76,.1)"  },
];
const TASK_TYPES  = ["Harvest","Prune","Fertilise","Water","Spray","Mulch","Check","Other"];
const TYPE_EMOJI  = { Harvest:"🍃",Prune:"✂️",Fertilise:"💧",Water:"🚿",Spray:"🌬️",Mulch:"🟫",Check:"👁️",Other:"📝" };
const TYPE_COLOR  = { Harvest:"#3A7D5A",Prune:"#B84C4C",Fertilise:"#B07B2A",Water:"#4A8FB8",Spray:"#7C5CBF",Mulch:"#7A5C3A",Check:"#5A7A7A",Other:"#5A5A7A" };
const RECUR_OPTS  = [
  {v:"",l:"One-off (no repeat)"},{v:"7",l:"Weekly"},{v:"14",l:"Fortnightly"},
  {v:"30",l:"Monthly"},{v:"60",l:"Every 2 months"},{v:"90",l:"Every 3 months"},
  {v:"180",l:"Every 6 months"},{v:"365",l:"Yearly"},
];
const RECUR_SHORT = {"7":"Weekly","14":"Fortnightly","30":"Monthly","60":"2-monthly","90":"Quarterly","180":"6-monthly","365":"Yearly"};
const MONTHS      = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DOWS        = ["Su","Mo","Tu","We","Th","Fr","Sa"];

// ─── Property constants ────────────────────────────────────────────────────────
const PROP_AREAS = [
  { id:"house",     label:"House & Garden",emoji:"🏠", color:"#7A5C3A", light:"rgba(122,92,58,.1)"   },
  { id:"paddocks",  label:"Paddocks",      emoji:"🌾", color:"#8B6914", light:"rgba(139,105,20,.1)"  },
  { id:"fences",    label:"Fences",        emoji:"🪵", color:"#6A4A2A", light:"rgba(106,74,42,.1)"   },
  { id:"tanks",     label:"Tanks",         emoji:"🛢️", color:"#4A7A8A", light:"rgba(74,122,138,.1)"  },
  { id:"shed",      label:"Shed",          emoji:"🏚️", color:"#8A5A3A", light:"rgba(138,90,58,.1)"  },
  { id:"toolshed",  label:"Tool Shed",     emoji:"🔨", color:"#6A4A3A", light:"rgba(106,74,58,.1)"  },
  { id:"driveway",  label:"Driveway",      emoji:"🛤️", color:"#6A6A5A", light:"rgba(106,106,90,.1)" },
  { id:"irrigation",label:"Irrigation",    emoji:"🚿", color:"#3A6A8A", light:"rgba(58,106,138,.1)" },
  { id:"general",   label:"General",       emoji:"🔧", color:"#5A5A7A", light:"rgba(90,90,122,.1)"   },
];
const PROP_CHORE_TYPES = ["Mow","Slash","Whipper Snip","Fence Check","Repair","Water Tank","Pump Check","Irrigation","Clean","Inspect","Other"];

// ─── Personal Projects constants ───────────────────────────────────────────────
const PROJ_MEMBERS = [
  { id:"ange", label:"Ange's Projects", emoji:"🌸", color:"#C0547A", light:"rgba(192,84,122,.08)", accent:"#E8A0B8" },
  { id:"jake", label:"Jake's Projects", emoji:"💜", color:"#6B4FA0", light:"rgba(107,79,160,.08)", accent:"#B09DD4" },
  { id:"ben",  label:"Ben's Projects",  emoji:"🩶", color:"#4A4A4A", light:"rgba(74,74,74,.08)",   accent:"#9A9A9A" },
  { id:"meg",  label:"Meg's Projects",  emoji:"🩵", color:"#5A9EC0", light:"rgba(90,158,192,.08)", accent:"#A8D4E8" },
];
const PROJ_PRIORITY = ["Low","Medium","High","Urgent"];
const PROJ_PRIORITY_COLOR = { Low:"#8FAD8F", Medium:"#B07B2A", High:"#C0547A", Urgent:"#B84C4C" };
const PROP_TYPE_EMOJI  = { "Mow":"🌿","Slash":"⚔️","Whipper Snip":"✂️","Fence Check":"🪵","Repair":"🔧","Water Tank":"💧","Pump Check":"⚙️","Irrigation":"🚿","Clean":"🧹","Inspect":"👁️","Other":"📝" };
const PROP_TYPE_COLOR  = { "Mow":"#5A7A3A","Slash":"#7A5A3A","Whipper Snip":"#6A5A3A","Fence Check":"#7A5C3A","Repair":"#8A4A2A","Water Tank":"#4A7A8A","Pump Check":"#5A6A7A","Irrigation":"#3A6A8A","Clean":"#6A6A5A","Inspect":"#5A5A7A","Other":"#7A7A5A" };

// ─── Helpers ──────────────────────────────────────────────────────────────────
const TODAY = new Date().toISOString().slice(0,10);

function urgOf(dueDate, done) {
  if (done) return "done";
  const t = new Date(); t.setHours(0,0,0,0);
  const d = new Date(dueDate+"T00:00:00");
  const diff = Math.round((d-t)/86400000);
  if (diff < 0)   return "overdue";
  if (diff === 0) return "today";
  if (diff <= 7)  return "week";
  return "upcoming";
}
const URG_COLOR = {overdue:"#B84C4C",today:"#B07B2A",week:"#3A7D5A",upcoming:"#5A6A9A",done:"#8FAD8F"};
const URG_LABEL = {overdue:"Overdue",today:"Today",week:"This week",upcoming:"Upcoming",done:"Done"};

function fmtDate(s) {
  if (!s) return "";
  return new Date(s+"T00:00:00").toLocaleDateString("en-AU",{weekday:"short",day:"numeric",month:"short"});
}
function addDays(s,n) {
  const d = new Date(s+"T00:00:00"); d.setDate(d.getDate()+n);
  return d.toISOString().slice(0,10);
}

// Map DB rows → app shape
function mapPlant(r) {
  return { id:r.id, cat:r.category, name:r.name, emoji:r.emoji||"🌱", loc:r.location||"" };
}
function mapTask(r) {
  return {
    id:r.id, plantId:r.plant_id, gardenId:r.garden_id,
    type:r.task_type, dueDate:r.due_date,
    done:!!r.completed_at, doneBy:r.completed_by_name||null, doneAt:r.completed_at?r.completed_at.slice(0,10):null,
    note:r.notes||"", recur:r.recurrence_months?String(r.recurrence_months*30):"",
  };
}

// ─── Tiny UI components ───────────────────────────────────────────────────────
function Spinner({ size=20 }) {
  return <div className="spin" style={{width:size,height:size,border:`3px solid rgba(58,125,90,.2)`,borderTopColor:"#3A7D5A",borderRadius:"50%",display:"inline-block"}}/>;
}

function ChkCircle({ on, toggle }) {
  return (
    <button className={`chk-circle ${on?"on":""}`} onClick={e=>{e.stopPropagation();toggle();}}>
      {on && <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 7l3 3 5-5.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </button>
  );
}

function Ring({ pct, size=80, sw=7, color="#3A7D5A", bg="#D9E8D9", children }) {
  const r = (size-sw)/2, circ = 2*Math.PI*r, dash = circ*(pct/100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="orb-ring">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bg} strokeWidth={sw}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{transition:"stroke-dasharray .7s cubic-bezier(.4,0,.2,1)"}}/>
      {children}
    </svg>
  );
}

function STypeTag({ type }) {
  const c = TYPE_COLOR[type]||"#5A5A7A";
  return <span className="stype" style={{background:c+"18",color:c}}>{TYPE_EMOJI[type]} {type}</span>;
}
function RecChip({ recur }) {
  if (!recur) return null;
  return <span className="rec-chip">🔄 {RECUR_SHORT[recur]||recur+"d"}</span>;
}

function TaskPill({ task, plant, onToggle, onEdit, onDelete }) {
  const urg = urgOf(task.dueDate, task.done);
  const cls = urg==="overdue"?"urgent":urg==="today"?"warn":"";
  const [showActions, setShowActions] = useState(false);
  return (
    <div className={`task-pill ${task.done?"done":""} ${cls}`} style={{position:"relative"}}>
      <ChkCircle on={task.done} toggle={()=>onToggle(task.id)} />
      <div style={{flex:1,minWidth:0}} onClick={()=>setShowActions(s=>!s)} style={{flex:1,minWidth:0,cursor:"pointer"}}>
        <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap",marginBottom:3}}>
          <span style={{fontSize:16}}>{plant?.emoji}</span>
          <span style={{fontWeight:700,fontSize:14,color:"#1E3A1E"}}>{plant?.name}</span>
          <STypeTag type={task.type}/>
          <RecChip recur={task.recur}/>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:11,color:URG_COLOR[urg],fontWeight:700}}>{urg==="done"?"✓ Done":fmtDate(task.dueDate)}</span>
          {task.note && <span style={{fontSize:11,color:"#8FAD8F",fontStyle:"italic"}}>— {task.note}</span>}
          {task.done && task.doneBy && <span style={{fontSize:11,color:"#3A7D5A",fontWeight:700}}>by {task.doneBy}</span>}
          {plant && <span style={{fontSize:11,color:"#A0B8A0"}}>{plant.loc}</span>}
        </div>
      </div>
      <div style={{display:"flex",gap:4,flexShrink:0}}>
        <button onClick={()=>onEdit(task)} title="Edit" style={{background:"none",border:"none",cursor:"pointer",fontSize:14,padding:"4px",borderRadius:6,color:"#8FAD8F",transition:"color .15s"}} onMouseEnter={e=>e.target.style.color="#3A7D5A"} onMouseLeave={e=>e.target.style.color="#8FAD8F"}>✏️</button>
        <button onClick={()=>onDelete(task.id)} title="Delete" style={{background:"none",border:"none",cursor:"pointer",fontSize:14,padding:"4px",borderRadius:6,color:"#8FAD8F",transition:"color .15s"}} onMouseEnter={e=>e.target.style.color="#B84C4C"} onMouseLeave={e=>e.target.style.color="#8FAD8F"}>🗑️</button>
      </div>
    </div>
  );
}

// ─── AUTH SCREEN ──────────────────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [loading, setLoading] = useState(false);
  const [err,     setErr]     = useState("");

  async function signInWithGoogle() {
    setLoading(true); setErr("");
    const { error } = await sb.auth.signInWithOAuth({
      provider:"google",
      options:{ redirectTo: "https://garden-tracker-indol.vercel.app" }
    });
    if (error) { setErr(error.message); setLoading(false); }
  }

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{fontSize:56,marginBottom:12}}>🌿</div>
        <h1 style={{fontSize:28,fontWeight:700,color:"#1E3A1E",marginBottom:8}}>Garden Tracker</h1>
        <p style={{fontSize:15,color:"#6B8F6B"}}>Your family's property, organised</p>
      </div>
      <div className="auth-card" style={{width:"100%",maxWidth:380}}>
        <h2 style={{fontSize:18,fontWeight:700,color:"#1E3A1E",marginBottom:6}}>Sign in to continue</h2>
        <p style={{fontSize:13,color:"#8FAD8F",marginBottom:24}}>Use your Google account — each family member signs in separately and shares the same garden.</p>
        {err && <div className="err">{err}</div>}
        <button className="google-btn" onClick={signInWithGoogle} disabled={loading}>
          {loading ? <Spinner/> : (
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.7 2.2 30.2 0 24 0 14.7 0 6.7 5.4 2.7 13.4l7.8 6.1C12.3 13.3 17.7 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.5 3-2.2 5.5-4.7 7.2l7.3 5.7c4.3-4 6.8-9.9 6.8-16.9z"/>
              <path fill="#FBBC05" d="M10.5 28.5c-.6-1.6-.9-3.2-.9-4.9s.3-3.3.9-4.9l-7.8-6.1C.9 16 0 19.9 0 24s.9 8 2.7 11.4l7.8-5.9z"/>
              <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.3-5.7c-2.1 1.4-4.7 2.2-7.9 2.2-6.3 0-11.7-4.3-13.6-10l-7.8 5.9C6.7 42.6 14.7 48 24 48z"/>
            </svg>
          )}
          {loading ? "Signing in…" : "Continue with Google"}
        </button>
      </div>
    </div>
  );
}

// ─── GARDEN SETUP SCREEN ──────────────────────────────────────────────────────
function GardenSetup({ user, onJoined }) {
  const [mode,      setMode]      = useState(null); // "create" | "join"
  const [name,      setName]      = useState("Our Garden");
  const [code,      setCode]      = useState("");
  const [dispName,  setDispName]  = useState(user.email?.split("@")[0]||"");
  const [loading,   setLoading]   = useState(false);
  const [err,       setErr]       = useState("");

  async function createGarden() {
    setLoading(true); setErr("");
    try {
      // Create garden
      const { data: garden, error: ge } = await sb.from("gardens").insert({ name }).select().single();
      if (ge) throw ge;
      // Join as admin
      const { error: me } = await sb.from("garden_members").insert({
        garden_id: garden.id, user_id: user.id, display_name: dispName, role:"admin"
      });
      if (me) throw me;
      onJoined(garden, dispName);
    } catch(e) { setErr(e.message); setLoading(false); }
  }

  async function joinGarden() {
    setLoading(true); setErr("");
    try {
      const { data: garden, error: ge } = await sb.from("gardens").select().eq("invite_code", code.toUpperCase().trim()).single();
      if (ge || !garden) throw new Error("Garden not found — check the invite code");
      // Check not already member
      const { data: existing } = await sb.from("garden_members").select().eq("garden_id",garden.id).eq("user_id",user.id).single();
      if (!existing) {
        const { error: me } = await sb.from("garden_members").insert({
          garden_id: garden.id, user_id: user.id, display_name: dispName, role:"member"
        });
        if (me) throw me;
      }
      onJoined(garden, dispName);
    } catch(e) { setErr(e.message); setLoading(false); }
  }

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{fontSize:48,marginBottom:10}}>🏡</div>
        <h1 style={{fontSize:22,fontWeight:700,color:"#1E3A1E"}}>Welcome to Garden Tracker</h1>
        <p style={{fontSize:14,color:"#6B8F6B",marginTop:6}}>Create a family garden or join one with an invite code</p>
      </div>

      <div style={{width:"100%",maxWidth:380}}>
        <div className="auth-card">
          <div className="field">
            <label>Your name (shown to family)</label>
            <input value={dispName} onChange={e=>setDispName(e.target.value)} placeholder="e.g. Sam"/>
          </div>

          {!mode && (
            <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:8}}>
              <button className="big-btn big-btn-green" onClick={()=>setMode("create")}>🌱 Create a new garden</button>
              <button className="big-btn" style={{background:"rgba(58,125,90,.1)",color:"#3A7D5A"}} onClick={()=>setMode("join")}>🔗 Join with invite code</button>
            </div>
          )}

          {mode==="create" && (<>
            <div className="field" style={{marginTop:16}}>
              <label>Garden name</label>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Our Acreage"/>
            </div>
            {err && <div className="err">{err}</div>}
            <div style={{display:"flex",gap:10}}>
              <button className="big-btn" style={{background:"rgba(0,0,0,.07)",color:"#6B8F6B",flex:1}} onClick={()=>setMode(null)}>Back</button>
              <button className="big-btn big-btn-green" style={{flex:2}} onClick={createGarden} disabled={loading||!dispName.trim()}>
                {loading?<Spinner/>:"Create garden"}
              </button>
            </div>
          </>)}

          {mode==="join" && (<>
            <div className="field" style={{marginTop:16}}>
              <label>Invite code</label>
              <input value={code} onChange={e=>setCode(e.target.value)} placeholder="e.g. ABC123" style={{letterSpacing:".15em",fontSize:20,textTransform:"uppercase"}}/>
            </div>
            {err && <div className="err">{err}</div>}
            <div style={{display:"flex",gap:10}}>
              <button className="big-btn" style={{background:"rgba(0,0,0,.07)",color:"#6B8F6B",flex:1}} onClick={()=>setMode(null)}>Back</button>
              <button className="big-btn big-btn-green" style={{flex:2}} onClick={joinGarden} disabled={loading||!code.trim()||!dispName.trim()}>
                {loading?<Spinner/>:"Join garden"}
              </button>
            </div>
          </>)}
        </div>
      </div>
    </div>
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────
function HomeScreen({ plants, tasks, dispName, onToggle, onAddTask, onEditTask, onDeleteTask }) {
  const [selCat, setSelCat] = useState(null);
  const plantById = useCallback(id=>plants.find(p=>p.id===id),[plants]);

  const actionable = tasks.filter(t=>!t.done&&(urgOf(t.dueDate,false)==="overdue"||urgOf(t.dueDate,false)==="today"));
  const doneToday  = tasks.filter(t=>t.done&&t.doneAt===TODAY);
  const totalNow   = actionable.length+doneToday.length;
  const pct        = totalNow===0?100:Math.round((doneToday.length/totalNow)*100);
  const overdue    = tasks.filter(t=>!t.done&&urgOf(t.dueDate,false)==="overdue").length;

  const taskGroups = useMemo(()=>{
    const rel = tasks.filter(t=>{
      const u=urgOf(t.dueDate,t.done);
      if(u==="upcoming"||u==="week") return false;
      if(u==="done"&&t.doneAt!==TODAY) return false;
      return true;
    });
    const fil = selCat ? rel.filter(t=>plants.find(p=>p.id===t.plantId)?.cat===selCat) : rel;
    const byDate = a=>[...a].sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate));
    return {
      overdue:  byDate(fil.filter(t=>urgOf(t.dueDate,t.done)==="overdue")),
      today:    byDate(fil.filter(t=>urgOf(t.dueDate,t.done)==="today")),
      doneToday:byDate(fil.filter(t=>t.done&&t.doneAt===TODAY)),
    };
  },[tasks,plants,selCat]);

  const catStats = CATS.map(cat=>{
    const ids=new Set(plants.filter(p=>p.cat===cat.id).map(p=>p.id));
    const ct=tasks.filter(t=>ids.has(t.plantId));
    const act=ct.filter(t=>!t.done&&(urgOf(t.dueDate,false)==="overdue"||urgOf(t.dueDate,false)==="today"));
    const don=ct.filter(t=>t.done&&t.doneAt===TODAY);
    const tot=act.length+don.length;
    return{...cat,pct:tot===0?100:Math.round((don.length/tot)*100)};
  });

  const now=new Date();
  const greeting=now.getHours()<12?"Good morning":now.getHours()<17?"Good afternoon":"Good evening";
  const dateStr=now.toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long"});
  const orbColor=pct===100?"#3A7D5A":overdue>0?"#B84C4C":"#B07B2A";
  const orbMsg=pct===100?"All done for today! 🌿":overdue>0?`${overdue} overdue — start here`:`${totalNow-doneToday.length} tasks need attention`;

  return (
    <div className="fade-up">
      <div className="hero">
        <div className="hero-date">{dateStr}</div>
        <div className="hero-title">{greeting}, {dispName} 🌱</div>
      </div>
      <div className="home-grid">
        {/* LEFT — orb + category list */}
        <div>
          <div style={{background:"rgba(255,255,255,.7)",borderRadius:20,padding:"28px 24px",marginBottom:20,textAlign:"center",boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
            <div className="breathe" style={{display:"inline-block",marginBottom:12}}>
              <Ring pct={pct} size={160} sw={12} color={orbColor} bg="#D9E8D9">
                <text x="50%" y="46%" textAnchor="middle" fontSize="32" fontWeight="700" fill={orbColor} fontFamily="Atkinson Hyperlegible,sans-serif">{pct}%</text>
                <text x="50%" y="62%" textAnchor="middle" fontSize="12" fill="#8FAD8F" fontFamily="Atkinson Hyperlegible,sans-serif">today</text>
              </Ring>
            </div>
            <div style={{fontSize:14,fontWeight:700,color:"#6B8F6B"}}>{orbMsg}</div>
          </div>
          <div style={{background:"rgba(255,255,255,.7)",borderRadius:20,padding:"20px 24px",boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
            <div style={{fontSize:11,fontWeight:700,color:"#8FAD8F",letterSpacing:".1em",textTransform:"uppercase",marginBottom:14}}>By category</div>
            {catStats.map(cat=>(
              <div key={cat.id} onClick={()=>setSelCat(selCat===cat.id?null:cat.id)}
                style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer",padding:"8px 10px",borderRadius:12,marginBottom:6,
                  background:selCat===cat.id?cat.light:"transparent",transition:"background .15s"}}>
                <Ring pct={cat.pct} size={44} sw={4} color={cat.color} bg="#E2DDD5">
                  <text x="50%" y="50%" textAnchor="middle" dy=".35em" fontSize="14" fontFamily="sans-serif">{cat.emoji}</text>
                </Ring>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:13,color:cat.color}}>{cat.label}</div>
                  <div style={{fontSize:11,color:"#8FAD8F",marginTop:1}}>{Math.round(cat.pct)}% done today</div>
                </div>
                <div style={{width:56,height:5,borderRadius:99,background:"#E2DDD5",overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${cat.pct}%`,background:cat.color,borderRadius:99,transition:"width .5s"}}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — task sections */}
        <div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div className="sec-label">{selCat?CATS.find(c=>c.id===selCat)?.label:"Daily summary"}</div>
            <button className="sm-btn sm-btn-green" style={{fontSize:12,padding:"6px 14px"}} onClick={()=>onAddTask()}>+ Task</button>
          </div>
          {taskGroups.overdue.length===0&&taskGroups.today.length===0&&taskGroups.doneToday.length===0 ? (
            <div className="empty" style={{paddingTop:60}}>
              <div className="empty-icon">🌿</div>
              <div className="empty-msg">All caught up!</div>
              <div className="empty-sub">Nothing urgent right now</div>
            </div>
          ) : (<>
            {taskGroups.overdue.length>0 && (
              <div style={{marginBottom:24}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,padding:"10px 16px",borderRadius:12,background:"rgba(184,76,76,.1)",border:"1.5px solid rgba(184,76,76,.22)"}}>
                  <span style={{fontSize:18}}>🚨</span>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:"#8B2E2E"}}>Overdue</div><div style={{fontSize:11,color:"#B84C4C",marginTop:1}}>{taskGroups.overdue.length} task{taskGroups.overdue.length!==1?"s":""} past due — do these first</div></div>
                  <div style={{fontWeight:700,fontSize:20,color:"#B84C4C"}}>{taskGroups.overdue.length}</div>
                </div>
                {taskGroups.overdue.map(t=><TaskPill key={t.id} task={t} plant={plantById(t.plantId)} onToggle={onToggle} onEdit={onEditTask} onDelete={onDeleteTask}/>)}
              </div>
            )}
            {taskGroups.today.length>0 && (
              <div style={{marginBottom:24}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,padding:"10px 16px",borderRadius:12,background:"rgba(176,123,42,.1)",border:"1.5px solid rgba(176,123,42,.22)"}}>
                  <span style={{fontSize:18}}>📍</span>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:"#7A5010"}}>Today</div><div style={{fontSize:11,color:"#B07B2A",marginTop:1}}>{taskGroups.today.length} task{taskGroups.today.length!==1?"s":""} due today</div></div>
                  <div style={{fontWeight:700,fontSize:20,color:"#B07B2A"}}>{taskGroups.today.length}</div>
                </div>
                {taskGroups.today.map(t=><TaskPill key={t.id} task={t} plant={plantById(t.plantId)} onToggle={onToggle} onEdit={onEditTask} onDelete={onDeleteTask}/>)}
              </div>
            )}
            {taskGroups.doneToday.length>0 && (
              <div style={{marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,padding:"10px 16px",borderRadius:12,background:"rgba(58,125,90,.08)",border:"1.5px solid rgba(58,125,90,.18)"}}>
                  <span style={{fontSize:18}}>✅</span>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:"#1E5C38"}}>Done today</div><div style={{fontSize:11,color:"#3A7D5A",marginTop:1}}>{taskGroups.doneToday.length} completed — great work!</div></div>
                  <div style={{fontWeight:700,fontSize:20,color:"#3A7D5A"}}>{taskGroups.doneToday.length}</div>
                </div>
                {taskGroups.doneToday.map(t=><TaskPill key={t.id} task={t} plant={plantById(t.plantId)} onToggle={onToggle} onEdit={onEditTask} onDelete={onDeleteTask}/>)}
              </div>
            )}
          </>)}
      </div>
    </div>
    </div>
  </div>
  );
}

// ─── UPCOMING SCREEN ──────────────────────────────────────────────────────────
function UpcomingScreen({ plants, tasks, onToggle, onEditTask, onDeleteTask }) {
  const plantById = id=>plants.find(p=>p.id===id);
  const groups = useMemo(()=>{
    const g={overdue:[],today:[],week:[],upcoming:[]};
    tasks.filter(t=>!t.done).forEach(t=>{const u=urgOf(t.dueDate,false);if(g[u])g[u].push(t);});
    Object.values(g).forEach(a=>a.sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate)));
    return g;
  },[tasks]);
  const sections=[
    {key:"overdue",label:"🚨 Overdue",color:URG_COLOR.overdue},
    {key:"today",label:"📍 Today",color:URG_COLOR.today},
    {key:"week",label:"📅 This week",color:URG_COLOR.week},
    {key:"upcoming",label:"🔭 Coming up",color:URG_COLOR.upcoming},
  ].filter(s=>groups[s.key]?.length>0);

  return (
    <div className="fade-up" style={{paddingTop:0}}>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:13,color:"#8FAD8F"}}>{tasks.filter(t=>!t.done).length} active across {plants.length} plants</div>
      </div>
      {sections.length===0?(
        <div className="empty px"><div className="empty-icon">🎉</div><div className="empty-msg">Nothing pending!</div></div>
      ):sections.map(s=>(
        <div key={s.key} style={{marginBottom:24}}>
          <div className="px" style={{marginBottom:8}}>
            <span style={{fontSize:13,fontWeight:700,color:s.color}}>{s.label}</span>
            <span style={{fontSize:12,color:"#8FAD8F",marginLeft:8}}>{groups[s.key].length} task{groups[s.key].length!==1?"s":""}</span>
          </div>
          <div className="px">{groups[s.key].map(t=><TaskPill key={t.id} task={t} plant={plantById(t.plantId)} onToggle={onToggle}/>)}</div>
        </div>
      ))}
    </div>
  );
}

// ─── CALENDAR SCREEN ──────────────────────────────────────────────────────────
function CalendarScreen({ plants, tasks, onToggle }) {
  const now=new Date();
  const [yr,setYr]=useState(now.getFullYear());
  const [mo,setMo]=useState(now.getMonth());
  const [sel,setSel]=useState(null);
  const plantById=id=>plants.find(p=>p.id===id);
  const tasksByDate=useMemo(()=>{
    const m={};
    tasks.forEach(t=>{if(!m[t.dueDate])m[t.dueDate]=[];m[t.dueDate].push(t);});
    return m;
  },[tasks]);
  const first=new Date(yr,mo,1),startDow=first.getDay(),dim=new Date(yr,mo+1,0).getDate(),prevDim=new Date(yr,mo,0).getDate();
  const cells=[];
  for(let i=0;i<startDow;i++)cells.push({d:prevDim-startDow+1+i,cur:false});
  for(let i=1;i<=dim;i++)cells.push({d:i,cur:true});
  while(cells.length%7!==0)cells.push({d:cells.length-dim-startDow+1,cur:false});
  const cellKey=d=>`${yr}-${String(mo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const selKey=sel?cellKey(sel):null;
  const selTasks=selKey?(tasksByDate[selKey]||[]):[];

  return (
    <div className="fade-up" style={{paddingTop:0}}>
      <div className="cal-header">
        <button className="sm-btn sm-btn-ghost" onClick={()=>{if(mo===0){setMo(11);setYr(y=>y-1);}else setMo(m=>m-1);setSel(null);}}>←</button>
        <div className="cal-month">{MONTHS[mo]} {yr}</div>
        <button className="sm-btn sm-btn-ghost" onClick={()=>{if(mo===11){setMo(0);setYr(y=>y+1);}else setMo(m=>m+1);setSel(null);}}>→</button>
      </div>
      <div className="cal-grid" style={{marginBottom:4}}>{DOWS.map(d=><div key={d} className="cal-dow">{d}</div>)}</div>
      <div className="cal-grid">
        {cells.map((cell,i)=>{
          const key=cell.cur?cellKey(cell.d):null;
          const dts=key?(tasksByDate[key]||[]):[];
          const isTod=key===TODAY,isSel=cell.cur&&cell.d===sel;
          return (
            <div key={i} className={`cal-cell ${isTod?"is-today":""} ${isSel?"is-sel":""} ${!cell.cur?"dim":""}`}
              onClick={()=>cell.cur&&setSel(cell.d===sel?null:cell.d)}>
              <div className="cal-num">{cell.d}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:2}}>
                {dts.slice(0,5).map(t=><span key={t.id} className="cal-dot" style={{background:URG_COLOR[urgOf(t.dueDate,t.done)]}}/>)}
                {dts.length>5&&<span style={{fontSize:8,color:"#8FAD8F",fontWeight:700}}>+{dts.length-5}</span>}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",gap:14,padding:"14px 22px",flexWrap:"wrap"}}>
        {Object.entries(URG_COLOR).map(([k,c])=>(
          <div key={k} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#8FAD8F"}}>
            <span style={{width:8,height:8,borderRadius:"50%",background:c,display:"inline-block"}}/>{URG_LABEL[k]}
          </div>
        ))}
      </div>
      {selKey&&(
        <div className="px" style={{marginTop:8}}>
          <div style={{background:"rgba(255,255,255,.75)",borderRadius:16,padding:"16px",backdropFilter:"blur(4px)"}}>
            <div style={{fontWeight:700,fontSize:15,color:"#1E3A1E",marginBottom:12}}>
              📅 {fmtDate(selKey)} <span style={{fontWeight:400,color:"#8FAD8F",fontSize:13}}>— {selTasks.length} task{selTasks.length!==1?"s":""}</span>
            </div>
            {selTasks.length===0
              ?<div style={{color:"#8FAD8F",fontSize:13,textAlign:"center",padding:"12px 0"}}>Nothing scheduled</div>
              :selTasks.map(t=><TaskPill key={t.id} task={t} plant={plantById(t.plantId)} onToggle={onToggle}/>)
            }
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PLANTS SCREEN ────────────────────────────────────────────────────────────
const TIER_ORDER = ["Tier 1","Tier 2","Tier 3","Tier 4","Tier 5","Side Tier","By the dam"];
const TIER_EMOJI = {
  "Tier 1":"1️⃣", "Tier 2":"2️⃣", "Tier 3":"3️⃣",
  "Tier 4":"4️⃣", "Tier 5":"5️⃣", "Side Tier":"↔️", "By the dam":"💧"
};

function PlantRow({ plant, next, onAddTask }) {
  const urg = next ? urgOf(next.dueDate, false) : "none";
  return (
    <div className="plant-row">
      <span style={{fontSize:24,flexShrink:0}}>{plant.emoji}</span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontWeight:700,fontSize:14,color:"#1E3A1E"}}>{plant.name}</div>
        {next ? (
          <div style={{display:"flex",gap:6,alignItems:"center",marginTop:4,flexWrap:"wrap"}}>
            <STypeTag type={next.type}/>
            <span style={{fontSize:11,fontWeight:700,color:URG_COLOR[urg]||"#8FAD8F"}}>{fmtDate(next.dueDate)}</span>
            <RecChip recur={next.recur}/>
          </div>
        ) : (
          <span style={{fontSize:11,color:"#8FAD8F",marginTop:4,display:"block"}}>No upcoming tasks</span>
        )}
      </div>
      <button onClick={()=>onAddTask(plant.id)} className="sm-btn sm-btn-ghost" style={{fontSize:12,padding:"5px 10px",flexShrink:0}}>+ Task</button>
    </div>
  );
}

function PlantsScreen({ plants, tasks, onAddPlant, onAddTask }) {
  const [viewMode, setViewMode] = useState("tier"); // "tier" | "category"
  const [search,   setSearch]   = useState("");
  const [openTiers, setOpenTiers] = useState({});
  const [openCats,  setOpenCats]  = useState({});

  const tasksByPlant = useMemo(()=>{
    const m={};tasks.forEach(t=>{if(!m[t.plantId])m[t.plantId]=[];m[t.plantId].push(t);});return m;
  },[tasks]);
  const nextTask = id => (tasksByPlant[id]||[]).filter(t=>!t.done).sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate))[0]||null;

  const filtered = plants.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.loc.toLowerCase().includes(search.toLowerCase())
  );

  function toggleTier(t) { setOpenTiers(o=>({...o,[t]:!o[t]})); }
  function toggleCat(c)  { setOpenCats(o=>({...o,[c]:!o[c]})); }

  // Get all tiers present in data, ordered
  const tiers = useMemo(()=>{
    const found = [...new Set(filtered.map(p=>p.loc).filter(Boolean))];
    const ordered = TIER_ORDER.filter(t=>found.includes(t));
    const rest = found.filter(t=>!TIER_ORDER.includes(t));
    return [...ordered, ...rest];
  },[filtered]);

  return (
    <div className="fade-up" style={{paddingTop:0}}>
      <div className="px" style={{marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div style={{fontSize:22,fontWeight:700,color:"#1E3A1E"}}>Plants</div>
          <div style={{display:"flex",gap:8}}>
            <button className="sm-btn sm-btn-ghost" onClick={onAddPlant}>+ Plant</button>
            <button className="sm-btn sm-btn-green" onClick={()=>onAddTask()}>+ Task</button>
          </div>
        </div>

        {/* Search */}
        <input placeholder="🔍  Search plants…" value={search} onChange={e=>setSearch(e.target.value)}
          style={{width:"100%",padding:"11px 14px",borderRadius:12,border:"2px solid rgba(0,0,0,.07)",background:"rgba(255,255,255,.8)",fontFamily:"inherit",fontSize:14,color:"#2D3B2D",outline:"none",marginBottom:12}}/>

        {/* View toggle */}
        <div style={{display:"flex",gap:6,marginBottom:4}}>
          {[["tier","📍 By Tier"],["category","🌿 By Category"]].map(([v,l])=>(
            <button key={v} onClick={()=>setViewMode(v)}
              style={{padding:"7px 16px",borderRadius:100,fontFamily:"inherit",fontSize:13,fontWeight:700,border:"none",cursor:"pointer",
                background:viewMode===v?"#3A7D5A":"rgba(255,255,255,.7)",color:viewMode===v?"#fff":"#6B8F6B",transition:"all .18s"}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* ── BY TIER ── */}
      {viewMode==="tier" && (
        <div>
          {tiers.map(tier=>{
            const tierPlants = filtered.filter(p=>p.loc===tier);
            if (!tierPlants.length) return null;
            const isOpen = openTiers[tier] !== false; // default open
            return (
              <div key={tier} style={{marginBottom:8}}>
                {/* Tier header */}
                <button onClick={()=>toggleTier(tier)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 22px",background:"rgba(58,125,90,.08)",border:"none",cursor:"pointer",fontFamily:"inherit"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:18}}>{TIER_EMOJI[tier]||"📍"}</span>
                    <span style={{fontWeight:700,fontSize:15,color:"#1E3A1E"}}>{tier}</span>
                    <span style={{fontSize:12,color:"#8FAD8F"}}>{tierPlants.length} plants</span>
                  </div>
                  <span style={{fontSize:14,color:"#8FAD8F"}}>{isOpen?"▾":"▸"}</span>
                </button>

                {isOpen && (
                  <div style={{padding:"4px 0 8px"}}>
                    {/* Group by category within tier */}
                    {CATS.map(cat=>{
                      const catPlants = tierPlants.filter(p=>p.cat===cat.id);
                      if (!catPlants.length) return null;
                      return (
                        <div key={cat.id} style={{marginBottom:4}}>
                          <div style={{padding:"6px 22px",display:"flex",alignItems:"center",gap:6}}>
                            <span style={{fontSize:12}}>{cat.emoji}</span>
                            <span style={{fontSize:11,fontWeight:700,color:cat.color,letterSpacing:".05em",textTransform:"uppercase"}}>{cat.label}</span>
                          </div>
                          <div className="px">
                            {catPlants.map(plant=><PlantRow key={plant.id} plant={plant} next={nextTask(plant.id)} onAddTask={onAddTask}/>)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── BY CATEGORY ── */}
      {viewMode==="category" && (
        <div>
          {CATS.map(cat=>{
            const catPlants = filtered.filter(p=>p.cat===cat.id);
            if (!catPlants.length) return null;
            const isOpen = openCats[cat.id] !== false; // default open
            return (
              <div key={cat.id} style={{marginBottom:8}}>
                {/* Category header */}
                <button onClick={()=>toggleCat(cat.id)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 22px",background:cat.light,border:"none",cursor:"pointer",fontFamily:"inherit"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:18}}>{cat.emoji}</span>
                    <span style={{fontWeight:700,fontSize:15,color:cat.color}}>{cat.label}</span>
                    <span style={{fontSize:12,color:"#8FAD8F"}}>{catPlants.length} plants</span>
                  </div>
                  <span style={{fontSize:14,color:"#8FAD8F"}}>{isOpen?"▾":"▸"}</span>
                </button>

                {isOpen && (
                  <div style={{padding:"4px 0 8px"}}>
                    {/* Group by tier within category */}
                    {tiers.map(tier=>{
                      const tp = catPlants.filter(p=>p.loc===tier);
                      if (!tp.length) return null;
                      return (
                        <div key={tier} style={{marginBottom:4}}>
                          <div style={{padding:"6px 22px",display:"flex",alignItems:"center",gap:6}}>
                            <span style={{fontSize:12}}>{TIER_EMOJI[tier]||"📍"}</span>
                            <span style={{fontSize:11,fontWeight:700,color:"#6B8F6B",letterSpacing:".05em",textTransform:"uppercase"}}>{tier}</span>
                          </div>
                          <div className="px">
                            {tp.map(plant=><PlantRow key={plant.id} plant={plant} next={nextTask(plant.id)} onAddTask={onAddTask}/>)}
                          </div>
                        </div>
                      );
                    })}
                    {/* Plants with no tier */}
                    {catPlants.filter(p=>!p.loc).length>0 && (
                      <div className="px">
                        {catPlants.filter(p=>!p.loc).map(plant=><PlantRow key={plant.id} plant={plant} next={nextTask(plant.id)} onAddTask={onAddTask}/>)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {filtered.length===0&&<div className="empty px"><div className="empty-icon">🔍</div><div className="empty-msg">No plants match</div></div>}
    </div>
  );
}

// ─── SETTINGS SCREEN ──────────────────────────────────────────────────────────
function SettingsScreen({ user, garden, members, dispName, onSignOut }) {
  const [copied, setCopied] = useState(false);

  function copyCode() {
    navigator.clipboard.writeText(garden.invite_code||"");
    setCopied(true);
    setTimeout(()=>setCopied(false), 2000);
  }

  return (
    <div className="fade-up" style={{padding:"24px 22px 0"}}>
      <div style={{fontSize:22,fontWeight:700,color:"#1E3A1E",marginBottom:24}}>Settings</div>

      {/* Garden info */}
      <div style={{background:"rgba(255,255,255,.75)",borderRadius:16,padding:"18px",marginBottom:16}}>
        <div style={{fontSize:12,fontWeight:700,color:"#8FAD8F",letterSpacing:".07em",textTransform:"uppercase",marginBottom:8}}>Your garden</div>
        <div style={{fontSize:18,fontWeight:700,color:"#1E3A1E",marginBottom:4}}>🏡 {garden.name}</div>
        <div style={{fontSize:13,color:"#6B8F6B",marginBottom:12}}>Share this code with family members to invite them:</div>
        <div className="code-box">{garden.invite_code}</div>
        <button className="sm-btn sm-btn-ghost" style={{width:"100%",justifyContent:"center"}} onClick={copyCode}>
          {copied?"✓ Copied!":"📋 Copy invite code"}
        </button>
      </div>

      {/* Members */}
      <div style={{background:"rgba(255,255,255,.75)",borderRadius:16,padding:"18px",marginBottom:16}}>
        <div style={{fontSize:12,fontWeight:700,color:"#8FAD8F",letterSpacing:".07em",textTransform:"uppercase",marginBottom:12}}>Family members</div>
        <div style={{display:"flex",flexWrap:"wrap"}}>
          {members.map(m=>(
            <div key={m.id} className="member-chip">
              <span>👤</span>
              <span>{m.display_name}</span>
              {m.role==="admin"&&<span style={{fontSize:10,color:"#8FAD8F"}}>admin</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Account */}
      <div style={{background:"rgba(255,255,255,.75)",borderRadius:16,padding:"18px",marginBottom:16}}>
        <div style={{fontSize:12,fontWeight:700,color:"#8FAD8F",letterSpacing:".07em",textTransform:"uppercase",marginBottom:8}}>Account</div>
        <div style={{fontSize:14,color:"#1E3A1E",marginBottom:4}}>👤 {dispName}</div>
        <div style={{fontSize:12,color:"#8FAD8F",marginBottom:16}}>{user.email}</div>
        <button className="big-btn" style={{background:"rgba(184,76,76,.1)",color:"#B84C4C"}} onClick={onSignOut}>Sign out</button>
      </div>
    </div>
  );
}

// ─── ADD TASK SHEET ───────────────────────────────────────────────────────────
function AddTaskSheet({ plants, defaultPlantId, gardenId, onSave, onClose, editTask, onUpdate, onDelete }) {
  const isEdit = !!editTask;
  const [plantId,setPlantId]=useState(isEdit?String(editTask.plantId):(defaultPlantId?String(defaultPlantId):""));
  const [type,setType]=useState(isEdit?editTask.type:"Harvest");
  const [due,setDue]=useState(isEdit?editTask.dueDate:TODAY);
  const [note,setNote]=useState(isEdit?editTask.note:"");
  const [recur,setRecur]=useState(isEdit?editTask.recur:"");
  const [saving,setSaving]=useState(false);
  const [err,setErr]=useState("");

  async function save() {
    if(!plantId) return;
    setSaving(true); setErr("");
    const recurMonths = recur ? Math.round(Number(recur)/30) : null;
    if (isEdit) {
      const { data, error } = await sb.from("tasks").update({
        plant_id:plantId, task_type:type, due_date:due, recurrence_months:recurMonths, notes:note,
      }).eq("id",editTask.id).select().single();
      if (error) { setErr(error.message); setSaving(false); return; }
      onUpdate(mapTask(data)); onClose();
    } else {
      const { data, error } = await sb.from("tasks").insert({
        plant_id:plantId, garden_id:gardenId, task_type:type, due_date:due, recurrence_months:recurMonths, notes:note,
      }).select().single();
      if (error) { setErr(error.message); setSaving(false); return; }
      onSave(mapTask(data)); onClose();
    }
  }

  async function del() {
    if (!window.confirm("Delete this task?")) return;
    await sb.from("tasks").delete().eq("id",editTask.id);
    onDelete(editTask.id); onClose();
  }

  return (
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sheet">
        <div className="sheet-handle"/><button className="sheet-close" onClick={onClose}>×</button>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <div style={{fontWeight:700,fontSize:20,color:"#1E3A1E"}}>{isEdit?"Edit task":"Add task"}</div>
          {isEdit&&<button onClick={del} style={{background:"rgba(184,76,76,.1)",border:"none",borderRadius:8,padding:"6px 12px",color:"#B84C4C",fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:13}}>🗑️ Delete</button>}
        </div>
        {err&&<div className="err">{err}</div>}
        <div className="field">
          <label>Plant</label>
          <select value={plantId} onChange={e=>setPlantId(e.target.value)}>
            <option value="">— choose a plant —</option>
            {CATS.map(cat=>(
              <optgroup key={cat.id} label={`${cat.emoji} ${cat.label}`}>
                {plants.filter(p=>p.cat===cat.id).map(p=><option key={p.id} value={p.id}>{p.emoji} {p.name}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div className="field"><label>Task type</label>
            <select value={type} onChange={e=>setType(e.target.value)}>{TASK_TYPES.map(t=><option key={t}>{t}</option>)}</select>
          </div>
          <div className="field"><label>Due date</label><input type="date" value={due} onChange={e=>setDue(e.target.value)}/></div>
        </div>
        <div className="field"><label>Repeats</label>
          <select value={recur} onChange={e=>setRecur(e.target.value)}>{RECUR_OPTS.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select>
        </div>
        {recur&&<div style={{background:"rgba(124,92,191,.08)",border:"1.5px solid rgba(124,92,191,.2)",borderRadius:12,padding:"10px 14px",marginBottom:16,fontSize:13,color:"#4338CA",fontWeight:700}}>🔄 Next task auto-schedules after completion</div>}
        <div className="field"><label>Notes</label><textarea rows={2} value={note} onChange={e=>setNote(e.target.value)} placeholder="Any specific instructions…" style={{resize:"vertical"}}/></div>
        <div style={{display:"flex",gap:10,marginTop:4}}>
          <button onClick={onClose} className="big-btn" style={{background:"rgba(0,0,0,.07)",color:"#6B8F6B",flex:1}}>Cancel</button>
          <button onClick={save} disabled={!plantId||saving} className="big-btn big-btn-green" style={{flex:2,opacity:plantId?1:.45}}>
            {saving?<Spinner/>:isEdit?"Save changes":"Save task"}
          </button>
      </div>
      </div>
    </div>
  </div>
  );
}

// ─── ADD PLANT SHEET ──────────────────────────────────────────────────────────
function AddPlantSheet({ gardenId, onSave, onClose }) {
  const [name,setName]=useState("");
  const [cat,setCat]=useState("fruit");
  const [loc,setLoc]=useState("");
  const [emoji,setEmoji]=useState("🌱");
  const [saving,setSaving]=useState(false);
  const [err,setErr]=useState("");

  async function save() {
    if(!name.trim()) return;
    setSaving(true); setErr("");
    const { data, error } = await sb.from("plants").insert({
      garden_id: gardenId, name: name.trim(), category: cat, location: loc, emoji
    }).select().single();
    if (error) { setErr(error.message); setSaving(false); return; }
    onSave(mapPlant(data));
    onClose();
  }

  return (
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sheet">
        <div className="sheet-handle"/><button className="sheet-close" onClick={onClose}>×</button>
        <div style={{fontWeight:700,fontSize:20,color:"#1E3A1E",marginBottom:20}}>Add plant</div>
        {err&&<div className="err">{err}</div>}
        <div className="field"><label>Plant name</label><input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Jaboticaba" autoFocus/></div>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12}}>
          <div className="field"><label>Category</label>
            <select value={cat} onChange={e=>setCat(e.target.value)}>{CATS.map(c=><option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}</select>
          </div>
          <div className="field"><label>Emoji</label><input type="text" value={emoji} onChange={e=>setEmoji(e.target.value)} maxLength={2} style={{fontSize:22,textAlign:"center"}}/></div>
        </div>
        <div className="field"><label>Location on property</label><input type="text" value={loc} onChange={e=>setLoc(e.target.value)} placeholder="e.g. East fence…"/></div>
        <div style={{display:"flex",gap:10,marginTop:4}}>
          <button onClick={onClose} className="big-btn" style={{background:"rgba(0,0,0,.07)",color:"#6B8F6B",flex:1}}>Cancel</button>
          <button onClick={save} disabled={!name.trim()||saving} className="big-btn big-btn-green" style={{flex:2,opacity:name.trim()?1:.45}}>
            {saving?<Spinner/>:"Add plant"}
          </button>
      </div>
    </div>
  </div>
  </div>
  );
}


// ─── PROPERTY: map task rows ─────────────────────────────────────────────────
function mapChore(r) {
  return {
    id:r.id, areaId:r.area_id, gardenId:r.garden_id,
    type:r.chore_type, dueDate:r.due_date,
    done:!!r.completed_at, doneBy:r.completed_by_name||null, doneAt:r.completed_at?r.completed_at.slice(0,10):null,
    note:r.notes||"", recur:r.recurrence_days?String(r.recurrence_days):"",
  };
}

// ─── PROPERTY CHORE PILL ─────────────────────────────────────────────────────
function ChorePill({ chore, area, onToggle, onEdit, onDelete }) {
  const urg = urgOf(chore.dueDate, chore.done);
  const cls = urg==="overdue"?"urgent":urg==="today"?"warn":"";
  const c = PROP_TYPE_COLOR[chore.type]||"#7A5C3A";
  return (
    <div className={`prop-pill ${chore.done?"done":""} ${cls}`}>
      <button className={`chk-prop ${chore.done?"on":""}`} onClick={e=>{e.stopPropagation();onToggle(chore.id);}}>
        {chore.done&&<svg width="12" height="12" viewBox="0 0 12 12"><path d="M2.5 7l3 3 5-5.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
      </button>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap",marginBottom:3}}>
          <span style={{fontSize:15}}>{area?.emoji||"🔧"}</span>
          <span style={{fontWeight:700,fontSize:14,color:"#2D1F0A"}}>{area?.label||"Property"}</span>
          <span className="prop-tag" style={{background:c+"18",color:c,border:`1.5px solid ${c}44`}}>{PROP_TYPE_EMOJI[chore.type]||"📝"} {chore.type}</span>
          {chore.recur&&<span className="rec-chip">🔄 {RECUR_SHORT[chore.recur]||chore.recur+"d"}</span>}
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:11,color:URG_COLOR[urg],fontWeight:700}}>{urg==="done"?"✓ Done":fmtDate(chore.dueDate)}</span>
          {chore.note&&<span style={{fontSize:11,color:"#9A8A70",fontStyle:"italic"}}>— {chore.note}</span>}
          {chore.done&&chore.doneBy&&<span style={{fontSize:11,color:"#7A5C3A",fontWeight:700}}>by {chore.doneBy}</span>}
        </div>
      </div>
      {onEdit&&onDelete&&(
        <div style={{display:"flex",gap:4,flexShrink:0}}>
          <button onClick={()=>onEdit(chore)} title="Edit" style={{background:"none",border:"none",cursor:"pointer",fontSize:14,padding:"4px",borderRadius:6,color:"#9A8A70",transition:"color .15s"}} onMouseEnter={e=>e.target.style.color="#7A5C3A"} onMouseLeave={e=>e.target.style.color="#9A8A70"}>✏️</button>
          <button onClick={()=>onDelete(chore.id)} title="Delete" style={{background:"none",border:"none",cursor:"pointer",fontSize:14,padding:"4px",borderRadius:6,color:"#9A8A70",transition:"color .15s"}} onMouseEnter={e=>e.target.style.color="#B84C4C"} onMouseLeave={e=>e.target.style.color="#9A8A70"}>🗑️</button>
        </div>
      )}
    </div>
  );
}

// ─── PROPERTY HOME SCREEN ─────────────────────────────────────────────────────
function PropertyHomeScreen({ areas, chores, dispName, gardenId, onToggle, onAddChore, onEditChore, onDeleteChore }) {
  const [selArea, setSelArea] = useState(null);
  const areaById = id => PROP_AREAS.find(a=>a.id===id);

  const actionable = chores.filter(t=>!t.done&&(urgOf(t.dueDate,false)==="overdue"||urgOf(t.dueDate,false)==="today"));
  const doneToday  = chores.filter(t=>t.done&&t.doneAt===TODAY);
  const totalNow   = actionable.length+doneToday.length;
  const pct        = totalNow===0?100:Math.round((doneToday.length/totalNow)*100);
  const overdue    = chores.filter(t=>!t.done&&urgOf(t.dueDate,false)==="overdue").length;

  const choreGroups = useMemo(()=>{
    const rel = chores.filter(t=>{
      const u=urgOf(t.dueDate,t.done);
      if(u==="upcoming"||u==="week") return false;
      if(u==="done"&&t.doneAt!==TODAY) return false;
      return true;
    });
    const fil = selArea ? rel.filter(t=>t.areaId===selArea) : rel;
    const byDate = a=>[...a].sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate));
    return {
      overdue:  byDate(fil.filter(t=>urgOf(t.dueDate,t.done)==="overdue")),
      today:    byDate(fil.filter(t=>urgOf(t.dueDate,t.done)==="today")),
      doneToday:byDate(fil.filter(t=>t.done&&t.doneAt===TODAY)),
    };
  },[chores,selArea]);

  const areaStats = PROP_AREAS.map(area=>{
    const ac = chores.filter(t=>t.areaId===area.id);
    const act = ac.filter(t=>!t.done&&(urgOf(t.dueDate,false)==="overdue"||urgOf(t.dueDate,false)==="today"));
    const don = ac.filter(t=>t.done&&t.doneAt===TODAY);
    const tot = act.length+don.length;
    return {...area,pct:tot===0?100:Math.round((don.length/tot)*100),total:tot};
  }).filter(a=>a.total>0||chores.some(c=>c.areaId===a.id));

  const orbColor = pct===100?"#7A5C3A":overdue>0?"#B84C4C":"#B07B2A";
  const orbMsg   = pct===100?"All chores done! 🏡":overdue>0?`${overdue} overdue — start here`:`${totalNow-doneToday.length} chores need doing`;
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-AU",{weekday:"long",day:"numeric",month:"long"});

  return (
    <div className="fade-up prop-screen">
      <div className="hero">
        <div className="hero-date">{dateStr}</div>
        <div style={{fontSize:28,fontWeight:700,color:"#2D1F0A",lineHeight:1.2,marginBottom:4}}>Property chores 🏡</div>
        <div style={{fontSize:14,color:"#8A7A5A"}}>Dopamine Farm</div>
      </div>

      <div className="prop-home-grid">
        {/* LEFT — orb + area list */}
        <div>
          <div style={{background:"rgba(255,250,242,.85)",borderRadius:20,padding:"28px 24px",marginBottom:20,textAlign:"center",boxShadow:"0 2px 12px rgba(122,92,58,.1)"}}>
            <div className="breathe" style={{display:"inline-block",marginBottom:12}}>
              <Ring pct={pct} size={160} sw={12} color={orbColor} bg="#E8D8C0">
                <text x="50%" y="46%" textAnchor="middle" fontSize="32" fontWeight="700" fill={orbColor} fontFamily="Atkinson Hyperlegible,sans-serif">{pct}%</text>
                <text x="50%" y="62%" textAnchor="middle" fontSize="12" fill="#9A8A70" fontFamily="Atkinson Hyperlegible,sans-serif">today</text>
              </Ring>
            </div>
            <div style={{fontSize:14,fontWeight:700,color:"#8A7A5A"}}>{orbMsg}</div>
          </div>
          <div style={{background:"rgba(255,250,242,.85)",borderRadius:20,padding:"20px 24px",boxShadow:"0 2px 12px rgba(122,92,58,.1)"}}>
            <div style={{fontSize:11,fontWeight:700,color:"#9A8A70",letterSpacing:".1em",textTransform:"uppercase",marginBottom:14}}>By area</div>
            {areaStats.length===0&&<div style={{fontSize:13,color:"#9A8A70",textAlign:"center",padding:"12px 0"}}>No chores yet — add some!</div>}
            {areaStats.map(area=>(
              <div key={area.id} onClick={()=>setSelArea(selArea===area.id?null:area.id)}
                style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer",padding:"8px 10px",borderRadius:12,marginBottom:6,
                  background:selArea===area.id?area.light:"transparent",transition:"background .15s"}}>
                <Ring pct={area.pct} size={44} sw={4} color={area.color} bg="#E8D8C0">
                  <text x="50%" y="50%" textAnchor="middle" dy=".35em" fontSize="14" fontFamily="sans-serif">{area.emoji}</text>
                </Ring>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:13,color:area.color}}>{area.label}</div>
                  <div style={{fontSize:11,color:"#9A8A70",marginTop:1}}>{Math.round(area.pct)}% done today</div>
                </div>
                <div style={{width:56,height:5,borderRadius:99,background:"#E8D8C0",overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${area.pct}%`,background:area.color,borderRadius:99,transition:"width .5s"}}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — chore sections */}
        <div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"#9A8A70"}}>{selArea?PROP_AREAS.find(a=>a.id===selArea)?.label:"Daily chores"}</div>
            <button className="sm-btn sm-btn-brown" style={{fontSize:12,padding:"6px 14px"}} onClick={()=>onAddChore()}>+ Chore</button>
          </div>

          {choreGroups.overdue.length===0&&choreGroups.today.length===0&&choreGroups.doneToday.length===0 ? (
            <div className="empty" style={{paddingTop:60}}>
              <div className="empty-icon">🏡</div>
              <div style={{fontSize:15,fontWeight:700,color:"#7A6A4A"}}>All clear!</div>
              <div style={{fontSize:13,marginTop:4,color:"#9A8A70"}}>Nothing urgent right now</div>
            </div>
          ) : (<>
            {choreGroups.overdue.length>0&&(
              <div style={{marginBottom:24}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,padding:"10px 16px",borderRadius:12,background:"rgba(184,76,76,.1)",border:"1.5px solid rgba(184,76,76,.22)"}}>
                  <span style={{fontSize:18}}>🚨</span>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:"#8B2E2E"}}>Overdue</div><div style={{fontSize:11,color:"#B84C4C",marginTop:1}}>{choreGroups.overdue.length} chore{choreGroups.overdue.length!==1?"s":""} past due</div></div>
                  <div style={{fontWeight:700,fontSize:20,color:"#B84C4C"}}>{choreGroups.overdue.length}</div>
                </div>
                {choreGroups.overdue.map(c=><ChorePill key={c.id} chore={c} area={areaById(c.areaId)} onToggle={onToggle} onEdit={onEditChore} onDelete={onDeleteChore}/>)}
              </div>
            )}
            {choreGroups.today.length>0&&(
              <div style={{marginBottom:24}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,padding:"10px 16px",borderRadius:12,background:"rgba(176,123,42,.1)",border:"1.5px solid rgba(176,123,42,.22)"}}>
                  <span style={{fontSize:18}}>📍</span>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:"#7A5010"}}>Today</div><div style={{fontSize:11,color:"#B07B2A",marginTop:1}}>{choreGroups.today.length} chore{choreGroups.today.length!==1?"s":""} due today</div></div>
                  <div style={{fontWeight:700,fontSize:20,color:"#B07B2A"}}>{choreGroups.today.length}</div>
                </div>
                {choreGroups.today.map(c=><ChorePill key={c.id} chore={c} area={areaById(c.areaId)} onToggle={onToggle} onEdit={onEditChore} onDelete={onDeleteChore}/>)}
              </div>
            )}
            {choreGroups.doneToday.length>0&&(
              <div style={{marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,padding:"10px 16px",borderRadius:12,background:"rgba(122,92,58,.08)",border:"1.5px solid rgba(122,92,58,.2)"}}>
                  <span style={{fontSize:18}}>✅</span>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:"#4A3010"}}>Done today</div><div style={{fontSize:11,color:"#7A5C3A",marginTop:1}}>{choreGroups.doneToday.length} completed — nice work!</div></div>
                  <div style={{fontWeight:700,fontSize:20,color:"#7A5C3A"}}>{choreGroups.doneToday.length}</div>
                </div>
                {choreGroups.doneToday.map(c=><ChorePill key={c.id} chore={c} area={areaById(c.areaId)} onToggle={onToggle} onEdit={onEditChore} onDelete={onDeleteChore}/>)}
              </div>
            )}
          </>)}
      </div>
    </div>
  </div>
  </div>
  );
}

// ─── ALL PROPERTY CHORES SCREEN ───────────────────────────────────────────────
function PropertyChoresScreen({ chores, onToggle, onAddChore, onEditChore, onDeleteChore }) {
  const areaById = id => PROP_AREAS.find(a=>a.id===id);
  const [filter, setFilter] = useState("active");

  const filtered = [...chores]
    .filter(c => filter==="done"?c.done:filter==="active"?!c.done:true)
    .sort((a,b)=>{
      if(a.done!==b.done) return a.done?1:-1;
      return new Date(a.dueDate)-new Date(b.dueDate);
    });

  const groups = useMemo(()=>{
    const g={overdue:[],today:[],week:[],upcoming:[]};
    chores.filter(c=>!c.done).forEach(c=>{const u=urgOf(c.dueDate,false);if(g[u])g[u].push(c);});
    Object.values(g).forEach(a=>a.sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate)));
    return g;
  },[chores]);

  const sections=[
    {key:"overdue",label:"🚨 Overdue",color:URG_COLOR.overdue},
    {key:"today",label:"📍 Today",color:URG_COLOR.today},
    {key:"week",label:"📅 This week",color:URG_COLOR.week},
    {key:"upcoming",label:"🔭 Coming up",color:URG_COLOR.upcoming},
  ].filter(s=>groups[s.key]?.length>0);

  return (
    <div className="fade-up prop-screen" style={{paddingTop:0}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",marginBottom:20}}>
        <button className="sm-btn sm-btn-brown" onClick={onAddChore}>+ Chore</button>
      </div>
      {sections.length===0?(
        <div className="empty"><div className="empty-icon">🏡</div><div style={{fontSize:15,fontWeight:700,color:"#7A6A4A"}}>Nothing pending!</div></div>
      ):sections.map(s=>(
        <div key={s.key} style={{marginBottom:24}}>
          <div style={{marginBottom:10}}>
            <span style={{fontSize:13,fontWeight:700,color:s.color}}>{s.label}</span>
            <span style={{fontSize:12,color:"#9A8A70",marginLeft:8}}>{groups[s.key].length} chore{groups[s.key].length!==1?"s":""}</span>
          </div>
          {groups[s.key].map(c=><ChorePill key={c.id} chore={c} area={areaById(c.areaId)} onToggle={onToggle} onEdit={onEditChore} onDelete={onDeleteChore}/>)}
        </div>
      ))}
    </div>
  );
}

// ─── ADD CHORE SHEET ──────────────────────────────────────────────────────────
function AddChoreSheet({ gardenId, onSave, onClose, editChore, onUpdate, onDelete }) {
  const isEdit = !!editChore;
  const [areaId, setAreaId] = useState(isEdit?editChore.areaId:"house");
  const [type,   setType]   = useState(isEdit?editChore.type:"Mow");
  const [due,    setDue]    = useState(isEdit?editChore.dueDate:TODAY);
  const [note,   setNote]   = useState(isEdit?editChore.note:"");
  const [recur,  setRecur]  = useState(isEdit?editChore.recur:"");
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState("");

  async function save() {
    setSaving(true); setErr("");
    if (isEdit) {
      const { data, error } = await sb.from("property_chores").update({
        area_id:areaId, chore_type:type, due_date:due,
        recurrence_days:recur?Number(recur):null, notes:note,
      }).eq("id",editChore.id).select().single();
      if (error) { setErr(error.message); setSaving(false); return; }
      onUpdate(mapChore(data)); onClose();
    } else {
      const { data, error } = await sb.from("property_chores").insert({
        garden_id:gardenId, area_id:areaId, chore_type:type, due_date:due,
        recurrence_days:recur?Number(recur):null, notes:note,
      }).select().single();
      if (error) { setErr(error.message); setSaving(false); return; }
      onSave(mapChore(data)); onClose();
    }
  }

  async function del() {
    if (!window.confirm("Delete this chore?")) return;
    await sb.from("property_chores").delete().eq("id",editChore.id);
    onDelete(editChore.id); onClose();
  }

  return (
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sheet" style={{background:"linear-gradient(180deg,#F5EDE0 0%,#EAE0CE 100%)"}}>
        <div className="sheet-handle"/><button className="sheet-close" onClick={onClose}>×</button>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <div style={{fontWeight:700,fontSize:20,color:"#2D1F0A"}}>{isEdit?"Edit chore":"Add property chore"}</div>
          {isEdit&&<button onClick={del} style={{background:"rgba(184,76,76,.1)",border:"none",borderRadius:8,padding:"6px 12px",color:"#B84C4C",fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:13}}>🗑️ Delete</button>}
        </div>
        {err&&<div className="err">{err}</div>}
        <div className="field">
          <label>Area</label>
          <select value={areaId} onChange={e=>setAreaId(e.target.value)} style={{borderColor:"rgba(122,92,58,.2)"}}>
            {PROP_AREAS.map(a=><option key={a.id} value={a.id}>{a.emoji} {a.label}</option>)}
          </select>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div className="field">
            <label>Chore type</label>
            <select value={type} onChange={e=>setType(e.target.value)} style={{borderColor:"rgba(122,92,58,.2)"}}>
              {PROP_CHORE_TYPES.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Due date</label>
            <input type="date" value={due} onChange={e=>setDue(e.target.value)} style={{borderColor:"rgba(122,92,58,.2)"}}/>
          </div>
        </div>
        <div className="field">
          <label>Repeats</label>
          <select value={recur} onChange={e=>setRecur(e.target.value)} style={{borderColor:"rgba(122,92,58,.2)"}}>
            {RECUR_OPTS.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
        </div>
        {recur&&<div style={{background:"rgba(122,92,58,.08)",border:"1.5px solid rgba(122,92,58,.2)",borderRadius:12,padding:"10px 14px",marginBottom:16,fontSize:13,color:"#7A5C3A",fontWeight:700}}>🔄 Next chore auto-schedules after completion</div>}
        <div className="field">
          <label>Notes</label>
          <textarea rows={2} value={note} onChange={e=>setNote(e.target.value)} placeholder="Any details…" style={{resize:"vertical",borderColor:"rgba(122,92,58,.2)"}}/>
        </div>
        <div style={{display:"flex",gap:10,marginTop:4}}>
          <button onClick={onClose} className="big-btn" style={{background:"rgba(0,0,0,.07)",color:"#8A7A5A",flex:1}}>Cancel</button>
          <button onClick={save} disabled={saving} className="big-btn big-btn-brown" style={{flex:2}}>
            {saving?<Spinner/>:isEdit?"Save changes":"Save chore"}
          </button>
      </div>
    </div>
  </div>
  </div>
  );
}


// ─── PROPERTY CALENDAR SCREEN ─────────────────────────────────────────────────
function PropertyCalendarScreen({ chores, onToggle }) {
  const now = new Date();
  const [yr, setYr] = useState(now.getFullYear());
  const [mo, setMo] = useState(now.getMonth());
  const [sel, setSel] = useState(null);
  const areaById = id => PROP_AREAS.find(a=>a.id===id);

  const choresByDate = useMemo(()=>{
    const m={};
    chores.forEach(c=>{if(!m[c.dueDate])m[c.dueDate]=[];m[c.dueDate].push(c);});
    return m;
  },[chores]);

  const first=new Date(yr,mo,1), startDow=first.getDay(), dim=new Date(yr,mo+1,0).getDate(), prevDim=new Date(yr,mo,0).getDate();
  const cells=[];
  for(let i=0;i<startDow;i++) cells.push({d:prevDim-startDow+1+i,cur:false});
  for(let i=1;i<=dim;i++) cells.push({d:i,cur:true});
  while(cells.length%7!==0) cells.push({d:cells.length-dim-startDow+1,cur:false});
  const cellKey=d=>`${yr}-${String(mo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const selKey=sel?cellKey(sel):null;
  const selChores=selKey?(choresByDate[selKey]||[]):[];

  return (
    <div className="fade-up prop-screen" style={{paddingTop:0}}>
      <div style={{fontSize:22,fontWeight:700,color:"#2D1F0A",marginBottom:20}}>Calendar</div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,padding:"0 0 0"}}>
        <button className="sm-btn sm-btn-brown-ghost" onClick={()=>{if(mo===0){setMo(11);setYr(y=>y-1);}else setMo(m=>m-1);setSel(null);}}>← Prev</button>
        <div style={{fontSize:18,fontWeight:700,color:"#2D1F0A"}}>{MONTHS[mo]} {yr}</div>
        <button className="sm-btn sm-btn-brown-ghost" onClick={()=>{if(mo===11){setMo(0);setYr(y=>y+1);}else setMo(m=>m+1);setSel(null);}}>Next →</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:4}}>
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=><div key={d} style={{textAlign:"center",fontSize:10,fontWeight:700,color:"#9A8A70",padding:"4px 0",letterSpacing:".05em"}}>{d}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:20}}>
        {cells.map((cell,i)=>{
          const key=cell.cur?cellKey(cell.d):null;
          const dcs=key?(choresByDate[key]||[]):[];
          const isTod=key===TODAY, isSel=cell.cur&&cell.d===sel;
          return (
            <div key={i} onClick={()=>cell.cur&&setSel(cell.d===sel?null:cell.d)}
              style={{minHeight:64,borderRadius:12,padding:"6px 5px",
                background:isSel?"rgba(255,255,255,.95)":isTod?"rgba(122,92,58,.12)":"rgba(255,250,242,.7)",
                border:isSel?"2px solid #7A5C3A":isTod?"2px solid #7A5C3A":"2px solid transparent",
                cursor:cell.cur?"pointer":"default",opacity:cell.cur?1:.3,transition:"all .15s"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#3B2A1A",marginBottom:3}}>{cell.d}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:2}}>
                {dcs.slice(0,5).map(c=><span key={c.id} style={{width:6,height:6,borderRadius:"50%",display:"inline-block",background:URG_COLOR[urgOf(c.dueDate,c.done)]}}/>)}
                {dcs.length>5&&<span style={{fontSize:8,color:"#9A8A70",fontWeight:700}}>+{dcs.length-5}</span>}
              </div>
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div style={{display:"flex",gap:14,marginBottom:20,flexWrap:"wrap"}}>
        {Object.entries(URG_COLOR).map(([k,c])=>(
          <div key={k} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:"#9A8A70"}}>
            <span style={{width:8,height:8,borderRadius:"50%",background:c,display:"inline-block"}}/>{URG_LABEL[k]}
          </div>
        ))}
      </div>
      {selKey&&(
        <div style={{background:"rgba(255,250,242,.9)",borderRadius:16,padding:"16px",border:"1.5px solid rgba(122,92,58,.2)"}}>
          <div style={{fontWeight:700,fontSize:15,color:"#2D1F0A",marginBottom:12}}>
            📅 {fmtDate(selKey)} <span style={{fontWeight:400,color:"#9A8A70",fontSize:13}}>— {selChores.length} chore{selChores.length!==1?"s":""}</span>
          </div>
          {selChores.length===0
            ?<div style={{color:"#9A8A70",fontSize:13,textAlign:"center",padding:"12px 0"}}>Nothing scheduled</div>
            :selChores.map(c=><ChorePill key={c.id} chore={c} area={areaById(c.areaId)} onToggle={onToggle} onEdit={onEditChore} onDelete={onDeleteChore}/>)
          }
        </div>
      )}
    </div>
  );
}

// ─── PROPERTY AREAS SCREEN ────────────────────────────────────────────────────
function PropertyAreasScreen({ chores, onToggle, onAddChore, onEditChore, onDeleteChore }) {
  const [openAreas, setOpenAreas] = useState({});
  const toggleArea = id => setOpenAreas(o=>({...o,[id]:!o[id]}));

  const choresByArea = useMemo(()=>{
    const m={};
    chores.forEach(c=>{ if(!m[c.areaId])m[c.areaId]=[]; m[c.areaId].push(c); });
    return m;
  },[chores]);

  // Include areas that have chores + all defined areas
  const activeAreas = PROP_AREAS.filter(a => (choresByArea[a.id]||[]).length > 0 || true);

  return (
    <div className="fade-up prop-screen" style={{paddingTop:0}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div style={{fontSize:13,color:"#9A8A70"}}>{PROP_AREAS.length} areas across the property</div>
        <button className="sm-btn sm-btn-brown" onClick={onAddChore}>+ Chore</button>
      </div>

      {activeAreas.map(area=>{
        const areaChores = (choresByArea[area.id]||[]);
        const active = areaChores.filter(c=>!c.done).sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate));
        const done   = areaChores.filter(c=>c.done);
        const overdue = active.filter(c=>urgOf(c.dueDate,false)==="overdue").length;
        const isOpen = openAreas[area.id] !== false; // default open

        return (
          <div key={area.id} style={{marginBottom:12}}>
            {/* Area header */}
            <button onClick={()=>toggleArea(area.id)}
              style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",
                padding:"14px 18px",borderRadius:14,background:area.light,border:`1.5px solid ${area.color}22`,
                cursor:"pointer",fontFamily:"inherit",marginBottom:isOpen&&areaChores.length>0?8:0,transition:"all .15s"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:22}}>{area.emoji}</span>
                <div style={{textAlign:"left"}}>
                  <div style={{fontWeight:700,fontSize:15,color:area.color}}>{area.label}</div>
                  <div style={{fontSize:11,color:"#9A8A70",marginTop:2}}>
                    {active.length} active task{active.length!==1?"s":""}
                    {overdue>0&&<span style={{color:"#B84C4C",fontWeight:700,marginLeft:6}}>· {overdue} overdue</span>}
                    {areaChores.length===0&&<span style={{color:"#C0B0A0"}}>— no chores yet</span>}
                  </div>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                {/* Mini progress bar */}
                {areaChores.length>0&&(
                  <div style={{width:48,height:5,borderRadius:99,background:"#E8D8C0",overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${areaChores.length===0?100:Math.round((done.length/areaChores.length)*100)}%`,background:area.color,borderRadius:99}}/>
                  </div>
                )}
                <span style={{fontSize:14,color:area.color}}>{isOpen?"▾":"▸"}</span>
              </div>
            </button>

            {isOpen&&areaChores.length>0&&(
              <div style={{paddingLeft:8}}>
                {/* Overdue */}
                {active.filter(c=>urgOf(c.dueDate,false)==="overdue").map(c=><ChorePill key={c.id} chore={c} area={area} onToggle={onToggle} onEdit={onEditChore} onDelete={onDeleteChore}/>)}
                {/* Today */}
                {active.filter(c=>urgOf(c.dueDate,false)==="today").map(c=><ChorePill key={c.id} chore={c} area={area} onToggle={onToggle} onEdit={onEditChore} onDelete={onDeleteChore}/>)}
                {/* This week */}
                {active.filter(c=>urgOf(c.dueDate,false)==="week").map(c=><ChorePill key={c.id} chore={c} area={area} onToggle={onToggle} onEdit={onEditChore} onDelete={onDeleteChore}/>)}
                {/* Upcoming */}
                {active.filter(c=>urgOf(c.dueDate,false)==="upcoming").map(c=><ChorePill key={c.id} chore={c} area={area} onToggle={onToggle} onEdit={onEditChore} onDelete={onDeleteChore}/>)}
                {/* Done (dimmed) */}
                {done.slice(0,3).map(c=><ChorePill key={c.id} chore={c} area={area} onToggle={onToggle} onEdit={onEditChore} onDelete={onDeleteChore}/>)}
                {done.length>3&&<div style={{fontSize:12,color:"#9A8A70",padding:"4px 16px"}}>+ {done.length-3} more completed</div>}
              </div>
            )}

            {isOpen&&areaChores.length===0&&(
              <div style={{padding:"12px 18px",fontSize:13,color:"#9A8A70",fontStyle:"italic"}}>
                No chores added yet — <button onClick={onAddChore} style={{background:"none",border:"none",color:area.color,fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:13}}>add one</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
  );
}


// ─── Map project task rows ────────────────────────────────────────────────────
function mapProject(r) {
  return {
    id:r.id, memberId:r.member_id, gardenId:r.garden_id,
    title:r.title, notes:r.notes||"", priority:r.priority||"Medium",
    dueDate:r.due_date, done:!!r.completed_at,
    doneAt:r.completed_at?r.completed_at.slice(0,10):null,
    createdAt:r.created_at,
  };
}

// ─── PROJECT TASK PILL ────────────────────────────────────────────────────────
function ProjectPill({ task, member, onToggle, onEdit, onDelete }) {
  const urg = task.dueDate ? urgOf(task.dueDate, task.done) : "upcoming";
  const pc = PROJ_PRIORITY_COLOR[task.priority]||"#8FAD8F";
  return (
    <div className={`proj-pill ${task.done?"done":""}`} style={{borderColor:member.color+"22"}}>
      <button className="chk-proj" onClick={()=>onToggle(task.id)}
        style={{borderColor:task.done?member.color:"#C5C0D0", background:task.done?member.color:"transparent"}}>
        {task.done&&<svg width="12" height="12" viewBox="0 0 12 12"><path d="M2.5 7l3 3 5-5.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
      </button>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontWeight:700,fontSize:14,color:"#1A1A2E",marginBottom:4,textDecoration:task.done?"line-through":"none"}}>{task.title}</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          <span className="proj-priority" style={{background:pc+"18",color:pc,border:`1.5px solid ${pc}33`}}>{task.priority}</span>
          {task.dueDate&&<span style={{fontSize:11,color:URG_COLOR[urg]||"#8FAD8F",fontWeight:700}}>{fmtDate(task.dueDate)}</span>}
          {task.notes&&<span style={{fontSize:11,color:"#9090A0",fontStyle:"italic"}}>— {task.notes}</span>}
        </div>
      </div>
      <div style={{display:"flex",gap:2,flexShrink:0}}>
        <button onClick={()=>onEdit(task)} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,padding:"4px",color:"#B0B0C0"}} onMouseEnter={e=>e.target.style.color=member.color} onMouseLeave={e=>e.target.style.color="#B0B0C0"}>✏️</button>
        <button onClick={()=>onDelete(task.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,padding:"4px",color:"#B0B0C0"}} onMouseEnter={e=>e.target.style.color="#B84C4C"} onMouseLeave={e=>e.target.style.color="#B0B0C0"}>🗑️</button>
      </div>
    </div>
  );
}

// ─── PERSONAL PROJECTS HOME ───────────────────────────────────────────────────
function PersonalProjectsScreen({ projects, gardenId, onToggle, onAdd, onEdit, onDelete }) {
  const [openMembers, setOpenMembers] = useState({ange:true,jake:true,ben:true});
  const [filter, setFilter] = useState("active"); // active | all | done

  const byMember = memberId => projects
    .filter(p => p.memberId===memberId && (filter==="all"?true:filter==="done"?p.done:!p.done))
    .sort((a,b)=>{
      const po={Urgent:0,High:1,Medium:2,Low:3};
      if(a.done!==b.done) return a.done?1:-1;
      return (po[a.priority]??2)-(po[b.priority]??2);
    });

  const toggle = id => setOpenMembers(o=>({...o,[id]:!o[id]}));

  return (
    <div className="fade-up" style={{paddingTop:0}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div style={{fontSize:13,color:"#9090A0"}}>{projects.filter(p=>!p.done).length} active tasks</div>
        <div style={{display:"flex",gap:6}}>
          {["active","all","done"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              style={{padding:"6px 12px",borderRadius:20,fontFamily:"inherit",fontSize:12,fontWeight:700,border:"none",cursor:"pointer",
                background:filter===f?"#6B4FA0":"rgba(0,0,0,.06)",color:filter===f?"#fff":"#6B6B8A",transition:"all .15s",textTransform:"capitalize"}}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {PROJ_MEMBERS.map(member=>{
        const tasks = byMember(member.id);
        const allTasks = projects.filter(p=>p.memberId===member.id);
        const done = allTasks.filter(p=>p.done).length;
        const pct = allTasks.length===0?100:Math.round((done/allTasks.length)*100);
        const isOpen = openMembers[member.id]!==false;

        return (
          <div key={member.id} style={{marginBottom:16}}>
            {/* Member header */}
            <button onClick={()=>toggle(member.id)}
              style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",
                padding:"14px 18px",borderRadius:16,background:member.light,
                border:`1.5px solid ${member.color}22`,cursor:"pointer",fontFamily:"inherit",marginBottom:isOpen?8:0}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <Ring pct={pct} size={44} sw={4} color={member.color} bg={member.accent+"44"}>
                  <text x="50%" y="50%" textAnchor="middle" dy=".35em" fontSize="15" fontFamily="sans-serif">{member.emoji}</text>
                </Ring>
                <div style={{textAlign:"left"}}>
                  <div style={{fontWeight:700,fontSize:15,color:member.color}}>{member.label}</div>
                  <div style={{fontSize:11,color:"#9090A0",marginTop:2}}>
                    {allTasks.filter(p=>!p.done).length} active · {done} done
                  </div>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <button onClick={e=>{e.stopPropagation();onAdd(member.id);}}
                  style={{background:member.color,border:"none",borderRadius:8,padding:"5px 12px",color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
                  + Task
                </button>
                <span style={{fontSize:14,color:member.color}}>{isOpen?"▾":"▸"}</span>
              </div>
            </button>

            {isOpen&&(
              <div>
                {tasks.length===0?(
                  <div style={{padding:"16px 18px",fontSize:13,color:"#9090A0",fontStyle:"italic"}}>
                    {filter==="done"?"Nothing completed yet":"All done! 🎉 or add a task above"}
                  </div>
                ):tasks.map(t=>(
                  <ProjectPill key={t.id} task={t} member={member} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete}/>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── ADD/EDIT PROJECT TASK SHEET ──────────────────────────────────────────────
function AddProjectSheet({ gardenId, defaultMemberId, onSave, onClose, editTask, onUpdate, onDelete }) {
  const isEdit = !!editTask;
  const [memberId,  setMemberId]  = useState(isEdit?editTask.memberId:(defaultMemberId||"ange"));
  const [title,     setTitle]     = useState(isEdit?editTask.title:"");
  const [notes,     setNotes]     = useState(isEdit?editTask.notes:"");
  const [priority,  setPriority]  = useState(isEdit?editTask.priority:"Medium");
  const [dueDate,   setDueDate]   = useState(isEdit?editTask.dueDate:"");
  const [saving,    setSaving]    = useState(false);
  const [err,       setErr]       = useState("");

  const member = PROJ_MEMBERS.find(m=>m.id===memberId)||PROJ_MEMBERS[0];

  async function save() {
    if(!title.trim()) return;
    setSaving(true); setErr("");
    const payload = { member_id:memberId, garden_id:gardenId, title:title.trim(), notes, priority, due_date:dueDate||null };
    if (isEdit) {
      const { data, error } = await sb.from("personal_projects").update(payload).eq("id",editTask.id).select().single();
      if (error) { setErr(error.message); setSaving(false); return; }
      onUpdate(mapProject(data)); onClose();
    } else {
      const { data, error } = await sb.from("personal_projects").insert(payload).select().single();
      if (error) { setErr(error.message); setSaving(false); return; }
      onSave(mapProject(data)); onClose();
    }
  }

  async function del() {
    if (!window.confirm("Delete this task?")) return;
    await sb.from("personal_projects").delete().eq("id",editTask.id);
    onDelete(editTask.id); onClose();
  }

  return (
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sheet" style={{background:`linear-gradient(180deg,${member.light.replace(".08","0.15")} 0%,#F8F5FF 100%)`}}>
        <div className="sheet-handle"/><button className="sheet-close" onClick={onClose}>×</button>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <div style={{fontWeight:700,fontSize:20,color:"#1A1A2E"}}>{isEdit?"Edit task":"Add task"}</div>
          {isEdit&&<button onClick={del} style={{background:"rgba(184,76,76,.1)",border:"none",borderRadius:8,padding:"6px 12px",color:"#B84C4C",fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:13}}>🗑️ Delete</button>}
        </div>
        {err&&<div className="err">{err}</div>}

        <div className="field">
          <label>Whose project?</label>
          <div style={{display:"flex",gap:8}}>
            {PROJ_MEMBERS.map(m=>(
              <button key={m.id} onClick={()=>setMemberId(m.id)}
                style={{flex:1,padding:"10px 8px",borderRadius:10,fontFamily:"inherit",fontSize:13,fontWeight:700,border:`2px solid ${memberId===m.id?m.color:"#E0E0E8"}`,
                  background:memberId===m.id?m.light:"transparent",color:memberId===m.id?m.color:"#9090A0",cursor:"pointer",transition:"all .15s"}}>
                {m.emoji} {m.id.charAt(0).toUpperCase()+m.id.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label>Task title</label>
          <input type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder="What needs doing?" autoFocus
            style={{borderColor:`${member.color}44`}}/>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div className="field">
            <label>Priority</label>
            <select value={priority} onChange={e=>setPriority(e.target.value)} style={{borderColor:`${member.color}44`}}>
              {PROJ_PRIORITY.map(p=><option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Due date <span style={{fontWeight:400,color:"#9090A0"}}>(optional)</span></label>
            <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} style={{borderColor:`${member.color}44`}}/>
          </div>
        </div>

        <div className="field">
          <label>Notes <span style={{fontWeight:400,color:"#9090A0"}}>(optional)</span></label>
          <textarea rows={2} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Any details…"
            style={{resize:"vertical",borderColor:`${member.color}44`}}/>
        </div>

        <div style={{display:"flex",gap:10,marginTop:4}}>
          <button onClick={onClose} className="big-btn" style={{background:"rgba(0,0,0,.07)",color:"#6B6B8A",flex:1}}>Cancel</button>
          <button onClick={save} disabled={!title.trim()||saving} className="big-btn"
            style={{flex:2,background:member.color,color:"#fff",opacity:title.trim()?1:.45}}>
            {saving?<Spinner/>:isEdit?"Save changes":"Add task"}
          </button>
      </div>
    </div>
  </div>
  </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [authUser,  setAuthUser]  = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [garden,    setGarden]    = useState(null);
  const [members,   setMembers]   = useState([]);
  const [dispName,  setDispName]  = useState("");
  const [plants,    setPlants]    = useState([]);
  const [tasks,     setTasks]     = useState([]);
  const [chores,    setChores]    = useState([]);
  const [projects,  setProjects]  = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [screen,    setScreen]    = useState("home");
  const [modal,     setModal]     = useState(null);
  const [taskCtx,   setTaskCtx]   = useState(null);
  const [editTask,  setEditTask]  = useState(null);
  const [editChore, setEditChore] = useState(null);

  // ── Auth listener ──
  useEffect(()=>{
    sb.auth.getSession().then(({data:{session}})=>{
      setAuthUser(session?.user||null);
      setAuthReady(true);
    });
    const {data:{subscription}} = sb.auth.onAuthStateChange((_,session)=>{
      setAuthUser(session?.user||null);
    });
    return ()=>subscription.unsubscribe();
  },[]);

  useEffect(()=>{
    if (!authUser) { setGarden(null); setPlants([]); setTasks([]); setChores([]); return; }
    loadGarden();
  },[authUser]);

  async function loadGarden() {
    setLoading(true);
    const { data: mem } = await sb.from("garden_members").select("*, gardens(*)").eq("user_id", authUser.id).single();
    if (!mem) { setLoading(false); return; }
    const g = mem.gardens;
    setGarden(g);
    setDispName(mem.display_name||authUser.email?.split("@")[0]||"");
    const { data: allMembers } = await sb.from("garden_members").select("*").eq("garden_id", g.id);
    setMembers(allMembers||[]);
    const { data: plantsData } = await sb.from("plants").select("*").eq("garden_id", g.id);
    setPlants((plantsData||[]).map(mapPlant));
    const { data: tasksData } = await sb.from("tasks").select("*").eq("garden_id", g.id);
    setTasks((tasksData||[]).map(mapTask));
    // Load property chores
    const { data: choresData } = await sb.from("property_chores").select("*").eq("garden_id", g.id);
    setChores((choresData||[]).map(mapChore));
    const { data: projData } = await sb.from("personal_projects").select("*").eq("garden_id", g.id);
    setProjects((projData||[]).map(mapProject));
    setLoading(false);
  }

  async function toggleDone(taskId) {
    const task = tasks.find(t=>t.id===taskId);
    if (!task) return;
    if (task.done) {
      const { error } = await sb.from("tasks").update({ completed_at:null, completed_by:null, completed_by_name:null }).eq("id",taskId);
      if (!error) setTasks(ts=>ts.map(t=>t.id===taskId?{...t,done:false,doneBy:null,doneAt:null}:t));
    } else {
      const { error } = await sb.from("tasks").update({ completed_at:new Date().toISOString(), completed_by:authUser.id, completed_by_name:dispName }).eq("id",taskId);
      if (!error) {
        setTasks(ts=>ts.map(t=>t.id===taskId?{...t,done:true,doneBy:dispName,doneAt:TODAY}:t));
        if (task.recur) {
          const nextDate = addDays(task.dueDate, Number(task.recur));
          const { data: next } = await sb.from("tasks").insert({
            plant_id:task.plantId, garden_id:task.gardenId||garden.id,
            task_type:task.type, due_date:nextDate,
            recurrence_months:Math.round(Number(task.recur)/30), notes:task.note,
          }).select().single();
          if (next) setTasks(ts=>[...ts, mapTask(next)]);
        }
      }
    }
  }

  async function toggleChoreDone(choreId) {
    const chore = chores.find(c=>c.id===choreId);
    if (!chore) return;
    if (chore.done) {
      const { error } = await sb.from("property_chores").update({ completed_at:null, completed_by:null, completed_by_name:null }).eq("id",choreId);
      if (!error) setChores(cs=>cs.map(c=>c.id===choreId?{...c,done:false,doneBy:null,doneAt:null}:c));
    } else {
      const { error } = await sb.from("property_chores").update({ completed_at:new Date().toISOString(), completed_by:authUser.id, completed_by_name:dispName }).eq("id",choreId);
      if (!error) {
        setChores(cs=>cs.map(c=>c.id===choreId?{...c,done:true,doneBy:dispName,doneAt:TODAY}:c));
        if (chore.recur) {
          const nextDate = addDays(chore.dueDate, Number(chore.recur));
          const { data: next } = await sb.from("property_chores").insert({
            area_id:chore.areaId, garden_id:chore.gardenId||garden.id,
            chore_type:chore.type, due_date:nextDate,
            recurrence_days:Number(chore.recur), notes:chore.note,
          }).select().single();
          if (next) setChores(cs=>[...cs, mapChore(next)]);
        }
      }
    }
  }

  function openAddTask(plantId=null) { setEditTask(null); setTaskCtx(plantId); setModal("task"); }
  function openEditTask(task) { setEditTask(task); setModal("task"); }
  function openEditChore(chore) { setEditChore(chore); setModal("chore"); }

  function updateTask(updated) { setTasks(ts=>ts.map(t=>t.id===updated.id?updated:t)); }
  function deleteTask(id)      { setTasks(ts=>ts.filter(t=>t.id!==id)); }
  function updateChore(updated){ setChores(cs=>cs.map(c=>c.id===updated.id?updated:c)); }
  function deleteChore(id)     { setChores(cs=>cs.filter(c=>c.id!==id)); }

  // Project handlers
  const [editProject,  setEditProject]  = useState(null);
  const [projMemberCtx, setProjMemberCtx] = useState("ange");
  function openAddProject(memberId="ange") { setEditProject(null); setProjMemberCtx(memberId); setModal("project"); }
  function openEditProject(task) { setEditProject(task); setModal("project"); }
  async function toggleProjectDone(taskId) {
    const task = projects.find(p=>p.id===taskId);
    if (!task) return;
    if (task.done) {
      await sb.from("personal_projects").update({completed_at:null}).eq("id",taskId);
      setProjects(ps=>ps.map(p=>p.id===taskId?{...p,done:false,doneAt:null}:p));
    } else {
      await sb.from("personal_projects").update({completed_at:new Date().toISOString()}).eq("id",taskId);
      setProjects(ps=>ps.map(p=>p.id===taskId?{...p,done:true,doneAt:TODAY}:p));
    }
  }
  function updateProject(updated) { setProjects(ps=>ps.map(p=>p.id===updated.id?updated:p)); }
  function deleteProject(id)      { setProjects(ps=>ps.filter(p=>p.id!==id)); }

  async function signOut() { await sb.auth.signOut(); setGarden(null); setPlants([]); setTasks([]); setChores([]); }

  const overdueGarden   = tasks.filter(t=>!t.done&&urgOf(t.dueDate,false)==="overdue").length;
  const overdueProperty = chores.filter(c=>!c.done&&urgOf(c.dueDate,false)==="overdue").length;

  const GARDEN_NAV = [
    {id:"home",     icon:"🌿", label:"Home"},
    {id:"upcoming", icon:"📋", label:"Tasks"},
    {id:"calendar", icon:"📅", label:"Calendar"},
    {id:"plants",   icon:"🌳", label:"Plants"},
  ];
  const PROP_NAV = [
    {id:"prop-home",    icon:"🏡", label:"Home"},
    {id:"prop-tasks",   icon:"📋", label:"Tasks"},
    {id:"prop-calendar",icon:"📅", label:"Calendar"},
    {id:"prop-areas",   icon:"📍", label:"Areas"},
  ];

  const isPropScreen = screen.startsWith("prop-");

  if (!authReady) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}><Spinner size={36}/></div>;
  if (!authUser)  return <><style>{CSS}</style><AuthScreen onAuth={setAuthUser}/></>;
  if (loading)    return <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}><Spinner size={36}/></div>;
  if (!garden)    return <><style>{CSS}</style><GardenSetup user={authUser} onJoined={(g,dn)=>{setGarden(g);setDispName(dn);loadGarden();}}/></>;

  return (
    <div className="shell">
      <style>{CSS}</style>

      {/* ── Sidebar ── */}
      <nav className="sidebar">
        <div className="sidebar-logo">
          <div style={{fontSize:28,marginBottom:6}}>🌿</div>
          <div style={{fontSize:16,fontWeight:700,color:"#fff",lineHeight:1}}>Dopamine Farm</div>
          <div style={{fontSize:11,color:"#7DBE9A",marginTop:3}}>{dispName}</div>
        </div>

        {/* Garden section */}
        <div style={{padding:"6px 20px 4px",fontSize:10,fontWeight:700,color:"rgba(255,255,255,.35)",letterSpacing:".1em",textTransform:"uppercase"}}>🌿 Garden</div>
        {GARDEN_NAV.map(n=>(
          <button key={n.id} className={`nav-btn ${screen===n.id?"active":""}`} onClick={()=>setScreen(n.id)}>
            <span className="nav-icon">{n.icon}</span>
            <span className="nav-label">
              {n.label}
              {n.id==="upcoming"&&overdueGarden>0&&<span style={{marginLeft:6,fontSize:10,background:"#B84C4C",color:"#fff",padding:"1px 6px",borderRadius:20,fontWeight:700}}>{overdueGarden}</span>}
            </span>
          </button>
        ))}

        {/* Property section */}
        <hr style={{margin:"14px 20px",border:"none",borderTop:"1px solid rgba(255,255,255,.1)"}}/>
        <div style={{padding:"2px 20px 4px",fontSize:10,fontWeight:700,color:"rgba(255,255,255,.35)",letterSpacing:".1em",textTransform:"uppercase"}}>🏡 Property</div>
        {PROP_NAV.map(n=>(
          <button key={n.id} className={`nav-btn ${screen===n.id?"prop-active":""}`} onClick={()=>setScreen(n.id)}>
            <span className="nav-icon">{n.icon}</span>
            <span className="nav-label" style={{color:screen===n.id?"#D4A574":"#C4A882"}}>
              {n.label}
              {n.id==="prop-tasks"&&overdueProperty>0&&<span style={{marginLeft:6,fontSize:10,background:"#B84C4C",color:"#fff",padding:"1px 6px",borderRadius:20,fontWeight:700}}>{overdueProperty}</span>}
            </span>
          </button>
        ))}

        {/* Personal Projects section */}
        <hr style={{margin:"14px 20px",border:"none",borderTop:"1px solid rgba(255,255,255,.1)"}}/>
        <div style={{padding:"2px 20px 4px",fontSize:10,fontWeight:700,color:"rgba(255,255,255,.35)",letterSpacing:".1em",textTransform:"uppercase"}}>✨ Personal</div>
        <button className={`nav-btn ${screen==="projects"?"active":""}`} onClick={()=>setScreen("projects")}>
          <span className="nav-icon">✨</span>
          <span className="nav-label" style={{color:screen==="projects"?"#D4A8C8":"#C4A0B8"}}>Personal Projects</span>
        </button>

        {/* Settings & sign out */}
        <hr style={{margin:"14px 20px",border:"none",borderTop:"1px solid rgba(255,255,255,.1)"}}/>
        <div style={{padding:"2px 20px 4px",fontSize:10,fontWeight:700,color:"rgba(255,255,255,.35)",letterSpacing:".1em",textTransform:"uppercase"}}>⚙️ Account</div>
        <button className={`nav-btn ${screen==="settings"?"active":""}`} onClick={()=>setScreen("settings")}>
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">Settings</span>
        </button>
        <div style={{marginTop:"auto",padding:"16px 20px 0",borderTop:"1px solid rgba(255,255,255,.1)"}}>
          <button onClick={signOut} style={{background:"rgba(255,255,255,.08)",border:"none",borderRadius:8,padding:"8px 12px",color:"#9DC4AF",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",width:"100%",textAlign:"left"}}>
            Sign out
          </button>
        </div>
      </nav>

      {/* ── Main content ── */}
      <div className="screen" style={isPropScreen?{background:"linear-gradient(160deg,#EDE5D8 0%,#F5EDE0 50%,#EAE0CE 100%)"}:{}}>
          {screen==="home"       && <HomeScreen         plants={plants} tasks={tasks} dispName={dispName} onToggle={toggleDone} onAddTask={openAddTask} onEditTask={openEditTask} onDeleteTask={deleteTask}/>}
          {screen==="upcoming"   && <UpcomingScreen     plants={plants} tasks={tasks} onToggle={toggleDone} onEditTask={openEditTask} onDeleteTask={deleteTask}/>}
          {screen==="calendar"   && <CalendarScreen     plants={plants} tasks={tasks} onToggle={toggleDone}/>}
          {screen==="plants"     && <PlantsScreen       plants={plants} tasks={tasks} onAddPlant={()=>setModal("plant")} onAddTask={openAddTask} onEditTask={openEditTask} onDeleteTask={deleteTask}/>}
          {screen==="settings"   && <SettingsScreen     user={authUser} garden={garden} members={members} dispName={dispName} onSignOut={signOut}/>}
          {screen==="projects"   && <PersonalProjectsScreen projects={projects} gardenId={garden.id} onToggle={toggleProjectDone} onAdd={openAddProject} onEdit={openEditProject} onDelete={deleteProject}/>}
          {screen==="prop-home"    && <PropertyHomeScreen    chores={chores} dispName={dispName} gardenId={garden.id} onToggle={toggleChoreDone} onAddChore={()=>setModal("chore")} onEditChore={openEditChore} onDeleteChore={deleteChore}/>}
          {screen==="prop-tasks"   && <PropertyChoresScreen  chores={chores} onToggle={toggleChoreDone} onAddChore={()=>setModal("chore")} onEditChore={openEditChore} onDeleteChore={deleteChore}/>}
          {screen==="prop-calendar"&& <PropertyCalendarScreen chores={chores} onToggle={toggleChoreDone}/>}
          {screen==="prop-areas"   && <PropertyAreasScreen   chores={chores} onToggle={toggleChoreDone} onAddChore={()=>setModal("chore")} onEditChore={openEditChore} onDeleteChore={deleteChore}/>}
        </div>

      {modal==="task"  && <AddTaskSheet  plants={plants} defaultPlantId={taskCtx} gardenId={garden.id} onSave={t=>setTasks(ts=>[...ts,t])} onClose={()=>{setModal(null);setEditTask(null);}} editTask={editTask} onUpdate={updateTask} onDelete={deleteTask}/>}
      {modal==="plant" && <AddPlantSheet gardenId={garden.id} onSave={p=>setPlants(ps=>[...ps,p])} onClose={()=>setModal(null)}/>}
      {modal==="chore"   && <AddChoreSheet gardenId={garden.id} onSave={c=>setChores(cs=>[...cs,c])} onClose={()=>{setModal(null);setEditChore(null);}} editChore={editChore} onUpdate={updateChore} onDelete={deleteChore}/>}
      {modal==="project" && <AddProjectSheet gardenId={garden.id} defaultMemberId={projMemberCtx} onSave={p=>setProjects(ps=>[...ps,p])} onClose={()=>{setModal(null);setEditProject(null);}} editTask={editProject} onUpdate={updateProject} onDelete={deleteProject}/>}


    </div>
  );
}
