import { MigrationInterface, QueryRunner } from 'typeorm';

export class Chats1707569268027 implements MigrationInterface {
  name = 'Chats1707569268027';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "chats" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "channel" character varying, "message" character varying NOT NULL, "sender_id" integer, "receiver_id" integer, "game_id" integer, CONSTRAINT "pk_chats_id" PRIMARY KEY ("id"))'
    );
    await queryRunner.query(
      'CREATE INDEX "index_chats_channel" ON "chats" ("channel") '
    );
    await queryRunner.query(
      'ALTER TABLE "chats" ADD CONSTRAINT "fk_users_sender_id" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE "chats" ADD CONSTRAINT "fk_users_receiver_id" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE "chats" ADD CONSTRAINT "fk_games_game_id" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE SET NULL ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "chats" DROP CONSTRAINT "fk_games_game_id"'
    );
    await queryRunner.query(
      'ALTER TABLE "chats" DROP CONSTRAINT "fk_users_receiver_id"'
    );
    await queryRunner.query(
      'ALTER TABLE "chats" DROP CONSTRAINT "fk_users_sender_id"'
    );
    await queryRunner.query('DROP INDEX "public"."index_chats_channel"');
    await queryRunner.query('DROP TABLE "chats"');
  }
}
