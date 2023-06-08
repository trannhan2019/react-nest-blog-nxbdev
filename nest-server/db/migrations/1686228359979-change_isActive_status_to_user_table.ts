import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeIsActiveStatusToUserTable1686228359979 implements MigrationInterface {
    name = 'ChangeIsActiveStatusToUserTable1686228359979'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`isActive\` \`status\` int NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`status\` \`isActive\` int NOT NULL DEFAULT '1'`);
    }

}
