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
    "status" TEXT NOT NULL DEFAULT 'pending',
    CONSTRAINT "bets_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "rounds" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bets_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "colors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_bets" ("colorId", "createdAt", "id", "roundId", "seed", "total", "updatedAt") SELECT "colorId", "createdAt", "id", "roundId", "seed", "total", "updatedAt" FROM "bets";
DROP TABLE "bets";
ALTER TABLE "new_bets" RENAME TO "bets";
CREATE UNIQUE INDEX "bets_id_key" ON "bets"("id");
CREATE UNIQUE INDEX "bets_seed_key" ON "bets"("seed");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
