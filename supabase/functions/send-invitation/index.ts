
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  invitee_email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the user from the JWT token
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const { invitee_email }: InvitationRequest = await req.json();

    // Check if user can send invitation
    const { data: canSend, error: canSendError } = await supabaseClient
      .rpc('can_send_invitation', { user_id: user.id, email: invitee_email });

    if (canSendError || !canSend) {
      console.error('Cannot send invitation:', canSendError);
      return new Response(JSON.stringify({ 
        error: 'Cannot send invitation. You may have reached your monthly limit, the email is already invited, or the user already exists.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Create the invitation record
    const { data: invitation, error: insertError } = await supabaseClient
      .from('invitations')
      .insert({
        inviter_id: user.id,
        invitee_email: invitee_email,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating invitation:', insertError);
      return new Response(JSON.stringify({ error: 'Failed to create invitation' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Get inviter's profile for the email
    const { data: profile } = await supabaseClient
      .from('user_profiles')
      .select('username')
      .eq('user_id', user.id)
      .single();

    const inviterName = profile?.username || user.email?.split('@')[0] || 'Someone';
    const inviteUrl = `${Deno.env.get('SITE_URL') || 'https://circles.lovable.app'}/signup?invite=${invitation.invitation_token}`;

    // Send invitation email
    const emailResponse = await resend.emails.send({
      from: "Circles <onboarding@resend.dev>",
      to: [invitee_email],
      subject: `${inviterName} invited you to join Circles`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center; margin-bottom: 30px;">You're invited to join Circles!</h1>
          
          <p style="color: #555; font-size: 16px; line-height: 1.5;">
            Hi there! <strong>${inviterName}</strong> has invited you to join Circles, a platform for creating meaningful connections through shared interests.
          </p>
          
          <p style="color: #555; font-size: 16px; line-height: 1.5;">
            Circles helps you find like-minded people in your area through interest-based groups, while maintaining your privacy and anonymity.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${inviteUrl}" style="background-color: #3B82F6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Accept Invitation
            </a>
          </div>
          
          <p style="color: #888; font-size: 14px; text-align: center;">
            This invitation will expire in 7 days.
          </p>
          
          <p style="color: #888; font-size: 12px; text-align: center; margin-top: 30px;">
            If you don't want to receive these emails, you can safely ignore this message.
          </p>
        </div>
      `,
    });

    console.log("Invitation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Invitation sent successfully',
      invitation_id: invitation.id 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in send-invitation function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
