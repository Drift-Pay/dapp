import { createContext, useState, useEffect } from 'react';
import { useAccount, useNetwork, useSigner } from 'wagmi';

import NavigationBar from './components/NavigationBar';
import { AdminPanel } from './components/AdminPanel/AdminPanel';

export const AppContext = createContext(null);

export function App(props) {
  const { backendUrl, name } = props;
  const network = useNetwork();
  const account = useAccount();
  const signer = useSigner();
  const [info, setInfo] = useState();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(undefined);
  useEffect(() => {
    if (!loading && !info && account.address && network.chain?.id) {
      console.log('Fetching inital input');
      setLoading(true);
      fetch(`server`, {
        mode: 'cors',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          address: account.address,
          chainId: network.chain.id.toString(),
        },
      })
        .then(async (response) => {
          const data = await response.json();
          console.log(data);
          if (data.status === 404) {
            setInfo({
              deployer: data.deployer,
              server: { accessTier: 4 },
            });
            setShowPanel({ ...showPanel, admin: true });
          } else {
            setInfo({ ...data });
            if (data.server.accessTier > 0)
              setShowPanel({ ...showPanel, admin: true });
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  }, [loading, info, account.address, network.chain]);

  const [showPanel, setShowPanel] = useState({
    admin: false,
  });

  return (
    <div>
      <NavigationBar
        name={name}
        info={info}
        panel={{ set: setShowPanel, get: showPanel }}
      />
      <AppContext.Provider
        value={{
          account,
          network,
          signerOrProvider: signer.data,
          info,
          setInfo,
          backendUrl,
        }}
      >
        {network.chain?.id && showPanel.admin && <AdminPanel />}
      </AppContext.Provider>
    </div>
  );
}
