import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export default class AlterIdToScoresAndMarkings1709217350361
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'scores',
      'id',
      new TableColumn({
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        generationStrategy: 'uuid',
        default: 'uuid_generate_v4()',
    }));

    await queryRunner.changeColumn(
      'markings',
      'id',
      new TableColumn({
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        generationStrategy: 'uuid',
        default: 'uuid_generate_v4()',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'scores',
      'id',
      new TableColumn({
        name: 'id',
        type: 'uuid',
        isPrimary: true,
    }));

    await queryRunner.changeColumn(
      'markings',
      'id',
      new TableColumn({
        name: 'id',
        type: 'uuid',
        isPrimary: true,
    }));
  }
}
