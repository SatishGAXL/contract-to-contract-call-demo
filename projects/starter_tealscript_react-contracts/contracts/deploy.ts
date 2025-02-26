/* eslint-disable no-console */

import * as algosdk from 'algosdk';
import * as algokit from '@algorandfoundation/algokit-utils';
import { ContractAClient } from './clients/ContractAClient';
import { ContractBClient } from './clients/ContractBClient';
import { ALGOD_PORT, ALGOD_TOKEN, ALGOD_URL, WALLET_MNEMONIC } from './config';

(async () => {
  const algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_URL, ALGOD_PORT);
  const sender = algosdk.mnemonicToSecretKey(WALLET_MNEMONIC);

  console.log('Using Wallet : ' + sender.addr);

  const ContractACaller = new ContractAClient(
    {
      sender,
      resolveBy: 'id',
      id: 0,
    },
    algodClient
  );

  await ContractACaller.create.createApplication({});

  var ContractAresult = await ContractACaller.appClient.getAppReference();
  const ContractAappId = ContractAresult.appId;
  const ContractAappAddress = ContractAresult.appAddress;

  console.log(`Contract A Deployed with appId: ${ContractAappId}\nappAddress: ${ContractAappAddress}`);

  const ContractBCaller = new ContractBClient(
    {
      sender,
      resolveBy: 'id',
      id: 0,
    },
    algodClient
  );

  await ContractBCaller.create.createApplication({ parent_id: ContractAappId });

  var ContractBresult = await ContractBCaller.appClient.getAppReference();
  const ContractBappId = ContractBresult.appId;
  const ContractBappAddress = ContractBresult.appAddress;

  console.log(`Contract B Deployed with appId: ${ContractBappId}\nappAddress: ${ContractBappAddress}`);

  const suggestedParams = await algodClient.getTransactionParams().do();

  var txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: sender.addr,
    to: ContractBappAddress,
    amount: algokit.algos(1).microAlgos,
    suggestedParams: suggestedParams,
  });

  var stxn = txn.signTxn(sender.sk);

  await algodClient.sendRawTransaction(stxn).do();
  const result = await algosdk.waitForConfirmation(algodClient, txn.txID().toString(), 3);

  console.log('Funded Contract B with 1 Algo : ' + txn.txID());
})();
