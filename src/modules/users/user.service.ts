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


const deleteUser = async (id: string) => {
    const activeBookings = await pool.query(
        `
    SELECT 1
    FROM bookings
    WHERE customer_id = $1
    AND status = 'active'
    LIMIT 1
    `,
        [id]
    );
    // console.log(activeBookings)
    
    const hasActive = (activeBookings.rowCount ?? 0) > 0;
    console.log('from user delete',hasActive,activeBookings)

    if (hasActive) {
        return {
            success: false,
            status: 400,
            message: "User cannot be deleted because they have active bookings",
        };
    }

    const result = await pool.query(
        `
    DELETE FROM users
    WHERE id = $1
    RETURNING *
    `,
        [id]
    );

    if (result.rowCount === 0) {
        return {
            success: false,
            status: 404,
            message: "User not found",
        };
    }

    return {
        success: true,
        status: 200,
        message: "User deleted successfully",
    };
};



export const userServices = {
    getUsers,
    updateUser,
    deleteUser,
}