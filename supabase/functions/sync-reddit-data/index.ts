
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const { user_id, reddit_token, user_metadata } = await req.json();
    if (!user_id || !reddit_token) {
      return new Response(JSON.stringify({ error: "Missing user_id or token" }), { status: 400, headers: corsHeaders });
    }

    // Fetch subreddits
    const subr = await fetch("https://oauth.reddit.com/subreddits/mine/subscriber", {
      headers: {
        "Authorization": `Bearer ${reddit_token}`,
        "User-Agent": "CozyCircles/1.0"
      }
    });
    const subredditsData = await subr.json();
    const subredditTags = subredditsData.data?.children?.map((sub: any) => 
      sub.data.display_name.toLowerCase()
    ).slice(0, 20) || [];

    // Fetch reddit karma
    const userResp = await fetch("https://oauth.reddit.com/api/v1/me", {
      headers: {
        "Authorization": `Bearer ${reddit_token}`,
        "User-Agent": "CozyCircles/1.0"
      }
    });
    let karma = 0;
    let redditName = user_metadata?.user_name || user_metadata?.name || "RedditUser";
    if (userResp.ok) {
      const userData = await userResp.json();
      karma = (userData.link_karma || 0) + (userData.comment_karma || 0);
      redditName = userData.name || redditName;
    }

    // Update user_profiles
    const profileData = {
      user_id,
      username: redditName,
      selected_tags: subredditTags,
      reddit_karma: karma,
      updated_at: new Date().toISOString()
    };

    // Upsert
    await supabase.from("user_profiles").upsert([profileData], { onConflict: "user_id" });
    return new Response(JSON.stringify({ ok: true, tags: subredditTags, karma }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("sync-reddit-data error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
