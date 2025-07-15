import { useState, useEffect } from 'react'
import { TradingData } from '../TradingDashboard'

interface PerformanceTabProps {
  tradingData: TradingData
}

interface PerformanceMetrics {
  totalPnL: number
  winRate: number
  avgWin: number
  avgLoss: number
  profitFactor: number
  totalTrades: number
  winningTrades: number
  losingTrades: number
  grossProfit: number
  grossLoss: number
  maxDrawdown: number
  sharpeRatio: number
  expectancy: number
}

const PerformanceTab = ({ tradingData }: PerformanceTabProps) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    totalPnL: 0,
    winRate: 0,
    avgWin: 0,
    avgLoss: 0,
    profitFactor: 0,
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    grossProfit: 0,
    grossLoss: 0,
    maxDrawdown: 0,
    sharpeRatio: 0,
    expectancy: 0
  })

  const [performanceSummary, setPerformanceSummary] = useState('')

  useEffect(() => {
    updatePerformanceMetrics()
  }, [tradingData.positions])

  const updatePerformanceMetrics = () => {
    if (!tradingData.positions || tradingData.positions.length === 0) {
      setMetrics({
        totalPnL: 0,
        winRate: 0,
        avgWin: 0,
        avgLoss: 0,
        profitFactor: 0,
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        grossProfit: 0,
        grossLoss: 0,
        maxDrawdown: 0,
        sharpeRatio: 0,
        expectancy: 0
      })
      setPerformanceSummary('')
      return
    }

    const trades = tradingData.positions.filter(t => t.pnl !== undefined && t.pnl !== null && !isNaN(t.pnl))
    
    if (trades.length === 0) {
      setMetrics({
        totalPnL: 0,
        winRate: 0,
        avgWin: 0,
        avgLoss: 0,
        profitFactor: 0,
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        grossProfit: 0,
        grossLoss: 0,
        maxDrawdown: 0,
        sharpeRatio: 0,
        expectancy: 0
      })
      setPerformanceSummary('')
      return
    }

    const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0)
    const winningTrades = trades.filter(t => (t.pnl || 0) > 0)
    const losingTrades = trades.filter(t => (t.pnl || 0) < 0)
    
    const winRate = trades.length > 0 ? (winningTrades.length / trades.length * 100) : 0
    const avgWin = winningTrades.length > 0 ? 
      winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / winningTrades.length : 0
    const avgLoss = losingTrades.length > 0 ? 
      Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / losingTrades.length) : 0
    
    const grossProfit = winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0)
    const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0))
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0
    
    // Calculate max drawdown
    let maxDrawdown = 0
    let peak = 0
    let runningPnL = 0
    
    trades.forEach(trade => {
      runningPnL += trade.pnl || 0
      if (runningPnL > peak) {
        peak = runningPnL
      }
      const drawdown = peak - runningPnL
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown
      }
    })

    // Calculate expectancy
    const expectancy = trades.length > 0 ? totalPnL / trades.length : 0

    // Simple Sharpe ratio approximation (assuming risk-free rate of 2%)
    const returns = trades.map(t => t.pnl || 0)
    const avgReturn = returns.length > 0 ? returns.reduce((sum, r) => sum + r, 0) / returns.length : 0
    const variance = returns.length > 1 ? 
      returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / (returns.length - 1) : 0
    const stdDev = Math.sqrt(variance)
    const sharpeRatio = stdDev > 0 ? (avgReturn - 0.02) / stdDev : 0

    const newMetrics = {
      totalPnL,
      winRate,
      avgWin,
      avgLoss,
      profitFactor,
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      grossProfit,
      grossLoss,
      maxDrawdown,
      sharpeRatio,
      expectancy
    }

    setMetrics(newMetrics)
    generatePerformanceSummary(newMetrics)
  }

  const generatePerformanceSummary = (metrics: PerformanceMetrics) => {
    const summary = `
PERFORMANCE ANALYSIS SUMMARY:

📊 OVERALL PERFORMANCE:
• Total P&L: $${metrics.totalPnL.toFixed(2)}
• Win Rate: ${metrics.winRate.toFixed(1)}%
• Total Trades: ${metrics.totalTrades}
• Profit Factor: ${metrics.profitFactor.toFixed(2)}

📈 TRADE ANALYSIS:
• Winning Trades: ${metrics.winningTrades} (${((metrics.winningTrades / metrics.totalTrades) * 100).toFixed(1)}%)
• Losing Trades: ${metrics.losingTrades} (${((metrics.losingTrades / metrics.totalTrades) * 100).toFixed(1)}%)
• Average Win: $${metrics.avgWin.toFixed(2)}
• Average Loss: $${metrics.avgLoss.toFixed(2)}

💰 RISK METRICS:
• Gross Profit: $${metrics.grossProfit.toFixed(2)}
• Gross Loss: $${metrics.grossLoss.toFixed(2)}
• Maximum Drawdown: $${metrics.maxDrawdown.toFixed(2)}
• Expectancy per Trade: $${metrics.expectancy.toFixed(2)}

🎯 PERFORMANCE RATING:
${metrics.winRate >= 60 ? '✅ Excellent win rate (>60%)' : metrics.winRate >= 50 ? '✅ Good win rate (50-60%)' : '⚠️ Win rate needs improvement (<50%)'}
${metrics.profitFactor >= 2.0 ? '✅ Excellent profit factor (>2.0)' : metrics.profitFactor >= 1.5 ? '✅ Good profit factor (1.5-2.0)' : metrics.profitFactor >= 1.0 ? '⚠️ Marginal profit factor (1.0-1.5)' : '❌ Poor profit factor (<1.0)'}
${metrics.expectancy > 0 ? '✅ Positive expectancy' : '❌ Negative expectancy'}

💡 RECOMMENDATIONS:
${metrics.winRate < 50 ? '• Focus on improving entry criteria and setup quality\n' : ''}${metrics.profitFactor < 1.5 ? '• Work on letting winners run and cutting losses quickly\n' : ''}${metrics.avgLoss > metrics.avgWin ? '• Improve risk:reward ratio by targeting larger wins\n' : ''}${metrics.maxDrawdown > Math.abs(metrics.totalPnL) * 0.3 ? '• Implement better risk management to reduce drawdowns\n' : ''}${metrics.totalTrades < 20 ? '• Increase sample size for more reliable statistics\n' : ''}
    `
    setPerformanceSummary(summary)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value)
  }

  const getMetricColor = (value: number, thresholds: { good: number, fair: number }) => {
    if (value >= thresholds.good) return 'text-green-400'
    if (value >= thresholds.fair) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Performance Analytics</h2>
        <p className="text-gray-400">Tradovate-style Performance Metrics</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="mb-6 bg-gray-700 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          <div>
            <div className={`text-2xl font-bold ${metrics.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(metrics.totalPnL)}
            </div>
            <div className="text-sm text-gray-400">Total P&L</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${getMetricColor(metrics.winRate, { good: 60, fair: 50 })}`}>
              {metrics.winRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-400">Win Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">
              {formatCurrency(metrics.avgWin)}
            </div>
            <div className="text-sm text-gray-400">Avg Win</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400">
              {formatCurrency(metrics.avgLoss)}
            </div>
            <div className="text-sm text-gray-400">Avg Loss</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${getMetricColor(metrics.profitFactor, { good: 2.0, fair: 1.5 })}`}>
              {metrics.profitFactor.toFixed(2)}
            </div>
            <div className="text-sm text-gray-400">Profit Factor</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">
              {metrics.totalTrades}
            </div>
            <div className="text-sm text-gray-400">Total Trades</div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="mb-6 bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Advanced Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-green-400">
              {formatCurrency(metrics.grossProfit)}
            </div>
            <div className="text-sm text-gray-400">Gross Profit</div>
          </div>
          <div>
            <div className="text-xl font-bold text-red-400">
              {formatCurrency(metrics.grossLoss)}
            </div>
            <div className="text-sm text-gray-400">Gross Loss</div>
          </div>
          <div>
            <div className="text-xl font-bold text-orange-400">
              {formatCurrency(metrics.maxDrawdown)}
            </div>
            <div className="text-sm text-gray-400">Max Drawdown</div>
          </div>
          <div>
            <div className={`text-xl font-bold ${metrics.expectancy >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(metrics.expectancy)}
            </div>
            <div className="text-sm text-gray-400">Expectancy</div>
          </div>
        </div>
      </div>

      {/* Trade Breakdown */}
      <div className="mb-6 bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Trade Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Winning Trades</span>
              <span className="text-green-400 font-semibold">{metrics.winningTrades}</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-3">
              <div 
                className="bg-green-400 h-3 rounded-full transition-all duration-300"
                style={{ width: `${metrics.totalTrades > 0 ? (metrics.winningTrades / metrics.totalTrades) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Losing Trades</span>
              <span className="text-red-400 font-semibold">{metrics.losingTrades}</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-3">
              <div 
                className="bg-red-400 h-3 rounded-full transition-all duration-300"
                style={{ width: `${metrics.totalTrades > 0 ? (metrics.losingTrades / metrics.totalTrades) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Performance Summary</h3>
        <textarea
          value={performanceSummary}
          readOnly
          placeholder={tradingData.positions.length === 0 ? "No trades available for performance analysis. Start trading and capture trades to see your performance metrics here." : "Performance analysis will appear here..."}
          className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white text-sm h-96 resize-none focus:outline-none font-mono"
        />
      </div>
    </div>
  )
}

export default PerformanceTab
