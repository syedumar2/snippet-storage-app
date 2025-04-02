"use client"
import { Input } from "@/components/ui/input"
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
import { Trash2, NotebookPen } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
const SnippetCard = ({ file,
    filename,
    content,
    setFilename,
    handleDelete,
    dialogState,
    handleUpdate,
    isLoading,
    isAnimating,
    openEditDialog,
}) => {
    const { isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        isEditDialogOpen,
        editDialogError,
        setIsEditDialogOpen } = dialogState;
    return (
        <Card key={file.id} className={`border-gray-300 shadow-lg animate-fade-left ${isAnimating ? "animate-duration-1000 animate-delay-[800ms] animate-ease-out animate-normal" : ""}`}>
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
                                onClick={() => openEditDialog(file.filename, file.content)}

                            > <NotebookPen className="w-5 h-5" /></Button>
                        </DialogTrigger>


                        <DialogContent>
                            <DialogHeader>

                                <DialogTitle>Edit Code Snippet</DialogTitle>
                                <DialogDescription>
                                    Enter your Title and Content in the following fields given below:

                                </DialogDescription>
                                <div className="flex flex-col gap-2 text-muted-foreground text-sm">
                                    {editDialogError &&
                                        (
                                            <Alert variant="destructive">
                                                <TriangleAlert />
                                                <AlertDescription>
                                                    {editDialogError}
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                    <Label htmlFor="filename">Snippet title:</Label>
                                    <Input type="text" placeholder="Title" value={filename} onChange={(e) => setFilename(e.target.value)} />
                                    <Label htmlFor="content">Content: </Label>
                                    <Textarea placeholder="Type your message here." value={content} onChange={(e) => setContent(e.target.value)} />
                                    <div className="flex items-center justify-between gap-2 mt-0.5">
                                        <Button variant="outline" className="cursor-pointer" onClick={() => setIsEditDialogOpen(false)} >Cancel</Button>
                                        <Button className="cursor-pointer" onClick={() => handleUpdate(file.id)}>{isLoading ? "Applying Edits..." : "Edit"}</Button>
                                    </div>
                                </div>


                            </DialogHeader>

                        </DialogContent>
                    </Dialog>

                </div>
            </div>


            {/* ----------------------------------------------------------DIalogue end trigger here---------------------------------------------------------------- */}

        </Card>
    )
}

export default SnippetCard