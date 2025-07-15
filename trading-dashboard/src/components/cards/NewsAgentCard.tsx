import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

interface WeeklyAnalysisResult {
  action: string
  analysis: string
  economic_calendar?: any[]
  statistics?: {
    high_impact_events: number
    medium_impact_events: number
    low_impact_events: number
    total_events: number
    week_risk_level: string
  }
  metadata?: {
    data_source: string
    last_updated: string
  }
}

const NewsAgentCard = () => {
  const [weeklyAnalysis, setWeeklyAnalysis] = useState('')
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<Array<{question: string, response: string, timestamp: string}>>([])
  const [loading, setLoading] = useState(false)
  const [chatLoading, setChatLoading] = useState(false)
  const [error, setError] = useState('')
  const [economicCalendar, setEconomicCalendar] = useState<any[]>([])
  const [weeklyStats, setWeeklyStats] = useState({
    highImpactEvents: 0,
    mediumImpactEvents: 0,
    lowImpactEvents: 0,
    totalEvents: 0,
    riskLevel: 'MODERATE'
  })

  // Load weekly analysis on component mount
  useEffect(() => {
    loadWeeklyAnalysis()
  }, [])

  const loadWeeklyAnalysis = async () => {
    setLoading(true)
    setError('')
    
    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('news-analysis', {
        body: { action: 'weekly_analysis' }
      })
      
      if (supabaseError) {
        throw new Error(supabaseError.message)
      }
      
      if (data.error) {
        throw new Error(data.error.message)
      }
      
      const result: WeeklyAnalysisResult = data.data
      setWeeklyAnalysis(result.analysis)
      
      if (result.economic_calendar) {
        setEconomicCalendar(result.economic_calendar)
      }
      
      if (result.statistics) {
        setWeeklyStats({
          highImpactEvents: result.statistics.high_impact_events,
          mediumImpactEvents: result.statistics.medium_impact_events,
          lowImpactEvents: result.statistics.low_impact_events,
          totalEvents: result.statistics.total_events,
          riskLevel: result.statistics.week_risk_level
        })
      }
      
    } catch (err: any) {
      console.error('Weekly Analysis Error:', err)
      setError(err.message || 'Failed to load weekly analysis')
    } finally {
      setLoading(false)
    }
  }

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return
    
    const userMessage = chatInput.trim()
    setChatInput('')
    setChatLoading(true)
    
    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('news-analysis', {
        body: { 
          action: 'chat', 
          message: userMessage
        }
      })
      
      if (supabaseError) {
        throw new Error(supabaseError.message)
      }
      
      if (data.error) {
        throw new Error(data.error.message)
      }
      
      const result: WeeklyAnalysisResult = data.data
      setChatMessages(prev => [...prev, {
        question: userMessage,
        response: result.analysis,
        timestamp: new Date().toISOString()
      }])
      
    } catch (err: any) {
      console.error('Chat Error:', err)
      setChatMessages(prev => [...prev, {
        question: userMessage,
        response: `Error: ${err.message || 'Failed to get response'}`,
        timestamp: new Date().toISOString()
      }])
    } finally {
      setChatLoading(false)
    }
  }

  const getQuietDays = () => {
    return Math.max(0, 7 - weeklyStats.highImpactEvents - weeklyStats.mediumImpactEvents)
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">News Agent</h3>
        <p className="text-sm text-gray-400">Positioning Analysis & Event Planning</p>
      </div>
      
      <div className="space-y-4">
        {/* Enhanced Weekly Summary Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <div className="bg-gray-700 rounded-md p-3 text-center">
            <div className="text-red-400 text-lg font-semibold">{weeklyStats.highImpactEvents}</div>
            <div className="text-xs text-gray-400">High Impact</div>
          </div>
          <div className="bg-gray-700 rounded-md p-3 text-center">
            <div className="text-orange-400 text-lg font-semibold">{weeklyStats.mediumImpactEvents}</div>
            <div className="text-xs text-gray-400">Medium Impact</div>
          </div>
          <div className="bg-gray-700 rounded-md p-3 text-center">
            <div className="text-green-400 text-lg font-semibold">{getQuietDays()}</div>
            <div className="text-xs text-gray-400">Quiet Days</div>
          </div>
          <div className="bg-gray-700 rounded-md p-3 text-center">
            <div className={`text-sm font-semibold ${
              weeklyStats.riskLevel === 'CRITICAL' ? 'text-red-400' : 
              weeklyStats.riskLevel === 'HIGH' ? 'text-orange-400' : 
              'text-yellow-400'
            }`}>{weeklyStats.riskLevel}</div>
            <div className="text-xs text-gray-400">Risk Level</div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
            <span className="ml-2 text-sm text-gray-400">Loading weekly analysis...</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-md p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Economic Events Preview */}
        {economicCalendar.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Key Events This Week
            </label>
            <div className="bg-gray-700 border border-gray-600 rounded-md p-3 max-h-24 overflow-y-auto">
              <div className="space-y-1">
                {economicCalendar
                  .filter(event => event.impact === 'High')
                  .slice(0, 3)
                  .map((event, index) => (
                    <div key={index} className="flex justify-between items-center text-xs">
                      <div className="text-white">
                        <span className="font-medium">{event.currency}</span> {event.event}
                      </div>
                      <div className="text-gray-400">{event.week_day} {event.time}</div>
                    </div>
                  ))
                }
                {economicCalendar.filter(event => event.impact === 'High').length > 3 && (
                  <div className="text-xs text-gray-400 text-center pt-1">
                    +{economicCalendar.filter(event => event.impact === 'High').length - 3} more high impact events
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-300">
              AI Weekly Positioning Analysis
            </label>
            <button
              onClick={loadWeeklyAnalysis}
              disabled={loading}
              className="text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-2 py-1 rounded transition-colors"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          <div className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm h-32 overflow-y-auto whitespace-pre-wrap">
            {weeklyAnalysis || 'Loading AI analysis of this week\'s economic events and positioning opportunities...'}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Chat with News Agent
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !chatLoading && sendChatMessage()}
              placeholder="Ask about positioning, event timing, or risk management..."
              className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={chatLoading}
            />
            <button
              onClick={sendChatMessage}
              disabled={chatLoading || !chatInput.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {chatLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
          
          {/* Chat History */}
          <div className="bg-gray-700 border border-gray-600 rounded-md p-3 h-24 overflow-y-auto">
            {chatMessages.length === 0 ? (
              <p className="text-gray-400 text-sm">Ask about specific events, positioning strategies, or timing questions...</p>
            ) : (
              <div className="space-y-3">
                {chatMessages.map((msg, index) => (
                  <div key={index} className="text-sm">
                    <div className="text-blue-300 font-medium">Q: {msg.question}</div>
                    <div className="text-gray-200 mt-1 whitespace-pre-wrap">{msg.response}</div>
                    <div className="text-gray-500 text-xs mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {chatLoading && (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-400"></div>
                <span>AI is thinking...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsAgentCard
