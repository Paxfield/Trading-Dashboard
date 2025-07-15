import { useState } from 'react'
import { TradingData } from '../TradingDashboard'
import { addTrade, Trade } from '../../lib/supabase'

interface PositionsTabProps {
  tradingData: TradingData
  updateTradingData: (data: Partial<TradingData>) => void
  loadData: () => void
}

const PositionsTab = ({ tradingData, updateTradingData, loadData }: PositionsTabProps) => {
  const [isUploading, setIsUploading] = useState(false)

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const reader = new FileReader()
    
    reader.onload = async (e) => {
      try {
        const csv = e.target?.result as string
        const trades = parseCSV(csv)
        
        // Save all trades to Supabase
        let successCount = 0
        for (const trade of trades) {
          const savedTrade = await addTrade(trade)
          if (savedTrade) successCount++
        }
        
        alert(`Successfully imported ${successCount} out of ${trades.length} trades`)
        
        // Reload data to show the new trades
        loadData()
      } catch (error) {
        alert('Error parsing CSV file: ' + (error as Error).message)
      } finally {
        setIsUploading(false)
      }
    }
    
    reader.readAsText(file)
  }

  const parseCSV = (csv: string): Omit<Trade, 'id' | 'user_id' | 'created_at' | 'updated_at'>[] => {
    const lines = csv.split('\n')
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const trades: Omit<Trade, 'id' | 'user_id' | 'created_at' | 'updated_at'>[] = []

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue

      const values = lines[i].split(',')
      const trade = {
        qty: values[0] || '',
        buy_price: parseFloat(values[1]) || 0,
        sell_price: parseFloat(values[2]) || 0,
        pnl: parseFloat(values[3]) || 0,
        bought_time: values[4] || '',
        sold_time: values[5] || '',
        duration: values[6] || '',
        bias: values[7] || '',
        commodity: values[8] || '',
        stop_price: parseFloat(values[9]) || 0,
        target_price: parseFloat(values[10]) || 0,
        entry_class: values[11] || '',
        execution_model: values[12] || '',
        variables_used: values[13] || '',

        win_loss_percent: values[14] || '',
        return_amount: parseFloat(values[15]) || 0,
        risk_amount: parseFloat(values[16]) || 0,
        risk_reward: values[17] || ''
      }
      trades.push(trade)
    }

    return trades
  }

  const clearAllTrades = () => {
    if (confirm('Are you sure you want to clear all trades? This action cannot be undone.')) {
      // TODO: Implement bulk delete functionality in Supabase
      alert('Clear all trades functionality will be implemented. For now, please delete trades individually.')
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Positions Journal</h2>
        <p className="text-gray-400">Trade Management & Analysis</p>
      </div>

      {/* File Upload Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          📁 Upload Tradovate CSV/Excel File
        </label>
        <div className="flex gap-4 items-center">
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleCSVUpload}
            disabled={isUploading}
            className="block w-full text-sm text-gray-300 
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0
                     file:text-sm file:font-medium
                     file:bg-blue-600 file:text-white
                     hover:file:bg-blue-700
                     file:cursor-pointer cursor-pointer"
          />
          <button
            onClick={clearAllTrades}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Clear All
          </button>
        </div>
        {isUploading && (
          <p className="text-blue-400 text-sm mt-2">Uploading and processing file...</p>
        )}
      </div>

      {/* Trades Summary */}
      <div className="mb-6 bg-gray-700 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-400">{tradingData.positions.length}</div>
            <div className="text-sm text-gray-400">Total Trades</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">
              {tradingData.positions.filter(t => t.pnl && t.pnl > 0).length}
            </div>
            <div className="text-sm text-gray-400">Winning Trades</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400">
              {tradingData.positions.filter(t => t.pnl && t.pnl < 0).length}
            </div>
            <div className="text-sm text-gray-400">Losing Trades</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">
              ${tradingData.positions.reduce((sum, t) => sum + (t.pnl || 0), 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-400">Total P&L</div>
          </div>
        </div>
      </div>

      {/* Trades Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-600">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Qty</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Buy Price</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Sell Price</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">PnL</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Bought Time</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Sold Time</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Duration</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Bias</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Commodity</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stop</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Target</th>

              <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Entry Class</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Execution Model</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Variables Used</th>

              <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Loss/Win %</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Return</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Risk</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Risk:Reward</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {tradingData.positions.length === 0 ? (
              <tr>
                <td colSpan={18} className="px-6 py-4 text-center text-gray-400">
                  No trades available. Upload a CSV file or capture trades from the Dashboard.
                </td>
              </tr>
            ) : (
              tradingData.positions.map((trade) => (
                <tr key={trade.id} className="hover:bg-gray-600">
                  <td className="px-3 py-2 text-sm text-white">{trade.qty || ''}</td>
                  <td className="px-3 py-2 text-sm text-white">{trade.buy_price || ''}</td>
                  <td className="px-3 py-2 text-sm text-white">{trade.sell_price || ''}</td>
                  <td className={`px-3 py-2 text-sm font-medium ${
                    trade.pnl && trade.pnl > 0 ? 'text-green-400' : trade.pnl && trade.pnl < 0 ? 'text-red-400' : 'text-white'
                  }`}>
                    {trade.pnl ? `$${trade.pnl.toFixed(2)}` : ''}
                  </td>
                  <td className="px-3 py-2 text-sm text-white">{trade.bought_time || trade.trade_timestamp || ''}</td>
                  <td className="px-3 py-2 text-sm text-white">{trade.sold_time || ''}</td>
                  <td className="px-3 py-2 text-sm text-white">{trade.duration || ''}</td>
                  <td className="px-3 py-2 text-sm text-white">{trade.bias || ''}</td>
                  <td className="px-3 py-2 text-sm text-white">{trade.commodity || trade.symbol || ''}</td>
                  <td className="px-3 py-2 text-sm text-white">{trade.stop_price || ''}</td>
                  <td className="px-3 py-2 text-sm text-white">{trade.target_price || ''}</td>

                  <td className="px-3 py-2 text-sm text-white">{trade.entry_class || ''}</td>
                  <td className="px-3 py-2 text-sm text-white">{trade.execution_model || ''}</td>
                  <td className="px-3 py-2 text-sm text-white">{trade.variables_used || ''}</td>

                  <td className="px-3 py-2 text-sm text-white">{trade.win_loss_percent || ''}</td>
                  <td className="px-3 py-2 text-sm text-white">{trade.return_amount || ''}</td>
                  <td className="px-3 py-2 text-sm text-white">{trade.risk_amount || ''}</td>
                  <td className="px-3 py-2 text-sm text-white">{trade.risk_reward || ''}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PositionsTab
