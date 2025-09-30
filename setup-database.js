const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://fskadzvpcknoeeqxjtom.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZza2FkenZwY2tub2VlcXhqdG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MjY4MjEsImV4cCI6MjA3MzEwMjgyMX0.C3U_Y_q8VPMa0CJFOu5-7yR4GZgyyHk4uZb9sGIhfOc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔄 Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('daily_entries').select('id').limit(1);
    
    if (error) {
      if (error.code === '42P01') {
        console.log('❌ Tables do not exist yet. Need to run SQL schema.');
        console.log('\n📋 Please follow these steps:');
        console.log('1. Go to https://supabase.com/dashboard');
        console.log('2. Open your "daily-tracker" project');
        console.log('3. Go to SQL Editor');
        console.log('4. Run the SQL from supabase-schema.sql file');
        return false;
      } else {
        console.log('❌ Database error:', error);
        return false;
      }
    }
    
    console.log('✅ Database tables exist and connection successful!');
    return true;
  } catch (err) {
    console.log('❌ Connection failed:', err.message);
    return false;
  }
}

async function checkAuth() {
  console.log('🔄 Testing authentication...');
  
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('❌ Auth error:', error);
      return false;
    }
    
    console.log('✅ Authentication is working');
    return true;
  } catch (err) {
    console.log('❌ Auth test failed:', err.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Supabase Database Setup Helper');
  console.log('==================================\n');
  
  const connectionOk = await testConnection();
  const authOk = await checkAuth();
  
  if (connectionOk && authOk) {
    console.log('\n🎉 Everything is set up correctly!');
    console.log('You can now enable database mode in your app.');
  } else {
    console.log('\n⚠️  Setup required. Please complete the steps above.');
    
    console.log('\n📄 SQL Schema to run:');
    console.log('===================');
    try {
      const schema = fs.readFileSync('./supabase-schema.sql', 'utf8');
      console.log(schema);
    } catch (err) {
      console.log('Error reading schema file:', err.message);
    }
  }
}

main().catch(console.error);