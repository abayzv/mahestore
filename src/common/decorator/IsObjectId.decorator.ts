import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

const isObjectId = (text: string): boolean => {
    const checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    return checkForHexRegExp.test(text);
}

export function IsObjectId(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isObjectId',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return isObjectId(value);
                },
                defaultMessage(args: ValidationArguments) {
                    return 'Invalid ObjectId';
                }
            }
        });
    };
}