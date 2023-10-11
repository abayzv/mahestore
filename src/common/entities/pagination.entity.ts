import { Expose } from 'class-transformer';

export class PaginationEntity {

    @Expose()
    page: number;

    @Expose()
    pageSize: number;

    @Expose()
    totalPages: number;

    @Expose()
    totalRecords: number;

    constructor(partial: Partial<PaginationEntity>) {
        Object.assign(this, partial);
    }
}