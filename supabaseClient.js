import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sfaastgptbcmxjmxyzjt.supabase.co';  
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmYWFzdGdwdGJjbXhqbXh5emp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMDg2MjQsImV4cCI6MjA1Nzc4NDYyNH0.kDuYCQmO1F4D-fjxwigFjLCVQNi9zMWzKAMix3GX3PM';  

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      redirectTo: 'http://localhost:5173/',
    },
  });
