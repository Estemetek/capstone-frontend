// src/services/upload.ts
import { supabase } from "../supabaseClient";
import { v4 as uuidv4 } from "uuid";

/**
 * Upload an image file to Supabase Storage and return the public URL.
 */
export async function uploadImageToSupabase(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `donations/${fileName}`;

  const { error } = await supabase.storage
    .from("donation-images") // 👈 bucket name (create this in Supabase dashboard)
    .upload(filePath, file);

  if (error) {
    console.error("❌ Supabase upload error:", error);
    throw error;
  }

  // ✅ Get public URL
  const { data } = supabase.storage.from("donation-images").getPublicUrl(filePath);

  return data.publicUrl;
}
