const client = require('../dbClient');

module.exports = async (req, res) => {
    const { keyword } = req.body;

    try {
        const userSearch = await client.query(
            `SELECT id, firstname, lastname FROM users WHERE
            LOWER(firstname) LIKE LOWER($1) 
            OR 
            LOWER(lastname) LIKE LOWER($1);`,
            [ `%${keyword}%` ]
        );

        userSearch.rows.map((row) => console.log(JSON.stringify(row)));
        res.json(userSearch.rows);
    } catch (error) {
        console.error('Error with searching user', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
}