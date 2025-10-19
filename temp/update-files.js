const fs = require('fs');
const path = require('path');

// New content for files
const newFiles = {
  'styles.css': `:root {
    --bg: #0f172a;
    --panel: #1e293b;
    --card: #1e293b;
    --elev: rgba(2,6,23,0.9);
    --border: #334155;
    --text: #f1f5f9;
    --muted: #94a3b8;
    --accent: #3b82f6;
    --accent-hover: #60a5fa;
    --success: #22c55e;
    --error: #ef4444;
  }
  /* Rest of styles.css content */
`,
  'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Cloud Storage - Login</title>
    <link rel="stylesheet" href="styles.css">
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
    <header class="site-header">
        <div class="container header-inner">
            <div class="brand">
                Cloud Storage
                <span class="brand-sub">Secure File Storage</span>
            </div>
            <nav class="nav">
                <a href="files.html" class="btn secondary">Your Files</a>
            </nav>
        </div>
    </header>

    <main class="container">
        <h1 class="reveal">Welcome Back</h1>

        <section id="auth-section" class="card reveal">
            <h2>Sign in to your account</h2>
            <div id="auth-forms">
                <div class="row">
                    <input id="email" type="email" placeholder="Your email address" required>
                </div>
                <div class="row">
                    <input id="password" type="password" placeholder="Your password" required>
                </div>
                <div class="row buttons">
                    <button id="login-btn">Sign In</button>
                    <button id="signup-btn" class="secondary">Create Account</button>
                </div>
            </div>
            <p id="auth-msg" class="muted"></p>
        </section>

        <footer>
            <small>🚀 <strong>SECURE CLOUD STORAGE</strong> - Your files, anywhere, anytime.</small>
        </footer>
    </main>

    <script src="script.js"></script>
</body>
</html>`,
  'files.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Your Files - Cloud Storage</title>
    <link rel="stylesheet" href="styles.css">
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
    <header class="site-header">
        <div class="container header-inner">
            <div class="brand">
                <a href="index.html" style="color:inherit;text-decoration:none">Cloud Storage</a>
                <span class="brand-sub">Your Files</span>
            </div>
            <nav class="nav">
                <button id="refresh-files-btn" class="secondary">Refresh</button>
                <button id="logout-btn" class="secondary">Sign Out</button>
            </nav>
        </div>
    </header>

    <main class="container">
        <section id="upload-section" class="card reveal">
            <h2>Upload Files</h2>
            <div class="row">
                <input id="file-input" type="file" multiple>
                <button id="upload-btn">Upload Files</button>
            </div>
            <progress id="upload-progress" value="0" max="100" class="hidden"></progress>
            <p id="upload-msg" class="muted"></p>
        </section>

        <section id="files-section" class="card reveal">
            <h2>Your Uploaded Files</h2>
            <div class="search-bar row">
                <input type="search" id="search-files" placeholder="Search your files...">
                <button id="sort-files" class="secondary">Sort by Date</button>
            </div>
            <div id="files-list">
                <div class="loading">Loading your files...</div>
            </div>
        </section>
    </main>

    <template id="file-template">
        <div class="file-card">
            <div class="file-name"></div>
            <div class="file-info muted">
                <span class="file-size"></span>
                <span class="file-date"></span>
            </div>
            <div class="file-actions">
                <button class="download-btn secondary">Download</button>
                <button class="delete-btn secondary">Delete</button>
            </div>
        </div>
    </template>

    <script src="script.js"></script>
</body>
</html>`
};

// Update files
Object.entries(newFiles).forEach(([filename, content]) => {
  fs.writeFileSync(path.join(__dirname, filename), content, 'utf8');
});