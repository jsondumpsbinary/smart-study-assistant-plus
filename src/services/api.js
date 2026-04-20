const API_URL = '/api/webhook-test/generate-notes';
const EVAL_API_URL = '/api/webhook-test/evaluate-quiz';

export const generateStudyPlan = async (topic, days, hoursPerDay) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        topic: topic,
        date: String(days),
        hours: String(hoursPerDay)
      })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch the data. Check if the webhook is running.');
  }
};

export const evaluateQuiz = async (topic, answers) => {
  try {
    const response = await fetch(EVAL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        topic: topic,
        answers: answers
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Server error: ${response.status} ${response.statusText} - ${errText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to submit quiz.');
  }
};
