import '../styles/globals.css';
import '../styles/Modal.css';
import type { AppProps } from 'next/app';
import { PatientProvider } from '../contexts/PatientContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PatientProvider>
      <Component {...pageProps} />
    </PatientProvider>
  );
}

export default MyApp;