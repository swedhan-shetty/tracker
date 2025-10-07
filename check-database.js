const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wrouapuobmzawodrzbpr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indyb3VhcHVvYm16YXdvZHJ6YnByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjkxODAsImV4cCI6MjA3NDkwNTE4MH0.qwUd7P1VKs31tSr_mk1QeCMNtR2rMcauGNRxa_NZmD0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStatus() {
  console.log('🔄 Checking Supabase project status...');
  console.log(`📡 URL: ${supabaseUrl}`);
  
  try {
    // Simple health check
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('❌ Project still not ready:', error.message);
      return false;
    }
    
    console.log('✅ Project is ONLINE! Authentication working.');
    
    // Check if tables exist
    const { data: tableData, error: tableError } = await supabase
      .from('daily_entries')
      .select('id')
      .limit(1);
    
    if (tableError) {
      if (tableError.code === '42P01') {
        console.log('📝 Project is online but tables need to be created.');
        console.log('🔧 Next step: Run the SQL schema in Supabase dashboard');
        return 'needs_schema';
      } else {
        console.log('❌ Table check error:', tableError);
        return false;
      }
    }
    
    console.log('🎉 Database tables exist! Everything is ready!');
    return true;
    
  } catch (err) {
    if (err.message.includes('521') || err.message.includes('Web server is down')) {
      console.log('⏳ Project still paused - waiting for resume...');
    } else {
      console.log('❌ Error:', err.message);
    }
    return false;
  }
}

async function main() {
  console.log('🚀 Supabase Status Checker');
  console.log('========================\n');
  
  const status = await checkStatus();
  
  if (status === true) {
    console.log('\n✅ Ready to enable cloud backup!');
    console.log('Run: npm run enable-database');
  } else if (status === 'needs_schema') {
    console.log('\n📋 Go to Supabase SQL Editor and run the schema');
    console.log('Then run this check again');
  } else {
    console.log('\n⏳ Project still resuming... try again in a few minutes');
  }
}

main().catch(console.error);