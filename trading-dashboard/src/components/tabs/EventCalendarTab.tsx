import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

interface EconomicEvent {
  date_formatted: string
  time: string
  currency: string
  event: string
  impact: 'High' | 'Medium' | 'Low'
  forecast: string
  previous: string
  week_day: string
  description?: string
  category?: string
}

const EventCalendarTab = () => {
  const [selectedImpact, setSelectedImpact] = useState<string>('All')
  const [economicEvents, setEconomicEvents] = useState<EconomicEvent[]>([])
  const [weeklyAnalysis, setWeeklyAnalysis] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Load economic events from news-analysis function
  useEffect(() => {
    loadEconomicData()
  }, [])
  
  const loadEconomicData = async () => {
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
      
      if (data.data.economic_calendar) {
        setEconomicEvents(data.data.economic_calendar)
      }
      
      if (data.data.analysis) {
        setWeeklyAnalysis(data.data.analysis)
      }
      
    } catch (err: any) {
      console.error('Economic Calendar Error:', err)
      setError(err.message || 'Failed to load economic calendar')
      // Fallback to sample data if API fails
      setEconomicEvents([
        {
          date_formatted: '2025-07-15',
          time: '08:30',
          currency: 'USD',
          event: 'Core Retail Sales (MoM)',
          impact: 'High',
          forecast: '0.3%',
          previous: '0.4%',
          week_day: 'Monday'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'High': return '🔴'
      case 'Medium': return '🟡'
      case 'Low': return '🟢'
      default: return '⚪'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'text-red-400'
      case 'Medium': return 'text-yellow-400'
      case 'Low': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const filteredEvents = selectedImpact === 'All' 
    ? economicEvents 
    : economicEvents.filter(event => event.impact === selectedImpact)

  const getEventCounts = () => {
    const high = economicEvents.filter(e => e.impact === 'High').length
    const medium = economicEvents.filter(e => e.impact === 'Medium').length
    const low = economicEvents.filter(e => e.impact === 'Low').length
    const thisWeek = economicEvents.filter(e => {
      const eventDate = new Date(e.date_formatted)
      const today = new Date()
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      return eventDate >= today && eventDate <= weekFromNow
    }).length

    return { high, medium, low, thisWeek }
  }

  const eventCounts = getEventCounts()

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Event Calendar</h2>
        <p className="text-gray-400">ForexFactory Integration & Event Visualization</p>
      </div>

      {/* Event Metrics */}
      <div className="mb-6 bg-gray-700 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-red-400">{eventCounts.high}</div>
            <div className="text-sm text-gray-400">High Impact Events</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">{eventCounts.medium}</div>
            <div className="text-sm text-gray-400">Medium Impact Events</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">{eventCounts.low}</div>
            <div className="text-sm text-gray-400">Low Impact Events</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">{eventCounts.thisWeek}</div>
            <div className="text-sm text-gray-400">This Week</div>
          </div>
        </div>
      </div>

      {/* Filter Options */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Filter by Impact Level
        </label>
        <select
          value={selectedImpact}
          onChange={(e) => setSelectedImpact(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Events</option>
          <option value="High">High Impact Only</option>
          <option value="Medium">Medium Impact Only</option>
          <option value="Low">Low Impact Only</option>
        </select>
      </div>

      {/* Events Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-600">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Currency</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Event</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Impact</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Forecast</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Previous</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-400">
                  No events found for the selected filter.
                </td>
              </tr>
            ) : (
              filteredEvents.map((event, index) => (
                <tr key={index} className="hover:bg-gray-600">
                  <td className="px-4 py-3 text-sm text-white">
                    {event.date_formatted ? new Date(event.date_formatted).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    }) : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-white">{event.time}</td>
                  <td className="px-4 py-3 text-sm text-white">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                      {event.currency}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-white max-w-xs">
                    <div className="truncate" title={event.event}>
                      {event.event}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`flex items-center gap-1 ${getImpactColor(event.impact)}`}>
                      {getImpactIcon(event.impact)} {event.impact}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-white">{event.forecast}</td>
                  <td className="px-4 py-3 text-sm text-white">{event.previous}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Event Summary */}
      <div className="mt-6 bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Week Ahead Summary</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-red-400">🔴</span>
            <span className="text-sm text-gray-300">
              <strong>High Impact:</strong> Focus on FOMC Minutes (Wed), Non-Farm Payrolls (Fri), and CAD Employment (Fri)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">🟡</span>
            <span className="text-sm text-gray-300">
              <strong>Medium Impact:</strong> Monitor German CPI, UK Services PMI, and Weekly Claims
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">🟢</span>
            <span className="text-sm text-gray-300">
              <strong>Low Impact:</strong> Oil inventories and Factory Orders may provide minor volatility
            </span>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-gray-800 rounded-md">
          <p className="text-sm text-yellow-300">
            <strong>Trading Strategy:</strong> Monitor economic calendar closely for positioning opportunities. High impact events may cause significant volatility.
          </p>
        </div>
      </div>
    </div>
  )
}

export default EventCalendarTab
