import React from "react";
import "./styles/App.css";
import { ContractBClient } from "./contracts/ContractB";
import * as algosdk from "algosdk";

function App() {
  // Initialize Algod client with environment variables
  const algodClient = new algosdk.Algodv2(
    import.meta.env.VITE_ALGOD_TOKEN,
    import.meta.env.VITE_ALGOD_SERVER,
    Number(import.meta.env.VITE_ALGOD_PORT)
  );
  // Get the sender account from mnemonic stored in environment variables
  const sender = algosdk.mnemonicToSecretKey(import.meta.env.VITE_WALLET_MNEMONIC);

  // Get transaction explorer base URL from environment variables for constructing transaction links
  const transaction_explorer_baseurl = import.meta.env.VITE_EXPLORER_BASEURL;

  // Get ContractA and ContractB app IDs from environment variables to interact with the contracts
  const ContractAappId = Number(import.meta.env.VITE_CONTRACT_A_ID);
  const ContractBappId = Number(import.meta.env.VITE_CONTRACT_B_ID);

  // Create ContractB client instance for calling contract methods
  const appCaller = new ContractBClient(
    {
      sender,
      resolveBy: "id",
      id: ContractBappId,
    },
    algodClient
  );

  // Define state variables using React's useState hook
  const [data, setData] = React.useState<string>(""); // State to store fetched data from ContractB
  const [getstatus, setGetStatus] = React.useState<boolean>(false); // State to manage loading status of getdata operation
  const [getnotification, setGetNotification] = React.useState<string>(""); // State to store transaction ID of getdata call

  const [typeddata, setTypedData] = React.useState<string>(""); // State to store user input data for setdata method
  const [setstatus, setSetStatus] = React.useState<boolean>(false); // State to manage loading status of setdata operation
  const [setnotification, setSetNotification] = React.useState<string>(""); // State to store transaction ID of setdata call

  // Function to call the getdata method of ContractB
  const getdata = async () => {
    setGetNotification(""); // Clear previous notification
    setData(""); // Clear previous data
    setGetStatus(true); // Set loading status to true
    const result = await appCaller.getdata({}, { apps: [ContractAappId] }); // Call getdata method with ContractA's app ID as foreign app
    const txnid = result.transaction.txID(); // Extract transaction ID from result
    const data = result.return as string; // Extract returned data from result
    setData(data); // Update data state with fetched data
    setGetNotification(txnid); // Update notification state with transaction ID
    setGetStatus(false); // Set loading status to false
  };

  // Function to call the setdata method of ContractB
  const setdata = async () => {
    setSetNotification(""); // Clear previous notification
    setSetStatus(true); // Set loading status to true
    const result = await appCaller.setdata({ d: "  " + typeddata }, { apps: [ContractAappId] }); // Call setdata method with user input and ContractA's app ID
    const txnid = result.transaction.txID(); // Extract transaction ID from result
    setTypedData(""); // Clear input field
    setSetNotification(txnid); // Update notification state with transaction ID
    setSetStatus(false); // Set loading status to false
  };

  return (
    <div className="App">
      {/* Section for calling getdata method */}
      <div className="getdata_wrap">
        <input type="text" value={data} readOnly></input>
        <button
          disabled={getstatus}
          onClick={(e) => {
            getdata();
          }}
        >
          {getstatus == true ? "Fetching.." : "Get Data"}
        </button>
        {getnotification == "" ? null : (
          <div className="notification">
            Called getdata method in Contract B with TXN Id :{" "}
            <a target="_blank" href={transaction_explorer_baseurl + getnotification}>
              {getnotification}
            </a>
          </div>
        )}
      </div>
      {/* Section for calling setdata method */}
      <div className="setdata_wrap">
        <input
          maxLength={100}
          onChange={(e) => {
            setTypedData(e.target.value);
          }}
          type="text"
        ></input>
        <button
          disabled={setstatus}
          onClick={(e) => {
            setdata();
          }}
        >
          {setstatus == true ? "Sending Transaction.." : "Set Data"}
        </button>
        {setnotification == "" ? null : (
          <div className="notification">
            Called setdata method in Contract B with TXN Id :{" "}
            <a target="_blank" href={transaction_explorer_baseurl + setnotification}>
              {setnotification}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
