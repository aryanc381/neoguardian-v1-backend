import express from 'express';
import zod from 'zod';
import users from '../db.js';

const router = express.Router();
router.use(express.json());

const signUpBody = zod.object({
    firstName: zod.string().min(3, "Please enter correct firstname."),
    lastName: zod.string().min(3, "Please enter correct lastname."),
    email: zod.email(),
    phone: zod.string().min(10, "Phone number has 10 digits."),
    password: zod.string().min(6, "Password must be atleast 6 characters long.") 
});

router.post('/userSignUp', async (req, res) => {
    const parsed = signUpBody.safeParse(req.body);

    if(!parsed.success) {
        const formattedErrors = parsed.error.issues.map(err => ({
            path: err.path[0],
            message: err.message
        }));
        console.log(formattedErrors)
        return res.status(200).json({
            msg: "Invalid / Missing Credentials.",
            errors: formattedErrors
        });
    } else {
        const existingUser = await users.findOne({
            email: req.body.email
        });

        if(existingUser) {
            return res.status(200).json({
                msg: "User already exists with email: " + req.body.email
            });
        }

        const user = await users.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password
        });
        
        return res.status(200).json({
            msg: "User has been created successfully, navigating to login...",
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            password: user.password
        });
    }
});

export default router;