-- Create payment database (startech_user is created via POSTGRES_DB)
SELECT 'CREATE DATABASE startech_payment'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'startech_payment')\gexec
