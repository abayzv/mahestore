import { PartialType } from '@nestjs/swagger';
import { CreateOfficialStoreDto } from './create-official-store.dto';

export class UpdateOfficialStoreDto extends PartialType(CreateOfficialStoreDto) {}
