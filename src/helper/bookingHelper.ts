const helpCreate = (payload: Record<string, any>) => {
    if (!payload.customer_id) return { status: 400, message: "customer id not found" };

    if (!payload.vehicle_id) return { status: 400, message: "vehicle id not found" };

    if (!payload.rent_start_date) return { status: 400, message: "rent start date not found" };

    if (!payload.rent_end_date) return { status: 400, message: "rent end date not found" }

    return null;
};


const formatYMD = (value: Date | string) => {
    // If it's already a YYYY-MM-DD string
    if (typeof value === "string" && value.includes("T") === false) {
        return value;
    }

    const d = new Date(value);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};


const hasBookingStarted = (rent_start_date: string) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    return rent_start_date <= todayStr;
};
const hasBookingEnded = (rent_end_date: string) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    return rent_end_date <= todayStr;
};


const helpUpdate = (status: 'cancelled' | 'returned') => {
    if (status !== 'cancelled' && status !== 'returned') {
        return { success: false, status: 400, message: 'invalid status' }
    }
    return null;
}

export const bookingHelpers = {
    helpCreate,
    formatYMD,
    hasBookingStarted,
    helpUpdate,
    hasBookingEnded
}