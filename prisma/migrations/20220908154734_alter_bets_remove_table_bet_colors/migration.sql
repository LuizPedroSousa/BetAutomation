/*
  Warnings:

  - You are about to drop the `bet_colors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `betColorId` on the `bets` table. All the data in the column will be lost.
  - Added the required column `colorId` to the `bets` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "bet_colors_id_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "bet_colors";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seed" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "roundId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "colorId" TEXT NOT NULL,
    CONSTRAINT "bets_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "rounds" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bets_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "colors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_bets" ("createdAt", "id", "roundId", "seed", "total", "updatedAt") SELECT "createdAt", "id", "roundId", "seed", "total", "updatedAt" FROM "bets";
DROP TABLE "bets";
ALTER TABLE "new_bets" RENAME TO "bets";
CREATE UNIQUE INDEX "bets_id_key" ON "bets"("id");
CREATE UNIQUE INDEX "bets_seed_key" ON "bets"("seed");
CREATE TABLE "new_colors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "betColorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_colors" ("betColorId", "createdAt", "id", "name", "number", "updatedAt") SELECT "betColorId", "createdAt", "id", "name", "number", "updatedAt" FROM "colors";
DROP TABLE "colors";
ALTER TABLE "new_colors" RENAME TO "colors";
CREATE UNIQUE INDEX "colors_id_key" ON "colors"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
