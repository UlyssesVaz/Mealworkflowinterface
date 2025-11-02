require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { auth } = require('express-oauth2-jwt-bearer');

const app = express();
app.use(cors());
app.use(express.json());

// Auth0 management API token
let managementToken = null;
let tokenExpiresAt = 0;

// Function to get a valid management token
async function getManagementToken() {
  if (managementToken && Date.now() < tokenExpiresAt) {
    return managementToken;
  }

  const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
      grant_type: 'client_credentials'
    })
  });

  const data = await response.json();
  managementToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in * 1000);
  return managementToken;
}

// JWT validation middleware
const checkJwt = auth({
  audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
});

// Endpoint to update onboarding status
app.post('/api/complete-onboarding', checkJwt, async (req, res) => {
  try {
    const userId = req.auth.payload.sub;
    
    // Get management token
    const token = await getManagementToken();

    // Update user's app_metadata using Management API
    const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        app_metadata: {
          hasCompletedOnboarding: true
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to update user metadata: ${errorData}`);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating onboarding status:', error);
    res.status(500).json({ error: 'Failed to update onboarding status' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});