export class AcceptBookings {
    Id: number | null = null;
    BookingId: number | undefined ; // Ensure this gets assigned
    DateTime: string = '';
    Status: string = '';

    constructor(init?: Partial<AcceptBookings>) {
        if (init) {
            if (init.Id !== undefined && init.Id !== null) {
                this.Id = Number(init.Id);
            }
            if (init.BookingId) {
                this.BookingId = init.BookingId; // Ensure BookingId is assigned
            }
            Object.assign(this, init);
        }
    }
}
