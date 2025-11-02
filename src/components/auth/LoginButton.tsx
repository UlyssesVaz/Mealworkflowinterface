import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../ui/button";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  
  return (
    <Button 
      onClick={() => loginWithRedirect()} 
      className="bg-[#63b3ed] hover:bg-[#4299e1] text-white font-semibold"
    >
      Log In
    </Button>
  );
};

export default LoginButton;