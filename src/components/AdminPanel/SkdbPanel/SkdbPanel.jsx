import { useState, useContext } from 'react';
import { AppContext } from '../../../App';
import { AdminContext } from '../AdminPanel';

import { Card, Col } from 'react-bootstrap';

import { RedefineHigherKey, MintAdmin, ManageAdmins } from './SkdbForms';
import { SkdbSelector } from './SkdbSelector';

export function SkdbPanel(props) {
  const { lock, setLock } = useContext(AdminContext);
  const { info, account } = useContext(AppContext);
  const { type, db } = props;
  const accessTier = info[db].accessTier;
  const asset =
    type === 'Backend' ? info.server.token : info.storeFront.contract;

  const [action, setAction] = useState(false);

  return (
    <Card as={Col} text="black">
      <Card.Body>
        <Card.Title>{type} - Access Control Panel</Card.Title>
        <hr />
        <SkdbSelector
          accessTier={accessTier}
          lock={lock}
          action={action}
          setAction={setAction}
        />
        {'defineSkeletonKey' === action && accessTier > 2 && (
          <RedefineHigherKey action={action} asset={asset} db={db} />
        )}

        {'defineExecutiveKey' === action && (
          <RedefineHigherKey action={action} asset={asset} db={db} />
        )}

        {'mintAdmin' === action && <MintAdmin action={action} db={db} />}
        {'manageAdmins' === action && (
          <ManageAdmins action={action} asset={asset} db={db} />
        )}
      </Card.Body>
      <Card.Footer>
        <small>
          Misconfiguration may result in the need for manual adjustment.
        </small>
      </Card.Footer>
    </Card>
  );
}
