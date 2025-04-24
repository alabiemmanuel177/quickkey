import { Github, Google } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { LoginForm } from '@/components/auth/LoginForm';
import OAuthSignIn from '@/components/auth/OAuthSignIn';

export default function LoginPage() {
  return (
    <div className="flex h-[calc(100vh-65px)] w-full items-center justify-center">
      <div className="w-full max-w-md space-y-8 px-4 sm:px-0">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to continue to QuickKey
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-xl">Sign In</CardTitle>
            <CardDescription className="text-center">
              Choose your preferred sign in method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <OAuthSignIn />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <LoginForm />
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="font-medium text-primary underline underline-offset-4"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 