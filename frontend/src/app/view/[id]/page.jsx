"use client"
import { useParams } from "next/navigation";
import {  useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/components/hooks/use-auth";
import Header from "@/components/Header";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";


const ViewFile = () => {
    const router = useRouter(); 
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const { token, logout } = useAuth();
    const [file, setFile] = useState(null)
    const [dashboardError, setDashboardError] = useState('');
    const { id } = useParams();
    useEffect(() => {
        async function fetchFile() {
            const fetchUser = async () => {
                if (!token) return;
                try {
                    const response = await fetch('http://localhost:3001/user', {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                    });
                    if (!response.ok) {
                        const errData = await response.text();
                        throw new Error(errData || "Failed to fetch user")
                    }
                    const userData = await response.json();
                    setUser(userData);
                    setError('');
                } catch (error) {
                    setDashboardError(error.message || "Something went wrong");
                }
            }
    
            
    
    
            if (token) {
                fetchUser();

            } else {
                router.push("/login")
            }

            const response = await fetch(`http://localhost:3001/read/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || "Failed to fetch File")
            }
            const Files = await response.json();
            console.log(Files);

            setFile(Files);


        }
        fetchFile();


    }, [token, id])
    const handleLogout = () => {
        logout();
        router.push('/login')
    };







    return (
        <div className="container mx-auto">
             {dashboardError && <div className="text-red-500">Error: {dashboardError}</div>}
            <Header user={user} handleLogout={handleLogout} />

            {file ?  (<Card className={"my-4"}>
                <CardHeader>
                    <CardTitle>{file.filename}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{file.content}</p>
                </CardContent>
                <CardFooter className={"flex items-center justify-end"}>
                <Button onClick={()=> router.push("/dashboard")} className={"hover:cursor-pointer"}>Back</Button>
                </CardFooter>

            </Card>):(<p>No file found</p>)}

            
        </div>
    )
}

export default ViewFile