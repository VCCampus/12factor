import { NextResponse } from 'next/server';

export async function GET() {
  const config = {
    apiType: process.env.LLM_API_TYPE || 'openai',
    model: process.env.LLM_MODEL || 'gpt-3.5-turbo',
    hasApiKey: !!process.env.OPENAI_API_KEY,
    hasCustomUrl: !!process.env.LLM_API_URL,
    customUrlSet: process.env.LLM_API_URL ? true : false,
  };

  return NextResponse.json({
    status: 'ok',
    config,
    message: 'LLM API configuration status'
  });
}