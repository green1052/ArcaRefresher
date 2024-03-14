import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { List, ListItemIcon, MenuItem, Typography } from '@mui/material';
import { Comment } from '@mui/icons-material';

import {
  BOARD_ITEMS_WITH_NOTICE,
  USER_INFO,
  USER_MENTION,
} from 'core/selector';
import { useContextMenu } from 'menu/ContextMenu';
import { User } from 'func/user';

import { $setMemo } from '../slice';
import Info from '../FeatureInfo';
import MemoInput from './MemoInput';

function ContextMenu({ target }) {
  const dispatch = useDispatch();
  const { memo, contextRange } = useSelector((state) => state[Info.id].storage);
  const [user, setUser] = useState(undefined);
  let contextSelector;
  switch (contextRange) {
    case 'articleItem':
      contextSelector = `${BOARD_ITEMS_WITH_NOTICE}, ${USER_INFO}, ${USER_MENTION}`;
      break;
    case 'nickname':
      contextSelector = `${USER_INFO}, ${USER_MENTION}`;
      break;
    default:
      console.warn('[Memo] contextRange 값이 올바르지 않음');
      contextSelector = `${USER_INFO}, ${USER_MENTION}`;
      break;
  }

  const [data, closeMenu] = useContextMenu(
    {
      key: Info.id,
      selector: contextSelector,
      dataExtractor: () => {
        if (!target) return undefined;

        let userElement = target;
        if (target.matches('.vrow')) {
          userElement = target.querySelector('span.user-info');
        }
        if (!userElement) return undefined;

        return new User(userElement).toUID();
      },
    },
    [target],
  );

  const handleClick = useCallback(() => {
    setUser(data);
    closeMenu();
  }, [closeMenu, data]);

  const handleInputClose = useCallback(() => {
    setUser(undefined);
  }, []);

  const handleInputSubmit = useCallback(
    (value) => {
      dispatch($setMemo({ user, memo: value }));
    },
    [user, dispatch],
  );

  return (
    <>
      {data && (
        <List>
          <MenuItem onClick={handleClick}>
            <ListItemIcon>
              <Comment />
            </ListItemIcon>
            <Typography>{`메모 ${
              memo[data]?.msg ? `(${memo[data].msg})` : ''
            }`}</Typography>
          </MenuItem>
        </List>
      )}
      <MemoInput
        open={!!user}
        defaultValue={memo[user]}
        onClose={handleInputClose}
        onSubmit={handleInputSubmit}
      />
    </>
  );
}

ContextMenu.propTypes = {
  target: PropTypes.object,
};

export default ContextMenu;
