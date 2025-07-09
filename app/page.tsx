"use client";
import React from "react";
import Text from "@/components/pages/Text";
import { SessionProvider } from "next-auth/react";

const page = () => {
  return (
    <SessionProvider>
      <Text />
    </SessionProvider>
  );
};

export default page;
