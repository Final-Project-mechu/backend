import { CreateFeedDto } from './create.feeds.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateFeedDto extends PartialType(CreateFeedDto) {}
