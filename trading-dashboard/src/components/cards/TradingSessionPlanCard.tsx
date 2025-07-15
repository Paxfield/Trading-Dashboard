import { useState } from 'react'

const TradingSessionPlanCard = () => {
  const [formData, setFormData] = useState({
    dailyPositioningPlan: '',
    executionMethod: '',
    analysisNotes: '',
    sessionObjective: '',
    riskManagement: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Trading Session Plan</h3>
        <p className="text-sm text-gray-400">Real-time Execution</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            What's the plan and how do I position for today?
          </label>
          <textarea
            value={formData.dailyPositioningPlan}
            onChange={(e) => handleInputChange('dailyPositioningPlan', e.target.value)}
            placeholder="Today's trading plan and positioning strategy..."
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Execute trades using: Responsive FVG or IFVG, MSST OTE, Failure close
          </label>
          <select
            value={formData.executionMethod}
            onChange={(e) => handleInputChange('executionMethod', e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select execution method...</option>
            <option value="responsive-fvg">Responsive FVG</option>
            <option value="responsive-ifvg">Responsive IFVG</option>
            <option value="msst-ote">MSST OTE</option>
            <option value="failure-close">Failure Close</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Session Objective
          </label>
          <textarea
            value={formData.sessionObjective}
            onChange={(e) => handleInputChange('sessionObjective', e.target.value)}
            placeholder="Primary objective for this trading session..."
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm h-16 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Risk Management Notes
          </label>
          <textarea
            value={formData.riskManagement}
            onChange={(e) => handleInputChange('riskManagement', e.target.value)}
            placeholder="Risk management strategy and position sizing..."
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm h-16 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Analysis Notes
          </label>
          <textarea
            value={formData.analysisNotes}
            onChange={(e) => handleInputChange('analysisNotes', e.target.value)}
            placeholder="Real-time market analysis and observations..."
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm h-16 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
}

export default TradingSessionPlanCard
