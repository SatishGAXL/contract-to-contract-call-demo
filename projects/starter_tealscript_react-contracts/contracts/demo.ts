/* eslint-disable no-console */

import * as algosdk from 'algosdk';
import * as algokit from '@algorandfoundation/algokit-utils';
import { ContractAClient } from './clients/ContractAClient';
import { ContractBClient } from './clients/ContractBClient';
import { ALGOD_PORT, ALGOD_TOKEN, ALGOD_URL, WALLET_MNEMONIC } from './config';

(async () => {
  // Initialize Algod client
  const algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_URL, ALGOD_PORT);
  // Get the sender account from mnemonic
  const sender = algosdk.mnemonicToSecretKey(WALLET_MNEMONIC);

  // Create ContractA client
  const ContractACaller = new ContractAClient(
    {
      sender,
      resolveBy: 'id',
      id: 0,
    },
    algodClient
  );

  // Create ContractA application
  await ContractACaller.create.createApplication({});

  // Get ContractA application ID
  const { appId } = await ContractACaller.appClient.getAppReference();
  const ContractAappId = appId;

  // Create ContractB client
  const ContractBCaller = new ContractBClient(
    {
      sender,
      resolveBy: 'id',
      id: 0,
    },
    algodClient
  );

  // Create ContractB application and pass ContractA's application ID as an argument
  await ContractBCaller.create.createApplication({ parent_id: ContractAappId });

  // Get ContractB address
  const ContractBaddress = (await ContractBCaller.appClient.getAppReference()).appAddress;

  // Get suggested parameters
  const suggestedParams = await algodClient.getTransactionParams().do();

  // Create a payment transaction to fund ContractB
  var txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: sender.addr,
    to: ContractBaddress,
    amount: algokit.algos(1).microAlgos,
    suggestedParams: suggestedParams,
  });

  // Sign the transaction
  var stxn = txn.signTxn(sender.sk);

  // Send the transaction
  await algodClient.sendRawTransaction(stxn).do();
  // Wait for confirmation
  const result = await algosdk.waitForConfirmation(algodClient, txn.txID().toString(), 3);

  console.log('funded contract b with 1 algo : ' + txn.txID());

  //   console.log(await ContractBCaller.getdata({},{apps:[Number(ContractAappId)]}));
  var data = 'contract to contract call';

  // Call setdata method of ContractB, which in turn calls setdata of ContractA
  console.log(
    `Set data='${data}' in round : ` +
      (await ContractBCaller.setdata({ d: '  ' + data }, { apps: [Number(ContractAappId)] })).confirmation
        ?.confirmedRound
  );

  // Call getdata method of ContractB, which in turn calls getdata of ContractA and print the returned data
  console.log('Recieved Data : ' + (await ContractBCaller.getdata({}, { apps: [Number(ContractAappId)] })).return);

  var data = 'another call';

  // Call setdata method of ContractB again with different data
  console.log(
    `Set data='${data}' in round : ` +
      (await ContractBCaller.setdata({ d: '  ' + data }, { apps: [Number(ContractAappId)] })).confirmation
        ?.confirmedRound
  );

  // Call getdata method of ContractB again and print the returned data
  console.log('Recieved Data : ' + (await ContractBCaller.getdata({}, { apps: [Number(ContractAappId)] })).return);
})();
