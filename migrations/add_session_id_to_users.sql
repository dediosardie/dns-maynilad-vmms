-- Add session_id column to users table for single device login enforcement
-- This migration adds a session_id field to track active sessions and prevent multiple device logins

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS session_id TEXT;

-- Create index for faster session_id lookups
CREATE INDEX IF NOT EXISTS idx_users_session_id ON users(session_id);

-- Add comment to explain the column purpose
COMMENT ON COLUMN users.session_id IS 'Stores the current active session token to prevent multiple device logins';
