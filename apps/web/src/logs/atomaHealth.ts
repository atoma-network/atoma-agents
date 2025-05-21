import https from 'https';
import Atoma from '@atoma-agents/sui-agent/src/config/atoma';

interface ChatResponse {
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

// Function to check API availability
const checkApiAvailability = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const req = https.get('https://api.atoma.network/health', (res) => {
      resolve(res.statusCode === 200);
    });

    req.on('error', () => {
      resolve(false);
    });

    req.end();
  });
};

// Function to create a timeout promise
const timeoutPromise = (ms: number): Promise<never> =>
  new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), ms));

interface AtomaError {
  statusCode: number;
  body: string;
  contentType: string;
  rawResponse: unknown;
}

// Atoma SDK health check
export const checkAtomaSDK = async (bearerAuth: string): Promise<void> => {
  const atomaSDK = new Atoma(bearerAuth);

  try {
    console.log('\n=== Atoma SDK Diagnostic Check ===');
    console.log(`Bearer Token length: ${bearerAuth.length} characters`);
    console.log(
      `Bearer Token: ${bearerAuth.substring(0, 4)}...${bearerAuth.substring(bearerAuth.length - 4)}`
    );

    const apiAvailable = await checkApiAvailability();
    console.log(`API Health Check: ${apiAvailable ? 'OK' : 'Failed'}`);

    if (!apiAvailable) {
      throw new Error('API endpoint is not available');
    }

    console.log('\nAttempting to connect to Atoma API...');

    const result = (await Promise.race([
      atomaSDK.atomaChat([
        {
          role: 'user',
          content: 'Hi, are you there?'
        }
      ], process.env.ATOMA_CHAT_COMPLETIONS_MODEL),
      timeoutPromise(30000)
    ])) as ChatResponse;

    console.log('=== Chat Completion Response ===');
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log(`Model: ${result.model}`);
    console.log('\nResponse Content:');
    result.choices.forEach((choice, index: number) => {
      console.log(`Choice ${index + 1}:`);
      console.log(`  Role: ${choice.message.role}`);
      console.log(`  Content: ${choice.message.content}`);
    });
    console.log('\nAtoma SDK Check Complete ✅');
  } catch (error) {
    console.error('\n=== Atoma SDK Check Error ===');
    if (error && typeof error === 'object' && 'rawResponse' in error) {
      const atomaError = error as AtomaError;
      console.error(`Status Code: ${atomaError.statusCode}`);
      console.error(`Response Body: ${atomaError.body}`);
      console.error(`Content Type: ${atomaError.contentType}`);

      switch (atomaError.statusCode) {
        case 402:
          console.error('\nBalance Error:');
          console.error('Your account has insufficient balance to make this request.');
          console.error('\nSuggested actions:');
          console.error('1. Check your account balance at https://atoma.network');
          console.error('2. Add credits to your account');
          console.error('3. Consider using a different model with lower cost');
          console.error('4. Contact support if you believe this is an error');
          break;

        case 500:
          console.error('\nPossible issues:');
          console.error('1. Invalid or expired bearer token');
          console.error('2. Server-side issue with the model');
          console.error('3. Rate limiting or quota exceeded');
          console.error('\nSuggested actions:');
          console.error('- Verify your bearer token is valid');
          console.error('- Try a different model');
          console.error('- Check your API usage quota');
          console.error('- Contact support if the issue persists');
          break;
      }
    }
    console.error('\nFull Error Stack:', error);
    console.error('\nAtoma SDK Check Failed ❌');
  }
};
