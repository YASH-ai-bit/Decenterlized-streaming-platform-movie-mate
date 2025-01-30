import { BrowserProvider, Contract } from "ethers";
import RoomContractABI from "./RoomContractABI.json";

const contractAddress = "0xADc4af9DDB9118b678845ACaAE6D805f3c3be8fb";

export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed. Please install it to use this app.");
  }

  const provider = new BrowserProvider(window.ethereum); // Use BrowserProvider in Ethers v6
  const signer = await provider.getSigner(); // Get the signer for the current account 
  const contract = new Contract(contractAddress, RoomContractABI, signer);  
  return contract;
};
