import { useBalance } from 'wagmi';

export function GetBalance(props) {
  const { addressOrName, watch, balance, setBalance } = props;
  const { data, isError, isLoading } = useBalance({
    addressOrName,
    watch,
    formatUnits: 'ether',
  });

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  if (setBalance) setBalance(parseInt(data.formatted));
  return (
    <div>
      Balance: {balance} {data?.symbol}
    </div>
  );
}
