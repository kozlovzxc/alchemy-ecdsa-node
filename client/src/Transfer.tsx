import React, { useState } from "react";
import server from "./server";
import { useWalletContext } from "./WalletProvider";
import { signSync } from "ethereum-cryptography/secp256k1";
import { hexToBytes, toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { sha256 } from "ethereum-cryptography/sha256";

function Transfer() {
  const { privateKey } = useWalletContext();
  const [amount, setAmount] = useState(0);
  const [recipient, setRecipient] = useState("");

  const handleAmountChange = (evt) =>
    setAmount(parseInt(evt.target.value) || 0);
  const handleRecipientChange = (evt) => setRecipient(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    if (privateKey == null) {
      return;
    }

    const payload = {
      amount,
      recipient,
    };
    const hash = toHex(sha256(utf8ToBytes(JSON.stringify(payload))));
    const [signatureRaw, recovered] = signSync(hash, hexToBytes(privateKey), {
      recovered: true,
    });
    const signature = toHex(signatureRaw);

    try {
      const {
        data: { balance },
      } = await server.post(`/send`, {
        signature,
        recovered,
        hash,
        ...payload,
      });
      // TODO: update balance
    } catch (error) {
      alert(error.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={amount}
          onChange={handleAmountChange}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={handleRecipientChange}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
