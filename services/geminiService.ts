
export const generateFullJourney = async (params: { 
  recipient: string, 
  nicknames: string, 
  keywords: string, 
  memory: string 
}) => {
  const textPrompt = `Generate a romantic journey for ${params.recipient}.
    Pet names: ${params.nicknames}.
    Keywords: ${params.keywords}.
    Memory: ${params.memory}.
    
    Return EXACTLY this format:
    [WHISPER]: (Short emotional text)
    [LETTER]: (3 paragraph deep letter)
    [PROPOSAL]: (Heartwarming proposal)
  `;

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: textPrompt })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Server error');
    }

    const data = await response.json();
    const rawText = data.text;

    const whisperMatch = rawText.match(/\[WHISPER\]: ([\s\S]*?)(?=\[LETTER\]|$)/);
    const letterMatch = rawText.match(/\[LETTER\]: ([\s\S]*?)(?=\[PROPOSAL\]|$)/);
    const proposalMatch = rawText.match(/\[PROPOSAL\]: ([\s\S]*?)$/);

    return {
      imageUrl: null,
      shortMessage: whisperMatch ? whisperMatch[1].trim() : `I love you, ${params.recipient}.`,
      loveLetter: letterMatch ? letterMatch[1].trim() : "You are my everything.",
      proposal: proposalMatch ? proposalMatch[1].trim() : `Will you be mine forever, ${params.recipient}?`
    };
  } catch (error) {
    console.error('Service Error:', error);
    throw error;
  }
};
