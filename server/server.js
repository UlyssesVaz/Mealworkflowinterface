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
  // Set expiration with 5 minute buffer
  tokenExpiresAt = Date.now() + ((data.expires_in - 300) * 1000);
  return managementToken;
}

// JWT validation middleware
const checkJwt = auth({
  audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`, // This should match your API identifier in Auth0
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
});

// Helper function for updating metadata
async function updateUserMetadata(userId, metadata) {
  const token = await getManagementToken();

  const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      app_metadata: metadata
    })
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to update user metadata: ${errorData}`);
  }

  return await response.json();
}

// Endpoint to update onboarding status
app.post('/api/complete-onboarding', checkJwt, async (req, res) => {
  try {
    const userId = req.auth.payload.sub;
    const { profile } = req.body;

    if (!profile) {
      return res.status(400).json({ error: 'Profile data is required' });
    }

    // Save FULL profile to Auth0 app_metadata
    const metadata = {
      hasCompletedOnboarding: true,
      profile: {
        ...profile,
        userId,
        hasCompletedOnboarding: true
      }
    };

    await updateUserMetadata(userId, metadata);

    res.json({ 
      success: true,
      message: 'Onboarding completed successfully'
    });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    res.status(500).json({ 
      error: 'Failed to complete onboarding',
      details: error.message 
    });
  }
});

// Endpoint to update profile
app.post('/api/update-profile', checkJwt, async (req, res) => {
  try {
    const userId = req.auth.payload.sub;
    const { profile } = req.body;

    if (!profile) {
      return res.status(400).json({ error: 'Profile data is required' });
    }

    // Keep onboarding status but update rest of profile
    const metadata = {
      hasCompletedOnboarding: true,
      profile: {
        ...profile,
        userId,
        hasCompletedOnboarding: true
      }
    };

    await updateUserMetadata(userId, metadata);

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      details: error.message
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});