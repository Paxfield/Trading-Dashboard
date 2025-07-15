Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'false'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { action, message } = await req.json();
    
    const GEMINI_API_KEY = Deno.env.get('GOOGLE_GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    // Enhanced Economic Calendar Data (ForexFactory/JB-News style)
    const getEconomicCalendarData = () => {
      const currentDate = new Date();
      const events = [];
      
      // Create realistic economic events for the current week
      const economicEvents = [
        {
          date: new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000),
          time: '08:30',
          currency: 'USD',
          event: 'Core Retail Sales (MoM)',
          impact: 'High',
          forecast: '0.3%',
          previous: '0.4%',
          actual: '',
          category: 'Consumer Spending',
          description: 'Measures change in the total value of sales at the retail level, excluding automobiles',
          event_id: 'USD_CORE_RETAIL_SALES_001'
        },
        {
          date: new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000),
          time: '10:00',
          currency: 'USD',
          event: 'Business Inventories (MoM)',
          impact: 'Medium',
          forecast: '0.2%',
          previous: '0.1%',
          actual: '',
          category: 'Economic Activity',
          description: 'Change in the total value of inventories held by manufacturers, wholesalers and retailers',
          event_id: 'USD_BUSINESS_INVENTORIES_001'
        },
        {
          date: new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000),
          time: '14:00',
          currency: 'USD',
          event: 'FOMC Meeting Minutes',
          impact: 'High',
          forecast: '',
          previous: '',
          actual: '',
          category: 'Central Banking',
          description: 'Detailed record of the FOMC policy-setting meeting, including vote tallies',
          event_id: 'USD_FOMC_MINUTES_001'
        },
        {
          date: new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000),
          time: '08:30',
          currency: 'USD',
          event: 'Initial Jobless Claims',
          impact: 'Medium',
          forecast: '225K',
          previous: '231K',
          actual: '',
          category: 'Employment',
          description: 'Number of individuals filing for unemployment insurance for the first time',
          event_id: 'USD_INITIAL_JOBLESS_CLAIMS_001'
        },
        {
          date: new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000),
          time: '10:00',
          currency: 'USD',
          event: 'Existing Home Sales',
          impact: 'Medium',
          forecast: '4.10M',
          previous: '4.02M',
          actual: '',
          category: 'Housing',
          description: 'Annualized number of existing residential buildings sold during the previous month',
          event_id: 'USD_EXISTING_HOME_SALES_001'
        },
        {
          date: new Date(currentDate.getTime() + 4 * 24 * 60 * 60 * 1000),
          time: '08:30',
          currency: 'USD',
          event: 'Flash Manufacturing PMI',
          impact: 'High',
          forecast: '49.2',
          previous: '48.5',
          actual: '',
          category: 'Manufacturing',
          description: 'Leading indicator of economic health - businesses react quickly to market conditions',
          event_id: 'USD_FLASH_MANUFACTURING_PMI_001'
        },
        {
          date: new Date(currentDate.getTime() + 4 * 24 * 60 * 60 * 1000),
          time: '08:30',
          currency: 'USD',
          event: 'Flash Services PMI',
          impact: 'High',
          forecast: '55.1',
          previous: '54.8',
          actual: '',
          category: 'Services',
          description: 'Leading indicator of economic health - services sector activity',
          event_id: 'USD_FLASH_SERVICES_PMI_001'
        },
        {
          date: new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000),
          time: '08:30',
          currency: 'USD',
          event: 'Durable Goods Orders (MoM)',
          impact: 'Medium',
          forecast: '1.2%',
          previous: '0.8%',
          actual: '',
          category: 'Manufacturing',
          description: 'Change in the total value of orders for manufactured durable goods',
          event_id: 'USD_DURABLE_GOODS_ORDERS_001'
        },
        {
          date: new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000),
          time: '10:00',
          currency: 'USD',
          event: 'New Home Sales',
          impact: 'Medium',
          forecast: '685K',
          previous: '662K',
          actual: '',
          category: 'Housing',
          description: 'Annualized number of new single-family homes sold during the previous month',
          event_id: 'USD_NEW_HOME_SALES_001'
        },
        // European Events
        {
          date: new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000),
          time: '09:00',
          currency: 'EUR',
          event: 'ECB President Lagarde Speaks',
          impact: 'High',
          forecast: '',
          previous: '',
          actual: '',
          category: 'Central Banking',
          description: 'ECB President speech can provide insights into future monetary policy',
          event_id: 'EUR_ECB_LAGARDE_SPEECH_001'
        },
        {
          date: new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000),
          time: '10:00',
          currency: 'EUR',
          event: 'Flash Manufacturing PMI',
          impact: 'High',
          forecast: '45.8',
          previous: '45.2',
          actual: '',
          category: 'Manufacturing',
          description: 'Leading indicator of economic health in the Eurozone manufacturing sector',
          event_id: 'EUR_FLASH_MANUFACTURING_PMI_001'
        },
        // UK Events
        {
          date: new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000),
          time: '07:00',
          currency: 'GBP',
          event: 'CPI (YoY)',
          impact: 'High',
          forecast: '2.1%',
          previous: '2.3%',
          actual: '',
          category: 'Inflation',
          description: 'Consumer Price Index measures changes in the price level of consumer goods and services',
          event_id: 'GBP_CPI_YOY_001'
        },
        {
          date: new Date(currentDate.getTime() + 4 * 24 * 60 * 60 * 1000),
          time: '09:30',
          currency: 'GBP',
          event: 'BOE Governor Bailey Speaks',
          impact: 'High',
          forecast: '',
          previous: '',
          actual: '',
          category: 'Central Banking',
          description: 'Bank of England Governor speech on monetary policy and economic outlook',
          event_id: 'GBP_BOE_BAILEY_SPEECH_001'
        }
      ];
      
      return economicEvents.map(event => ({
        ...event,
        date_formatted: event.date.toISOString().split('T')[0],
        datetime: `${event.date.toISOString().split('T')[0]} ${event.time}:00`,
        week_day: event.date.toLocaleDateString('en-US', { weekday: 'long' }),
        strength: event.impact === 'High' ? 3 : event.impact === 'Medium' ? 2 : 1,
        volatility_expected: event.impact === 'High' ? 'High' : event.impact === 'Medium' ? 'Medium' : 'Low'
      }));
    };
    
    const economicData = getEconomicCalendarData();
    
    // Calculate event statistics
    const highImpactEvents = economicData.filter(e => e.impact === 'High').length;
    const mediumImpactEvents = economicData.filter(e => e.impact === 'Medium').length;
    const lowImpactEvents = economicData.filter(e => e.impact === 'Low').length;
    
    let analysisPrompt = '';
    
    if (action === 'weekly_analysis') {
      analysisPrompt = `
You are a professional economic analyst and trading strategist. Analyze the following economic calendar data and provide comprehensive weekly positioning analysis.

Week Ahead Economic Calendar:
${JSON.stringify(economicData, null, 2)}

Event Statistics:
- High Impact Events: ${highImpactEvents}
- Medium Impact Events: ${mediumImpactEvents}
- Low Impact Events: ${lowImpactEvents}

Provide analysis in this format:

## 📊 WEEKLY ECONOMIC POSITIONING ANALYSIS

### 🔥 HIGH IMPACT WEEK OVERVIEW
Week of ${economicData[0]?.date_formatted} - ${economicData[economicData.length-1]?.date_formatted}

**Market Alert Level**: ${highImpactEvents >= 5 ? 'CRITICAL' : highImpactEvents >= 3 ? 'HIGH' : 'MODERATE'}
**Volatility Expectation**: ${highImpactEvents >= 5 ? 'EXTREME' : highImpactEvents >= 3 ? 'HIGH' : 'MODERATE'}

### 📅 KEY EVENT BREAKDOWN

#### 🚨 CRITICAL EVENTS (High Impact)
[List and analyze each high-impact event with specific trading implications]

#### ⚠️ IMPORTANT EVENTS (Medium Impact)
[Analyze medium-impact events and their potential market effects]

### 💱 CURRENCY-SPECIFIC ANALYSIS

#### USD FOCUS
[Detailed analysis of USD events and dollar strength implications]

#### EUR FOCUS  
[Analysis of Eurozone events and EUR positioning]

#### GBP FOCUS
[UK events and Sterling outlook]

### 🎯 TRADING STRATEGY RECOMMENDATIONS

#### RISK MANAGEMENT
[Specific risk management strategies for the week]

#### POSITION SIZING
[Guidance on position sizing given the event calendar]

#### TIMING CONSIDERATIONS
[Best and worst times to trade during the week]

### 📈 SECTOR & INSTRUMENT FOCUS

#### FOREX PAIRS TO WATCH
[Specific currency pairs likely to be most affected]

#### COMMODITIES IMPACT
[How economic events might affect gold, oil, etc.]

#### INDICES OUTLOOK
[Stock index implications from the economic calendar]

### ⏰ DAY-BY-DAY BREAKDOWN
[Brief analysis of each trading day's key events and timing]

### 🔮 WEEK AHEAD PREDICTIONS
[Specific predictions for market reactions and key levels to watch]

Focus on actionable trading insights, specific risk management guidance, and professional market positioning strategies.`;
      
    } else if (action === 'chat') {
      analysisPrompt = `
You are a professional economic analyst and trading strategist. A trader is asking a specific question about economic events, market positioning, or news analysis.

Current Week's Economic Calendar Context:
${JSON.stringify(economicData.slice(0, 5), null, 2)}

Week Statistics:
- High Impact Events: ${highImpactEvents}
- Medium Impact Events: ${mediumImpactEvents}  
- Low Impact Events: ${lowImpactEvents}

Trader's Question: "${message}"

Provide a comprehensive response that:
- Directly addresses their question with specific insights
- References relevant economic events from this week's calendar
- Offers actionable trading advice and risk management guidance
- Includes specific timing and positioning recommendations
- Maintains a professional, expert tone

Format your response clearly with headers and bullet points for easy reading.`;
    }

    // Call Google Gemini API
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: analysisPrompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2500,
        }
      })
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiResult = await geminiResponse.json();
    const analysis = geminiResult.candidates[0].content.parts[0].text;

    // Return the analysis with enhanced economic data
    const result = {
      success: true,
      data: {
        action: action,
        analysis: analysis,
        economic_calendar: economicData,
        statistics: {
          high_impact_events: highImpactEvents,
          medium_impact_events: mediumImpactEvents,
          low_impact_events: lowImpactEvents,
          total_events: economicData.length,
          most_volatile_day: economicData.reduce((max, event) => 
            event.impact === 'High' ? event.date_formatted : max, 'N/A'
          ),
          primary_currencies: ['USD', 'EUR', 'GBP'],
          week_risk_level: highImpactEvents >= 5 ? 'CRITICAL' : highImpactEvents >= 3 ? 'HIGH' : 'MODERATE'
        },
        metadata: {
          data_source: 'Enhanced Economic Calendar (ForexFactory/JB-News style)',
          api_ready: true,
          upgrade_available: 'Ready for JB-News or ForexFactory API integration',
          last_updated: new Date().toISOString()
        }
      }
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('News Analysis Error:', error);
    
    const errorResponse = {
      error: {
        code: 'NEWS_ANALYSIS_ERROR',
        message: error.message || 'Failed to generate news analysis'
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});