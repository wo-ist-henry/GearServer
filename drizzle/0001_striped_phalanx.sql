ALTER TABLE "user_gears" DROP CONSTRAINT "user_gears_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_gears" DROP CONSTRAINT "user_gears_gearId_gear_id_fk";
--> statement-breakpoint
ALTER TABLE "user_gears" ADD CONSTRAINT "user_gears_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_gears" ADD CONSTRAINT "user_gears_gearId_gear_id_fk" FOREIGN KEY ("gearId") REFERENCES "public"."gear"("id") ON DELETE cascade ON UPDATE no action;