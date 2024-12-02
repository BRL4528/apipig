import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export default class DropProducersAndToProducersAndAddProducerIdToScores1712664565747
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('producers');

    await queryRunner.addColumn(
      'scores',
      new TableColumn({
        name: 'producer_id',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('scores', 'producer_id');
  }
}
