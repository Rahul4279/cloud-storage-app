// -------------------------------
// Cloud File Storage - DEMO VERSION
// -------------------------------

// DEMO MODE: This version works without Supabase setup
// To use with real Supabase, replace these with your actual credentials

// REAL SUPABASE CREDENTIALS - Your Cloud Storage is now LIVE!
const SUPABASE_URL = "https://xfdfgitzaeafklaxppze.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmZGZnaXR6YWVhZmtsYXhwcHplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5NDQzNzAsImV4cCI6MjA3NTUyMDM3MH0._F1ezbvwLxB-KKRVg4N8DoZk4B6OHATISNdDjxvwYu4";
const STORAGE_BUCKET = "user-files";

// Demo mode flag - NOW USING REAL SUPABASE!
const DEMO_MODE = false;

// Initialize Supabase - REAL CLOUD STORAGE ACTIVE!
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// UI elements
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const signupBtn = document.getElementById('signup-btn');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const authMsg = document.getElementById('auth-msg');

const uploadSection = document.getElementById('upload-section');
const uploadBtn = document.getElementById('upload-btn');
const fileInput = document.getElementById('file-input');
const uploadMsg = document.getElementById('upload-msg');
const uploadProgress = document.getElementById('upload-progress');

const filesSection = document.getElementById('files-section');
const filesList = document.getElementById('files-list');
const refreshFilesBtn = document.getElementById('refresh-files-btn');

// Auth helpers
async function signUp(email, password){
  console.log('Attempting signup with:', email);
  try {
    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    console.log('Signup result:', { data, error });
    return { data, error };
  } catch (err) {
    console.error('Signup error:', err);
    return { data: null, error: { message: err.message } };
  }
}

async function signIn(email, password){
  console.log('Attempting signin with:', email);
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    console.log('Signin result:', { data, error });
    return { data, error };
  } catch (err) {
    console.error('Signin error:', err);
    return { data: null, error: { message: err.message } };
  }
}

async function signOut(){
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.error('Signout error:', error);
    } else {
      console.log('Signout successful');
    }
  } catch (err) {
    console.error('Signout error:', err);
  }
}

function showAuthMessage(msg){ authMsg.textContent = msg || ''; }

function setLoggedInState(user){
  if(user){
    signupBtn.classList.add('hidden');
    loginBtn.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
    uploadSection.classList.remove('hidden');
    filesSection.classList.remove('hidden');
    showAuthMessage('Signed in as ' + (user.email || user.id));
    listFiles();
  } else {
    signupBtn.classList.remove('hidden');
    loginBtn.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
    uploadSection.classList.add('hidden');
    filesSection.classList.add('hidden');
    filesList.innerHTML = '';
    showAuthMessage('');
  }
}

// Attach events
signupBtn.addEventListener('click', async () => {
  console.log('Signup button clicked!');
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if(!email || !password){ 
    showAuthMessage('Enter email and password'); 
    return; 
  }
  
  showAuthMessage('Signing up...');
  console.log('Calling signUp function...');
  const { data, error } = await signUp(email, password);
  
  if(error) {
    console.error('Signup failed:', error);
    showAuthMessage('Signup failed: ' + error.message);
  } else {
    console.log('Signup successful:', data);
    showAuthMessage('Signup successful — check your email to confirm if required.');
  }
});

loginBtn.addEventListener('click', async () => {
  console.log('Login button clicked!');
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if(!email || !password){ 
    showAuthMessage('Enter email and password'); 
    return; 
  }
  
  showAuthMessage('Logging in...');
  console.log('Calling signIn function...');
  const { data, error } = await signIn(email, password);
  
  if(error) {
    console.error('Login failed:', error);
    showAuthMessage('Login failed: ' + error.message);
  } else {
    console.log('Login successful:', data);
    setLoggedInState(data.user);
  }
});

logoutBtn.addEventListener('click', async () => {
  await signOut();
  setLoggedInState(null);
});

// Refresh files button
refreshFilesBtn.addEventListener('click', async () => {
  console.log('Refresh files button clicked!');
  await listFiles();
});

// Upload handling
uploadBtn.addEventListener('click', async () => {
  const file = fileInput.files[0];
  if(!file) { uploadMsg.textContent = 'Pick a file first.'; return; }
  
  console.log('Upload button clicked!');
  console.log('Selected file:', file.name, file.size, 'bytes');
  
  uploadMsg.textContent = '';
  uploadProgress.classList.remove('hidden');
  uploadProgress.value = 0;

  try {
    // Get current user
    const { data: userData, error: userError } = await supabaseClient.auth.getUser();
    if (userError) {
      console.error('Error getting user:', userError);
      uploadMsg.textContent = 'Error: Not logged in properly';
      uploadProgress.classList.add('hidden');
      return;
    }
    
    const user = userData.user;
    if (!user) {
      uploadMsg.textContent = 'Error: Please login first';
      uploadProgress.classList.add('hidden');
      return;
    }
    
    console.log('Current user:', user.id, user.email);
    
    // Create file path with user ID
    const userId = user.id;
    const filePath = `${userId}/${file.name}`;
    console.log('Uploading to path:', filePath);
    
    uploadProgress.value = 30;
    
    // Upload file to Supabase storage
    const { data, error } = await supabaseClient.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, { 
        upsert: true,
        cacheControl: '3600'
      });
      
    if (error) {
      console.error('Upload error:', error);
      uploadMsg.textContent = `Upload failed: ${error.message}`;
      uploadProgress.classList.add('hidden');
      return;
    }
    
    console.log('Upload successful:', data);
    uploadMsg.textContent = 'Upload complete!';
    uploadProgress.value = 100;
    fileInput.value = '';
    
    // Refresh file list
    await listFiles();
    
    setTimeout(() => uploadProgress.classList.add('hidden'), 1000);
    
  } catch (err) {
    console.error('Upload exception:', err);
    uploadMsg.textContent = `Upload failed: ${err.message}`;
    uploadProgress.classList.add('hidden');
  }
});

// List files for current user
async function listFiles(){
  console.log('Listing files...');
  
  try {
    // Get current user
    const { data: userData, error: userError } = await supabaseClient.auth.getUser();
    if (userError) {
      console.error('Error getting user for file list:', userError);
      filesList.innerHTML = '<div class="muted">Error: Not logged in properly</div>';
      return;
    }
    
    const user = userData.user;
    if (!user) {
      console.log('No user, showing empty file list');
      filesList.innerHTML = '<div class="muted">Please login to see your files</div>';
      return;
    }
    
    console.log('Listing files for user:', user.id);
    console.log('User ID for filtering:', user.id);
    
    // List all files in the bucket
    const { data, error } = await supabaseClient.storage
      .from(STORAGE_BUCKET)
      .list('', { 
        limit: 1000, 
        offset: 0, 
        sortBy: { column: 'name', order: 'asc' } 
      });
      
    if (error) {
      console.error('Error listing files:', error);
      filesList.innerHTML = `<div class="muted">Error listing files: ${error.message}</div>`;
      return;
    }
    
    console.log('Raw file data from Supabase:', data);
    console.log('Total files found:', data.length);
    
    // Filter by user's prefix
    const prefix = `${user.id}/`;
    console.log('Looking for files with prefix:', prefix);
    
    const userFiles = data.filter(item => {
      console.log('Checking file:', item.name, 'starts with', prefix, '?', item.name.startsWith(prefix));
      return item.name.startsWith(prefix);
    });
    
    console.log('User files after filtering:', userFiles);
    console.log('Number of user files:', userFiles.length);
    
    // If no user-specific files, show all files for debugging
    if (userFiles.length === 0) {
      console.log('No user-specific files found. Showing all files for debugging:');
      filesList.innerHTML = `
        <div class="muted">No files found for user ${user.id}</div>
        <div class="muted">All files in bucket (for debugging):</div>
        <ul>
          ${data.map(item => `<li>${item.name}</li>`).join('')}
        </ul>
      `;
      return;
    }
    
    // Display files
    filesList.innerHTML = '';
    for (const file of userFiles) {
      const fileName = file.name.replace(prefix, '');
      console.log('Displaying file:', fileName, 'from path:', file.name);
      
      const row = document.createElement('div');
      row.className = 'file-row';
      
      const title = document.createElement('div');
      title.textContent = fileName;
      
      const actions = document.createElement('div');
      const viewBtn = document.createElement('a');
      viewBtn.href = '#';
      viewBtn.textContent = 'Download/View';
      viewBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log('Creating download URL for:', file.name);
        
        try {
          const { data: urlData, error: urlErr } = await supabaseClient.storage
            .from(STORAGE_BUCKET)
            .createSignedUrl(file.name, 60);
            
          if (urlErr) {
            console.error('Error creating download URL:', urlErr);
            alert('Error creating download URL: ' + urlErr.message);
            return;
          }
          
          console.log('Download URL created:', urlData.signedUrl);
          window.open(urlData.signedUrl, '_blank');
        } catch (err) {
          console.error('Exception creating download URL:', err);
          alert('Error: ' + err.message);
        }
      });
      
      actions.appendChild(viewBtn);
      row.appendChild(title);
      row.appendChild(actions);
      filesList.appendChild(row);
    }
    
  } catch (err) {
    console.error('Exception in listFiles:', err);
    filesList.innerHTML = `<div class="muted">Error: ${err.message}</div>`;
  }
}

// Keep UI updated based on auth state
supabaseClient.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session);
  const user = session && session.user ? session.user : null;
  setLoggedInState(user);
});

// On load, check if logged in
window.addEventListener('load', async () => {
  console.log('Page loaded, checking auth state...');
  try {
    const { data, error } = await supabaseClient.auth.getUser();
    if (error) {
      console.error('Error getting user:', error);
    }
    const user = data ? data.user : null;
    console.log('Current user:', user);
    setLoggedInState(user);
  } catch (err) {
    console.error('Error checking auth state:', err);
    setLoggedInState(null);
  }
});
