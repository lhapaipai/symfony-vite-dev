import { useState } from 'react'
import reactLogo from '~/images/logo-react.svg'
import viteLogo from '~/images/logo-vite.svg'
import './App.scss'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="react-app">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div>
        <div>
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        </div>
        <p>
        <code>assets/page/react/App.jsx</code>
        </p>
        <p>
          Edit component and save to test HMR
        </p>
      </div>
    </div>
  )
}

export default App
