const express = require("express");
const app = express();
const cors = require("cors");
const { recoverPublicKey, verify } = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const port = 3042;

app.use(cors());
app.use(express.json());

const testWallets = [
  {
    privateKey:
      "932bb414565eac84a4129e555146b1b5b3a3239721003a22436891b4b068e041",
    publicKey:
      "04af826e55da20a8f4472ce22f06193646ca1467e7196c939f0f588aafab5bb33cbe07f6574e63417cea465404a39ed963d79caeb0a12a107b1d5195a08e0aad41",
  },
  {
    privateKey:
      "64a0ee534186bcbaabc048c83192171b0a83d5d69220e8c15957607eea676f71",
    publicKey:
      "0429699afbcc13918bc283d971386099d46d367466c64d4079f571c5994a563d78f7a53de8690ffe36802f59335a866c7f06bde6c191a8618adfecb5cf12bd2f2a",
  },
  {
    privateKey:
      "6bfbb5d3415b4398f5a789c0d833e5b4b585a2e79361a24a35bc58af3a79cbf3",
    publicKey:
      "04c963e0c31ecc561d98a0e3082313b0a3c608a0c80d7c5c5a421084f9923a94502bea7d09982cf964c1949c18295534d248e9a614386de47591e261a22ce82897",
  },
];

const balances = {
  "04af826e55da20a8f4472ce22f06193646ca1467e7196c939f0f588aafab5bb33cbe07f6574e63417cea465404a39ed963d79caeb0a12a107b1d5195a08e0aad41": 100,
  "0429699afbcc13918bc283d971386099d46d367466c64d4079f571c5994a563d78f7a53de8690ffe36802f59335a866c7f06bde6c191a8618adfecb5cf12bd2f2a": 50,
  "04c963e0c31ecc561d98a0e3082313b0a3c608a0c80d7c5c5a421084f9923a94502bea7d09982cf964c1949c18295534d248e9a614386de47591e261a22ce82897": 75,
};

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { signature, recovered, hash, ...payload } = req.body;

  const publicKey = toHex(recoverPublicKey(hash, signature, recovered));

  const isValid = verify(signature, hash, publicKey);
  if (!isValid) {
    res.status(400).send("signature is invalid");
    return;
  }

  const sender = publicKey;
  const { recipient, amount } = payload;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
