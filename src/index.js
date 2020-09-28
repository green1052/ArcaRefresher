import * as Setting from './module/Setting';
import * as HideSystem from './module/HideSystem';
import * as PreviewFilter from './module/PreviewFilter';
import * as ContextMenu from './module/ContextMenu';
import * as AdvancedReply from './module/AdvancedReply';
import * as BlockSystem from './module/BlockSystem';
import AutoRefresher from './module/AutoRefresher';
import * as AdvancedWriteForm from './module/AdvancedWriteForm';
import * as ShortCut from './module/ShortCut';
import * as IPScouter from './module/IPScouter';
import * as ImageDownloader from './module/ImageDownloader';
import * as UserMemo from './module/UserMemo';
import * as CategoryColor from './module/CategoryColor';
import * as AutoRemover from './module/AutoRemover';
import { waitForElement } from './util/ElementDetector';

import headerfix from './css/HeaderFix.css';
import fade from './css/Fade.css';
import hidesheet from './css/HideSystem.css';
import blocksheet from './css/BlockSystem.css';

import { stylesheet as ipsheet } from './css/IPScouter.module.css';

(async function () {
    document.head.append(<style>{headerfix}</style>);
    document.head.append(<style>{fade}</style>);
    document.head.append(<style>{hidesheet}</style>);
    document.head.append(<style>{blocksheet}</style>);
    document.head.append(<style>{ipsheet}</style>);

    const path = location.pathname.split('/');
    const channel = path[2] || '';

    await waitForElement('.content-wrapper');
    Setting.setup(channel);

    HideSystem.apply();

    await waitForElement('footer');

    let targetElement = document.querySelector('article > .article-view, article > div.board-article-list .list-table, article > .article-write');
    if(targetElement == null) return;

    let type = '';

    if(targetElement.classList.contains('article-view')) type = 'article';
    if(targetElement.classList.contains('list-table')) type = 'board';
    if(targetElement.classList.contains('article-write')) type = 'write';

    if(type == 'article') {
        try {
            UserMemo.parseUserInfo(targetElement);
            UserMemo.applyMemo(targetElement);
            UserMemo.setHandler(targetElement);
            IPScouter.applyScouter(targetElement);

            ContextMenu.applyOnArticle(targetElement);
            BlockSystem.blockRatedown();
            ImageDownloader.apply();

            const commentView = targetElement.querySelector('#comment');
            if(commentView) {
                const comments = commentView.querySelectorAll('.comment-item');
                BlockSystem.blockComment(comments);
                BlockSystem.blockEmoticon(comments);

                AdvancedReply.applyRefreshBtn(commentView);
                AdvancedReply.applyEmoticonBlockBtn(commentView);
                AdvancedReply.applyFullAreaRereply(commentView);

                const commentObserver = new MutationObserver(() => {
                    UserMemo.parseUserInfo(commentView);
                    UserMemo.applyMemo(commentView);
                    IPScouter.applyScouter(commentView);
                    AdvancedReply.applyEmoticonBlockBtn(commentView);
                });
                commentObserver.observe(commentView, { childList: true });
            }
        }
        catch (error) {
            console.warn('게시물 처리 중 오류 발생');
            console.error(error);
        }

        ShortCut.apply('article');

        targetElement = targetElement.querySelector('.included-article-list .list-table');
        if(targetElement) type = 'board-included';
    }

    if(type.indexOf('board') > -1) {
        Setting.setupCategory(channel);

        UserMemo.parseUserInfo(targetElement);
        UserMemo.applyMemo(targetElement);
        IPScouter.applyScouter(targetElement);

        let articles = targetElement.querySelectorAll('a.vrow');
        CategoryColor.applyArticles(articles, channel);
        PreviewFilter.filter(articles, channel);
        BlockSystem.blockArticle(targetElement, articles, channel);

        const boardObserver = new MutationObserver(() => {
            boardObserver.disconnect();

            UserMemo.parseUserInfo(targetElement);
            UserMemo.applyMemo(targetElement);
            IPScouter.applyScouter(targetElement);

            articles = targetElement.querySelectorAll('a.vrow');
            CategoryColor.applyArticles(articles, channel);
            PreviewFilter.filter(articles, channel);
            BlockSystem.blockArticle(targetElement, articles, channel);
            AutoRemover.removeArticle(articles);

            boardObserver.observe(targetElement, { childList: true });
        });
        boardObserver.observe(targetElement, { childList: true });

        if(type != 'board-included') {
            const refreshTime = GM_getValue('refreshTime', Setting.defaultConfig.refreshTime);
            if(refreshTime) {
                const refresher = new AutoRefresher(targetElement, refreshTime);
                refresher.start();
            }
            ShortCut.apply('board');
        }
    }

    if(type == 'write') {
        await waitForElement('.fr-box');
        const editor = unsafeWindow.FroalaEditor('#content');
        AdvancedWriteForm.applyClipboardUpload(editor);
        AdvancedWriteForm.applyMyImage(editor);
    }
}());
