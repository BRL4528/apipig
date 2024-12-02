import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export default class AddStatusToScoresAndStatusToMarkings1706108619894
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'scores',
      new TableColumn({
        name: 'status',
        type: 'boolean',
        default: false,
      }),
    );

    await queryRunner.addColumn(
      'markings',
      new TableColumn({
        name: 'status',
        type: 'boolean',
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('scores', 'status');

    await queryRunner.dropColumn('markings', 'status');
  }
}
