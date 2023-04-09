import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, Input, Tabs } from "antd";
import { utils } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { useWalletContext } from "./WalletProvider";
import server from "./server";

const UseWallet = ({}) => {
  const { privateKey, setPrivateKey } = useWalletContext();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPrivateKey(event.target.value);
  };

  return (
    <label>
      Private Key
      <Input
        placeholder="Insert your private key here"
        value={privateKey}
        onChange={handleChange}
      />
    </label>
  );
};

const CreateWallet = ({}) => {
  const { privateKey, setPrivateKey, publicKey } = useWalletContext();

  const handleWalletCreate = () => {
    const generatedPrivateKey = utils.randomPrivateKey();
    setPrivateKey(toHex(generatedPrivateKey));
  };

  return (
    <div>
      <Button type="primary" onClick={handleWalletCreate}>
        Create wallet
      </Button>
      <label>
        Private Key
        <Input disabled value={privateKey} />
      </label>
      <label>
        Address
        <Input disabled value={publicKey} />
      </label>
    </div>
  );
};

function Wallet() {
  const { publicKey } = useWalletContext();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    (async () => {
      if (publicKey) {
        const {
          data: { balance },
        } = await server.get(`balance/${publicKey}`);
        setBalance(balance);
      } else {
        setBalance(0);
      }
    })();
  }, [publicKey]);

  const items = [
    {
      key: "existing-wallet",
      label: `Use wallet`,
      children: <UseWallet />,
    },
    {
      key: "new-wallet",
      label: `Create wallet`,
      children: <CreateWallet />,
    },
  ];

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <Tabs defaultActiveKey="1" items={items} />

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
