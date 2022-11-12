import { useState, useContext } from 'react';
import { useSignMessage } from 'wagmi';
import { AppContext } from '../../../App';
import { InputGroup, Button } from 'react-bootstrap';
import { NftInputForm } from './NftInputForm';
import cryptoRandomString from 'crypto-random-string';

const defaultKey = {
  address: undefined,
  id: undefined,
  ownedBy: undefined,
};

export function CombinedNftForm() {
  const { account, network, info, signerOrProvider } = useContext(AppContext);
  const [refreshing, setRefreshing] = useState(false);
  const [checking, setChecking] = useState(false);
  const [sKey, setSKey] = useState(defaultKey);
  const [eKey, setEKey] = useState(defaultKey);
  const [message, setMessage] = useState();
  const sig = useSignMessage();
  if (!message)
    setMessage(cryptoRandomString({ length: 132, type: 'alphanumeric' }));

  const stage = () =>
    sKey.ownedBy !== info.deployer
      ? 'Skeleton Key'
      : eKey.ownedBy !== info.deployer
      ? 'Executive Key'
      : 'Submit';

  const createKeyConfig = () => {
    return [sKey.id, sKey.address, eKey.id, eKey.address].includes(undefined)
      ? undefined
      : {
          sKeyId: sKey.id,
          sKeyAddress: sKey.address,
          eKeyId: eKey.id,
          eKeyAddress: eKey.address,
        };
  };

  function handleSkip(event) {
    event.preventDefault();
    setSKey(defaultKey);
    setEKey(defaultKey);
    if (stage() !== 'Submit') sig.signMessage({ message });
  }

  function handleRequest(event) {
    event.preventDefault();
    if (!sig.data) {
      sig.signMessage({ message });
      return;
    }
    if (refreshing) return;

    setRefreshing(true);

    let obj = {
      inputs: { keyConfig: undefined },
      user: {
        address: account.address,
        message,
        signature: sig.data,
      },
    };
    if (createKeyConfig()) obj.inputs.keyConfig = createKeyConfig();
    const body = JSON.stringify(obj);

    fetch(`storefront/${network.chain.id}`, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
      .then(async (res) => {
        const data = await res.json();
        console.log(data);
        setRefreshing(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error.toString());
        setRefreshing(false);
      });
  }

  const buttonText = () =>
    sig.isLoading
      ? 'Signing...'
      : stage() === 'Submit'
      ? 'Reset'
      : 'Mint One for Me (Recommended)';

  if (refreshing)
    return <div>Please Wait While Your New StoreFront Contract Deploys...</div>;

  return (
    <div>
      {stage() === 'Skeleton Key' && !sig.data && (
        <NftInputForm
          stage="StoreFront Skeleton Key"
          nft={sKey}
          setNft={setSKey}
          checking={checking}
          setChecking={setChecking}
        />
      )}
      {stage() === 'Executive Key' && !sig.data && (
        <NftInputForm
          stage="StoreFront Executive Key"
          nft={eKey}
          setNft={setEKey}
          checking={checking}
          setChecking={setChecking}
        />
      )}
      {(stage() === 'Submit' || sig.data) && (
        <div>
          <h6>Review</h6>
          <div>
            Skeleton Key:
            {sKey.address ? (
              <ul>
                <li>Address: {sKey.address}</li>
                <li>ID: {sKey.id}</li>
              </ul>
            ) : (
              ' (Auto)'
            )}
          </div>
          <div>
            Executive Key:
            {eKey.address ? (
              <ul>
                <li>Address: {eKey.address}</li>
                <li>ID: {eKey.id}</li>
              </ul>
            ) : (
              ' (Auto)'
            )}
          </div>
          {(sig.isSuccess || sig.isError) && (
            <div>
              Signature:
              <br />
              {sig.data}
            </div>
          )}
        </div>
      )}
      <br />

      <InputGroup>
        {!sig.isSuccess && (
          <Button
            onClick={handleSkip}
            variant={
              buttonText() === 'Signing...'
                ? 'primary'
                : buttonText() === 'Reset'
                ? 'danger'
                : 'warning'
            }
            disabled={sig.isLoading}
          >
            {buttonText()}
          </Button>
        )}
        {((stage() === 'Submit' && buttonText() !== 'Signing...') ||
          sig.isSuccess) && (
          <Button variant="success" onClick={handleRequest}>
            {!sig.isSuccess ? 'Sign' : 'Submit'}
          </Button>
        )}
      </InputGroup>

      <br />
      {sig.isError && 'User Denied Signature'}
    </div>
  );
}
