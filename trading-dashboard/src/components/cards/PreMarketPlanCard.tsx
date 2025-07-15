import { useState } from 'react'

const PreMarketPlanCard = () => {
  const [formData, setFormData] = useState({
    dailyCloseReview: '',
    highsLowsRespect: '',
    gapsRespect: '',
    structureSuggestions: '',
    htfLevels: '',
    dailyBias: '',
    calendarReview: '',
    intradaySetupLevels: '',
    newsPriceReaction: '',
    modelPointsBehavior: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 h-full overflow-y-auto">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Pre-Market Plan</h3>
        <p className="text-sm text-gray-400">Daily Structure & HTF Levels</p>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Review markets for Daily close
          </label>
          <textarea
            value={formData.dailyCloseReview}
            onChange={(e) => handleInputChange('dailyCloseReview', e.target.value)}
            placeholder="Analysis of daily close behavior and implications..."
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white text-xs h-12 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Are old highs/lows being respected?
          </label>
          <textarea
            value={formData.highsLowsRespect}
            onChange={(e) => handleInputChange('highsLowsRespect', e.target.value)}
            placeholder="Daily timeframe respect for previous highs and lows..."
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white text-xs h-12 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Are Gaps being respected?
          </label>
          <textarea
            value={formData.gapsRespect}
            onChange={(e) => handleInputChange('gapsRespect', e.target.value)}
            placeholder="Daily gap behavior and respect analysis..."
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white text-xs h-12 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            What are closures and structure suggesting?
          </label>
          <textarea
            value={formData.structureSuggestions}
            onChange={(e) => handleInputChange('structureSuggestions', e.target.value)}
            placeholder="Daily structure and closure implications..."
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white text-xs h-12 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Mark out HTF levels
          </label>
          <input
            type="text"
            value={formData.htfLevels}
            onChange={(e) => handleInputChange('htfLevels', e.target.value)}
            placeholder="Higher timeframe levels for today..."
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Identify Daily Bias
          </label>
          <select
            value={formData.dailyBias}
            onChange={(e) => handleInputChange('dailyBias', e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select daily bias...</option>
            <option value="bullish">Bullish</option>
            <option value="bearish">Bearish</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Review calendar for events
          </label>
          <textarea
            value={formData.calendarReview}
            onChange={(e) => handleInputChange('calendarReview', e.target.value)}
            placeholder="Today's calendar events and their potential impact..."
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white text-xs h-12 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Identify intraday levels where a setup might form
          </label>
          <input
            type="text"
            value={formData.intradaySetupLevels}
            onChange={(e) => handleInputChange('intradaySetupLevels', e.target.value)}
            placeholder="Key intraday levels for potential setups..."
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
}

export default PreMarketPlanCard
