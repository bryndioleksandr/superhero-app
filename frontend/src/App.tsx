import { Routes, Route } from 'react-router-dom'
import SuperheroList from './pages/SuperheroList'
import SuperheroDetail from './pages/SuperheroDetail'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SuperheroList />} />
      <Route path="/superhero/:id" element={<SuperheroDetail />} />
    </Routes>
  )
}

export default App
