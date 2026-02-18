import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/authStore';

export default function Header() {
  const { isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-xl font-bold text-green-700">
          AgriAI Africa
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/predict">AI Predict</Link>
          <Link to="/market">Market</Link>   {/* Added Market link */}
          {isAuthenticated ? (
            <>
              <span>Hi, {user?.name}</span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}