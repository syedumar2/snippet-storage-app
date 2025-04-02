import { Button } from "@/components/ui/button"
import { File, Lock, Share } from "lucide-react"
import Link from 'next/link';

export default function Home() {
  return (
    // we wrap header in a div
    <div className="container mx-auto flex flex-col min-h-screen">
      <header className="border-b">
        {/* we use another div to wrap share snippet and buttons */}
        <div className="container flex justify-between items-center py-4 ">
          {/* justify for aligning items on x axis and items for y axis */}
          <h1>Share Snippet</h1>
          <div className="flex gap-2 items-center" >
            {/* we wrap buttons to treat as single element be4 applying css */}
            <Button variant="outline" ><Link href="/login">Log in</Link></Button>
            <Button variant="outline"> <Link href="/signup">Sign up</Link></Button>
            {/* define link later */}
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* flex-1 Makes the element grow and occupy the available free space. */}

        <section className="bg-gradient-to-br from-background to-muted py-20">
          <div className="container text-center space-y-6">
            {/* gap is only used for flexbox or grid containers whereas spacey is used for block level elements */}
            <h2 className="text-4xl text-muted-foreground tracking-tight">Code and Text Snippets made simple </h2>
            {/*tracking means spacing between letters */}
            <p className="text-xl max-w-xl mx-auto text-muted-foreground">Store, share and manage your code snippets
              and text notes with our easy to use platform.
              Sign up today to get started </p>
            {/* max w of the text is set to 36 rem  see gfg tailwind css max width class for idea*/}
            <Button variant="black" className="mt-6"> Get Started {/* aschild not working check with instructor*/}</Button>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            {/* container wraps everything neatly with padding and margins and ensures content stays neatly centered  */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/*1 col on small screens and 3 col on md and lg screens */}

              <div className="flex flex-col items-center text-center p-6 space-y-4 hover:shadow-lg transition">
                {/* this div encloses our card */}
                {/* flex col arranges things vertically(stack)  */}
                <div className="bg-primary/10 p-4 rounded-full"><File className="h-8 w-8 text-primary" /></div>
                <h3 className="text-xl font-bold">Easy Snippet Management</h3>
                <p className="text-muted-foreground">Create, View, Edit and Delete your snippets with out intuitive interface</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 space-y-4 hover:shadow-lg transition">
                {/* this div encloses our card */}
                {/* flex col arranges things vertically(stack)  */}
                <div className="bg-primary/10 p-4 rounded-full"><Share className="h-8 w-8 text-primary" /></div>
                <h3 className="text-xl font-bold">Share </h3>
                <p className="text-muted-foreground">Share your code snippets with others quickly and conveniently</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 space-y-4 hover:shadow-lg transition">
                {/* this div encloses our card */}
                {/* flex col arranges things vertically(stack)  */}
                <div className="bg-primary/10 p-4 rounded-full"><Lock className="h-8 w-8 text-primary" /></div>
                <h3 className="text-xl font-bold">Secure Storage</h3>
                <p className="text-muted-foreground">Your Snippets are stored securely and accessible only to you</p>
              </div>

            </div>
          </div>

        </section>

      </main>

      <footer className="border-t py-6">
        <div className="container text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} ShareSnippet. All rights reserved.
        </div>
      </footer>
    </div>
  )
}