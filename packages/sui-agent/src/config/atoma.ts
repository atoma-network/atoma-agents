import { AtomaSDK } from 'atoma-sdk';
import * as dotenv from 'dotenv';
dotenv.config();

const ATOMA_CHAT_COMPLETIONS_MODEL =
  process.env.ATOMA_CHAT_MODEL || 'meta-llama/Llama-3.3-70B-Instruct';
console.log(ATOMA_CHAT_COMPLETIONS_MODEL);

class Atoma {
  private bearerAuth;
  constructor(bearerAuth: string) {
    this.bearerAuth = bearerAuth;
  }

  /**
   * Helper function to create chat completions using Atoma SDK
   * @param messages - Array of message objects with content and role
   * @param model - Optional model identifier (defaults to environment variable or Llama-3.3-70B-Instruct)
   * @returns Chat completion response
   */
  async atomaChat(
    messages: { content: string; role: string }[],
    model?: string,
  ) {
    console.log('**************');
    console.log('using atoma chat');
    console.log('**************');
    return await new AtomaSDK({ bearerAuth: this.bearerAuth }).chat.create({
      messages: messages,
      model: model || 'meta-llama/Llama-3.3-70B-Instruct',
    });
  }

  /**
   * Initialize Atoma SDK with authentication
   * @param bearerAuth - Bearer auth token for Atoma SDK
   * @returns Initialized Atoma SDK instance
   */
  public static initializeAtomaSDK(bearerAuth: string): AtomaSDK {
    return new AtomaSDK({ bearerAuth });
  }
  /**
   * Health check function that returns service status
   * @param sdk - Initialized Atoma SDK instance
   * @returns Boolean indicating if service is healthy
   */
  static async isAtomaHealthy(sdk: AtomaSDK): Promise<boolean> {
    try {
      await sdk.health.health();
      return true;
    } catch (error) {
      console.error('Atoma health check failed:', error);
      return false;
    }
  }
}

export default Atoma;
