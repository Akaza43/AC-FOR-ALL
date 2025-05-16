"use client";
import { useSession } from "next-auth/react";
import { Data } from "./container/data";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import Loading from '@/ui/loading';
import { useSearchParams } from 'next/navigation';

export default function VideoPage() {
  const { data: session, status } = useSession();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const currentVideoId = searchParams?.get('id') || "";

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

  useEffect(() => {
    const savedBookmarks = localStorage.getItem("tradingBookmarks");
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  const toggleBookmark = (title: string) => {
    const updatedBookmarks = bookmarks.includes(title)
      ? bookmarks.filter((b) => b !== title)
      : [...bookmarks, title];

    setBookmarks(updatedBookmarks);
    localStorage.setItem("tradingBookmarks", JSON.stringify(updatedBookmarks));
  };

  const getYouTubeThumbnail = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop()?.split("?")[0];
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  if (loading || status === "loading") {
    return <Loading />;
  }

  if (!session || !hasAccess) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="flex flex-col w-full gap-1.5 p-1.5 sm:gap-4 sm:p-4">
        {Data.map((item) => (
          <div key={item.id} className="group relative h-[60px] sm:h-[100px] w-full">
            <div className="rounded-lg sm:rounded-xl transition-all duration-300 h-full w-full">
              <Link href={item.link} className="block relative h-full">
                <div className="relative w-full h-full flex">
                  <div className="relative w-[100px] sm:w-[180px] h-full bg-black rounded-l-lg sm:rounded-l-xl overflow-hidden shrink-0 hidden [@media(min-width:261px)]:block">
                    <img
                      src={getYouTubeThumbnail(item.yt)}
                      alt={item.title}
                      className="rounded-l-lg sm:rounded-l-xl w-full h-full object-cover"
                    />
                  </div>
                  <div className="relative flex-1 min-w-0 bg-black rounded-r-lg sm:rounded-r-xl p-1.5 sm:p-4 flex items-center border border-gray-900 w-auto">
                    <div className="flex flex-col pr-6 sm:pr-8 min-w-0 w-full">
                      <h3
                        className={`text-xs sm:text-base font-bold line-clamp-2 ${
                          item.id === currentVideoId ? 'text-purple-500' : 'text-gray-200 group-hover:text-purple-500'
                        } transition-colors`}
                      >
                        {item.title}
                      </h3>
                    </div>
                    <div className="absolute right-1.5 sm:right-4 top-1/2 -translate-y-1/2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleBookmark(item.title);
                        }}
                        className="p-0.5 sm:p-1 transition-all duration-300"
                      >
                        {bookmarks.includes(item.title) ? (
                          <FaBookmark className="text-purple-500 text-xs sm:text-base" />
                        ) : (
                          <FaRegBookmark className="text-gray-400 text-xs sm:text-base" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
