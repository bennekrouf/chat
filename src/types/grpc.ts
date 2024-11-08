// types/grpc.ts

export interface MatchRequest {
  query: string;
  language?: string;
  debug?: boolean;
  show_all_matches?: boolean;
}

export interface Match {
  text: string;
  score: number;
  // Add other fields as needed
}

export interface MatchResponse {
  matches?: Match[];
  error?: string;
}

export interface MatcherClient {
  matchQuery(request: MatchRequest): Promise<MatchResponse>;
}
