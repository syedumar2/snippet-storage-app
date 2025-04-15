'use client'
import { Input } from "@/components/ui/input"

import Header from "@/components/Header";
import { useAuth } from "@/components/hooks/use-auth"

import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TriangleAlert } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import { Trash2, NotebookPen } from 'lucide-react'




import Image from 'next/image';
import Pagination from "@/components/Pagination";


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
    const [editFileId, setEditFileId] = useState(null); // New state to track which file is being edited
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(9);


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
    const openEditDialog =(fileId,existingTitle,existingContent) =>{
        setEditFileId(fileId); // Set the specific file ID being edited
        setFilename(existingTitle);
        setContent(existingContent);    
        setIsEditDialogOpen(true)
    }
    const resetForm = () => {
        setFilename('');
        setContent('');
        setEditFileId(null);
        setIsEditDialogError('');
        setDialogError('');
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
        if (!editFileId) return; // Ensure we have a file ID to update
        setIsLoading(true);
        try{
            const response = await fetch(`http://localhost:3001/update/${editFileId}`,
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

    const lastPostIndex = currentPage*postsPerPage;
    const firstPostIndex = lastPostIndex - postsPerPage;
    const totalPages = Math.ceil(files.length/postsPerPage);  
    const lastPage = totalPages;  
    const nextPage = () => setCurrentPage(currentPage+1);
    const prevPage = () => setCurrentPage(currentPage-1);


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
                        files.slice(firstPostIndex,lastPostIndex).map((file) => (
                        <Card key={file.id} className={`border-gray-300 shadow-lg animate-fade-left ${isAnimating ? "animate-duration-1000 animate-delay-[400ms] animate-ease-out animate-normal" : ""}`}>
                            <CardHeader>
                                <CardTitle>{file.filename}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{file.content}</p>
                            </CardContent>
            {/* ---------------------------------------------------------- delete button DIalogue trigger here---------------------------------------------------------------- */}

                                            <div className="flex items-center justify-end mr-5 gap-3 ">
                                                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                                    <DialogTrigger asChild>

                                                        <Button
                                                            className="bg-black hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"

                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </Button>
                                                    </DialogTrigger>


                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                            <DialogDescription>
                                                                This action cannot be undone. This will permanently delete your snippet
                                                                and its content from our servers.
                                                            </DialogDescription>
                                                            <div className="flex items-center justify-between gap-2 mt-3">
                                                                <Button variant="outline" className="cursor-pointer" onClick={() => setIsDeleteDialogOpen(false)} >Cancel</Button>
                                                                <Button className="cursor-pointer bg-red-600 hover:bg-red-900" onClick={() => handleDelete(file.id)}>{isLoading ? "Deleting..." : "Delete"}</Button>
                                                            </div>

                                                        </DialogHeader>
                                                    </DialogContent>
                                                </Dialog>

                                                <div>
                                                    {/* -------------------------------------------------------------edit button------------------------------------------------------------------------------- */}
                                                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                                                        <DialogTrigger asChild>
                                                                            <Button
                                                                                className="bg-black hover:bg-green-400 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                                                                onClick={() => openEditDialog(file.id, file.filename, file.content)}
                                                                            >
                                                                                <NotebookPen className="w-5 h-5" />
                                                                            </Button>
                                                                        </DialogTrigger>
                                                                        <DialogContent>
                                                                            <DialogHeader>
                                                                                {editDialogError && (
                                                                                    <Alert variant="destructive">
                                                                                        <TriangleAlert />
                                                                                        <AlertDescription>{editDialogError}</AlertDescription>
                                                                                    </Alert>
                                                                                )}
                                                                                <DialogTitle>Edit Code Snippet</DialogTitle>
                                                                                <DialogDescription>
                                                                                    Enter your Title and Content in the following fields below:
                                                                                </DialogDescription>
                                                                                <div className="flex flex-col gap-2 text-muted-foreground text-sm">
                                                                                    <Label htmlFor="filename">Snippet title:</Label>
                                                                                    <Input type="text" placeholder="Title" value={filename} onChange={(e) => setFilename(e.target.value)} />
                                                                                    <Label htmlFor="content">Content:</Label>
                                                                                    <Textarea placeholder="Type your message here." value={content} onChange={(e) => setContent(e.target.value)} />
                                                                                    <div className="flex items-center justify-between gap-2 mt-0.5">
                                                                                        <Button variant="outline" onClick={() => {setIsEditDialogOpen(false); resetForm();}}>Cancel</Button>
                                                                                        <Button onClick={handleUpdate}>
                                                                                            {isLoading ? "Applying Edits..." : "Edit"}
                                                                                        </Button>
                                                                                    </div>
                                                                                </div>
                                                                            </DialogHeader>
                                                                        </DialogContent>
                                                                    </Dialog>
                                                </div>
                                            </div>


            {/* ----------------------------------------------------------DIalogue end trigger here---------------------------------------------------------------- */}

                        </Card>
                        ))
                    ) : (<p className="text-gray-500">Files not found</p>)}
                </div>
               
                    {
                        files.length>postsPerPage &&
                        <div className="flex justify-center items-center gap-3">
                            <Button onClick={prevPage} disabled={currentPage === 1}>Previous</Button>
                            <Pagination totalPages={totalPages} setCurrentPage={setCurrentPage}/>
                            <Button onClick={nextPage} disabled={currentPage === lastPage}>Next</Button>
                            
                        </div>
                    }
                    <p className="flex items-center justify-center  text-center py-2"><strong>
                        Page no: {currentPage} of {totalPages} 
                        <br/>
                        Total files : {files.length}</strong></p>
               

            </main>
        </div>
    )
}

export default DashboardPage;
