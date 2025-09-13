import express from 'express';
import zod from 'zod';
import users from '../db.js';

const router = express.Router();
router.use(express.json());

const loginBody = zod.object({
    email: zod.email(),
    password: zod.string()
});

router.post('/userLogin', async (req, res) => {
    try {
        const parsed = loginBody.safeParse(req.body);
        console.log("Searching for email: " + req.body.email);
        if(!parsed.success) {
            const formattedErrors = parsed.error.issues.map(err => ({
                path: err.path[0],
                message: err.message
            }));

            return res.status(200).json({
                msg: "Invalid Email / Password"
            });
        } else {
            const existingUser = await users.findOne({
                email: req.body.email,
                password: req.body.password
            });

            if(!existingUser) {
                return res.status(200).json({
                    msg: "Incorrect Email / Password"
                });
            }

            return res.status(200).json({
                msg: "Login Successfull",
                email: req.body.email,
                password: req.body.password
            })
        }
    } catch(err) {
        return res.status(200).json({
            msg: "Invalid Request."
        })
    }
    
});

export default router;