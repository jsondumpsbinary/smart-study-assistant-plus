const API_URL = 'http://localhost:5678/webhook/generate-notes';

export const generateStudyPlan = async (topic, days, hoursPerDay) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        topic: topic,
        days: Number(days),
        hoursPerDay: Number(hoursPerDay)
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
