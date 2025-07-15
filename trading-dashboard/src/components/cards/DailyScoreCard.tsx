import { useState, useEffect } from 'react'

const DailyScoreCard = () => {
  const [checkedItems, setCheckedItems] = useState({
    meditation: false,
    planExecution: false,
    dataCollection: false,
    narrated: false,
    screenTime: false,
    eodCollection: false
  })

  const [dailyScore, setDailyScore] = useState(0)

  const checklistItems = [
    { key: 'meditation', label: 'Meditation Completion' },
    { key: 'planExecution', label: 'Plan Execution' },
    { key: 'dataCollection', label: 'Data Collection' },
    { key: 'narrated', label: 'Narrated Out Loud' },
    { key: 'screenTime', label: 'Minimized Screen Time' },
    { key: 'eodCollection', label: 'End of Day Data Collection' }
  ]

  useEffect(() => {
    const checkedCount = Object.values(checkedItems).filter(Boolean).length
    const percentage = Math.round((checkedCount / checklistItems.length) * 100)
    setDailyScore(percentage)
  }, [checkedItems])

  const handleCheckboxChange = (key: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }))
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Daily Score</h3>
        <p className="text-sm text-gray-400">Daily Checklist Completion</p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-3">
          {checklistItems.map((item) => (
            <div key={item.key} className="flex items-center">
              <input
                type="checkbox"
                id={item.key}
                checked={checkedItems[item.key as keyof typeof checkedItems]}
                onChange={() => handleCheckboxChange(item.key)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label
                htmlFor={item.key}
                className="ml-3 text-sm text-gray-300 cursor-pointer"
              >
                {item.label}
              </label>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center bg-gray-700 rounded-lg p-4">
          <div className="text-3xl font-bold text-green-400">
            {dailyScore}%
          </div>
          <div className="text-sm text-gray-400">Daily Score</div>
        </div>
      </div>
    </div>
  )
}

export default DailyScoreCard
