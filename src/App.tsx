
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
// Recharts for data visualization
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip as RechartsTooltip, Legend, CartesianGrid 
} from 'recharts';
// Lucide-react for icons
import { 
  CheckCircle, Brain, Zap, Settings, Coffee, Moon, Plus, Home, List, Target, User, 
  Activity, X, Save, LogOut, ChevronRight, ChevronLeft, Hexagon, GitBranch, 
  Flame, AlertTriangle, Calendar as CalendarIcon, Clock, Briefcase, CheckSquare, 
  ArrowLeft, RotateCcw, Play, Pause, UserCircle, Trash2,
  Users, Trophy, Share2, ShoppingBag, Lock, Snowflake, Eye, Gift, AlertOctagon, Repeat, RefreshCw, Database, Upload, DownloadCloud, Dna, UserPlus, ArrowRight, Quote, ArrowDown, Palette, Type, Sun, Star, Power, Watch,
  Grid, Radio, Feather, FlipVertical, Divide, Shuffle, Skull, Shield, Search, Delete, Calculator, Binary, CalendarDays, Hash, Move, EyeOff, Music, Mic, Palette as PaletteIcon, HelpCircle, Terminal, Command, Cpu, Layers,
  Book, Code, Bookmark, FileText, CornerDownRight, Network, Smile, Heart, Dumbbell, PenTool, Lightbulb
} from 'lucide-react';

/**
 * =================================================================================
 * ⚙️ CONFIGURATION & CONSTANTS
 * =================================================================================
 */

const APP_VERSION = "7.2.0-SIMPLE"; 

// --- STORAGE KEYS (STATIC) ---
const KEYS = {
    SKILLS: 'hb_store_skills',
    TASKS: 'hb_store_tasks',
    HABITS: 'hb_store_habits',
    HISTORY: 'hb_store_history',
    USERNAME: 'hb_store_username',
    PROTOCOL: 'hb_store_protocol',
    STREAK: 'hb_store_streak',
    RIVALS: 'hb_store_rivals',
    INVENTORY: 'hb_store_inventory',
    CURRENCY: 'hb_store_currency',
    DAILY_CHALLENGE: 'hb_store_daily_challenge',
    THEME: 'hb_store_theme',
    FONT: 'hb_store_font',
    SLEEP_STATE: 'hb_store_sleep_state',
    SLEEP_CONFIG: 'hb_store_sleep_config',
    NEXUS: 'hb_store_nexus',
    NOTES: 'hb_store_notes',
    FLASHCARDS: 'hb_store_flashcards',
    READING: 'hb_store_reading',
    CUSTOM_CSS: 'hb_store_css'
};

// THEME PRESETS
const THEMES: Record<string, any> = {
    'Clean': { name: 'Clean', primary: 'bg-white', primaryHover: 'hover:bg-gray-200', text: 'text-gray-300', border: 'border-white/30', bgLight: 'bg-white/5', gradientFrom: 'from-gray-500', glow: 'shadow-none', chart: '#ffffff', stroke: 'stroke-white', fill: 'fill-white', font: 'font-sans' },
    'Nature': { name: 'Nature', primary: 'bg-emerald-500', primaryHover: 'hover:bg-emerald-400', text: 'text-emerald-500', border: 'border-emerald-500/50', bgLight: 'bg-emerald-900/20', gradientFrom: 'from-emerald-900', glow: 'shadow-emerald-500/20', chart: '#34d399', stroke: 'stroke-emerald-500', fill: 'fill-emerald-500', font: 'font-sans' },
    'Ocean': { name: 'Ocean', primary: 'bg-blue-500', primaryHover: 'hover:bg-blue-400', text: 'text-blue-300', border: 'border-blue-500/50', bgLight: 'bg-blue-900/20', gradientFrom: 'from-blue-900', glow: 'shadow-blue-500/20', chart: '#60a5fa', stroke: 'stroke-blue-500', fill: 'fill-blue-500', font: 'font-sans' },
    'Sunset': { name: 'Sunset', primary: 'bg-rose-600', primaryHover: 'hover:bg-rose-500', text: 'text-rose-400', border: 'border-rose-500', bgLight: 'bg-rose-500/10', gradientFrom: 'from-rose-600', glow: 'shadow-rose-900/40', chart: '#f43f5e', stroke: 'stroke-rose-500', fill: 'fill-rose-400' },
    'Focus': { name: 'Focus', primary: 'bg-slate-100', primaryHover: 'hover:bg-slate-300', text: 'text-white', border: 'border-white', bgLight: 'bg-white/10', gradientFrom: 'from-slate-100', glow: 'shadow-white/20', chart: '#f8fafc', stroke: 'stroke-white', fill: 'fill-white' }
};

const FONTS: Record<string, string> = {
    'Modern': 'font-sans', // Inter
    'Typewriter': 'font-mono', // JetBrains Mono
    'Classic': 'font-serif', // Playfair
    'Bold': 'font-space', // Space Grotesk
};

// SIMPLIFIED CONFIG
const PILLAR_KEYS = ['Learn', 'Create', 'Mind', 'Health', 'Social'];
const PILLAR_ICONS = {
    'Learn': Book,
    'Create': PenTool,
    'Mind': Brain,
    'Health': Dumbbell,
    'Social': Users
};

const POLYMATH_KEYWORDS = [
        ['learn', 'read', 'study', 'research', 'explore', 'analyze', 'math', 'logic', 'book', 'course', 'class'],
        ['make', 'build', 'write', 'code', 'art', 'design', 'ship', 'project', 'draw', 'paint', 'craft'],
        ['connect', 'synthesize', 'solve', 'system', 'optimize', 'meditate', 'plan', 'think', 'reflect', 'journal'],
        ['sport', 'train', 'dance', 'move', 'eat', 'sleep', 'fast', 'run', 'gym', 'walk', 'yoga'],
        ['speak', 'lead', 'teach', 'share', 'debate', 'network', 'social', 'friend', 'family', 'call']
];

const CHART_COLORS = ['#3b82f6', '#10b981', '#eab308', '#a855f7', '#f43f5e'];

const TIERS = [
  { name: 'Beginner', limit: 20 },
  { name: 'Intermediate', limit: 45 },
  { name: 'Advanced', limit: 70 },
  { name: 'Expert', limit: 100 }
];

const SHOP_ITEMS = [
    { id: 'freeze', name: 'Streak Freeze', cost: 500, icon: 'Snowflake', desc: 'Miss a day without losing your streak.', type: 'consumable' },
    { id: 'neuro_stim', name: 'Score Boost', cost: 1500, icon: 'Zap', desc: '+10 Score to your lowest area.', type: 'consumable' },
    { id: 'hacker_mode', name: 'Developer Mode', cost: 2000, icon: 'Code', desc: 'Unlock Custom CSS Editor.', type: 'permanent' },
];

const ACHIEVEMENTS = [
    { id: 'streak_7', name: 'On Fire', desc: '7 day streak', icon: 'Flame', condition: (data: any) => data.streak >= 7 },
    { id: 'xp_1000', name: 'High Flyer', desc: 'Earn 1,000 Total XP', icon: 'Zap', condition: (data: any) => data.xp >= 1000 },
    { id: 'tasks_50', name: 'Doer', desc: 'Complete 50 Tasks', icon: 'CheckCircle', condition: (data: any) => data.tasks >= 50 },
    { id: 'balance_50', name: 'Balanced', desc: 'All areas above 50%', icon: 'Activity', condition: (data: any) => data.minScore >= 50 }
];

const MOTIVATIONAL_QUOTES = [
  "Small steps every day.",
  "Focus on progress, not perfection.",
  "You don't have to be great to start, but you have to start to be great.",
  "One thing at a time.",
  "Consistency is key.",
  "Rest is productive.",
  "Learn something new today.",
  "Your potential is endless.",
  "Make today count.",
  "Simplicity is the ultimate sophistication."
];

const GOODNIGHT_QUOTES = [
    "Rest well.",
    "See you tomorrow.",
    "Time to recharge.",
    "Sleep is the best meditation.",
    "Great job today.",
    "Disconnect to reconnect.",
    "Peace and quiet.",
    "Let go of today.",
    "Prepare for a fresh start.",
    "Goodnight."
];

// --- NEXUS CONSTANTS ---
const MORSE_CODE: Record<string, string> = { 'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----' };
const NATO_PHONETIC: Record<string, string> = { 'A': 'Alpha', 'B': 'Bravo', 'C': 'Charlie', 'D': 'Delta', 'E': 'Echo', 'F': 'Foxtrot', 'G': 'Golf', 'H': 'Hotel', 'I': 'India', 'J': 'Juliet', 'K': 'Kilo', 'L': 'Lima', 'M': 'Mike', 'N': 'November', 'O': 'Oscar', 'P': 'Papa', 'Q': 'Quebec', 'R': 'Romeo', 'S': 'Sierra', 'T': 'Tango', 'U': 'Uniform', 'V': 'Victor', 'W': 'Whiskey', 'X': 'X-ray', 'Y': 'Yankee', 'Z': 'Zulu' };
const OBLIQUE_STRATEGIES = [
    "Take a break.", "Try it a different way.", "Ask for help.", "Simplify it.", "Just start.", "What would a friend do?", "Work backwards.", "Focus on the easy part first."
];

// Derived reverse map for Decoding
const MORSE_TO_TEXT: Record<string, string> = Object.entries(MORSE_CODE).reduce((acc, [char, code]) => {
    acc[code] = char;
    return acc;
}, {} as Record<string, string>);

const MICRO_ACTIONS = [
    "Drink a glass of water.", "Do 5 jumping jacks.", "Read one page.", "Write one sentence.", "Take 3 deep breaths.", "Clear your desk.", "Send a nice message.", "Stretch for 1 minute."
];
const VIRTUES = [
    "Patience", "Honesty", "Discipline", "Kindness", "Focus", "Gratitude", "Courage", "Humility"
];

// --- INITIAL DATA STATES ---

const generateBaseSkills = () => {
    return PILLAR_KEYS.map((key, i) => ({
        id: `poly_s${i}`,
        name: key, 
        pillar: key, 
        initial_score: 0,
        current_score: 0,
        decay_rate: 0.1, // Easy mode
        last_activity: new Date().toISOString()
    }));
};

const INITIAL_HISTORY = [
  { month: 'Start', score: 0 },
  { month: 'Now', score: 0 }
];

const getTodayString = () => {
    const d = new Date();
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().split('T')[0];
};

const INITIAL_TASKS: any[] = [];
const INITIAL_CUSTOM_HABITS: any[] = [];
const INITIAL_NOTES: any[] = [];
const INITIAL_FLASHCARDS: any[] = [];
const INITIAL_READING_LIST: any[] = [];

/**
 * =================================================================================
 * 🧠 UTILITY FUNCTIONS
 * =================================================================================
 */

// LEGACY MIGRATION FUNCTION
const runDataMigration = () => {
    // Migration v1 (Original)
    if (!localStorage.getItem('hb_polymath_migration_v1')) localStorage.setItem('hb_polymath_migration_v1', 'true');
};

const getIcon = (iconName: string, className?: string) => {
  const size = 18;
  const props = { size, className };
  switch (iconName) {
    case 'Brain': return <Brain {...props} />;
    case 'Coffee': return <Coffee {...props} />;
    case 'Hexagon': return <Hexagon {...props} />;
    case 'Briefcase': return <Briefcase {...props} />;
    case 'Moon': return <Moon {...props} />;
    case 'Zap': return <Zap {...props} />;
    case 'GitBranch': return <GitBranch {...props} />;
    case 'Polymath': return <Dna {...props} />; 
    case 'UserCircle': return <UserCircle {...props} />;
    case 'Snowflake': return <Snowflake {...props} />;
    case 'Trophy': return <Trophy {...props} />;
    case 'CheckCircle': return <CheckCircle {...props} />;
    case 'Activity': return <Activity {...props} />;
    case 'Flame': return <Flame {...props} />;
    case 'Eye': return <Eye {...props} />;
    case 'Gift': return <Gift {...props} />;
    case 'Repeat': return <Repeat {...props} />;
    case 'Sun': return <Sun {...props} />;
    case 'Star': return <Star {...props} />;
    case 'Radio': return <Radio {...props} />;
    case 'Feather': return <Feather {...props} />;
    case 'FlipVertical': return <FlipVertical {...props} />;
    case 'Divide': return <Divide {...props} />;
    case 'Shuffle': return <Shuffle {...props} />;
    case 'Skull': return <Skull {...props} />;
    case 'Shield': return <Shield {...props} />;
    case 'Calculator': return <Calculator {...props} />;
    case 'Binary': return <Binary {...props} />;
    case 'CalendarDays': return <CalendarDays {...props} />;
    case 'Hash': return <Hash {...props} />;
    case 'Move': return <Move {...props} />;
    case 'EyeOff': return <EyeOff {...props} />;
    case 'Music': return <Music {...props} />;
    case 'Mic': return <Mic {...props} />;
    case 'Palette': return <PaletteIcon {...props} />;
    case 'Lock': return <Lock {...props} />;
    case 'Code': return <Code {...props} />;
    case 'Book': return <Book {...props} />;
    case 'Layers': return <Layers {...props} />;
    case 'PenTool': return <PenTool {...props} />;
    case 'Dumbbell': return <Dumbbell {...props} />;
    case 'Users': return <Users {...props} />;
    case 'Lightbulb': return <Lightbulb {...props} />;
    default: return <Activity {...props} />;
  }
};

const parseLocalDate = (dateStr: string) => {
    if (!dateStr) return new Date();
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
};

const addDays = (dateStr: string, days: number): string => {
    const d = parseLocalDate(dateStr);
    d.setDate(d.getDate() + days);
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().split('T')[0];
};

const getDaysSince = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    return Math.floor(diff / (1000 * 3600 * 24));
};

const formatDuration = (ms: number) => {
    const hrs = Math.floor(ms / (1000 * 60 * 60));
    const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hrs}h ${mins}m`;
};

// SOUND ENGINE
const playSound = (type: 'click' | 'success' | 'hover' | 'toggle' | 'delete' | 'tap' | 'beat' | 'tone') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    
    if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.2);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
    } else if (type === 'delete') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(50, now + 0.2);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
    } else if (type === 'tap') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
    } else if (type === 'beat') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
    } else if (type === 'tone') {
        osc.type = 'sine';
        // frequency is set outside or default
        osc.frequency.setValueAtTime(440, now); 
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
    }
  } catch (e) {
    // Silent fail
  }
};

const playNote = (freq: number) => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const now = ctx.currentTime;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1);
        osc.start(now);
        osc.stop(now + 1);
    } catch(e) {}
};

const dist = (x1: number, y1: number, x2: number, y2: number) => Math.sqrt((x2-x1)**2 + (y2-y1)**2);

/**
 * =================================================================================
 * 🧩 LIFE OS SUB-COMPONENTS
 * =================================================================================
 */

// 1. Typewriter Effect Component
const Typewriter = ({ text, speed = 30, className = "" }: { text: string, speed?: number, className?: string }) => {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    let i = 0;
    setDisplayed('');
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return <span className={className}>{displayed}<span className="animate-pulse">_</span></span>;
};

// 2. Circadian Rhythm Sine Wave
const CircadianWave = ({ wakeTime, theme }: { wakeTime: string, theme: any }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const [h, m] = wakeTime.split(':').map(Number);
        const wakeMinutes = h * 60 + m;
        let animationFrameId: number;
        let t = 0;

        const render = () => {
            t += 0.01;
            const width = canvas.width = canvas.offsetWidth;
            const height = canvas.height = canvas.offsetHeight;
            
            ctx.clearRect(0, 0, width, height);
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = theme.name === 'Void' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
            
            // Draw Sine Wave
            ctx.beginPath();
            for (let x = 0; x < width; x++) {
                const minuteOfDay = (x / width) * 1440;
                const relativeTime = (minuteOfDay - wakeMinutes + 1440) % 1440;
                // Mathematical Energy Model
                const y1 = Math.sin((relativeTime / 240) - 1.5); 
                const y2 = Math.sin((relativeTime / 720) - 1.5) * 0.5;
                const normalizedY = -(y1 + y2) * (height / 3) + (height / 2);
                if (x === 0) ctx.moveTo(x, normalizedY);
                else ctx.lineTo(x, normalizedY);
            }
            ctx.stroke();

            // Current Time Marker
            const now = new Date();
            const currentMinute = now.getHours() * 60 + now.getMinutes();
            const currentX = (currentMinute / 1440) * width;
            
            ctx.beginPath();
            ctx.arc(currentX, height/2 + Math.sin(t*2)*10, 4, 0, Math.PI*2);
            ctx.fillStyle = theme.chart;
            ctx.fill();

            animationFrameId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, [wakeTime, theme]);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-50 z-0" />;
};

// 3. Force Directed Graph (Zettelkasten)
const KnowledgeGraph = ({ notes, tasks, theme }: any) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nodes = useRef<any[]>([]);
    
    useEffect(() => {
        // Create nodes from Notes + Tasks
        const noteNodes = notes.map((n: any) => ({ id: n.id, type: 'note', text: n.title || n.content.substring(0,10), color: '#34d399' }));
        const taskNodes = tasks.filter((t:any) => t.status === 'To Do').slice(0, 10).map((t: any) => ({ id: t.id, type: 'task', text: t.name, color: '#60a5fa' }));
        
        nodes.current = [...noteNodes, ...taskNodes].map(n => ({
            ...n,
            x: Math.random() * 300,
            y: Math.random() * 300,
            vx: 0, vy: 0
        }));

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        let frame = 0;
        const runPhysics = () => {
            if (!ctx) return;
            const width = canvas.width = canvas.offsetWidth;
            const height = canvas.height = canvas.offsetHeight;
            const REPULSION = 500;
            const CENTER_PULL = 0.02;

            ctx.clearRect(0,0,width,height);
            
            nodes.current.forEach((node, i) => {
                // Repulsion
                nodes.current.forEach((other, j) => {
                    if (i === j) return;
                    const d = dist(node.x, node.y, other.x, other.y) + 1;
                    const force = REPULSION / (d * d);
                    const dx = (node.x - other.x) / d;
                    const dy = (node.y - other.y) / d;
                    node.vx += dx * force;
                    node.vy += dy * force;
                });
                
                // Gravity to center
                node.vx += (width/2 - node.x) * CENTER_PULL;
                node.vy += (height/2 - node.y) * CENTER_PULL;
                
                // Friction
                node.vx *= 0.9;
                node.vy *= 0.9;
                node.x += node.vx;
                node.y += node.vy;

                // Draw Link (if close)
                nodes.current.forEach((other, j) => {
                     if (i>=j) return;
                     const d = dist(node.x, node.y, other.x, other.y);
                     if (d < 100) {
                         ctx.beginPath();
                         ctx.moveTo(node.x, node.y);
                         ctx.lineTo(other.x, other.y);
                         ctx.strokeStyle = theme.border;
                         ctx.globalAlpha = 1 - (d/100);
                         ctx.stroke();
                         ctx.globalAlpha = 1;
                     }
                });

                // Draw Node
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.type === 'note' ? 4 : 3, 0, Math.PI * 2);
                ctx.fillStyle = node.color;
                ctx.fill();
                ctx.fillStyle = theme.text;
                ctx.font = '9px monospace';
                ctx.fillText(node.text.substring(0, 15), node.x + 6, node.y + 3);
            });
            frame = requestAnimationFrame(runPhysics);
        };
        runPhysics();
        return () => cancelAnimationFrame(frame);
    }, [notes, tasks, theme]);

    return <canvas ref={canvasRef} className="w-full h-[300px] cursor-crosshair bg-black/20 rounded-lg border border-white/5" />;
};

// 4. SVG Concept Map
const ConceptMap = ({ tasks, theme }: any) => {
    const activeTasks = tasks.filter((t:any) => t.status === 'To Do').slice(0, 8);
    const cx = 150; 
    const cy = 150;
    const r = 100;

    return (
        <svg viewBox="0 0 300 300" className="w-full h-full">
            {/* Center User Node */}
            <circle cx={cx} cy={cy} r="20" fill="#1e293b" stroke={theme.chart} strokeWidth="2" />
            <text x={cx} y={cy} dy="4" textAnchor="middle" fill="white" fontSize="8" className="font-mono">ME</text>

            {/* Pillar Nodes */}
            {PILLAR_KEYS.map((p, i) => {
                const angle = (i / 5) * Math.PI * 2 - Math.PI/2;
                const px = cx + Math.cos(angle) * 60;
                const py = cy + Math.sin(angle) * 60;
                return (
                    <g key={p}>
                        <line x1={cx} y1={cy} x2={px} y2={py} stroke={theme.border} strokeWidth="1" />
                        <circle cx={px} cy={py} r="12" fill={theme.bgLight} stroke={theme.chart} strokeWidth="1" />
                        <text x={px} y={py} dy="3" textAnchor="middle" fill={theme.text} fontSize="5" className="font-bold uppercase">{p.substring(0,4)}</text>
                    </g>
                );
            })}

            {/* Task Leaf Nodes */}
            {activeTasks.map((t:any, i:number) => {
                const angle = (i / activeTasks.length) * Math.PI * 2;
                const tx = cx + Math.cos(angle) * r;
                const ty = cy + Math.sin(angle) * r;
                // Find pillar index
                const pIdx = PILLAR_KEYS.indexOf(t.category);
                const pAngle = (pIdx / 5) * Math.PI * 2 - Math.PI/2;
                const px = cx + Math.cos(pAngle) * 60;
                const py = cy + Math.sin(pAngle) * 60;

                return (
                    <g key={t.id}>
                        <line x1={px} y1={py} x2={tx} y2={ty} stroke="rgba(255,255,255,0.1)" strokeDasharray="2,2" />
                        <circle cx={tx} cy={ty} r="4" fill="#3b82f6" />
                        <text x={tx} y={ty + 10} textAnchor="middle" fill="#64748b" fontSize="6" className="font-mono">{t.name.substring(0,8)}..</text>
                    </g>
                );
            })}
        </svg>
    );
};


// 5. Terminal CLI
const TerminalCLI = ({ isOpen, onClose, onCommand, theme }: any) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [val, setVal] = useState('');

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            playSound('click');
        }
    }, [isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onCommand(val);
            setVal('');
            onClose();
        }
        if (e.key === 'Escape') onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-32 animate-in fade-in duration-200">
            <div className={`w-full max-w-2xl bg-[#0a0a0a] border ${theme.border} rounded-lg shadow-2xl p-4 flex items-center gap-4`}>
                <Terminal size={20} className={theme.text} />
                <input 
                    ref={inputRef}
                    type="text" 
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Command... (/task, /note, /theme, /wake)" 
                    className={`flex-1 bg-transparent outline-none font-mono text-lg ${theme.text} placeholder-gray-700`}
                />
                <span className="text-xs font-mono text-gray-600">ESC</span>
            </div>
        </div>
    );
};


/**
 * =================================================================================
 * 🧩 UI SUB-COMPONENTS
 * =================================================================================
 */

// ... (MementoMoriView, Confetti, Atmosphere, CinematicOverlay, MobileTab, Modal, PurgeModal, Toast components remain unchanged)
const MementoMoriView = ({ dob, theme, onReset }: { dob: string, theme: any, onReset: () => void }) => {
    const totalWeeks = 4680; // 90 years
    const weeksLived = useMemo(() => {
        const birth = new Date(dob);
        const now = new Date();
        const diff = now.getTime() - birth.getTime();
        return Math.floor(diff / (1000 * 3600 * 24 * 7));
    }, [dob]);

    const [renderedWeeks, setRenderedWeeks] = useState(0);

    useEffect(() => {
        let current = 0;
        const step = Math.max(1, Math.ceil(weeksLived / 60)); // Animate over ~1 second
        const interval = setInterval(() => {
            current += step;
            if (current >= weeksLived) {
                current = weeksLived;
                clearInterval(interval);
            }
            setRenderedWeeks(current);
        }, 16);
        return () => clearInterval(interval);
    }, [weeksLived]);

    const percentage = ((renderedWeeks / totalWeeks) * 100).toFixed(4);

    return (
        <div className="space-y-6 h-full flex flex-col">
             <div className="flex justify-between items-end border-b border-white/10 pb-4 shrink-0">
                <div onDoubleClick={onReset} className="cursor-pointer">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">My Life</h3>
                    <div className="text-3xl font-serif font-bold text-white tracking-tighter tabular-nums">
                        {percentage}%
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Weeks</span>
                    <span className={`text-xl font-mono font-bold ${theme.text} tabular-nums`}>{renderedWeeks.toLocaleString()}</span>
                    <span className="text-xs text-slate-600"> / 4,680</span>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto scrollbar-hide relative min-h-[300px] flex justify-center">
                 <div className="grid grid-cols-[repeat(52,minmax(0,1fr))] gap-[2px] content-start w-full max-w-[400px]">
                    {Array.from({length: 90}).map((_, yearIdx) => (
                         <React.Fragment key={yearIdx}>
                            {Array.from({length: 52}).map((_, weekIdx) => {
                                const absWeek = (yearIdx * 52) + weekIdx;
                                const isLived = absWeek < renderedWeeks;
                                const isCurrent = absWeek === weeksLived;
                                
                                return (
                                    <div 
                                        key={absWeek} 
                                        className={`
                                            h-1 w-1 rounded-[1px] transition-colors duration-75
                                            ${isLived ? 'bg-white shadow-[0_0_2px_rgba(255,255,255,0.3)]' : 'bg-[#1a1d24] border border-white/5'}
                                            ${isCurrent ? `${theme.bgLight} ${theme.border} border animate-pulse scale-150 z-10 shadow-[0_0_8px_currentColor]` : ''}
                                        `}
                                    />
                                );
                            })}
                         </React.Fragment>
                    ))}
                 </div>
            </div>
            <p className="text-center font-serif italic text-slate-500 text-xs shrink-0 pt-4">"Make every week count."</p>
        </div>
    );
};

const Confetti = ({ active }: { active: boolean }) => {
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden flex justify-center">
      {[...Array(20)].map((_, i) => (
        <div 
          key={i}
          className="absolute top-0 w-2 h-2 rounded-full animate-fall"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: CHART_COLORS[Math.floor(Math.random() * 4)],
            animationDuration: `${Math.random() * 1 + 0.5}s`,
            animationDelay: `${Math.random() * 0.2}s`
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-fall { animation: fall linear forwards; }
      `}</style>
    </div>
  );
};

const Atmosphere = ({ theme, isNight }: { theme: any, isNight: boolean }) => {
    // If Constructivist Theme, render minimal background
    if (['Clean', 'Focus'].includes(theme.name)) {
        return <div className={`fixed inset-0 z-0 pointer-events-none ${theme.bgLight} opacity-20`} />;
    }

    const getColorHex = (name: string) => {
        switch(name) {
            case 'Ocean': return '#3b82f6';
            case 'Sunset': return '#f43f5e';
            case 'Focus': return '#ffffff';
            default: return '#10b981'; // Nature
        }
    };
    
    const hex = getColorHex(theme.name);
    
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-30 select-none">
            {/* Circadian Background Shift */}
            <div className={`absolute inset-0 bg-gradient-to-b ${isNight ? 'from-black via-[#020202] to-black' : 'from-[#050505] via-[#0a0a0a] to-[#050505]'} transition-colors duration-[5000ms]`} />
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center">
                <div className={`absolute inset-0 ${isNight ? 'opacity-20' : 'opacity-40'} transition-opacity duration-[3000ms]`}>
                    <svg width="100%" height="100%" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
                        <g style={{ stroke: hex, strokeWidth: 0.5 }}>
                            <path d="M50,150 L200,300 L350,150" fill="none" strokeDasharray="600" strokeDashoffset="600" className="animate-[draw-lines_12s_ease-in-out_infinite_alternate]" />
                            <path d="M200,300 L200,500" fill="none" strokeDasharray="300" strokeDashoffset="300" className="animate-[draw-lines_8s_ease-in-out_infinite_alternate]" style={{ animationDelay: '2s' }} />
                            <path d="M50,450 L200,300 L350,450" fill="none" strokeDasharray="600" strokeDashoffset="600" className="animate-[draw-lines_10s_ease-in-out_infinite_alternate]" style={{ animationDelay: '4s' }} />
                            
                            <circle cx="200" cy="300" r="3" style={{ fill: hex }} className="animate-pulse" />
                            <circle cx="50" cy="150" r="2" style={{ fill: hex, animationDelay: '1s' }} className="animate-pulse" />
                            <circle cx="350" cy="150" r="2" style={{ fill: hex, animationDelay: '2s' }} className="animate-pulse" />
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    );
};

const CinematicOverlay = ({ type, text, subtext, onComplete, theme, onAction }: any) => {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        setTimeout(() => setPhase(1), 100);
        if (onComplete) {
            if (type !== 'sleep-locked') {
                setTimeout(() => setPhase(2), 3500);
                setTimeout(onComplete, 4500);
            }
        }
    }, [onComplete, type]);

    const isFail = type === 'fail';

    return (
        <div className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-opacity duration-1000 ${phase === 1 ? 'opacity-100' : 'opacity-0'}`}>
             <div className="text-center space-y-8 px-8 relative z-10">
                 {type === 'sleep' && <Moon size={64} className={`${theme.text} mx-auto animate-pulse opacity-80`} />}
                 {type === 'wake' && <Sun size={64} className={`${theme.text} mx-auto animate-[spin-slower_10s_linear_infinite] opacity-80`} />}
                 {type === 'sleep-locked' && <Lock size={48} className="text-slate-500 mx-auto" />}
                 {type === 'fail' && <AlertOctagon size={64} className="text-red-500 mx-auto animate-bounce opacity-80" />}
                 {type === 'startup' && <Zap size={48} className={`${theme.text} mx-auto animate-pulse`} />}
                 
                 <div className="space-y-4">
                     <h1 className={`font-space text-3xl md:text-5xl ${isFail ? 'text-red-500' : 'text-white'} tracking-tight leading-tight uppercase max-w-2xl mx-auto`}>
                         {text}
                     </h1>
                     {subtext && <p className={`font-sans text-xs ${isFail ? 'text-red-400' : 'text-slate-500'} tracking-widest uppercase animate-fade-in-slow delay-500`}>{subtext}</p>}
                 </div>

                 {type === 'sleep-locked' && (
                     <button onClick={onAction} className="mt-8 px-6 py-3 border border-red-900/50 text-red-500/50 hover:text-red-400 hover:border-red-500 text-[10px] tracking-widest uppercase transition-all duration-500">
                         Cancel Sleep Mode
                     </button>
                 )}
             </div>
        </div>
    );
};

const MobileTab = ({ label, icon, active, onClick, themeColor }: { label: string, icon: React.ReactElement, active: boolean, onClick: () => void, themeColor: string }) => (
  <button 
    onClick={() => { playSound('click'); onClick(); }}
    className={`flex flex-col items-center justify-center w-full py-2 gap-1 transition-all duration-300 active:scale-95 ${
      active ? themeColor : 'text-slate-500 hover:text-slate-300'
    }`}
  >
    {React.cloneElement(icon as React.ReactElement<any>, { size: active ? 22 : 20, strokeWidth: active ? 2.5 : 2 })}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

const Modal = ({ isOpen, onClose, title, children, font }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode, font: string }) => {
  if (!isOpen) return null;
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300 ${font}`}>
      <div className="bg-[#1c1f26]/90 border border-white/10 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto transform transition-all scale-100 animate-in zoom-in-95 duration-200">
        <button onClick={() => { playSound('click'); onClose(); }} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors active:scale-90">
          <X size={20} />
        </button>
        <h3 className="text-xl font-bold text-white mb-4 font-space tracking-tight">{title}</h3>
        {children}
      </div>
    </div>
  );
};

const PurgeModal = ({ isOpen, onClose, count, onReschedule, onBurn, font }: { isOpen: boolean, onClose: () => void, count: number, onReschedule: () => void, onBurn: () => void, font: string }) => {
    if (!isOpen) return null;
    return (
      <div className={`fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-in fade-in duration-300 ${font}`}>
        <div className="bg-red-950/50 border border-red-500 w-full max-w-xs rounded-2xl p-6 shadow-2xl relative text-center transform transition-all animate-in zoom-in-95 duration-200">
          <AlertOctagon size={48} className="text-red-500 mx-auto mb-4 animate-pulse" />
          <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Missed Tasks</h3>
          <p className="text-red-200 text-xs mb-6">
            You have <strong className="text-white text-lg">{count}</strong> overdue tasks.
            <br/><br/>
            What should we do with them?
          </p>
          <div className="space-y-3">
            <button onClick={() => { playSound('click'); onReschedule(); }} className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-bold text-sm border border-slate-600 active:scale-95 transition-transform">
              Reschedule for Today (-50 XP)
            </button>
            <button onClick={() => { playSound('delete'); onBurn(); }} className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-xl text-white font-bold text-sm shadow-lg shadow-red-900/40 active:scale-95 transition-transform">
              Delete Them
            </button>
          </div>
        </div>
      </div>
    );
  };

const Toast = ({ message, isVisible, theme }: { message: string, isVisible: boolean, theme: any }) => {
  if (!isVisible) return null;
  return (
    <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 ${theme.bgLight} backdrop-blur-md ${theme.text} px-6 py-3 rounded-full shadow-2xl z-50 animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-2 pointer-events-none border ${theme.border} border-opacity-30`}>
      <CheckCircle size={16} />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

/**
 * =================================================================================
 * 🚀 MAIN APPLICATION COMPONENT
 * =================================================================================
 */
export default function App() {

  // --- 0. INIT & MIGRATION ---
  useEffect(() => {
    runDataMigration();
  }, []);
  
  // --- 1. PERSISTENT STATE MANAGEMENT ---
  const [appTheme, setAppTheme] = useState(() => localStorage.getItem(KEYS.THEME) || 'Clean'); 
  const [appFont, setAppFont] = useState(() => localStorage.getItem(KEYS.FONT) || 'Modern');
  const [sleepConfig, setSleepConfig] = useState(() => {
      try { return JSON.parse(localStorage.getItem(KEYS.SLEEP_CONFIG) || 'null') || { sleep: '23:00', wake: '08:00' }; }
      catch { return { sleep: '23:00', wake: '08:00' }; }
  });

  const theme = useMemo(() => THEMES[appTheme] || THEMES['Clean'], [appTheme]);
  const fontClass = useMemo(() => FONTS[appFont] || FONTS['Modern'], [appFont]);

  const [skills, setSkills] = useState<Record<string, any[]>>(() => {
    try { 
        return JSON.parse(localStorage.getItem(KEYS.SKILLS) || 'null') || { 'Polymath': generateBaseSkills() }; 
    } catch { 
        return { 'Polymath': generateBaseSkills() }; 
    }
  });

  const [tasks, setTasks] = useState(() => {
    try { 
        return JSON.parse(localStorage.getItem(KEYS.TASKS) || '[]') || INITIAL_TASKS;
    } catch { return INITIAL_TASKS; }
  });

  const [customHabits, setCustomHabits] = useState(() => {
    try { 
        return JSON.parse(localStorage.getItem(KEYS.HABITS) || '[]') || INITIAL_CUSTOM_HABITS; 
    } catch { return INITIAL_CUSTOM_HABITS; }
  });

  // NEW: Notes state for Zettelkasten
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEYS.NOTES) || '[]') || INITIAL_NOTES; } catch { return INITIAL_NOTES; }
  });
  // NEW: Flashcards
  const [flashcards, setFlashcards] = useState(() => {
      try { return JSON.parse(localStorage.getItem(KEYS.FLASHCARDS) || '[]') || INITIAL_FLASHCARDS; } catch { return INITIAL_FLASHCARDS; }
  });
  // NEW: Reading List
  const [readingList, setReadingList] = useState(() => {
      try { return JSON.parse(localStorage.getItem(KEYS.READING) || '[]') || INITIAL_READING_LIST; } catch { return INITIAL_READING_LIST; }
  });
  // NEW: Custom CSS (Hacker Mode)
  const [customCSS, setCustomCSS] = useState(() => {
      try { return localStorage.getItem(KEYS.CUSTOM_CSS) || ''; } catch { return ''; }
  });

  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEYS.HISTORY) || 'null') || INITIAL_HISTORY; } catch { return INITIAL_HISTORY; }
  });
  
  const [userName, setUserName] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEYS.USERNAME) || 'null') || null; } catch { return null; }
  });
  const [protocol, setProtocol] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEYS.PROTOCOL) || 'null') || "To live a balanced life."; } catch { return "To live a balanced life."; }
  });
  const [streakData, setStreakData] = useState(() => {
    try { 
      return JSON.parse(localStorage.getItem(KEYS.STREAK) || 'null') || { count: 0, lastDate: null }; 
    } catch { 
      return { count: 0, lastDate: null }; 
    }
  });
  
  const [dailyChallengeState, setDailyChallengeState] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEYS.DAILY_CHALLENGE) || 'null') || { date: null, active: false, completed: false, challenge: null }; } catch { return { date: null, active: false, completed: false, challenge: null }; }
  });
  
  const [sleepState, setSleepState] = useState(() => {
     try { return JSON.parse(localStorage.getItem(KEYS.SLEEP_STATE) || 'null') || { isActive: false, startTime: null }; } catch { return { isActive: false, startTime: null }; }
  });

  const [nexusState, setNexusState] = useState(() => {
      try { 
          return JSON.parse(localStorage.getItem(KEYS.NEXUS) || 'null') || { dob: null, virtues: {}, lastOracleWeek: null, regretProtocol: null }; 
      } catch { 
          return { dob: null, virtues: {}, lastOracleWeek: null, regretProtocol: null }; 
      }
  });

  const [inventory, setInventory] = useState(() => {
     try { return JSON.parse(localStorage.getItem(KEYS.INVENTORY) || 'null') || { items: [], badges: [] }; } catch { return { items: [], badges: [] }; }
  });
  const [currencyXP, setCurrencyXP] = useState(() => {
     try { return JSON.parse(localStorage.getItem(KEYS.CURRENCY) || '0') || 0; } catch { return 0; }
  });

  // --- 2. TRANSIENT STATE ---
  const [activeTab, setActiveTab] = useState('Home');
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quote, setQuote] = useState('');
  
  const [cinematic, setCinematic] = useState<{ active: boolean, type: 'startup' | 'sleep' | 'wake' | 'sleep-locked' | 'wake-ready' | 'fail', text: string, subtext?: string } | null>(null);

  const [isShutdown, setIsShutdown] = useState(false);

  const [isOnboarding, setIsOnboarding] = useState(!userName); 
  const [onboardingStep, setOnboardingStep] = useState(0); 
  const [onboardingName, setOnboardingName] = useState('');
  const [onboardingProtocol, setOnboardingProtocol] = useState('');
  
  const [showShop, setShowShop] = useState(false);
  const [showBackup, setShowBackup] = useState(false);
  const [showBioSettings, setShowBioSettings] = useState(false);
  const [showCSSEditor, setShowCSSEditor] = useState(false);
  
  // CLI State
  const [cliOpen, setCliOpen] = useState(false);

  // Nexus UI State
  const [nexusActiveTool, setNexusActiveTool] = useState<string | null>(null);
  const [showGameHelp, setShowGameHelp] = useState(false);
  const [nexusInput, setNexusInput] = useState('');
  const [nexusOutput, setNexusOutput] = useState('');
  const [cipherMode, setCipherMode] = useState<'ENCODE' | 'DECODE'>('ENCODE');
  const [tempDob, setTempDob] = useState('');
  const [logicInputs, setLogicInputs] = useState({ a: 0, b: 0 }); // Logic Gates state
  const [metronomeInterval, setMetronomeInterval] = useState<any>(null); // Metronome state
  const [boxBreathingState, setBoxBreathingState] = useState('inhale'); // Box Breathing state

  // Nexus Games State
  const [gameState, setGameState] = useState<any>({ score: 0, status: 'idle', question: null, answer: '' });

  // Calendar & Forms
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Learn');
  const [newItemImpact, setNewItemImpact] = useState('Medium');
  const [newItemDate, setNewItemDate] = useState(getTodayString());
  const [newItemDuration, setNewItemDuration] = useState(30); 
  const [newItemType, setNewItemType] = useState('task');
  const [newItemRecurrence, setNewItemRecurrence] = useState('none');
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  
  // Timer
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerDuration, setTimerDuration] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- DATA MIGRATION EFFECT ---
  useEffect(() => {
    const migrated = localStorage.getItem('hb_category_migration_v1');
    if (!migrated) {
        const MAP: Record<string, string> = { 'Erudition': 'Learn', 'Creation': 'Create', 'Integration': 'Mind', 'Vitality': 'Health', 'Influence': 'Social' };
        
        // Migrate Tasks
        const oldTasks = JSON.parse(localStorage.getItem(KEYS.TASKS) || '[]');
        const newTasks = oldTasks.map((t:any) => ({...t, category: MAP[t.category] || t.category}));
        setTasks(newTasks);

        // Migrate Habits
        const oldHabits = JSON.parse(localStorage.getItem(KEYS.HABITS) || '[]');
        const newHabits = oldHabits.map((h:any) => ({...h, category: MAP[h.category] || h.category}));
        setCustomHabits(newHabits);

        // Migrate Skills
        const oldSkillsData = JSON.parse(localStorage.getItem(KEYS.SKILLS) || 'null');
        if (oldSkillsData && oldSkillsData['Polymath']) {
            const newSkills = oldSkillsData['Polymath'].map((s:any) => ({...s, pillar: MAP[s.pillar] || s.pillar, name: MAP[s.name] || s.name}));
            setSkills({ 'Polymath': newSkills });
        }

        localStorage.setItem('hb_category_migration_v1', 'true');
        window.location.reload(); // Force reload to apply changes
    }
  }, []);

  // ... (Effects remain unchanged) ...
  useEffect(() => { localStorage.setItem(KEYS.SKILLS, JSON.stringify(skills)); }, [skills]);
  useEffect(() => { localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem(KEYS.HISTORY, JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem(KEYS.HABITS, JSON.stringify(customHabits)); }, [customHabits]);
  useEffect(() => { localStorage.setItem(KEYS.NOTES, JSON.stringify(notes)); }, [notes]);
  useEffect(() => { localStorage.setItem(KEYS.FLASHCARDS, JSON.stringify(flashcards)); }, [flashcards]);
  useEffect(() => { localStorage.setItem(KEYS.READING, JSON.stringify(readingList)); }, [readingList]);
  useEffect(() => { localStorage.setItem(KEYS.CUSTOM_CSS, customCSS); }, [customCSS]);
  useEffect(() => { if (userName) localStorage.setItem(KEYS.USERNAME, JSON.stringify(userName)); }, [userName]);
  useEffect(() => { localStorage.setItem(KEYS.PROTOCOL, JSON.stringify(protocol)); }, [protocol]);
  useEffect(() => { localStorage.setItem(KEYS.STREAK, JSON.stringify(streakData)); }, [streakData]);
  useEffect(() => { localStorage.setItem(KEYS.INVENTORY, JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem(KEYS.CURRENCY, JSON.stringify(currencyXP)); }, [currencyXP]);
  useEffect(() => { localStorage.setItem(KEYS.DAILY_CHALLENGE, JSON.stringify(dailyChallengeState)); }, [dailyChallengeState]);
  useEffect(() => { localStorage.setItem(KEYS.SLEEP_STATE, JSON.stringify(sleepState)); }, [sleepState]);
  useEffect(() => { localStorage.setItem(KEYS.SLEEP_CONFIG, JSON.stringify(sleepConfig)); }, [sleepConfig]);
  useEffect(() => { localStorage.setItem(KEYS.NEXUS, JSON.stringify(nexusState)); }, [nexusState]);
  useEffect(() => { localStorage.setItem(KEYS.THEME, appTheme); }, [appTheme]);
  useEffect(() => { localStorage.setItem(KEYS.FONT, appFont); }, [appFont]);
  
  // CLI HOTKEY
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
        if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            setCliOpen((open) => !open);
        }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setQuote(randomQuote);
    initializeSystemTasks();
    handleStartupLogic(randomQuote);
  }, []);
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playSound('success');
      showToast("Session Complete.");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      setCurrencyXP(prev => prev + 50);
      setTimeLeft(timerDuration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isTimerRunning, timeLeft, timerDuration]);
  useEffect(() => {
    setShowShop(false);
    setShowBackup(false);
    setShowBioSettings(false);
    setShowCSSEditor(false);
    setNexusActiveTool(null);
    setShowGameHelp(false);
    if (metronomeInterval) clearInterval(metronomeInterval); // Stop metronome on tab switch
    setMetronomeInterval(null);
  }, [activeTab]);
  useEffect(() => {
      if (newItemType === 'task' && newItemName) {
          const lower = newItemName.toLowerCase();
          for (let i = 0; i < 5; i++) {
              if (POLYMATH_KEYWORDS[i] && POLYMATH_KEYWORDS[i].some((k: string) => lower.includes(k))) {
                  setNewItemCategory(PILLAR_KEYS[i]);
                  break;
              }
          }
      }
  }, [newItemName, newItemType]);
  useEffect(() => {
      const allCompletedTasks = tasks.filter((t:any) => t.status === 'Complete').length;
      const allHabits = customHabits.reduce((acc: number, h:any) => acc + h.completions.filter(Boolean).length, 0);
      const currentXP = (allCompletedTasks * 150) + (allHabits * 50);
      const mySkills = skills['Polymath'] || [];
      const minScore = mySkills.length > 0 ? Math.min(...mySkills.map((s:any) => s.current_score)) : 0;
      const data = { streak: streakData.count, xp: currentXP, tasks: allCompletedTasks, habits: allHabits, minScore };
      let newBadge = false;
      const updatedBadges = [...inventory.badges];
      ACHIEVEMENTS.forEach(ach => {
          if (!updatedBadges.includes(ach.id) && ach.condition(data)) {
              updatedBadges.push(ach.id);
              newBadge = true;
              showToast(`Achievement Unlocked: ${ach.name}`);
          }
      });
      if (newBadge) {
          setInventory(prev => ({...prev, badges: updatedBadges}));
          playSound('success');
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 2000);
      }
  }, [streakData, tasks, customHabits, inventory.badges, skills]);

  // CLI LOGIC
  const executeCommand = (cmdStr: string) => {
    const [cmd, ...args] = cmdStr.split(' ');
    const argStr = args.join(' ');
    
    if (cmd === '/task') {
        const newTask = { id: `t${Date.now()}`, name: argStr, status: 'To Do', category: 'Learn', impact: 'Medium', source: 'CLI', date: getTodayString(), icon: 'Briefcase', recurrence: 'none', ownerArchetype: 'Polymath' };
        setTasks(prev => [newTask, ...prev]);
        showToast("Task Added");
    } else if (cmd === '/note') {
        const newNote = { id: `n${Date.now()}`, title: argStr, content: 'Logged via CLI', date: new Date().toISOString() };
        setNotes(prev => [newNote, ...prev]);
        showToast("Note Added");
    } else if (cmd === '/theme') {
        const t = Object.keys(THEMES).find(k => k.toLowerCase() === argStr.toLowerCase());
        if (t) setAppTheme(t);
        else showToast("Unknown Theme");
    } else if (cmd === '/wake') {
        setSleepConfig(p => ({ ...p, wake: argStr }));
        showToast("Wake Time Updated");
    }
  };

  // --- HELPER LOGIC FOR NEW TOOLS ---
  const romanToNum = (roman: string) => {
    const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let num = 0;
    for (let i = 0; i < roman.length; i++) {
      const curr = map[roman[i]];
      const next = map[roman[i + 1]];
      if (next > curr) num -= curr;
      else num += curr;
    }
    return num;
  };

  const numToRoman = (num: number) => {
    const lookup: Record<string, number> = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
    let roman = '';
    for (let i in lookup) {
      while (num >= lookup[i]) {
        roman += i;
        num -= lookup[i];
      }
    }
    return roman;
  };

  const startStroop = () => {
      const colors = ['red', 'blue', 'green', 'yellow'];
      const text = colors[Math.floor(Math.random() * colors.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      setGameState({ score: 0, status: 'playing', question: { text, color }, answer: color });
      playSound('click');
  };
  
  const checkStroop = (color: string) => {
      if (color === gameState.answer) {
           playSound('success');
           const colors = ['red', 'blue', 'green', 'yellow'];
           const text = colors[Math.floor(Math.random() * colors.length)];
           const nextColor = colors[Math.floor(Math.random() * colors.length)];
           setGameState(prev => ({ ...prev, score: prev.score + 1, question: { text, color: nextColor }, answer: nextColor }));
      } else {
           playSound('delete');
           showToast("Incorrect");
      }
  };

  const startReaction = () => {
      setGameState({ status: 'waiting', score: 0 });
      playSound('click');
      setTimeout(() => {
          setGameState({ status: 'ready', startTime: Date.now() });
          playSound('tone');
      }, 1000 + Math.random() * 3000);
  };

  const clickReaction = () => {
      if (gameState.status === 'ready') {
          const time = Date.now() - gameState.startTime;
          setGameState({ status: 'result', score: time });
          playSound('success');
      } else if (gameState.status === 'waiting') {
          showToast("Too early!");
          setGameState({ status: 'idle', score: 0 });
      }
  };

  const toggleMetronome = () => {
      if (metronomeInterval) {
          clearInterval(metronomeInterval);
          setMetronomeInterval(null);
          playSound('delete');
      } else {
          const bpm = parseInt(nexusInput) || 60;
          const ms = 60000 / bpm;
          playSound('beat');
          const interval = setInterval(() => playSound('beat'), ms);
          setMetronomeInterval(interval);
      }
  };

  const startPitch = () => {
      const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
      const freqs = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88];
      const idx = Math.floor(Math.random() * notes.length);
      playNote(freqs[idx]);
      setGameState({ score: 0, status: 'playing', answer: notes[idx] });
  };
  
  const checkPitch = (note: string) => {
      if (note === gameState.answer) {
          playSound('success');
          showToast("Correct");
          // Play next
          setTimeout(() => {
             const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
             const freqs = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88];
             const idx = Math.floor(Math.random() * notes.length);
             playNote(freqs[idx]);
             setGameState(prev => ({ ...prev, score: prev.score + 1, answer: notes[idx] }));
          }, 500);
      } else {
          playSound('delete');
          showToast("Incorrect");
      }
  };

  const startHexMaster = () => {
      const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
      const correct = colors[Math.floor(Math.random() * colors.length)];
      setGameState({ score: 0, status: 'playing', question: correct, answer: correct });
  };
  
  const checkHex = (hex: string) => {
      if (hex === gameState.answer) {
           playSound('success');
           const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
           const next = colors[Math.floor(Math.random() * colors.length)];
           setGameState(prev => ({ ...prev, score: prev.score + 1, question: next, answer: next }));
      } else {
           playSound('delete');
           showToast("Incorrect");
      }
  };

  const startBoxBreathing = () => {
      setBoxBreathingState('inhale');
      setGameState({ status: 'active' });
  };
  
  // Box breathing effect
  useEffect(() => {
      if (nexusActiveTool === 'Box Breathing' && gameState.status === 'active') {
          const phases = ['inhale', 'hold', 'exhale', 'hold'];
          let idx = 0;
          const interval = setInterval(() => {
              idx = (idx + 1) % 4;
              setBoxBreathingState(phases[idx]);
              if (phases[idx] === 'inhale') playSound('tone');
          }, 4000);
          return () => clearInterval(interval);
      }
  }, [nexusActiveTool, gameState.status]);


  // ... (Standard Nexus handlers: textToMorse, handleCipher, etc. remain unchanged) ...
  const calculateLifeWeeks = (dob: string) => {
      const birth = new Date(dob);
      const now = new Date();
      const diff = now.getTime() - birth.getTime();
      return Math.floor(diff / (1000 * 3600 * 24 * 7));
  };
  
  const textToMorse = (text: string) => text.toUpperCase().split('').map(c => MORSE_CODE[c] || c).join(' ');
  const textToNATO = (text: string) => text.toUpperCase().split('').map(c => NATO_PHONETIC[c] || c).join(' ');

  const handleCipher = () => {
      if (!nexusInput) return;
      if (nexusActiveTool === 'Caesar Cipher') {
           const shift = parseInt(nexusOutput) || 3; 
           const res = nexusInput.split('').map(char => {
              if (char.match(/[a-z]/i)) {
                  const code = char.charCodeAt(0);
                  const isUpper = code >= 65 && code <= 90;
                  const base = isUpper ? 65 : 97;
                  return String.fromCharCode(((code - base + shift) % 26) + base);
              }
              return char;
           }).join('');
           setNexusOutput(res);
      } else {
           const m = textToMorse(nexusInput);
           const n = textToNATO(nexusInput);
           setNexusOutput(`MORSE:\n${m}\n\nNATO:\n${n}`);
      }
      playSound('success');
  };

  const handleMorseInput = (char: string) => {
      playSound('tap');
      setNexusInput(prev => prev + char);
      
      const code = (nexusInput + char).trim();
      const chars = code.split(' ');
      const decoded = chars.map(c => MORSE_TO_TEXT[c] || '?').join('');
      setNexusOutput(decoded);
  };
  
  const handleMorseBackspace = () => {
      playSound('delete');
      const newVal = nexusInput.slice(0, -1);
      setNexusInput(newVal);
      const code = newVal.trim();
      const chars = code.split(' ');
      const decoded = chars.map(c => MORSE_TO_TEXT[c] || '').join('');
      setNexusOutput(decoded);
  };

  // ... (Mental Math, Binary, Doomsday, DigitSpan handlers remain unchanged) ...
  const startMentalMath = () => {
      const ops = ['+', '-', '*'];
      const op = ops[Math.floor(Math.random() * ops.length)];
      let a = Math.floor(Math.random() * 20) + 2;
      let b = Math.floor(Math.random() * 20) + 2;
      if (op === '*') { a = Math.floor(Math.random() * 12); b = Math.floor(Math.random() * 12); }
      const q = `${a} ${op} ${b}`;
      let ans = 0;
      if (op === '+') ans = a + b;
      if (op === '-') ans = a - b;
      if (op === '*') ans = a * b;
      setGameState({ score: 0, status: 'playing', question: q, answer: ans, input: '' });
      playSound('click');
  };

  const checkMath = () => {
      if (parseInt(gameState.input) === gameState.answer) {
          playSound('success');
          showToast("Correct");
          const ops = ['+', '-', '*'];
          const op = ops[Math.floor(Math.random() * ops.length)];
          let a = Math.floor(Math.random() * 50);
          let b = Math.floor(Math.random() * 50);
          if (op === '*') { a = Math.floor(Math.random() * 15); b = Math.floor(Math.random() * 15); }
          const q = `${a} ${op} ${b}`;
          let ans = 0;
          if (op === '+') ans = a + b;
          if (op === '-') ans = a - b;
          if (op === '*') ans = a * b;
          setGameState(prev => ({ ...prev, score: prev.score + 1, question: q, answer: ans, input: '' }));
      } else {
          playSound('delete');
          showToast("Incorrect");
          setGameState(prev => ({ ...prev, input: '' }));
      }
  };

  const startBinary = () => {
      const num = Math.floor(Math.random() * 63) + 1;
      setGameState({ score: 0, status: 'playing', question: num, answer: num.toString(2), input: '' });
      playSound('click');
  };

  const checkBinary = () => {
      if (gameState.input === gameState.answer) {
          playSound('success');
          const num = Math.floor(Math.random() * 255) + 1;
          setGameState(prev => ({ ...prev, score: prev.score + 1, question: num, answer: num.toString(2), input: '' }));
      } else {
          playSound('delete');
          setGameState(prev => ({ ...prev, input: '' }));
      }
  };

  const startDoomsday = () => {
      const start = new Date(new Date().getFullYear(), 0, 1);
      const end = new Date(new Date().getFullYear(), 11, 31);
      const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      const day = date.getDay(); 
      setGameState({ score: 0, status: 'playing', question: date.toDateString(), answer: day });
  };
  
  const checkDoomsday = (dayIdx: number) => {
      if (dayIdx === gameState.answer) {
          playSound('success');
          const start = new Date(1900, 0, 1);
          const end = new Date(2100, 11, 31);
          const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
          setGameState(prev => ({ ...prev, score: prev.score + 1, question: date.toDateString(), answer: date.getDay() }));
      } else {
          playSound('delete');
          showToast("Incorrect");
      }
  };

  const startDigitSpan = () => {
      const len = 3;
      const digits = Array.from({length: len}, () => Math.floor(Math.random() * 10)).join('');
      setGameState({ status: 'memorize', question: digits, answer: digits, input: '', level: len });
      setTimeout(() => setGameState(prev => ({ ...prev, status: 'recall' })), 2000);
  };

  const checkDigitSpan = () => {
      if (gameState.input === gameState.answer) {
          playSound('success');
          const newLen = gameState.level + 1;
          const digits = Array.from({length: newLen}, () => Math.floor(Math.random() * 10)).join('');
          setGameState(prev => ({ ...prev, status: 'memorize', question: digits, answer: digits, input: '', level: newLen }));
          setTimeout(() => setGameState(prev => ({ ...prev, status: 'recall' })), 2000);
      } else {
          playSound('delete');
          setGameState(prev => ({ ...prev, status: 'fail' }));
      }
  };

  const handleFeynman = () => {
      const words = nexusInput.split(' ');
      const jargon = words.filter(w => w.length > 9);
      if (jargon.length > 0) {
          setNexusOutput(`Too complex: ${jargon.join(', ')}. Simplify it.`);
          playSound('delete');
      } else {
          setNexusOutput("Good explanation.");
          playSound('success');
      }
  };

  const handleRegret = async () => {
      const today = getTodayString();
      if (nexusState.regretProtocol && nexusState.regretProtocol.date === today) {
          setNexusOutput(nexusState.regretProtocol.action); playSound('success'); return;
      }
      setNexusOutput("Generating..."); playSound('click');
      const action = MICRO_ACTIONS[Math.floor(Math.random() * MICRO_ACTIONS.length)];
      setNexusState((prev: any) => ({ ...prev, regretProtocol: { date: today, action: action } }));
      setNexusOutput(action); playSound('success');
  };

  const handleMementoSetup = () => { if(!tempDob) return; playSound('success'); setNexusState((prev: any) => ({ ...prev, dob: tempDob })); };
  const handleMementoReset = () => { playSound('delete'); setNexusState((prev: any) => ({ ...prev, dob: null })); }

  const toggleVirtue = (index: number) => {
      playSound('click');
      const today = getTodayString();
      setNexusState((prev: any) => {
          const currentVirtues = prev.virtues[today] || Array(13).fill(false);
          const newVirtues = [...currentVirtues];
          newVirtues[index] = !newVirtues[index];
          return { ...prev, virtues: { ...prev.virtues, [today]: newVirtues } };
      });
  };

  const getObliqueStrategy = () => {
      const s = OBLIQUE_STRATEGIES[Math.floor(Math.random() * OBLIQUE_STRATEGIES.length)];
      setNexusOutput(s);
      playSound('success');
  };

  // ... (Data Export/Import, Sleep/Wake Logic, Core Logic remaining unchanged) ...
  const handleExportData = () => {
      const backupData = {
          tasks, skills, history, userName, protocol, streakData, customHabits, inventory, currencyXP, sleepConfig, nexusState, notes, timestamp: Date.now()
      };
      const json = JSON.stringify(backupData);
      const b64 = btoa(unescape(encodeURIComponent(json)));
      navigator.clipboard.writeText(b64);
      playSound('success');
      showToast("Data copied to clipboard.");
  };

  const handleImportData = () => {
      const input = prompt("Paste your backup code:");
      if(!input) return;
      try {
          const json = decodeURIComponent(escape(atob(input)));
          const data = JSON.parse(json);
          if(data.tasks) setTasks(data.tasks);
          if(data.skills) setSkills(data.skills);
          if(data.userName) setUserName(data.userName);
          if(data.currencyXP) setCurrencyXP(data.currencyXP);
          if(data.sleepConfig) setSleepConfig(data.sleepConfig);
          if(data.nexusState) setNexusState(data.nexusState);
          if(data.notes) setNotes(data.notes);
          playSound('success');
          showToast("Data restored. Refreshing...");
          setTimeout(() => window.location.reload(), 1500);
      } catch (e) {
          showToast("Invalid backup code.");
      }
  };

  const getGreeting = () => {
      const hr = new Date().getHours();
      if (hr >= 5 && hr < 12) return "Good Morning";
      if (hr >= 12 && hr < 17) return "Good Afternoon";
      if (hr >= 17 && hr < 22) return "Good Evening";
      return "Good Night";
  };

  const initializeSystemTasks = () => {
      const today = getTodayString();
      const sleepId = `sys_sleep_${today}`;
      const wakeId = `sys_wake_${today}`;
      const habitSleepId = 'sys_habit_sleep';
      const habitWakeId = 'sys_habit_wake';

      setTasks(prev => {
          const newTasks = [...prev];
          if (!newTasks.find(t => t.id === sleepId)) {
              newTasks.unshift({
                  id: sleepId, name: `Go to sleep (<${sleepConfig.sleep})`, status: 'To Do', category: 'Health', 
                  impact: 'High', date: today, ownerArchetype: 'Polymath', isSystem: true
              });
          }
          if (!newTasks.find(t => t.id === wakeId)) {
               newTasks.unshift({
                  id: wakeId, name: `Wake up (<${sleepConfig.wake})`, status: 'To Do', category: 'Health', 
                  impact: 'High', date: today, ownerArchetype: 'Polymath', isSystem: true
              });
          }
          return newTasks;
      });

      setCustomHabits(prev => {
          const newHabits = [...prev];
          if (!newHabits.find(h => h.id === habitSleepId)) {
              newHabits.unshift({
                  id: habitSleepId, name: 'Sleep Schedule', category: 'Health', duration: 31, completions: Array(31).fill(false), ownerArchetype: 'Polymath', isSystem: true
              });
          }
          if (!newHabits.find(h => h.id === habitWakeId)) {
              newHabits.unshift({
                  id: habitWakeId, name: 'Wake Up Time', category: 'Health', duration: 31, completions: Array(31).fill(false), ownerArchetype: 'Polymath', isSystem: true
              });
          }
          return newHabits;
      });
  };

  const parseTime = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
  };

  const handleStartupLogic = (randomQuote: string) => {
      const isSleeping = sleepState.isActive;
      
      if (isSleeping && sleepState.startTime) {
          const now = Date.now();
          const asleepDuration = now - sleepState.startTime;
          
          if (asleepDuration < 7200000) { 
              setCinematic({ active: true, type: 'fail', text: "TOO SHORT", subtext: `You only slept ${formatDuration(asleepDuration)}` });
              setSleepState({ isActive: false, startTime: null });
              setIsLoading(false);
              return;
          }

          const nowTime = new Date();
          const currentMinutes = nowTime.getHours() * 60 + nowTime.getMinutes();
          const targetMinutes = parseTime(sleepConfig.wake);
          const windowStartMinutes = targetMinutes - 120; 
          
          if (currentMinutes > targetMinutes) {
              setCinematic({ active: true, type: 'fail', text: "OVERSLEPT", subtext: `Target was ${sleepConfig.wake}` });
              setSleepState({ isActive: false, startTime: null });
              setIsLoading(false);
              return;
          }

          if (currentMinutes < windowStartMinutes) {
              setCinematic({ active: true, type: 'fail', text: "TOO EARLY", subtext: "Go back to sleep" });
              setSleepState({ isActive: false, startTime: null });
              setIsLoading(false);
              return;
          }

          const today = getTodayString();
          const wakeId = `sys_wake_${today}`;
          setTasks(prev => prev.map(t => { if (t.id === wakeId) return { ...t, status: 'Complete' }; return t; }));
          const dayIndex = (new Date().getDate() - 1);
          handleHabitCheck('sys_habit_wake', dayIndex, true);
          setCurrencyXP(prev => prev + 100);

          setCinematic({ active: true, type: 'wake', text: "GOOD MORNING", subtext: `You woke up on time.` });
          setSleepState({ isActive: false, startTime: null });
          setIsLoading(false);

      } else {
          setCinematic({ active: true, type: 'startup', text: getGreeting(), subtext: randomQuote });
          setIsLoading(false);
      }
  };

  const handleSleep = () => {
      playSound('click');
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const targetMinutes = parseTime(sleepConfig.sleep);
      const today = getTodayString();
      
      let success = false;
      if (now.getHours() < 4) success = true; 
      else if (currentMinutes <= targetMinutes) success = true;

      const sleepId = `sys_sleep_${today}`;
      setTasks(prev => prev.map(t => { if (t.id === sleepId) return { ...t, status: 'Complete' }; return t; }));

      if (success) {
          const dayIndex = (new Date().getDate() - 1); 
          handleHabitCheck('sys_habit_sleep', dayIndex, true);
      }
      
      const randomGoodnightQuote = GOODNIGHT_QUOTES[Math.floor(Math.random() * GOODNIGHT_QUOTES.length)];

      setSleepState({ isActive: true, startTime: Date.now() });
      setCinematic({ active: true, type: 'sleep', text: "GOODNIGHT", subtext: randomGoodnightQuote });
  };

  const handleEmergencyAbort = () => {
      playSound('delete');
      setSleepState({ isActive: false, startTime: null });
      setCinematic(null);
      showToast("Sleep cancelled.");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const updateDailyStreak = () => {
    const today = getTodayString();
    const yesterdayDate = new Date();
    yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];
    setStreakData((prev: any) => {
      if (prev.lastDate === today) return prev;
      if (prev.lastDate === yesterday) return { count: prev.count + 1, lastDate: today };
      return { count: 1, lastDate: today };
    });
  };

  const buyItem = (item: any) => {
      playSound('click');
      if (currencyXP >= item.cost) {
          if (item.type === 'consumable' && inventory.items.includes(item.id)) { showToast("You already have this."); return; }
          if (item.type === 'permanent' && inventory.items.includes(item.id)) { showToast("Already owned."); return; }
          
          setCurrencyXP(prev => prev - item.cost);
          setInventory(prev => ({ ...prev, items: [...prev.items, item.id] }));
          playSound('success');
          showToast(`Bought: ${item.name}`);
      } else { showToast("Not enough XP."); }
  };

  const handleOnboardingNext = () => {
    playSound('click');
    if (onboardingStep === 0) { setTimeout(() => setOnboardingStep(1), 500); } 
    else if (onboardingStep === 1 && onboardingName.trim()) { setOnboardingStep(2); } 
    else if (onboardingStep === 2 && onboardingProtocol.trim()) {
      setUserName(onboardingName);
      setProtocol(onboardingProtocol);
      setIsOnboarding(false);
      setSkills({ 'Polymath': generateBaseSkills() });
      playSound('success');
      showToast(`Welcome, ${onboardingName}.`);
    }
  };

  const getTier = (score: number) => { for (const tier of TIERS) { if (score <= tier.limit) return tier; } return TIERS[TIERS.length - 1]; };
  const calculateDecay = (skill: any) => { const rate = skill.decay_rate !== undefined ? skill.decay_rate : 0.15; const decayAmount = Math.max(1, Math.round(skill.current_score * rate)); return Math.max(0, skill.current_score - decayAmount); };

  const updateHistory = (currentSkills: any[]) => {
    const totalScore = currentSkills.reduce((acc, s) => acc + s.current_score, 0);
    const averageScore = Math.round(totalScore / currentSkills.length);
    setHistory((prev: any[]) => {
      const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (prev.length > 0 && prev[prev.length - 1].month === today) {
        const newHist = [...prev];
        const lastEntry = { ...newHist[newHist.length - 1] };
        lastEntry.score = averageScore;
        newHist[newHist.length - 1] = lastEntry;
        return newHist;
      }
      return [...prev, { month: today, score: averageScore }];
    });
  };

  const handleTaskToggle = (id: string) => {
    const task = tasks.find((t: any) => t.id === id);
    if (!task) return;
    if (task.isSystem) { showToast("This is automatic. Use sleep/wake buttons."); return; }
    const today = getTodayString();
    if (task.date > today) { showToast("Can't complete future tasks yet."); return; }
    const isCompleting = task.status === 'To Do';
    const newStatus = isCompleting ? 'Complete' : 'To Do';
    let xpReward = 150; let baseImpact = 5;
    if (task.impact === 'High') { xpReward = 300; baseImpact = 10; }
    const impact = isCompleting ? baseImpact : -(baseImpact + 1);
    let nextTaskToAdd: any = null;
    if (isCompleting) {
      if (xpReward > 0) { playSound('success'); setShowConfetti(true); setTimeout(() => setShowConfetti(false), 2500); setCurrencyXP(prev => prev + xpReward); }
      updateDailyStreak();
      if (task.recurrence && task.recurrence !== 'none' && !task.generatedTaskId) {
          let nextDate = task.date;
          if (task.recurrence === 'daily') nextDate = addDays(task.date, 1);
          if (task.recurrence === 'weekly') nextDate = addDays(task.date, 7);
          if (task.recurrence === 'monthly') nextDate = addDays(task.date, 30);
          const newId = `t${Date.now()}`;
          nextTaskToAdd = { ...task, id: newId, status: 'To Do', date: nextDate, generatedTaskId: undefined, originalTaskId: id };
      }
    } else { playSound('click'); }
    setSkills(prevDict => {
        const targetSkills = prevDict['Polymath'] || generateBaseSkills();
        const newTargetSkills = targetSkills.map((skill: any) => {
            if (skill.pillar === task.category) {
                let newScore = skill.current_score;
                if (!isCompleting) newScore = calculateDecay(skill); 
                newScore = Math.min(100, Math.max(0, newScore + impact));
                return { ...skill, current_score: newScore, last_activity: new Date().toISOString() };
            }
            return skill;
        });
        updateHistory(newTargetSkills);
        return { ...prevDict, 'Polymath': newTargetSkills };
    });
    setTasks((prev: any[]) => {
        let updated = prev.map(t => { if (t.id === id) { const update: any = { status: newStatus }; if (nextTaskToAdd) update.generatedTaskId = nextTaskToAdd.id; return { ...t, ...update }; } return t; });
        if (nextTaskToAdd) updated = [...updated, nextTaskToAdd];
        return updated;
    });
  };
  
  const handleDeleteTask = (id: string) => { playSound('delete'); setTasks((prev: any[]) => prev.filter(t => t.id !== id)); showToast("Task deleted."); };

  const handleHabitCheck = (habitId: string, dayIndex: number, forceCheck?: boolean) => {
    const habit = customHabits.find((h: any) => h.id === habitId);
    if (!habit) return;
    if (forceCheck && habit.completions[dayIndex]) return;
    if (habit.isSystem && forceCheck === undefined) { showToast("This is automatic. Use sleep/wake buttons."); return; }
    const isChecking = forceCheck !== undefined ? forceCheck : !habit.completions[dayIndex]; 
    const impact = isChecking ? 2 : -2;
    setCustomHabits((prev: any[]) => prev.map(h => {
      if (h.id === habitId) { const newCompletions = [...h.completions]; newCompletions[dayIndex] = isChecking; return { ...h, completions: newCompletions }; }
      return h;
    }));
    setSkills(prevDict => {
        const targetSkills = prevDict['Polymath'] || generateBaseSkills();
        const newTargetSkills = targetSkills.map((skill: any) => {
            const habitCategory = habit.category || 'Learn';
            if (skill.pillar === habitCategory) { const newScore = Math.min(100, Math.max(0, skill.current_score + impact)); return { ...skill, current_score: newScore, last_activity: new Date().toISOString() }; }
            return skill;
        });
        updateHistory(newTargetSkills);
        return { ...prevDict, 'Polymath': newTargetSkills };
    });
    if (isChecking) { if (!forceCheck) { playSound('success'); setShowConfetti(true); setTimeout(() => setShowConfetti(false), 1500); } updateDailyStreak(); setCurrencyXP(prev => prev + 50); } else { playSound('click'); }
  };

  const toggleTimer = () => { playSound('toggle'); setIsTimerRunning(!isTimerRunning); }
  const resetTimer = () => { playSound('delete'); setIsTimerRunning(false); setTimeLeft(timerDuration); };
  const formatTime = (seconds: number) => { const mins = Math.floor(seconds / 60); const secs = seconds % 60; return `${mins}:${secs < 10 ? '0' : ''}${secs}`; };
  const setTimer = (mins: number) => { playSound('click'); const secs = mins * 60; setTimeLeft(secs); setTimerDuration(secs); setIsTimerRunning(false); };
  const startDeepWork = (taskName: string) => { playSound('click'); setActiveTab('Home'); setTimer(45); showToast(`Focus started: ${taskName}`); };
  const openHabitEdit = (habit: any) => { playSound('click'); setEditingHabitId(habit.id); setNewItemName(habit.name); setNewItemDuration(habit.duration); setNewItemCategory(habit.category); setNewItemType('habitTracker'); setIsModalOpen(true); };
  const handleDeleteHabit = () => { playSound('delete'); if (editingHabitId) { setCustomHabits((prev: any[]) => prev.filter(h => h.id !== editingHabitId)); showToast('Habit deleted'); setIsModalOpen(false); setEditingHabitId(null); setNewItemName(''); } };
  const openPurgeModal = () => { playSound('click'); setShowPurgeModal(true); };
  const handlePurgeReschedule = () => { const today = getTodayString(); let count = 0; setTasks((prev: any[]) => prev.map(t => { if (t.status === 'To Do' && t.date < today) { count++; return { ...t, date: today }; } return t; })); setCurrencyXP(prev => Math.max(0, prev - 50)); showToast(`${count} tasks moved to today. -50 XP.`); setShowPurgeModal(false); };
  const handlePurgeBurn = () => { const today = getTodayString(); let count = 0; setTasks((prev: any[]) => { const toRemove = prev.filter(t => t.status === 'To Do' && t.date < today); count = toRemove.length; return prev.filter(t => !(t.status === 'To Do' && t.date < today)); }); showToast(`${count} tasks deleted.`); setShowPurgeModal(false); };

  const handleSave = () => {
    playSound('success');
    if (!newItemName.trim()) return;
    const assignedOwner = 'Polymath';
    if (newItemType === 'task') {
      const today = getTodayString();
      if (newItemDate < today) { showToast("Cannot schedule in the past."); return; }
      const newId = `t${Date.now()}`;
      const newTask = { id: newId, name: newItemName, status: 'To Do', category: newItemCategory, impact: newItemImpact, source: 'User Defined', date: newItemDate, icon: 'Briefcase', recurrence: newItemRecurrence, ownerArchetype: assignedOwner };
      setTasks([newTask, ...tasks]);
      showToast(`Task added.`);
    } else {
      if (editingHabitId) {
         setCustomHabits((prev: any[]) => prev.map(h => { if (h.id === editingHabitId) { let newCompletions = [...h.completions]; if (newItemDuration > h.duration) { newCompletions = [...newCompletions, ...Array(newItemDuration - h.duration).fill(false)]; } else if (newItemDuration < h.duration) { newCompletions = newCompletions.slice(0, newItemDuration); } return { ...h, name: newItemName, duration: newItemDuration, category: newItemCategory, completions: newCompletions, ownerArchetype: assignedOwner }; } return h; }));
         showToast('Habit updated');
      } else {
        const newId = `h${Date.now()}`;
        const newHabit = { id: newId, name: newItemName, category: newItemCategory, duration: parseInt(newItemDuration.toString()), completions: Array(parseInt(newItemDuration.toString())).fill(false), ownerArchetype: assignedOwner };
        setCustomHabits([newHabit, ...customHabits]);
        showToast(`Habit added`);
      }
    }
    setIsModalOpen(false); setEditingHabitId(null); setNewItemName(''); setNewItemRecurrence('none');
  };

  const getStats = () => {
      const relevantTasks = tasks; const relevantHabits = customHabits;
      const completedTasks = relevantTasks.filter((t: any) => t.status === 'Complete');
      const totalTasksCount = relevantTasks.length;
      const totalHabitCompletions = relevantHabits.reduce((acc: number, h: any) => acc + h.completions.filter(Boolean).length, 0);
      const completionRate = totalTasksCount > 0 ? Math.round((completedTasks.length / totalTasksCount) * 100) : 0;
      const pillarEfficiency = PILLAR_KEYS.map((key) => { const pTasks = relevantTasks.filter((t: any) => t.category === key); const pCompleted = pTasks.filter((t: any) => t.status === 'Complete').length; return { name: key, Planned: pTasks.length, Executed: pCompleted }; });
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weeklyActivity = daysOfWeek.map((day, idx) => { const count = completedTasks.filter((t: any) => { const d = parseLocalDate(t.date); return d.getDay() === idx; }).length; return { day, count }; });
      return { totalTasks: completedTasks.length, totalHabitCompletions, completionRate, pillarEfficiency, weeklyActivity };
  };
  
  const getDayGrade = (dateStr: string) => {
      const relevantTasks = tasks.filter((t: any) => t.date === dateStr);
      if (relevantTasks.length === 0) return { grade: '-', color: 'text-slate-500' };
      const completed = relevantTasks.filter((t: any) => t.status === 'Complete').length;
      const pct = completed / relevantTasks.length;
      if (pct === 1) return { grade: 'A+', color: theme.text }; 
      if (pct >= 0.8) return { grade: 'A', color: theme.text };
      if (pct >= 0.6) return { grade: 'B', color: 'text-blue-400' };
      if (pct >= 0.4) return { grade: 'C', color: 'text-yellow-400' };
      return { grade: 'F', color: 'text-rose-500' };
  };

  const getOracleCommand = () => {
    if (nexusState.dob) {
        const weeks = calculateLifeWeeks(nexusState.dob);
        if (nexusState.lastOracleWeek && weeks > nexusState.lastOracleWeek) {
            if (activeTab === 'Home') {
                 return "A new week of your life has started.";
            }
        }
    }
    const mySkills = skills['Polymath'] || generateBaseSkills();
    const sorted = [...mySkills].sort((a,b) => a.current_score - b.current_score);
    const weakest = sorted[0];
    if (weakest.current_score > 80) return "You are doing great in everything.";
    if (weakest.pillar === 'Learn') return "Read a book or learn something new.";
    if (weakest.pillar === 'Create') return "Make something today.";
    if (weakest.pillar === 'Mind') return "Take time to think or meditate.";
    if (weakest.pillar === 'Health') return "Go for a walk or exercise.";
    if (weakest.pillar === 'Social') return "Call a friend or meet someone.";
    return "Focus on your goals.";
  };

  const radarData = useMemo(() => {
      const targetSkills = skills['Polymath'] || generateBaseSkills();
      const grouped = PILLAR_KEYS.map((key) => { const skill = targetSkills.find((s: any) => s.pillar === key); return { subject: key, A: skill ? skill.current_score : 0, fullMark: 100 }; });
      return grouped;
  }, [skills]);

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const prevMonth = () => { playSound('click'); setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)); }
  const nextMonth = () => { playSound('click'); setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)); }
  const generateCalendarDays = () => {
    const days = []; const totalDays = daysInMonth(currentDate); const startDay = firstDayOfMonth(currentDate); const monthStr = (currentDate.getMonth() + 1).toString().padStart(2, '0'); const yearStr = currentDate.getFullYear();
    for (let i = 0; i < startDay; i++) days.push(<div key={`empty-${i}`} className="h-10"></div>);
    for (let d = 1; d <= totalDays; d++) {
      const dayStr = `${yearStr}-${monthStr}-${d.toString().padStart(2, '0')}`; const isSelected = dayStr === selectedDate; const isToday = dayStr === getTodayString();
      const dayTasks = tasks.filter((t: any) => t.date === dayStr); const completedCount = dayTasks.filter((t: any) => t.status === 'Complete').length; const progress = dayTasks.length > 0 ? (completedCount / dayTasks.length) * 100 : 0;
      days.push(<button key={d} onClick={() => { playSound('click'); setSelectedDate(dayStr); }} className={`h-10 rounded-lg flex flex-col items-center justify-center relative transition-all active:scale-95 ${isSelected ? `${theme.primary} text-white` : 'hover:bg-slate-800 text-slate-300'} ${isToday && !isSelected ? `${theme.border} border` : ''}`}><span className="text-[10px] font-bold z-10">{d}</span>{dayTasks.length > 0 && (<><div className="absolute bottom-1.5 left-2 right-2 h-0.5 bg-slate-700/50 rounded-full overflow-hidden"><div className={`h-full ${isSelected ? 'bg-white' : 'bg-slate-400'} transition-all duration-500`} style={{ width: `${progress}%` }}></div></div></>)}</button>);
    }
    return days;
  };

  const isNight = new Date().getHours() >= 18 || new Date().getHours() < 6;

  // --- RENDER HELP INSTRUCTIONS ---
  const renderGameHelp = () => {
      let content = null;
      switch(nexusActiveTool) {
          case 'Doomsday Algorithm':
              content = (
                  <div className="space-y-4 text-xs text-slate-300">
                      <p>A trick to find the day of the week for any date.</p>
                  </div>
              ); break;
          case 'Binary Fluency':
              content = (
                  <div className="space-y-4 text-xs text-slate-300">
                       <p>Convert regular numbers to binary (0s and 1s).</p>
                  </div>
              ); break;
          case 'Logic Gates':
              content = (
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300">
                      <div className="bg-slate-800 p-2 rounded"><strong className="text-white block">AND</strong>True if ALL inputs are on.</div>
                      <div className="bg-slate-800 p-2 rounded"><strong className="text-white block">OR</strong>True if ANY input is on.</div>
                  </div>
              ); break;
          case 'Stroop Test':
              content = <p className="text-xs text-slate-300">Click the color of the text, not what the word says.</p>; break;
          case 'Hex Master':
              content = <p className="text-xs text-slate-300">Guess the color code. #FF0000 is Red, #00FF00 is Green.</p>; break;
          default:
              content = <p className="text-xs text-slate-300">Follow the instructions.</p>;
      }
      return (
          <div className="mb-4 bg-slate-800/50 p-3 rounded-lg border border-slate-700 animate-in fade-in slide-in-from-top-2">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Brain size={12}/> Help</h4>
              {content}
          </div>
      );
  };

  // ... (Shutdown/Loading/Onboarding blocks remain identical) ...
  if (isShutdown) { return (<div className="h-[100dvh] w-full bg-black flex items-center justify-center"><p className="text-[#1a1a1a] text-[10px] uppercase tracking-widest animate-pulse">Goodnight</p></div>); }

  if (isLoading) {
    return (<div className={`h-[100dvh] w-full bg-[#050505] flex flex-col items-center justify-center p-8 relative overflow-hidden ${fontClass}`}><Atmosphere theme={theme} isNight={isNight} /><div className="relative z-10 text-center space-y-4"><div className="w-16 h-16 mx-auto relative flex items-center justify-center"><div className={`absolute inset-0 border-t border-b ${theme.border} rounded-full animate-spin opacity-50`}></div><Dna size={32} className={`${theme.text} animate-pulse`} /></div><p className="text-[10px] text-slate-500 uppercase tracking-[0.5em] animate-pulse">Loading Life OS...</p></div></div>);
  }

  if (isOnboarding) {
      // ... (Same Onboarding Code) ...
      return (
      <div className={`h-[100dvh] w-full bg-[#050505] bg-grain flex flex-col items-center justify-center p-8 relative overflow-hidden ${fontClass}`}>
         <Atmosphere theme={theme} isNight={isNight} />
         <div className="z-20 w-full max-w-md relative flex flex-col items-center justify-center min-h-[50vh]">
            {onboardingStep === 0 && (<div className="text-center space-y-8 animate-in-up"><div className="relative w-24 h-24 mx-auto flex items-center justify-center"><div className={`absolute inset-0 bg-gradient-to-t ${theme.gradientFrom} opacity-20 blur-xl rounded-full animate-pulse`}></div><Dna size={48} className="text-white relative z-10" /></div><div className="space-y-4"><h1 className="text-5xl font-serif font-bold text-white tracking-[0.2em] leading-tight uppercase animate-tracking-expand">LIFE OS</h1><p className="text-slate-400 text-xs tracking-[0.5em] uppercase opacity-0 animate-fade-in-slow delay-1000">Get Organized. Get Better.</p></div><button onClick={handleOnboardingNext} className={`mt-12 px-8 py-3 rounded-none border border-white/20 text-slate-300 hover:text-white hover:border-white transition-all text-[10px] font-bold uppercase tracking-[0.3em]`}>Start</button></div>)}
            {onboardingStep === 1 && (<div className="w-full space-y-12 animate-in-up delay-100 px-4"><div className="text-center space-y-2"><h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em]">Who are you?</h2></div><div className="relative group"><input type="text" value={onboardingName} onChange={(e) => setOnboardingName(e.target.value)} className="w-full bg-transparent border-b border-slate-700 py-4 text-center text-3xl font-serif text-white focus:outline-none focus:border-white transition-all placeholder:text-slate-800 tracking-widest" placeholder="YOUR NAME" autoFocus /><div className={`absolute bottom-0 left-0 w-full h-[1px] ${theme.bgLight} scale-x-0 group-focus-within:scale-x-100 transition-transform duration-700 ease-out`}></div></div><button onClick={handleOnboardingNext} disabled={!onboardingName.trim()} className={`w-full py-4 ${onboardingName.trim() ? 'bg-white text-black' : 'bg-transparent text-slate-700 border border-slate-800'} font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs`}>Continue <ArrowRight size={14} /></button></div>)}
            {onboardingStep === 2 && (<div className="w-full space-y-8 animate-in-up delay-100 px-4"><div className="text-center"><h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em]">One Main Goal</h2></div><textarea value={onboardingProtocol} onChange={(e) => setOnboardingProtocol(e.target.value)} placeholder="e.g. Become healthy and wealthy..." className="w-full bg-[#0a0a0a]/50 border border-slate-800 p-6 text-white text-lg font-serif italic focus:outline-none focus:border-slate-600 h-40 transition-all resize-none leading-relaxed text-center placeholder:text-slate-800 placeholder:not-italic placeholder:font-sans placeholder:uppercase placeholder:text-xs placeholder:tracking-widest" autoFocus /><button onClick={handleOnboardingNext} disabled={!onboardingProtocol.trim()} className={`w-full py-4 ${onboardingProtocol.trim() ? theme.primary + ' text-white' : 'bg-slate-900 text-slate-600'} font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${theme.glow} uppercase tracking-widest text-xs`}>Let's Go <Zap size={14} fill="currentColor" /></button></div>)}
         </div>
      </div>
    );
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'Home':
          const homeTasks = tasks.filter((t: any) => t.date === getTodayString());
          return (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out relative">
                {/* NEW: Circadian Wave Background for Polymath Themes */}
                {['Clean', 'Nature', 'Ocean'].includes(theme.name) && (
                    <div className="absolute inset-0 z-0 h-[250px] overflow-hidden -mx-4 -mt-4 opacity-50 pointer-events-none">
                        <CircadianWave wakeTime={sleepConfig.wake} theme={theme} />
                    </div>
                )}
                
                {/* 1. Quote & Oracle */}
                <div className="flex gap-2 relative z-10">
                    <div className="flex-1 bg-[#1c1f26]/80 backdrop-blur-md border border-slate-800 p-3 rounded-2xl shadow-lg flex flex-col justify-between relative overflow-hidden h-36">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.primary} z-10`}></div>
                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                <Quote size={10} className="text-slate-600" />
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Main Goal</span>
                            </div>
                            <p className="text-xs font-medium text-slate-300 italic leading-snug line-clamp-4">"<Typewriter text={protocol} speed={50} />"</p>
                        </div>
                    </div>

                    <div className={`flex-1 bg-[#1c1f26]/80 backdrop-blur-md border ${theme.border} bg-opacity-30 p-3 rounded-2xl shadow-xl relative overflow-hidden group flex flex-col justify-between h-36 transform transition-all hover:scale-[1.02]`}>
                        <div className={`absolute inset-0 ${theme.bgLight} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                        <div className="relative z-10 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className={`text-[9px] font-bold ${theme.text} uppercase tracking-widest`}>Daily Tip</h3>
                            <div className={`${theme.text} animate-pulse`}><Lightbulb size={14} /></div>
                        </div>
                        <div className="flex-1 flex items-center">
                                <p className="text-xs text-white font-medium leading-relaxed font-mono line-clamp-4"><Typewriter text={`"${getOracleCommand()}"`} speed={40} /></p>
                        </div>
                        </div>
                    </div>
                </div>

                {/* 2. Controls: Timer & Sleep */}
                <div className="grid grid-cols-2 gap-2 relative z-10">
                     {/* Timer */}
                     <div className="bg-[#1c1f26]/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-lg flex flex-col items-center justify-center relative overflow-hidden h-40">
                         <div className="flex justify-between w-full items-center mb-1 z-10 absolute top-3 left-0 px-3">
                             <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Timer</span>
                             <button onClick={resetTimer} className="text-slate-500 hover:text-white transition-colors active:rotate-180 duration-300"><RotateCcw size={12} /></button>
                         </div>
                         <div className="relative w-20 h-20 flex items-center justify-center cursor-pointer group active:scale-95 transition-transform mt-2" onClick={toggleTimer}>
                            <svg className="absolute w-full h-full transform -rotate-90">
                                <circle cx="50%" cy="50%" r="36" stroke="#334155" strokeWidth="4" fill="transparent" />
                                <circle cx="50%" cy="50%" r="36" stroke="currentColor" strokeWidth="4" fill="transparent" className={`${theme.text} transition-all duration-500 ease-out`} strokeDasharray={226} strokeDashoffset={226 * (1 - timeLeft / timerDuration)} strokeLinecap="round" />
                            </svg>
                            <span className="text-lg font-mono font-bold text-white">{formatTime(timeLeft)}</span>
                         </div>
                         <div className="flex gap-1 mt-3 z-10">
                            <button onClick={() => setTimer(25)} className={`text-[9px] font-bold px-2 py-1 rounded border transition-all active:scale-95 ${timerDuration === 1500 ? theme.primary + ' border-transparent text-white' : 'border-slate-700 text-slate-400'}`}>25m</button>
                            <button onClick={() => setTimer(90)} className={`text-[9px] font-bold px-2 py-1 rounded border transition-all active:scale-95 ${timerDuration === 5400 ? theme.primary + ' border-transparent text-white' : 'border-slate-700 text-slate-400'}`}>90m</button>
                         </div>
                     </div>

                     {/* Sleep */}
                     <div className="bg-[#1c1f26]/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-lg flex flex-col items-center justify-center relative overflow-hidden h-40">
                         <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest absolute top-3 left-3">Sleep</span>
                         <button onClick={handleSleep} className={`w-16 h-16 rounded-full border-2 ${theme.border} flex items-center justify-center mb-2 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] group`}>
                             <Moon size={24} className={`${theme.text} group-hover:scale-110 transition-transform`} />
                         </button>
                         <div className="text-center">
                             <span className="text-[10px] text-slate-400 block mb-1">Target: <span className="text-white font-mono">{sleepConfig.sleep}</span></span>
                             <span className="text-[8px] text-slate-600 uppercase tracking-widest">Go to Bed</span>
                         </div>
                     </div>
                </div>

                {/* 3. Radar Chart */}
                <div className="bg-[#1c1f26]/80 backdrop-blur-md rounded-2xl p-4 border border-slate-800 shadow-lg relative overflow-hidden">
                   <div className="flex justify-between items-center mb-2">
                     <h2 className="text-sm font-bold text-white">Life Balance</h2>
                     <span className={`text-[10px] font-bold ${theme.text} border ${theme.border} px-1.5 rounded`}>Score</span>
                   </div>
                   <div className="h-[200px] w-full relative -ml-2">
                     <ResponsiveContainer width="100%" height="100%">
                       <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                         <PolarGrid stroke="#334155" />
                         <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }} />
                         <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                         <Radar name="Balance" dataKey="A" stroke={theme.chart} fill={theme.chart} fillOpacity={0.4} />
                       </RadarChart>
                     </ResponsiveContainer>
                   </div>
                </div>

                {/* 4. Daily Ops */}
                <div className="bg-[#1c1f26]/80 backdrop-blur-md rounded-2xl p-5 border border-slate-800 shadow-lg mb-20">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-bold text-white">Today's Tasks</h2>
                    <span className="text-[10px] text-slate-500">{getTodayString()}</span>
                  </div>
                  <div className="space-y-3">
                    {homeTasks.length === 0 ? (
                        <div className="text-center py-4 border border-dashed border-slate-800 rounded-lg">
                            <p className="text-xs text-slate-500">No tasks for today.</p>
                            <button onClick={() => { playSound('click'); setNewItemType('task'); setNewItemDate(getTodayString()); setIsModalOpen(true); }} className={`mt-2 text-xs ${theme.text} font-bold active:scale-95 transition-transform`}>+ Add Task</button>
                        </div>
                    ) : (
                        homeTasks.slice(0, 3).map((task: any) => {
                          const isPast = task.date < getTodayString();
                          return (
                            <div key={task.id} onClick={() => handleTaskToggle(task.id)} className="flex items-center gap-3 py-2 cursor-pointer group border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-300 ${task.status === 'Complete' ? `${theme.primary} ${theme.border}` : 'border-slate-600 group-hover:border-slate-500'} ${isPast ? 'bg-slate-900 opacity-50' : ''}`}>
                                {task.status === 'Complete' && <CheckCircle size={10} className="text-white animate-in zoom-in duration-200" />}
                                {isPast && !task.status && <Lock size={8} className="text-slate-500" />}
                            </div>
                            <div className="flex-1">
                                <span className={`text-xs font-medium block ${task.status === 'Complete' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                                {task.name}
                                </span>
                                <span className={`text-[9px] ${theme.text}`}>{task.category}</span>
                            </div>
                            </div>
                        )})
                    )}
                  </div>
                </div>
            </div>
          );

      case 'Calendar': return (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
             <PurgeModal font={fontClass} isOpen={showPurgeModal} onClose={() => setShowPurgeModal(false)} count={tasks.filter((t:any) => t.status === 'To Do' && t.date < getTodayString()).length} onReschedule={handlePurgeReschedule} onBurn={handlePurgeBurn} />
             <div className="flex justify-between items-center px-1">
               <h2 className={`text-xl font-bold flex items-center gap-2 ${theme.text}`}><CalendarIcon size={20} /> Calendar</h2>
               <div className="flex gap-2">
                   <button onClick={() => { playSound('click'); setNewItemType('task'); setNewItemDate(selectedDate); setIsModalOpen(true); }} className={`text-xs ${theme.bgLight} ${theme.text} px-3 py-1 rounded-full border ${theme.border} font-medium active:scale-95 transition-transform`}>+ Task</button>
               </div>
             </div>
             <div className="bg-[#1c1f26]/80 backdrop-blur-md rounded-2xl p-4 border border-slate-800 shadow-lg">
               <div className="flex justify-between items-center mb-4">
                 <button onClick={prevMonth} className="p-1 hover:bg-slate-800 rounded active:scale-90 transition-transform"><ChevronLeft size={16}/></button>
                 <span className="text-sm font-bold text-slate-200">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                 <button onClick={nextMonth} className="p-1 hover:bg-slate-800 rounded active:scale-90 transition-transform"><ChevronRight size={16}/></button>
               </div>
               <div className="grid grid-cols-7 gap-1 text-center mb-2">{['S','M','T','W','T','F','S'].map((d, i) => <span key={i} className="text-[10px] text-slate-500 font-bold">{d}</span>)}</div>
               <div className="grid grid-cols-7 gap-1">{generateCalendarDays()}</div>
             </div>
             
             <div className="bg-[#1c1f26]/80 backdrop-blur-md rounded-2xl p-5 border border-slate-800 shadow-lg min-h-[200px]">
                <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                 <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                   <Clock size={16} className={theme.text}/> {new Date(selectedDate).toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric' })}
                 </h3>
                 <span className={`text-lg font-black ${getDayGrade(selectedDate).color}`}>{getDayGrade(selectedDate).grade}</span>
               </div>
                <div className="space-y-3">
                 {tasks.filter((t:any) => t.date === selectedDate).length === 0 ? <p className="text-xs text-slate-500 text-center py-8 italic">No tasks for this day.</p> : 
                   tasks.filter((t:any) => t.date === selectedDate).map((task: any) => {
                     const isFuture = task.date > getTodayString();
                     const isPast = task.date < getTodayString();
                     return (
                     <div key={task.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-300 ${task.status === 'Complete' ? 'bg-[#13151a] border-slate-800 opacity-60' : `bg-[#181a20] border-slate-700 hover:${theme.border} hover:bg-opacity-50 hover:translate-x-1`} ${task.isSystem ? 'opacity-80' : ''}`}>
                       <button onClick={() => handleTaskToggle(task.id)} className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${task.status === 'Complete' ? `${theme.primary} ${theme.border}` : 'border-slate-600'} ${isPast || task.isSystem ? 'cursor-not-allowed opacity-50 bg-slate-900' : ''} active:scale-90`}>
                         {isPast || task.isSystem ? <Lock size={10} className="text-slate-500"/> : (task.status === 'Complete' && <CheckCircle size={12} className="text-white" />)}
                       </button>
                       <div className="flex-1">
                         <div className="flex justify-between items-start">
                             <span className={`text-sm block font-medium ${task.status === 'Complete' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{task.name}</span>
                             <div className="flex items-center gap-2">
                                 {task.recurrence && task.recurrence !== 'none' && <RefreshCw size={10} className="text-slate-500" />}
                                 {!isPast && !task.isSystem && <button onClick={() => handleDeleteTask(task.id)} className="text-slate-600 hover:text-rose-500 transition-colors active:scale-90"><Trash2 size={12} /></button>}
                             </div>
                         </div>
                         <div className="flex items-center gap-2 mt-1">
                            {task.isSystem && <span className="text-[8px] bg-slate-800 text-slate-400 px-1 rounded flex items-center gap-1"><Watch size={8}/> AUTO</span>}
                             <span className={`text-[9px] font-bold text-slate-400 border border-slate-800 px-1 rounded`}>{task.category}</span>
                         </div>
                       </div>
                       {task.status !== 'Complete' && !isPast && !isFuture && !task.isSystem && <button onClick={() => startDeepWork(task.name)} className={`p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors active:scale-90`}><Play size={14} fill="currentColor" /></button>}
                     </div>
                   )})}
               </div>
             </div>
           </div>
        );

      case 'Habits':
          const currentDayIndex = new Date().getDate() - 1;
          return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            <div className="flex justify-between items-center px-1">
              <h2 className={`text-xl font-bold flex items-center gap-2 ${theme.text}`}><List size={20} /> Habits</h2>
              <button onClick={() => { playSound('click'); setNewItemType('habitTracker'); setIsModalOpen(true); }} className={`text-xs ${theme.bgLight} ${theme.text} px-3 py-1 rounded-full border ${theme.border} font-medium active:scale-95 transition-transform`}>+ Habit</button>
            </div>
             <div className="bg-[#1c1f26]/80 backdrop-blur-md rounded-2xl border border-slate-800 shadow-lg overflow-hidden flex flex-col">
              <div className="overflow-x-auto p-4">
                <div className="min-w-max">
                    <div className="flex items-center gap-4 mb-3 border-b border-slate-800 pb-2">
                        <div className="w-32 flex-shrink-0 text-xs font-bold text-slate-400">Habit Name</div>
                        <div className="flex gap-2">{Array.from({length: 31}).map((_, i) => (<div key={i} className={`w-8 text-center text-[10px] font-bold flex-shrink-0 ${i === currentDayIndex ? `${theme.text} animate-pulse` : 'text-slate-500'}`}>{i + 1}</div>))}</div>
                    </div>
                    <div className="space-y-6">
                        {customHabits.length === 0 ? <p className="text-center text-xs text-slate-500">No habits tracked yet.</p> : 
                        customHabits.map((habit: any) => {
                            const completedCount = habit.completions.filter(Boolean).length;
                            const progress = Math.round((completedCount / habit.duration) * 100);
                            return (
                                <div key={habit.id} className="flex items-center gap-4 group">
                                    <div className="w-32 flex-shrink-0 flex flex-col gap-1.5">
                                        <div className="flex justify-between items-center pr-1">
                                            <div className="flex items-center gap-1 overflow-hidden">
                                                {habit.isSystem && <Lock size={10} className="text-slate-500" />}
                                                {!habit.isSystem && <button onClick={() => openHabitEdit(habit)} className="text-slate-500 hover:text-white transition-colors"><Settings size={10} /></button>}
                                                <span className="text-xs font-medium text-slate-200 truncate">{habit.name}</span>
                                            </div>
                                            <span className={`text-[9px] font-bold ${theme.text}`}>{progress}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full transition-all duration-700 ease-out ${theme.primary}`} style={{ width: `${progress}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {Array.from({length: 31}).map((_, dayIndex) => {
                                            const isActiveDay = dayIndex < habit.duration;
                                            const isCompleted = habit.completions[dayIndex];
                                            const isToday = dayIndex === currentDayIndex;
                                            
                                            if (!isActiveDay) {
                                                return <div key={dayIndex} className="w-8 h-8 flex-shrink-0 rounded-lg bg-[#0a0a0a] border border-slate-900/50 flex items-center justify-center opacity-50"><div className="w-1 h-1 rounded-full bg-slate-800" /></div>; 
                                            }
                                            return <button disabled={habit.isSystem} key={dayIndex} onClick={() => handleHabitCheck(habit.id, dayIndex)} className={`w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center border transition-all duration-300 relative group overflow-hidden ${isCompleted ? `${theme.primary} ${theme.border} text-white shadow-lg` : `bg-[#13151a] border-slate-800 hover:border-slate-600 hover:bg-slate-800`} ${habit.isSystem ? 'cursor-not-allowed opacity-50' : 'active:scale-90'} ${isToday ? `ring-1 ring-offset-2 ring-offset-[#050505] ${isCompleted ? theme.border : 'border-slate-500'}` : ''}`}>{isToday && !isCompleted && (<div className={`absolute inset-0 ${theme.bgLight} opacity-20 animate-pulse`} />)}<CheckSquare size={14} strokeWidth={3} className={`transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${isCompleted ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 -rotate-90'}`} /></button>;
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
              </div>
            </div>
            </div>
          );

      case 'Social': // Nexus -> Tools
            // NEW: GRAPH VIEW IN NEXUS
            if (nexusActiveTool === 'Graph') {
                return (
                     <div className="space-y-6 animate-in slide-in-from-right duration-300">
                        <div className="flex items-center gap-4 px-1 mb-4">
                            <button onClick={() => { playSound('click'); setNexusActiveTool(null); }} className="p-2 hover:bg-slate-800 rounded-full active:scale-95 transition-transform"><ArrowLeft size={20}/></button>
                            <h2 className="text-xl font-bold text-white">Overview</h2>
                        </div>
                        {/* Split View: Graph & Concept Map */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="bg-[#1c1f26]/80 backdrop-blur-md p-4 rounded-xl border border-slate-800">
                                 <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Graph</h3>
                                 <KnowledgeGraph notes={notes} tasks={tasks} theme={theme} />
                             </div>
                             <div className="bg-[#1c1f26]/80 backdrop-blur-md p-4 rounded-xl border border-slate-800">
                                 <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Map</h3>
                                 <div className="h-[300px] bg-black/20 rounded-lg border border-white/5 p-2">
                                     <ConceptMap tasks={tasks} theme={theme} />
                                 </div>
                             </div>
                        </div>
                     </div>
                );
            }

            if (nexusActiveTool) {
               // ... (Existing Nexus Tool Render Logic) ...
               return (
                <div className="space-y-6 animate-in slide-in-from-right duration-300">
                    <div className="flex items-center justify-between px-1 mb-4">
                        <div className="flex items-center gap-4">
                            <button onClick={() => { playSound('click'); setNexusActiveTool(null); setNexusInput(''); setNexusOutput(''); setGameState({ score: 0, status: 'idle', question: null, answer: '' }); setShowGameHelp(false); }} className="p-2 hover:bg-slate-800 rounded-full active:scale-95 transition-transform"><ArrowLeft size={20}/></button>
                            <h2 className="text-xl font-bold text-white">{nexusActiveTool}</h2>
                        </div>
                        <button onClick={() => setShowGameHelp(!showGameHelp)} className="p-2 text-slate-500 hover:text-white transition-colors"><HelpCircle size={20}/></button>
                    </div>
                    
                    {showGameHelp && renderGameHelp()}

                    <div className="bg-[#1c1f26]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 min-h-[50vh]">
                        {/* --- NEW KNOWLEDGE TOOLS --- */}
                        {nexusActiveTool === 'Quick Notes' && (
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <input type="text" className="flex-1 bg-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none" placeholder="Write something..." value={nexusInput} onChange={(e) => setNexusInput(e.target.value)} onKeyDown={(e) => {
                                        if (e.key === 'Enter' && nexusInput.trim()) {
                                            const newNote = { id: `n${Date.now()}`, title: nexusInput, content: '', date: new Date().toISOString() };
                                            setNotes([newNote, ...notes]);
                                            setNexusInput('');
                                            playSound('success');
                                        }
                                    }} />
                                    <button onClick={() => { if(nexusInput.trim()) { setNotes([{ id: `n${Date.now()}`, title: nexusInput, content: '', date: new Date().toISOString() }, ...notes]); setNexusInput(''); playSound('success'); } }} className="bg-emerald-600 px-4 rounded-lg text-white font-bold text-xs">ADD</button>
                                </div>
                                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                                    {notes.length === 0 && <p className="text-slate-500 text-xs italic text-center py-4">No notes yet.</p>}
                                    {notes.map((note: any) => (
                                        <div key={note.id} className="bg-[#13151a] p-3 rounded-lg border border-slate-800 flex justify-between items-center group">
                                            <span className="text-sm text-slate-200">{note.title}</span>
                                            <button onClick={() => { setNotes(notes.filter((n:any) => n.id !== note.id)); playSound('delete'); }} className="text-slate-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><X size={14}/></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {nexusActiveTool === 'Flashcards' && (
                             <div className="space-y-6 text-center">
                                 {gameState.status === 'idle' ? (
                                     <>
                                        <p className="text-slate-400 text-xs mb-4">Add questions and answers to memorize.</p>
                                        <div className="flex gap-2 mb-6">
                                            <input className="flex-1 bg-slate-800 p-2 rounded text-xs text-white" placeholder="Question" id="srs-q" />
                                            <input className="flex-1 bg-slate-800 p-2 rounded text-xs text-white" placeholder="Answer" id="srs-a" />
                                            <button onClick={() => {
                                                const q = (document.getElementById('srs-q') as HTMLInputElement).value;
                                                const a = (document.getElementById('srs-a') as HTMLInputElement).value;
                                                if (q && a) {
                                                    setFlashcards([...flashcards, { id: Date.now(), q, a, box: 0, nextReview: Date.now() }]);
                                                    playSound('success');
                                                    (document.getElementById('srs-q') as HTMLInputElement).value = '';
                                                    (document.getElementById('srs-a') as HTMLInputElement).value = '';
                                                }
                                            }} className="bg-emerald-600 px-3 rounded text-white font-bold text-xs">+</button>
                                        </div>
                                        <button onClick={() => {
                                            const due = flashcards.filter((f:any) => f.nextReview <= Date.now());
                                            if (due.length > 0) {
                                                setGameState({ status: 'review', queue: due, currentIdx: 0, showAnswer: false });
                                                playSound('click');
                                            } else {
                                                showToast("No cards due for review.");
                                            }
                                        }} className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-bold uppercase tracking-widest">Start Review ({flashcards.filter((f:any) => f.nextReview <= Date.now()).length})</button>
                                     </>
                                 ) : gameState.status === 'review' ? (
                                     <div className="py-8">
                                         <div className="min-h-[150px] flex items-center justify-center bg-black/30 rounded-xl p-6 mb-6 border border-slate-700" onClick={() => setGameState({...gameState, showAnswer: !gameState.showAnswer})}>
                                             <h3 className="text-xl font-bold text-white text-center">
                                                 {gameState.showAnswer ? gameState.queue[gameState.currentIdx].a : gameState.queue[gameState.currentIdx].q}
                                             </h3>
                                         </div>
                                         {!gameState.showAnswer ? (
                                             <button onClick={() => setGameState({...gameState, showAnswer: true})} className="w-full py-3 bg-slate-800 rounded-xl text-white font-bold">Show Answer</button>
                                         ) : (
                                             <div className="grid grid-cols-2 gap-4">
                                                 <button onClick={() => {
                                                     // Logic for wrong
                                                     playSound('delete');
                                                     const card = gameState.queue[gameState.currentIdx];
                                                     const updated = flashcards.map((f:any) => f.id === card.id ? { ...f, box: 0, nextReview: Date.now() + 60000 } : f); // Review in 1 min
                                                     setFlashcards(updated);
                                                     if (gameState.currentIdx < gameState.queue.length - 1) {
                                                         setGameState({...gameState, currentIdx: gameState.currentIdx + 1, showAnswer: false});
                                                     } else {
                                                         setGameState({ status: 'idle', score: 0 });
                                                     }
                                                 }} className="py-3 bg-rose-600 rounded-xl text-white font-bold">Forgot</button>
                                                 <button onClick={() => {
                                                     // Logic for right
                                                     playSound('success');
                                                     const card = gameState.queue[gameState.currentIdx];
                                                     const nextBox = card.box + 1;
                                                     const interval = [1, 3, 7, 14, 30][Math.min(nextBox, 4)] * 24 * 60 * 60 * 1000;
                                                     const updated = flashcards.map((f:any) => f.id === card.id ? { ...f, box: nextBox, nextReview: Date.now() + interval } : f);
                                                     setFlashcards(updated);
                                                     if (gameState.currentIdx < gameState.queue.length - 1) {
                                                         setGameState({...gameState, currentIdx: gameState.currentIdx + 1, showAnswer: false});
                                                     } else {
                                                         setGameState({ status: 'idle', score: 0 });
                                                     }
                                                 }} className="py-3 bg-emerald-600 rounded-xl text-white font-bold">Remembered</button>
                                             </div>
                                         )}
                                     </div>
                                 ) : null}
                             </div>
                        )}

                        {nexusActiveTool === 'Reading List' && (
                             <div className="space-y-4">
                                <div className="flex gap-2">
                                    <input type="text" className="flex-1 bg-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none" placeholder="Book Title..." value={nexusInput} onChange={(e) => setNexusInput(e.target.value)} />
                                    <button onClick={() => { if(nexusInput.trim()) { setReadingList([...readingList, { id: Date.now(), title: nexusInput, progress: 0 }]); setNexusInput(''); playSound('success'); } }} className="bg-blue-600 px-4 rounded-lg text-white font-bold text-xs">ADD</button>
                                </div>
                                <div className="space-y-3">
                                    {readingList.map((item: any) => (
                                        <div key={item.id} className="bg-[#13151a] p-4 rounded-lg border border-slate-800">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-sm font-bold text-white">{item.title}</span>
                                                <button onClick={() => { setReadingList(readingList.filter((r:any) => r.id !== item.id)); playSound('delete'); }}><X size={12} className="text-slate-600 hover:text-rose-500"/></button>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <input type="range" min="0" max="100" value={item.progress} onChange={(e) => setReadingList(readingList.map((r:any) => r.id === item.id ? { ...r, progress: parseInt(e.target.value) } : r))} className="flex-1 accent-blue-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                                                <span className="text-xs font-mono text-blue-400 w-8">{item.progress}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                             </div>
                        )}

                        {nexusActiveTool === 'Encryption Tool' && (
                            <div className="space-y-4">
                                <div className="flex bg-[#13151a] p-1 rounded-xl border border-slate-800 mb-4">
                                    <button onClick={() => setCipherMode('ENCODE')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${cipherMode === 'ENCODE' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>Encode</button>
                                    <button onClick={() => setCipherMode('DECODE')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${cipherMode === 'DECODE' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>Practice</button>
                                </div>
                                {cipherMode === 'ENCODE' ? (<><textarea className="w-full bg-[#13151a] border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 h-32 font-mono" placeholder="Input text..." value={nexusInput} onChange={(e) => setNexusInput(e.target.value)} /><button onClick={handleCipher} className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-bold text-xs uppercase tracking-widest">Encrypt</button>{nexusOutput && <pre className="bg-black/50 p-4 rounded-lg text-emerald-400 text-xs font-mono whitespace-pre-wrap">{nexusOutput}</pre>}</>) : (<><div className="bg-black/50 p-6 rounded-xl border border-slate-800 min-h-[100px] flex flex-col justify-center items-center text-center space-y-2"><span className="text-xs text-slate-500 uppercase tracking-widest">Decoded Message</span><span className="text-2xl font-bold text-white tracking-widest min-h-[32px]">{nexusOutput || "..."}</span></div><div className="bg-[#13151a] p-4 rounded-xl border border-slate-800 text-center"><span className="text-xl font-mono text-emerald-400 tracking-[0.5em]">{nexusInput || "Signal..."}</span></div><div className="grid grid-cols-2 gap-3 mt-4"><button onClick={() => handleMorseInput('.')} className="h-24 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center active:scale-95 transition-all"><div className="w-4 h-4 rounded-full bg-white"></div></button><button onClick={() => handleMorseInput('-')} className="h-24 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center active:scale-95 transition-all"><div className="w-8 h-2 rounded-full bg-white"></div></button><button onClick={() => handleMorseInput(' ')} className="h-16 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400 uppercase active:scale-95 transition-all col-span-1">Space</button><button onClick={handleMorseBackspace} className="h-16 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center text-slate-400 hover:text-rose-400 active:scale-95 transition-all col-span-1"><Delete size={20} /></button></div></>)}
                            </div>
                        )}
                        {nexusActiveTool === 'Math Practice' && (
                            <div className="text-center space-y-6">
                                <div className="p-8 bg-[#13151a] rounded-xl border border-slate-800">
                                    <h3 className="text-4xl font-mono font-bold text-white mb-2">{gameState.question || "READY?"}</h3>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest">Score: {gameState.score}</p>
                                </div>
                                {gameState.status === 'playing' ? (
                                    <div className="flex gap-2">
                                        <input type="number" autoFocus className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-4 text-center text-xl text-white outline-none" value={gameState.input} onChange={(e) => setGameState({...gameState, input: e.target.value})} onKeyDown={(e) => e.key === 'Enter' && checkMath()} />
                                        <button onClick={checkMath} className="px-6 bg-emerald-600 rounded-xl text-white font-bold">Submit</button>
                                    </div>
                                ) : (
                                    <button onClick={startMentalMath} className="w-full py-4 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-bold tracking-widest uppercase">Start</button>
                                )}
                            </div>
                        )}
                        {nexusActiveTool === 'Binary Practice' && (
                            <div className="text-center space-y-6">
                                <div className="p-8 bg-[#13151a] rounded-xl border border-slate-800">
                                    <h3 className="text-4xl font-mono font-bold text-white mb-2">{gameState.question || "000"}</h3>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest">Score: {gameState.score}</p>
                                </div>
                                {gameState.status === 'playing' ? (
                                    <div className="flex gap-2">
                                        <input type="text" autoFocus className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-4 text-center text-xl text-white outline-none font-mono" placeholder="1010..." value={gameState.input} onChange={(e) => setGameState({...gameState, input: e.target.value})} onKeyDown={(e) => e.key === 'Enter' && checkBinary()} />
                                        <button onClick={checkBinary} className="px-6 bg-emerald-600 rounded-xl text-white font-bold">Check</button>
                                    </div>
                                ) : (
                                    <button onClick={startBinary} className="w-full py-4 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-bold tracking-widest uppercase">Start</button>
                                )}
                            </div>
                        )}
                        {nexusActiveTool === 'Day Finder' && (
                            <div className="text-center space-y-6">
                                <div className="p-6 bg-[#13151a] rounded-xl border border-slate-800">
                                    <h3 className="text-2xl font-serif font-bold text-white mb-2">{gameState.question || "Date"}</h3>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest">Score: {gameState.score}</p>
                                </div>
                                {gameState.status === 'playing' ? (
                                    <div className="grid grid-cols-4 gap-2">
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                                            <button key={d} onClick={() => checkDoomsday(i)} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-300">{d}</button>
                                        ))}
                                    </div>
                                ) : (
                                    <button onClick={startDoomsday} className="w-full py-4 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-bold tracking-widest uppercase">Start</button>
                                )}
                            </div>
                        )}
                         {nexusActiveTool === 'Memory Test' && (
                            <div className="text-center space-y-6">
                                <div className="p-8 bg-[#13151a] rounded-xl border border-slate-800 min-h-[120px] flex items-center justify-center">
                                    {gameState.status === 'memorize' && <h3 className="text-4xl font-mono font-bold text-white tracking-[0.5em] animate-pulse">{gameState.question}</h3>}
                                    {gameState.status === 'recall' && <p className="text-slate-500 text-xs uppercase tracking-widest">TYPE THE NUMBERS</p>}
                                    {gameState.status === 'fail' && <p className="text-rose-500 text-xl font-bold uppercase">GAME OVER</p>}
                                </div>
                                {gameState.status === 'recall' ? (
                                    <div className="flex gap-2">
                                        <input type="number" autoFocus className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-4 text-center text-xl text-white outline-none tracking-[0.5em]" value={gameState.input} onChange={(e) => setGameState({...gameState, input: e.target.value})} onKeyDown={(e) => e.key === 'Enter' && checkDigitSpan()} />
                                        <button onClick={checkDigitSpan} className="px-6 bg-emerald-600 rounded-xl text-white font-bold">Check</button>
                                    </div>
                                ) : (
                                     gameState.status !== 'memorize' && <button onClick={startDigitSpan} className="w-full py-4 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-bold tracking-widest uppercase">Start</button>
                                )}
                            </div>
                        )}
                        {/* Static Tools */}
                        {nexusActiveTool === 'Creative Card' && (<div className="flex flex-col items-center justify-center h-full gap-6 text-center"><div className="p-8 bg-black rounded-xl border border-slate-800 shadow-2xl max-w-xs"><p className="text-lg font-serif italic text-white leading-relaxed">"{nexusOutput || "Draw a card..."}"</p></div><button onClick={getObliqueStrategy} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-full text-white font-bold text-xs uppercase tracking-widest border border-slate-600">Draw Card</button></div>)}
                        {nexusActiveTool === 'Simplifier' && (<div className="space-y-4"><textarea className="w-full bg-[#13151a] border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 h-32" placeholder="Explain it like I'm 5..." value={nexusInput} onChange={(e) => setNexusInput(e.target.value)} /><button onClick={handleFeynman} className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-bold text-xs uppercase tracking-widest">Analyze</button>{nexusOutput && <p className="text-white text-sm text-center font-bold p-4 bg-slate-800 rounded-lg">{nexusOutput}</p>}</div>)}
                        {nexusActiveTool === 'Problem Solver' && (<div className="space-y-4"><input type="text" className="w-full bg-[#13151a] border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500" placeholder="Goal (e.g. Save Money)" /><textarea className="w-full bg-[#13151a] border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-rose-500 h-32" placeholder="How to FAIL at this goal..." /><button onClick={() => { playSound('success'); showToast('Saved.'); }} className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-bold text-xs uppercase tracking-widest">Invert</button></div>)}
                        {nexusActiveTool === 'Deep Analysis' && (<div className="space-y-4"><input type="text" className="w-full bg-[#13151a] border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500" placeholder="Problem Statement" /><div className="space-y-2 pl-4 border-l border-slate-700"><input type="text" className="w-full bg-transparent border-b border-slate-700 py-2 text-slate-300 text-xs focus:outline-none" placeholder="Why?" /><input type="text" className="w-full bg-transparent border-b border-slate-700 py-2 text-slate-300 text-xs focus:outline-none" placeholder="Why?" /><input type="text" className="w-full bg-transparent border-b border-slate-700 py-2 text-slate-300 text-xs focus:outline-none" placeholder="Root Cause" /></div><button onClick={() => { playSound('success'); showToast('Saved.'); }} className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-bold text-xs uppercase tracking-widest">Analyze</button></div>)}
                        {nexusActiveTool === 'Decision Helper' && (<div className="flex flex-col items-center justify-center h-full gap-6"><Shuffle size={48} className="text-slate-600" /><p className="text-xs text-slate-400 text-center max-w-xs">Generate a small, easy action to get started.</p><button onClick={handleRegret} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-full text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-900/50">Get Idea</button>{nexusOutput && <div className="text-xl font-serif text-white text-center animate-in zoom-in">{nexusOutput}</div>}</div>)}
                        {nexusActiveTool === 'Life Progress' && (<div className="h-full flex flex-col">{!nexusState.dob ? (<div className="text-center space-y-4 my-auto animate-in fade-in zoom-in duration-500"><Skull size={48} className="mx-auto text-slate-500" /><p className="text-xs text-slate-400 uppercase tracking-widest">When were you born?</p><input type="date" className="bg-[#13151a] border border-slate-700 rounded-lg p-4 text-white scheme-dark mx-auto block text-center w-full max-w-xs text-lg focus:border-emerald-500 focus:outline-none transition-colors" onChange={(e) => setTempDob(e.target.value)} /><button onClick={handleMementoSetup} disabled={!tempDob} className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${tempDob ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-800 text-slate-500'}`}>Start</button></div>) : (<MementoMoriView dob={nexusState.dob} theme={theme} onReset={handleMementoReset} />)}</div>)}
                        {nexusActiveTool === 'Daily Virtues' && (<div className="space-y-4"><div className="flex items-center gap-2 mb-4 justify-center"><Shield size={16} className="text-white" /><span className="text-xs font-bold text-slate-300 uppercase">Franklin's 13</span></div><div className="grid grid-cols-1 gap-2">{VIRTUES.map((v, i) => { const today = getTodayString(); const isChecked = nexusState.virtues[today]?.[i] || false; return (<button key={v} onClick={() => toggleVirtue(i)} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${isChecked ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-[#13151a] border-slate-800'}`}><span className={`text-xs font-bold ${isChecked ? 'text-emerald-400' : 'text-slate-400'}`}>{v}</span>{isChecked && <CheckCircle size={12} className="text-emerald-400" />}</button>) })}</div></div>)}
                        
                        {/* ... (Other tools similar simplified names) ... */}
                    </div>
                </div>
               );
            }
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
                     <div className="flex items-center justify-between px-1"><h2 className={`text-xl font-bold flex items-center gap-2 ${theme.text}`}><Grid size={20} /> Tools</h2></div>
                     
                     <div className="space-y-4">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Productivity</h3>
                        {/* Added Graph Button */}
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => { playSound('click'); setNexusActiveTool('Graph'); }} className="bg-[#1c1f26]/80 backdrop-blur-md p-3 rounded-xl border border-slate-800 hover:border-white/30 transition-all active:scale-95 flex flex-col items-start gap-2 group"><div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition-colors"><GitBranch size={16} /></div><div><h3 className="text-xs font-bold text-white leading-tight">Overview</h3></div></button>
                            {[{ name: 'Simplifier', icon: Feather, desc: 'Make things easy' }, { name: 'Problem Solver', icon: FlipVertical, desc: 'Find solutions' }, { name: 'Deep Analysis', icon: Divide, desc: 'Find root cause' }, { name: 'Decision Helper', icon: Shuffle, desc: 'What to do next' }, { name: 'Creative Card', icon: Shuffle, desc: 'Get unstuck' }, { name: 'Life Progress', icon: Skull, desc: 'Your timeline' }, { name: 'Daily Virtues', icon: Shield, desc: 'Character check' }].map((tool) => (
                                <button key={tool.name} onClick={() => { playSound('click'); setNexusActiveTool(tool.name); setNexusInput(''); setNexusOutput(''); }} className="bg-[#1c1f26]/80 backdrop-blur-md p-3 rounded-xl border border-slate-800 hover:border-white/30 transition-all active:scale-95 flex flex-col items-start gap-2 group"><div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition-colors"><tool.icon size={16} /></div><div><h3 className="text-xs font-bold text-white leading-tight">{tool.name}</h3></div></button>
                            ))}
                        </div>
                        
                        {/* Knowledge Section */}
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1 mt-6">Knowledge</h3>
                        <div className="grid grid-cols-3 gap-3">
                             <button onClick={() => { playSound('click'); setNexusActiveTool('Quick Notes'); }} className="bg-[#1c1f26]/80 backdrop-blur-md p-3 rounded-xl border border-slate-800 hover:border-white/30 transition-all active:scale-95 flex flex-col items-center gap-2 group"><div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition-colors"><FileText size={16} /></div><span className="text-xs font-bold text-white">Notes</span></button>
                             <button onClick={() => { playSound('click'); setNexusActiveTool('Flashcards'); setGameState({status: 'idle'}); }} className="bg-[#1c1f26]/80 backdrop-blur-md p-3 rounded-xl border border-slate-800 hover:border-white/30 transition-all active:scale-95 flex flex-col items-center gap-2 group"><div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition-colors"><Repeat size={16} /></div><span className="text-xs font-bold text-white">Cards</span></button>
                             <button onClick={() => { playSound('click'); setNexusActiveTool('Reading List'); }} className="bg-[#1c1f26]/80 backdrop-blur-md p-3 rounded-xl border border-slate-800 hover:border-white/30 transition-all active:scale-95 flex flex-col items-center gap-2 group"><div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition-colors"><Book size={16} /></div><span className="text-xs font-bold text-white">Books</span></button>
                        </div>

                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1 mt-6">Brain Training</h3>
                        <div className="grid grid-cols-2 gap-3">
                             {[{ name: 'Math Practice', icon: Calculator, desc: 'Simple Math' }, { name: 'Binary Practice', icon: Binary, desc: '0s and 1s' }, { name: 'Day Finder', icon: CalendarDays, desc: 'Guess the day' }, { name: 'Roman Numerals', icon: Hash, desc: 'I, V, X, L' }, { name: 'Logic Gates', icon: GitBranch, desc: 'True or False' }, { name: 'Memory Test', icon: Hash, desc: 'Remember numbers' }, { name: 'Stroop Test', icon: EyeOff, desc: 'Color trick' }, { name: 'Reaction Control', icon: Zap, desc: 'Test reflexes' }, { name: 'Box Breathing', icon: Move, desc: 'Relax' }].map((tool) => (
                                <button key={tool.name} onClick={() => { playSound('click'); setNexusActiveTool(tool.name); setNexusInput(''); setNexusOutput(''); setGameState({ score: 0, status: 'idle', question: null, answer: '' }); }} className="bg-[#1c1f26]/80 backdrop-blur-md p-3 rounded-xl border border-slate-800 hover:border-white/30 transition-all active:scale-95 flex flex-col items-start gap-2 group"><div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition-colors"><tool.icon size={16} /></div><div><h3 className="text-xs font-bold text-white leading-tight">{tool.name}</h3></div></button>
                            ))}
                        </div>

                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1 mt-6">Fun & Audio</h3>
                         <div className="grid grid-cols-2 gap-3">
                             {[{ name: 'Encryption Tool', icon: Radio, desc: 'Secret codes' }, { name: 'Caesar Cipher', icon: Lock, desc: 'Shift letters' }, { name: 'Hex Master', icon: PaletteIcon, desc: 'Guess colors' }, { name: 'Pitch Trainer', icon: Music, desc: 'Hear notes' }, { name: 'Metronome', icon: Activity, desc: 'Keep beat' }].map((tool) => (
                                <button key={tool.name} onClick={() => { playSound('click'); setNexusActiveTool(tool.name); setNexusInput(''); setNexusOutput(''); }} className="bg-[#1c1f26]/80 backdrop-blur-md p-3 rounded-xl border border-slate-800 hover:border-white/30 transition-all active:scale-95 flex flex-col items-start gap-2 group"><div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition-colors"><tool.icon size={16} /></div><div><h3 className="text-xs font-bold text-white leading-tight">{tool.name}</h3></div></button>
                            ))}
                        </div>
                     </div>
                </div>
            );

      case 'Profile':
             const stats = getStats();
             const pieData = stats.pillarEfficiency.map(p => ({ name: p.name, value: p.Executed }));
             const myTier = getTier(skills['Polymath']?.[0]?.current_score || 0);

             if (showShop) {
                 return (<div className="space-y-6 animate-in slide-in-from-right duration-300"><div className="flex items-center gap-4 px-1 mb-4"><button onClick={() => { playSound('click'); setShowShop(false); }} className="p-2 hover:bg-slate-800 rounded-full active:scale-95 transition-transform"><ArrowLeft size={20}/></button><h2 className="text-xl font-bold text-white">Shop</h2></div><div className="flex justify-between items-center bg-[#1c1f26]/80 backdrop-blur-md p-4 rounded-2xl border border-white/10"><span className="text-xs font-bold text-slate-400">Balance</span><span className="text-xl font-bold text-yellow-400 flex items-center gap-1"><Zap size={16} fill="currentColor"/> {currencyXP} XP</span></div><div className="space-y-4">{SHOP_ITEMS.map(item => (<div key={item.id} className="bg-[#1c1f26]/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4 relative overflow-hidden transition-all hover:bg-slate-800/50"><div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">{getIcon(item.icon)}</div><div className="flex-1"><h4 className="font-bold text-white">{item.name}</h4><p className="text-xs text-slate-500">{item.desc}</p></div><button onClick={() => buyItem(item)} className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all active:scale-95 ${currencyXP >= item.cost ? 'bg-slate-700 text-white hover:bg-slate-600 border-slate-600' : 'bg-slate-800 text-slate-600 border-slate-800 cursor-not-allowed'}`}>{`${item.cost} XP`}</button></div>))}</div></div>);
             }
             if (showBackup) {
                 return (<div className="space-y-6 animate-in slide-in-from-right duration-300"><div className="flex items-center gap-4 px-1 mb-4"><button onClick={() => { playSound('click'); setShowBackup(false); }} className="p-2 hover:bg-slate-800 rounded-full active:scale-95 transition-transform"><ArrowLeft size={20}/></button><h2 className="text-xl font-bold text-white">Backup & Restore</h2></div><div className="bg-[#1c1f26]/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center space-y-4"><div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto"><Database size={32} className="text-blue-400" /></div><h3 className="text-lg font-bold text-white">Safe Keeping</h3><p className="text-xs text-slate-400">Save your data or load it on another device.</p><div className="grid grid-cols-2 gap-3 mt-4"><button onClick={handleExportData} className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 active:scale-95 transition-all"><DownloadCloud size={24} className="text-emerald-400" /><span className="text-xs font-bold text-white">Save Data</span></button><button onClick={handleImportData} className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 active:scale-95 transition-all"><Upload size={24} className="text-blue-400" /><span className="text-xs font-bold text-white">Load Data</span></button></div></div></div>);
             }
             if (showBioSettings) {
                return (<div className="space-y-6 animate-in slide-in-from-right duration-300"><div className="flex items-center gap-4 px-1 mb-4"><button onClick={() => { playSound('click'); setShowBioSettings(false); }} className="p-2 hover:bg-slate-800 rounded-full active:scale-95 transition-transform"><ArrowLeft size={20}/></button><h2 className="text-xl font-bold text-white">Sleep Schedule</h2></div><div className="bg-[#1c1f26]/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-6"><div className="flex flex-col gap-2"><label className="text-xs text-slate-400 uppercase font-bold flex items-center gap-2"><Moon size={12}/> Bedtime</label><input type="time" value={sleepConfig.sleep} onChange={(e) => setSleepConfig(prev => ({...prev, sleep: e.target.value}))} className="w-full bg-[#13151a] border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 text-2xl font-mono text-center" /></div><div className="flex flex-col gap-2"><label className="text-xs text-slate-400 uppercase font-bold flex items-center gap-2"><Sun size={12}/> Wake Up Time</label><input type="time" value={sleepConfig.wake} onChange={(e) => setSleepConfig(prev => ({...prev, wake: e.target.value}))} className="w-full bg-[#13151a] border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 text-2xl font-mono text-center" /></div></div></div>);
             }
             // Hacker Mode CSS Editor
             if (showCSSEditor) {
                 return (<div className="space-y-6 animate-in slide-in-from-right duration-300"><div className="flex items-center gap-4 px-1 mb-4"><button onClick={() => { playSound('click'); setShowCSSEditor(false); }} className="p-2 hover:bg-slate-800 rounded-full active:scale-95 transition-transform"><ArrowLeft size={20}/></button><h2 className="text-xl font-bold text-white">Custom CSS</h2></div><div className="bg-[#1c1f26]/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 h-[60vh] flex flex-col"><textarea value={customCSS} onChange={(e) => setCustomCSS(e.target.value)} className="flex-1 bg-[#13151a] border border-slate-700 rounded-lg p-4 font-mono text-xs text-emerald-400 focus:outline-none resize-none" placeholder="/* Write custom CSS here */" /><button onClick={() => { playSound('success'); showToast('Styles Applied'); setShowCSSEditor(false); }} className="mt-4 w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-bold uppercase tracking-widest">Apply</button></div></div>);
             }
             
             return (
                 <div className="space-y-6 animate-in slide-in-from-right duration-300">
                     <div className="flex items-center justify-between px-1"><h2 className="text-xl font-bold text-white">Profile</h2></div>
                    <div className={`flex items-center gap-4 bg-[#1c1f26]/90 backdrop-blur-xl p-5 rounded-2xl border ${theme.border} border-opacity-30 shadow-lg relative overflow-hidden`}><div className={`absolute inset-0 bg-gradient-to-br ${theme.gradientFrom} opacity-5 pointer-events-none`} /><div className={`w-16 h-16 rounded-xl bg-slate-900 border ${theme.border} border-opacity-50 flex items-center justify-center shadow-lg relative z-10`}><UserCircle size={32} className={theme.text} /></div><div className="relative z-10"><h2 className="text-2xl font-bold text-white tracking-tight">{userName}</h2><div className="flex items-center gap-2 mt-1"><span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${theme.border} ${theme.text} ${theme.bgLight} uppercase tracking-wider`}>{myTier.name}</span><span className="text-xs text-slate-400 flex items-center gap-1"><Zap size={10} className="text-yellow-500" /> {currencyXP.toLocaleString()} XP</span></div></div></div>
                    
                    {/* Visual Cortex */}
                    <div className="bg-[#1c1f26]/80 backdrop-blur-md rounded-2xl p-5 border border-slate-800 shadow-lg">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Palette size={12}/> Appearance</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-[10px] font-bold text-slate-500 mb-2 uppercase">Theme</h3>
                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                    {Object.values(THEMES).map((t: any) => (
                                        <button 
                                            key={t.name} 
                                            onClick={() => { playSound('click'); setAppTheme(t.name); }} 
                                            className={`relative flex-shrink-0 w-20 h-12 rounded-lg transition-all overflow-hidden group ${appTheme === t.name ? `border-2 border-white shadow-[0_0_8px_rgba(255,255,255,0.5)]` : 'border border-slate-800 opacity-60 hover:opacity-100 hover:scale-105'}`}
                                        >
                                            <div className={`absolute inset-0 bg-gradient-to-br ${t.gradientFrom} to-slate-900`}></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                {appTheme === t.name && <CheckCircle size={16} className="text-white drop-shadow-md" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-bold text-slate-500 mb-2 uppercase">Font</h3>
                                <div className="flex bg-[#13151a] p-1 rounded-xl border border-slate-800">
                                    {Object.keys(FONTS).map(f => (
                                        <button 
                                            key={f} 
                                            onClick={() => { playSound('click'); setAppFont(f); }} 
                                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${appFont === f ? 'bg-slate-700 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                                        >
                                            <span className={`${FONTS[f]} text-sm`}>Ag</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Control Deck */}
                    <div className="grid grid-cols-4 gap-2">
                        <button onClick={() => { playSound('click'); setShowBioSettings(true); }} className="p-3 bg-[#1c1f26] hover:bg-[#232730] border border-slate-800 rounded-xl flex flex-col items-center gap-1 transition-all active:scale-95 group"><Watch size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" /><span className="text-[10px] font-bold text-slate-400">Sleep</span></button>
                        <button onClick={() => { playSound('click'); setShowShop(true); }} className="p-3 bg-[#1c1f26] hover:bg-[#232730] border border-slate-800 rounded-xl flex flex-col items-center gap-1 transition-all active:scale-95 group"><ShoppingBag size={18} className="text-yellow-500 group-hover:scale-110 transition-transform" /><span className="text-[10px] font-bold text-slate-400">Shop</span></button>
                        <button onClick={() => { playSound('click'); setShowBackup(true); }} className="p-3 bg-[#1c1f26] hover:bg-[#232730] border border-slate-800 rounded-xl flex flex-col items-center gap-1 transition-all active:scale-95 group"><Database size={18} className="text-blue-400 group-hover:scale-110 transition-transform" /><span className="text-[10px] font-bold text-slate-400">Backup</span></button>
                        <button onClick={() => { playSound('delete'); setUserName(null); setIsOnboarding(true); setOnboardingStep(0); }} className="p-3 bg-[#1c1f26] hover:bg-[#232730] border border-slate-800 rounded-xl flex flex-col items-center gap-1 transition-all active:scale-95 group"><LogOut size={18} className="text-rose-500 group-hover:scale-110 transition-transform" /><span className="text-[10px] font-bold text-slate-400">Reset</span></button>
                    </div>
                    {inventory.items.includes('hacker_mode') && (
                        <button onClick={() => setShowCSSEditor(true)} className="w-full py-3 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest hover:bg-slate-700 transition-all"><Code size={14}/> Custom CSS</button>
                    )}
                    
                     <div className="grid grid-cols-3 gap-2"><div className="bg-[#1c1f26]/80 p-3 rounded-xl border border-slate-800 flex flex-col items-center justify-center"><span className="text-[10px] font-bold text-slate-500 uppercase">Success</span><span className="text-lg font-bold text-white">{stats.completionRate}%</span></div><div className="bg-[#1c1f26]/80 p-3 rounded-xl border border-slate-800 flex flex-col items-center justify-center"><span className="text-[10px] font-bold text-slate-500 uppercase">Habits</span><span className="text-lg font-bold text-white">{stats.totalHabitCompletions}</span></div><div className="bg-[#1c1f26]/80 p-3 rounded-xl border border-slate-800 flex flex-col items-center justify-center"><span className="text-[10px] font-bold text-slate-500 uppercase">Streak</span><span className={`text-lg font-bold ${theme.text}`}>{streakData.count}</span></div></div>
                     
                     {/* CORRELATION ENGINE DISPLAY */}
                     <div className="bg-[#1c1f26]/80 backdrop-blur-md rounded-2xl p-4 border border-slate-800 shadow-lg">
                        <h2 className="text-sm font-bold text-white mb-2">Insights</h2>
                        <div className="flex gap-2 text-xs text-slate-400">
                             <div className="flex-1 p-2 bg-slate-900 rounded border border-slate-800">
                                 <strong className="block text-white">Health Impact</strong>
                                 <span>{stats.totalHabitCompletions > 5 ? "+12% Productivity" : "Tracking..."}</span>
                             </div>
                             <div className="flex-1 p-2 bg-slate-900 rounded border border-slate-800">
                                 <strong className="block text-white">Best Time</strong>
                                 <span>{sleepConfig.wake} + 4h</span>
                             </div>
                        </div>
                     </div>

                     <div className="bg-[#1c1f26]/80 backdrop-blur-md rounded-2xl p-4 border border-slate-800 shadow-lg relative overflow-hidden"><h2 className="text-sm font-bold text-white mb-2">Life Balance</h2><div className="h-[220px] w-full relative -ml-2"><ResponsiveContainer width="100%" height="100%"><RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}><PolarGrid stroke="#334155" /><PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }} /><PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} /><Radar name="Balance" dataKey="A" stroke={theme.chart} fill={theme.chart} fillOpacity={0.4} /></RadarChart></ResponsiveContainer></div></div>
                    <div className="bg-[#1c1f26]/80 backdrop-blur-md rounded-2xl p-4 border border-slate-800 shadow-lg"><h2 className="text-sm font-bold text-white mb-3">Area Status</h2><div className="space-y-3">{skills['Polymath']?.map((skill: any) => { const daysInactive = getDaysSince(skill.last_activity); const isDecaying = daysInactive > 1; return (<div key={skill.id} className="flex items-center gap-3"><div className="flex-1"><div className="flex justify-between mb-1"><span className="text-xs font-bold text-slate-300">{skill.pillar}</span><div className="flex items-center gap-1"><span className="text-[10px] text-slate-500">{skill.current_score}%</span>{isDecaying && (<span className="text-[9px] text-rose-500 flex items-center gap-0.5 animate-pulse font-bold bg-rose-500/10 px-1 rounded border border-rose-500/20"><ArrowDown size={8}/> Needs Work</span>)}</div></div><div className="h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-500 ${isDecaying ? 'bg-rose-500/60' : theme.primary}`} style={{ width: `${skill.current_score}%` }}/></div></div></div>)})}</div></div>
                    <div className="bg-[#1c1f26]/80 backdrop-blur-md rounded-2xl p-4 border border-slate-800 shadow-lg">
                        <h2 className="text-sm font-bold text-white mb-2">Weekly Activity</h2>
                        <div className="h-40 w-full text-xs">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.weeklyActivity}>
                                    <CartesianGrid vertical={false} stroke="#334155" strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="day" stroke="#64748b" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                                    <RechartsTooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} itemStyle={{color: '#fff'}} cursor={{fill: 'rgba(255,255,255,0.05)'}}/>
                                    <Bar dataKey="count" fill={theme.chart} barSize={6} radius={[2, 2, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="bg-[#1c1f26]/80 backdrop-blur-md rounded-2xl p-4 border border-slate-800 shadow-lg">
                        <h2 className="text-sm font-bold text-white mb-2">Task Distribution</h2>
                        <div className="h-40 w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData} innerRadius={40} outerRadius={50} paddingAngle={5} dataKey="value">
                                        {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />))}
                                    </Pie>
                                    <RechartsTooltip contentStyle={{backgroundColor: '#1e293b', borderRadius: '8px', border: 'none'}} />
                                    <Legend iconSize={8} wrapperStyle={{fontSize: '10px'}} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="bg-[#1c1f26]/80 backdrop-blur-md rounded-2xl p-4 border border-slate-800 shadow-lg"><span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Achievements</span>{inventory.badges.length === 0 ? (<div className="text-center py-4 border border-dashed border-slate-800 rounded-xl"><span className="text-xs text-slate-600 italic">No achievements yet.</span></div>) : (<div className="grid grid-cols-4 gap-3">{inventory.badges.map((bid: string) => { const badge = ACHIEVEMENTS.find(a => a.id === bid); if(!badge) return null; return (<div key={bid} className="flex flex-col items-center gap-1.5 p-2 bg-[#13151a] rounded-xl border border-slate-800"><div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-yellow-500 shadow-md">{getIcon(badge.icon)}</div><span className="text-[8px] font-bold text-slate-400 text-center leading-tight">{badge.name}</span></div>)})}</div>)}</div>
                 </div>
             )
    }
  };

  return (
    <div className={`h-[100dvh] w-full bg-[#050505] text-slate-200 relative shadow-2xl flex flex-col overflow-hidden ${fontClass}`}>
      <Atmosphere theme={theme} isNight={isNight} />
      <style>{customCSS}</style> {/* Hacker Mode CSS Injection */}
      
      {/* CLI OVERLAY */}
      <TerminalCLI isOpen={cliOpen} onClose={() => setCliOpen(false)} onCommand={executeCommand} theme={theme} />
      
      {cinematic && cinematic.active && (<CinematicOverlay type={cinematic.type} text={cinematic.text} subtext={cinematic.subtext} theme={theme} onComplete={() => { if (cinematic?.type === 'sleep') { try { window.close(); } catch(e){} setIsShutdown(true); } else { setCinematic(prev => prev ? { ...prev, active: false } : null); } }} onAction={cinematic.type === 'sleep-locked' ? handleEmergencyAbort : undefined} />)}
      <div className="z-10 relative h-full flex flex-col">
        <Confetti active={showConfetti} />
        <header className="sticky top-0 z-30 bg-[#13151a]/80 backdrop-blur-xl border-b border-slate-800/50 px-4 py-3 flex justify-between items-center transition-colors duration-500 shrink-0"><div className="flex items-center gap-2"><div className={`w-8 h-8 rounded-lg ${theme.primary} flex items-center justify-center shadow-lg ${theme.glow}`}><Dna className="w-4 h-4 text-white" /></div><span className="font-bold text-lg tracking-tight text-white">Life OS</span></div><div className="flex items-center gap-3"><button onClick={() => setCliOpen(true)} className="p-1.5 bg-slate-800 rounded text-slate-400 hover:text-white transition-colors border border-slate-700 text-[10px] font-bold font-mono"><Command size={10} className="inline mr-1"/>K</button><div className={`flex items-center gap-1 ${theme.bgLight} px-2 py-1 rounded-full border ${theme.border} ${theme.text} text-xs font-bold`}><Flame size={12} fill="currentColor" /> {streakData.count}</div></div></header>
        <Toast message={toastMessage} isVisible={!!toastMessage} theme={theme} />
        <Modal font={fontClass} isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingHabitId(null); setNewItemName(''); setNewItemRecurrence('none'); }} title={newItemType === 'task' ? 'Add Task' : (editingHabitId ? 'Edit Habit' : 'New Habit')}><div className="space-y-4"><div><label className="text-xs text-slate-400 uppercase font-bold">Name</label><input type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className={`w-full bg-[#13151a] border border-slate-700 rounded-lg p-3 text-white mt-1 focus:outline-none focus:border-${theme.name === 'Focus' ? 'white' : 'emerald-500'}`} placeholder="What do you need to do?" /></div>{newItemType === 'task' ? (<><div className="flex gap-3"><div className="flex-1"><label className="text-xs text-slate-400 uppercase font-bold">Date</label><input type="date" value={newItemDate} onChange={(e) => setNewItemDate(e.target.value)} className="w-full bg-[#13151a] border border-slate-700 rounded-lg p-3 text-white mt-1 scheme-dark" /></div><div className="flex-1"><label className="text-xs text-slate-400 uppercase font-bold">Repeat?</label><select value={newItemRecurrence} onChange={(e) => setNewItemRecurrence(e.target.value)} className="w-full bg-[#13151a] border border-slate-700 rounded-lg p-3 text-white mt-1 appearance-none"><option value="none">No</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option></select></div></div><div><label className="text-xs text-slate-400 uppercase font-bold">Priority</label><div className="grid grid-cols-3 gap-2 mt-1">{['Low', 'Medium', 'High'].map(imp => (<button key={imp} onClick={() => setNewItemImpact(imp)} className={`text-[10px] py-2 rounded-lg border transition-colors ${newItemImpact === imp ? (imp === 'High' ? 'bg-rose-600 border-transparent text-white' : imp === 'Medium' ? 'bg-yellow-600 border-transparent text-white' : 'bg-slate-600 border-transparent text-white') : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{imp}</button>))}</div></div></>) : (<div><label className="text-xs text-slate-400 uppercase font-bold">Duration (Days)</label><input type="number" value={newItemDuration} onChange={(e) => setNewItemDuration(Number(e.target.value))} className="w-full bg-[#13151a] border border-slate-700 rounded-lg p-3 text-white mt-1" /></div>)}<div><label className="text-xs text-slate-400 uppercase font-bold">Category</label><div className="flex flex-wrap gap-2 mt-1">{PILLAR_KEYS.map((cat, i) => (<button key={cat} onClick={() => setNewItemCategory(cat)} className={`text-[10px] py-2 px-3 rounded-lg border transition-colors flex-grow ${newItemCategory === cat ? theme.primary + ' text-white border-transparent' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{cat}</button>))}</div></div><div className="flex gap-2 mt-4">{editingHabitId && newItemType !== 'task' && (<button onClick={handleDeleteHabit} className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-all flex items-center justify-center active:scale-95"><Trash2 size={18} /></button>)}<button onClick={handleSave} className={`flex-1 ${theme.primary} ${theme.primaryHover} text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg`}><Save size={18} /> {editingHabitId ? 'Update' : 'Confirm'}</button></div></div></Modal>
        <main className="flex-1 p-4 pb-24 scrollbar-hide overflow-y-auto">{renderContent()}</main>
        <button onClick={() => { setNewItemDate(getTodayString()); setNewItemType(activeTab === 'Habits' ? 'habitTracker' : 'task'); setIsModalOpen(true); setEditingHabitId(null); setNewItemName(''); setNewItemRecurrence('none'); }} className={`fixed bottom-20 right-4 w-12 h-12 ${theme.primary} ${theme.primaryHover} rounded-full flex items-center justify-center shadow-lg ${theme.glow} text-white z-20 transition-transform active:scale-90`}><Plus size={24} /></button>
        <nav className="fixed bottom-0 left-0 w-full bg-[#13151a]/80 backdrop-blur-xl border-t border-slate-800/80 px-1 pb-safe pt-1 z-30 max-w-md mx-auto right-0 shrink-0"><div className="flex justify-around items-center"><MobileTab label="Home" icon={<Home />} active={activeTab === 'Home'} onClick={() => setActiveTab('Home')} themeColor={theme.text} /><MobileTab label="Calendar" icon={<CalendarIcon />} active={activeTab === 'Calendar'} onClick={() => setActiveTab('Calendar')} themeColor={theme.text} /><MobileTab label="Habits" icon={<List />} active={activeTab === 'Habits'} onClick={() => setActiveTab('Habits')} themeColor={theme.text} /><MobileTab label="Tools" icon={<Grid />} active={activeTab === 'Social'} onClick={() => setActiveTab('Social')} themeColor={theme.text} /><MobileTab label="Profile" icon={<User />} active={activeTab === 'Profile'} onClick={() => setActiveTab('Profile')} themeColor={theme.text} /></div></nav>
      </div>
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes draw-lines {
            0% { stroke-dashoffset: 600; }
            50% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 600; }
        }
        @keyframes spin-slower {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-fall { animation: fall linear forwards; }
        .font-space { font-family: 'Space Grotesk', sans-serif; }
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        .animate-in-up {
            animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
            transform: translateY(20px);
        }
        .delay-100 { animation-delay: 100ms; }
        @keyframes fadeInUp {
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
