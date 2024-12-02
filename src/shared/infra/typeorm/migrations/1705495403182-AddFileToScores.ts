import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export default class AddFileToScores1705495403182 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'scores',
      new TableColumn({
        name: 'file',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('scores', 'file');
  }
}
