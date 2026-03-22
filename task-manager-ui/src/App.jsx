import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:8080/api/tasks'

function App() {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'TODO',
    dueDate: ''
  })

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    const res = await axios.get(API)
    setTasks(res.data)
  }

  const createTask = async () => {
    if (!form.title) return
    await axios.post(API, form)
    setForm({ title: '', description: '', status: 'TODO', dueDate: '' })
    fetchTasks()
  }

  const updateStatus = async (task, status) => {
    await axios.put(`${API}/${task.id}`, { ...task, status })
    fetchTasks()
  }

  const deleteTask = async (id) => {
    await axios.delete(`${API}/${id}`)
    fetchTasks()
  }

  const filtered = filter === 'ALL' ? tasks : tasks.filter(t => t.status === filter)

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Task Manager</h1>

        {/* Add Task Form */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Task</h2>
          <div className="flex flex-col gap-3">
            <input
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
            <input
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
            <input
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="date"
              value={form.dueDate}
              onChange={e => setForm({ ...form, dueDate: e.target.value })}
            />
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
            >
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-2 transition"
              onClick={createTask}
            >
              Add Task
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-6">
          {['ALL', 'TODO', 'IN_PROGRESS', 'DONE'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === s
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="flex flex-col gap-4">
          {filtered.map(task => (
            <div key={task.id} className="bg-white rounded-2xl shadow p-5 flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                <p className="text-gray-500 text-sm">{task.description}</p>
                {task.dueDate && (
                  <p className="text-gray-400 text-xs mt-1">Due: {task.dueDate}</p>
                )}
                <span className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full ${
                  task.status === 'TODO' ? 'bg-yellow-100 text-yellow-700' :
                  task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                <select
                  className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                  value={task.status}
                  onChange={e => updateStatus(task, e.target.value)}
                >
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg px-3 py-1 transition"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-gray-400">No tasks found.</p>
          )}
        </div>

      </div>
    </div>
  )
}

export default App