import { useState } from 'react'
import reactLogo from '~/images/logo-react.svg'
import viteLogo from '~/images/logo-vite.svg'
import './App.scss'

function App(props) {
  const [count, setCount] = useState(0)

  return (
    <div className="react-app">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" width="202.25" height="200" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" width="215" height="152" />
        </a>
      </div>
      <h1>Hello { props.name }</h1>
      <div>
        <div>
          <button className="react-button" onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        </div>
        <p>
          <code>assets/react/controllers/App.jsx</code>
        </p>
        <p>
          Edit component and save to test HMR
          (we have hmr with js but not with css)
        </p>
      </div>
      </div>
  )
}

export default App
