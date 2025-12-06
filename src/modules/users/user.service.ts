import { pool } from "../../config/db"


const getUsers = async () => {
    const result = await pool.query(`
        SELECT * FROM users
        `);
    return result;
};



const updateUser = async (id: string, payload: Record<string, any>) => {
    const allowedFields = [
        "name", "email", "phone", "role"
    ];

    const setFields: string[] = [];
    const values: string[] = [];
    let index = 1;

    for (const field of allowedFields) {
        if (payload[field] !== undefined) {
            setFields.push(`${field} = $${index}`);
            values.push(payload[field]);
            index++
        }
    };

    if (setFields.length === 0) return null;

    values.push(id);

    const query = `
    UPDATE users
    SET ${setFields.join(", ")}
    WHERE id=$${index}
    RETURNING id, name, email, phone, role
    `

    const result = await pool.query(query, values);

    return result;

}



export const userServices = {
    getUsers,
    updateUser,
}