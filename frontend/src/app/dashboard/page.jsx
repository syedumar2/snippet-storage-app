'use client'
import { Input } from "@/components/ui/input"

import Header from "@/components/Header";
import { useAuth } from "@/components/hooks/use-auth"
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TriangleAlert } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import { Trash2, NotebookPen } from 'lucide-react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";

import Image from 'next/image';
import SnippetCard from "@/components/SnippetCard";

const DashboardPage = () => {
    const router = useRouter();
    const { token, logout } = useAuth();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [dashboardError, setDashboardError] = useState('');
    const [dialogError, setDialogError] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [files, setFiles] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [filename, setFilename] = useState("");
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [isEditDialogOpen,setIsEditDialogOpen] = useState(false);
    const [editDialogError,setIsEditDialogError] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);


    const dialogState = {
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        isEditDialogOpen,
        editDialogError,
        setIsEditDialogOpen,
    
        
      };

    useEffect(() => {

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
            fetchFiles();
        } else {
            router.push("/login")
        }

    }, [token,refresh])
    const fetchFiles = async () => {
        setLoading(true);
        if (!token) return;
        
        await new Promise((resolve) => setTimeout(resolve, 1000));
        try {
            const response = await fetch('http://localhost:3001/files', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || "Failed to fetch Snippets")
            }
            const Files = await response.json();
            
            setFiles(Files);
            
            setDashboardError('');
            setIsAnimating(true);
            setTimeout(() => {
                setIsAnimating(false);
            }, 1000); 
        } catch (error) {
            setDashboardError(error.message || "Something went wrong");
        }
        finally{
            setLoading(false);
        }
    }


    const handleLogout = () => {
        logout();
        router.push('/login')
    };
    const openEditDialog =(existingTitle,existingContent) =>{
        setFilename(existingTitle);
        setContent(existingContent);
        setIsEditDialogOpen(true)
    }

    async function handleSubmit(e) {
            e.preventDefault();
            setDialogError('');
            if (!filename || !content) {
                setDialogError("Please enter all fields")
                return;
            }
            setIsLoading(true)
            try {
                const response = await fetch('http://localhost:3001/files/create',
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            filename,
                            content
                        }),
                    }
                );
               
                if (!response.ok) {
                    const errData = await response.text();
                    throw new Error(errorData || "Wrong Credentials")
                }
            setIsDialogOpen(false); // Close dialog
            setFilename(''); // Reset input
            setContent(''); // Reset input
            await fetchFiles(); 
           
            }
            catch (error) {
                setDialogError(error.message || "Something went wrong");
            }
            finally {
                setIsLoading(false)
            }
            
            
    }
    async function handleDelete(id) {
            setIsLoading(true)
            
            try {
                const response = await fetch(`http://localhost:3001/delete/${id}`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'content-Type': 'application/json'
                        },
                    }
                );
                console.log(response);
                if (!response.ok) {
                    const errData = await response.text();
                    throw new Error(errData || "Failed to delete file")
                    console.log(errData)
                }
                fetchFiles();
            }
            catch (error) {
                setDeleteError(error.message || "Something went wrong");
            }
            finally {
                setIsLoading(false)
            }
            setIsDeleteDialogOpen(false); // Close dialog
            setDeleteError("")
            await fetchFiles(); 
     

    }
    async function handleUpdate(id) {
        setIsLoading(true);
        try{
            const response = await fetch(`http://localhost:3001/update/${id}`,
                {
                    method: 'PUT',
                    headers:{
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        filename,
                        content
                    }),
                }
            );
            if(!response.ok){
                const errData = await response.text();
                throw new Error(errData || "Failed to update file")
            }
            setIsEditDialogOpen(false); // Close dialog
            setFilename(''); // Reset input
            setContent(''); // Reset input
            await fetchFiles();
    
        } 
        catch (error) {
            setIsEditDialogError(error.message || "Something went wrong");
        }
        finally {
            setIsLoading(false);
        }
     
        
    }
    return (
        <div className="container mx-auto">
            {dashboardError && <div className="text-red-500">Error: {dashboardError}</div>}

            {/* Header */}
        <Header user={user} handleLogout={handleDelete}/>
            

            {/* Main content */}
            <main className="p-4">
                {/* Image on top of heading */}
                <div className="flex flex-col items-start mx-5  gap-4 animate-fade-up animate-duration-1000 animate-delay-200 animate-ease-out animate-normal">
                    <Image
                        src="/images/notes.jpg"
                        alt="Notes"
                        width={200}
                        height={150}
                        className="rounded-lg shadow-md"
                    />
                    <h3 className="text-3xl font-bold">Snippet Dashboard</h3>

                </div>

                {/* Grid layout for cards */}
{/* ----------------------------------------------------------add file DIalogue trigger here---------------------------------------------------------------- */}
                <div className="flex items-center justify-end">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="cursor-pointer animate-fade-up animate-duration-500 animate-ease-out animate-normal">
                                {isLoading ? "Adding...":"Add File"}</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                {dialogError &&
                                    (
                                        <Alert variant="destructive">
                                            <TriangleAlert />
                                            <AlertDescription>
                                                {dialogError}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                <DialogTitle>Create Code Snippet</DialogTitle>
                                <DialogDescription>
                                    Enter your title and Content in the following fields given below:

                                </DialogDescription>
                                <div className="flex flex-col gap-2 text-muted-foreground text-sm">
                                    <Label htmlFor="filename">Snippet title:</Label>
                                    <Input type="text" placeholder="Title" value={filename} onChange={(e) => setFilename(e.target.value)} />
                                    <Label htmlFor="content">Content: </Label>
                                    <Textarea placeholder="Type your message here." value={content} onChange={(e) => setContent(e.target.value)} />
                                    <div className="flex items-center justify-between gap-2 mt-0.5">
                                        <Button variant="outline" className="cursor-pointer" onClick={() => setIsDialogOpen(false)} >Cancel</Button>
                                        <Button className="cursor-pointer" onClick={handleSubmit}>
                                            Add</Button>
                                    </div>
                                </div>


                            </DialogHeader>

                        </DialogContent>
                    </Dialog>
{/* ----------------------------------------------------------DIalogue end here---------------------------------------------------------------- */}


                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-5">
                    {loading ?(<p className="text-gray-500">Loading...</p>): files.length > 0 ? (
                        files.map((file) => (
                            <SnippetCard file={file} 
                            key = {file.id}
                            content = {file.content}
                            isAnimating={isAnimating} 
                            dialogState={dialogState} 
                            handleDelete={handleDelete} 
                            openEditDialog={openEditDialog} 
                            handleUpdate={handleUpdate} 
                            isLoading={isLoading} 
                            />
                        ))
                    ) : (<p className="text-gray-500">Files not found</p>)}
                </div>

            </main>
        </div>
    )
}

export default DashboardPage;
