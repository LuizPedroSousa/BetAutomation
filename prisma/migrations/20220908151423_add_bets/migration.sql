-- CreateTable
CREATE TABLE "bet_colors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "bets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seed" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "roundId" TEXT NOT NULL,
    "betColorId" TEXT,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "bets_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "rounds" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bets_betColorId_fkey" FOREIGN KEY ("betColorId") REFERENCES "bet_colors" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_colors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "betColorId" TEXT,
    CONSTRAINT "colors_betColorId_fkey" FOREIGN KEY ("betColorId") REFERENCES "bet_colors" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_colors" ("id", "name", "number") SELECT "id", "name", "number" FROM "colors";
DROP TABLE "colors";
ALTER TABLE "new_colors" RENAME TO "colors";
CREATE UNIQUE INDEX "colors_id_key" ON "colors"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "bet_colors_id_key" ON "bet_colors"("id");

-- CreateIndex
CREATE UNIQUE INDEX "bets_id_key" ON "bets"("id");

-- CreateIndex
CREATE UNIQUE INDEX "bets_seed_key" ON "bets"("seed");
