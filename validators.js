const Ajv = require("ajv");
const validator = require('validator');
const ajv = new Ajv({ allErrors: true, coerceTypes: true, useDefaults: 'empty' });

require('ajv-formats')(ajv);
require('ajv-errors')(ajv);
require('ajv-keywords')(ajv);

ajv.addKeyword({
  keyword: 'DateRepleceSlash',
  modifying: true,
  schema: true,
  validate: (schema, data, parentSchema, dataCtx) => {
    if (schema == true) {
      dataCtx.parentData[dataCtx.parentDataProperty] = data.replaceAll('/', '-');
    }
    return true;
  }
})

let schema = {
  type: 'object',
  properties: {
    date: {
      type: "string",
      DateRepleceSlash: true,
      format: "date",
      transform: ['trim'],
      errorMessage: {
        format: 'Date must be in the correct format'
      }
    },
    size: {
      enum: ["extra-large", "large", "medium", "small"],
      errorMessage: {
        enum: 'Please choose one of the allowed sizes'
      }
    },
    gluten_free: {
      type: "boolean",
      default: "false"
    },
    toppings: {
      type: "array",
      maxItems: 5,
      minItems: 3,
      items: [{
        type: "string",
        enum: ["tomato sause", "cheese", "pepperoni", "green peppers", "pineapple", "mushrooms", "olives"],
        errorMessage: {
          type: "Please choose one of the allowed toppings",
          enum: "Please choose one of the aloowed toppings",
        }
      }
      ],
      errorMessage: {
        type: 'Please submit at least 3 toppings',
        maxItems: 'Please submit at most 5 toppings',
        minItems: 'Please submit at least 3 toppings',
      }
    },
    name: {
      type: "string",
      minLength: 1,
      maxLength: 20,
      transform: ['trim'],
      errorMessage: {
        minLength: 'Name should have at least 1 characters',
        maxLength: 'Name should not have more than 20 characters'
      }
    },
    email: {
      type: "string",
      maxLength: 40,
      transform: ['trim'],
      format: "email",
      errorMessage: {
        maxLength: 'email should be no more than 40',
        format: 'Please use a valid email address'
      }
    },
    rating: {
      enum: ["1", "2", "3", "4", "5"],
      default: "5",
      errorMessage: {
        enum: "Rate should be between 1 and 5"
      }
    }
  },
  required: ['date', 'size', 'toppings', 'name', 'email'],
  errorMessage: {
    required: {
      'size': 'Please choose one of the allowed sizes',
      'name': 'Please enter your name',
      'email': 'Please enter your email',
      'toppings': 'Please submit at least 3 toppings',
    }
  }
};

exports.pizzaFormValidator = (req, res, next) => {
  const validate = ajv.compile(schema);
  validate(req.body);
  res.local = validate.errors;
  next();
};

exports.colorFormValidator = (req, res, next) => {
  if (req.query.color == undefined || !validator.isHexColor(req.query.color)) req.query.color = "#554488";
  next();
};