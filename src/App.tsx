import "./App.css";
import { Route, Routes } from "react-router-dom";
import RouterFrontend from "./Routes/apiRoutesFrontend.js";

function App() {
  return (
    <div className="">
      <Routes>
        {RouterFrontend.map(
          (route, index) =>
            route.element && (
              <Route
                key={index}
                path={route.path}
                element={route.element}
              />
            )
        )}
      </Routes>
    </div>
  );
}

export default App;
