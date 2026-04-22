const BASE_URL = import.meta.env.VITE_N8N_BASE_URL || '/api';

const API_URL = `${BASE_URL}/webhook/generate-notes`;
const EVAL_API_URL = `${BASE_URL}/webhook/evaluate-quiz`;
const USER_NOTES_API_URL = `${BASE_URL}/webhook/get-user-notes`;
const FEEDBACK_API_URL = `${BASE_URL}/webhook/submit-feedback`;

export const generateStudyPlan = async (topic, days, hoursPerDay, username, email) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        topic: topic,
        date: String(days),
        hours: String(hoursPerDay),
        username: username || "Guest",
        email: email || ''
      })
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText} - ${responseText}`);
    }

    if (!responseText.trim()) {
      throw new Error('Server returned an empty response. If using Cloudflare Tunnel, ensure n8n is running and the webhook executed successfully.');
    }

    try {
      return JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Received invalid JSON from server: ${responseText.substring(0, 50)}...`);
    }
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch the data. Check if the webhook is running.');
  }
};

export const evaluateQuiz = async (topic, answers, username, email) => {
  try {
    const response = await fetch(EVAL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        topic: topic,
        answers: answers,
        username: username || "Guest",
        email: email || ''
      })
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText} - ${responseText}`);
    }

    if (!responseText.trim()) {
      throw new Error('Quiz evaluation returned an empty response. Check the evaluate-quiz workflow in n8n.');
    }

    try {
      return JSON.parse(responseText);
    } catch {
      throw new Error(`Quiz evaluation returned invalid JSON: ${responseText}`);
    }
  } catch (error) {
    throw new Error(error.message || 'Failed to submit quiz.');
  }
};

export const getUserNotes = async (username) => {
  try {
    const response = await fetch(USER_NOTES_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Server error: ${response.status} ${response.statusText} - ${errText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch user notes.');
  }
};

export const submitFeedback = async (topic, rating, username, email) => {
  try {
    const response = await fetch(FEEDBACK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        topic: topic,
        rating: rating,
        username: username || "Guest",
        email: email || ''
      })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to submit feedback.');
  }
};
