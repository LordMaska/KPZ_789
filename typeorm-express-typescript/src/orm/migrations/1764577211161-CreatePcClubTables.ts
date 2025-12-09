import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePcClubTables1764577211161 implements MigrationInterface {
  name = 'CreatePcClubTables1764577211161';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "pc" (
                "pc_id" SERIAL NOT NULL,
                "cpu" character varying(120) NOT NULL,
                "ram" integer NOT NULL,
                "videocard" character varying(120) NOT NULL,
                "hard_disc" character varying(30) NOT NULL,
                "usb_amout" integer NOT NULL,
                "os" character varying(50) NOT NULL,
                "buy_date" date NOT NULL,
                CONSTRAINT "PK_e1db5dd65746c5fa6e6d2f70041" PRIMARY KEY ("pc_id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "sessions" (
                "session_id" SERIAL NOT NULL,
                "pc_id" integer NOT NULL,
                "client_phone" character varying(15) NOT NULL,
                "time" TIMESTAMP NOT NULL,
                "duration" interval NOT NULL,
                "cost" money NOT NULL,
                CONSTRAINT "PK_9340188c93349808f10d1db74a8" PRIMARY KEY ("session_id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "client" (
                "phone" character varying(15) NOT NULL,
                "full_name" character varying(155) NOT NULL,
                "birth" date NOT NULL,
                CONSTRAINT "PK_368ca99acdbd5502fc08b3f7796" PRIMARY KEY ("phone")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "sessions"
            ADD CONSTRAINT "FK_226c72db7029872ab912858606e" FOREIGN KEY ("pc_id") REFERENCES "pc"("pc_id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "sessions"
            ADD CONSTRAINT "FK_38b1042f790763f859c45460a7b" FOREIGN KEY ("client_phone") REFERENCES "client"("phone") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "sessions" DROP CONSTRAINT "FK_38b1042f790763f859c45460a7b"
        `);
    await queryRunner.query(`
            ALTER TABLE "sessions" DROP CONSTRAINT "FK_226c72db7029872ab912858606e"
        `);
    await queryRunner.query(`
            DROP TABLE "client"
        `);
    await queryRunner.query(`
            DROP TABLE "sessions"
        `);
    await queryRunner.query(`
            DROP TABLE "pc"
        `);
  }
}
