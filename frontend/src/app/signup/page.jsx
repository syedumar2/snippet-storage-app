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
import { useState } from "react"
import { useRouter } from "next/navigation"
import { TriangleAlert } from 'lucide-react';



export default function SignUpPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter()
    async function handleSubmit(e) {
        e.preventDefault()
        setError('');
        if(!username || !password ){
            setError("Please enter all fields")
            return
        }
        if(password!== confirmPassword){
            setError("Passwords do not match")
        }
        // write login validation logic here
        setIsLoading(true)
        try {
            const response = await fetch('http://localhost:3001/signup', {
                method: 'POST',
                headers: {
                    'content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password
                }),
            });
            if(!response.ok){
                const errData = await response.text();
                throw new Error(errData || "Failed to create account")
            }
            alert("Sign up successful")
            router.push('/login')
        }
        catch (error) { setError(error.message||"Something went wrong") }
        finally {
            setIsLoading(false)
        }
    }




    return (<div className="container flex justify-center items-center min-h-screen py-12 mx-auto">
        {/* alt+shift+f to align code */}


        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <CardTitle>Create an account </CardTitle>
                <CardDescription>Enter your info to create an account</CardDescription>
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
                    <div className="space-y-1">
                        <Label htmlFor="confirm-password">Confirm Password:</Label>
                        <input placeholder="Confirm Password" type={'password'} id="confirm-password" className="block w-full rounded-md border px-2 py-1 my-2" value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4 ">
                    <Button type="submit" variant="black">{isLoading ? "Creating account...":"Sign up"}</Button>
                    <div className="text-sm">
                        Already have an account ? {" "}
                        <Link href="/login" className="text-primary hover:underline">Login</Link>
                    </div>

                </CardFooter>
            </form>
        </Card>
    </div>

    )
}