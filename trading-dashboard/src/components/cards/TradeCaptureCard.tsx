import { useState } from 'react'
import { TradingData } from '../TradingDashboard'
import { addTrade } from '../../lib/supabase'

interface TradeData {
  symbol: string
  stop: string
  target: string
  entryClass: string
  variables: string
}

interface TradeCaptureCardProps {
  tradingData: TradingData
  updateTradingData: (data: Partial<TradingData>) => void
  loadData: () => void
}

const TradeCaptureCard = ({ tradingData, updateTradingData, loadData }: TradeCaptureCardProps) => {
  const [saving, setSaving] = useState(false)
  const [tradeData, setTradeData] = useState<TradeData>({
    symbol: '',
    stop: '',
    target: '',
    entryClass: '',
    variables: ''
  })

  const handleTradeDataChange = (field: keyof TradeData, value: string) => {
    setTradeData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const captureTrade = async () => {
    if (tradeData.symbol && tradeData.stop && tradeData.target) {
      setSaving(true)
      try {
        const trade = {
          symbol: tradeData.symbol,
          stop_price: parseFloat(tradeData.stop),
          target_price: parseFloat(tradeData.target),
          entry_class: tradeData.entryClass,
          variables_used: tradeData.variables,
          trade_timestamp: new Date().toISOString(),
          status: 'open'
        }
        
        const savedTrade = await addTrade(trade)
        
        if (savedTrade) {
          alert('Trade captured successfully!')
          
          // Reset form
          setTradeData({
            symbol: '',
            stop: '',
            target: '',
            entryClass: '',
            variables: ''
          })

          
          // Reload data to reflect the new trade
          loadData()
        } else {
          alert('Failed to capture trade. Please try again.')
        }
      } catch (error) {
        console.error('Error capturing trade:', error)
        alert('Error capturing trade. Please try again.')
      } finally {
        setSaving(false)
      }
    } else {
      alert('Please fill in Symbol, Stop, and Target fields')
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Trade Capture</h3>
        <p className="text-sm text-gray-400">Capture and track your real-time trade executions</p>
      </div>
      
      <div className="space-y-4">


        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Real-time Trade Capture
          </label>
          
          {/* First row: Symbol, Stop, Target, Entry Class */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <input
              type="text"
              value={tradeData.symbol}
              onChange={(e) => handleTradeDataChange('symbol', e.target.value)}
              placeholder="Symbol"
              className="bg-gray-700 border border-gray-600 rounded-md px-2 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={tradeData.stop}
              onChange={(e) => handleTradeDataChange('stop', e.target.value)}
              placeholder="Stop"
              step="0.01"
              className="bg-gray-700 border border-gray-600 rounded-md px-2 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={tradeData.target}
              onChange={(e) => handleTradeDataChange('target', e.target.value)}
              placeholder="Target"
              step="0.01"
              className="bg-gray-700 border border-gray-600 rounded-md px-2 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={tradeData.entryClass}
              onChange={(e) => handleTradeDataChange('entryClass', e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-md px-2 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Entry Class</option>
              <option value="attacked">Attacked</option>
              <option value="pocket">Pocket</option>
              <option value="missed">Missed</option>
              <option value="behind">Behind</option>
            </select>
          </div>

          {/* Variables */}
          <div className="mb-3">
            <input
              type="text"
              value={tradeData.variables}
              onChange={(e) => handleTradeDataChange('variables', e.target.value)}
              placeholder="Variables in setup"
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-2 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>



          {/* Capture Button */}
          <button
            onClick={captureTrade}
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {saving ? 'Capturing...' : 'Capture Trade'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TradeCaptureCard
