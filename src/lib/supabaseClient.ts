// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://myqpuggpdfhvpwwcfvsx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cXB1Z2dwZGZodnB3d2NmdnN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3NzgxODAsImV4cCI6MjA2NDM1NDE4MH0.Enten9q5adChQESJHd04LDopC3JVk6kKDvzdKcQ1oEM';

export const supabase = createClient(supabaseUrl, supabaseKey);