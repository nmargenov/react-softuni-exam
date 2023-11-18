import { Footer } from "./components/Footer/Footer"
import { Header } from "./components/Header/Header"

import styles from "./app.module.css";
import { Route, Routes } from "react-router";
import { Login } from "./components/Auth/Login/Login";
import { AuthProvider } from "./contexts/AuthContext";

function App() {

  return (
    <AuthProvider>
      <Header />
      <div className={styles["main"]}>
        <Routes>
          <Route path='/login' element={<Login />} />
        </Routes>
      </div>
      <Footer />
    </AuthProvider>
  )
}

export default App
