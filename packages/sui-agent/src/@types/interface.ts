// Response interface for the intent agent's operations
export interface IntentAgentResponse {
  success: boolean; // Indicates if the operation was successful
  selected_tool: null | string; // Name of the tool that was selected for the operation
  response: null | string; // Response message from the operation
  needs_additional_info: boolean; // Indicates if more information is needed
  additional_info_required: null | string[]; // List of additional information fields needed
  tool_arguments: (string | number | boolean | bigint)[]; // Arguments passed to the tool
}

export type ToolArgument = string | number | boolean | bigint;

// Response interface for tool operations (similar to IntentAgentResponse)
export interface toolResponse {
  success: boolean;
  selected_tool: null | string;
  response: null | string;
  needs_additional_info: boolean;
  additional_info_required: null | string[];
  tool_arguments: (string | number | boolean | bigint)[];
}

// Defines the structure for tool parameters
export interface ToolParameter {
  name: string; // Name of the parameter
  type: string; // Data type of the parameter
  description: string; // Description of what the parameter does
  required: boolean; // Whether the parameter is mandatory
}

// Defines the structure for tools that can be used by the agent
export interface Tool {
  name: string; // Name of the tool
  description: string; // Description of what the tool does
  parameters: ToolParameter[]; // List of parameters the tool accepts
  process: (
    ...args: (string | number | boolean | bigint)[]
  ) => Promise<string> | string; // Function to execute the tool
}

// Mapping of different coin names/variants to their standardized symbol
// This helps in recognizing different ways users might refer to the same coin
export const COIN_SYNONYMS: Record<string, string> = {
  // SUI and variants
  SUI: 'SUI',
  SUICOIN: 'SUI',
  // USDC and variants
  USDC: 'USDC',
  'USD COIN': 'USDC',
  USDCOIN: 'USDC',
  // BTC and variants
  BTC: 'BTC',
  BITCOIN: 'BTC',
  XBT: 'BTC',
  // AFSUI and variants
  AFSUI: 'AFSUI',
  'AFTERMATH SUI': 'AFSUI',
  // MSUI and variants
  MSUI: 'MSUI',
  MYSUI: 'MSUI',
  // CERT and variants
  CERT: 'CERT',
  CERTIFICATE: 'CERT',
  // SPRING_SUI and variants
  SPRING_SUI: 'SPRING_SUI',
  SPRINGSUI: 'SPRING_SUI',
  'SPRING SUI': 'SPRING_SUI',
  // KSUI and variants
  KSUI: 'KSUI',
  KEYSUI: 'KSUI',
  // HASUI and variants
  HASUI: 'HASUI',
  'HA SUI': 'HASUI',
  // STSUI and variants
  STSUI: 'STSUI',
  'ST SUI': 'STSUI',
  // BOB and variants
  BOB: 'BOB',
  BOBCOIN: 'BOB',
  // MAYA and variants
  MAYA: 'MAYA',
  MAYACOIN: 'MAYA',
  // AXOL and variants
  AXOL: 'AXOL',
  AXOLOTL: 'AXOL',
  // DEEP and variants
  DEEP: 'DEEP',
  DEEPBOOK: 'DEEP',
  // FASUI and variants
  FASUI: 'FASUI',
  'FA SUI': 'FASUI',
  // PEPE and variants
  PEPE: 'PEPE',
  PEPECOIN: 'PEPE',
  // SEPE and variants
  SEPE: 'SEPE',
  SEPECOIN: 'SEPE',
  // CETUS and variants
  CETUS: 'CETUS',
  CETUSCOIN: 'CETUS',
  // TURBOS and variants
  TURBOS: 'TURBOS',
  TURBO: 'TURBOS',
  // BLUE and variants
  BLUE: 'BLUE',
  BLUECOIN: 'BLUE',
  // PUMPKIN and variants
  PUMPKIN: 'PUMPKIN',
  PUMPKINCOIN: 'PUMPKIN',
  // BUT and variants
  BUT: 'BUT',
  BUTTERFLY: 'BUT',
  // DOOM and variants
  DOOM: 'DOOM',
  DOOMCOIN: 'DOOM',
  // SUIAI and variants
  SUIAI: 'SUIAI',
  'SUI AI': 'SUIAI',
  // AI and variants
  AI: 'AI',
  AICOIN: 'AI',
  // WSB and variants
  WSB: 'WSB',
  WSBCOIN: 'WSB',
} as const;

// Mapping of coin symbols to their respective addresses on the Sui network
// These addresses are used to interact with the coins on the blockchain
export const COIN_ADDRESSES = {
  SUI: '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI',
  USDC: '0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT',
  BTC: '0x027792d9fed7f9844eb4839566001bb6f6cb4804f66aa2da6fe1ee242d896881::coin::COIN',
  AFSUI:
    '0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc::afsui::AFSUI',
  MSUI: '0x922d15d7f55c13fd790f6e54397470ec592caa2b508df292a2e8553f3d3b274f::msui::MSUI',
  CERT: '0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT',
  SPRING_SUI:
    '0x83556891f4a0f233ce7b05cfe7f957d4020492a34f5405b2cb9377d060bef4bf::spring_sui::SPRING_SUI',
  KSUI: '0x41ff228bfd566f0c707173ee6413962a77e3929588d010250e4e76f0d1cc0ad4::ksui::KSUI',
  HASUI:
    '0xbde4ba4c2e274a60ce15c1cfff9e5c42e41654ac8b6d906a57efa4bd3c29f47d::hasui::HASUI',
  STSUI:
    '0xd1b72982e40348d069bb1ff701e634c117bb5f741f44dff91e472d3b01461e55::stsui::STSUI',
  BOB: '0x5f3a18cdfd7ef0527a65ba5c07dbe0efe276507d4d1a4d1bebe87f5d40df6cf6::bob::BOB',
  MAYA: '0x3bf0aeb7b9698b18ec7937290a5701088fcd5d43ad11a2564b074d022a6d71ec::maya::MAYA',
  AXOL: '0xae00e078a46616bf6e1e6fb673d18dcd2aa31319a07c9bc92f6063363f597b4e::AXOL::AXOL',
  DEEP: '0xdeeb7a4662eec9f2f3def03fb937a663dddaa2e215b8078a284d026b7946c270::deep::DEEP',
  FASUI:
    '0x6a474a6b7e7f3dd0b4eb65af96ebb3c2c0b7b7e301392532adb855a37d133615::fasui::FASUI',
  PEPE: '0x288710173f12f677ac38b0c2b764a0fea8108cb5e32059c3dd8f650d65e2cb25::pepe::PEPE',
  SEPE: '0xc6b2f19923f3c62ccc5d10c2247873d033128d0d056eba1d27cd29441b8b7f69::sepe::SEPE',
  CETUS:
    '0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS',
  TURBOS:
    '0x5d1f47ea69bb0de31c313d7acf89b890dbb8991ea8e03c6c355171f84bb1ba4a::turbos::TURBOS',
  BLUE: '0xe1b45a0e641b9955a20aa0ad1c1f4ad86aad8afb07296d4085e349a50e90bdca::blue::BLUE',
  PUMPKIN:
    '0x09f1c8f05cb47bbcb61133dd2ef00583720694f41d4f8a61c94467d8f5911a14::pumpkin::PUMPKIN',
  BUT: '0xbc858cb910b9914bee64fff0f9b38855355a040c49155a17b265d9086d256545::but::BUT',
  DOOM: '0x11b0c9b146219f08884bebf3d8c7c8f6ad96a8d2416e3c2e1e174030c544d8a7::doom::DOOM',
  SUIAI:
    '0x8f6808fcea9d5143e6d1577822fd49e783cb5ad2be042f4295e7fe2d5cb10b31::suiai::SUIAI',
  AI: '0x089de9a53ffd1f9252cf97e32e11b9a242f813e34227362b674b963468ec6620::ai::AI',
  WSB: '0x4db126eac4fa99207e98db61d968477021fdeae153de3b244bcfbdc468ef0722::wsb::WSB',
} as const;

// Structure for token balance information
export interface TokenBalance {
  token: string; // Token address or identifier
  amount: bigint; // Token amount
  symbol?: string; // Token symbol (optional)
  decimals?: number; // Number of decimal places for the token (optional)
}

// Configuration for a specific network (mainnet or testnet)
export interface NetworkConfig {
  fullnode: string; // URL for the network's fullnode
  faucet?: string; // URL for the network's faucet (optional)
}

// Configuration for all supported networks
export interface NetworkConfigs {
  MAINNET: NetworkConfig; // Mainnet configuration
  TESTNET: NetworkConfig; // Testnet configuration
}

// Network configuration constants
export const NETWORK_CONFIG: NetworkConfigs = {
  MAINNET: {
    fullnode: 'https://fullnode.mainnet.sui.io',
    faucet: undefined,
  },
  TESTNET: {
    fullnode: 'https://fullnode.testnet.sui.io',
    faucet: 'https://faucet.testnet.sui.io/gas',
  },
};
