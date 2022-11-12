import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useContract, useSigner } from 'wagmi';

import * as extract from './extract';

export function KeyCheck(props) {
  const { operator, server, state, checking, setChecking } = props;

  const { data: signer, isError, isLoading } = useSigner();
  const nftContract = useContract({
    address: state.get.address,
    abi: extract.fromInterface('ERC721'),
    signerOrProvider: signer,
  });

  function handleCheck(event) {
    event.preventDefault();
    if (!checking) setChecking(true);
    nftContract
      .ownerOf(state.get.id)
      .then((res) => {
        state.set({
          ...state.get,
          ownedBy: res,
        });
        setChecking(false);
      })
      .catch((e) => {
        const asString = e.toString();
        state.set({
          ...state.get,
          ownedBy:
            asString ===
            "TypeError: Cannot read properties of null (reading 'call')"
              ? 'Invalid Contract Address'
              : asString,
        });
        setChecking(false);
      });
  }

  function handleDelivery(event) {
    event.preventDefault();
    setChecking(true);
    nftContract
      .transferFrom(operator, server, state.get.id)
      .then(async (tx) => {
        const res = await tx.wait();
        console.log(res);
        handleCheck(event);
      })
      .catch((e) => {
        const asString = e.toString();
        state.set({
          ...state.get,
          ownedBy: asString.split(';')[0],
        });
        setChecking(false);
      });
  }

  if (state.get.ownedBy === server) return <div />;

  return (
    <Button
      onClick={state.get.ownedBy === operator ? handleDelivery : handleCheck}
      disabled={checking || isLoading || server === state.ownedBy}
    >
      {checking || isLoading
        ? 'Processing...'
        : state.get.ownedBy === operator
        ? 'Transfer'
        : 'Assess'}
    </Button>
  );
}
