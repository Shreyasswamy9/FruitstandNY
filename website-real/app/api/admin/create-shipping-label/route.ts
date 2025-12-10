import { NextResponse } from 'next/server';

// This endpoint is kept to avoid breaking existing admin tooling, but the
// upstream shipping provider integration has been fully removed.
export async function POST() {
    return NextResponse.json(
        {
            error: 'Shipping label creation is currently disabled.',
        },
        { status: 410 },
    );
}
