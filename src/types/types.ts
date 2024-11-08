export type OpenAIModel = 'gpt-4o' | 'gpt-3.5-turbo';

export interface ChatBody {
  inputCode: string;
  model: OpenAIModel;
  apiKey?: string | undefined;
}


export interface MatcherRequest {
  query: string;
  language?: string;
  debug?: boolean;
  show_all_matches?: boolean;
}

export interface MatcherResponse {
  matches?: Array<{
    // Add specific match properties based on your gRPC response
    id?: string;
    score?: number;
    // ... other properties
  }>;
  error?: string;
}
