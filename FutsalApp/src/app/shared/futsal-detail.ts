export class FutsalDetail {
  futsalId: number | null = null; 
  futsalName: string = '';        
  location: string = '';         
  contactNumber: string = '';    
  email: string = '';             
  description: string = '';       
  pricing?: string;               
  operationHours?: string;      
  image?: string;
  imageUrl?: string; // Optional, for storing the image URL after processing

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
