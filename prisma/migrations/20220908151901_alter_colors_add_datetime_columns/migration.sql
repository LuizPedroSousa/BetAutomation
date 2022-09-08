/*
  Warnings:

  - Added the required column `updatedAt` to the `colors` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_colors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "betColorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "colors_betColorId_fkey" FOREIGN KEY ("betColorId") REFERENCES "bet_colors" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_colors" ("betColorId", "id", "name", "number") SELECT "betColorId", "id", "name", "number" FROM "colors";
DROP TABLE "colors";
ALTER TABLE "new_colors" RENAME TO "colors";
CREATE UNIQUE INDEX "colors_id_key" ON "colors"("id");
CREATE TABLE "new_rounds" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seed" TEXT NOT NULL,
    "colorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "rounds_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "colors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_rounds" ("colorId", "createdAt", "id", "seed", "updatedAt") SELECT "colorId", "createdAt", "id", "seed", "updatedAt" FROM "rounds";
DROP TABLE "rounds";
ALTER TABLE "new_rounds" RENAME TO "rounds";
CREATE UNIQUE INDEX "rounds_id_key" ON "rounds"("id");
CREATE UNIQUE INDEX "rounds_seed_key" ON "rounds"("seed");
CREATE TABLE "new_bet_colors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_bet_colors" ("amount", "createdAt", "id", "updatedAt") SELECT "amount", "createdAt", "id", "updatedAt" FROM "bet_colors";
DROP TABLE "bet_colors";
ALTER TABLE "new_bet_colors" RENAME TO "bet_colors";
CREATE UNIQUE INDEX "bet_colors_id_key" ON "bet_colors"("id");
CREATE TABLE "new_bets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seed" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "roundId" TEXT NOT NULL,
    "betColorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "bets_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "rounds" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bets_betColorId_fkey" FOREIGN KEY ("betColorId") REFERENCES "bet_colors" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_bets" ("betColorId", "createdAt", "id", "roundId", "seed", "total", "updatedAt") SELECT "betColorId", "createdAt", "id", "roundId", "seed", "total", "updatedAt" FROM "bets";
DROP TABLE "bets";
ALTER TABLE "new_bets" RENAME TO "bets";
CREATE UNIQUE INDEX "bets_id_key" ON "bets"("id");
CREATE UNIQUE INDEX "bets_seed_key" ON "bets"("seed");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
