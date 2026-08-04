-- Google OAuth users have no password, so this column must accept NULL.
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;
