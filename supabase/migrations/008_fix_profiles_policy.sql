-- Avoid recursive policies on profiles (admin uses service role)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
  ) THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles';
  END IF;
END $$;
