import { expect, test, describe } from 'vitest'
import { renderAst2Vue, parseMarkdown } from '../src/index.ts'
import { isVNode, VNode } from 'vue'

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
})
