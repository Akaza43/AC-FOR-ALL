"use client";
import { useSession } from "next-auth/react";
import { Data } from "./data";
import dynamic from "next/dynamic";
import PlayList from "../page";
import Loading from '@/ui/loading';
import { useEffect, useState } from "react";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

type PageProps = {
  searchParams: { id?: string };
}

export default function Container({ searchParams }: PageProps) {
  const videoId = searchParams.id || "";
  const { data: session, status } = useSession();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const videoData = Data.find((item) => item.id === videoId);

  useEffect(() => {
    const checkAccess = async () => {
      if (session?.accessToken) {
        try {
          const response = await fetch("/api/verify-role", {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });
          
          if (!response.ok && response.status === 429) {
            setTimeout(checkAccess, 5000);
            return;
          }

          if (response.ok) {
            const data = await response.json();
            setHasAccess(true);
          } else {
            setHasAccess(false);
          }
        } catch (error) {
          console.error("Error verifying role:", error);
          setHasAccess(false);
        }
      } else {
        setHasAccess(false);
      }
      setLoading(false);
    };

    if (status === "authenticated") {
      checkAccess();
    } else if (status === "unauthenticated") {
      setLoading(false);
      setHasAccess(false);
    }
  }, [session, status]);

  if (loading || status === "loading") {
    return <Loading />;
  }

  if (!session || !hasAccess) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-[60%] lg:h-screen lg:overflow-hidden">
          <div className="p-6 lg:fixed lg:w-[60%] lg:max-w-[800px]">
            <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden">
              <ReactPlayer
                url={videoData?.yt}
                width="100%"
                height="100%"
                controls={true}
                playing={false}
                config={{
                  youtube: {
                    playerVars: { 
                      showinfo: 1,
                      modestbranding: 1,
                      rel: 0
                    }
                  }
                }}
              />
            </div>
            <h1 className="text-xl font-bold mt-3">{videoData?.title}</h1>
          </div>
        </div>
        <div className="lg:w-[40%] bg-black/20">
          <PlayList />
        </div>
      </div>
    </div>
  );
}
