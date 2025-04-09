import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import PYQUpload from './pages/PYQUpload'
import Browse from './pages/Browse'
import About from './pages/About'
import QnAChat from './pages/QnAChat'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="upload" element={<PYQUpload />} />
        <Route path="browse" element={<Browse />} />
        <Route path="qnachat" element={<QnAChat />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  )
}

export default App