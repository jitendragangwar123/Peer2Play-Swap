
import { ethers } from "ethers";
import { TOKEN_A_ABI,TOKEN_A_ADDRESS,TOKEN_B_ABI,TOKEN_B_ADDRESS,LIQUIDITY_POOL_ABI, LIQUIDITY_POOL_ADDRESS } from "../../constants/index";

export const getContract = async() => {
    if (typeof (window as any).ethereum === "undefined") {
      throw new Error("MetaMask is not installed!");
    }
  
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(LIQUIDITY_POOL_ADDRESS, LIQUIDITY_POOL_ABI, signer);
};

export const getContractA =async()=>{
    if (typeof (window as any).ethereum === "undefined") {
        throw new Error("MetaMask is not installed!");
      }
    
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      return new ethers.Contract(TOKEN_A_ADDRESS, TOKEN_A_ABI, signer);
}

export const getContractB =async()=>{
    if (typeof (window as any).ethereum === "undefined") {
        throw new Error("MetaMask is not installed!");
      }
    
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      return new ethers.Contract(TOKEN_B_ADDRESS, TOKEN_B_ABI, signer);
}

export const themeConstant = {
    DARK: 'dark',
    LIGHT: 'light'
}


