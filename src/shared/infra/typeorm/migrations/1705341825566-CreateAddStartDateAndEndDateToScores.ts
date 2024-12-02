import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export default class CreateAddStartDateAndEndDateToScores1705341825566 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('scores',
      [
        new TableColumn({
          name: 'start_date',
          type: 'timestamp',
          isNullable: true,
        }),
        new TableColumn({
          name: 'end_date',
          type: 'timestamp',
          isNullable: true,
        }),
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('scores', ['start_date', 'end_date']);
  }
}
