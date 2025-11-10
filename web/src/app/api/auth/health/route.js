    // app/api/healthz/route.js
    import { NextResponse } from 'next/server';

    export async function GET() {
      return NextResponse.json({ status: 'OK' }, { status: 200 });
    }