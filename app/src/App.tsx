import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletConnectionProvider } from "./providers/WalletConnectionProvider";
import { GameContainer } from "./containers";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    <div className="app">
      <SnackbarProvider>
        <WalletConnectionProvider>
          <WalletModalProvider>
            <GameContainer />
          </WalletModalProvider>
        </WalletConnectionProvider>
      </SnackbarProvider>
    </div>
  );
}

export default App;
