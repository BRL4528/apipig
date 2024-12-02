import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export default class AddTypeToScores1709390886164
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'scores',
      new TableColumn({
        name: 'type',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('scores', 'type');
  }
}
