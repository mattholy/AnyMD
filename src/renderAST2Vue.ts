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

export type { RenderedNode, RenderOptions, customComponents, MentionNode }

export function renderAst2Vue(ast: Node, options?: RenderOptions): VNode[] {
    function renderNode(node: RenderedNode, customRenderers?: customRenderers, customComponents?: customComponents): VNode | VNode[] {
        if (customRenderers) {
            switch (node.type) {
                case 'root':
                    if (customRenderers?.root) {
                        return customRenderers.root(node)
                    }
                    return h(
                        'div',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => (node.children || []).flatMap((i) => renderNode(i, customRenderers)) }
                    )
                case 'inlineMath':
                    if (customRenderers.inlineMath) {
                        return customRenderers.inlineMath(node)
                    }
                    try {
                        const html = katex.renderToString(node.value, {
                            throwOnError: false,
                        })
                        return h('span', {
                            innerHTML: html,
                            'data-node-type': node.type,
                        })
                    } catch (e) {
                        return h('span', { 'data-node-type': node.type }, node.value)
                    }

                case 'math':
                    if (customRenderers.math) {
                        return customRenderers.math(node)
                    }
                    try {
                        const html = katex.renderToString(node.value, {
                            throwOnError: false,
                            displayMode: true,
                        })
                        return h('div', {
                            innerHTML: html,
                            'data-node-type': node.type,
                        })
                    } catch (e) {
                        return h('div', { 'data-node-type': node.type }, node.value)
                    }

                case 'text':
                    if (customRenderers?.text) {
                        return customRenderers?.text(node)
                    }
                    return h(
                        'span',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => (node.value) }
                    )
                case 'paragraph':
                    if (customRenderers?.paragraph) {
                        return customRenderers.paragraph(node)
                    }
                    return h(
                        'p',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => (node.children || []).flatMap((i) => renderNode(i, customRenderers)) }
                    )

                case 'heading':
                    if (customRenderers?.heading) {
                        return customRenderers.heading(node)
                    }
                    return h(
                        `h${node.depth}`,
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => (node.children || []).flatMap((i) => renderNode(i, customRenderers)) }
                    )

                case 'emphasis':
                    if (customRenderers?.emphasis) {
                        return customRenderers.emphasis(node)
                    }
                    return h(
                        'em',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => (node.children || []).flatMap((i) => renderNode(i, customRenderers)) }
                    )

                case 'strong':
                    if (customRenderers?.strong) {
                        return customRenderers.strong(node)
                    }
                    return h(
                        'strong',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => (node.children || []).flatMap((i) => renderNode(i, customRenderers)) }
                    )

                case 'inlineCode':
                    if (customRenderers?.inlineCode) {
                        return customRenderers.inlineCode(node)
                    }
                    return h(
                        'code',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => node.value }
                    )

                case 'code':
                    if (customRenderers?.code) {
                        return customRenderers.code(node)
                    }
                    return h(
                        'pre',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => h('code', { 'data-node-style': 'default' }, node.value) }
                    )

                case 'blockquote':
                    if (customRenderers?.blockquote) {
                        return customRenderers.blockquote(node)
                    }
                    return h(
                        'blockquote',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => (node.children || []).flatMap((i) => renderNode(i, customRenderers)) }
                    )

                case 'list':
                    if (customRenderers?.list) {
                        return customRenderers.list(node)
                    }
                    return h(
                        node.ordered ? 'ol' : 'ul',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => (node.children || []).flatMap((i) => renderNode(i, customRenderers)) }
                    )

                case 'listItem':
                    if (customRenderers?.listItem) {
                        return customRenderers.listItem(node)
                    }
                    return h(
                        'li',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => (node.children || []).flatMap((i) => renderNode(i, customRenderers)) }
                    )

                case 'thematicBreak':
                    if (customRenderers?.thematicBreak) {
                        return customRenderers.thematicBreak(node)
                    }
                    return h('hr', { 'data-node-type': node.type, 'data-node-style': 'default' })

                case 'break':
                    if (customRenderers?.break) {
                        return customRenderers.break(node)
                    }
                    return h('br', { 'data-node-type': node.type, 'data-node-style': 'default' })

                case 'link':
                    if (customRenderers?.link) {
                        return customRenderers.link(node)
                    }
                    return h(
                        'a',
                        { href: node.url, title: node.title, 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => (node.children || []).flatMap((i) => renderNode(i, customRenderers)) }
                    )

                case 'image':
                    if (customRenderers?.image) {
                        return customRenderers.image(node)
                    }
                    return h('img', {
                        src: node.url,
                        alt: node.alt,
                        title: node.title,
                        'data-node-type': node.type,
                        'data-node-style': 'default'
                    })

                case 'table':
                    if (customRenderers?.table) {
                        return customRenderers.table(node)
                    }
                    return h(
                        'table',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => (node.children || []).flatMap((i) => renderNode(i, customRenderers)) }
                    )

                case 'tableRow':
                    if (customRenderers?.tableRow) {
                        return customRenderers.tableRow(node)
                    }
                    return h(
                        'tr',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => (node.children || []).flatMap((i) => renderNode(i, customRenderers)) }
                    )

                case 'tableCell':
                    if (customRenderers?.tableCell) {
                        return customRenderers.tableCell(node)
                    }
                    return h(
                        'td',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => (node.children || []).flatMap((i) => renderNode(i, customRenderers)) }
                    )

                case 'delete':
                    if (customRenderers?.delete) {
                        return customRenderers.delete(node)
                    }
                    return h(
                        'del',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => (node.children || []).flatMap((i) => renderNode(i, customRenderers)) }
                    )

                case 'html':
                    if (customRenderers?.html) {
                        return customRenderers.html(node)
                    }
                    return h('div', {
                        innerHTML: node.value,
                        'data-node-type': node.type,
                        'data-node-style': 'default'
                    })

                case 'mention':
                    if (customRenderers?.mention) {
                        return customRenderers.mention(node)
                    }
                    return h(
                        'span',
                        { 'data-node-type': node.type, 'data-node-style': 'default' },
                        { default: () => node.value }
                    )
            }
        } else {
            return h('div', { 'data-node-type': 'error', 'data-node-style': 'default' }, 'No custom renderers provided')
        }
    }

    const renderedNodes = renderNode(ast as RenderedNode, options?.customRenderers)
    return Array.isArray(renderedNodes) ? renderedNodes : [renderedNodes]
}