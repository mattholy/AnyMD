import { expect, test, describe } from 'vitest'
import { parseMarkdown } from '../src/index.ts'

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
        if ('children' in result.children[0] && result.children[0].children[0]) {
            expect(result.children[0].children[0]).toHaveProperty('type', 'mention')
        }
    })

    test('Not to parse ActivityPub identifier', () => {
        const input = '@123@abc.com'
        const result = parseMarkdown(input, { activityPubOptions: { notToParseMention: true } }) as any
        console.log(result.children[0])

        expect(result.children[0].children.length).toBe(2)
        expect(result.children[0].children[0]).toHaveProperty('type', 'text')
        expect(result.children[0].children[0].value).toBe('@')
        expect(result.children[0].children[1]).toHaveProperty('type', 'link')
        expect(result.children[0].children[1].url).toBe('mailto:123@abc.com')
        expect
    })

    test('Dealing with single ActivityPub identifier with same origin', () => {
        const input = '@example'
        const result = parseMarkdown(input) as any

        if ('children' in result.children[0] && result.children[0].children[0]) {
            expect(result.children[0].children[0]).toHaveProperty('type', 'mention')
        }
    })

    test('should parse GFM task list', () => {
        const input = '- [x] Task 1\n- [ ] Task 2'
        const result = parseMarkdown(input) as any

        expect(result).toBeDefined()
        expect(result.children[0].children[0]).toHaveProperty('type', 'listItem')
        expect(result.children[0].children[0].checked).toBe(true)
        expect(result.children[0].children[1].checked).toBe(false)
    })

    test('should parse inline math', () => {
        const input = 'This is inline math: $E=mc^2$'
        const result = parseMarkdown(input) as any

        expect(result).toBeDefined()
        expect(result.children[0].children[1]).toHaveProperty('type', 'inlineMath')
    })

    test('should parse block math', () => {
        const input = '$$\nE=mc^2\n$$'
        const result = parseMarkdown(input) as any

        expect(result).toBeDefined()
        expect(result.children[0]).toHaveProperty('type', 'math')
    })

    test('Dealing with email addresses', () => {
        const input = 'Contact me at test@example.com'
        const result = parseMarkdown(input) as any
        if ('children' in result.children[0] && result.children[0].children[0]) {
            expect(result.children[0].children[1]).toHaveProperty('type', 'link')
            expect(result.children[0].children[1].url).toBe('mailto:test@example.com')
            expect(result.children[0].children[1].children[0]).toHaveProperty('type', 'text')
            expect(result.children[0].children[1].children[0].value).toBe('test@example.com')
        }
    })
})