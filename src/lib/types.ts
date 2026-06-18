export type Direction =
  | "STEM"
  | "Business"
  | "Programming"
  | "Science"
  | "Humanities"
  | "Finance"
  | "Social Impact";

export type Goal =
  | "University Admission"
  | "Skill Building"
  | "Competitions"
  | "Scholarships";

export type Format = "Online" | "Hybrid" | "In-person";

export type OppType =
  | "Olympiad"
  | "Competition"
  | "Scholarship"
  | "Summer School"
  | "Internship"
  | "Research"
  | "Hackathon"
  | "Volunteering";

export interface Opportunity {
  id: string;
  title: string;
  organizer: string;
  type: OppType;
  direction: Direction;
  format: Format;
  location: string;
  deadline: string; // ISO date
  grades: number[]; // eligible grades, e.g. [10, 11]
  description: string;
  eligibility: string;
  prize?: string;
  tags: string[];
  applyUrl: string;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number; // index
  explain?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoLabel: string;
  notes: string[]; // markdown-ish bullet points
  resources: { label: string; href: string }[];
  quiz: QuizQuestion[];
}

export type Level = "Beginner" | "Intermediate" | "Advanced";

export interface Course {
  id: string;
  title: string;
  subject: string;
  level: Level;
  direction: Direction;
  description: string;
  instructor: string;
  hours: number;
  accent: string; // tailwind gradient classes
  tags: string[];
  lessons: Lesson[];
}

export interface Profile {
  name: string;
  grade: number; // 8..11
  country: string;
  interests: Direction[];
  goals: Goal[];
}

export type Lang = "en" | "ru" | "kk";
export type Theme = "light" | "dark";
