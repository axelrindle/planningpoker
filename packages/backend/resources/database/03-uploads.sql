CREATE TABLE "upload" (
	"id"	INTEGER,
	"hash"	TEXT NOT NULL UNIQUE,
	"name"	TEXT,
	"type"	TEXT,
	"size"	INTEGER,
	"sub"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
