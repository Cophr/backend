import type { MigrationInterface, QueryRunner } from "typeorm";

export class UserInitMigration1685726623031 implements MigrationInterface {
  name = "UserInitMigration1685726623031";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`email\` varchar(255) NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`account\` varchar(255) NOT NULL,
        \`password\` varchar(60) NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`),
        UNIQUE INDEX \`IDX_dd44b05034165835d6dcc18d68\` (\`account\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_dd44b05034165835d6dcc18d68\` ON \`users\``,
    );

    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );

    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
