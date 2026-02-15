// ==UserScript==
// @name         斗鱼春节特效弹幕简化
// @namespace    http://tampermonkey.net/
// @version      1.2
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
            // 获取父级 .danmuItem 容器
            const danmuItem = element.closest('.danmuItem-a8616a, [class*="danmuItem"]');

            // 从 .danmuItem 读取 opacity
            let containerOpacity = '1'; // 默认值

            if (danmuItem) {
                const computedStyle = window.getComputedStyle(danmuItem);
                containerOpacity = danmuItem.style.opacity || computedStyle.opacity;
                console.log('读取到容器opacity:', containerOpacity, '元素:', danmuItem);
            }

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

            // 应用简化样式，使用从容器读取的opacity
            element.style.cssText = `
                color: white !important;
                background: transparent !important;
                background-image: none !important;
                border: none !important;
                box-shadow: none !important;
                padding: 2px 4px !important;
                margin: 0 !important;
                font-size: 24px !important;
                font-weight: bold !important;
                line-height: 1.5 !important;
                opacity: ${containerOpacity} !important;
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
            if (danmuItem) {
                // 隐藏 .danmuItem 内的所有其他元素
                const children = danmuItem.children;
                for (let i = 0; i < children.length; i++) {
                    const child = children[i];
                    if (child !== element) {
                        child.style.cssText = `
                            display: none !important;
                            visibility: hidden !important;
                            opacity: 0 !important;
                            width: 0 !important;
                            height: 0 !important;
                        `;
                    }
                }

                // 简化 .danmuItem 容器本身
                danmuItem.style.cssText = `
                    background: transparent !important;
                    background-image: none !important;
                    height: auto !important;
                    min-height: auto !important;
                    opacity: ${containerOpacity} !important;
                `;
            }
        });
    }

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

    // 定期清理
    setInterval(simplifySuperBarrage, 3000);

    console.log('斗鱼弹幕简化器已激活 - 读取容器不透明度');
})();
