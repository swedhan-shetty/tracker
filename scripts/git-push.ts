import { execSync } from 'child_process';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function pushToGitHub() {
  const token = await getAccessToken();
  const repo = 'swedhan-shetty/tracker';
  const gitUrl = `https://x-access-token:${token}@github.com/${repo}.git`;
  
  try {
    // Check if remote exists
    try {
      execSync('git remote get-url origin', { encoding: 'utf-8' });
      console.log('Remote origin already exists, updating...');
      execSync(`git remote set-url origin ${gitUrl}`, { encoding: 'utf-8' });
    } catch {
      console.log('Adding remote origin...');
      execSync(`git remote add origin ${gitUrl}`, { encoding: 'utf-8' });
    }
    
    // Stage all changes
    console.log('\nStaging changes...');
    execSync('git add .', { encoding: 'utf-8' });
    
    // Commit
    console.log('Committing changes...');
    try {
      execSync('git commit -m "Redesigned UI with improved layout, colors, and minimalist design"', { encoding: 'utf-8' });
      console.log('Changes committed successfully');
    } catch (e: any) {
      if (e.message.includes('nothing to commit')) {
        console.log('No changes to commit');
      } else {
        throw e;
      }
    }
    
    // Push
    console.log('\nPushing to GitHub...');
    const result = execSync('git push -u origin main', { encoding: 'utf-8' });
    console.log(result);
    console.log('\n✅ Successfully pushed to GitHub!');
    console.log('Your changes are now live at: https://github.com/swedhan-shetty/tracker');
    console.log('\nNetlify will automatically deploy your changes shortly.');
    
  } catch (error: any) {
    if (error.message.includes('main')) {
      console.log('\nTrying to push to master branch instead...');
      try {
        execSync('git push -u origin master', { encoding: 'utf-8' });
        console.log('\n✅ Successfully pushed to GitHub!');
        console.log('Your changes are now live at: https://github.com/swedhan-shetty/tracker');
      } catch (e) {
        console.error('Error pushing to GitHub:', e);
      }
    } else {
      console.error('Error:', error.message);
    }
  }
}

pushToGitHub().catch(console.error);
