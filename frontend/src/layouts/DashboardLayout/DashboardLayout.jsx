import { Link, Outlet, useNavigate } from "react-router-dom";
import "./DashboardLayout.css";
import { useAuth, SignedIn, UserButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import ChatList from "../../components/ChatList/ChatList";

const DashboardLayout = () => {
  const { userId, isLoaded } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
  }, [isLoaded, userId, navigate]);

  if (!isLoaded) return "Loading...";

  return (
    <div className="dashboardLayout">
      <div className={`menuOverlay ${isOpen ? "open" : ""}`} onClick={toggleMenu}></div>

      <div className={`menu ${isOpen ? "open" : ""}`}>
        <ChatList />
      </div>
      <div className="content">
        <div className="nav">
          <div className="hamburger" onClick={toggleMenu}>
            ☰
          </div>
          <p className="logo">
            <p>AI CHAT</p>
          </p>
          <Link to="/dashboard">
            <img className="newChat"  src="/new-chat.png" alt="" />
          </Link>
          <div className="userDashboard">
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
