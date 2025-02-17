    export class LoginDetail {
    Id: number | null = null; // ID of the futsal detail (nullable)
    email: string = '';     // Contact number for the futsal court
    password: string = '';             // Email for the futsal court
   
  
  LoginDate: Date = new Date(); // login date (default to current date)
  constructor(init?: Partial<LoginDetail>) {
    if (init) {
      // Ensure Id is parsed as a number (System.Int32 equivalent in C#)
      if (init.Id !== undefined && init.Id !== null) {
        this.Id = Number(init.Id); // Convert to number
      }

        }
    }
    }
