import joi from 'joi';
import { UserValidationMessage, UserValidationRule } from '../enums/enums.js';

export const LogInValidationSchema = joi.object({
  email: joi
    .string()
    .email({
      tlds: {
        allow: false,
      },
    })
    .regex(UserValidationRule.EMAIL_PATTERN)
    .trim()
    .required()
    .messages({
      'string.email': UserValidationMessage.EMAIL_WRONG,
      'string.pattern.base': UserValidationMessage.EMAIL_WRONG,
      'string.empty': UserValidationMessage.EMAIL_REQUIRE,
    }),
  password: joi
    .string()
    .trim()
    .min(UserValidationRule.PASSWORD_MIN_LENGTH)
    .max(UserValidationRule.PASSWORD_MAX_LENGTH)
    .required()
    .messages({
      'string.min': UserValidationMessage.PASSWORD_MIN_LENGTH,
      'string.max': UserValidationMessage.PASSWORD_MAX_LENGTH,
      'string.empty': UserValidationMessage.PASSWORD_REQUIRE,
    }),
});
