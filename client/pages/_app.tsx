import "../styles/globals.scss";
import ContentLayout from "../shared/layout-components/layout/content-layout";
import Authenticationlayout from "../shared/layout-components/layout/authentication-layout";
import Landinglayout from "@/shared/layout-components/layout/landing-layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
// import AuthProvider from "@/shared/Providers/AithProvider";

const queryClient = new QueryClient();

const layouts: any = {
  Contentlayout: ContentLayout,
  Landinglayout: Landinglayout,
  Authenticationlayout: Authenticationlayout,
};

function MyApp({ Component, pageProps }: any) {
  const Layout =
    layouts[Component.layout] ||
    ((pageProps: any) => <Component>{pageProps}</Component>);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools buttonPosition="bottom-left" />
      <Toaster />
      {/* <AuthProvider> */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
      {/* </AuthProvider> */}
    </QueryClientProvider>
  );
}

export default MyApp;
