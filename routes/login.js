const client = require('../dbClient');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userQuery = await client.query(
            'SELECT * FROM users WHERE email = $1;',
            [ email ]
        );

        if (userQuery.rows.length == 0) {
            success = false;
        } else {
            const { password: hashedPw } = userQuery.rows[0];
            success = await bcrypt.compare(password, hashedPw);
        }

        if (!success) {
            return res.status(400).json({
                message: 'Wrong email or password'
            });
        }

        res.json({
            message: 'Successfully logged in!'
        })
    } catch (error) {
        console.error('Error with fetching user', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
}