// renderMarkdownAST2NaiveUI.ts
import { h } from 'vue';
import { NText, NP, NH1, NH2, NH3, NH4, NH5, NH6, NA, NIcon } from 'naive-ui';
import { OpenOutline } from '@vicons/ionicons5';
import 'katex/dist/katex.min.css';
import katex from 'katex';
export function renderAstToNaiveUI(ast) {
    function renderNode(node) {
        switch (node.type) {
            case 'root':
                return h('div', { 'data-node-type': node.type }, { default: () => (node.children || []).flatMap(renderNode) });
            case 'inlineMath':
                try {
                    const html = katex.renderToString(node.value, {
                        throwOnError: false,
                    });
                    return h('span', {
                        innerHTML: html,
                        'data-node-type': node.type,
                    });
                }
                catch (e) {
                    return h('span', { 'data-node-type': node.type }, node.value);
                }
            case 'math':
                try {
                    const html = katex.renderToString(node.value, {
                        throwOnError: false,
                        displayMode: true,
                    });
                    return h('div', {
                        innerHTML: html,
                        'data-node-type': node.type,
                    });
                }
                catch (e) {
                    return h('div', { 'data-node-type': node.type }, node.value);
                }
            case 'text':
                return h('span', { 'data-node-type': node.type }, { default: () => node.value });
            case 'mention':
                return h(NText, { 'data-node-type': node.type }, { default: () => node.value });
            case 'paragraph':
                return h(NP, { 'data-node-type': node.type }, { default: () => (node.children || []).flatMap(renderNode) });
            case 'strong':
                return h(NText, { 'data-node-type': node.type, strong: true }, { default: () => (node.children || []).flatMap(renderNode) });
            case 'emphasis':
                return h(NText, { 'data-node-type': node.type, italic: true }, { default: () => (node.children || []).flatMap(renderNode) });
            case 'link':
                const isInternalLink = node.url.startsWith('/') || node.url.startsWith('#') || node.url.startsWith('./') || node.url.startsWith(window.location.origin);
                if (isInternalLink) {
                    return h('router-link', { 'data-node-type': node.type, to: node.url }, { default: () => (node.children || []).flatMap(renderNode) });
                }
                else {
                    return h(NA, { 'data-node-type': node.type, href: node.url }, { default: () => [...(node.children || []).flatMap(renderNode), h(NIcon, null, { default: () => h(OpenOutline) })] });
                }
            case 'heading':
                const depth = node.depth || 1;
                const HeadingComponent = getHeadingComponent(depth);
                return h(HeadingComponent, { 'data-node-type': node.type }, { default: () => (node.children || []).flatMap(renderNode) });
            default:
                return h('div', { 'data-node-type': node.type }, { default: () => 'Unknown node type: ' + node.type });
        }
    }
    const renderedNodes = renderNode(ast);
    return Array.isArray(renderedNodes) ? renderedNodes : [renderedNodes];
}
function getHeadingComponent(depth) {
    switch (depth) {
        case 1:
            return NH1;
        case 2:
            return NH2;
        case 3:
            return NH3;
        case 4:
            return NH4;
        case 5:
            return NH5;
        case 6:
            return NH6;
        default:
            return NH1;
    }
}
