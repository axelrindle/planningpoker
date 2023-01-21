CREATE TABLE "upload" (
	"id"	INTEGER,
	"hash"	TEXT NOT NULL UNIQUE,
	"name"	TEXT,
	"type"	TEXT,
	"size"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
