import { Contract } from '@algorandfoundation/tealscript';
import { ContractA } from './ContractA.algo';

export class ContractB extends Contract {
  // Global state key to store the parent application ID
  parent_app_id = GlobalStateKey<uint64>();

  // Method to create the application and store the parent application ID
  createApplication(parent_id: uint64): void {
    this.parent_app_id.value = parent_id;
  }

  // Method to call the setdata method of ContractA
  setdata(d: string): void {
    sendMethodCall<typeof ContractA.prototype.setdata>({
      applicationID: AppID.fromUint64(this.parent_app_id.value),
      applicationArgs: [d],
      fee: 1000,
    });
  }

  // Method to call the getdata method of ContractA and return the data
  getdata(): string {
    return sendMethodCall<typeof ContractA.prototype.getdata>({
      applicationID: AppID.fromUint64(this.parent_app_id.value),
      fee: 1000,
    });
  }
}
