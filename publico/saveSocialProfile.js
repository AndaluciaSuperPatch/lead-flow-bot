import { supabase } from "./supabaseClient";
import type { Database } from "./supabaseClient"; // Assuming you have Database types defined

type SocialProfile = {
  platform: string;
  account_id: string;
  access_token: string;
  user_id?: string; // Optional: associate with authenticated user
};

export async function saveSocialProfile(
  profile: SocialProfile
): Promise<{ data?: any; error?: Error }> {
  try {
    // Validate input
    if (!profile.platform || !profile.account_id || !profile.access_token) {
      throw new Error("Missing required profile information");
    }

    // Get current user session (if needed)
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('social_accounts')
      .insert({
        ...profile,
        user_id: user?.id, // Associate with current user if available
        is_active: true,
        last_sync: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
      .select(); // Return the inserted record

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    return { data };
  } catch (error) {
    console.error('Error saving social profile:', error);
    return { error: error instanceof Error ? error : new Error(String(error)) };
  }
}

// Type-safe usage example:
// const { data, error } = await saveSocialProfile({
//   platform: 'instagram',
//   account_id: '123456789',
//   access_token: 'supersecret123'
// });
