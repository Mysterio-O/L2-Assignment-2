const helpCreate = (payload: Record<string, any>) => {
    // console.log(payload)
    if (!payload.vehicle_name) {
        return { status: 404, message: "vehicle name not found" };
    };

    if (!payload.type) {
        return { status: 404, message: "vehicle type not found" };
    };

    if (payload.type !== 'car' && payload.type !== 'bike' && payload.type !== 'van' && payload.type !== 'SUV') {
        return { status: 400, message: "invalid vehicle type" };
    };

    return null;
};



export const vehicleHelpers = {
    helpCreate
}