/* Icon lookup and the shared pieces every illustration theme draws with. */
import {
    House, Lightbulb, Lock, Tv, Wifi, Clock, Smartphone, Bed, ConciergeBell, Key, Luggage, Receipt, Warehouse,
    Package, Truck, Barcode, PartyPopper, Cake, Music, Utensils, Flower2, Gamepad2, Ghost, Rocket, Crosshair, Trophy,
    Vote, Shield, ShieldCheck, KeyRound, Server, Cpu, MemoryStick, Microchip, Database, ShoppingCart, Store,
    CreditCard, Tag, Brain, Sparkles, Bot, Cloud, Network, Boxes, Compass, Search, ScatterChart, Layers, Settings,
    Users, Gauge, Workflow, Code, Code2, Braces, Terminal, Bug, FileCode, GitBranch, Plug, PlugZap, Cable,
    LayoutDashboard, AppWindow, MousePointer2, SquareTerminal, ArrowDownUp, ListTree, Binary, GitFork, HardDrive,
    Laptop, Monitor, Fingerprint, Sigma, Calculator, Pi, Atom, FlaskConical, FlaskRound, TestTube, Microscope,
    Magnet, Globe, Map, Landmark, BookOpen, GraduationCap, School, Pencil, Palette, Brush, Telescope, Orbit, Star,
    Moon, Satellite, Crown, Swords, Timer, Medal, Target, Dumbbell, Award, Stethoscope, Pill, HeartPulse, Activity,
    BellRing, ClipboardList, CalendarCheck, Coffee, Box, Zap, Wrench, Feather, Joystick, Flame, Footprints, Sun,
    Flag, Snowflake, Table, MessageSquare, Eye, Droplet, Filter, ChartBar, ChartLine, Infinity as InfinityIcon,
    Hash, Languages,
} from 'lucide-react';
import {
    CricketGlyph, FootballGlyph, GloveGlyph, RacketGlyph, TennisBallGlyph, KnightGlyph, ToothGlyph,
} from '../components/Glyphs';

const ICONS = {
    House, Lightbulb, Lock, Tv, Wifi, Clock, Smartphone, Bed, ConciergeBell, Key, Luggage, Receipt, Warehouse,
    Package, Truck, Barcode, PartyPopper, Cake, Music, Utensils, Flower2, Gamepad2, Ghost, Rocket, Crosshair, Trophy,
    Vote, Shield, ShieldCheck, KeyRound, Server, Cpu, MemoryStick, Microchip, Database, ShoppingCart, Store,
    CreditCard, Tag, Brain, Sparkles, Bot, Cloud, Network, Boxes, Compass, Search, ScatterChart, Layers, Settings,
    Users, Gauge, Workflow, Code, Code2, Braces, Terminal, Bug, FileCode, GitBranch, Plug, PlugZap, Cable,
    LayoutDashboard, AppWindow, MousePointer2, SquareTerminal, ArrowDownUp, ListTree, Binary, GitFork, HardDrive,
    Laptop, Monitor, Fingerprint, Sigma, Calculator, Pi, Atom, FlaskConical, FlaskRound, TestTube, Microscope,
    Magnet, Globe, Map, Landmark, BookOpen, GraduationCap, School, Pencil, Palette, Brush, Telescope, Orbit, Star,
    Moon, Satellite, Crown, Swords, Timer, Medal, Target, Dumbbell, Award, Stethoscope, Pill, HeartPulse, Activity,
    BellRing, ClipboardList, CalendarCheck, Coffee, Box, Zap, Wrench, Feather, Joystick, Flame, Footprints, Sun,
    Flag, Snowflake, Table, MessageSquare, Eye, Droplet, Filter, ChartBar, ChartLine, Infinity: InfinityIcon,
    Hash, Languages,
    'x:cricket': CricketGlyph,
    'x:football': FootballGlyph,
    'x:glove': GloveGlyph,
    'x:racket': RacketGlyph,
    'x:tennisball': TennisBallGlyph,
    'x:knight': KnightGlyph,
    'x:tooth': ToothGlyph,
};

/** One icon (Lucide or custom glyph) centred on (cx, cy). */
export function Glyph({ name, cx, cy, size, color = '#fff', strokeWidth = 1.8 }) {
    const Cmp = ICONS[name] || Sparkles;
    return <Cmp x={cx - size / 2} y={cy - size / 2} width={size} height={size} size={size} color={color} strokeWidth={strokeWidth} />;
}

/** The card's main subject: a technology logo on a white plate, or a large icon. */
export function Center({ art, cx, cy, size, color = '#fff', strokeWidth = 1.6, plate = true }) {
    if (art.main === 'logo') {
        return (
            <g>
                {plate && <circle cx={cx} cy={cy} r={size * 0.72} fill="#fff" />}
                <image href={`/images/logos/${art.logo}.svg`} x={cx - size / 2} y={cy - size / 2} width={size} height={size} />
            </g>
        );
    }
    return <Glyph name={art.main} cx={cx} cy={cy} size={size} color={color} strokeWidth={strokeWidth} />;
}
