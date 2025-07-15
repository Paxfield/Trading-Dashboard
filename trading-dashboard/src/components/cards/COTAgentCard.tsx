import { useState } from 'react'
import { supabase } from '../../lib/supabase'

interface COTData {
  commodity: string
  symbol: string
  reportDate: string
  speculative: {
    long: number
    short: number
    net: number
    changeLong: number
    changeShort: number
    netChange: number
  }
  commercial: {
    long: number
    short: number
    net: number
  }
  openInterest: number
  sentiment: string
  momentum: string
}

interface COTAnalysisResult {
  cotData: COTData
  analysis: string
  lastUpdated: string
}

const COTAgentCard = () => {
  const [selectedCommodity, setSelectedCommodity] = useState('')
  const [cotOutput, setCotOutput] = useState('')
  const [cotData, setCotData] = useState<COTData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const commodities = [
    { value: 'ES', label: 'ES - S&P 500 E-mini' },
    { value: 'NQ', label: 'NQ - NASDAQ 100 E-mini' },
    { value: 'YM', label: 'YM - Dow Jones E-mini' },
    { value: 'RTY', label: 'RTY - Russell 2000 E-mini' },
    { value: 'CL', label: 'CL - Crude Oil' },
    { value: 'GC', label: 'GC - Gold' },
    { value: 'SI', label: 'SI - Silver' },
    { value: 'ZB', label: 'ZB - Treasury Bonds' },
    { value: 'ZN', label: 'ZN - 10-Year Notes' },
    { value: '6E', label: '6E - Euro FX' },
    { value: '6J', label: '6J - Japanese Yen' },
    { value: '6B', label: '6B - British Pound' }
  ]

  const updateCOTAnalysis = async () => {
    if (!selectedCommodity) return
    
    setLoading(true)
    setError('')
    
    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('cot-analysis', {
        body: { commodity: selectedCommodity }
      })
      
      if (supabaseError) {
        throw new Error(supabaseError.message)
      }
      
      if (data.error) {
        throw new Error(data.error.message)
      }
      
      const result: COTAnalysisResult = data.data
      setCotData(result.cotData)
      setCotOutput(result.analysis)
      
    } catch (err: any) {
      console.error('COT Analysis Error:', err)
      setError(err.message || 'Failed to fetch COT analysis')
      setCotOutput('')
      setCotData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">COT Agent</h3>
        <p className="text-sm text-gray-400">Commitment of Traders Analysis</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Commodity
          </label>
          <select
            value={selectedCommodity}
            onChange={(e) => {
              setSelectedCommodity(e.target.value)
              if (e.target.value) {
                setTimeout(updateCOTAnalysis, 100)
              }
            }}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="">Select commodity...</option>
            {commodities.map((commodity) => (
              <option key={commodity.value} value={commodity.value}>
                {commodity.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-gray-700 rounded-md p-2">
            <div className={`text-sm font-semibold ${
              cotData?.speculative.netChange > 0 ? 'text-green-400' : 
              cotData?.speculative.netChange < 0 ? 'text-red-400' : 'text-gray-400'
            }`}>
              {cotData ? (cotData.speculative.netChange > 0 ? '+' : '') + cotData.speculative.netChange.toLocaleString() : '--'}
            </div>
            <div className="text-xs text-gray-400">Net Change</div>
          </div>
          <div className="bg-gray-700 rounded-md p-2">
            <div className={`text-sm font-semibold ${
              cotData?.sentiment === 'Bullish' ? 'text-green-400' : 
              cotData?.sentiment === 'Bearish' ? 'text-red-400' : 'text-gray-400'
            }`}>
              {cotData?.sentiment || 'N/A'}
            </div>
            <div className="text-xs text-gray-400">Sentiment</div>
          </div>
          <div className="bg-gray-700 rounded-md p-2">
            <div className={`text-sm font-semibold ${
              cotData?.momentum === 'Improving' ? 'text-green-400' : 
              cotData?.momentum === 'Deteriorating' ? 'text-red-400' : 'text-yellow-400'
            }`}>
              {cotData?.momentum || 'N/A'}
            </div>
            <div className="text-xs text-gray-400">Momentum</div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
            <span className="ml-2 text-sm text-gray-400">Analyzing COT data...</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-md p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        {cotData && (
          <div className="bg-gray-700/50 rounded-md p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-300">Report Date:</span>
              <span className="text-sm text-white">{new Date(cotData.reportDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-300">Net Position:</span>
              <span className={`text-sm font-semibold ${
                cotData.speculative.net > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {cotData.speculative.net.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-300">Open Interest:</span>
              <span className="text-sm text-white">{cotData.openInterest.toLocaleString()}</span>
            </div>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            AI Analysis & Market Implications
          </label>
          <div 
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm h-40 overflow-y-auto whitespace-pre-wrap"
          >
            {cotOutput || (selectedCommodity ? 'Select a commodity to view AI-powered COT analysis...' : 'Select a commodity to begin analysis...')}
          </div>
        </div>
        
        {cotOutput && (
          <button
            onClick={updateCOTAnalysis}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
          >
            {loading ? 'Updating...' : 'Refresh Analysis'}
          </button>
        )}
      </div>
    </div>
  )
}

export default COTAgentCard
