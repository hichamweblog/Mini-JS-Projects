// Load environment variables from .env (only in development)
import fetch from 'node-fetch';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

export async function handler(event) {
  const UNSPLASH_API_URL = 'https://api.unsplash.com/photos/';
  const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

  if (!ACCESS_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing Unsplash access key' }),
    };
  }

  // Extract the count query parameter, default to 1 if not provided
  const count = event.queryStringParameters.count || 1;

  try {
    // Make a request to the Unsplash API
    const response = await fetch(
      `${UNSPLASH_API_URL}?client_id=${ACCESS_KEY}&per_page=${count}`
    );

    // Handle non-successful responses
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    // Parse and return the response data
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    // Log and return the error
    console.error('Error fetching photos:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch photos' }),
    };
  }
}
