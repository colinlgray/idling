import { AppProps } from "next/app";
import Head from "next/head";
import { FC } from "react";
import { ContextProvider } from "../contexts/ContextProvider";
import { ContentContainer } from "../components/ContentContainer";
import { AppBar } from "../components/AppBar";
import { Footer } from "../components/Footer";
import { Sidebar } from "../components/Sidebar";
import { AppTitle } from "../components/AppTitle";
import Notifications from "../components/Notification";

require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <AppTitle />

      <ContextProvider>
        <Notifications />
        <div className="flex flex-row min-h-screen bg-gray-400 text-gray-100">
          <Sidebar />
          <main className="main flex flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
            <AppBar />
            <div className="main-content flex flex-col flex-grow p-4">
              <ContentContainer>
                <Component {...pageProps} />
              </ContentContainer>
            </div>
            <Footer />
          </main>
        </div>
      </ContextProvider>
    </>
  );
};

export default App;
