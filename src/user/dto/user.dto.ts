import { User } from '../entities/user.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class ReadOnlyUserDto extends PickType(User, [
  'userId',
  'nickname',
] as const) {
  @ApiProperty({
    example: '32323',
    description: 'id',
    required: true,
  })
  id: string;
}
