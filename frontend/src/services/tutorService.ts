const responses: Record<string, string> = {
  hello: 'Hello! This feature is not yet implemented.',
};

export const generateTutorResponse = async (userMessage: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerMessage = userMessage.toLowerCase();
      
      for (const [keyword, response] of Object.entries(responses)) {
        if (lowerMessage.includes(keyword)) {
          resolve(response);
          return;
        }
      }
      
      resolve('Hello! This feature is not yet implemented.');
    }, 800);
  });
};
