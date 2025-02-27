import { Contract } from '@algorandfoundation/tealscript';

export class ContractA extends Contract {
  // Global state key to store the data
  data = GlobalStateKey<string>();

  // Method to create the application and initialize the data
  createApplication(): void {
    // Initialize the data to an empty string
    this.data.value = '';
  }

  // Method to set the data
  setdata(d: string): void {
    // Set the data to the provided value
    this.data.value = d;
  }

  // Method to get the data
  getdata(): string {
    // Return the stored data
    return this.data.value;
  }
}
