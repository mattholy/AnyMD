import { h, VNode } from 'vue'
import { Node } from 'unist'
import 'katex/dist/katex.min.css'
import katex from 'katex'

import {
    RootNode,
    ParagraphNode,
    TextNode,
    HeadingNode,
    EmphasisNode,
    StrongNode,
    InlineCodeNode,
    CodeNode,
    BlockquoteNode,
    ListNode,
    ListItemNode,
    ThematicBreakNode,
    BreakNode,
    LinkNode,
    ImageNode,
    TableNode,
    TableRowNode,
    TableCellNode,
    DeleteNode,
    HTMLNode,
    MentionNode,
    InlineMathNode,
    MathNode,
    RenderedNode,
    RenderOptions,
    customComponents,
    customRenderers
} from './types'

export function renderAst2Vue(ast: Node, options?: RenderOptions): VNode[] {
    const renderedNodes = renderPipe(ast as RenderedNode, options?.customRenderers, options?.customComponents)
    return Array.isArray(renderedNodes) ? renderedNodes : [renderedNodes]
}

const renderPipe = (node: RenderedNode, customRenderers?: customRenderers, customComponents?: customComponents): VNode | VNode[] => {
    if (customRenderers && node.type in customRenderers) {
        return (customRenderers[node.type] as (node: RenderedNode) => VNode | VNode[])(node)
    }
    else if (customComponents && node.type in customComponents) {
        return h(
            customComponents[node.type]!,
            { 'data-node-type': node.type, 'data-node-style': 'default' },
            {
                default: () => {
                    if ('children' in node) {
                        return (node.children || []).flatMap((i) => renderPipe(i, customRenderers, customComponents))
                    } else if ('value' in node) {
                        return node.value
                    } else {
                        return []
                    }
                }
            }
        )
    }
    else {
        return renderDefault(node, customRenderers, customComponents)
    }
}

const renderDefault = (node: RenderedNode, customRenderers?: customRenderers, customComponents?: customComponents): VNode | VNode[] => {
    switch (node.type) {
        case 'root':
            return h(
                'div',
                { 'data-node-type': node.type, 'data-node-style': 'default' },
                { default: () => (node.children || []).flatMap((i) => renderDefault(i, customRenderers, customComponents)) }
            )
        case 'inlineMath':
            try {
                const html = katex.renderToString(node.value, {
                    throwOnError: false,
                })
                return h(
                    customComponents?.inlineMath ?? 'span',
                    {
                        innerHTML: html,
                        'data-node-type': node.type,
                    }
                )
            } catch (e) {
                return h('span', { 'data-node-type': node.type }, node.value)
            }
        case 'math':
            try {
                const html = katex.renderToString(node.value, {
                    throwOnError: false,
                    displayMode: true,
                })
                return h(
                    customComponents?.math ?? 'div',
                    {
                        innerHTML: html,
                        'data-node-type': node.type,
                    }
                )
            } catch (e) {
                return h('div', { 'data-node-type': node.type }, node.value)
            }
        case 'text':
            return h(
                'span',
                { 'data-node-type': node.type, 'data-node-style': 'default' },
                { default: () => (node.value) }
            )
        case 'paragraph':
            return h(
                'p',
                { 'data-node-type': node.type, 'data-node-style': 'default' },
                { default: () => (node.children || []).flatMap((i) => renderDefault(i, customRenderers, customComponents)) }
            )
        case 'heading':
            return h(
                `h${node.depth}`,
                { 'data-node-type': node.type, 'data-node-style': 'default' },
                { default: () => (node.children || []).flatMap((i) => renderDefault(i, customRenderers, customComponents)) }
            )
        case 'emphasis':
            return h(
                'em',
                { 'data-node-type': node.type, 'data-node-style': 'default' },
                { default: () => (node.children || []).flatMap((i) => renderDefault(i, customRenderers, customComponents)) }
            )
        case 'strong':
            return h(
                'strong',
                { 'data-node-type': node.type, 'data-node-style': 'default' },
                { default: () => (node.children || []).flatMap((i) => renderDefault(i, customRenderers, customComponents)) }
            )
        case 'inlineCode':
            return h(
                'code',
                { 'data-node-type': node.type, 'data-node-style': 'default' },
                { default: () => node.value }
            )
        case 'code':
            return h(
                'pre',
                { 'data-node-type': node.type, 'data-node-style': 'default' },
                { default: () => h('code', { 'data-node-style': 'default' }, node.value) }
            )
        case 'blockquote':
            return h(
                'blockquote',
                { 'data-node-type': node.type, 'data-node-style': 'default' },
                { default: () => (node.children || []).flatMap((i) => renderDefault(i, customRenderers, customComponents)) }
            )
        case 'list':
            return h(
                node.ordered ? 'ol' : 'ul',
                { 'data-node-type': node.type, 'data-node-style': 'default' },
                { default: () => (node.children || []).flatMap((i) => renderDefault(i, customRenderers, customComponents)) }
            )
        case 'listItem':
            return h(
                'li',
                { 'data-node-type': node.type, 'data-node-style': 'default' },
                { default: () => (node.children || []).flatMap((i) => renderDefault(i, customRenderers, customComponents)) }
            )
        case 'thematicBreak':
            return h(
                'hr',
                {
                    'data-node-type': node.type, 'data-node-style': 'default'
                }
            )
        case 'break':
            return h(
                'br',
                { 'data-node-type': node.type, 'data-node-style': 'default' }
            )
        case 'link':
            return h(
                'a',
                { href: node.url, title: node.title, 'data-node-type': node.type, 'data-node-style': 'default' },
                { default: () => (node.children || []).flatMap((i) => renderDefault(i, customRenderers, customComponents)) }
            )
        case 'image':
            return h(
                'img',
                {
                    src: node.url,
                    alt: node.alt,
                    title: node.title,
                    'data-node-type': node.type,
                    'data-node-style': 'default'
                }
            )
        case 'table':
            return h(
                'table',
                { 'data-node-type': node.type, 'data-node-style': 'default' },
                { default: () => (node.children || []).flatMap((i) => renderDefault(i, customRenderers, customComponents)) }
            )
        case 'tableRow':
            return h(
                'tr',
                { 'data-node-type': node.type, 'data-node-style': 'default' },
                { default: () => (node.children || []).flatMap((i) => renderDefault(i, customRenderers, customComponents)) }
            )
        case 'tableCell':
            return h(
                'td',
                { 'data-node-type': node.type, 'data-node-style': 'default' },
                { default: () => (node.children || []).flatMap((i) => renderDefault(i, customRenderers, customComponents)) }
            )
        case 'delete':
            return h(
                'del',
                { 'data-node-type': node.type, 'data-node-style': 'default' },
                { default: () => (node.children || []).flatMap((i) => renderDefault(i, customRenderers, customComponents)) }
            )
        case 'html':
            return h(
                'div',
                {
                    innerHTML: node.value,
                    'data-node-type': node.type,
                    'data-node-style': 'default'
                }
            )
        case 'mention':
            return h(
                'span',
                { 'data-node-type': node.type, 'data-node-style': 'default' },
                { default: () => node.value }
            )
        case 'hashtag':
            return h(
                'span',
                { 'data-node-type': node.type, 'data-node-style': 'default' },
                { default: () => node.value }
            )
    }
}