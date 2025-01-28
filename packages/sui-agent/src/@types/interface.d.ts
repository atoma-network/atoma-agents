export interface IntentAgentResponse {
  success: boolean;
  selected_tool: null | string;
  response: null | string;
  needs_additional_info: boolean;
  additional_info_required: null | string[];
  tool_arguments: any[];
}
export interface toolResponse {
  success: boolean;
  selected_tool: null | string;
  response: null | string;
  needs_additional_info: boolean;
  additional_info_required: null | string[];
  tool_arguments: any[];
}
export interface ToolParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
}
export interface Tool {
  name: string;
  description: string;
  parameters: ToolParameter[];
  process: (...args: any[]) => Promise<string> | string;
}
export declare const COIN_SYNONYMS: Record<string, string>;
export declare const COIN_ADDRESSES: {
  readonly SUI: '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI';
  readonly USDC: '0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT';
  readonly BTC: '0x027792d9fed7f9844eb4839566001bb6f6cb4804f66aa2da6fe1ee242d896881::coin::COIN';
  readonly AFSUI: '0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc::afsui::AFSUI';
  readonly MSUI: '0x922d15d7f55c13fd790f6e54397470ec592caa2b508df292a2e8553f3d3b274f::msui::MSUI';
  readonly CERT: '0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT';
  readonly SPRING_SUI: '0x83556891f4a0f233ce7b05cfe7f957d4020492a34f5405b2cb9377d060bef4bf::spring_sui::SPRING_SUI';
  readonly KSUI: '0x41ff228bfd566f0c707173ee6413962a77e3929588d010250e4e76f0d1cc0ad4::ksui::KSUI';
  readonly HASUI: '0xbde4ba4c2e274a60ce15c1cfff9e5c42e41654ac8b6d906a57efa4bd3c29f47d::hasui::HASUI';
  readonly STSUI: '0xd1b72982e40348d069bb1ff701e634c117bb5f741f44dff91e472d3b01461e55::stsui::STSUI';
  readonly BOB: '0x5f3a18cdfd7ef0527a65ba5c07dbe0efe276507d4d1a4d1bebe87f5d40df6cf6::bob::BOB';
  readonly MAYA: '0x3bf0aeb7b9698b18ec7937290a5701088fcd5d43ad11a2564b074d022a6d71ec::maya::MAYA';
  readonly AXOL: '0xae00e078a46616bf6e1e6fb673d18dcd2aa31319a07c9bc92f6063363f597b4e::AXOL::AXOL';
  readonly DEEP: '0xdeeb7a4662eec9f2f3def03fb937a663dddaa2e215b8078a284d026b7946c270::deep::DEEP';
  readonly FASUI: '0x6a474a6b7e7f3dd0b4eb65af96ebb3c2c0b7b7e301392532adb855a37d133615::fasui::FASUI';
  readonly PEPE: '0x288710173f12f677ac38b0c2b764a0fea8108cb5e32059c3dd8f650d65e2cb25::pepe::PEPE';
  readonly SEPE: '0xc6b2f19923f3c62ccc5d10c2247873d033128d0d056eba1d27cd29441b8b7f69::sepe::SEPE';
  readonly CETUS: '0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS';
  readonly TURBOS: '0x5d1f47ea69bb0de31c313d7acf89b890dbb8991ea8e03c6c355171f84bb1ba4a::turbos::TURBOS';
  readonly BLUE: '0xe1b45a0e641b9955a20aa0ad1c1f4ad86aad8afb07296d4085e349a50e90bdca::blue::BLUE';
  readonly PUMPKIN: '0x09f1c8f05cb47bbcb61133dd2ef00583720694f41d4f8a61c94467d8f5911a14::pumpkin::PUMPKIN';
  readonly BUT: '0xbc858cb910b9914bee64fff0f9b38855355a040c49155a17b265d9086d256545::but::BUT';
  readonly DOOM: '0x11b0c9b146219f08884bebf3d8c7c8f6ad96a8d2416e3c2e1e174030c544d8a7::doom::DOOM';
  readonly SUIAI: '0x8f6808fcea9d5143e6d1577822fd49e783cb5ad2be042f4295e7fe2d5cb10b31::suiai::SUIAI';
  readonly AI: '0x089de9a53ffd1f9252cf97e32e11b9a242f813e34227362b674b963468ec6620::ai::AI';
};
export interface PoolInfo {
  id: string;
  tokens: string[];
  reserves: bigint[];
  fee: number;
  tvl: number;
  apr: number;
}
export interface TokenBalance {
  token: string;
  amount: bigint;
  symbol?: string;
  decimals?: number;
}
export interface NetworkConfig {
  fullnode: string;
  faucet?: string;
}
export interface NetworkConfigs {
  MAINNET: NetworkConfig;
  TESTNET: NetworkConfig;
}
export declare const NETWORK_CONFIG: NetworkConfigs;
