import "./App.css";
import HomePage from "./components/HomePage/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Header from "./components/Header/Header";
import { AuthProvider } from "./context/AuthContext";
import { ActiveChatProvider } from "./context/ActiveChatContext";
import { useState } from "react";
import UseSocketOnline from "./hooks/socketConnectConfig";
function App() {
  const [activeFeature, setActiveFeature] = useState("chat"); // Quản lý trạng thái tính năng
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <ActiveChatProvider>
            <UseSocketOnline />
            <div className="App">
              <Header onFeatureSelect={setActiveFeature} />
              <Routes>
                <Route
                  path="/"
                  element={
                    <HomePage
                      activeFeature={activeFeature}
                      setActiveFeature={setActiveFeature}
                    />
                  }
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
              <footer className="footer">
                <p>&copy; 2025 Messenger App</p>
              </footer>
            </div>
          </ActiveChatProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
