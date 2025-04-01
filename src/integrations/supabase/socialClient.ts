
import { createClient } from '@supabase/supabase-js';
import type { SocialDatabase } from '@/types/supabase-social';
import type { TypedSupabaseClient } from '@/types/supabase-augmentation';

const SUPABASE_URL = "https://gsantprpdytoyzmearrb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzYW50cHJwZHl0b3l6bWVhcnJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNTMwNTksImV4cCI6MjA1ODkyOTA1OX0.8jaATItoe5dAMC-yr4AmRM3Jzgmj_v7uYZw-JZMmnxA";

// Create a Supabase client with our social database types
export const socialSupabase = createClient<SocialDatabase>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY) as TypedSupabaseClient;
