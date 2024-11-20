<h1 align="center">AnyMD</h1>

<div align="center">

**Make your markdown your style.**

![GitHub commit activity](https://img.shields.io/github/commit-activity/m/mattholy/AnyMD?style=flat-square)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/mattholy/AnyMD/codecov.yml?style=flat-square&label=Test)
[![Codecov](https://img.shields.io/codecov/c/github/mattholy/AnyMD?style=flat-square)](https://codecov.io/gh/mattholy/AnyMD)
![NPM Type Definitions](https://img.shields.io/npm/types/%40mattholy%2Fanymd?style=flat-square)
![NPM Version](https://img.shields.io/npm/v/%40mattholy%2Fanymd?style=flat-square)
![NPM Downloads](https://img.shields.io/npm/dy/%40mattholy%2Fanymd?style=flat-square)

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmattholy%2FAnyMD.svg?type=small)](https://app.fossa.com/projects/git%2Bgithub.com%2Fmattholy%2FAnyMD?ref=badge_small)

[中文](./README.zh-CN.md) | [English](./README.md)

</div>

## General

<a href="https://app.fossa.com/projects/git%2Bgithub.com%2Fmattholy%2FAnyMD?ref=badge_large&issueType=license" alt="FOSSA Status"><img src="https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmattholy%2FAnyMD.svg?type=large&issueType=license" align="right"/></a>

- Type-safe
- Parse markdown to AST
- Choose anything you want to render


**Supported**
- [x] Vue
- [ ] React

## Install
```bash
npm install @mattholy/anymd
```

## Usage
### Vue
A very default usage of AnyMD with Vue.
```vue
<script setup lang="ts">
    import { parseMarkdown, renderAst2Vue } from '@mattholy/anymd'
    import type { RenderOptions } from '@mattholy/anymd'

    const markdown = 'any markdown content'

    const parsedAst = parseMarkdown(markdown)
    const renderedContent = renderAst2Vue(parsedAst)
</script>
<template>
    <component v-for="(node, index) in renderedContent" :key="index" :is="node"/>
</template>
```
Another example with custom renderers using *NaiveUI*.
```vue
<script setup lang="ts">
    import {
        NScrollbar, NText, NA, NH1, NH2, NH3, NIcon,
        NBlockquote, NCode, NOl, NUl, NP, NDivider,
        NImage, NTable, NEquation, NButton
    } from 'naive-ui'
    import { parseMarkdown, renderAst2Vue } from '@mattholy/anymd'
    import type { RenderOptions } from '@mattholy/anymd'

    const markdown = 'any markdown content'
    const renderConfig: RenderOptions = {
        customRenderers: {
            root: (node) => h('div', {}, { default: () => (node.children || []).flatMap((child) => renderAst2Vue(child, renderConfig)) }),
            text: (node) => h('span', {}, { default: () => node.value }),
            strong: (node) => h(NText, { strong: true }, { default: () => (node.children || []).flatMap((child) => renderAst2Vue(child, renderConfig)) }),
            heading: (node) => {
                switch (node.depth) {
                    case 1:
                        return h(NH1, { prefix: 'bar' }, { default: () => (node.children || []).flatMap((child) => renderAst2Vue(child, renderConfig)) });
                    case 2:
                        return h(NH2, null, { default: () => (node.children || []).flatMap((child) => renderAst2Vue(child, renderConfig)) });
                    case 3:
                        return h(NH3, null, { default: () => (node.children || []).flatMap((child) => renderAst2Vue(child, renderConfig)) });
                    default:
                        return h('div', null, { default: () => (node.children || []).flatMap((child) => renderAst2Vue(child, renderConfig)) });
                }
            },
            link: (node) => h(NA, { href: node.url }, {
                default: () => {
                    if (node.url.startsWith('/') || node.url.startsWith('#') || node.url.startsWith(window.location.origin)) {
                        return node.children[0].type === 'text' ? node.children[0].value : ''
                    } else {
                        return [node.children[0].type === 'text' ? node.children[0].value : '', h(NIcon, null, { default: () => h(OpenOutline) })]
                    }

                }
            }),
            inlineCode: (node) => h(NText, { code: true }, { default: () => node.value }),
            code: (node) => h(NCode, { code: node.value, language: node.lang, 'show-line-numbers': true }, {}),
            blockquote: (node) => h(NBlockquote, null, { default: () => (node.children || []).flatMap((child) => renderAst2Vue(child, renderConfig)) }),
            list: (node) => h(node.ordered ? NOl : NUl, null, { default: () => (node.children || []).flatMap((child) => renderAst2Vue(child, renderConfig)) }),
            delete: (node) => h(NText, { delete: true }, { default: () => (node.children || []).flatMap((child) => renderAst2Vue(child, renderConfig)) }),
            paragraph: (node) => h(NP, null, { default: () => (node.children || []).flatMap((child) => renderAst2Vue(child, renderConfig)) }),
            emphasis: (node) => h(NText, { italic: true }, { default: () => (node.children || []).flatMap((child) => renderAst2Vue(child, renderConfig)) }),
            thematicBreak: () => h(NDivider, null, {}),
            image: (node) => h(NImage, { src: node.url, alt: node.alt }, {}),
            table: (node) => h(NTable, {}, {
                default: () => [
                    h('thead', {}, {
                        default: () => node.children[0].children.map(
                            (child) => h('th', {}, {
                                default: () => child.children.map(
                                    (child) => renderAst2Vue(child, renderConfig)
                                )
                            })
                        )
                    }),
                    (node.children.slice(1) || []).flatMap((child) => renderAst2Vue(child, renderConfig))
                ]
            }),
            tableCell: (node) => h('td', {}, { default: () => (node.children || []).flatMap((child) => renderAst2Vue(child, renderConfig)) }),
            tableRow: (node) => h('tr', {}, { default: () => (node.children || []).flatMap((child) => renderAst2Vue(child, renderConfig)) }),
            math: (node) => h(NEquation, {
                value: node.value,
                'data-a': 'math',
                katexOptions: {
                    displayMode: true,
                },
            }, {}),
            inlineMath: (node) => h(NEquation, {
                value: node.value, katexOptions: {
                    displayMode: false,
                },
            }, {}),
            listItem: (node) => h('li', null, { default: () => (node.children || []).flatMap((child) => renderAst2Vue(child, renderConfig)) }),
            html: (node) => h('div', { innerHTML: node.value }, {}),
            mention: (node) => h(NText, { type: 'info' }, { default: () => [node.value] }),
        }
    }
    const parsedAst = parseMarkdown(markdown)
    const renderedContent = renderAst2Vue(parsedAst, renderConfig)
</script>
<template>
    <component v-for="(node, index) in renderedContent" :key="index" :is="node"/>
</template>
```
### React
`WIP`

## API
### Parse
```typescript
parseMarkdown(markdownText: string, option?: ParserOptions): Node

interface ParserOptions {
    activityPubOptions?: activityPubOptions
}

interface activityPubOptions {
    notToParseMention?: boolean
}
```
### Render
#### Vue
```typescript
renderAst2Vue(ast: Node, options?: RenderOptions): VNode[]

interface RenderOptions {
    customComponents?: customComponents
    customRenderers?: customRenderers
}

interface customComponents {
    root?: Component
    paragraph?: Component
    text?: Component
    heading?: Component
    emphasis?: Component
    strong?: Component
    inlineCode?: Component
    code?: Component
    blockquote?: Component
    list?: Component
    listItem?: Component
    thematicBreak?: Component
    break?: Component
    link?: Component
    image?: Component
    table?: Component
    tableRow?: Component
    tableCell?: Component
    delete?: Component
    html?: Component
    mention?: Component
    inlineMath?: Component
    math?: Component
}

interface customRenderers {
    root?: (node: RootNode) => VNode
    text?: (node: TextNode) => VNode
    paragraph?: (node: ParagraphNode) => VNode
    heading?: (node: HeadingNode) => VNode
    emphasis?: (node: EmphasisNode) => VNode
    strong?: (node: StrongNode) => VNode
    inlineCode?: (node: InlineCodeNode) => VNode
    code?: (node: CodeNode) => VNode
    blockquote?: (node: BlockquoteNode) => VNode
    list?: (node: ListNode) => VNode
    listItem?: (node: ListItemNode) => VNode
    thematicBreak?: (node: ThematicBreakNode) => VNode
    break?: (node: BreakNode) => VNode
    link?: (node: LinkNode) => VNode
    image?: (node: ImageNode) => VNode
    table?: (node: TableNode) => VNode
    tableRow?: (node: TableRowNode) => VNode
    tableCell?: (node: TableCellNode) => VNode
    delete?: (node: DeleteNode) => VNode
    html?: (node: HTMLNode) => VNode
    mention?: (node: MentionNode) => VNode
    inlineMath?: (node: InlineMathNode) => VNode
    math?: (node: MathNode) => VNode
}
```

## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmattholy%2FAnyMD.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fmattholy%2FAnyMD?ref=badge_large)