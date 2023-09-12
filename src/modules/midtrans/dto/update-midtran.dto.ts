import { PartialType } from '@nestjs/swagger';
import { CreateMidtranDto } from './create-midtran.dto';

export class UpdateMidtranDto extends PartialType(CreateMidtranDto) {}
