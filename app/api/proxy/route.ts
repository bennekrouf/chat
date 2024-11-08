// app/api/proxy/route.ts

import { NextResponse } from 'next/server';

// Disable edge runtime since we need Node.js features
export const runtime = 'nodejs';

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { promisify } from 'util';

// Define proto path - adjust according to your project structure
const PROTO_PATH = process.cwd() + '/proto/matcher.proto';

// Load the protobuf
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const proto = grpc.loadPackageDefinition(packageDefinition) as any;

export async function POST(request: Request) {
  console.log("API route hit");

  return new Promise(async (resolve) => {
    try {
      const body = await request.json();
      console.log('Request body:', body);

      // Create client
      const client = new proto.matcher.Matcher(
        'chat.mayorana.ch:50030',
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

        resolve(NextResponse.json(response));
      } catch (grpcError) {
        console.error('gRPC call failed:', grpcError);
        client.close();
        resolve(NextResponse.json(
          { error: 'gRPC call failed', details: grpcError.message },
          { status: 500 }
        ));
      }
    } catch (error) {
      console.error('Request processing failed:', error);
      resolve(NextResponse.json(
        { error: 'Request processing failed', details: error.message },
        { status: 500 }
      ));
    }
  });
}
