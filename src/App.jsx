import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/loginform/LoginForm";
import Header from "./components/header/Header";
import HomePage from "./pages/homepage/HomePage";
import Footer from "./components/footer/Footer";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route
          path="/home"
          element={
            <div>
              <Header />
              <HomePage />
              <Footer/>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;