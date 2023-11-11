import { type MigrationInterface, type QueryRunner } from "typeorm";

export class OAuthMigration1699683366973 implements MigrationInterface {
  name = "OAuthMigration1699683366973";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`authProviders\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`title\` varchar(255) NOT NULL,
        \`canLogin\` tinyint NOT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      `CREATE TABLE \`oauthIntegrations\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`externalId\` varchar(255) NOT NULL,
        \`accessToken\` varchar(255) NOT NULL,
        \`refreshToken\` varchar(255) NOT NULL,
        \`expireAt\` datetime NOT NULL,
        \`authProviderId\` int NOT NULL,
        \`userId\` int NOT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      `ALTER TABLE \`oauthIntegrations\`
        ADD CONSTRAINT \`FK_a21b232b9c0cf0016d2f864d444\`
        FOREIGN KEY (\`authProviderId\`)
        REFERENCES \`authProviders\`(\`id\`)
        ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE \`oauthIntegrations\`
        ADD CONSTRAINT \`FK_6080ec232dc4db7b50a080d456a\`
        FOREIGN KEY (\`userId\`)
        REFERENCES \`users\`(\`id\`)
        ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`oauthIntegrations\`
        DROP FOREIGN KEY \`FK_6080ec232dc4db7b50a080d456a\``,
    );

    await queryRunner.query(
      `ALTER TABLE \`oauthIntegrations\` 
        DROP FOREIGN KEY \`FK_a21b232b9c0cf0016d2f864d444\``,
    );

    await queryRunner.query(`DROP TABLE \`oauthIntegrations\``);
    await queryRunner.query(`DROP TABLE \`authProviders\``);
  }
}
