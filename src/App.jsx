import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./Routes/Route";

function App() {
  // 👇 Set the basename dynamically based on environment
  const basename = import.meta.env.MODE === "production" ? "/admin" : "/";

  return (
    <Router basename={basename}>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </Router>
  );
}

export default App;
