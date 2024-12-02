import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export default class AddProducerIdToScores1709387877838
  implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn(
        'scores',
        new TableColumn({
          name: 'producer_id',
          type: 'uuid',
          isNullable: true,
        }),
      );

      await queryRunner.createForeignKey(
        'scores',
        new TableForeignKey({
          name: 'FKScoreProducer',
          referencedTableName: 'producers',
          referencedColumnNames: ['id'],
          columnNames: ['producer_id'],
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }),
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropForeignKey('scores', 'FKScoreProducer');

      await queryRunner.dropForeignKey('scores', 'producer_id');
    }
}
