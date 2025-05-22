import { AtomaSDK } from 'atoma-sdk';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Default model for chat completions if not specified in environment
 * Currently defaults to Llama-3.3-70B-Instruct for optimal performance
 *
 * TODO:
 * - Add support for model fallbacks
 * - Implement model performance tracking
 * - Add model selection based on query complexity
 */
const ATOMA_CHAT_COMPLETIONS_MODEL =
  process.env.ATOMA_CHAT_COMPLETIONS_MODEL || 'meta-llama/Llama-3.3-70B-Instruct';
console.log(ATOMA_CHAT_COMPLETIONS_MODEL);

/**
 * Core class for interacting with the Atoma AI platform.
 * Handles all LLM-related operations including chat completions and health checks.
 *
 * This class serves as the primary interface for:
 * - Chat completions
 * - Model management
 * - Health monitoring
 * - SDK initialization
 *
 * TODO:
 * - Implement request rate limiting
 * - Add response caching
 * - Implement retry mechanisms
 * - Add support for streaming responses
 * - Implement context management
 * - Add token usage tracking
 * - Implement cost optimization strategies
 */
class Atoma {
  private bearerAuth;

  /**
   * Creates a new Atoma instance with authentication
   *
   * @param bearerAuth - Bearer authentication token for API access
   *
   * TODO:
   * - Add support for multiple authentication methods
   * - Implement token refresh mechanism
   * - Add token validation
   */
  constructor(bearerAuth: string) {
    this.bearerAuth = bearerAuth;
  }

  /**
   * Creates chat completions using the Atoma SDK.
   * Handles message formatting and model selection.
   *
   * @param messages - Array of message objects containing content and role
   * @param model - Optional model identifier (defaults to environment variable or Llama-3.3-70B-Instruct)
   * @returns Promise containing chat completion response
   *
   * TODO:
   * - Implement message validation
   * - Add support for conversation history
   * - Implement response filtering
   * - Add support for system messages
   * - Implement prompt optimization
   * - Add response quality checks
   */
  async atomaChat(
    messages: { content: string; role: string }[],
    model?: string,
  ) {
    console.log('**************');
    console.log('using atoma chat with model', model);
    console.log('**************');
    return await new AtomaSDK({ bearerAuth: this.bearerAuth }).confidentialChat.create({
      messages: messages,
      model: model || 'meta-llama/Llama-3.3-70B-Instruct',
    });
  }

  /**
   * Initializes the Atoma SDK with authentication.
   * Creates and configures a new SDK instance.
   *
   * @param bearerAuth - Bearer authentication token
   * @returns Configured AtomaSDK instance
   *
   * TODO:
   * - Add SDK configuration validation
   * - Implement SDK instance pooling
   * - Add support for custom configurations
   */
  public static initializeAtomaSDK(bearerAuth: string): AtomaSDK {
    return new AtomaSDK({ bearerAuth });
  }

  /**
   * Performs a health check on the Atoma service.
   * Verifies if the service is responsive and functioning correctly.
   *
   * @param sdk - Initialized Atoma SDK instance
   * @returns Promise<boolean> indicating if service is healthy
   *
   * TODO:
   * - Add detailed health metrics
   * - Implement health check caching
   * - Add support for custom health checks
   * - Implement health check alerts
   * - Add performance monitoring
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
