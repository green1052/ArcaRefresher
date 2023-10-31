import React, { useLayoutEffect, useState } from 'react';
import { Portal } from '@material-ui/core';
import { useSelector } from 'react-redux';

import {
  addAREvent,
  removeAREvent,
  EVENT_AUTOREFRESH,
  EVENT_COMMENT_REFRESH,
} from 'core/event';
import { AuthorTag } from 'component';
import { FULL_LOADED, USER_INFO } from 'core/selector';
import { useLoadChecker } from 'util/LoadChecker';
import { getUserID, getUserKey } from 'func/user';

import Info from './FeatureInfo';

function MemoList() {
  const { variant, memo } = useSelector((state) => state[Info.ID].storage);
  const [infoList, setInfoList] = useState([]);
  const loaded = useLoadChecker(FULL_LOADED);

  useLayoutEffect(() => {
    const appendMemo = () => {
      const list = [...document.querySelectorAll(USER_INFO)].map((e, index) => {
        const key = getUserKey(e, index);
        const id = getUserID(e);
        const container =
          e.querySelector('.memo') || document.createElement('span');
        if (!container.parentNode) {
          container.classList.add('memo');
          e.append(container);
        }

        return { key, id, container };
      });

      setInfoList(list);
    };
    if (loaded) appendMemo();
    addAREvent(EVENT_AUTOREFRESH, appendMemo);
    addAREvent(EVENT_COMMENT_REFRESH, appendMemo);

    return () => {
      removeAREvent(EVENT_AUTOREFRESH, appendMemo);
      removeAREvent(EVENT_COMMENT_REFRESH, appendMemo);
    };
  }, [loaded]);

  useLayoutEffect(() => {
    const colorizeUser = () => {
      [...document.querySelectorAll(USER_INFO)].forEach((e) => {
        const id = getUserID(e);

        if (memo[id]?.color) {
          e.style.setProperty('color', memo[id].color, 'important');
          e.style.setProperty('font-weight', 'bold');

          e.querySelector('a')?.style.setProperty(
            'color',
            memo[id].color,
            'important',
          );
        } else {
          e.style.setProperty('color', '');
          e.style.setProperty('font-weight', '');
          e.querySelector('a')?.style.setProperty('color', '');
        }
      });
    };
    if (loaded) colorizeUser();
    addAREvent(EVENT_AUTOREFRESH, colorizeUser);
    addAREvent(EVENT_COMMENT_REFRESH, colorizeUser);

    return () => {
      removeAREvent(EVENT_AUTOREFRESH, colorizeUser);
      removeAREvent(EVENT_COMMENT_REFRESH, colorizeUser);
    };
  }, [memo, loaded]);

  return (
    <>
      {infoList.map(({ key, id, container }) => (
        <Portal key={key} container={container}>
          <AuthorTag variant={variant}>{memo[id]?.msg}</AuthorTag>
        </Portal>
      ))}
    </>
  );
}

export default MemoList;
