import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEthereumCurrency1709007806066 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO currency (code, symbol, symbol_native, name) VALUES ('eth', 'ETH', 'Ξ', 'Ethereum')`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM currency WHERE code = 'eth'`
        );
    }

}
