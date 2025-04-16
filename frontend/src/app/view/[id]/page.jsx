"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/hooks/use-auth";
import Header from "@/components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy } from "lucide-react";
import { Check } from "lucide-react";
import { Share } from "lucide-react";

const ViewFile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const { token, logout } = useAuth();
  const [file, setFile] = useState(null);
  const [dashboardError, setDashboardError] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [isCopied, setIsCopied] = useState(false);
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    async function fetchFile() {
      const fetchUser = async () => {
        if (!token) return;
        try {
          setLoading(true);
          const response = await fetch("http://localhost:3001/user", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            const errData = await response.text();
            throw new Error(errData || "Failed to fetch user");
          }
          const userData = await response.json();
          setLoading(false);
          setUser(userData);
          setError("");
        } catch (error) {
          setLoading(false);
          setDashboardError(error.message || "Something went wrong");
        }
      };

      if (token) {
        fetchUser();
      } else {
        router.push("/login");
      }

      const response = await fetch(`http://localhost:3001/read/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to fetch File");
      }
      const Files = await response.json();
      console.log(Files);

      setFile(Files);
    }
    fetchFile();
  }, [token, id]);
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }
  function copyURL(text) {
    navigator.clipboard.writeText(text).then(() => {
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    });
  }

  return (
    <div className="container mx-auto">
      {dashboardError && (
        <div className="text-red-500">Error: {dashboardError}</div>
      )}
      <Header user={user} handleLogout={handleLogout} />
      {loading ? (
        <p>
          <strong>Loading...</strong>
        </p>
      ) : file ? (
        <div className=" container mx-auto my-20 flex items-center justify-center w-full">
          <Card className="w-full max-w-2xl  border-2 shadow-md rounded-2xl bg-background">
            <CardHeader>
              <CardTitle className="text-2xl">{file.filename}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{file.content}</p>
            </CardContent>
            <CardFooter className="flex items-center justify-between gap-2 w-full">
              <Button
                onClick={() => router.push("/dashboard")}
                className="hover:cursor-pointer"
              >
                Back
              </Button>
              <div className="flex gap-2">
                  <Button
                    className="hover:cursor-pointer"
                    onClick={() => {
                      copyText(file.content);
                      toast.success("Content Copied to clipboard");
                    }}
                  >
                    {" "}
                    {isCopied ? <Check /> : <Copy />}
                  </Button>
                  <Button
                    className="hover:cursor-pointer"
                    onClick={() => {
                      copyURL(location.href);
                      toast.success("Link copied");
                    }}
                  >
                    {" "}
                    {isShared ? <Check /> : <Share />}
                  </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <p>No file found</p>
      )}
    </div>
  );
};

export default ViewFile;
