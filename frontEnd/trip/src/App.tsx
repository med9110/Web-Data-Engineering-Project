import { Route, Routes } from "react-router-dom";
import Main from "./components/Main";
import Discover from "./pages/Discover";
import Trips from "./pages/Trips";
import AccountInfo from "./pages/Account-Info";
import UpdatePassword from "./pages/passwordUpdate"; 
import Reservations from "./pages/Reservations";
import Properties from "./pages/Properties";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/trips" element={<Trips />} />
      <Route path="/account-info" element={<AccountInfo />} />
      <Route path="/update-password" element={<UpdatePassword />} />  
      <Route path="/reservations" element={<Reservations />} />
      <Route path="/properties" element={<Properties />} />
    </Routes>
  );
};

export default App;
