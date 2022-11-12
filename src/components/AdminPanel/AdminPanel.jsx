import { createContext, useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useContract } from 'wagmi';
import { AppContext } from '../../App';

import * as extract from '../utils/extract';
import { DiagnosticsCard } from './DiagnosticsCard/DiagnosticsCard';
import { FirstTimeSetup } from './FirstTimeSetup/FirstTimeSetup';
import { SkdbPanel } from './SkdbPanel/SkdbPanel';
import { SkdbView } from './SkdbPanel/SkdbView';

export const AdminContext = createContext(null);

export function AdminPanel() {
  const { network, signerOrProvider, info, setInfo } = useContext(AppContext);
  const [lock, setLock] = useState(false);
  const skdb = (() => {
    let state = {};
    const settings = {
      abi: extract.fromInterface('SkeletonKeyDB'),
      signerOrProvider,
    };

    if (network.chain.id === info.server.chainId)
      state.server = useContract({
        address: info.server.skdb,
        ...settings,
      });

    if (info.storeFront?.skdb)
      state.storeFront = useContract({
        address: info.storeFront.skdb,
        ...settings,
      });

    return state;
  })();

  if (!info.storeFront?.accessTier && skdb.storeFront)
    skdb.storeFront
      .accessTier(info.storeFront.address, operator.address)
      .then((res) => {
        setInfo({
          ...info,
          storeFront: {
            ...info.storeFront,
            accessTier: parseInt(res),
          },
        });
      })
      .catch((error) => console.error(error));

  return (
    <AdminContext.Provider value={{ skdb, lock, setLock }}>
      <Container>
        <h3>Administrative Control Panel</h3>

        {info.server.accessTier === 4 ? (
          <Row>
            <FirstTimeSetup />
          </Row>
        ) : (
          <div>
            <Row>
              <DiagnosticsCard info={info} />
            </Row>

            {info.server.accessTier > 1 && skdb.server && (
              <Row>
                <SkdbPanel type="Backend" db="server" />
                <SkdbView type="Backend" db="server" />
              </Row>
            )}

            {info.storeFront.accessTier > 1 && skdb.storeFront && (
              <Row>
                <SkdbPanel type="Store Front" db="storeFront" />
                <SkdbView type="Store Front" db="storeFront" />
              </Row>
            )}
          </div>
        )}
      </Container>

      <br />
      <hr />
      <br />
    </AdminContext.Provider>
  );
}
