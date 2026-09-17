// src/App.tsx
import Header from "./components/Header";
import AppRoutes from "./routes/AppRoutes";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <AppRoutes />
    </div>
  );
}

export default App;
