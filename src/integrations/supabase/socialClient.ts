
import { createClient } from '@supabase/supabase-js';
import type { RPCFunctions } from '@/types/supabase-augmentation';

const SUPABASE_URL = "https://gsantprpdytoyzmearrb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzYW50cHJwZHl0b3l6bWVhcnJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNTMwNTksImV4cCI6MjA1ODkyOTA1OX0.8jaATItoe5dAMC-yr4AmRM3Jzgmj_v7uYZw-JZMmnxA";

// Create a Supabase client with the RPC function types
export const socialSupabase = createClient<RPCFunctions>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
