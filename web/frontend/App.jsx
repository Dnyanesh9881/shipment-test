import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Routes from "./Routes";
import { NavigationBar, PolarisProvider, QueryProvider, TopBar, AppBridgeProvider, ProductsCard } from "./components";
import { NavMenu } from "@shopify/app-bridge-react";
import "./App.css"


export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.glob("./pages/**/!(*.test.[jt]sx)*.([jt]sx)", { eager: true });
  const { t } = useTranslation();

  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <QueryProvider>
            <NavMenu
              navigationLinks={[
                
              ]}
            />
            <div className="main-section">
              <div className="menu-section">
                <NavigationBar />
              </div>
              <div className="content-section">
                <TopBar />
                <Routes pages={pages} />
                {/* <ProductsCard /> */}
              </div>
            </div>
          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}