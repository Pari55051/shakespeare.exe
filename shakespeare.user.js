// ==UserScript==
// @name         Bard Mode
// @namespace    http://yoursite.com/
// @version      1.1
// @description  Replaces modern words/phrases with Shakespearean language on dynamic websites like Medium.com
// @author       You
// @match        https://*.medium.com/*
// @match        https://medium.com/*
// @match        https://*.wikipedia.org/*
// @match        https://*.reddit.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const phraseDict = {
        "how are you": "how doth thee fare",
        "what's up": "what news dost thour bring",
        "i don't know": "i knoweth not",
        "i'm tired": "i am weary",
        "i'm hungry": "my stomach doth rumble",
        "no way": "fie! it cannot be!",
        "okay": "'tis agreeable",
        "wait a minute": "prithee, tarry a moment",
        "be right back": "i shall return anon",
        "i'm sorry": "i big thy pardon",
        "that's awesome": "'tis wondrous indeed",
        "just kidding": "i jest, good sir/ma'am",
        "calm down": "hold thy tongue and be still",
        "i love you": "i doth adore thee",
        "i hate this": "i abhor this vile thang",
        "i'm so happy": "my singeth with joy",
        "i'm mad": "i am filled with wrath",
        "that's funny": "'tis a merry jest",
        "i'm scared": "i am afeard",
        "you're annoying": "thou are vexing",
        "shut up": "hold thy tongue",
        "you're stupid": "thou are a fool",
        "get lost": "remove thyself hence",
        "i don't care": "'tis naught to me",
        "see you soon": "i shall see thee anon",
        "let's go": "let us hence",
        "what the heck": "what devilry is this",
        "seriously?": "dost thou jest?",
        "good luck": "fortune smile upon thee"
    }

    const wordDict = {
        "you": "thou",
        "your": "thy",
        "yours": "thine",
        "are": "art",
        "have": "hast",
        "do": "dost",
        "does": "doth",
        "will": "shalt",
        "is": "be",
        "am": "art",
        "hello": "hark",
        "goodbye": "fare thee well",
        "bye": "fare thee well",
        "wait": "prithee stay",
        "listen": "lend me thine ear",
        "think": "reckon",
        "love": "adore",
        "hate": "abhor",
        "say": "speaketh",
        "said": "spake",
        "go": "goeth",
        "went": "wenteth",
        "come": "cometh",
        "ask": "beseech",
        "friend": "companion",
        "enemy": "knave",
        "man": "sirrah",
        "woman": "wench",
        "child": "youngling",
        "money": "coin",
        "food": "victuals",
        "home": "dwelling",
        "night": "e'en",
        "morning": "morn",
        "stupid": "addle-pated",
        "coward": "lily-livered knave",
        "jerk": "scurvy dog",
        "ugly": "ill-favoured",
        "liar": "false knave",
        "boring": "tedious rogue",
        "annoying": "vexing",

    }

    function walkAndReplace(rootNode) {
        const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            if (node.parentNode && !/^(SCRIPT|STYLE|TEXTAREA|INPUT)$/i.test(node.parentNode.nodeName)) {
                node.nodeValue = replaceText(node.nodeValue);
            }
        }
    }

    function replaceText(text) {
        for (let [key, value] of Object.entries(phraseDict)) {
            const regex = new RegExp(`\\b${key}\\b`, 'gi');
            text = text.replace(regex, (match) => matchCase(match, value));
        }
        for (let [key, value] of Object.entries(wordDict)) {
            const regex = new RegExp(`\\b${key}\\b`, 'gi');
            text = text.replace(regex, (match) => matchCase(match, value));
        }
        return text;
    }

    function matchCase(source, target) {
        if (source === source.toUpperCase()) return target.toUpperCase();
        if (source[0] === source[0].toUpperCase()) return target[0].toUpperCase() + target.slice(1);
        return target;
    }

    function observeAndReplace() {
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        walkAndReplace(node);
                    } else if (node.nodeType === 3) {
                        node.nodeValue = replaceText(node.nodeValue);
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // initial run
        walkAndReplace(document.body);
    }

    // waiting for DOM to load fully to over-ride text on dynamic websites
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeAndReplace);
    } else {
        observeAndReplace();
    }
})();
