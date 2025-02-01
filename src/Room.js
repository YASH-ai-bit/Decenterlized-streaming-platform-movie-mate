import { BrowserProvider, Contract } from "ethers"; // Import BrowserProvider and Contract
import RoomContractABI from "./RoomContractABI.json";

const contractAddress = "0x2C3244b037F71A39ef01f89FeFEc1a4132e68EA0";

export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed. Please install it to use this app.");
  }

  const provider = new BrowserProvider(window.ethereum); // Use BrowserProvider in Ethers v6
  const signer = await provider.getSigner(); // Get the signer for the current account
  const contract = new Contract(contractAddress, RoomContractABI, signer); // Use Contract directly
  return contract;
};

export default getContract;