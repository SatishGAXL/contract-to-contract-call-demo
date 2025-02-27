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

  console.log('Using Wallet : ' + sender.addr);

  // Create ContractA client
  const ContractACaller = new ContractAClient(
    {
      sender,
      resolveBy: 'id',
      id: 0,
    },
    algodClient
  );

  // Deploy ContractA application
  await ContractACaller.create.createApplication({});

  // Get ContractA application details
  var ContractAresult = await ContractACaller.appClient.getAppReference();
  const ContractAappId = ContractAresult.appId;
  const ContractAappAddress = ContractAresult.appAddress;

  console.log(`Contract A Deployed with appId: ${ContractAappId}\nappAddress: ${ContractAappAddress}`);

  // Create ContractB client
  const ContractBCaller = new ContractBClient(
    {
      sender,
      resolveBy: 'id',
      id: 0,
    },
    algodClient
  );

  // Deploy ContractB application and pass ContractA's application ID as an argument
  await ContractBCaller.create.createApplication({ parent_id: ContractAappId });

  // Get ContractB application details
  var ContractBresult = await ContractBCaller.appClient.getAppReference();
  const ContractBappId = ContractBresult.appId;
  const ContractBappAddress = ContractBresult.appAddress;

  console.log(`Contract B Deployed with appId: ${ContractBappId}\nappAddress: ${ContractBappAddress}`);

  // Get suggested parameters
  const suggestedParams = await algodClient.getTransactionParams().do();

  // Create a payment transaction to fund ContractB
  var txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: sender.addr,
    to: ContractBappAddress,
    amount: algokit.algos(1).microAlgos,
    suggestedParams: suggestedParams,
  });

  // Sign the transaction
  var stxn = txn.signTxn(sender.sk);

  // Send the transaction
  await algodClient.sendRawTransaction(stxn).do();
  // Wait for confirmation
  const result = await algosdk.waitForConfirmation(algodClient, txn.txID().toString(), 3);

  console.log('Funded Contract B with 1 Algo : ' + txn.txID());
})();
