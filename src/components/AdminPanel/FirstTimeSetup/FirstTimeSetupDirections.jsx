export function FirstTimeSetupDirections(props) {
  const { step } = props;
  if (step === 0)
    return (
      <div>
        <p>
          <strong>Welcome to your Web3-enabled backend for evmCommerce!</strong>
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;Since this server is not configured, register
          you as the formal owner. When you booted it up, it also generated a
          unique wallet; usable on any EVM. This means that it needs to hold a
          balance in order to automate on-chain duties on your behalf. At a
          minimum, this requires gas for deployment of access credentials.
        </p>
      </div>
    );
  else if (step === 1)
    return (
      <div>
        <p>
          <strong>Fund your Backend Wallet!</strong>
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;Your backend will register you as its owner
          via NFTs on a publicly, available SkeletonKeyDatabase (SKDB) Contract.
          To do this, we must first deploy a "Web2 Access Token", which is an
          NFT specifically designed to act as Employee ID Badges. As the owner,
          or fiduciary of, it is your responsibility to manage the
          administrative team.
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;However, we still need to assign a "Skeleton
          Key" & "Executive Key" before we can assign "Administrators". The
          "Admins" retain the lowest level of privileges over the machine and
          are given access to the least destructive functions (e.g. delivering
          invoices or editing the inventory). This is done to allow the
          enterprise-grade management of Web3 assets. To ensure compatibility,
          <strong> this process will turn your server into an NFT</strong>.
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;These accounts are managed by the designated
          "Executive Key" holder; who can grant or revoke these permissions on a
          whim, with bulk action. The "Skeleton Key" is given ultimate authority
          over assets registered on the SKDB; meaning that they can redesignate
          the authority of the "Executive Key". <strong>Keep it</strong> in a
          physical <strong>safe</strong> and do NOT connect it to the internet
          unless there as been a security breach because you will need it to
          regain control over your assets.
          <br />
        </p>
        <hr />
        <strong>
          NOTICE: Designating NFTs as "Skeleton Keys" will potentially turn them
          into securities!
        </strong>
        <hr />
      </div>
    );
  else if (step === 2)
    return (
      <div>
        <strong>Designate your Skeleton Key!</strong>
        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;This step requires you to temporarily loan an
          NFT to the backend so that the process of deployment can be automated.
          If you do not have an NFT, one will be minted instead. Do you have an
          NFT?
        </p>
      </div>
    );
  else if (step === 3)
    return (
      <div>
        <strong>Designate your Executive Key!</strong>
        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;This step requires you to temporarily loan an
          NFT to the backend so that the process of deployment can be automated.
          If you do not have an NFT, one will be minted instead. Do you have an
          NFT?
        </p>
      </div>
    );
  else if (step === 4)
    return (
      <div>
        <strong>Before we fire it off...</strong>
        <p>
          Make sure the following details are correct. Refresh the page if you
          need to change something!
        </p>
        <hr />
        <p>
          (NOTE: Please ignore the selfService parameter because this feature is
          in development.)
        </p>
        <hr />
      </div>
    );
  else if (step === 5)
    return (
      <div>
        <strong>Ready for Liftoff!</strong>
      </div>
    );
  else return <div />;
}
