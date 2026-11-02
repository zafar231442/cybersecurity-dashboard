// server.js
const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files (HTML/CSS/JS)
app.use(express.static(__dirname));
// Serve static frontend files (HTML/CSS/JS)
app.use(express.static(__dirname));

// Serve main dashboard HTML at root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'IntelliSOC.html'));
});

// Configure Google OAuth 2.0 Client
// Configure Google OAuth 2.0 Client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// In-memory token storage (Use encrypted database in production)
let userTokens = null;

// ROUTE 1: Start OAuth Authorization
app.get('/api/auth/google', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly'], // Strict read-only scope
    prompt: 'consent'
  });
  res.redirect(authUrl);
});

// ROUTE 2: OAuth Callback Handling
app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    userTokens = tokens; // Save session token
    oauth2Client.setCredentials(tokens);
    
    // Redirect back to dashboard UI with connected flag
    res.redirect('/?gmail=connected');
  } catch (error) {
    console.error('OAuth token exchange error:', error);
    res.status(500).send('Authentication failed');
  }
});

// ROUTE 3: Fetch & Return Recent Unread Emails
app.get('/api/gmail/unread', async (req, res) => {
  if (!userTokens) {
    return res.status(401).json({ connected: false, message: 'Not authenticated with Gmail' });
  }

  try {
    oauth2Client.setCredentials(userTokens);
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Fetch list of unread inbox messages
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: 'is:unread',
      maxResults: 5
    });

    const messages = response.data.messages || [];
    const emailList = [];

    for (let msg of messages) {
      const detail = await gmail.users.messages.get({ userId: 'me', id: msg.id });
      const headers = detail.data.payload.headers;

      const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
      const sender = headers.find(h => h.name === 'From')?.value || 'Unknown Sender';
      const snippet = detail.data.snippet || '';

      emailList.push({
        id: msg.id,
        sender,
        subject,
        body: snippet
      });
    }

    res.json({ connected: true, emails: emailList });
  } catch (error) {
    console.error('Failed to fetch emails:', error);
    res.status(500).json({ error: 'Failed to retrieve Gmail inbox data' });
  }
});
// ROUTE: Disconnect Gmail Session
app.get('/api/gmail/disconnect', (req, res) => {
  oauth2Client.setCredentials({});
  
  if (typeof userTokens !== 'undefined') {
    userTokens = null;
  }

  res.json({ success: true, message: 'Gmail account disconnected successfully.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running securely on http://localhost:${PORT}`);
});