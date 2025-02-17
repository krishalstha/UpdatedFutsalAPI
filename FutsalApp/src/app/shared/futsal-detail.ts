export class FutsalDetail {
  futsalId: number | null = null; // ID of the futsal detail (nullable)
  futsalName: string = '';        // Name of the futsal court
  location: string = '';          // Location of the futsal court
  contactNumber: string = '';     // Contact number for the futsal court
  email: string = '';             // Email for the futsal court
  description: string = '';       // Description of the futsal court
  pricing?: string;               // Optional: Pricing details
  operationHours?: string;        // Optional: Operation hours

  constructor(init?: Partial<FutsalDetail>) {
      if (init) {
          // Ensure futsalId is parsed as a number (System.Int32 equivalent in C#)
          if (init.futsalId !== undefined && init.futsalId !== null) {
              this.futsalId = Number(init.futsalId); // Convert to number
          }
          Object.assign(this, init);
      }
  }
}
