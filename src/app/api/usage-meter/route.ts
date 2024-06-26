import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // todo

  return NextResponse.json(
    {
      message: 'Usage recorded!',
    },
    { status: 200 },
  );
}
