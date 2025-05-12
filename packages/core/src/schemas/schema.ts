import { z } from "zod";

const createSchema =
  <T>() =>
  <S extends z.ZodType<T, any, any>>(arg: S) => {
    return arg;
  };

export { createSchema };
