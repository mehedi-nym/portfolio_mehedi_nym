import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function submitContactMessage(payload: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const { error } = await supabase.from("contact_messages").insert([
    {
      name: payload.name,
      email: payload.email,
      subject: payload.subject || null,
      message: payload.message,
    },
  ]);

  if (error) throw error;
}