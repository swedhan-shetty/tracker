// Manual Cloud Mode Enabler Script
// Copy and paste this entire script into your browser console

console.log('🚀 Enabling Cloud Mode Manually...');

// Step 1: Clear localStorage preferences
localStorage.removeItem('use-local-storage');
localStorage.removeItem('dailyEntries');
localStorage.removeItem('habits');

// Step 2: Create a function to force cloud mode
window.enableCloudMode = async function() {
    console.log('🔄 Forcing cloud authentication...');
    
    try {
        // Import Supabase (assuming it's loaded in the page)
        const supabaseUrl = 'https://fskadzvpcknoeeqxjtom.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZza2FkenZwY2tub2VlcXhqdG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MjY4MjEsImV4cCI6MjA3MzEwMjgyMX0.C3U_Y_q8VPMa0CJFOu5-7yR4GZgyyHk4uZb9sGIhfOc';
        
        // Create Supabase client
        if (typeof window.supabase !== 'undefined') {
            const { createClient } = window.supabase;
            const sb = createClient(supabaseUrl, supabaseKey);
            
            console.log('✅ Supabase client created');
            
            // Check current auth status
            const { data: { user }, error } = await sb.auth.getUser();
            
            if (error) {
                console.log('❌ Auth error:', error.message);
                // If not authenticated, show sign-in form
                showManualSignIn(sb);
            } else if (user) {
                console.log('✅ User is authenticated:', user.email);
                // Force reload the app to bypass the timeout
                forceCloudReload();
            } else {
                console.log('ℹ️ No user found, need to sign in');
                showManualSignIn(sb);
            }
        } else {
            console.log('❌ Supabase not loaded, trying alternative method...');
            // Alternative: just force reload with longer wait
            forceCloudReload();
        }
    } catch (err) {
        console.error('❌ Error enabling cloud mode:', err);
        console.log('🔄 Trying fallback method...');
        forceCloudReload();
    }
};

// Function to show manual sign-in
function showManualSignIn(supabaseClient) {
    const email = prompt('Enter your email (swadhen.shetty@gmail.com):');
    const password = prompt('Enter your password:');
    
    if (email && password) {
        supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        }).then(({ data, error }) => {
            if (error) {
                console.log('❌ Sign in failed:', error.message);
                alert('Sign in failed: ' + error.message);
            } else {
                console.log('✅ Signed in successfully!');
                forceCloudReload();
            }
        });
    }
}

// Function to force reload in cloud mode
function forceCloudReload() {
    console.log('🔄 Forcing app reload in cloud mode...');
    localStorage.setItem('force-cloud-mode', 'true');
    localStorage.removeItem('use-local-storage');
    
    // Add a custom override to the page
    const script = document.createElement('script');
    script.textContent = `
        // Override the app timeout
        if (window.React) {
            console.log('Overriding React app timeout behavior...');
        }
        
        // Set a flag for the app to use
        window.FORCE_CLOUD_MODE = true;
        window.CLOUD_AUTH_TIMEOUT = 15000; // 15 seconds
    `;
    document.head.appendChild(script);
    
    setTimeout(() => {
        location.reload();
    }, 1000);
}

console.log('✅ Cloud mode enabler loaded!');
console.log('💡 Now run: enableCloudMode()');

// Auto-run if this is being pasted directly
if (confirm('Auto-run cloud mode enabler now?')) {
    enableCloudMode();
}