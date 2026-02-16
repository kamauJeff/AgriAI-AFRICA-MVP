import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { login } from '../../api/endpoints/auth';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { toast } from '../../components/ui/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const mutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (response) => {
      const { user, token } = response.data;
      setAuth(user, token);
      toast({ title: 'Login successful' });
      navigate('/dashboard');
    },
    onError: (error: any) => {
      toast({ title: 'Login failed', description: error.response?.data?.error, variant: 'destructive' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Logging in...' : 'Login'}
            </Button>
            <p className="text-sm text-muted-foreground">
              Don't have an account? <Link to="/register" className="text-primary underline">Register</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}