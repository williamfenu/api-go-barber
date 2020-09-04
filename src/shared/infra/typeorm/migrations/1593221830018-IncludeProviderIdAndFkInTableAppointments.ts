import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export default class IncludeProviderIdAndFkInTableAppointments1593221830018
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.createForeignKey(
            'appointments',
            new TableForeignKey({
                name: 'FK_APPOINTMENT_USER',
                columnNames: ['provider_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropForeignKey('appointments', 'FK_APPOINTMENT_USER');
    }
}
