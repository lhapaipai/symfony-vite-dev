import { useState } from 'react'
import reactLogo from '~/images/logo-react.svg'
import viteLogo from '~/images/logo-vite.svg'
import './App.css'

function App(props) {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Hello { props.name }</h1>
      <div>
        <div>
          <button className="react-button" onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        </div>
        <code>assets/page/react/App.jsx</code>
        <p>
          Edit component and save to test HMR
          (we have hmr with js but not with css)
        </p>
      </div>
    </>
  )
}

export default App
