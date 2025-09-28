import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lbpuzkqbarlbfjqvlzbd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxicHV6a3FiYXJsYmZqcXZsemJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MDU5NTMsImV4cCI6MjA3NDM4MTk1M30.idkjKTi6p1Ss7AgFiElWK4sVjIuDN7I4l0JPcu_Efck'

const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase;