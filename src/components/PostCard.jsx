import React, { useState } from "react";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import Avatar from "./Avatar";
import { formatMoney } from "../constants";

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export default function PostCard({ idea, mode, onPledge }) {
  const [showComments, setShowComments] = useState((idea.pledges || []).length > 0);
  const [pledgeOpen, setPledgeOpen] = useState(false);
  const [pledgeAmount, setPledgeAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const pledges = idea.pledges || [];
  const pct = idea.ask ? Math.min(100, Math.round((idea.raised / idea.ask) * 100)) : 0;
  const remaining = Math.max(0, idea.ask - idea.raised);
  const authorName = idea.profiles?.name || "Someone";

  const submitPledge = async () => {
    const amt = Number(pledgeAmount);
    if (!amt || amt <= 0) return;
    setSubmitting(true);
    await onPledge(idea.id, Math.min(amt, remaining));
    setSubmitting(false);
    setPledgeAmount("");
    setPledgeOpen(false);
    setShowComments(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#DADDE1]">
      <div className="p-3 sm:p-4 pb-2 flex items-start gap-3">
        <Avatar name={authorName} size={40} />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-[#050505] text-sm leading-tight">{authorName}</p>
          <p className="text-xs text-[#65676B]">{timeAgo(idea.created_at)} · {idea.category}</p>
        </div>
      </div>

      <div className="px-3 sm:px-4 pb-3">
        <p className="text-[#050505] text-sm font-medium">{idea.title}</p>
        {idea.body && <p className="text-[#050505] text-sm mt-1 leading-relaxed">{idea.body}</p>}
      </div>

      <div className="mx-3 sm:mx-4 mb-3 rounded-md bg-[#F0F2F5] p-3">
        <div className="flex items-center justify-between text-sm mb-1.5">
          <span className="text-[#050505] font-medium">{formatMoney(idea.raised)} raised</span>
          <span className="text-[#65676B]">of {formatMoney(idea.ask)} asked</span>
        </div>
        <div className="h-1.5 bg-white rounded-full overflow-hidden">
          <div className="h-full bg-[#42B72A] transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {pledges.length > 0 && (
        <div className="px-3 sm:px-4 pb-1.5 flex items-center gap-1.5 text-xs text-[#65676B]">
          <span className="w-4 h-4 rounded-full bg-[#1877F2] flex items-center justify-center">
            <ThumbsUp size={9} className="text-white fill-white" />
          </span>
          {pledges.length} investor{pledges.length === 1 ? "" : "s"} interested
        </div>
      )}

      <div className="border-t border-[#DADDE1] mx-3 sm:mx-4" />

      <div className="px-2 sm:px-3 py-1 flex items-center justify-around text-sm">
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md hover:bg-[#F0F2F5] text-[#65676B] font-medium">
          <ThumbsUp size={16} />
          Interested
        </button>
        <button
          onClick={() => setShowComments((v) => !v)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md hover:bg-[#F0F2F5] text-[#65676B] font-medium"
        >
          <MessageCircle size={16} />
          Comment
        </button>
        {mode === "investor" && remaining > 0 ? (
          <button
            onClick={() => setPledgeOpen((v) => !v)}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md hover:bg-[#F0F2F5] text-[#65676B] font-medium"
          >
            <Share2 size={16} />
            Pledge
          </button>
        ) : (
          <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md hover:bg-[#F0F2F5] text-[#65676B] font-medium">
            <Share2 size={16} />
            Share
          </button>
        )}
      </div>

      {pledgeOpen && (
        <div className="border-t border-[#DADDE1] px-3 sm:px-4 py-3 flex items-center gap-2">
          <input
            value={pledgeAmount}
            onChange={(e) => setPledgeAmount(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder={`Up to ${formatMoney(remaining)}`}
            inputMode="numeric"
            className="flex-1 border border-[#DADDE1] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#1877F2]"
          />
          <button
            onClick={submitPledge}
            disabled={submitting}
            className="bg-[#1877F2] hover:bg-[#166FE5] disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-md"
          >
            {submitting ? "…" : "Confirm"}
          </button>
        </div>
      )}

      {showComments && pledges.length > 0 && (
        <div className="border-t border-[#DADDE1] px-3 sm:px-4 py-3 space-y-2.5">
          {pledges.map((p) => (
            <div key={p.id} className="flex items-start gap-2">
              <Avatar name={p.profiles?.name || "Investor"} size={28} />
              <div className="bg-[#F0F2F5] rounded-2xl px-3 py-1.5">
                <p className="text-xs font-medium text-[#050505]">{p.profiles?.name || "Investor"}</p>
                <p className="text-sm text-[#050505]">Pledging {formatMoney(p.amount)} — let's talk.</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
