import { MigrationInterface, QueryRunner } from 'typeorm';

export class Games1707569080686 implements MigrationInterface {
  name = 'Games1707569080686';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TYPE "public"."games_mode_enum" AS ENUM(\'PvP\', \'PvC\')'
    );
    await queryRunner.query(
      'CREATE TABLE "games" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "slug" character varying NOT NULL, "mode" "public"."games_mode_enum" NOT NULL DEFAULT \'PvP\', "time_limit" integer, "pgn" character varying NOT NULL, "is_over" boolean NOT NULL, "has_white_player_won" boolean, "white_player_id" integer, "black_player_id" integer, CONSTRAINT "unique_games_slug" UNIQUE ("slug"), CONSTRAINT "pk_games_id" PRIMARY KEY ("id"))'
    );
    await queryRunner.query(
      'ALTER TABLE "games" ADD CONSTRAINT "fk_users_white_player_id" FOREIGN KEY ("white_player_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE "games" ADD CONSTRAINT "fk_users_black_player_id" FOREIGN KEY ("black_player_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "games" DROP CONSTRAINT "fk_users_black_player_id"'
    );
    await queryRunner.query(
      'ALTER TABLE "games" DROP CONSTRAINT "fk_users_white_player_id"'
    );
    await queryRunner.query('DROP TABLE "games"');
    await queryRunner.query('DROP TYPE "public"."games_mode_enum"');
  }
}
