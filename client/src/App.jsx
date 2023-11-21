import { Footer } from "./components/Footer/Footer"
import { Header } from "./components/Header/Header"

import styles from "./app.module.css";
import { Navigate, Route, Routes } from "react-router";
import { Login } from "./components/Auth/Login/Login";
import { AuthProvider } from "./contexts/AuthContext";
import { Register } from "./components/Auth/Register/Register";
import { Profile } from "./components/Profile/Profile";
import { Settings } from "./components/Settings/Settings";
import { MustBeGuestGuard } from "./guards/MustBeGuestGuard";
import { MustBeAuthGuard } from "./guards/MustBeAuthGuard";
import { Feed } from "./components/Feed/Feed";
import { Details } from "./components/Details/Details";
import { DetailsProvider } from "./contexts/DetailsContext";

function App() {

  return (
    <AuthProvider>
      <Header />
      <div className={styles["main"]}>
        <Routes>
          <Route path='/' element={<Navigate to='/feed' />} />
          <Route path='/feed' element={<Feed />} />
          <Route path='/login' element={
            <MustBeGuestGuard>
              <Login />
            </MustBeGuestGuard>
          } />
          <Route path='/register' element={
            <MustBeGuestGuard>
              <Register />
            </MustBeGuestGuard>} />
          <Route path='/profile/:username' element={<Profile />}
          />
          <Route path='/account/settings' element={
            <MustBeAuthGuard>
              <Settings />
            </MustBeAuthGuard>}
          />
          <Route path="/post/:postId" element={<DetailsProvider><Details /></DetailsProvider>} />
        </Routes>
      </div>
      <Footer />
    </AuthProvider>
  )
}

export default App
