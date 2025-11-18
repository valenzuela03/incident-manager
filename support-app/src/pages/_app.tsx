import { UserProvider } from './../utils/UserContext';

function MyApp({ Component, pageProps } : any) {
    return (
        <UserProvider>
            <Component {...pageProps} />
        </UserProvider>
    );
}

export default MyApp;