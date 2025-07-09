"use client";
import React from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const Text = () => {
  const { data: session, status } = useSession();

  console.log(session, status);

  return (
    <div>
      <div className=" flex justify-center items-center h-screen w-full">
        <button
          className="border-2 border-black px-4 rounded-2xl py-3"
          onClick={() => {
            signOut();
          }}
        >
          singOut
        </button>
      </div>
    </div>
  );
};

export default Text;
