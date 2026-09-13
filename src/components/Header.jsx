import React, { useState } from "react";
import { Sprout, Search, Bell, User, LogOut } from "lucide-react";
import Avatar from "./Avatar";
import { supabase } from "../lib/supabaseClient";

export default function Header({ profile, onProfile }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-white border-b border-[#DADDE1] sticky top-0 z-20">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-3 sm:px-4 py-2">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-full bg-[#1877F2] flex items-center justify-center">
            <Sprout size={18} className="text-white" />
          </div>
          <span className="font-semibold text-[#1877F2] text-lg hidden sm:inline">IdeaFeed</span>
        </div>

        <div className="flex-1 max-w-xs mx-3">
          <div className="flex items-center gap-2 bg-[#F0F2F5] rounded-full px-3 py-1.5">
            <Search size={16} className="text-[#65676B]" />
            <input
              placeholder="Search ideas or investors"
              className="bg-transparent text-sm outline-none w-full text-[#050505] placeholder-[#65676B]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 relative">
          <button className="w-9 h-9 rounded-full bg-[#F0F2F5] flex items-center justify-center">
            <Bell size={18} className="text-[#050505]" />
          </button>
          <button onClick={() => setMenuOpen((v) => !v)}>
            <Avatar name={profile.name} size={32} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-11 bg-white border border-[#DADDE1] rounded-md shadow-md w-56 py-1.5 text-sm">
              <div className="px-3 py-2 border-b border-[#DADDE1]">
                <p className="font-medium text-[#050505]">{profile.name}</p>
                <p className="text-xs text-[#65676B] capitalize">{profile.role}</p>
              </div>
              <button
                onClick={() => { setMenuOpen(false); onProfile(); }}
                className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-[#F0F2F5] text-[#050505]"
              >
                <User size={15} /> View profile
              </button>
              <button
                onClick={logout}
                className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-[#F0F2F5] text-[#E41E3F]"
              >
                <LogOut size={15} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
