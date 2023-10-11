import { Expose } from 'class-transformer';
import { ProductEntity } from './product.entity';
import { PaginationEntity } from 'src/common/entities/pagination.entity';

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
    data: ProductEntity[];

    constructor(pagination: PaginationEntity, data: ProductEntity[]) {
        this.page = pagination.page;
        this.pageSize = pagination.pageSize;
        this.totalPages = pagination.totalPages;
        this.totalRecords = pagination.totalRecords;
        this.data = data;
    }
}