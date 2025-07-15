import { useState } from 'react'

const ReviewCard = () => {
  const [executionReview, setExecutionReview] = useState('')
  const [thingsDoneWell, setThingsDoneWell] = useState('')
  const [thingsDonePoorly, setThingsDonePoorly] = useState('')
  const [tomorrowFocus, setTomorrowFocus] = useState('')

  return (
    <div className="bg-gray-800 rounded-lg p-4 h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Review</h3>
        <p className="text-sm text-gray-400">Daily Performance Review</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Review of each execution
          </label>
          <textarea
            value={executionReview}
            onChange={(e) => setExecutionReview(e.target.value)}
            placeholder="Detailed review of each trade execution..."
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm h-16 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Things I did well
          </label>
          <textarea
            value={thingsDoneWell}
            onChange={(e) => setThingsDoneWell(e.target.value)}
            placeholder="What went well in terms of impulse management and data collection..."
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm h-16 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Things I did poorly
          </label>
          <textarea
            value={thingsDonePoorly}
            onChange={(e) => setThingsDonePoorly(e.target.value)}
            placeholder="What could be improved in impulse management and data collection..."
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm h-16 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Focus for tomorrow
          </label>
          <input
            type="text"
            value={tomorrowFocus}
            onChange={(e) => setTomorrowFocus(e.target.value)}
            placeholder="Key focus areas for tomorrow's trading session..."
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
}

export default ReviewCard
