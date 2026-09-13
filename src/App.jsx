import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "./lib/supabaseClient";
import LoginScreen from "./components/LoginScreen";
import Header from "./components/Header";
import ProfileScreen from "./components/ProfileScreen";
import ComposeBox from "./components/ComposeBox";
import PostCard from "./components/PostCard";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";
import CategoryFilter from "./components/CategoryFilter";

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [screen, setScreen] = useState("feed"); // 'feed' | 'profile'
  const [ideas, setIdeas] = useState([]);
  const [pledges, setPledges] = useState([]); // flat list, for the logged-in investor's profile/sidebar
  const [categoryFilter, setCategoryFilter] = useState(null);

  // --- Auth session ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // --- Load profile once we have a session ---
  useEffect(() => {
    if (!session) {
      setProfile(null);
      setLoadingProfile(false);
      return;
    }
    setLoadingProfile(true);
    supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single()
      .then(({ data, error }) => {
        if (!error) setProfile(data);
        setLoadingProfile(false);
      });
  }, [session]);

  // --- Load ideas (with author + pledges joined) ---
  const loadIdeas = useCallback(async () => {
    const { data, error } = await supabase
      .from("ideas")
      .select("*, profiles(name), pledges(*, profiles(name))")
      .order("created_at", { ascending: false });
    if (!error && data) setIdeas(data);
  }, []);

  // --- Load this user's own pledges, for their profile/sidebar ---
  const loadMyPledges = useCallback(async () => {
    if (!profile || profile.role !== "investor") return;
    const { data, error } = await supabase
      .from("pledges")
      .select("*, ideas(title)")
      .eq("investor_id", profile.id)
      .order("created_at", { ascending: false });
    if (!error && data) {
      setPledges(data.map((p) => ({ ...p, ideaTitle: p.ideas?.title || "" })));
    }
  }, [profile]);

  useEffect(() => {
    if (!profile) return;
    loadIdeas();
    loadMyPledges();

    // Realtime: refresh whenever ideas or pledges change anywhere
    const channel = supabase
      .channel("public:feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "ideas" }, loadIdeas)
      .on("postgres_changes", { event: "*", schema: "public", table: "pledges" }, () => {
        loadIdeas();
        loadMyPledges();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [profile, loadIdeas, loadMyPledges]);

  const handlePosted = (newIdea) => {
    setIdeas((prev) => [{ ...newIdea, profiles: { name: profile.name }, pledges: [] }, ...prev]);
  };

  const handlePledge = async (ideaId, amount) => {
    await supabase.from("pledges").insert({
      idea_id: ideaId,
      investor_id: profile.id,
      amount,
    });
    // Realtime subscription above will refresh ideas + pledges,
    // but refresh immediately too so the UI feels instant.
    loadIdeas();
    loadMyPledges();
  };

  if (!session) return <LoginScreen />;
  if (loadingProfile) {
    return <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center text-[#65676B]">Loading…</div>;
  }
  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center text-[#65676B] text-center px-4">
        Couldn't find your profile. If you just signed up, confirm your email and refresh this page.
      </div>
    );
  }

  const visibleIdeas = categoryFilter ? ideas.filter((i) => i.category === categoryFilter) : ideas;

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans">
      <Header profile={profile} onProfile={() => setScreen("profile")} />

      {screen === "profile" ? (
        <ProfileScreen profile={profile} ideas={ideas} pledges={pledges} onBack={() => setScreen("feed")} />
      ) : (
        <div className="max-w-6xl mx-auto flex">
          <LeftSidebar role={profile.role} />
          <main className="flex-1 min-w-0 max-w-xl mx-auto py-4 px-3 sm:px-0 space-y-3">
            {profile.role === "entrepreneur" ? (
              <ComposeBox profile={profile} onPosted={handlePosted} />
            ) : (
              <CategoryFilter active={categoryFilter} onChange={setCategoryFilter} />
            )}
            {visibleIdeas.map((idea) => (
              <PostCard key={idea.id} idea={idea} mode={profile.role} onPledge={handlePledge} />
            ))}
          </main>
          <RightSidebar role={profile.role} pledges={pledges} />
        </div>
      )}
    </div>
  );
}
