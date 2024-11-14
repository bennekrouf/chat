import { NextResponse } from 'next/server';

// Disable edge runtime since we need Node.js features
export const runtime = 'nodejs';

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { promisify } from 'util';

const PROTO_PATH = process.cwd() + '/proto/matcher.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const proto = grpc.loadPackageDefinition(packageDefinition) as any;

export async function POST(request: Request): Promise<Response> {
  console.log("API route hit");

  try {
    const body = await request.json();
    console.log('Request body:', body);

    // Create client
    const client = new proto.matcher.Matcher(
      // 'matcher.mayorana.ch',
      'localhost:50030',
      grpc.credentials.createInsecure()
    );

    // Create promisified version of the matchQuery
    const matchQuery = promisify(client.matchQuery).bind(client);

    try {
      const response = await matchQuery({
        query: body.query,
        language: body.language || "fr",
        debug: body.debug || true,
        show_all_matches: body.show_all_matches || true
      });

      // Close the client
      client.close();

      return NextResponse.json(response);
    } catch (grpcError: any) {
      console.error('gRPC call failed:', grpcError);
      client.close();
      return NextResponse.json(
        { error: 'gRPC call failed', details: grpcError.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Request processing failed:', error);
    return NextResponse.json(
      { error: 'Request processing failed', details: error.message },
      { status: 500 }
    );
  }
}
