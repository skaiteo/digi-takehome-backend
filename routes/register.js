const client = require('../dbClient');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
    const { email, firstname, lastname, password } = req.body;

    try {
        const emailQuery = await client.query(
            'SELECT * FROM users WHERE email = $1;',
            [ email ]
        );
        if (emailQuery.rows.length > 0) {
            return res.status(400).json({
                message: 'Email already taken'
            });
        }
    
        // TODO: Hash password
        hashedPw = await bcrypt.hash(password, 10);
        await client.query(
            'INSERT INTO users (email, firstname, lastname, password) VALUES ($1, $2, $3, $4);',
            [ email, firstname, lastname, hashedPw ]
        );

        res.json({
            message: 'Successfully registered!'
        });
    } catch (error) {
        console.error('Error with DB operation', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
}