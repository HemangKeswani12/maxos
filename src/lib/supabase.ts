import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) return null;
  return data;
}

export async function upsertUserProfile(profile: {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  gender?: string | null;
  age?: number | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  insecurities?: string[];
  onboarding_complete?: boolean;
}) {
  const { data, error } = await supabase
    .from("user_profiles")
    .upsert(profile, { onConflict: "id" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function saveRoutineProgress(entry: {
  user_id: string;
  routine_id: string;
  completed: boolean;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from("routine_progress")
    .insert(entry)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getRoutineProgress(userId: string) {
  const { data, error } = await supabase
    .from("routine_progress")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(30);
  if (error) return [];
  return data;
}
