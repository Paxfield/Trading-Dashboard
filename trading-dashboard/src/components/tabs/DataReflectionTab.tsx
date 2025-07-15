import { useState, useEffect } from 'react'
import { TradingData } from '../TradingDashboard'
import { addInsight, supabase } from '../../lib/supabase'

interface DataReflectionTabProps {
  tradingData: TradingData
  updateTradingData: (data: Partial<TradingData>) => void
  loadData: () => void
}

interface ReflectionMetrics {
  daysTracked: number
  avgDailyScore: number
  consistencyScore: number
}

const DataReflectionTab = ({ tradingData, updateTradingData, loadData }: DataReflectionTabProps) => {
  const [chatInput, setChatInput] = useState('')
  const [insightsOutput, setInsightsOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [metrics, setMetrics] = useState<ReflectionMetrics>({
    daysTracked: 0,
    avgDailyScore: 0,
    consistencyScore: 0
  })
  const [chatMessages, setChatMessages] = useState<Array<{question: string, response: string, timestamp: string}>>([]);
  const [chatLoading, setChatLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    calculateReflectionMetrics()
  }, [tradingData])

  const calculateReflectionMetrics = () => {
    // Since we removed journal entries, track insights instead
    const insightEntries = (tradingData.insights || []).filter(entry => entry.insight_type !== 'journal')
    const daysTracked = insightEntries.length

    // Calculate average daily score from daily scores data
    const dailyScores = tradingData.dailyScores || []
    let totalScore = 0
    let scoreDays = 0

    dailyScores.forEach(day => {
      if (day.scores) {
        const dayChecks = Object.values(day.scores).filter(Boolean).length
        const totalChecks = Object.keys(day.scores).length
        if (totalChecks > 0) {
          totalScore += (dayChecks / totalChecks) * 100
          scoreDays++
        }
      }
    })

    const avgDailyScore = scoreDays > 0 ? totalScore / scoreDays : 0

    // Calculate consistency score based on recent daily scores
    const recentDays = 7
    const recentScores = dailyScores.filter(score => {
      const scoreDate = new Date(score.score_date)
      const cutoffDate = new Date(Date.now() - recentDays * 24 * 60 * 60 * 1000)
      return scoreDate >= cutoffDate
    }).length

    const consistencyScore = recentDays > 0 ? (recentScores / recentDays) * 100 : 0

    setMetrics({
      daysTracked,
      avgDailyScore,
      consistencyScore
    })
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles(prev => [...prev, ...files])

    // Process files and add to insights with AI analysis
    let successCount = 0
    setIsGenerating(true)
    
    for (const file of files) {
      try {
        // Get AI analysis of the image
        const aiAnalysis = await analyzeImage(file)
        
        const reader = new FileReader()
        await new Promise((resolve) => {
          reader.onload = async (e) => {
            try {
              const insight = {
                insight_type: 'upload',
                title: `AI Analysis: ${file.name}`,
                filename: file.name,
                file_type: file.type,
                file_size: file.size,
                content: aiAnalysis, // Store AI analysis as content
                data: e.target?.result,
                insight_date: new Date().toISOString().split('T')[0]
              }

              const savedInsight = await addInsight(insight)
              if (savedInsight) successCount++
            } catch (error) {
              console.error('Error saving file insight:', error)
            }
            resolve(null)
          }
          reader.readAsDataURL(file)
        })
      } catch (error) {
        console.error('Error processing file:', error)
      }
    }

    setIsGenerating(false)
    alert(`Uploaded and analyzed ${successCount} out of ${files.length} file(s)`)
    
    // Reload data to show the new insights
    loadData()
  }

  const generateInsights = async (analysisType = 'comprehensive_analysis') => {
    if (isGenerating) return

    setIsGenerating(true)
    setError('')
    
    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('data-reflection', {
        body: { 
          action: analysisType,
          tradingData: tradingData,
          metrics: metrics
        }
      })
      
      if (supabaseError) {
        throw new Error(supabaseError.message)
      }
      
      if (data.error) {
        throw new Error(data.error.message)
      }
      
      setInsightsOutput(data.data.analysis)
      
    } catch (err: any) {
      console.error('Analysis Error:', err)
      setError(err.message || 'Failed to generate analysis')
      setInsightsOutput('Error generating insights. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return
    
    const userMessage = chatInput.trim()
    setChatInput('')
    setChatLoading(true)
    
    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('data-reflection', {
        body: { 
          action: 'chat',
          message: userMessage,
          tradingData: tradingData,
          metrics: metrics
        }
      })
      
      if (supabaseError) {
        throw new Error(supabaseError.message)
      }
      
      if (data.error) {
        throw new Error(data.error.message)
      }
      
      setChatMessages(prev => [...prev, {
        question: userMessage,
        response: data.data.analysis,
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

  const analyzeImage = async (file: File) => {
    try {
      // Convert image to base64
      const base64Data = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result as string
          // Remove data:image/...;base64, prefix
          const base64 = result.split(',')[1]
          resolve(base64)
        }
        reader.readAsDataURL(file)
      })

      const { data, error: supabaseError } = await supabase.functions.invoke('data-reflection', {
        body: { 
          action: 'image_analysis',
          imageData: {
            base64Data: base64Data,
            mimeType: file.type
          }
        }
      })
      
      if (supabaseError) {
        throw new Error(supabaseError.message)
      }
      
      if (data.error) {
        throw new Error(data.error.message)
      }
      
      return data.data.analysis
      
    } catch (error) {
      console.error('Image analysis error:', error)
      return `Error analyzing image ${file.name}: ${error.message}`
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Data Reflection</h2>
        <p className="text-gray-400">AI-Powered Insights & Analysis</p>
      </div>

      {/* Reflection Metrics */}
      <div className="mb-6 bg-gray-700 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-400">{metrics.daysTracked}</div>
            <div className="text-sm text-gray-400">Days Tracked</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${
              metrics.avgDailyScore >= 70 ? 'text-green-400' : 
              metrics.avgDailyScore >= 50 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {metrics.avgDailyScore.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-400">Avg Daily Score</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${
              metrics.consistencyScore >= 70 ? 'text-green-400' : 
              metrics.consistencyScore >= 50 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {metrics.consistencyScore.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-400">Consistency Score</div>
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="mb-6 bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Upload Data for Analysis</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            📷 Upload Images/Screenshots for Insights
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-300 
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0
                     file:text-sm file:font-medium
                     file:bg-purple-600 file:text-white
                     hover:file:bg-purple-700
                     file:cursor-pointer cursor-pointer"
          />
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Uploaded Files:</h4>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-600 rounded-md p-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-300">{file.name}</span>
                    <span className="text-xs text-gray-400">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 bg-red-900/20 border border-red-500/50 rounded-md p-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* AI Chat Interface */}
      <div className="mb-6 bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">AI Chat Interface</h3>
        
        {/* Chat History */}
        {chatMessages.length > 0 && (
          <div className="mb-4 bg-gray-800 rounded-md p-3 max-h-64 overflow-y-auto">
            <div className="space-y-4">
              {chatMessages.map((msg, index) => (
                <div key={index} className="border-b border-gray-600 pb-3 last:border-b-0">
                  <div className="text-blue-300 font-medium text-sm mb-1">Q: {msg.question}</div>
                  <div className="text-gray-200 text-sm whitespace-pre-wrap">{msg.response}</div>
                  <div className="text-gray-500 text-xs mt-2">
                    {new Date(msg.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <textarea
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendChatMessage())}
            placeholder="Ask questions about your trading data, performance patterns, or request specific insights..."
            className="flex-1 bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={chatLoading}
          />
          <div className="flex flex-col gap-2">
            <button
              onClick={sendChatMessage}
              disabled={chatLoading || !chatInput.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
            >
              {chatLoading ? 'Sending...' : 'Send'}
            </button>
            <button
              onClick={() => setChatMessages([])}
              className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
            >
              Clear Chat
            </button>
          </div>
        </div>
        
        <div className="mt-3 flex gap-3 flex-wrap">
          <button
            onClick={() => generateInsights('comprehensive_analysis')}
            disabled={isGenerating}
            className={`bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              isGenerating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isGenerating ? 'Generating...' : 'Comprehensive Analysis'}
          </button>
          <button
            onClick={() => generateInsights('pattern_analysis')}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
          >
            Pattern Analysis
          </button>
          <button
            onClick={() => {
              setInsightsOutput('')
              setChatMessages([])
              setError('')
            }}
            className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Insights Output */}
      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">AI-Generated Insights & Patterns</h3>
        <textarea
          value={insightsOutput}
          readOnly
          placeholder={`AI-generated insights will appear here...

To get started:
1. Upload trading screenshots or charts for visual analysis
2. Use the chat interface to ask specific questions about your trading
3. Click "Generate Comprehensive Insights" for a full analysis

The AI will analyze your:
• Trading performance patterns
• Daily discipline scores
• Journal entries and emotional patterns
• Risk management consistency
• Uploaded images and data

Your current data: ${tradingData.positions.length} trades, ${metrics.daysTracked} journal entries`}
          className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white text-sm h-96 resize-none focus:outline-none font-mono"
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Analysis Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => {
              setChatInput('Analyze my recent trading patterns and identify areas for improvement')
              sendChatMessage()
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
          >
            Analyze Recent Patterns
          </button>
          <button
            onClick={() => {
              setChatInput('What are my strongest and weakest trading periods?')
              sendChatMessage()
            }}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
          >
            Performance Breakdown
          </button>
          <button
            onClick={() => {
              setChatInput('Provide recommendations for improving my trading consistency')
              sendChatMessage()
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
          >
            Consistency Tips
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataReflectionTab
