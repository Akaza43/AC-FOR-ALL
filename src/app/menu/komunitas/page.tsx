"use client";
import React, { useEffect, useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";

interface UserRoles {
  roles: {
    id: string;
    name: string;
    color: string;
  }[];
}

export interface GridItem {
  id: string;
  name: string;
  color: string;
}

export default function KomunitasPage() {
  const [roles, setRoles] = useState<UserRoles["roles"]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("/api/verify-role");
        if (response.ok) {
          const data: UserRoles = await response.json();
          setRoles(data.roles || []);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
      {/* Warning Message */}
      <div className="bg-black p-8 rounded-xl shadow-2xl text-center animate-fade-in mb-8">
        <AiOutlineInfoCircle className="text-5xl text-red-500 mx-auto mb-6 animate-pulse" />
        <h2 className="text-2xl font-extrabold text-white mb-4">
          App ini bersifat private
        </h2>
        <p className="text-gray-300 text-lg">
          Ini adalah aplikasi private yang hanya bisa diakses oleh member tertentu saja.
        </p>
      </div>

      {/* Roles Section */}
      <div className="bg-black rounded-xl p-6 border border-gray-900 hover:border-purple-500/50 transition-all duration-300 w-full max-w-4xl">
        <h2 className="text-xl font-bold text-purple-500 mb-6 text-center">
          Discord Roles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-black/40 hover:bg-black/60 transition-all duration-300 border border-gray-900"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                style={{ backgroundColor: role.color }}
              >
                {role.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-200">
                  {role.name}
                </h3>
                <p className="text-sm text-gray-400">Role ID: {role.id}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
