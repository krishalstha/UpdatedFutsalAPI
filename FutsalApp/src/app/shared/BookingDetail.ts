export class BookingDetail {
    id: number | null = null;  
    futsalId?: number; 
    futsalName?: string;    
    contactNumber: string = '';     
    selectDate?: string = '';             
    selectTime?: string = '';      
    selectDuration?: string; 
    calcTime?: string;        
    selectPaymentMethod?: string;
    email: string = '';
    price: number = 0;  // Ensure pricing is a number
    discount: string = '';
    finalPrice: number = 0;
    isDiscountApplied: boolean = false;
    userId?: string;
    status?: string; 
    constructor(init?: Partial<BookingDetail>) {
        if (init) {
            if (init.id !== undefined && init.id !== null) {
                this.id = Number(init.id);
            }
            if (init.price !== undefined) {
                this.price = Number(init.price); // Ensure pricing is always a number
            }
            Object.assign(this, init);
        }
    }
}  
