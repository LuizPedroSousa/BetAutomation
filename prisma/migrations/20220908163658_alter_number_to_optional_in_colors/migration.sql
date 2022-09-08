-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_colors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "number" INTEGER,
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
