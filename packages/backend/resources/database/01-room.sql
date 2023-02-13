CREATE TABLE "room" (
	"id"			INTEGER,
	"name"			TEXT NOT NULL UNIQUE,
	"description"	TEXT,
	"userLimit"			INTEGER,
	"password"		TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
