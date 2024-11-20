import { expect, test, describe } from 'vitest'
import { parseMarkdown } from '../src/mdParser.ts'

describe('Function parseMarkdown', () => {
    test('should parse markdown text to AST', () => {
        const input = '## Hello Markdown'
        const result = parseMarkdown(input)

        expect(result).toBeDefined()
        expect(result).toHaveProperty('type', 'root');
    })

    test('Dealing with single ActivityPub identifier', () => {
        const input = '@123@abc.com'
        const result = parseMarkdown(input) as any
        expect(result.children[0].children[0]).toHaveProperty('type', 'mention')
    })
})