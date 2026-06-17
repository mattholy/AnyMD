import { expect, test, describe } from 'vitest'
import { renderAst2Vue, parseMarkdown } from '../src/index.ts'
import { h, isVNode, VNode } from 'vue'

describe('Unit test for renderAst2Vue', () => {

    test('Unit test fot code block default render', () => {
        const input = {
            "type": "code",
            "lang": "python",
            "meta": "[1,2]",
            "value": "import pandas as pd\nprint(pandas)",
            "position": {
                "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                },
                "end": {
                    "line": 4,
                    "column": 4,
                    "offset": 53
                }
            }
        }
        const result = renderAst2Vue(input)

        expect(result).toBeDefined()
        expect(result).toBeInstanceOf(Array)
        expect(isVNode(result[0])).toBe(true)
        expect(result[0].type).toBe('pre')
        expect(result[0].props).toHaveProperty('data-node-style', 'default')
        expect(result[0].props).toHaveProperty('data-node-type', 'code')
        expect(isVNode((result[0].children! as any).default())).toBe(true)
        expect(((result[0].children! as any).default() as VNode).type).toBe('code')
        expect(((result[0].children! as any).default() as VNode).props).toHaveProperty('data-node-style', 'default')
        expect(((result[0].children! as any).default() as VNode).children).toBe('import pandas as pd\nprint(pandas)')
    })

})

describe('Workflow renderAst2Vue', () => {

    test('Simple test for render default Heading1', () => {
        const input = '# Header1'
        const result = renderAst2Vue(parseMarkdown(input))

        expect(result).toBeDefined()
        expect(result).toBeInstanceOf(Array)
        expect(isVNode(result[0])).toBe(true)
        expect(result[0].type).toBe('div')
        expect(result[0].props).toHaveProperty('data-node-style', 'default')
        expect(result[0].props).toHaveProperty('data-node-type', 'root')
        expect(result[0].children).toBeInstanceOf(Array)
        expect(result[0].children![0].type).toBe('h1')
        expect(result[0].children![0].props).toHaveProperty('data-node-style', 'default')
        expect(result[0].children![0].props).toHaveProperty('data-node-type', 'heading')
        expect(result[0].children![0].children).toBeInstanceOf(Array)
        expect(result[0].children![0].children![0].type).toBe('span')
        expect(result[0].children![0].children![0].props).toHaveProperty('data-node-style', 'default')
        expect(result[0].children![0].children![0].props).toHaveProperty('data-node-type', 'text')
        expect(result[0].children![0].children![0].children).toBe('Header1')
    })

    test('Render paragraph with text', () => {
        const input = 'This is a paragraph.'
        const result = renderAst2Vue(parseMarkdown(input))

        expect(result).toBeDefined()
        expect(result).toBeInstanceOf(Array)
        expect(isVNode(result[0])).toBe(true)
        expect(result[0].type).toBe('div')
        expect(result[0].props).toHaveProperty('data-node-style', 'default')
        expect(result[0].props).toHaveProperty('data-node-type', 'root')
        expect(result[0].children).toBeInstanceOf(Array)
        expect(result[0].children![0].type).toBe('p')
        expect(result[0].children![0].props).toHaveProperty('data-node-style', 'default')
        expect(result[0].children![0].props).toHaveProperty('data-node-type', 'paragraph')
        expect(result[0].children![0].children).toBeInstanceOf(Array)
        expect(result[0].children![0].children![0].type).toBe('span')
        expect(result[0].children![0].children![0].props).toHaveProperty('data-node-style', 'default')
        expect(result[0].children![0].children![0].props).toHaveProperty('data-node-type', 'text')
        expect(result[0].children![0].children![0].children).toBe('This is a paragraph.')
    })

    test('Render inline code', () => {
        const input = 'This is `inline code`.'
        const result = renderAst2Vue(parseMarkdown(input))

        expect(result).toBeDefined()
        expect(result).toBeInstanceOf(Array)
        expect(isVNode(result[0])).toBe(true)
        expect(result[0].type).toBe('div')
        expect(result[0].props).toHaveProperty('data-node-style', 'default')
        expect(result[0].props).toHaveProperty('data-node-type', 'root')
        expect(result[0].children).toBeInstanceOf(Array)
        expect(result[0].children![0].type).toBe('p')
        expect(result[0].children![0].props).toHaveProperty('data-node-style', 'default')
        expect(result[0].children![0].props).toHaveProperty('data-node-type', 'paragraph')
        expect(result[0].children![0].children).toBeInstanceOf(Array)
        expect(result[0].children![0].children![1].type).toBe('code')
        expect(result[0].children![0].children![1].props).toHaveProperty('data-node-style', 'default')
        expect(result[0].children![0].children![1].props).toHaveProperty('data-node-type', 'inlineCode')
        expect(result[0].children![0].children![1].children).toBe('inline code')
    })

    test('Render blockquote', () => {
        const input = '> This is a blockquote.'
        const result = renderAst2Vue(parseMarkdown(input))

        expect(result).toBeDefined()
        expect(result).toBeInstanceOf(Array)
        expect(isVNode(result[0])).toBe(true)
        expect(result[0].type).toBe('div')
        expect(result[0].props).toHaveProperty('data-node-style', 'default')
        expect(result[0].props).toHaveProperty('data-node-type', 'root')
        expect(result[0].children).toBeInstanceOf(Array)
        expect(result[0].children![0].type).toBe('blockquote')
        expect(result[0].children![0].props).toHaveProperty('data-node-style', 'default')
        expect(result[0].children![0].props).toHaveProperty('data-node-type', 'blockquote')
        expect(result[0].children![0].children).toBeInstanceOf(Array)
        expect(result[0].children![0].children![0].type).toBe('p')
        expect(result[0].children![0].children![0].props).toHaveProperty('data-node-style', 'default')
        expect(result[0].children![0].children![0].props).toHaveProperty('data-node-type', 'paragraph')
        expect(result[0].children![0].children![0].children[0].children).toBe('This is a blockquote.')
    })

    test('Render unordered list', () => {
        const input = '- Item 1\n- Item 2\n- Item 3'
        const result = renderAst2Vue(parseMarkdown(input))

        expect(result).toBeDefined()
        expect(result).toBeInstanceOf(Array)
        expect(isVNode(result[0])).toBe(true)
        expect(result[0].type).toBe('div')
        expect(result[0].props).toHaveProperty('data-node-style', 'default')
        expect(result[0].props).toHaveProperty('data-node-type', 'root')
        expect(result[0].children).toBeInstanceOf(Array)
        expect(result[0].children![0].type).toBe('ul')
        expect(result[0].children![0].props).toHaveProperty('data-node-style', 'default')
        expect(result[0].children![0].props).toHaveProperty('data-node-type', 'list')
        expect(result[0].children![0].children).toBeInstanceOf(Array)
        expect(result[0].children![0].children!.length).toBe(3)
        expect(result[0].children![0].children![0].type).toBe('li')
        expect(result[0].children![0].children![0].props).toHaveProperty('data-node-style', 'default')
        expect(result[0].children![0].children![0].props).toHaveProperty('data-node-type', 'listItem')
        expect(result[0].children![0].children![0].children![0].type).toBe('p')
        expect(result[0].children![0].children![0].children![0].props).toHaveProperty('data-node-style', 'default')
        expect(result[0].children![0].children![0].children![0].props).toHaveProperty('data-node-type', 'paragraph')
        expect(result[0].children![0].children![0].children![0].children[0].children).toBe('Item 1')
        expect(result[0].children![0].children![1].children![0].children[0].children).toBe('Item 2')
        expect(result[0].children![0].children![2].children![0].children[0].children).toBe('Item 3')
    })

    test('Render ordered list', () => {
        const input = '1. Item 1\n2. Item 2\n3. Item 3'
        const result = renderAst2Vue(parseMarkdown(input))

        expect(result).toBeDefined()
        expect(result).toBeInstanceOf(Array)
        expect(isVNode(result[0])).toBe(true)
        expect(result[0].type).toBe('div')
        expect(result[0].props).toHaveProperty('data-node-style', 'default')
        expect(result[0].props).toHaveProperty('data-node-type', 'root')
        expect(result[0].children).toBeInstanceOf(Array)
        expect(result[0].children![0].type).toBe('ol')
        expect(result[0].children![0].props).toHaveProperty('data-node-style', 'default')
        expect(result[0].children![0].props).toHaveProperty('data-node-type', 'list')
        expect(result[0].children![0].children).toBeInstanceOf(Array)
        expect(result[0].children![0].children!.length).toBe(3)
        expect(result[0].children![0].children![0].type).toBe('li')
        expect(result[0].children![0].children![0].props).toHaveProperty('data-node-style', 'default')
        expect(result[0].children![0].children![0].props).toHaveProperty('data-node-type', 'listItem')
        expect(result[0].children![0].children![0].children![0].type).toBe('p')
        expect(result[0].children![0].children![0].children![0].props).toHaveProperty('data-node-style', 'default')
        expect(result[0].children![0].children![0].children![0].props).toHaveProperty('data-node-type', 'paragraph')
        expect(result[0].children![0].children![0].children![0].children[0].children).toBe('Item 1')
    })

    test('Render link', () => {
        const input = '[GitHub](https://github.com)'
        const result = renderAst2Vue(parseMarkdown(input))

        expect(result).toBeDefined()
        expect(result).toBeInstanceOf(Array)
        expect(isVNode(result[0])).toBe(true)
        expect(result[0].type).toBe('div')
        expect(result[0].props).toHaveProperty('data-node-style', 'default')
        expect(result[0].props).toHaveProperty('data-node-type', 'root')
        expect(result[0].children).toBeInstanceOf(Array)
        expect(result[0].children![0].type).toBe('p')
        expect(result[0].children![0].props).toHaveProperty('data-node-style', 'default')
        expect(result[0].children![0].props).toHaveProperty('data-node-type', 'paragraph')
        expect(result[0].children![0].children).toBeInstanceOf(Array)
        expect(result[0].children![0].children![0].type).toBe('a')
        expect(result[0].children![0].children![0].props).toHaveProperty('href', 'https://github.com')
        expect(result[0].children![0].children![0].props).toHaveProperty('data-node-style', 'default')
        expect(result[0].children![0].children![0].props).toHaveProperty('data-node-type', 'link')
        expect(result[0].children![0].children![0].children![0].type).toBe('span')
        expect(result[0].children![0].children![0].children![0].props).toHaveProperty('data-node-style', 'default')
        expect(result[0].children![0].children![0].children![0].props).toHaveProperty('data-node-type', 'text')
        expect(result[0].children![0].children![0].children![0].children).toBe('GitHub')
    })

    test('applies custom renderers to nested default-rendered children', () => {
        const result = renderAst2Vue(parseMarkdown('Hello **world**'), {
            customRenderers: {
                text: (node) => h('mark', { 'data-custom-text': node.value }, node.value)
            }
        })

        expect(result[0].children![0].children![0].type).toBe('mark')
        expect(result[0].children![0].children![0].props).toHaveProperty('data-custom-text', 'Hello ')
        expect(result[0].children![0].children![1].type).toBe('strong')
        expect(result[0].children![0].children![1].children![0].type).toBe('mark')
        expect(result[0].children![0].children![1].children![0].props).toHaveProperty('data-custom-text', 'world')
    })

    test('renders raw html as escaped text by default', () => {
        const result = renderAst2Vue({
            type: 'html',
            value: '<img src=x onerror=alert(1)>'
        } as any)

        expect(result[0].type).toBe('span')
        expect(result[0].props).not.toHaveProperty('innerHTML')
        expect(result[0].children).toBe('<img src=x onerror=alert(1)>')
    })

    test('renders custom container directives by default', () => {
        const result = renderAst2Vue(parseMarkdown(':::warning{title="Heads up"}\nhello\n:::'))
        const container = result[0].children![0]

        expect(container.type).toBe('div')
        expect(container.props).toHaveProperty('data-node-type', 'containerDirective')
        expect(container.props).toHaveProperty('data-node-name', 'warning')
        expect(container.props).toHaveProperty('data-node-style', 'default')
        expect(container.props).not.toHaveProperty('title')
        expect(container.children![0].type).toBe('p')
        expect(container.children![0].children![0].children).toBe('hello')
    })

    test('uses custom container renderers from custom renderers', () => {
        const result = renderAst2Vue(parseMarkdown(':::warning{title="Heads up"}\nhello\n:::'), {
            customRenderers: {
                customContainers: (node, customContainerInfo) => h(
                    'aside',
                    { 'data-container-title': customContainerInfo.attributes.title },
                    { default: () => customContainerInfo.renderChildren() }
                )
            }
        })
        const container = result[0].children![0]

        expect(container.type).toBe('aside')
        expect(container.props).toHaveProperty('data-container-title', 'Heads up')
        expect(container.children![0].type).toBe('p')
        expect(container.children![0].children[0].children).toBe('hello')
    })

    test('drops unsafe link urls but keeps relative urls', () => {
        const unsafe = renderAst2Vue({
            type: 'link',
            url: 'javascript:alert(1)',
            children: [{ type: 'text', value: 'bad' }]
        } as any)
        const relative = renderAst2Vue({
            type: 'link',
            url: 'README.md',
            children: [{ type: 'text', value: 'good' }]
        } as any)

        expect(unsafe[0].props).toHaveProperty('href', undefined)
        expect(relative[0].props).toHaveProperty('href', 'README.md')
    })

    test('drops unsafe image urls', () => {
        const result = renderAst2Vue({
            type: 'image',
            url: 'data:text/html,<script>alert(1)</script>',
            alt: 'bad'
        } as any)

        expect(result[0].props).toHaveProperty('src', undefined)
        expect(result[0].props).toHaveProperty('alt', 'bad')
    })

    test('renders inline and block math with katex markup', () => {
        const inline = renderAst2Vue({
            type: 'inlineMath',
            value: 'E=mc^2'
        } as any)
        const block = renderAst2Vue({
            type: 'math',
            value: 'E=mc^2'
        } as any)

        expect(inline[0].type).toBe('span')
        expect(inline[0].props).toHaveProperty('data-node-type', 'inlineMath')
        expect(inline[0].props!.innerHTML).toContain('katex')
        expect(block[0].type).toBe('div')
        expect(block[0].props).toHaveProperty('data-node-type', 'math')
        expect(block[0].props!.innerHTML).toContain('katex-display')
    })

    test('renders emphasis, breaks, tables, delete, and activitypub nodes by default', () => {
        const result = renderAst2Vue({
            type: 'root',
            children: [
                {
                    type: 'paragraph',
                    children: [
                        { type: 'emphasis', children: [{ type: 'text', value: 'soft' }] },
                        { type: 'break' }
                    ]
                },
                { type: 'thematicBreak' },
                {
                    type: 'table',
                    align: [null],
                    children: [
                        {
                            type: 'tableRow',
                            children: [
                                {
                                    type: 'tableCell',
                                    children: [{ type: 'delete', children: [{ type: 'text', value: 'old' }] }]
                                }
                            ]
                        }
                    ]
                },
                { type: 'mention', value: '@alice@example.com' },
                { type: 'hashtag', value: '#topic' },
                { type: 'emoji', value: 'smile' }
            ]
        } as any)

        expect(result[0].children![0].children![0].type).toBe('em')
        expect(result[0].children![0].children![0].children![0].children).toBe('soft')
        expect(result[0].children![0].children![1].type).toBe('br')
        expect(result[0].children![1].type).toBe('hr')
        expect(result[0].children![2].type).toBe('table')
        expect(result[0].children![2].children![0].type).toBe('tr')
        expect(result[0].children![2].children![0].children![0].type).toBe('td')
        expect(result[0].children![2].children![0].children![0].children![0].type).toBe('del')
        expect(result[0].children![2].children![0].children![0].children![0].children![0].children).toBe('old')
        expect(result[0].children![3].children).toBe('@alice@example.com')
        expect(result[0].children![4].children).toBe('#topic')
        expect(result[0].children![5].children).toBe('smile')
    })

    test('renders leaf and text directives by default', () => {
        const leaf = renderAst2Vue({
            type: 'leafDirective',
            name: 'badge',
            children: [{ type: 'text', value: 'Stable' }]
        } as any)
        const text = renderAst2Vue({
            type: 'textDirective',
            name: 'mark',
            children: [{ type: 'text', value: 'highlight' }]
        } as any)

        expect(leaf[0].type).toBe('div')
        expect(leaf[0].props).toHaveProperty('data-node-type', 'leafDirective')
        expect(leaf[0].props).toHaveProperty('data-node-name', 'badge')
        expect(leaf[0].children![0].children).toBe('Stable')
        expect(text[0].type).toBe('span')
        expect(text[0].props).toHaveProperty('data-node-type', 'textDirective')
        expect(text[0].props).toHaveProperty('data-node-name', 'mark')
        expect(text[0].children![0].children).toBe('highlight')
    })

    test('uses custom components for child, value, and empty nodes', () => {
        const withChildren = renderAst2Vue({
            type: 'paragraph',
            children: [{ type: 'text', value: 'custom child' }]
        } as any, {
            customComponents: {
                paragraph: 'section' as any
            }
        })
        const withValue = renderAst2Vue({
            type: 'text',
            value: 'custom value'
        } as any, {
            customComponents: {
                text: 'strong' as any
            }
        })
        const empty = renderAst2Vue({
            type: 'thematicBreak'
        } as any, {
            customComponents: {
                thematicBreak: 'hr' as any
            }
        })

        expect(withChildren[0].type).toBe('section')
        expect(withChildren[0].children![0].children).toBe('custom child')
        expect(withValue[0].type).toBe('strong')
        expect(withValue[0].children).toBe('custom value')
        expect(empty[0].type).toBe('hr')
        expect(empty[0].children).toEqual([])
    })

    test('drops empty urls and renders unknown nodes with the fallback message', () => {
        const emptyLink = renderAst2Vue({
            type: 'link',
            url: '',
            children: [{ type: 'text', value: 'empty' }]
        } as any)
        const unknown = renderAst2Vue({
            type: 'unknownNode'
        } as any)

        expect(emptyLink[0].props).toHaveProperty('href', undefined)
        expect(unknown[0].type).toBe('span')
        expect(unknown[0].props).toHaveProperty('data-node-type', 'unknownNode')
        expect(unknown[0].children).toContain('Node Not Recognized Error')
    })
})
