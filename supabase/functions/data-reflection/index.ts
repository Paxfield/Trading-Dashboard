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
    const { action, tradingData, message, imageData, metrics } = await req.json();
    
    const GEMINI_API_KEY = Deno.env.get('GOOGLE_GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    let analysisPrompt = '';
    let model = 'gemini-1.5-flash-latest';
    let requestBody: any = {
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2000,
      }
    };
    
    if (action === 'comprehensive_analysis') {
      // Generate comprehensive trading insights
      analysisPrompt = `
You are a professional trading psychologist and performance analyst. Analyze the following trading data and provide comprehensive insights.

Trading Performance Data:
${JSON.stringify({
  totalTrades: tradingData?.positions?.length || 0,
  winRate: tradingData?.positions ? (tradingData.positions.filter(t => (t.pnl || 0) > 0).length / Math.max(tradingData.positions.length, 1) * 100).toFixed(1) : 0,
  avgDailyScore: metrics?.avgDailyScore || 0,
  consistencyScore: metrics?.consistencyScore || 0,
  daysTracked: metrics?.daysTracked || 0,
  dailyScores: tradingData?.dailyScores?.length || 0,
  insights: tradingData?.insights?.length || 0
}, null, 2)}

Provide analysis in this format:

## 🔍 COMPREHENSIVE TRADING INSIGHTS ANALYSIS

### 📊 PERFORMANCE OVERVIEW
[Statistical analysis of trading performance with specific metrics]

### 🧠 BEHAVIORAL PATTERNS IDENTIFIED
[Analysis of consistency, discipline, and behavioral trends]

### 🎯 KEY OBSERVATIONS
[Important patterns and correlations in the data]

### 📈 STRENGTH AREAS
[Specific strengths based on the data]

### ⚠️ IMPROVEMENT OPPORTUNITIES
[Specific areas needing attention with actionable focus]

### 💡 PERSONALIZED RECOMMENDATIONS

#### IMMEDIATE ACTIONS (Next 7 days):
[Specific, actionable steps]

#### SHORT-TERM GOALS (Next 30 days):
[Measurable objectives]

#### LONG-TERM DEVELOPMENT (Next 90 days):
[Strategic development goals]

### 🔬 DATA QUALITY ASSESSMENT
[Assessment of data reliability and suggestions for improvement]

### 📅 NEXT REVIEW MILESTONE
[When to reassess progress]

Focus on actionable insights, specific recommendations, and professional trading psychology principles.`;
      
    } else if (action === 'image_analysis') {
      // Analyze uploaded trading screenshots/charts
      model = 'gemini-1.5-flash-latest';
      
      analysisPrompt = `
You are a professional trading analyst specializing in chart analysis and trading screenshot interpretation. Analyze the uploaded image and provide detailed insights.

Provide analysis in this format:

## 📈 TRADING IMAGE ANALYSIS

### 🔍 VISUAL ELEMENTS IDENTIFIED
[What you can see in the image - charts, indicators, timeframes, etc.]

### 📊 TECHNICAL ANALYSIS
[Analysis of any technical patterns, support/resistance, indicators]

### 🎯 TRADING SETUP ASSESSMENT
[Evaluation of the trading setup or position if visible]

### 💡 INSIGHTS & OBSERVATIONS
[Key insights about the trading approach shown]

### ⚠️ AREAS FOR IMPROVEMENT
[Suggestions for better chart setup, risk management, etc.]

### 📚 EDUCATIONAL NOTES
[Learning points and technical concepts]

Focus on practical trading insights and educational value.`;
      
      requestBody.contents = [{
        parts: [
          { text: analysisPrompt },
          {
            inline_data: {
              mime_type: imageData.mimeType,
              data: imageData.base64Data
            }
          }
        ]
      }];
      
    } else if (action === 'chat') {
      // Handle specific questions about trading data
      analysisPrompt = `
You are a professional trading coach and analyst. A trader is asking a specific question about their trading performance and data. Provide a helpful, detailed response.

Trader's Trading Context:
- Total Trades: ${tradingData?.positions?.length || 0}
- Win Rate: ${tradingData?.positions ? (tradingData.positions.filter(t => (t.pnl || 0) > 0).length / Math.max(tradingData.positions.length, 1) * 100).toFixed(1) : 0}%
- Average Daily Score: ${metrics?.avgDailyScore || 0}%
- Consistency Score: ${metrics?.consistencyScore || 0}%
- Days Tracked: ${metrics?.daysTracked || 0}

Trader's Question: "${message}"

Provide a comprehensive response that:
- Directly addresses their question
- References their specific data when relevant
- Offers actionable advice
- Includes specific next steps
- Maintains a professional, supportive tone

Format your response clearly with headers and bullet points for easy reading.`;
      
    } else if (action === 'pattern_analysis') {
      // Analyze specific trading patterns
      analysisPrompt = `
You are a quantitative trading analyst specializing in pattern recognition. Analyze the trader's performance data and identify key patterns.

Detailed Trading Data:
${JSON.stringify({
  trades: tradingData?.positions?.map(trade => ({
    pnl: trade.pnl,
    symbol: trade.symbol,
    duration: trade.duration,
    bias: trade.bias,
    timestamp: trade.trade_timestamp,
    status: trade.status
  })) || [],
  dailyPerformance: tradingData?.dailyScores || [],
  metrics: metrics
}, null, 2)}

Provide analysis in this format:

## 🔄 TRADING PATTERN ANALYSIS

### 📈 PERFORMANCE PATTERNS
[Analysis of winning vs losing streaks, timing patterns]

### 🕒 TEMPORAL ANALYSIS
[Best/worst trading times, days of week patterns]

### 💰 RISK/REWARD PATTERNS
[Analysis of risk management consistency]

### 🎯 PSYCHOLOGICAL PATTERNS
[Behavioral patterns affecting performance]

### 📊 STATISTICAL INSIGHTS
[Key statistical observations and correlations]

### 🔮 PREDICTIVE INDICATORS
[Patterns that might predict future performance]

### 💡 ACTIONABLE RECOMMENDATIONS
[Specific steps to leverage positive patterns and address negative ones]

Focus on identifying exploitable patterns and providing data-driven recommendations.`;
    }

    // Set up request body for text-only analysis
    if (action !== 'image_analysis') {
      requestBody.contents = [{
        parts: [{ text: analysisPrompt }]
      }];
    }

    // Call Google Gemini API
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiResult = await geminiResponse.json();
    const analysis = geminiResult.candidates[0].content.parts[0].text;

    // Return the analysis
    const result = {
      success: true,
      data: {
        action: action,
        analysis: analysis,
        metadata: {
          tradesAnalyzed: tradingData?.positions?.length || 0,
          metricsIncluded: metrics ? Object.keys(metrics).length : 0,
          hasImageData: !!imageData
        },
        lastUpdated: new Date().toISOString()
      }
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Data Reflection Error:', error);
    
    const errorResponse = {
      error: {
        code: 'DATA_REFLECTION_ERROR',
        message: error.message || 'Failed to generate trading analysis'
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});