import { AtomaSDK } from 'atoma-sdk';

const ATOMA_CHAT_COMPLETIONS_MODEL = 'meta-llama/Llama-3.3-70B-Instruct';

/**
 * Initialize Atoma SDK with authentication
 * @param bearerAuth - Bearer auth token for Atoma SDK
 * @returns Initialized Atoma SDK instance
 */
export function initializeAtomaSDK(bearerAuth: string): AtomaSDK {
  return new AtomaSDK({ bearerAuth });
}

/**
 * Helper function to create chat completions using Atoma SDK
 * @param sdk - Initialized Atoma SDK instance
 * @param messages - Array of message objects with content and role
 * @param model - Optional model identifier (defaults to Llama-3.3-70B-Instruct)
 * @returns Chat completion response
 */
async function atomaChat(
  sdk: AtomaSDK,
  messages: { content: string; role: string }[],
  model?: string,
) {
  try {
    return await sdk.chat.create({
      messages,
      model: model || ATOMA_CHAT_COMPLETIONS_MODEL,
      maxTokens: 4096,
    });
  } catch (error) {
    // Log the error for monitoring
    console.error('Atoma service error:', error);

    // Return a fallback response that indicates service unavailability
    return {
      choices: [
        {
          message: {
            content: JSON.stringify([
              {
                reasoning: 'Atoma service is currently unavailable',
                response:
                  'The AI service is temporarily unavailable. Please try direct API calls or check back later.',
                status: 'failure',
                query:
                  messages[messages.length - 1]?.content || 'Unknown query',
                errors: ['AI service unavailable'],
              },
            ]),
          },
        },
      ],
    };
  }
}

/**
 * Health check function that returns service status
 * @param sdk - Initialized Atoma SDK instance
 * @returns Boolean indicating if service is healthy
 */
async function isAtomaHealthy(sdk: AtomaSDK): Promise<boolean> {
  try {
    await sdk.health.health();
    return true;
  } catch (error) {
    console.error('Atoma health check failed:', error);
    return false;
  }
}

export { atomaChat, isAtomaHealthy };
