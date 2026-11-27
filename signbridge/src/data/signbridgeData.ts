export type SignDialect = "ASL" | "BSL" | "ISL";

export interface SignDatasetInfo {
  code: SignDialect;
  name: string;
  region: string;
  speechLang: string;
  speechLocaleLabel: string;
  alphabetStyle: string;
  corpusSize: string;
  defaultPhrase: string;
  defaultGloss: string;
  defaultNonManual: string;
  defaultGrammarNote: string;
  defaultSteps: {
    gloss: string;
    spokenMeaning: string;
    handshape: string;
    palmOrientation: string;
    location: string;
    movement: string;
    visualArchetype: string;
  }[];
}

export const SIGN_DATASETS: Record<SignDialect, SignDatasetInfo> = {
  ASL: {
    code: "ASL",
    name: "American Sign Language",
    region: "United States & Canada",
    speechLang: "en-US",
    speechLocaleLabel: "English (US)",
    alphabetStyle: "One-handed manual alphabet",
    corpusSize: "6,400+ verified signs",
    defaultPhrase: "Welcome! Your doctor is ready to see you in room four.",
    defaultGloss: "WELCOME · YOUR DOCTOR READY ROOM FOUR",
    defaultNonManual:
      "Warm open expression on WELCOME; subtle raised eyebrows establishing topic YOUR DOCTOR, relaxed nod on ROOM FOUR.",
    defaultGrammarNote:
      "ASL presents the greeting first, then links the subject directly to readiness and spatial location without English linking verbs.",
    defaultSteps: [
      {
        gloss: "WELCOME",
        spokenMeaning: "Welcome",
        handshape: "Flat open B-hand, fingers together",
        palmOrientation: "Palm angled upward toward the listener",
        location: "Mid-chest extending outward",
        movement: "Sweeping inward arc toward the torso",
        visualArchetype: "open_palm",
      },
      {
        gloss: "DOCTOR",
        spokenMeaning: "Doctor",
        handshape: "Curved M-hand or bent four fingers",
        palmOrientation: "Fingertips directed down onto opposite wrist",
        location: "Inner wrist of non-dominant hand",
        movement: "Gentle double tap on pulse point",
        visualArchetype: "pinch_connect",
      },
      {
        gloss: "READY",
        spokenMeaning: "Ready to see you",
        handshape: "Both hands in R-handshape (crossed index and middle)",
        palmOrientation: "Palms facing outward",
        location: "Neutral chest signing space",
        movement: "Smooth parallel horizontal sweep from left to right",
        visualArchetype: "two_hand_bridge",
      },
      {
        gloss: "ROOM FOUR",
        spokenMeaning: "Room four",
        handshape: "Flat hands forming walls, transitioning to four extended fingers",
        palmOrientation: "Palms facing inward for room, then outward for four",
        location: "Center signing space",
        movement: "Frame rectangular space, then hold steady four-hand",
        visualArchetype: "point_index",
      },
    ],
  },
  BSL: {
    code: "BSL",
    name: "British Sign Language",
    region: "United Kingdom",
    speechLang: "en-GB",
    speechLocaleLabel: "English (UK)",
    alphabetStyle: "Two-handed manual alphabet",
    corpusSize: "4,200+ verified signs",
    defaultPhrase: "Nice to meet you. Thank you for joining our team today.",
    defaultGloss: "TODAY TEAM JOIN THANK-YOU · MEET YOU NICE",
    defaultNonManual:
      "Friendly eye contact with slight brow lift on TODAY TEAM, gentle head nod on THANK-YOU and warm smile on NICE.",
    defaultGrammarNote:
      "BSL frequently establishes time and context (TODAY TEAM) upfront before delivering the core greeting and appreciation.",
    defaultSteps: [
      {
        gloss: "TODAY",
        spokenMeaning: "Today",
        handshape: "Bent open flat hands",
        palmOrientation: "Palms facing upward",
        location: "Lower chest signing space",
        movement: "Short double downward bounce in unison",
        visualArchetype: "open_palm",
      },
      {
        gloss: "TEAM JOIN",
        spokenMeaning: "Joining our team",
        handshape: "Curved C-hands linking into interlocking fingers",
        palmOrientation: "Palms facing inward toward each other",
        location: "Center chest space",
        movement: "Bring both hands together in a unifying circular arc",
        visualArchetype: "two_hand_bridge",
      },
      {
        gloss: "THANK-YOU",
        spokenMeaning: "Thank you",
        handshape: "Flat open hand with fingers extended",
        palmOrientation: "Palm facing inward near chin",
        location: "Chin moving forward",
        movement: "Single graceful arc downward and outward",
        visualArchetype: "chin_forward",
      },
      {
        gloss: "MEET YOU",
        spokenMeaning: "Nice to meet you",
        handshape: "Extended index fingers upright on both hands",
        palmOrientation: "Palms facing each other",
        location: "Neutral chest space",
        movement: "Draw index fingers smoothly together until meeting",
        visualArchetype: "point_index",
      },
    ],
  },
  ISL: {
    code: "ISL",
    name: "Indian Sign Language",
    region: "India & South Asia",
    speechLang: "en-IN",
    speechLocaleLabel: "English (India)",
    alphabetStyle: "Two-handed fingerspelling & regional lexicon",
    corpusSize: "3,600+ verified signs",
    defaultPhrase: "Where is the accessible train platform for the morning express?",
    defaultGloss: "MORNING EXPRESS TRAIN PLATFORM ACCESSIBLE · WHERE",
    defaultNonManual:
      "Neutral focused gaze establishing the train topic; furrowed eyebrows and slight forward head tilt held on the clause-final WHERE.",
    defaultGrammarNote:
      "ISL places WH-question words such as WHERE at the end of the clause while maintaining non-manual question eyebrows.",
    defaultSteps: [
      {
        gloss: "MORNING",
        spokenMeaning: "Morning",
        handshape: "Flat dominant hand rising like the sun over horizontal arm",
        palmOrientation: "Palm angled slightly inward",
        location: "Mid-chest horizon level",
        movement: "Smooth upward arc symbolizing sunrise",
        visualArchetype: "open_palm",
      },
      {
        gloss: "TRAIN",
        spokenMeaning: "Express train",
        handshape: "Both hands in extended two-finger H-shape",
        palmOrientation: "Palms facing down",
        location: "Center signing space",
        movement: "Dominant hand glides forward along non-dominant track",
        visualArchetype: "two_hand_bridge",
      },
      {
        gloss: "PLATFORM",
        spokenMeaning: "Accessible platform",
        handshape: "Flat open hands held level",
        palmOrientation: "Palms facing downward",
        location: "Chest height moving laterally",
        movement: "Level outward sweep depicting a wide flat surface",
        visualArchetype: "curved_cup",
      },
      {
        gloss: "WHERE",
        spokenMeaning: "Where is it?",
        handshape: "Open hands or upturned index finger with questioning posture",
        palmOrientation: "Palms upturned",
        location: "Neutral front space",
        movement: "Small side-to-side inquiry motion paired with furrowed brows",
        visualArchetype: "point_index",
      },
    ],
  },
};

export const SIGN_DIALECT_LIST: SignDatasetInfo[] = [
  SIGN_DATASETS.ASL,
  SIGN_DATASETS.BSL,
  SIGN_DATASETS.ISL,
];

export const ASSETS = {
  heroHands: "/src/assets/images/hero_signbridge_hands_1795710245010.jpg",
  aboutDialogue: "/src/assets/images/about_sign_communication_1795710246570.jpg",
  techTracking: "/src/assets/images/tech_hand_tracking_1795710247742.jpg",
  impactCommunity: "/src/assets/images/impact_inclusive_world_1795710247977.jpg",
} as const;

export interface HeroMetric {
  value: string;
  label: string;
  context: string;
}

export const HERO_METRICS: HeroMetric[] = [
  {
    value: "42 ms",
    label: "Median frame-to-gloss latency",
    context: "Measured across 60 fps edge devices",
  },
  {
    value: "96.4%",
    label: "Continuous phrase accuracy",
    context: "Benchmarked on clinical & classroom corpuses",
  },
  {
    value: "3 Dialects",
    label: "Native regional sign grammar",
    context: "ASL, BSL, and ISL with regional variants",
  },
  {
    value: "Zero",
    label: "Stored video frames on servers",
    context: "On-device skeletal extraction by default",
  },
];

export interface AboutPillar {
  index: string;
  title: string;
  description: string;
}

export const ABOUT_PILLARS: AboutPillar[] = [
  {
    index: "01",
    title: "Built alongside Deaf linguists",
    description:
      "Every dataset, gloss convention, and non-manual marker is co-authored and audited with native Deaf signers and certified interpreters—never treated as word-for-word English.",
  },
  {
    index: "02",
    title: "Natural two-way conversation",
    description:
      "SignBridge translates fluid signing into natural speech and converts spoken sentences back into grammatically faithful visual sign guides in real time.",
  },
  {
    index: "03",
    title: "Private by architecture",
    description:
      "Hand kinematics and facial landmark vectors are processed in ephemeral memory so personal conversations in hospitals, schools, and offices remain confidential.",
  },
];

export interface TimelineStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  detailLabel: string;
  detailMetric: string;
  highlights: string[];
}

export const HOW_IT_WORKS_STEPS: TimelineStep[] = [
  {
    number: "01",
    title: "Capture gesture and facial nuance",
    subtitle: "Standard webcam or smartphone lens",
    description:
      "Any standard 720p camera captures full upper-body signing space, including subtle eyebrow raises, head tilts, and mouth morphemes that shape grammatical meaning.",
    detailLabel: "Optical pipeline",
    detailMetric: "60 fps adaptive lighting normalization",
    highlights: [
      "Works without gloves, depth sensors, or wearable markers",
      "Resilient across classroom, clinic, and low-light home settings",
    ],
  },
  {
    number: "02",
    title: "Map 3D hand-mesh and pose kinematics",
    subtitle: "543 skeletal landmarks per frame",
    description:
      "Our lightweight vision encoder reconstructs 21 articulating joints per hand, torso alignment, and 468 facial contours to preserve handshape and spatial trajectories.",
    detailLabel: "Spatial representation",
    detailMetric: "Sub-millimeter fingertip trajectory vectors",
    highlights: [
      "Distinguishes rapid fingerspelling from continuous lexical signs",
      "Tracks spatial referents anchored across multi-sentence dialogue",
    ],
  },
  {
    number: "03",
    title: "Translate gloss and regional grammar",
    subtitle: "Context-aware sign language transformer",
    description:
      "Temporal sequence models interpret topic-comment structure, classifiers, and regional vocabulary across ASL, BSL, and ISL rather than matching isolated dictionary clips.",
    detailLabel: "Linguistic engine",
    detailMetric: "Contextual window across 18-second turns",
    highlights: [
      "Preserves question tone, negation, and conditional clauses",
      "Adapts to domain terminology in medicine, law, and higher education",
    ],
  },
  {
    number: "04",
    title: "Deliver spoken voice or visual sign guidance",
    subtitle: "Instant two-way output",
    description:
      "Hearing participants receive clear captions and natural speech audio, while Deaf and Hard-of-Hearing participants see structured sign gloss and step-by-step visual synthesis.",
    detailLabel: "Delivery channels",
    detailMetric: "Web, iOS, Android, and kiosk SDKs",
    highlights: [
      "Adjustable speech cadence and accessible high-contrast transcripts",
      "Seamless handoff to live human interpreters whenever requested",
    ],
  },
];

export interface SamplePhrase {
  label: string;
  text: string;
  dialect: "ASL" | "BSL" | "ISL";
}

export const SAMPLE_PHRASES: SamplePhrase[] = [
  {
    label: "Clinic check-in",
    text: "Welcome! Your doctor is ready to see you in room four.",
    dialect: "ASL",
  },
  {
    label: "Classroom question",
    text: "Could you explain the last example one more time, please?",
    dialect: "ASL",
  },
  {
    label: "Friendly greeting",
    text: "Nice to meet you. Thank you for joining our team today.",
    dialect: "BSL",
  },
  {
    label: "Travel assistance",
    text: "Where is the accessible train platform for the morning express?",
    dialect: "ISL",
  },
];

export interface SampleGestureCard {
  id: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  dialect: "ASL" | "BSL" | "ISL";
}

export const SAMPLE_GESTURES: SampleGestureCard[] = [
  {
    id: "connect",
    title: "Two-Hand Connect Pose",
    subtitle: "Sculptural reference frame",
    imageSrc: ASSETS.heroHands,
    dialect: "ASL",
  },
  {
    id: "dialogue",
    title: "Bridge Dialogue Pose",
    subtitle: "Sculptural reference frame",
    imageSrc: ASSETS.aboutDialogue,
    dialect: "ASL",
  },
];

export interface TechModule {
  code: string;
  title: string;
  summary: string;
  metric: string;
  metricCaption: string;
}

export const TECH_MODULES: TechModule[] = [
  {
    code: "01",
    title: "Kinematic Hand-Mesh Vision",
    summary:
      "Multi-view 3D pose estimation recovers occluded fingers and wrist rotations even when hands cross the torso or sign at conversational speed.",
    metric: "543",
    metricCaption: "Landmarks tracked per frame at 60 Hz",
  },
  {
    code: "02",
    title: "Non-Manual Marker Fusion",
    summary:
      "Sign languages encode yes/no questions, intensity, and negation on the face. Our fusion layer weighs brow height, gaze, and head tilt alongside hand motion.",
    metric: "+28%",
    metricCaption: "Sentence accuracy gain over hands-only models",
  },
  {
    code: "03",
    title: "Cross-Dialect Gloss Transformer",
    summary:
      "Trained on linguistically annotated ASL, BSL, and ISL corpora to respect regional idioms, spatial indexing, and topic-comment phrasing.",
    metric: "14,200+",
    metricCaption: "Verified lexical signs & regional variants",
  },
  {
    code: "04",
    title: "Zero-Retention Edge Runtime",
    summary:
      "Quantized neural weights run directly in browsers and clinical tablets so raw camera streams never leave the user's device.",
    metric: "< 18 MB",
    metricCaption: "Compressed browser & mobile SDK footprint",
  },
];

export interface ImpactCase {
  sector: string;
  metric: string;
  metricDetail: string;
  title: string;
  summary: string;
}

export const IMPACT_CASES: ImpactCase[] = [
  {
    sector: "Healthcare Access",
    metric: "68% faster",
    metricDetail: "Intake check-in turnaround across 14 pilot clinics",
    title: "Clearer triage before an interpreter arrives",
    summary:
      "Front-desk tablets running SignBridge help Deaf patients share symptoms, allergies, and appointment questions immediately upon arrival—reducing wait-room friction while certified medical interpreters join.",
  },
  {
    sector: "Higher Education",
    metric: "4,800+ hours",
    metricDetail: "Real-time lab & study group sessions supported in 2026",
    title: "Inclusive participation in spontaneous study groups",
    summary:
      "Students use SignBridge laptops during office hours and lab discussions where scheduled interpreters are unavailable, keeping peer collaboration fluid and direct.",
  },
  {
    sector: "Workplace Teams",
    metric: "94% adoption",
    metricDetail: "Weekly active usage across hybrid partner teams",
    title: "Everyday standups without communication lag",
    summary:
      "Direct browser captions and bidirectional sign guidance integrate into daily standups and customer-service desks with no specialized hardware required.",
  },
];

export interface CommunityQuote {
  quote: string;
  name: string;
  role: string;
  organization: string;
}

export const COMMUNITY_QUOTES: CommunityQuote[] = [
  {
    quote:
      "Before deploying SignBridge at our urgent-care check-in desks, Deaf patients waited an average of 22 minutes just to confirm intake details. Now intake starts within seconds while our video interpreter connects.",
    name: "Dr. Elena Vance",
    role: "Director of Patient Accessibility",
    organization: "Cascade Regional Health",
  },
  {
    quote:
      "What sets SignBridge apart is respect for ASL grammar and facial markers. During engineering lab reviews, my teammates actually catch the nuance of my questions instead of fragmented keywords.",
    name: "Marcus Holloway",
    role: "Graduate Research Fellow",
    organization: "Pacific Institute of Design & Technology",
  },
];
