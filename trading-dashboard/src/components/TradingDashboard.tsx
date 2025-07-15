import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getTrades, getDailyScores, getInsights, getUserSettings, Trade } from '../lib/supabase'
import COTAgentCard from './cards/COTAgentCard'
import ReviewCard from './cards/ReviewCard'
import DailyScoreCard from './cards/DailyScoreCard'
import SundayReviewCard from './cards/SundayReviewCard'
import PreMarketPlanCard from './cards/PreMarketPlanCard'
import TradingSessionPlanCard from './cards/TradingSessionPlanCard'
import TradeCaptureCard from './cards/TradeCaptureCard'
import PositionsTab from './tabs/PositionsTab'
import EventCalendarTab from './tabs/EventCalendarTab'
import PerformanceTab from './tabs/PerformanceTab'
import DataReflectionTab from './tabs/DataReflectionTab'

const tabs = [
  'Dashboard',
  'Positions',
  'Event Calendar',
  'Performance',
  'Data Reflection'
]

export interface TradingData {
  positions: Trade[]
  dailyScores: any[]
  insights: any[]
  marketData: any
  settings: any
}

const TradingDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [tradingData, setTradingData] = useState<TradingData>({
    positions: [],
    dailyScores: [],
    insights: [],
    marketData: {},
    settings: {}
  })
  const [loading, setLoading] = useState(true)
  const { user, signOut } = useAuth()

  // Load data from Supabase on mount and when user changes
  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const [trades, dailyScores, insights, settings] = await Promise.all([
        getTrades(),
        getDailyScores(),
        getInsights(),
        getUserSettings()
      ])

      setTradingData({
        positions: trades,
        dailyScores: dailyScores,
        insights: insights,
        marketData: {},
        settings: settings || {}
      })
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateTradingData = (newData: Partial<TradingData>) => {
    setTradingData(prev => ({ ...prev, ...newData }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading your trading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Trading Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user?.email}</p>
        </div>
        <button
          onClick={signOut}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 rounded-lg mb-6 p-1">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'bg-gray-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Top Row */}
          <COTAgentCard />
          <ReviewCard />
          <DailyScoreCard />
          <SundayReviewCard />
          
          {/* Bottom Row */}
          <PreMarketPlanCard />
          <TradingSessionPlanCard />
          <TradeCaptureCard tradingData={tradingData} updateTradingData={updateTradingData} loadData={loadData} />
          <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <p className="text-sm">Economic Calendar</p>
              <p className="text-xs">Moved to Event Calendar Tab</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Positions' && (
        <PositionsTab tradingData={tradingData} updateTradingData={updateTradingData} loadData={loadData} />
      )}

      {activeTab === 'Event Calendar' && (
        <EventCalendarTab />
      )}

      {activeTab === 'Performance' && (
        <PerformanceTab tradingData={tradingData} />
      )}

      {activeTab === 'Data Reflection' && (
        <DataReflectionTab tradingData={tradingData} updateTradingData={updateTradingData} loadData={loadData} />
      )}
    </div>
  )
}

export default TradingDashboard
