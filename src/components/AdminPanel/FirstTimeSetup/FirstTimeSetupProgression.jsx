import * as React from 'react';
import { Button } from 'react-bootstrap';

const msg = [
  'Get Started!',
  'Designate Skeleton Key',
  'Designate Executive Key',
  'Review Inputs',
  'Looks Good to Me!',
  'Deploy!',
];

function ProcessionButton(props) {
  const { step } = props;
  return <Button onClick={step.proceed}>{msg[step.num]}</Button>;
}

export function FirstTimeSetupProgression(props) {
  const {
    step,
    refreshing,
    checking,
    balance,
    server,
    sKey,
    eKey,
    handleSkip,
  } = props;
  if (checking) {
    return <small className="text-muted">Confirming...</small>;
  } else if (refreshing) {
    return <small className="text-muted">Awaiting Response...</small>;
  } else if (step.num === 0) {
    return <ProcessionButton step={step} />;
  } else if (step.num === 1 && server && parseInt(balance?.formatted) !== 0) {
    return <ProcessionButton step={step} />;
  } else if (step.num === 2) {
    if (sKey.ownedBy === server) return <ProcessionButton step={step} />;
    else
      return (
        <Button onClick={handleSkip}>Mint One for Me (Recommended)</Button>
      );
  } else if (step.num === 3) {
    if (
      eKey.ownedBy === server &&
      (sKey.address !== eKey.address || sKey.id !== eKey.id)
    )
      return <ProcessionButton step={step} />;
    else
      return (
        <Button onClick={handleSkip}>Mint One for Me (Recommended)</Button>
      );
  } else if (step.num === 4) {
    return <ProcessionButton step={step} />;
  } else if (step.num === 5) {
    return <ProcessionButton step={step} />;
  } else return <div />;
}
