import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryparamsDto {

  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly query?: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly category?: string ;

}
