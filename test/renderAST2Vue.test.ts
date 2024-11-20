import { expect, test, describe } from 'vitest'
import { renderAst2Vue, parseMarkdown } from '../src/index.ts'
import { isVNode } from 'vue'

describe('Function renderAst2Vue', () => {

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
})
