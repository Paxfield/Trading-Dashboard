import { useState } from 'react'

const SundayReviewCard = () => {
  const [formData, setFormData] = useState({
    macroCloseReview: '',
    highsLowsRespect: '',
    gapsRespect: '',
    structureSuggestions: '',
    macroLevels: '',
    macroBiasPositioning: '',
    calendarMacroAlignment: '',
    economicNarratives: '',
    participantFlow: '',
    cotSuggestions: '',
    internalsSuggestions: ''
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
        <h3 className="text-lg font-semibold text-white">Sunday Review</h3>
        <p className="text-sm text-gray-400">Macro Analysis & Structure</p>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Review markets for MACRO (Quarterly, Monthly, Weekly) close
          </label>
          <textarea
            value={formData.macroCloseReview}
            onChange={(e) => handleInputChange('macroCloseReview', e.target.value)}
            placeholder="Analyze quarterly, monthly, and weekly closes..."
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
            placeholder="Analysis of respect for previous highs and lows..."
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
            placeholder="Analysis of gap respect and behavior..."
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
            placeholder="Analysis of what market structure is suggesting..."
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white text-xs h-12 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Mark out MACRO levels
          </label>
          <input
            type="text"
            value={formData.macroLevels}
            onChange={(e) => handleInputChange('macroLevels', e.target.value)}
            placeholder="Key macro levels identified..."
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Identify MACRO bias and positioning for the week
          </label>
          <textarea
            value={formData.macroBiasPositioning}
            onChange={(e) => handleInputChange('macroBiasPositioning', e.target.value)}
            placeholder="Weekly macro bias and positioning strategy..."
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white text-xs h-12 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            What is COT suggesting?
          </label>
          <input
            type="text"
            value={formData.cotSuggestions}
            onChange={(e) => handleInputChange('cotSuggestions', e.target.value)}
            placeholder="COT data insights and implications..."
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            What are internals suggesting?
          </label>
          <input
            type="text"
            value={formData.internalsSuggestions}
            onChange={(e) => handleInputChange('internalsSuggestions', e.target.value)}
            placeholder="Market internals analysis and implications..."
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
}

export default SundayReviewCard
