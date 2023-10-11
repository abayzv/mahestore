import { Expose } from 'class-transformer';
import { PaginationEntity } from 'src/common/entities/pagination.entity';
import { OfficialStore } from './official-store.entity';

export class PageEntity {

    @Expose()
    page: number;

    @Expose()
    pageSize: number;

    @Expose()
    totalPages: number;

    @Expose()
    totalRecords: number;

    @Expose()
    data: OfficialStore[];

    constructor(pagination: PaginationEntity, data: OfficialStore[]) {
        this.page = pagination.page;
        this.pageSize = pagination.pageSize;
        this.totalPages = pagination.totalPages;
        this.totalRecords = pagination.totalRecords;
        this.data = data;
    }
}