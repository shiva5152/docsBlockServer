import "./App.css";
import {BrowserRouter,Route,Routes,useNavigate} from "react-router-dom"
import Login from "./Components/Login"
import Alert from "./Components/Alert";
const App = () => {
  return (
    <BrowserRouter>
    <Alert/>
     <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/dashboard"  />
     </Routes>
    </BrowserRouter>
  )
}

export default App

