import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export default class CreateSequenceToMarkings1705341891026 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('markings',
      new TableColumn({
        name: 'sequence',
        type: 'decimal',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('markings', 'sequence');
  }
}
