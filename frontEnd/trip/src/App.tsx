import { Route, Routes } from "react-router-dom";
import Main from "./components/Main";
import Discover from "./pages/Discover";
import Trips from "./pages/Trips";
import AccountInfo from "./pages/Account-Info";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/trips" element={<Trips />} />
      <Route path="/Acount-Info" element={<AccountInfo/>} />
    </Routes>
  );
};

export default App;