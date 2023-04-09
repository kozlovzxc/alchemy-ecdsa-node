import React from "react";
import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import "antd/dist/reset.css";
import { WalletProvider } from "./WalletProvider";

function App() {
  return (
    <WalletProvider>
      <div className="app">
        <Wallet />
        <Transfer />
      </div>
    </WalletProvider>
  );
}

export default App;
