CREATE TABLE "room" (
	"id"			INTEGER,
	"name"			TEXT NOT NULL UNIQUE,
	"description"	TEXT,
	"limit"			INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
