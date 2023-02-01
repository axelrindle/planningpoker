CREATE TABLE "card" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL UNIQUE,
	"value"	INTEGER NOT NULL,
	"image" TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "preset" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "card_preset" (
	"id"	INTEGER,
	"card_id"	INTEGER NOT NULL,
	"preset_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	UNIQUE("card_id", "preset_id")
	FOREIGN KEY("preset_id") REFERENCES "preset"("id"),
	FOREIGN KEY("card_id") REFERENCES "card"("id")
);
