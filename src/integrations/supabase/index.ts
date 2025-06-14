
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fiymplhjhxgoyuubqevu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpeW1wbGhqaHhnb3l1dWJxZXZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3NTcwODEsImV4cCI6MjA2NDMzMzA4MX0.mKVmSNmg4Va7j5pl5sKn1joctmN-gepi1J1rJDosg1Q'

export const supabase = createClient(supabaseUrl, supabaseKey)
