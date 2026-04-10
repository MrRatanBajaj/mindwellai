import type { ElementType } from 'react';
import {
  Activity,
  Apple,
  Baby,
  Brain,
  Briefcase,
  Heart,
  HeartHandshake,
  Sparkles,
  Stethoscope,
  User,
  Flower2,
  Moon,
  Shield,
  Smile,
  Sun,
} from 'lucide-react';

export type DoctorType =
  | 'general'
  | 'dermatologist'
  | 'mental_health'
  | 'cardiologist'
  | 'pediatrician'
  | 'neurologist'
  | 'gynecologist'
  | 'nutritionist'
  | 'career'
  | 'relationship'
  | 'male_therapist'
  | 'elder_counselor'
  | 'youth_counselor';

export interface DoctorProfile {
  name: string;
  specialty: string;
  description: string;
  icon: ElementType;
  gradient: string;
  accent: string;
  rating: number;
  available: boolean;
  voiceId: string;
  knowledgeBase: string;
  expertise: string[];
  systemPrompt: string;
  avatarImage?: string;
}

export const DOCTOR_PROFILES: Record<DoctorType, DoctorProfile> = {
  general: {
    name: 'Dr. Sarah',
    specialty: 'General Physician',
    description: 'General health consultations and wellness guidance',
    icon: Stethoscope,
    gradient: 'from-blue-500 via-blue-600 to-indigo-600',
    accent: 'blue',
    rating: 4.9,
    available: true,
    voiceId: 'EXAVITQu4vr4xnSDxMaL',
    knowledgeBase: 'Primary care triage model',
    expertise: ['Symptom triage', 'Preventive care', 'Wellness planning'],
    systemPrompt: 'You are Dr. Sarah, a compassionate General Physician. Use evidence-based primary care guidance, ask clarifying questions, and clearly flag when urgent in-person evaluation is required.',
  },
  mental_health: {
    name: 'Dr. Emma',
    specialty: 'Mental Health Counselor',
    description: 'Anxiety, stress, and emotional well-being support',
    icon: Brain,
    gradient: 'from-purple-500 via-purple-600 to-violet-600',
    accent: 'purple',
    rating: 4.8,
    available: true,
    voiceId: 'FGY2WhTYpPnrIDTdsKH5',
    knowledgeBase: 'CBT + DBT counseling model',
    expertise: ['Anxiety support', 'Stress regulation', 'Coping plans'],
    systemPrompt: 'You are Dr. Emma, a compassionate Mental Health Counselor trained in CBT/DBT/ACT. Provide emotional support, practical coping skills, and crisis-safe escalation when needed.',
  },
  male_therapist: {
    name: 'Dr. Aryan',
    specialty: 'Male Therapist',
    description: 'Empathetic male counselor for open, judgment-free mental health support',
    icon: User,
    gradient: 'from-slate-500 via-zinc-600 to-gray-700',
    accent: 'slate',
    rating: 4.9,
    available: true,
    voiceId: 'onwK4e9ZLuTAKqWW03F9',
    knowledgeBase: 'CBT + motivational interviewing model',
    expertise: ["Men's mental health", 'Anger management', 'Work-life balance'],
    systemPrompt: "You are Dr. Aryan, a compassionate male therapist specializing in men's mental health. You create a judgment-free space using CBT and motivational interviewing. Help users explore emotions, manage anger constructively, and develop healthy coping mechanisms.",
  },
  elder_counselor: {
    name: 'Dr. Meera',
    specialty: 'Senior Wellness Counselor',
    description: 'Wise, experienced guidance for life transitions and mature well-being',
    icon: Heart,
    gradient: 'from-amber-600 via-yellow-600 to-orange-500',
    accent: 'amber',
    rating: 5.0,
    available: true,
    voiceId: 'XrExE9yKIg1WjnnlVkGX',
    knowledgeBase: 'Life wisdom + grief counseling model',
    expertise: ['Life transitions', 'Grief support', 'Elder wellness'],
    systemPrompt: 'You are Dr. Meera, a seasoned senior counselor with 35+ years of experience. You bring warmth, patience, and deep life wisdom. Specialize in grief, life transitions, retirement adjustment, and existential concerns. Speak with gentle authority and share relevant life perspectives.',
  },
  youth_counselor: {
    name: 'Dr. Zara',
    specialty: 'Youth & Teen Counselor',
    description: 'Relatable, modern support for teens and young adults',
    icon: Sparkles,
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    accent: 'violet',
    rating: 4.8,
    available: true,
    voiceId: 'pFZP5JQG7iQjIQuC4Bku',
    knowledgeBase: 'Youth psychology + social media wellness model',
    expertise: ['Academic stress', 'Social anxiety', 'Identity exploration'],
    systemPrompt: 'You are Dr. Zara, a young, relatable youth counselor. You understand Gen-Z culture, social media pressures, and academic stress. Use casual, warm language while maintaining professionalism. Help with identity, peer pressure, self-esteem, and academic burnout.',
  },
  cardiologist: {
    name: 'Dr. James',
    specialty: 'Cardiologist',
    description: 'Heart health and cardiovascular wellness',
    icon: Heart,
    gradient: 'from-red-500 via-rose-500 to-pink-600',
    accent: 'red',
    rating: 4.9,
    available: true,
    voiceId: 'onwK4e9ZLuTAKqWW03F9',
    knowledgeBase: 'Cardiovascular risk model',
    expertise: ['Blood pressure', 'Heart risk factors', 'Lifestyle guidance'],
    systemPrompt: 'You are Dr. James, an experienced Cardiologist. Focus on cardiovascular risk, symptom interpretation, and immediate emergency escalation for chest pain or stroke/heart-attack signs.',
  },
  dermatologist: {
    name: 'Dr. Michael',
    specialty: 'Dermatologist',
    description: 'Skin conditions and cosmetic dermatology',
    icon: Sparkles,
    gradient: 'from-amber-500 via-orange-500 to-yellow-500',
    accent: 'amber',
    rating: 4.7,
    available: true,
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    knowledgeBase: 'Dermatology condition classifier',
    expertise: ['Rash triage', 'Acne care', 'Skin routine planning'],
    systemPrompt: 'You are Dr. Michael, a Dermatologist. Help with skin, scalp, and cosmetic concerns, and explain when visual in-person dermatology examination is necessary.',
  },
  pediatrician: {
    name: 'Dr. Lily',
    specialty: 'Pediatrician',
    description: "Children's health and development",
    icon: Baby,
    gradient: 'from-pink-500 via-pink-600 to-rose-500',
    accent: 'pink',
    rating: 4.9,
    available: true,
    voiceId: 'pFZP5JQG7iQjIQuC4Bku',
    knowledgeBase: 'Pediatric growth & care model',
    expertise: ['Child symptoms', 'Growth milestones', 'Parent guidance'],
    systemPrompt: 'You are Dr. Lily, a caring Pediatrician. Support parents with child health and development questions, and recommend in-person care whenever warning signs are present.',
  },
  neurologist: {
    name: 'Dr. Nathan',
    specialty: 'Neurologist',
    description: 'Brain health and nervous system',
    icon: Activity,
    gradient: 'from-indigo-500 via-indigo-600 to-blue-600',
    accent: 'indigo',
    rating: 4.8,
    available: true,
    voiceId: 'TX3LPaxmHKxFdv7VOQHJ',
    knowledgeBase: 'Neuro symptom pattern model',
    expertise: ['Headache mapping', 'Nerve symptoms', 'Sleep neurology'],
    systemPrompt: 'You are Dr. Nathan, a Neurologist. Provide structured neurological guidance and urgently escalate FAST/stroke or severe sudden neurological symptoms.',
  },
  gynecologist: {
    name: 'Dr. Maya',
    specialty: 'Gynecologist',
    description: "Women's reproductive health",
    icon: User,
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
    accent: 'rose',
    rating: 4.9,
    available: true,
    voiceId: 'XrExE9yKIg1WjnnlVkGX',
    knowledgeBase: 'Women health advisory model',
    expertise: ['Cycle health', 'Reproductive care', 'Hormonal wellness'],
    systemPrompt: "You are Dr. Maya, a compassionate Gynecologist. Give respectful, evidence-based guidance on women's health and encourage timely in-person care for red-flag symptoms.",
  },
  nutritionist: {
    name: 'Dr. Sophie',
    specialty: 'Nutritionist',
    description: 'Dietary health and nutrition planning',
    icon: Apple,
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    accent: 'green',
    rating: 4.8,
    available: true,
    voiceId: 'cgSgspJ2msm6clMCkdW9',
    knowledgeBase: 'Nutrition planning model',
    expertise: ['Meal planning', 'Weight goals', 'Balanced nutrition'],
    systemPrompt: 'You are Dr. Sophie, a Nutritionist. Offer practical food guidance, metabolic awareness, and sustainable plans without restrictive or harmful advice.',
  },
  career: {
    name: 'Dr. Arjun',
    specialty: 'Career Counselor',
    description: 'Career growth, interview confidence, and workplace stress support',
    icon: Briefcase,
    gradient: 'from-cyan-500 via-sky-500 to-blue-600',
    accent: 'cyan',
    rating: 4.8,
    available: true,
    voiceId: 'VR6AewLTigWG4xSOukaG',
    knowledgeBase: 'Career coaching model',
    expertise: ['Career clarity', 'Interview prep', 'Workplace burnout'],
    systemPrompt: 'You are Dr. Arjun, a Career Counselor. Guide users on role clarity, job transitions, interview preparation, and healthy work-life boundaries with actionable plans.',
  },
  relationship: {
    name: 'Dr. Riya',
    specialty: 'Relationship Counselor',
    description: 'Love, communication, trust, and conflict resolution guidance',
    icon: HeartHandshake,
    gradient: 'from-fuchsia-500 via-rose-500 to-pink-600',
    accent: 'fuchsia',
    rating: 4.9,
    available: true,
    voiceId: 'ErXwobaYiN019PkySvjV',
    knowledgeBase: 'Relationship communication model',
    expertise: ['Conflict repair', 'Healthy boundaries', 'Trust building'],
    systemPrompt: 'You are Dr. Riya, a Relationship Counselor. Help users improve communication, resolve conflicts constructively, and build secure emotional connection in relationships.',
  },
};

export const DOCTOR_CARD_ORDER: DoctorType[] = [
  'general',
  'mental_health',
  'male_therapist',
  'elder_counselor',
  'youth_counselor',
  'cardiologist',
  'dermatologist',
  'pediatrician',
  'neurologist',
  'gynecologist',
  'nutritionist',
  'career',
  'relationship',
];
