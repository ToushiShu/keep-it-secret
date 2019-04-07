import { check, ValidationChain } from "express-validator/check";

/**
 * Post validator class.
 */
export default class PostValidator {
    private static _validators: ValidationChain[] = [
        check("message")
            .not().isEmpty()
            .trim()
    ];

    public static get Validators() {
        return PostValidator._validators;
    }
}