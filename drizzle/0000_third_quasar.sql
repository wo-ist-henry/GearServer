CREATE TABLE "gear" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gear_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"yearOfProduction" integer NOT NULL,
	"type" varchar(255) NOT NULL
);
