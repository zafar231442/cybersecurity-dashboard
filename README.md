IntelliSOC — AI-Powered Phishing & Threat Analysis Dashboard (THE PROJECT IS STILL IN THE WORKS!!)

IntelliSOC is an enterprise-grade Security Operations Center (SOC) web application designed to analyze incoming email payloads for phishing indicators, malicious headers, urgency triggers, and domain spoofing. It features a seamless **Google OAuth 2.0 integration** with the **Gmail API** to fetch live unread inbox emails and run real-time heuristic and AI-driven deep analysis directly within the browser session.


#Key Features

-Live Gmail Integration: Connect directly to Google Mail via OAuth 2.0 to fetch and analyze unread messages in real time.
- Privacy-First Architecture: Zero-data-retention model. Emails are processed in-memory (RAM) on the client side and are never saved to disk or external databases.
- Dynamic Session Control: Single-click connection and session termination with automated UI state management and token clearing.
- Interactive Email Inspector: Analyze headers, subject lines, and raw message body content for psychological manipulation, domain spoofing, and malicious links.
- Pre-Loaded Threat Samples: Includes built-in demo presets for Phishing, Marketing Spam, and Clean Mail for rapid testing and demonstrations.

1. **Authentication:** The user initiates Google OAuth 2.0 login through the Express backend proxy (`/api/auth/google`).
2. **Token Handling:** Google returns an authorization code, which `server.js` exchanges for short-lived access tokens.
3. **Data Retrieval:** The frontend calls `/api/gmail/unread` to retrieve unread email metadata and content directly into browser memory.
4. **Session Termination:** Clicking **Disconnect Gmail** revokes server-side session credentials via `/api/gmail/disconnect` and resets the frontend state.

---

Security & Privacy Highlights (For Evaluators & Examiners)

- Zero Data Retention:Email bodies, sender information, and headers are parsed and analyzed purely within browser memory. No data is stored, logged, or written to server databases.
- Restricted Scopes:Uses Google’s official read-only scope (`https://www.googleapis.com/auth/gmail.readonly`). The dashboard can never alter, delete, or send emails on behalf of the user.
- Stateless Proxy Backend: `server.js` acts strictly as an API gateway for OAuth credential exchanges and API proxying.

---

 File Structure
 ```
major-project/
├── server.js             # Node.js Express server handling OAuth 2.0 & Gmail API endpoints
├── IntelliSOC.html       # Main SOC Dashboard UI, heuristic engine, & dynamic state handler
├── .env                  # Environment variables (Google Client ID & Secret - keep private)
└── package.json          # Node.js project dependencies
```

#Prerequisites & Installation
1. Prerequisites
-Node.js (v16+ recommended)
-A Google Cloud Console project with the Gmail API enabled and OAuth 2.0 Credentials generated.

2. Environment Setup
Create a .env file in the root directory:

```
PORT=3000
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```
3. Install Dependencies
   ```
    npm install express googleapis dotenv cors
   ```

 1. Quick Start / Running the App
Start the Express Backend Server:
```
node server.js
```
Access the Dashboard:
Open your browser and navigate to:
```
http://localhost:3000
```
Demonstrating Live OAuth & Email Scanning:

~Click Connect Gmail to authenticate with your Google Account.

~Upon redirection, the UI updates dynamically to Gmail Connected (Live) and the Disconnect Gmail button appears.

~The dashboard automatically pulls the latest unread email into the Email Payload Inspector and executes analysis.

~Click Disconnect Gmail to clear server credentials and wipe the form fields.








