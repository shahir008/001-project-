// ===============================
// SUPABASE CONFIG
// ===============================

const SUPABASE_URL =
"https://ocwgwbyuebabxsikqnmx.supabase.co";

const SUPABASE_KEY =
"sb_publishable_8YMkQW1DwtP_TPWak7KZng_Mv8ghRML";

const supabaseClient =
supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);

// ===============================
// CLOUDINARY CONFIG
// ===============================

const CLOUDINARY_CLOUD_NAME =
"pwze60kd";

const CLOUDINARY_UPLOAD_PRESET =
"qr_records";

// ===============================
// TABLE NAME
// ===============================

const DATABASE_TABLE =
"records";