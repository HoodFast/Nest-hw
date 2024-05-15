import { Transform, TransformFnParams } from 'class-transformer';

export const Trim = () =>
  Transform(({ value }: TransformFnParams) => {
    if (typeof value === 'string') {
      value?.trim();
    }
    return value;
  });
