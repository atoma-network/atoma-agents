import React from 'react';
import { keywords } from '../data';
import api from '../lib/api';
import JSONFormatter from './JSONFormatter';
class Utils {
  public getConversations = () => {};
  public handleSend = async (
    inputValue: string,
    setMessages: React.Dispatch<
      React.SetStateAction<
        {
          text: string;
          sender: 'user' | 'llm';
          isHTML?: boolean;
        }[]
      >
    >,
    setIsThinking: React.Dispatch<React.SetStateAction<boolean>>,
    setInputValue: React.Dispatch<React.SetStateAction<string>>,
    address?: string | undefined,
    message?: string
  ) => {
    const userMessage = message || inputValue.trim();

    if (userMessage) {
      setMessages((prev) => [...prev, { text: userMessage, sender: 'user' }]);
      setIsThinking(true);
      setInputValue('');

      try {
        let modifiedMessage = userMessage;

        const containsKeywords = keywords.some((keyword) =>
          userMessage.toLowerCase().includes(keyword)
        );

        if (containsKeywords) {
          modifiedMessage = `${userMessage}. My wallet address is ${address}.`;
        }

        console.log(modifiedMessage, 'modified');
        const response = await api.post('/query', { prompt: modifiedMessage });
        const res = response.data[0];
        console.log(res);
        let llmResponse = '';

        if (typeof res.response === 'string') {
          llmResponse = res.response;
        } else {
          llmResponse = JSONFormatter.format(res.response);
        }

        setMessages((prev) => [...prev, { text: llmResponse, sender: 'llm', isHTML: true }]);
      } catch (error) {
        console.error('Error querying the LLM:', error);
        setMessages((prev) => [
          ...prev,
          {
            text: 'Sorry, there was an error. Please try again.',
            sender: 'llm',
            isHTML: false
          }
        ]);
      } finally {
        setIsThinking(false);
      }
    }
  };
}
export default Utils;
