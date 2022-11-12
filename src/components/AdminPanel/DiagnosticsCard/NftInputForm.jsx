import { useContext } from 'react';
import { useContract } from 'wagmi';
import { AppContext } from '../../../App';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { isAddress } from 'ethers/lib/utils';
import * as extract from '../../utils/extract';

export function NftInputForm(props) {
  const abi = extract.fromInterface('ERC721');
  const { account, info, signerOrProvider } = useContext(AppContext);
  const { stage, nft, setNft, checking, setChecking } = props;

  const buttonText = () => {
    if (checking) return 'Validating...';
    else if (nft.ownedBy === account.address) return 'Transfer';
    else return 'Validate';
  };

  const contract = useContract({ abi, signerOrProvider, address: nft.address });
  function handleToken(event) {
    event.preventDefault();
    setChecking(true);
    if (buttonText() === 'Validate')
      contract
        .ownerOf(nft.id)
        .then((ownedBy) => {
          setNft({ ...nft, ownedBy });
          setChecking(false);
        })
        .catch((error) => {
          setNft({ ...nft, ownedBy: error.toString() });
          setChecking(false);
        });
    else if (buttonText() === 'Transfer')
      contract
        .transferFrom(account.address, info.deployer, nft.id)
        .then(async (tx) => {
          await tx.wait();
          const ownedBy = await contract.ownerOf(nft.id);
          setNft({ ...nft, ownedBy });
          setChecking(false);
        })
        .catch((e) => {
          setChecking(false);
        });
  }

  const disableInput = () => checking || nft.ownedBy === info.deployer;

  return (
    <div>
      <h6>{stage}</h6>
      <InputGroup>
        <InputGroup.Text>Address</InputGroup.Text>
        <Form.Control
          name={`nftAddress-${stage}`}
          aria-label={`${stage} Contract`}
          type="text"
          placeholder="0x..."
          disabled={disableInput()}
          onChange={(e) => setNft({ ...nft, address: e.target.value })}
        />
        <InputGroup.Text>ID</InputGroup.Text>
        <Form.Control
          name={`nftId-${stage}`}
          aria-label={`${stage} ID`}
          type="number"
          disabled={disableInput()}
          placeholder={0}
          min={0}
          step={1}
          onChange={(e) => setNft({ ...nft, id: e.target.value })}
        />
        <Button disabled={disableInput()} onClick={handleToken}>
          {buttonText()}
        </Button>
      </InputGroup>
      {nft.ownedBy &&
        (!isAddress(nft.ownedBy)
          ? nft.ownedBy
          : nft.ownedBy === account.address
          ? `Valid Token: Please Transfer to Continue`
          : `ownedBy: ${nft.ownedBy}`)}
    </div>
  );
}
