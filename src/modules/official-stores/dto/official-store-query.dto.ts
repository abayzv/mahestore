import { ApiProperty } from "@nestjs/swagger";

export class OfficialStoreQueryDto {
    @ApiProperty({ default: 1 })
    page?: number = 1;

    @ApiProperty({ default: 5, enum: [5, 10, 15, 20] })
    limit?: number;

    @ApiProperty()
    name?: string;
}