/* eslint-disable no-console */

import * as algosdk from 'algosdk';
import * as algokit from '@algorandfoundation/algokit-utils';
import { ContractAClient } from './clients/ContractAClient';
import { ContractBClient } from './clients/ContractBClient';
import { ALGOD_PORT, ALGOD_TOKEN, ALGOD_URL, WALLET_MNEMONIC } from './config';

(async () => {
  const algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_URL, ALGOD_PORT);
  const sender = algosdk.mnemonicToSecretKey(WALLET_MNEMONIC);

  const ContractACaller = new ContractAClient(
    {
      sender,
      resolveBy: 'id',
      id: 0,
    },
    algodClient
  );

  await ContractACaller.create.createApplication({});

  const { appId } = await ContractACaller.appClient.getAppReference();
  const ContractAappId = appId;

  const ContractBCaller = new ContractBClient(
    {
      sender,
      resolveBy: 'id',
      id: 0,
    },
    algodClient
  );

  await ContractBCaller.create.createApplication({ parent_id: ContractAappId });

  const ContractBaddress = (await ContractBCaller.appClient.getAppReference()).appAddress;

  const suggestedParams = await algodClient.getTransactionParams().do();

  var txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: sender.addr,
    to: ContractBaddress,
    amount: algokit.algos(1).microAlgos,
    suggestedParams: suggestedParams,
  });

  var stxn = txn.signTxn(sender.sk);

  await algodClient.sendRawTransaction(stxn).do();
  const result = await algosdk.waitForConfirmation(algodClient, txn.txID().toString(), 3);

  console.log('funded contract b with 1 algo : ' + txn.txID());

  //   console.log(await ContractBCaller.getdata({},{apps:[Number(ContractAappId)]}));
  var data = 'contract to contract call';

  console.log(
    `Set data='${data}' in round : ` +
      (await ContractBCaller.setdata({ d: '  ' + data }, { apps: [Number(ContractAappId)] })).confirmation
        ?.confirmedRound
  );

  console.log('Recieved Data : ' + (await ContractBCaller.getdata({}, { apps: [Number(ContractAappId)] })).return);

  var data = 'another call';

  console.log(
    `Set data='${data}' in round : ` +
      (await ContractBCaller.setdata({ d: '  ' + data }, { apps: [Number(ContractAappId)] })).confirmation
        ?.confirmedRound
  );

  console.log('Recieved Data : ' + (await ContractBCaller.getdata({}, { apps: [Number(ContractAappId)] })).return);
})();
