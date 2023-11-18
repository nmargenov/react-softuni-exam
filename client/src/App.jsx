import { Footer } from "./components/Footer/Footer"
import { Header } from "./components/Header/Header"

import styles from "./app.module.css";

function App() {

  return (
    <>
      <Header />
      <div className={styles["main"]}>

      </div>
      <Footer />
    </>
  )
}

export default App
