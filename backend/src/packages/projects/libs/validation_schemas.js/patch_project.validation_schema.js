import joi from 'joi';

export const patchProjectValidationSchema = joi.object({
  name: joi.string().min(1),
  scene: joi.array(),
});
