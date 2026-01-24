import type { ChatMessage } from '@shared';

const responses: Record<string, string> = {
  hello: '你好！我是你的中文学习助手。我可以帮你理解语法、练习对话或回答问题。',
  grammar: '中文语法的基本结构是"主语-动词-宾语"(SVO)。时间表达通常放在句首。',
  tone: '中文有四个主要声调：第一声(平)、第二声(升)、第三声(降升)、第四声(降)。',
  practice: '很好！我们来练习一些常用短语。试着说"我想学中文"。',
  help: '我可以帮你：\n- 解释语法规则\n- 练习对话\n- 回答关于中文的问题\n- 提供学习建议',
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
      
      resolve('这是一个很好的问题！作为一个模拟助手，我建议你继续练习和探索。试着使用句子分析工具来学习更多。');
    }, 800);
  });
};
