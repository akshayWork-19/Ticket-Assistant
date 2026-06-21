import { ZodError } from "zod";

export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const errors = error.issues.map((err) => ({
                path: err.path.join("."),
                message: err.message
            }));
            return res.status(400).json({
                message: "Validation failed",
                errors,
            });
        }
        next(error);
    }
}