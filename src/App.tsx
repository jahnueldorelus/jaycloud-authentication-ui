import { AppNavbar } from "@components/navbar";
import { AuthProvider } from "./store";
import { Outlet } from "react-router-dom";
import "./App.scss";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppNavbar />
        <Outlet />
      </div>
    </AuthProvider>
  );
}

export default App;
