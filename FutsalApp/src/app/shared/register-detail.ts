    export class RegisterDetail {
    Id: number | null = null; 
    name: string = '';          
    email: string = '';     
    password: string = '';             
    contactNumber: string = '';        
  Roleid: number = 1;               
  registrationDate: Date = new Date(); // Registration date (default to current date)
  constructor(init?: Partial<RegisterDetail>) {
    if (init) {
      // Ensure Id is parsed as a number (System.Int32 equivalent in C#)
      if (init.Id !== undefined && init.Id !== null) {
        this.Id = Number(init.Id); // Convert to number
      }
      if (init.Roleid !== undefined && init.Roleid !== null) {
        this.Roleid = Number(init.Roleid); // Ensure RoleId is a number (1 or 2)
      }
      Object.assign(this, init); // Assign other properties
        }
    }
    }
