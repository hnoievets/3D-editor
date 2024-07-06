import joi from 'joi';

const postProjectValidationSchema = joi.object({
  name: joi.string().min(1).required(),
  scene: joi.array().required(),
});

export { postProjectValidationSchema };
