import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddNfeToScores1709442485329
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'scores',
      new TableColumn({
        name: 'nfe',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('scores', 'nfe');
  }
}
