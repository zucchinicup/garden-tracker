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
  .shell      { display:flex; flex-direction:column; min-height:100vh; max-width:480px; margin:0 auto; position:relative; }
  .screen     { flex:1; padding:0 0 90px; overflow-y:auto; }
  .bottom-nav { position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:480px; background:rgba(255,255,255,.88); backdrop-filter:blur(16px); border-top:1px solid rgba(0,0,0,.06); display:flex; z-index:50; }
  .nav-btn    { flex:1; display:flex; flex-direction:column; align-items:center; gap:3px; padding:10px 0 14px; background:none; border:none; cursor:pointer; font-family:inherit; transition:all .2s; }
  .nav-icon   { font-size:22px; line-height:1; }
  .nav-label  { font-size:10px; font-weight:700; letter-spacing:.05em; color:#8FAD8F; transition:color .2s; }
  .nav-btn.active .nav-label { color:#3A7D5A; }
  .nav-btn.active .nav-icon  { transform:translateY(-2px); }
  .px { padding-left:22px; padding-right:22px; }
  .hero       { padding:32px 22px 24px; text-align:center; }
  .hero-date  { font-size:12px; color:#8FAD8F; letter-spacing:.08em; text-transform:uppercase; font-weight:700; margin-bottom:6px; }
  .hero-title { font-size:26px; font-weight:700; color:#1E3A1E; line-height:1.2; }
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
  .overlay    { position:fixed; inset:0; background:rgba(30,58,30,.35); z-index:80; display:flex; align-items:flex-end; justify-content:center; }
  .sheet      { background:linear-gradient(180deg,#F0EDE5 0%,#EAE6DC 100%); border-radius:24px 24px 0 0; padding:24px 22px 40px; width:100%; max-width:480px; max-height:88vh; overflow-y:auto; }
  .sheet-handle { width:36px; height:4px; border-radius:2px; background:#C5C0B5; margin:0 auto 20px; }
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

function TaskPill({ task, plant, onToggle }) {
  const urg = urgOf(task.dueDate, task.done);
  const cls = urg==="overdue"?"urgent":urg==="today"?"warn":"";
  return (
    <div className={`task-pill ${task.done?"done":""} ${cls}`}>
      <ChkCircle on={task.done} toggle={()=>onToggle(task.id)} />
      <div style={{flex:1,minWidth:0}}>
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
      options:{ redirectTo: window.location.href }
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
function HomeScreen({ plants, tasks, dispName, onToggle, onAddTask }) {
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
      <div className="orb-wrap">
        <div className="breathe">
          <Ring pct={pct} size={140} sw={10} color={orbColor} bg="#D9E8D9">
            <text x="50%" y="46%" textAnchor="middle" fontSize="28" fontWeight="700" fill={orbColor} fontFamily="Atkinson Hyperlegible,sans-serif">{pct}%</text>
            <text x="50%" y="62%" textAnchor="middle" fontSize="11" fill="#8FAD8F" fontFamily="Atkinson Hyperlegible,sans-serif">today</text>
          </Ring>
        </div>
        <div className="orb-caption">{orbMsg}</div>
      </div>

      <div className="cat-rings" style={{marginBottom:20}}>
        {catStats.map(cat=>(
          <div key={cat.id} className="cat-ring-item" onClick={()=>setSelCat(selCat===cat.id?null:cat.id)}>
            <Ring pct={cat.pct} size={52} sw={4} color={cat.color} bg={selCat===cat.id?cat.light:"#E2DDD5"}>
              <text x="50%" y="50%" textAnchor="middle" dy=".35em" fontSize="16" fontFamily="sans-serif">{cat.emoji}</text>
            </Ring>
            <div className="cat-ring-label" style={{color:selCat===cat.id?cat.color:"#8FAD8F"}}>{cat.label.split(" ")[0]}</div>
          </div>
        ))}
      </div>

      <div className="px">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <div className="sec-label">{selCat?CATS.find(c=>c.id===selCat)?.label:"Daily summary"}</div>
          <button className="sm-btn sm-btn-green" style={{fontSize:12,padding:"6px 12px"}} onClick={()=>onAddTask()}>+ Task</button>
        </div>

        {taskGroups.overdue.length===0&&taskGroups.today.length===0&&taskGroups.doneToday.length===0 ? (
          <div className="empty">
            <div className="empty-icon">🌿</div>
            <div className="empty-msg">All caught up!</div>
            <div className="empty-sub">Nothing urgent right now</div>
          </div>
        ) : (<>
          {taskGroups.overdue.length>0 && (
            <div style={{marginBottom:22}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,padding:"10px 14px",borderRadius:12,background:"rgba(184,76,76,.1)",border:"1.5px solid rgba(184,76,76,.22)"}}>
                <span style={{fontSize:18}}>🚨</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:13,color:"#8B2E2E"}}>Overdue</div>
                  <div style={{fontSize:11,color:"#B84C4C",marginTop:1}}>{taskGroups.overdue.length} task{taskGroups.overdue.length!==1?"s":""} past due — do these first</div>
                </div>
                <div style={{fontWeight:700,fontSize:18,color:"#B84C4C"}}>{taskGroups.overdue.length}</div>
              </div>
              {taskGroups.overdue.map(t=><TaskPill key={t.id} task={t} plant={plantById(t.plantId)} onToggle={onToggle}/>)}
            </div>
          )}
          {taskGroups.today.length>0 && (
            <div style={{marginBottom:22}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,padding:"10px 14px",borderRadius:12,background:"rgba(176,123,42,.1)",border:"1.5px solid rgba(176,123,42,.22)"}}>
                <span style={{fontSize:18}}>📍</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:13,color:"#7A5010"}}>Today</div>
                  <div style={{fontSize:11,color:"#B07B2A",marginTop:1}}>{taskGroups.today.length} task{taskGroups.today.length!==1?"s":""} due today</div>
                </div>
                <div style={{fontWeight:700,fontSize:18,color:"#B07B2A"}}>{taskGroups.today.length}</div>
              </div>
              {taskGroups.today.map(t=><TaskPill key={t.id} task={t} plant={plantById(t.plantId)} onToggle={onToggle}/>)}
            </div>
          )}
          {taskGroups.doneToday.length>0 && (
            <div style={{marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,padding:"10px 14px",borderRadius:12,background:"rgba(58,125,90,.08)",border:"1.5px solid rgba(58,125,90,.18)"}}>
                <span style={{fontSize:18}}>✅</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:13,color:"#1E5C38"}}>Done today</div>
                  <div style={{fontSize:11,color:"#3A7D5A",marginTop:1}}>{taskGroups.doneToday.length} completed — great work!</div>
                </div>
                <div style={{fontWeight:700,fontSize:18,color:"#3A7D5A"}}>{taskGroups.doneToday.length}</div>
              </div>
              {taskGroups.doneToday.map(t=><TaskPill key={t.id} task={t} plant={plantById(t.plantId)} onToggle={onToggle}/>)}
            </div>
          )}
        </>)}
      </div>
    </div>
  );
}

// ─── UPCOMING SCREEN ──────────────────────────────────────────────────────────
function UpcomingScreen({ plants, tasks, onToggle }) {
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
    <div className="fade-up" style={{padding:"24px 0 0"}}>
      <div className="px" style={{marginBottom:20}}>
        <div style={{fontSize:22,fontWeight:700,color:"#1E3A1E",marginBottom:4}}>Upcoming tasks</div>
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
    <div className="fade-up" style={{padding:"24px 0 0"}}>
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
    <div className="fade-up" style={{padding:"24px 0 0"}}>
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
function AddTaskSheet({ plants, defaultPlantId, gardenId, onSave, onClose }) {
  const [plantId,setPlantId]=useState(defaultPlantId?String(defaultPlantId):"");
  const [type,setType]=useState("Harvest");
  const [due,setDue]=useState(TODAY);
  const [note,setNote]=useState("");
  const [recur,setRecur]=useState("");
  const [saving,setSaving]=useState(false);
  const [err,setErr]=useState("");

  async function save() {
    if(!plantId) return;
    setSaving(true); setErr("");
    const recurMonths = recur ? Math.round(Number(recur)/30) : null;
    const { data, error } = await sb.from("tasks").insert({
      plant_id: plantId, garden_id: gardenId,
      task_type: type, due_date: due,
      recurrence_months: recurMonths, notes: note,
    }).select().single();
    if (error) { setErr(error.message); setSaving(false); return; }
    onSave(mapTask(data));
    onClose();
  }

  return (
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sheet">
        <div className="sheet-handle"/>
        <div style={{fontWeight:700,fontSize:20,color:"#1E3A1E",marginBottom:20}}>Add task</div>
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
            {saving?<Spinner/>:"Save task"}
          </button>
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
        <div className="sheet-handle"/>
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
  const [loading,   setLoading]   = useState(false);
  const [screen,    setScreen]    = useState("home");
  const [modal,     setModal]     = useState(null);
  const [taskCtx,   setTaskCtx]   = useState(null);

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

  // ── Load garden when user logs in ──
  useEffect(()=>{
    if (!authUser) { setGarden(null); setPlants([]); setTasks([]); return; }
    loadGarden();
  },[authUser]);

  async function loadGarden() {
    setLoading(true);
    // Find membership
    const { data: mem } = await sb.from("garden_members").select("*, gardens(*)").eq("user_id", authUser.id).single();
    if (!mem) { setLoading(false); return; } // no garden yet — show setup
    const g = mem.gardens;
    setGarden(g);
    setDispName(mem.display_name||authUser.email?.split("@")[0]||"");

    // Load all members
    const { data: allMembers } = await sb.from("garden_members").select("*").eq("garden_id", g.id);
    setMembers(allMembers||[]);

    // Load plants
    const { data: plantsData } = await sb.from("plants").select("*").eq("garden_id", g.id);
    setPlants((plantsData||[]).map(mapPlant));

    // Load tasks
    const { data: tasksData } = await sb.from("tasks").select("*").eq("garden_id", g.id);
    setTasks((tasksData||[]).map(mapTask));

    setLoading(false);
  }

  async function toggleDone(taskId) {
    const task = tasks.find(t=>t.id===taskId);
    if (!task) return;

    if (task.done) {
      // Uncomplete
      const { error } = await sb.from("tasks").update({ completed_at:null, completed_by:null, completed_by_name:null }).eq("id",taskId);
      if (!error) setTasks(ts=>ts.map(t=>t.id===taskId?{...t,done:false,doneBy:null,doneAt:null}:t));
    } else {
      // Complete
      const { error } = await sb.from("tasks").update({ completed_at:new Date().toISOString(), completed_by:authUser.id, completed_by_name:dispName }).eq("id",taskId);
      if (!error) {
        setTasks(ts=>ts.map(t=>t.id===taskId?{...t,done:true,doneBy:dispName,doneAt:TODAY}:t));
        // Spawn next recurring task
        if (task.recur) {
          const nextDate = addDays(task.dueDate, Number(task.recur));
          const recurMonths = Math.round(Number(task.recur)/30);
          const { data: next } = await sb.from("tasks").insert({
            plant_id:task.plantId, garden_id:task.gardenId||garden.id,
            task_type:task.type, due_date:nextDate,
            recurrence_months:recurMonths, notes:task.note,
          }).select().single();
          if (next) setTasks(ts=>[...ts, mapTask(next)]);
        }
      }
    }
  }

  function openAddTask(plantId=null) { setTaskCtx(plantId); setModal("task"); }

  async function signOut() { await sb.auth.signOut(); setGarden(null); setPlants([]); setTasks([]); }

  const overdueCount = tasks.filter(t=>!t.done&&urgOf(t.dueDate,false)==="overdue").length;

  const NAV = [
    {id:"home",icon:"🌿",label:"Home"},
    {id:"upcoming",icon:"📋",label:"Tasks"},
    {id:"calendar",icon:"📅",label:"Calendar"},
    {id:"plants",icon:"🌳",label:"Plants"},
    {id:"settings",icon:"⚙️",label:"Settings"},
  ];

  // ── Render gates ──
  if (!authReady) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}><Spinner size={36}/></div>;
  if (!authUser)  return <><style>{CSS}</style><AuthScreen onAuth={setAuthUser}/></>;
  if (loading)    return <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}><Spinner size={36}/></div>;
  if (!garden)    return <><style>{CSS}</style><GardenSetup user={authUser} onJoined={(g,dn)=>{setGarden(g);setDispName(dn);loadGarden();}}/></>;

  return (
    <div className="shell">
      <style>{CSS}</style>

      <div className="screen">
        {screen==="home"     && <HomeScreen     plants={plants} tasks={tasks} dispName={dispName} onToggle={toggleDone} onAddTask={openAddTask}/>}
        {screen==="upcoming" && <UpcomingScreen plants={plants} tasks={tasks} onToggle={toggleDone}/>}
        {screen==="calendar" && <CalendarScreen plants={plants} tasks={tasks} onToggle={toggleDone}/>}
        {screen==="plants"   && <PlantsScreen   plants={plants} tasks={tasks} onAddPlant={()=>setModal("plant")} onAddTask={openAddTask}/>}
        {screen==="settings" && <SettingsScreen user={authUser} garden={garden} members={members} dispName={dispName} onSignOut={signOut}/>}
      </div>

      <nav className="bottom-nav">
        {NAV.map(n=>(
          <button key={n.id} className={`nav-btn ${screen===n.id?"active":""}`} onClick={()=>setScreen(n.id)}>
            <span className="nav-icon">
              {n.icon}
              {n.id==="upcoming"&&overdueCount>0&&<sup style={{fontSize:9,color:"#B84C4C",fontWeight:700,marginLeft:1}}>{overdueCount}</sup>}
            </span>
            <span className="nav-label">{n.label}</span>
          </button>
        ))}
      </nav>

      {modal==="task"  && <AddTaskSheet  plants={plants} defaultPlantId={taskCtx} gardenId={garden.id} onSave={t=>setTasks(ts=>[...ts,t])} onClose={()=>setModal(null)}/>}
      {modal==="plant" && <AddPlantSheet gardenId={garden.id} onSave={p=>setPlants(ps=>[...ps,p])} onClose={()=>setModal(null)}/>}
    </div>
  );
}
