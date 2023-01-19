CREATE TABLE "room" (
	"id"			INTEGER,
	"name"			TEXT NOT NULL UNIQUE,
	"description"	TEXT NOT NULL,
	"limit"			INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
