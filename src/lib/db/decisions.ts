import fs from "fs";
import path from "path";
import { createServerClient } from "@/lib/supabase/server";

export interface DecisionOption {
  id: string;
  decision_id: string;
  title: string;
  description?: string;
  pros: string[];
  cons: string[];
  estimated_cost?: string;
  is_chosen?: boolean;
}

export interface ReasonItem {
  id: string;
  decision_id: string;
  option_id?: string;
  statement: string;
  confidence: number; // 0-100
  evidence_level: "anecdotal" | "moderate" | "rigorous" | "unverified";
  is_assumption: boolean;
}

export interface BlindSpotCard {
  id: string;
  decision_id: string;
  bias_type: string;
  title: string;
  description: string;
  severity: "critical" | "warning" | "advisory";
  remedy_question: string;
  suggested_action?: string;
  status: "open" | "addressed" | "dismissed";
  notes?: string;
}

export interface PremortemItem {
  id: string;
  decision_id: string;
  scenario: string;
  likelihood: "high" | "medium" | "low";
  impact: "high" | "medium" | "low";
  early_indicator: string;
  preventative_measure: string;
  status: "open" | "mitigated";
}

export interface EvidenceAction {
  id: string;
  decision_id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  priority: "high" | "medium" | "low";
  due_date?: string;
  assigned_to?: string;
  source_type?: "blind_spot" | "premortem" | "manual";
  source_id?: string;
}

export interface Decision {
  id: string;
  user_id: string;
  title: string;
  category: "career" | "business" | "product" | "financial" | "technical" | "personal";
  stakes: "low" | "medium" | "high" | "critical";
  reversibility: "two_way_door" | "one_way_door";
  deadline?: string;
  status: "draft" | "audited" | "decided" | "revisiting";
  emotional_state?: {
    gut_feeling?: string;
    stress_level?: number; // 1-10
    time_pressure?: boolean;
  };
  options: DecisionOption[];
  reasons: ReasonItem[];
  blind_spots: BlindSpotCard[];
  premortem_items: PremortemItem[];
  actions: EvidenceAction[];
  readiness_score: number; // 0-100
  ai_summary?: string;
  created_at: string;
  updated_at: string;
  is_sample?: boolean;
}

const DATA_DIR = path.resolve(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "decisions.json");

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

function readLocalDecisions(): Decision[] {
  try {
    ensureDataFile();
    const content = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(content || "[]");
  } catch (e) {
    return [];
  }
}

function writeLocalDecisions(decisions: Decision[]) {
  try {
    ensureDataFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(decisions, null, 2), "utf-8");
  } catch (e) {}
}

export async function getDecisions(userId: string): Promise<Decision[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("decisions")
      .select("*, decision_options(*), reasons(*), blind_spot_cards(*), premortem_items(*), evidence_actions(*)")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (!error && data) {
      return data.map((d: any) => ({
        id: d.id,
        user_id: d.user_id,
        title: d.title,
        category: d.category || "business",
        stakes: d.stakes || "medium",
        reversibility: d.reversibility || "two_way_door",
        deadline: d.deadline,
        status: d.status || "draft",
        emotional_state: d.emotional_state,
        options: d.decision_options || [],
        reasons: d.reasons || [],
        blind_spots: d.blind_spot_cards || [],
        premortem_items: d.premortem_items || [],
        actions: d.evidence_actions || [],
        readiness_score: d.readiness_score || 50,
        ai_summary: d.ai_summary,
        created_at: d.created_at,
        updated_at: d.updated_at,
        is_sample: d.is_sample,
      }));
    }
  } catch (e) {}

  // Fallback to local storage
  const local = readLocalDecisions();
  return local.filter((d) => d.user_id === userId || d.user_id === "local-user");
}

export async function getDecisionById(id: string, userId: string): Promise<Decision | null> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("decisions")
      .select("*, decision_options(*), reasons(*), blind_spot_cards(*), premortem_items(*), evidence_actions(*)")
      .eq("id", id)
      .single();

    if (!error && data) {
      return {
        id: data.id,
        user_id: data.user_id,
        title: data.title,
        category: data.category || "business",
        stakes: data.stakes || "medium",
        reversibility: data.reversibility || "two_way_door",
        deadline: data.deadline,
        status: data.status || "draft",
        emotional_state: data.emotional_state,
        options: data.decision_options || [],
        reasons: data.reasons || [],
        blind_spots: data.blind_spot_cards || [],
        premortem_items: data.premortem_items || [],
        actions: data.evidence_actions || [],
        readiness_score: data.readiness_score || 50,
        ai_summary: data.ai_summary,
        created_at: data.created_at,
        updated_at: data.updated_at,
        is_sample: data.is_sample,
      };
    }
  } catch (e) {}

  const local = readLocalDecisions();
  return local.find((d) => d.id === id) || null;
}

export async function saveDecision(decision: Decision): Promise<Decision> {
  const now = new Date().toISOString();
  decision.updated_at = now;
  if (!decision.created_at) decision.created_at = now;

  // Attempt Supabase insert/update
  try {
    const supabase = await createServerClient();
    await supabase.from("decisions").upsert({
      id: decision.id,
      user_id: decision.user_id,
      title: decision.title,
      category: decision.category,
      stakes: decision.stakes,
      reversibility: decision.reversibility,
      deadline: decision.deadline,
      status: decision.status,
      emotional_state: decision.emotional_state,
      readiness_score: decision.readiness_score,
      ai_summary: decision.ai_summary,
      updated_at: now,
      is_sample: decision.is_sample || false,
    });
  } catch (e) {}

  // Sync to local fallback storage
  const all = readLocalDecisions();
  const idx = all.findIndex((d) => d.id === decision.id);
  if (idx >= 0) {
    all[idx] = decision;
  } else {
    all.unshift(decision);
  }
  writeLocalDecisions(all);

  return decision;
}

export async function deleteDecision(id: string, userId: string): Promise<boolean> {
  try {
    const supabase = await createServerClient();
    await supabase.from("decisions").delete().eq("id", id).eq("user_id", userId);
  } catch (e) {}

  const all = readLocalDecisions();
  const filtered = all.filter((d) => d.id !== id);
  writeLocalDecisions(filtered);
  return true;
}
