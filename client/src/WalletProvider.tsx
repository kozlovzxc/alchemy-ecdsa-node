import { getPublicKey } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

export type WalletContextType = {
  privateKey?: string;
  setPrivateKey: (newPrivateKey: string) => void;
  publicKey?: string;
};

export const WalletContext = createContext<WalletContextType>({
  privateKey: undefined,
  publicKey: undefined,
  setPrivateKey: () => {},
});

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const [privateKey, setPrivateKey] = useState<string | undefined>(undefined);
  const [publicKey, setPublicKey] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (privateKey != null) {
      try {
        const newPublicKey = toHex(getPublicKey(privateKey));
        setPublicKey(newPublicKey);
      } catch (e) {
        // pass
      }
    }
  }, [privateKey]);

  return (
    <WalletContext.Provider value={{ privateKey, setPrivateKey, publicKey }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => useContext(WalletContext);
