import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { WalletAuthenticator } from "@thirdweb-dev/auth";
import dotenv from "dotenv";

dotenv.config();

const sdk = new ThirdwebSDK("mainnet"); // You can also use "goerli" or any other supported network

const authenticator = new WalletAuthenticator(sdk, {
  secret: process.env.THIRDWEB_SECRET,
});

export { sdk, authenticator };