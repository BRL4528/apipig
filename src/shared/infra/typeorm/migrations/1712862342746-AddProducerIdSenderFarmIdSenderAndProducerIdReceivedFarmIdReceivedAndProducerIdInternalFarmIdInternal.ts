import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export default class AddProducerIdSenderFarmIdSenderAndProducerIdReceivedFarmIdReceivedAndProducerIdInternalFarmIdInternal1712862342746
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'scores',
      'farm_id',
      new TableColumn({
        name: 'farm_id_sender',
        type: 'varchar',
        isNullable: true,
      }),
    );
    await queryRunner.changeColumn(
      'scores',
      'producer_id',
      new TableColumn({
        name: 'producer_id_sender',
        type: 'varchar',
        isNullable: true,
      }),
    );
    await queryRunner.addColumns(
      'scores',
      [
        new TableColumn({
          name: 'farm_id_received',
          type: 'varchar',
          isNullable: true,
        }),
        new TableColumn({
          name: 'producer_id_received',
          type: 'varchar',
          isNullable: true,
        }),
        new TableColumn({
          name: 'farm_id_internal',
          type: 'varchar',
          isNullable: true,
        }),
        new TableColumn({
          name: 'producer_id_internal',
          type: 'varchar',
          isNullable: true,
        }),
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns(
      'scores',
      [
        'farm_id_sender',
        'producer_id_sender',
        'farm_id_received',
        'farm_id_received',
        'producer_id_internal',
        'producer_id_internal',
      ]);
  }
}
