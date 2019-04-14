import Helper from './Helper';

/**
 * Skyflow Validator - Validate your objects easily and quickly.
 *
 * @class Validator
 * @constructor
 * @author Skyflow
 * @version 1.0.0
 * @requires Helper
 * @example
 *      let validator = new Validator();
 *      validator
 *          .isString('This value must be a string')
 *          .notRegExp(/^a$/, 'This value must not contain the letter a');
 *      if(!validator.isValid('foo')){
 *          console.log(validator.getErrors());
 *      }
 */
export default class Validator {
    constructor() {
        this.errors = {};
        this.values = {};
        this.constraints = {};
        this.validators = {

            notBlank: (value) => {
                if (Helper.isBlank(value)) {
                    this.errors.notBlank = this.constraints.notBlank;
                }
            },
            isBlank: (value) => {
                if (!Helper.isBlank(value)) {
                    this.errors.isBlank = this.constraints.isBlank;
                }
            },
            notNull: (value) => {
                if (Helper.isNull(value)) {
                    this.errors.notNull = this.constraints.notNull;
                }
            },
            isNull: (value) => {
                if (!Helper.isNull(value)) {
                    this.errors.isNull = this.constraints.isNull;
                }
            },
            isTrue: (value) => {
                if (!Helper.isTrue(value)) {
                    this.errors.isTrue = this.constraints.isTrue;
                }
            },
            isFalse: (value) => {
                if (!Helper.isFalse(value)) {
                    this.errors.isFalse = this.constraints.isFalse;
                }
            },
            notString: (value) => {
                if (Helper.isString(value)) {
                    this.errors.notString = this.constraints.notString;
                }
            },
            isString: (value) => {
                if (!Helper.isString(value)) {
                    this.errors.isString = this.constraints.isString;
                }
            },
            notNumber: (value) => {
                if (Helper.isNumber(value)) {
                    this.errors.notNumber = this.constraints.notNumber;
                }
            },
            isNumber: (value) => {
                if (!Helper.isNumber(value)) {
                    this.errors.isNumber = this.constraints.isNumber;
                }
            },
            notArray: (value) => {
                if (Helper.isArray(value)) {
                    this.errors.notArray = this.constraints.notArray;
                }
            },
            isArray: (value) => {
                if (!Helper.isArray(value)) {
                    this.errors.isArray = this.constraints.isArray;
                }
            },
            notObject: (value) => {
                if (Helper.isObject(value)) {
                    this.errors.notObject = this.constraints.notObject;
                }
            },
            isObject: (value) => {
                if (!Helper.isObject(value)) {
                    this.errors.isObject = this.constraints.isObject;
                }
            },
            notBoolean: (value) => {
                if (Helper.isBoolean(value)) {
                    this.errors.notBoolean = this.constraints.notBoolean;
                }
            },
            isBoolean: (value) => {
                if (!Helper.isBoolean(value)) {
                    this.errors.isBoolean = this.constraints.isBoolean;
                }
            },
            notElement: (value) => {
                if (Helper.isElement(value)) {
                    this.errors.notElement = this.constraints.notElement;
                }
            },
            isElement: (value) => {
                if (!Helper.isElement(value)) {
                    this.errors.isElement = this.constraints.isElement;
                }
            },
            notFunction: (value) => {
                if (Helper.isFunction(value)) {
                    this.errors.notFunction = this.constraints.notFunction;
                }
            },
            isFunction: (value) => {
                if (!Helper.isFunction(value)) {
                    this.errors.isFunction = this.constraints.isFunction;
                }
            },
            notEmpty: (value) => {
                if (Helper.isEmpty(value)) {
                    this.errors.notEmpty = this.constraints.notEmpty;
                }
            },
            isEmpty: (value) => {
                if (!Helper.isEmpty(value)) {
                    this.errors.isEmpty = this.constraints.isEmpty;
                }
            },
            notRegExp: (value, compare) => {
                if (Helper.isRegExp(compare) && compare.test(value)) {
                    this.errors.notRegExp = this.constraints.notRegExp;
                }
            },
            isRegExp: (value, compare) => {
                if (!Helper.isRegExp(compare) && !compare.test(value)) {
                    this.errors.isRegExp = this.constraints.isRegExp;
                }
            },
            notType: (value, compare) => {
                if (Helper.getType(value) === compare) {
                    this.errors.notType = this.constraints.notType;
                }
            },
            isType: (value, compare) => {
                if (Helper.getType(value) !== compare) {
                    this.errors.isType = this.constraints.isType;
                }
            },
            isLength: (value, compare) => {
                value = Helper.convertToArray(value);
                if (value.length !== compare) {
                    this.errors.isLength = this.constraints.isLength;
                }
            },
            notLength: (value, compare) => {
                value = Helper.convertToArray(value);
                if (value.length === compare) {
                    this.errors.notLength = this.constraints.notLength;
                }
            },
            isEmail: (value) => {
                const regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!regexp.test(value)) {
                    this.errors.isEmail = this.constraints.isEmail;
                }
            },
            isPostalCode: (value) => {
                const regexp = /^[0-9]{5}$/;
                if (!regexp.test(value)) {
                    this.errors.isPostalCode = this.constraints.isPostalCode;
                }
            },
            isUrl: (value) => {
                const regexp = /^(http|https|ftp):\/\/([\w]*)\.([\w]*)\.(com|net|org|biz|info|mobi|us|cc|bz|tv|ws|name|co|me)(\.[a-z]{1,3})?$/i;
                if (!regexp.test(value)) {
                    this.errors.isUrl = this.constraints.isUrl;
                }
            },

        }
    }

    /**
     * Validates that a value is not blank.
     *
     * @method notBlank
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    notBlank(message) {
        this.constraints.notBlank = message;
        return this;
    }

    /**
     * Validates that a value is blank.
     *
     * @method isBlank
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    isBlank(message) {
        this.constraints.isBlank = message;
        return this;
    }

    /**
     * Validates that a value is null.
     *
     * @method notNull
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    notNull(message) {
        this.constraints.notNull = message;
        return this;
    }

    /**
     * Validates that a value is not null.
     *
     * @method isNull
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    isNull(message) {
        this.constraints.isNull = message;
        return this;
    }

    /**
     * Validates that a value is true.
     *
     * @method isTrue
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    isTrue(message) {
        this.constraints.isTrue = message;
        return this;
    }

    /**
     * Validates that a value is false.
     *
     * @method isFalse
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    isFalse(message) {
        this.constraints.isFalse = message;
        return this;
    }

    /**
     * Validates that a value is not a string.
     *
     * @method notString
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    notString(message) {
        this.constraints.notString = message;
        return this;
    }

    /**
     * Validates that a value is a string.
     *
     * @method isString
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    isString(message) {
        this.constraints.isString = message;
        return this;
    }

    /**
     * Validates that a value is not a number.
     *
     * @method notNumber
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    notNumber(message) {
        this.constraints.notNumber = message;
        return this;
    }

    /**
     * Validates that a value is a number.
     *
     * @method isNumber
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    isNumber(message) {
        this.constraints.isNumber = message;
        return this;
    }

    /**
     * Validates that a value is not an array.
     *
     * @method notArray
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    notArray(message) {
        this.constraints.notArray = message;
        return this;
    }

    /**
     * Validates that a value is an array.
     *
     * @method isArray
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    isArray(message) {
        this.constraints.isArray = message;
        return this;
    }

    /**
     * Validates that a value is not an object.
     *
     * @method notObject
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    notObject(message) {
        this.constraints.notObject = message;
        return this;
    }

    /**
     * Validates that a value is an object.
     *
     * @method isObject
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    isObject(message) {
        this.constraints.isObject = message;
        return this;
    }

    /**
     * Validates that a value is not a boolean.
     *
     * @method notBoolean
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    notBoolean(message) {
        this.constraints.notBoolean = message;
        return this;
    }

    /**
     * Validates that a value is a boolean.
     *
     * @method isBoolean
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    isBoolean(message) {
        this.constraints.isBoolean = message;
        return this;
    }

    /**
     * Validates that a value is not a DOM element.
     *
     * @method notElement
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    notElement(message) {
        this.constraints.notElement = message;
        return this;
    }

    /**
     * Validates that a value is a DOM element.
     *
     * @method isElement
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    isElement(message) {
        this.constraints.isElement = message;
        return this;
    }

    /**
     * Validates that a value is not a function.
     *
     * @method notFunction
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    notFunction(message) {
        this.constraints.notFunction = message;
        return this;
    }

    /**
     * Validates that a value is a function.
     *
     * @method isFunction
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    isFunction(message) {
        this.constraints.isFunction = message;
        return this;
    }

    /**
     * Validates that a value is not empty.
     *
     * @method notEmpty
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    notEmpty(message) {
        this.constraints.notEmpty = message;
        return this;
    }

    /**
     * Validates that a value is empty.
     *
     * @method isEmpty
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    isEmpty(message) {
        this.constraints.isEmpty = message;
        return this;
    }

    /**
     * Validates that a value not matches a regular expression.
     *
     * @method notRegExp
     * @param {RegExp|String} regexp Regular expression to validate.
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    notRegExp(regexp, message) {
        if(Helper.isString(regexp)){
            regexp = new RegExp(regexp);
        }
        this.values.notRegExp = regexp;
        this.constraints.notRegExp = message;
        return this;
    }

    /**
     * Validates that a value matches a regular expression.
     *
     * @method isRegExp
     * @param {RegExp|String} regexp Regular expression to validate.
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    isRegExp(regexp, message) {
        if(Helper.isString(regexp)){
            regexp = new RegExp(regexp);
        }
        this.values.isRegExp = regexp;
        this.constraints.isRegExp = message;
        return this;
    }

    /**
     * Validates that a value is of a specific data type.
     *
     * @method notType
     * @param {String} type Type to validate.
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    notType(type, message) {
        this.values.notType = type;
        this.constraints.notType = message;
        return this;
    }

    /**
     * Validates that a value is of a specific data type.
     *
     * @method isType
     * @param {String} type Type to validate.
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    isType(type, message) {
        this.values.isType = type;
        this.constraints.isType = message;
        return this;
    }

    /**
     * Validates that a value has a specific length.
     *
     * @method isLength
     * @param {Number} length Length to validate.
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    isLength(length, message) {
        this.values.isLength = parseInt(length, 10);
        this.constraints.isLength = message;
        return this;
    }

    /**
     * Validates that a value has not a specific length.
     *
     * @method notLength
     * @param {Number} length Length to validate.
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    notLength(length, message) {
        this.values.notLength = length;
        this.constraints.notLength = message;
        return this;
    }

    /**
     * Validates that a value is an email.
     *
     * @method isEmail
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    isEmail(message) {
        this.constraints.isEmail = message;
        return this;
    }

    /**
     * Validates that a value is a postal code.
     *
     * @method isPostalCode
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    isPostalCode(message) {
        this.constraints.isPostalCode = message;
        return this;
    }

    /**
     * Validates that a value is an url.
     *
     * @method isUrl
     * @param {String} message Error message.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    isUrl(message) {
        this.constraints.isUrl = message;
        return this;
    }

    /**
     * Validates a value.
     *
     * @method validate
     * @param value Value to validate.
     * @since 1.0.0
     * @return {Validator} Returns the current Validator object.
     */
    validate(value) {
        this.errors = {};
        const constraints = Object.keys(this.constraints);
        constraints.map((constraint) => {
            this.validators[constraint](value, this.values[constraint])
        });

        return this;
    }

    /**
     * Checks whether all defined constraints are valid.
     *
     * @method isValid
     * @param value Value to validate. If value is defined, validate method will be called.
     * @since 1.0.0
     * @return {boolean} Returns true if all defined constraints are valid and false otherwise.
     */
    isValid(value) {
        if (value !== undefined) {
            this.validate(value);
        }

        return Object.keys(this.errors).length === 0;
    }

    /**
     * Gets all errors.
     *
     * @method getErrors
     * @since 1.0.0
     * @return {Object} Returns an object containing all errors.
     */
    getErrors() {
        return this.errors;
    }

    /**
     * Gets all error constraints.
     *
     * @method getErrorConstraints
     * @since 1.0.0
     * @return {Array} Returns an array containing all error constraints.
     */
    getErrorConstraints() {
        return Object.keys(this.errors);
    }

    /**
     * Gets all error messages.
     *
     * @method getErrorMessages
     * @since 1.0.0
     * @return {Array} Returns an array containing all error messages.
     */
    getErrorMessages() {
        return Object.values(this.errors);
    }

    /**
     * Gets an error message by constraint.
     *
     * @method getErrorMessage
     * @since 1.0.0
     * @return {String|null} Returns the error message for the constraint.
     */
    getErrorMessage(constraint) {
        return this.errors[constraint] || null;
    }

}
