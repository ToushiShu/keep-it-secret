import { check, ValidationChain } from "express-validator/check";

/**
 * User validator class.
 */
export default class UserValidator {
    private static _validators: ValidationChain[] = [
        check("email")
            .not().isEmpty()
            .isEmail()
            .normalizeEmail(),
        check("password")
            .isLength({ min: 8 })
            .matches("^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$"),
        check("id")
            .optional()
    ];

    public static get Validators() {
        return UserValidator._validators;
    }
}