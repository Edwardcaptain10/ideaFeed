import React, { useState } from "react";
import Avatar from "./Avatar";
import { CATEGORIES } from "../constants";
import { supabase } from "../lib/supabaseClient";

export default function ComposeBox({ profile, onPosted }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [ask, setAsk] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!title.trim() || !ask || Number(ask) <= 0) {
      setError("Add an idea name and a funding ask above zero.");
      return;
    }
    setError("");
    setLoading(true);

    const { data, error: insertError } = await supabase
      .from("ideas")
      .insert({
        author_id: profile.id,
        title: title.trim(),
        body: body.trim(),
        category,
        ask: Number(ask),
      })
      .select()
      .single();

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    onPosted(data);
    setTitle("");
    setBody("");
    setAsk("");
    setOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#DADDE1] p-3 sm:p-4">
      {!open ? (
        <button onClick={() => setOpen(true)} className="w-full flex items-center gap-3 text-left">
          <Avatar name={profile.name} size={40} />
          <span className="flex-1 bg-[#F0F2F5] hover:bg-[#E4E6E9] rounded-full px-4 py-2.5 text-[#65676B] text-sm">
            Post an idea that needs funding…
          </span>
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Avatar name={profile.name} size={40} />
            <span className="font-medium text-[#050505] text-sm">{profile.name}</span>
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Idea name"
            className="w-full border border-[#DADDE1] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#1877F2]"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What it does, who it's for, why now"
            rows={3}
            className="w-full border border-[#DADDE1] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#1877F2] resize-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-[#DADDE1] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#1877F2]"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <input
              value={ask}
              onChange={(e) => setAsk(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="Funding ask (USD)"
              inputMode="numeric"
              className="border border-[#DADDE1] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#1877F2]"
            />
          </div>
          {error && <p className="text-sm text-[#E41E3F]">{error}</p>}
          <div className="flex items-center justify-between pt-1">
            <button onClick={() => setOpen(false)} className="text-sm text-[#65676B] px-3 py-1.5">
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={loading}
              className="bg-[#1877F2] hover:bg-[#166FE5] disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-md"
            >
              {loading ? "Posting…" : "Post"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
