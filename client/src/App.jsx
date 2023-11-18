import { Footer } from "./components/Footer/Footer"
import { Header } from "./components/Header/Header"

import styles from "./app.module.css";
import { Route, Routes } from "react-router";
import { Login } from "./components/Auth/Login/Login";

function App() {

  return (
    <>
      <Header />
      <div className={styles["main"]}>
      <Routes>
        <Route path='/login' element={<Login />}/>
      </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
