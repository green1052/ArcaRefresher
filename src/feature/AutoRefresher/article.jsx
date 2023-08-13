import { BOARD_NOTICES, BOARD_ITEMS, BOARD, USER_INFO } from 'core/selector';
import toDocument from 'func/toDocument';

export async function getNewArticle() {
  try {
    const response = await fetch(window.location.href);
    if (!response.ok) throw new Error('[AutoRefresher] 연결 거부');

    const updateDocument = toDocument(await response.text());
    const newArticles = updateDocument
      .querySelector(BOARD)
      .querySelectorAll(`${BOARD_NOTICES}, ${BOARD_ITEMS}`);

    return [...newArticles];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export function swapArticle(
  articleContainer,
  refreshedArticles,
  animationClass,
) {
  const insertedArticles = [
    ...articleContainer.querySelectorAll(`${BOARD_NOTICES}, ${BOARD_ITEMS}`),
  ];

  // Filtering new articles, swap exist articles to new thing
  const newArticles = refreshedArticles.filter((a) => {
    const exist = insertedArticles.some((o) => {
      if (o.pathname === a.pathname) {
        const userInfoOnOld = o.querySelector(USER_INFO);
        // eslint-disable-next-line no-unused-expressions
        a.querySelector(USER_INFO)?.replaceWith(userInfoOnOld);
        o.replaceWith(a);
        return true;
      }
      return false;
    });

    return !exist;
  });

  const insertPos = articleContainer.querySelector(BOARD_ITEMS);
  newArticles.forEach((a) => {
    a.classList.add(animationClass);
    articleContainer.insertBefore(a, insertPos);
    articleContainer.removeChild(articleContainer.lastChild);
  });

  // calibrate preview image
  const calibrateArticles = [
    ...articleContainer.querySelectorAll(`${BOARD_NOTICES}, ${BOARD_ITEMS}`),
  ];
  calibrateArticles.forEach((a) => {
    const lazyWrapper = a.querySelector('noscript');
    lazyWrapper?.replaceWith(lazyWrapper.firstElementChild);
  });

  unsafeWindow.applyLocalTimeFix();
}
