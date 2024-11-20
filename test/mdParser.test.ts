import { expect, test, describe } from 'vitest'
import { parseMarkdown } from '../src/mdParser'

describe('Function parseMarkdown', () => {
    test('should parse markdown text to AST', () => {
        const input = '## Hello Markdown'
        const result = parseMarkdown(input)

        expect(result).toBeDefined()
        expect(result).toHaveProperty('type', 'root');
    })
})