CREATE TABLE "room" (
	"id"			INTEGER,
	"name"			TEXT NOT NULL UNIQUE,
	"description"	TEXT,
	"limit"			INTEGER,
	"password"		TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
