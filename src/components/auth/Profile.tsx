import { useAuth0 } from "@auth0/auth0-react";
import { Card } from "../ui/card";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center p-6 bg-[#2d313c] text-[#a0aec0]">
        <div className="animate-pulse">Loading profile...</div>
      </Card>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Card className="flex flex-col items-center gap-4 p-6 bg-[#2d313c]">
      {user.picture && (
        <img 
          src={user.picture} 
          alt={user.name || 'User'} 
          className="w-28 h-28 rounded-full object-cover border-4 border-[#63b3ed] transition-transform duration-300 hover:scale-105"
        />
      )}
      <div className="text-center">
        <div className="text-2xl font-semibold text-white mb-2">
          {user.name}
        </div>
        <div className="text-lg text-[#a0aec0]">
          {user.email}
        </div>
      </div>
    </Card>
  );
};

export default Profile;