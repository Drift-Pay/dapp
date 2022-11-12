import * as React from 'react';

let inputsTemp = {
  command: 'edit',
  chainId: undefined,
  selfService: false,
};

export function ApiPanel(props) {
  const { skdb, signer, base, accessTier } = props;
  const { backendUrl, info, operator, network } = base;

  const [inputs, setInputs] = React.useState({
    ...inputsTemp,
    chainId: network.chain.id,
  });

  return <div />;
}
