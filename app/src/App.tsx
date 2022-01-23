import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { WalletConnectionProvider } from "./providers/WalletConnectionProvider";
import { Router } from "./containers";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    <div className="app">
      <SnackbarProvider>
        <WalletConnectionProvider>
          <WalletModalProvider>
            <header className="flex justify-end items-center">
              <div className="px-12 py-2">
                <WalletMultiButton />
              </div>
            </header>
            <Router />
          </WalletModalProvider>
        </WalletConnectionProvider>
      </SnackbarProvider>
    </div>
  );
}

export default App;
