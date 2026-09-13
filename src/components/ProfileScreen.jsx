import React from "react";
import Avatar from "./Avatar";
import { formatMoney } from "../constants";

export default function ProfileScreen({ profile, ideas, pledges, onBack }) {
  const myIdeas = ideas.filter((i) => i.author_id === profile.id);
  const myPledges = pledges.filter((p) => p.investor_id === profile.id);
  const totalRaised = myIdeas.reduce((sum, i) => sum + Number(i.raised), 0);
  const totalPledged = myPledges.reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <main className="max-w-xl mx-auto py-6 px-3 sm:px-0">
      <button onClick={onBack} className="text-sm text-[#1877F2] font-medium mb-4">
        ← Back to feed
      </button>
      <div className="bg-white rounded-lg shadow-sm border border-[#DADDE1] p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <Avatar name={profile.name} size={64} />
          <div>
            <p className="font-semibold text-[#050505] text-xl">{profile.name}</p>
            <p className="text-sm text-[#65676B] capitalize">{profile.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          {profile.role === "entrepreneur" ? (
            <>
              <div className="bg-[#F0F2F5] rounded-md p-4">
                <p className="text-2xl font-semibold text-[#050505]">{myIdeas.length}</p>
                <p className="text-xs text-[#65676B] mt-0.5">Ideas posted</p>
              </div>
              <div className="bg-[#F0F2F5] rounded-md p-4">
                <p className="text-2xl font-semibold text-[#050505]">{formatMoney(totalRaised)}</p>
                <p className="text-xs text-[#65676B] mt-0.5">Total raised</p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-[#F0F2F5] rounded-md p-4">
                <p className="text-2xl font-semibold text-[#050505]">{myPledges.length}</p>
                <p className="text-xs text-[#65676B] mt-0.5">Ideas backed</p>
              </div>
              <div className="bg-[#F0F2F5] rounded-md p-4">
                <p className="text-2xl font-semibold text-[#050505]">{formatMoney(totalPledged)}</p>
                <p className="text-xs text-[#65676B] mt-0.5">Total pledged</p>
              </div>
            </>
          )}
        </div>

        {profile.role === "entrepreneur" && myIdeas.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-[#050505] mb-2">Your ideas</p>
            <div className="space-y-2">
              {myIdeas.map((i) => (
                <div key={i.id} className="flex items-center justify-between text-sm border-b border-[#F0F2F5] pb-2">
                  <span className="text-[#050505]">{i.title}</span>
                  <span className="text-[#65676B]">{formatMoney(i.raised)} / {formatMoney(i.ask)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {profile.role === "investor" && myPledges.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-[#050505] mb-2">Your pledges</p>
            <div className="space-y-2">
              {myPledges.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm border-b border-[#F0F2F5] pb-2">
                  <span className="text-[#050505]">{p.ideaTitle}</span>
                  <span className="text-[#65676B]">{formatMoney(p.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
