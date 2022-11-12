import { useState, useContext } from 'react';
import { useContract } from 'wagmi';
import { AppContext } from '../../../App';
import { AdminContext } from '../AdminPanel';
import { isAddress } from 'ethers/lib/utils';
import * as extract from '../../utils/extract';

import { Form, InputGroup, Button } from 'react-bootstrap';
import { WithContext as ReactTags } from 'react-tag-input';

export function RedefineHigherKey(props) {
  const { skdb, lock, setLock } = useContext(AdminContext);
  const { account, signerOrProvider } = useContext(AppContext);
  const { action, asset, db } = props;

  const [key, setKey] = useState({ address: undefined, id: undefined });
  const [status, setStatus] = useState('');

  const abi = extract.fromInterface('ERC721');
  const contract = useContract({
    address: key.address,
    abi,
    signerOrProvider,
  });

  // const abi = extract.fromInterface(
  //   type === 'Backend' ? 'ServerAccessToken' : 'StoreFrontAccessToken'
  // );
  // const signerOrProvider = info.signerOrProvider;
  // const skeletonToken = useContract({
  //   abi,
  //   signerOrProvider,
  //   address: info[db].diag.skeleton.contract,
  // });
  // const executiveToken = useContract({
  //   abi,
  //   signerOrProvider,
  //   address: info[db].diag.executive.contract,
  // });
  // const adminToken = useContract({
  //   abi,
  //   signerOrProvider,
  //   address: info[db].diag.admin.contract,
  // });

  function handle(error) {
    setStatus(error.toString());
    setLock(false);
  }

  function handleExecution(event) {
    event.preventDefault();
    if (!lock) setLock(true);

    if (action === 'defineSkeletonKey')
      skdb[db]
        .defineSkeletonKey(asset, key.address, key.id)
        .then(() => {
          setStatus('Success!');
          setLock(false);
        })
        .catch((e) => handle(e));
    else if (action === 'defineExecutiveKey')
      skdb[db]
        .defineExecutiveKey(asset, key.address, key.id)
        .then(() => {
          setStatus('Success!');
          setLock(false);
        })
        .catch((e) => handle(e));
  }

  function handleCheck(event) {
    event.preventDefault();
    if (!lock) setLock(true);
    contract
      .ownerOf(key.id)
      .then((res) => {
        setStatus(res);
        setLock(false);
      })
      .catch((e) => handle(e));
  }

  const match = () =>
    action === 'defineSkeletonKey'
      ? status === account.address
      : isAddress(status);
  const canExecute = () => key.id && key.address && isAddress(key.address);
  const buttonText = () =>
    lock ? 'Processing' : match() ? 'Execute' : 'Assess';

  return (
    <div>
      <InputGroup>
        <InputGroup.Text>{action}</InputGroup.Text>
        <InputGroup.Text>Address</InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="0x..."
          disabled={lock}
          onChange={(e) => setKey({ ...key, address: e.target.value })}
        />
        <InputGroup.Text>ID</InputGroup.Text>
        <Form.Control
          type="number"
          disabled={lock}
          placeholder={0}
          min={0}
          step={1}
          onChange={(e) => setKey({ ...key, id: e.target.value })}
        />
        {canExecute() && (
          <Button
            onClick={match() ? handleExecution : handleCheck}
            disabled={lock}
          >
            {buttonText()}
          </Button>
        )}
      </InputGroup>

      <br />
      <p>
        {status}
        {status === 'Success!'
          ? ''
          : status === ''
          ? ''
          : match()
          ? ' - Eligible'
          : ' - Ineligible'}
      </p>
    </div>
  );
}

export function MintAdmin(props) {
  const { lock, setLock } = useContext(AdminContext);
  const { info, signerOrProvider } = useContext(AppContext);
  const { action, db } = props;

  const [address, setAddress] = useState();
  const [txStat, setTxStat] = useState('Ready');

  const abi = extract.fromInterface('ServerAccessToken');
  const adminToken = useContract({
    abi,
    signerOrProvider,
    address: info[db].diag.admin.contract,
  });

  function handleMint(event) {
    event.preventDefault();
    setLock(true);
    setTxStat('Processing...');
    adminToken
      ._mintTo(address)
      .then(async (tx) => {
        await tx.wait();
        setTxStat('Success!');
        setLock(false);
      })
      .catch((err) => {
        console.error(err);
        setTxStat(err.toString());
        setLock(false);
      });
  }

  return (
    <div>
      <InputGroup>
        <InputGroup.Text>{action}</InputGroup.Text>
        <InputGroup.Text>To</InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="0x..."
          disabled={lock}
          onChange={(e) => setAddress(e.target.value)}
        />
        {isAddress(address) && (
          <Button onClick={handleMint} disabled={lock}>
            Mint
          </Button>
        )}
      </InputGroup>
      {txStat}
    </div>
  );
}

export function ManageAdmins(props) {
  const { skdb, lock, setLock } = useContext(AdminContext);
  const { info, signerOrProvider } = useContext(AppContext);
  const { action, asset, db } = props;

  const [status, setStatus] = useState('Ready');

  const cache = () => info[db].diag.admin;

  const abi = extract.fromInterface('ServerAccessToken');
  const adminToken = useContract({
    abi,
    signerOrProvider,
    address: cache().contract,
  });

  const [ids, setIds] = useState([]);
  const suggestions = () =>
    cache().id.map((id) => {
      return {
        id: id.toString(),
        text: `${id.toString()} - ${cache().holder[cache().id.indexOf(id)]}`,
      };
    });
  const KeyCodes = {
    comma: 188,
    enter: 13,
  };
  const delimiters = [KeyCodes.comma, KeyCodes.enter];
  const handleDelete = (i) => {
    setIds(ids.filter((id, index) => index !== i));
  };
  const handleAddition = (id) => {
    setIds([...ids, id]);
  };
  const handleDrag = (id, currPos, newPos) => {
    const newIds = ids.slice();
    newIds.splice(currPos, 1);
    newIds.splice(newPos, 0, id);
    setIds(newIds);
  };
  const handleTagClick = (index) => {
    console.log('The tag at index ' + index + ' was clicked');
  };
  const onTagUpdate = (i, newId) => {
    const updatedIds = ids.slice();
    updatedIds.splice(i, 1, newId);
    setIds(updatedIds);
  };
  const onClearAll = () => {
    setIds([]);
  };

  const validInput = () => {
    return [] !== ids;
  };

  async function validateIds() {
    let validIds = [];
    for await (const id of ids) {
      try {
        await adminToken.ownerOf(id.id);
        validIds.push(parseInt(id.id));
      } catch (e) {}
    }
    return validIds;
  }

  function grantAccess(event) {
    event.preventDefault();
    setLock(true);
    setStatus('Validating...');
    validateIds()
      .then(async (validIds) => {
        if (validIds.length === 0) throw new Error('No valid Ids found...');
        setStatus('Processing...');
        await skdb[db].manageAdmins(asset, validIds, true);
        setStatus('Success!');
        setLock(false);
      })
      .catch((e) => {
        setStatus(e.toString());
        setLock(false);
      });
  }

  function revokeAccess(event) {
    event.preventDefault();
    setLock(true);
    setStatus('Validating...');
    validateIds()
      .then(async (validIds) => {
        if (validIds.length === 0) throw new Error('No valid Ids found...');
        setStatus('Processing...');
        await skdb[db].manageAdmins(asset, validIds, false);
        setStatus('Success!');
        setLock(false);
      })
      .catch((e) => {
        setStatus(e.toString());
        setLock(false);
      });
  }

  return (
    <div>
      <h6>{action}</h6>
      <ReactTags
        tags={ids}
        suggestions={suggestions()}
        delimiters={delimiters}
        handleDelete={handleDelete}
        handleAddition={handleAddition}
        handleDrag={handleDrag}
        handleTagClick={handleTagClick}
        onTagUpdate={onTagUpdate}
        inputFieldPosition="bottom"
        autocomplete
        editable
        clearAll
        onClearAll={onClearAll}
      />
      {validInput() && (
        <Button variant="success" onClick={grantAccess} disabled={lock}>
          Grant
        </Button>
      )}
      {validInput() && (
        <Button variant="danger" onClick={revokeAccess} disabled={lock}>
          Revoke
        </Button>
      )}
      <br />
      {status}
    </div>
  );
}
