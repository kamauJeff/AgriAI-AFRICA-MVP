import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { register as registerApi } from '../../api/endpoints/auth';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { toast } from '../../components/ui/use-toast';

// Password strength check (simple version – you can enhance with zxcvbn later)
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

export default function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const mutation = useMutation({
    mutationFn: (data: { name: string; email: string; password: string }) =>
      registerApi(data.name, data.email, data.password),
    onSuccess: (response) => {
      const { user, token } = response.data;
      setAuth(user, token);
      toast({ title: 'Registration successful' });
      navigate('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: 'Registration failed',
        description: error.response?.data?.error || 'Something went wrong',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate({ name: data.name, email: data.email, password: data.password });
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>Join AgriAI Africa to manage your farms</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="showPassword" className="text-sm text-muted-foreground">
                  Show password
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={mutation.isPending}>
                {mutation.isPending ? 'Creating account...' : 'Register'}
              </Button>
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary underline">
                  Login
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}