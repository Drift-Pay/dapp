import * as React from 'react';

export function SkdbSelector(props) {
  const { lock, action, setAction, accessTier } = props;
  return (
    <div>
      <h6
        onClick={(event) => {
          event.preventDefault();
          if (!lock && '' !== action) setAction();
        }}
      >
        <strong>
          Key Management Action Menu{action && ' (Click to Reset)'}
        </strong>
      </h6>
      <ul>
        {accessTier >= 3 && (
          <li
            onClick={(event) => {
              event.preventDefault();
              const axn = 'defineSkeletonKey';
              if (!lock && axn !== action) setAction(axn);
            }}
          >
            Redefine Skeleton Key
          </li>
        )}

        {accessTier >= 2 && (
          <li
            onClick={(event) => {
              event.preventDefault();
              const axn = 'defineExecutiveKey';
              if (!lock && axn !== action) setAction(axn);
            }}
          >
            Redefine Executive Key
          </li>
        )}

        {accessTier >= 2 && (
          <li
            onClick={(event) => {
              event.preventDefault();
              const axn = 'mintAdmin';
              if (!lock && axn !== action) setAction(axn);
            }}
          >
            Mint New Administrator Key
          </li>
        )}

        {accessTier >= 2 && (
          <li
            onClick={(event) => {
              event.preventDefault();
              const axn = 'manageAdmins';
              if (!lock && axn !== action) setAction(axn);
            }}
          >
            Manage Admin Keys
          </li>
        )}
      </ul>
    </div>
  );
}
