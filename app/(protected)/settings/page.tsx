"use client";

import { useCurrentUser } from "@/hooks/user-current-user";
import { signOut } from "next-auth/react";
import { NavBar } from "../_components/navbar";

const SettingsPage = () => {
  const session = useCurrentUser();

  const onClick = () => {
    signOut();
  };

  return (
    <div className="bg-white p-10 rounded-xl">
      <button onClick={onClick}>Sign out</button>
    </div>
  );
};

export default SettingsPage;
