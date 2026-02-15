// ==UserScript==
// @name         斗鱼春节特效弹幕简化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  精准定位斗鱼超级弹幕，保留原始字号和不透明度，转换为黑边白字
// @author       Assistant
// @match			*://*.douyu.com/0*
// @match			*://*.douyu.com/1*
// @match			*://*.douyu.com/2*
// @match			*://*.douyu.com/3*
// @match			*://*.douyu.com/4*
// @match			*://*.douyu.com/5*
// @match			*://*.douyu.com/6*
// @match			*://*.douyu.com/7*
// @match			*://*.douyu.com/8*
// @match			*://*.douyu.com/9*
// @match			*://*.douyu.com/beta/*
// @match			*://*.douyu.com/topic/*
// @match        *://www.douyu.com/member/cp/getFansBadgeList
// @match        *://passport.douyu.com/*
// @match        *://msg.douyu.com/*
// @match        *://yuba.douyu.com/*
// @match        *://v.douyu.com/*
// @match        *://cz.douyu.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 精准定位 super-text-f60bfa customBarrage 元素
    function simplifySuperBarrage() {
        const targetElements = document.querySelectorAll('.super-text-f60bfa.customBarrage');

        targetElements.forEach(element => {
            // 获取原始计算样式
            const computedStyle = window.getComputedStyle(element);

            // 获取原始字号（优先使用内联样式，否则使用计算样式）
            let originalFontSize = element.style.fontSize || computedStyle.fontSize;
            // 获取原始不透明度
            let originalOpacity = element.style.opacity || computedStyle.opacity;

            // 获取原始文本内容
            let textContent = '';
            element.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    textContent += node.textContent;
                }
            });

            if (!textContent.trim()) {
                textContent = element.innerText || element.textContent;
            }

            // 清空元素内容
            element.innerHTML = '';

            // 设置简化样式，保留原始字号和不透明度
            element.style.cssText = `
                color: white !important;
                background: transparent !important;
                background-image: none !important;
                border: none !important;
                box-shadow: none !important;
                padding: 2px 4px !important;
                margin: 0 !important;
                font-size: ${originalFontSize} !important;
                font-weight: bold !important;
                line-height: 1.5 !important;
                opacity: ${originalOpacity} !important;
                text-shadow:
                    2px 0 0 #000,
                    -2px 0 0 #000,
                    0 2px 0 #000,
                    0 -2px 0 #000,
                    1px 1px #000,
                    -1px -1px #000,
                    1px -1px #000,
                    -1px 1px #000 !important;
                display: inline-block !important;
                white-space: nowrap !important;
                position: relative !important;
                z-index: 9999 !important;
                pointer-events: none !important;
            `;

            // 重新设置文本内容
            element.textContent = textContent.trim() || ' ';

            // 隐藏兄弟元素（头像、尾巴图标等）
            const parent = element.parentNode;
            if (parent) {
                const siblings = parent.children;
                for (let i = 0; i < siblings.length; i++) {
                    const sibling = siblings[i];
                    if (sibling !== element) {
                        sibling.style.cssText = `
                            display: none !important;
                            visibility: hidden !important;
                            opacity: 0 !important;
                            width: 0 !important;
                            height: 0 !important;
                        `;
                    }
                }
            }
        });
    }

    // 增强版：保留原始数据的CSS方案
    const style = document.createElement('style');
    style.textContent = `
        /* 精准定位并保留原始属性 */
        .super-text-f60bfa.customBarrage {
            color: white !important;
            background: transparent !important;
            background-image: none !important;
            border: none !important;
            box-shadow: none !important;
            font-weight: bold !important;
            text-shadow:
                2px 0 0 #000,
                -2px 0 0 #000,
                0 2px 0 #000,
                0 -2px 0 #000,
                1px 1px #000,
                -1px -1px #000,
                1px -1px #000,
                -1px 1px #000 !important;
        }

        /* 保留原始字号和不透明度 - 使用 !important 但允许继承原始值 */
        .super-text-f60bfa.customBarrage {
            font-size: inherit !important;
            opacity: inherit !important;
        }

        /* 隐藏装饰元素 */
        .super-text-f60bfa.customBarrage img,
        .super-text-f60bfa.customBarrage [class*="pic"],
        .super-text-f60bfa.customBarrage [class*="icon"],
        .super-text-f60bfa.customBarrage [class*="afterpic"],
        .super-text-f60bfa.customBarrage [class*="super-"]:not(.customBarrage) {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            width: 0 !important;
            height: 0 !important;
        }

        /* 隐藏相关的兄弟装饰元素 */
        .super-text-f60bfa.customBarrage ~ * {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
        }

        /* 确保弹幕容器背景透明 */
        [class*="danmuItem"]:has(.super-text-f60bfa.customBarrage) {
            background: transparent !important;
            background-image: none !important;
        }
    `;
    document.documentElement.appendChild(style);

    // 初始执行
    setTimeout(simplifySuperBarrage, 500);
    setTimeout(simplifySuperBarrage, 1000);
    setTimeout(simplifySuperBarrage, 2000);

    // 动态监听
    const observer = new MutationObserver(function(mutations) {
        let needSimplify = false;

        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.classList &&
                            node.classList.contains('super-text-f60bfa') &&
                            node.classList.contains('customBarrage')) {
                            needSimplify = true;
                        }

                        if (node.querySelectorAll) {
                            const found = node.querySelectorAll('.super-text-f60bfa.customBarrage');
                            if (found.length > 0) {
                                needSimplify = true;
                            }
                        }
                    }
                });
            }
        });

        if (needSimplify) {
            setTimeout(simplifySuperBarrage, 50);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 定期清理（每3秒执行一次）
    setInterval(simplifySuperBarrage, 3000);

    console.log('斗鱼弹幕简化器已激活 - 保留原始字号和不透明度');
})();
