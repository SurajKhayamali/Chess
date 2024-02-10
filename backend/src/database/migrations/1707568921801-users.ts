import { MigrationInterface, QueryRunner } from 'typeorm';

export class Users1707568921801 implements MigrationInterface {
  name = 'Users1707568921801';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "first_name" character varying NOT NULL, "middle_name" character varying, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "unique_users_email" UNIQUE ("email"), CONSTRAINT "unique_users_username" UNIQUE ("username"), CONSTRAINT "pk_users_id" PRIMARY KEY ("id"))'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "users"');
  }
}
