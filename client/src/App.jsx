import { Footer } from "./components/Footer/Footer"
import { Header } from "./components/Header/Header"

import styles from "./app.module.css";
import { Navigate, Route, Routes } from "react-router";
import { Login } from "./components/Auth/Login/Login";
import { AuthProvider } from "./contexts/AuthContext";
import { Register } from "./components/Auth/Register/Register";
import { Profile } from "./components/Profile/Profile";

function App() {

  return (
    <AuthProvider>
      <Header />
      <div className={styles["main"]}>
        <Routes>
          <Route path='/' element={<Navigate to='/feed'/>}/>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/profile/:username' element={<Profile />} />
        </Routes>
      </div>
      <Footer />
    </AuthProvider>
  )
}

export default App
