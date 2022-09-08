/*
  Warnings:

  - You are about to drop the column `seed` on the `bets` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `bets` table. All the data in the column will be lost.
  - Added the required column `amount` to the `bets` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "roundId" TEXT NOT NULL,
    "colorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "bets_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "rounds" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bets_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "colors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_bets" ("colorId", "createdAt", "id", "roundId", "status", "updatedAt") SELECT "colorId", "createdAt", "id", "roundId", "status", "updatedAt" FROM "bets";
DROP TABLE "bets";
ALTER TABLE "new_bets" RENAME TO "bets";
CREATE UNIQUE INDEX "bets_id_key" ON "bets"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
