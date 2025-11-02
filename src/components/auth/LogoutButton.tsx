import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../ui/button";

const LogoutButton = () => {
  const { logout } = useAuth0();
  
  const handleLogout = () => {
    // Clear localStorage
    localStorage.clear();
    // Logout from Auth0
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };
  
  return (
    <Button
      onClick={handleLogout}
      variant="destructive"
      size="default"
      className="bg-red-500 hover:bg-red-600 text-white font-medium"
    >
      Sign Out
    </Button>
  );
};

export default LogoutButton;