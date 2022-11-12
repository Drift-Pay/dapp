import { useState, useContext } from 'react';
import { useSignMessage, useBalance } from 'wagmi';
import { AdminContext } from '../AdminPanel';
import { AppContext } from '../../../App';

import { isAddress } from 'ethers/lib/utils';

import { Card, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { ObjectDisplay } from '../../ObjectDisplay';

import { FirstTimeSetupDirections } from './FirstTimeSetupDirections';
import { FirstTimeSetupProgression } from './FirstTimeSetupProgression';
import { SendGasForm } from '../../utils/SendGasForm';
import { KeyCheck } from '../../utils/KeyCheck';
import { userAuth } from '../../utils/request';

import cryptoRandomString from 'crypto-random-string';

const diagTemp = {
  address: undefined,
  port: undefined,
  paths: undefined,
  frontend: undefined,
  ipfs: undefined,
};

const keyTemp = {
  address: undefined,
  id: undefined,
  ownedBy: undefined,
};

let inputsTemp = {
  command: 'deploy',
  chainId: undefined,
  selfService: false,
  keyConfig: {
    sKeyId: undefined,
    sKeyAddress: undefined,
    eKeyId: undefined,
    eKeyAddress: undefined,
  },
};

export function FirstTimeSetup() {
  const { account, network } = useContext(AppContext);
  const { skdb } = useContext(AdminContext);
  const [message, setMessage] = useState();
  const sig = useSignMessage();
  if (!message)
    setMessage(cryptoRandomString({ length: 132, type: 'alphanumeric' }));

  const [apiError, setApiError] = useState('');

  const [diag, setDiag] = useState(diagTemp);
  const [inputs, setInputs] = useState({
    ...inputsTemp,
    chainId: network.chain.id,
  });
  const balance = useBalance({
    addressOrName: diag.address,
    watch: true,
    formatUnits: 'wei',
  });

  function handleDiagnostics() {
    setRefreshing(true);
    fetch(`/diag`)
      .then(async (res) => {
        const response = await res.json();
        if (!res.ok) {
          const error = (response && response.message) || res.statusText;
          setRefreshing(false);
          return Promise.reject(error);
        }
        setDiag({ ...response });
        setRefreshing(false);
      })
      .catch((error) => console.error(error));
  }

  const [step, setStep] = useState(0);

  function proceed(event) {
    event.preventDefault();
    if (step === 0) handleDiagnostics();
    if (step === 3) {
      const newInputs = {
        ...inputs,
        keyConfig: {
          sKeyId: sKey.id,
          sKeyAddress: sKey.address,
          eKeyId: eKey.id,
          eKeyAddress: eKey.address,
        },
      };
      setInputs(newInputs);
      sig.signMessage({ message });
    }
    if (step === 4) {
      let old = inputs;
      delete old.user;
      setInputs({
        ...inputs,
        user: userAuth(account.address, message, sig.data),
      });
    }
    if (step === 5) {
      if (sig.error) {
        let old = inputs;
        delete old.user;
        setInputs(old);
        setStep(2);
        return;
      }
      setRefreshing(true);

      fetch('server', {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: {
            command: inputs.command,
            chainId: inputs.chainId,
            selfService: inputs.selfService,
          },
          user: { ...inputs.user },
        }),
      })
        .then(async (res) => {
          console.log(res);
          setRefreshing(false);
          window.location.reload();
        })
        .catch((e) => {
          setApiError(e);
          setRefreshing(false);
        });
    }
    setStep(step + 1);
  }

  const [refreshing, setRefreshing] = useState(false);
  const [checking, setChecking] = useState(false);
  const [sKey, setSKey] = useState(keyTemp);
  const [eKey, setEKey] = useState(keyTemp);

  function handleSkip(event) {
    event.preventDefault();
    let edited = inputs;
    delete edited.keyConfig;
    setInputs(edited);
    sig.signMessage({ message });
    setStep(4);
  }

  return (
    <Card as={Col} text="black">
      <Card.Body>
        <Card.Title>First Time Setup</Card.Title>
        <hr />
        <FirstTimeSetupDirections step={step} />
        {step === 1 && (
          <div>
            Recommended Minimum: 0.5 Native Gas Units
            {diag.address && (
              <div>
                <br />
                Your Server's Address is {diag.address}
                <br />
                Balance: {parseInt(balance.data?.formatted) / 10 ** 18}{' '}
                {balance.data?.symbol}
                <br />
                {step === 1 && <SendGasForm to={diag.address} />}
              </div>
            )}
          </div>
        )}
        {step === 2 && (
          <div>
            <InputGroup>
              <InputGroup.Text>NFT</InputGroup.Text>
              <InputGroup.Text>Address</InputGroup.Text>
              <Form.Control
                name="nftAddress"
                aria-label="Skeleton Key Contract"
                type="text"
                placeholder="0x..."
                disabled={checking || sKey.ownedBy === diag.address}
                onChange={(e) => setSKey({ ...sKey, address: e.target.value })}
              />
              <InputGroup.Text>ID</InputGroup.Text>
              <Form.Control
                name="nftId"
                aria-label="Skeleton Key Id"
                type="number"
                disabled={checking || sKey.ownedBy === diag.address}
                placeholder={0}
                min={0}
                step={1}
                onChange={(e) => setSKey({ ...sKey, id: e.target.value })}
              />
              {sKey !== keyTemp && sKey.id && isAddress(sKey.address) && (
                <KeyCheck
                  account={account.address}
                  server={diag.address}
                  state={{ get: sKey, set: setSKey }}
                  checking={checking}
                  setChecking={setChecking}
                  forceDisable={false}
                />
              )}
            </InputGroup>
            <div>
              {step === 2 &&
                sKey !== keyTemp &&
                isAddress(sKey.address) &&
                sKey.id &&
                sKey.ownedBy &&
                sKey.ownedBy !== diag.address && (
                  <div>Result: {sKey.ownedBy}</div>
                )}
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <InputGroup>
              <InputGroup.Text>NFT</InputGroup.Text>
              <InputGroup.Text>Address</InputGroup.Text>
              <Form.Control
                name="nftAddress"
                aria-label="Executive Key Contract"
                type="text"
                placeholder="0x..."
                disabled={
                  checking ||
                  (eKey.ownedBy === diag.address &&
                    (eKey.address !== sKey.address || eKey.id !== sKey.id))
                }
                onChange={(e) => setEKey({ ...eKey, address: e.target.value })}
              />
              <InputGroup.Text>ID</InputGroup.Text>
              <Form.Control
                name="nftId"
                aria-label="Executive Key Id"
                type="number"
                placeholder={0}
                min={0}
                step={1}
                disabled={
                  checking ||
                  (eKey.ownedBy === diag.address &&
                    (eKey.address !== sKey.address || eKey.id !== sKey.id))
                }
                onChange={(e) => setEKey({ ...eKey, id: e.target.value })}
              />
              {eKey !== keyTemp && eKey.id && isAddress(eKey.address) && (
                <KeyCheck
                  account={account.address}
                  server={diag.address}
                  state={
                    step === 2
                      ? { get: sKey, set: setSKey }
                      : { get: eKey, set: setEKey }
                  }
                  checking={checking}
                  setChecking={setChecking}
                  forceDisable={
                    eKey.ownedBy === diag.address &&
                    (eKey.address !== sKey.address || eKey.id !== sKey.id)
                  }
                />
              )}
            </InputGroup>
            <div>
              {eKey !== keyTemp &&
                isAddress(eKey.address) &&
                eKey.id &&
                eKey.ownedBy &&
                eKey.ownedBy !== diag.address && (
                  <div>Result: {eKey.ownedBy}</div>
                )}
            </div>
          </div>
        )}
        {(step === 4 || step === 5) && (
          <div>
            Inputs:
            <br />
            <ObjectDisplay entity={inputs} />
          </div>
        )}
        {step === 6 &&
          (refreshing ? (
            <strong>Setting Up Your Server... Please Wait</strong>
          ) : apiError ? (
            <div>{apiError}</div>
          ) : (
            <div>
              <strong>Your backend is set up!</strong>
              <br />
              Please Refresh This Page
            </div>
          ))}

        <div>
          {((step === 2 && sKey.ownedBy === diag.address) ||
            (step === 3 &&
              eKey.ownedBy === diag.address &&
              (eKey.address !== sKey.address || eKey.id !== sKey.id))) && (
            <div>The backend server holds this token. Ready to proceed!</div>
          )}
        </div>
      </Card.Body>
      <Card.Footer>
        {!sig.isLoading && (
          <FirstTimeSetupProgression
            step={{ num: step, proceed }}
            refreshing={refreshing}
            checking={checking}
            balance={balance.data}
            server={diag.address}
            sKey={sKey}
            eKey={eKey}
            handleSkip={handleSkip}
          />
        )}
      </Card.Footer>
    </Card>
  );
}
