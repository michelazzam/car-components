import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

export function Trim() {
  return applyDecorators(
    Transform(({ value }) => {
      if (typeof value === 'string') {
        return value.trim();
      }
      return value;
    }),
  );
}
