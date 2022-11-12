import { useState, useContext } from 'react';
import { AppContext } from '../../../App';
import { AdminContext } from '../AdminPanel';

import { Card, Col, Accordion, Button } from 'react-bootstrap';
import { mixed } from '../../utils/translate';

export function SkdbView(props) {
  const { skdb } = useContext(AdminContext);
  const { info, setInfo } = useContext(AppContext);
  const { type, db } = props;

  const cache = () => info[db].diag;
  const users = () => {
    const addresses = cache().admin.holder;
    const ids = cache().admin.id;
    let output = [];
    ids.forEach((id) =>
      output.push({ id, address: addresses[ids.indexOf(id)] })
    );
    return output;
  };

  const [disabled, setDisabled] = useState(false);

  function handleRefresh(event) {
    event.preventDefault();
    setDisabled(true);
    skdb[db]
      .diag(type === 'Backend' ? info.server.token : info.storeFront.contract)
      .then((response) => {
        let temp = mixed(response);
        const diag = {
          skeleton: {
            holder: temp[0],
            contract: temp[1],
            id: temp[2],
          },
          executive: {
            holder: temp[3],
            contract: temp[4],
            id: temp[5],
          },
          admin: {
            holder: temp[6],
            contract: temp[7],
            id: temp[8],
          },
        };
        const newInfo =
          db === 'server'
            ? { ...info, server: { ...info.server, diag } }
            : { ...info, storeFront: { ...info.storeFront, diag } };
        setInfo(newInfo);
        setDisabled(false);
      })
      .catch((error) => {
        console.error(error);
        setDisabled(false);
      });
  }

  return (
    <Card as={Col} text="black">
      <Card.Body>
        <Card.Title>{type} - Access Viewer</Card.Title>
        <hr />
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Skeleton & Executive</Accordion.Header>
            <Accordion.Body>
              <h6>Skeleton Key</h6>
              <ul>
                <li>Holder: {cache().skeleton.holder}</li>
                <li>Token: {cache().skeleton.contract}</li>
                <li>ID: {cache().skeleton.id}</li>
              </ul>
              <hr />
              <h6>Executive Key</h6>
              <ul>
                <li>Holder: {cache().executive.holder}</li>
                <li>Token: {cache().executive.contract}</li>
                <li>ID: {cache().executive.id}</li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Administrators</Accordion.Header>
            <Accordion.Body>
              Token: {cache().admin.contract}
              <ul>
                {users().map((user) => (
                  <li key={`${db}-usermap-admin-${user.id}`}>
                    #{user.id} - {user.address}
                  </li>
                ))}
              </ul>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card.Body>
      <Card.Footer>
        <Button disabled={disabled} onClick={handleRefresh}>
          Refresh
        </Button>
      </Card.Footer>
    </Card>
  );
}
