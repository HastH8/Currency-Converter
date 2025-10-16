import { NextRequest, NextResponse } from 'next/server';

const EXCHANGE_RATE_API = 'https://api.frankfurter.app';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const amount = searchParams.get('amount');
  const historical = searchParams.get('historical');

  try {
    if (historical === 'true' && from && to) {
      // Get historical rates for the past 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      const response = await fetch(
        `${EXCHANGE_RATE_API}/${startDateStr}..${endDateStr}?from=${from}&to=${to}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch historical rates');
      }
      
      const data = await response.json();
      return NextResponse.json(data);
    } else if (from && to && amount) {
      // Convert specific amount
      const response = await fetch(
        `${EXCHANGE_RATE_API}/latest?amount=${amount}&from=${from}&to=${to}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversion rate');
      }
      
      const data = await response.json();
      return NextResponse.json(data);
    } else if (from && to) {
      // Get latest rate
      const response = await fetch(
        `${EXCHANGE_RATE_API}/latest?from=${from}&to=${to}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rate');
      }
      
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      // Get all available currencies
      const response = await fetch(`${EXCHANGE_RATE_API}/currencies`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch currencies');
      }
      
      const data = await response.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Exchange rate API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exchange rates' },
      { status: 500 }
    );
  }
}