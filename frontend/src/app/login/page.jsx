"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { TriangleAlert } from 'lucide-react';
import { useAuth } from "@/components/hooks/use-auth"



export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter()
    const { login, token } = useAuth();

    

    async function handleSubmit(e) {
        e.preventDefault()
        setError('');
        if (!username || !password) {
            setError("Please enter all fields")
            return
        }
        setIsLoading(true)
        try {
            
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password
                }),
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || "Wrong Credentials")
            }
            alert("Log in successful")
            const data = await response.json();
            login(data.token);
            router.push('/dashboard ')
        }
        
        catch (error) { setError(error.message || "Something went wrong") }
        finally {
            setIsLoading(false)
        }
    }


    return (<div className="container flex justify-center items-center min-h-screen py-12 mx-auto">
        {/* alt+shift+f to align code */}


        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <CardTitle>Log in    </CardTitle>
                <CardDescription>Enter your credentials in the fields below: </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {error &&
                        (
                            <Alert variant="destructive">
                                <TriangleAlert />
                                <AlertDescription>
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}
                    <div className="space-y-1">
                        <Label htmlFor="username">User name:</Label>
                        <input placeholder="Username" type={'text'} id="username" className="block w-full rounded-md border px-2 py-1 my-2" value={username}
                            onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="password">Password:</Label>
                        <input placeholder="Password" type={'password'} id="password" className="block w-full rounded-md border px-2 py-1 my-2" value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>

                </CardContent>

                <CardFooter className="flex flex-col space-y-4 ">
                    <Button type="submit" variant="black">{isLoading ? "Logging in..." : "Log in"}</Button>
                    <div className="text-sm">
                        Dont have an account ?{" "}
                        <Link href="/signup" className="text-primary hover:underline">Sign up here</Link>
                    </div>

                </CardFooter>
            </form>
        </Card>
    </div>

    )
}