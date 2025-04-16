"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LuLoader } from "react-icons/lu";
import Link from "next/link";

// Login form schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Register form schema
const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Login form
  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = async (values: LoginValues) => {
    setIsLoading(true);
    try {
      // Handle login logic here
      console.log("Login values:", values);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (values: RegisterValues) => {
    setIsLoading(true);
    try {
      // Handle registration logic here
      console.log("Register values:", values);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: "google" | "github") => {
    setIsLoading(true);
    try {
      // Handle social authentication logic here
      console.log(`${provider} authentication`);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`${provider} auth error:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full overflow-hidden border shadow-lg">
      <CardHeader className="p-0">
        <Tabs 
          defaultValue="login" 
          onValueChange={(value) => setActiveTab(value as "login" | "register")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 rounded-none">
            <TabsTrigger 
              value="login" 
              className="rounded-none py-3 text-sm font-medium transition-all data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              Login
            </TabsTrigger>
            <TabsTrigger 
              value="register" 
              className="rounded-none py-3 text-sm font-medium transition-all data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              Register
            </TabsTrigger>
          </TabsList>
          
          <div className="p-6">
            <TabsContent value="login" className="mt-0 space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold">Welcome Back!</h3>
                <p className="text-sm text-muted-foreground">Enter your credentials to continue</p>
              </div>
              
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="email@example.com" 
                            {...field} 
                            disabled={isLoading} 
                            className="h-10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Password</FormLabel>
                          <Link 
                            href="/auth/forgot-password"
                            className="text-xs text-primary hover:underline"
                          >
                            Forgot Password?
                          </Link>
                        </div>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                            disabled={isLoading}
                            className="h-10" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full h-10" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <LuLoader className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : "Login"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="register" className="mt-0 space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold">Create an Account</h3>
                <p className="text-sm text-muted-foreground">Sign up to track your progress</p>
              </div>
              
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="John Doe" 
                            {...field} 
                            disabled={isLoading}
                            className="h-10" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="email@example.com" 
                            {...field} 
                            disabled={isLoading}
                            className="h-10" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                            disabled={isLoading}
                            className="h-10" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                            disabled={isLoading}
                            className="h-10" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full h-10" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <LuLoader className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : "Create account"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </div>
        </Tabs>
      </CardHeader>
      
      <CardContent className="border-t bg-muted/20 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Separator className="flex-grow" />
          <span className="text-xs text-muted-foreground font-medium">OR CONTINUE WITH</span>
          <Separator className="flex-grow" />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            className="w-full h-10 border border-input bg-background hover:bg-accent hover:text-accent-foreground" 
            onClick={() => handleSocialAuth("google")}
            disabled={isLoading}
          >
            <FaGoogle className="mr-2 h-4 w-4" />
            {activeTab === "login" ? "Login with Google" : "Sign up with Google"}
          </Button>
          <Button 
            variant="outline" 
            className="w-full h-10 border border-input bg-background hover:bg-accent hover:text-accent-foreground" 
            onClick={() => handleSocialAuth("github")}
            disabled={isLoading}
          >
            <FaGithub className="mr-2 h-4 w-4" />
            {activeTab === "login" ? "Login with GitHub" : "Sign up with GitHub"}
          </Button>
        </div>
        
        <p className="text-xs text-center text-muted-foreground mt-6">
          By continuing, you agree to QuickKey&apos;s Terms of Service and Privacy Policy.
        </p>
      </CardContent>
    </Card>
  );
};

export default AuthForm; 