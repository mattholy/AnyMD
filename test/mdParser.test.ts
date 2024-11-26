import { expect, test, describe } from 'vitest'
import { parseMarkdown } from '../src/index.ts'

describe('Function parseMarkdown', () => {
    test('should parse markdown text to AST', () => {
        const input = '## Hello Markdown'
        const result = parseMarkdown(input)

        expect(result).toBeDefined()
        expect(result).toHaveProperty('type', 'root')
    })

    test('Dealing with single ActivityPub identifier', () => {
        const input = '@123@abc.com'
        const result = parseMarkdown(input) as any
        if ('children' in result.children[0] && result.children[0].children[0]) {
            expect(result.children[0].children[0]).toHaveProperty('type', 'mention')
        }
    })

    test('Dealing with single ActivityPub hashtag', () => {
        const input = '#test'
        const result = parseMarkdown(input) as any

        console.debug(result.children[0])
        if ('children' in result.children[0] && result.children[0].children[0]) {
            expect(result.children[0].children[0]).toHaveProperty('type', 'hashtag')
        }
    })

    test('Dealing with single ActivityPub hashtag on the end', () => {
        const input = 'Have a #test'
        const result = parseMarkdown(input) as any

        console.debug(result.children[0])
        expect(result.children[0].children[0]).toHaveProperty('type', 'text')
        expect(result.children[0].children[0].value).toBe('Have a ')
        expect(result.children[0].children[1]).toHaveProperty('type', 'hashtag')
        expect(result.children[0].children[1].value).toBe('#test')
    })

    test('Dealing with single ActivityPub hashtag on the beginning', () => {
        const input = '#test should be discussed'
        const result = parseMarkdown(input) as any

        console.debug(result.children[0])
        if ('children' in result.children[0] && result.children[0].children[0]) {
            expect(result.children[0].children[0]).toHaveProperty('type', 'hashtag')
        }
    })

    test('Dealing with single ActivityPub hashtag in the middle', () => {
        const input = 'my #test is good'
        const result = parseMarkdown(input) as any

        console.debug(result.children[0])
        expect(result.children[0].children[0]).toHaveProperty('type', 'text')
        expect(result.children[0].children[0].value).toBe('my ')
        expect(result.children[0].children[1]).toHaveProperty('type', 'hashtag')
        expect(result.children[0].children[1].value).toBe('#test')
    })

    test('Dealing with multiple ActivityPub hashtags in text', () => {
        const input = '这是一个话题标签 #阿斯顿 欢迎讨论。 #讨论'
        const result = parseMarkdown(input) as any

        expect(result.children[0].children[1]).toHaveProperty('type', 'hashtag')
        expect(result.children[0].children[1].value).toBe('#阿斯顿')
        expect(result.children[0].children[3]).toHaveProperty('type', 'hashtag')
        expect(result.children[0].children[3].value).toBe('#讨论')
    })

    test('Not to parse ActivityPub identifier', () => {
        const input = '@123@abc.com'
        const result = parseMarkdown(input, { activityPubOptions: { notToParseActivityPub: true } }) as any

        expect(result.children[0].children.length).toBe(2)
        expect(result.children[0].children[0]).toHaveProperty('type', 'text')
        expect(result.children[0].children[0].value).toBe('@')
        expect(result.children[0].children[1]).toHaveProperty('type', 'link')
        expect(result.children[0].children[1].url).toBe('mailto:123@abc.com')
    })

    test('Dealing with single ActivityPub identifier with same origin', () => {
        const input = '@example'
        const result = parseMarkdown(input, {}) as any
        console.debug(result.children[0].children)
        if ('children' in result.children[0] && result.children[0].children[0]) {
            expect(result.children[0].children[0]).toHaveProperty('type', 'mention')
        }
    })

    test('should parse GFM task list', () => {
        const input = '- [x] Task 1\n- [ ] Task 2'
        const result = parseMarkdown(input) as any
        console.debug(result.children[0].children)
        expect(result).toBeDefined()
        expect(result.children[0].children[0]).toHaveProperty('type', 'listItem')
        expect(result.children[0].children[0].checked).toBe(true)
        expect(result.children[0].children[1].checked).toBe(false)
    })

    test('should parse list', () => {
        const input = '- Task 1\n- Task 2'
        const result = parseMarkdown(input) as any
        console.debug(result.children[0].children)
        expect(result).toBeDefined()
        expect(result.children[0].children[0]).toHaveProperty('type', 'listItem')
        expect(result.children[0].children[0].checked).toBe(null)
        expect(result.children[0].children[1].checked).toBe(null)
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

    test('should parse multiple email addresses and activitypub id', () => {
        const input = 'Emails: @test1@example.com, test2@example.com'
        const result = parseMarkdown(input) as any
        console.debug(result.children[0].children)
        expect(result).toBeDefined()
        expect(result.children[0].children[1]).toHaveProperty('type', 'link')
        expect(result.children[0].children[1].url).toBe('mailto:test2@example.com')
    })

    test('should parse emoji', () => {
        const input = 'a :smile: emoji'
        const result = parseMarkdown(input) as any
        console.debug(result.children[0].children)
        expect(result).toBeDefined()
        expect(result.children[0].children[1]).toHaveProperty('type', 'emoji')
        expect(result.children[0].children[1].value).toBe('smile')
    })

    test('should not parse emoji in code', () => {
        const input = '`a :smile: emoji`'
        const result = parseMarkdown(input) as any
        console.debug(result.children[0].children)
        expect(result).toBeDefined()
        expect(result.children[0].children[0]).toHaveProperty('type', 'inlineCode')
        expect(result.children[0].children[0].value).toBe('a :smile: emoji')
    })

    test('should not parse emoji when notToParseActivityPub to be set', () => {
        const input = 'a :smile: emoji'
        const result = parseMarkdown(input, { activityPubOptions: { notToParseActivityPub: true } }) as any
        console.debug(result.children[0].children)
        expect(result).toBeDefined()
        expect(result.children[0].children[0]).toHaveProperty('type', 'text')
        expect(result.children[0].children[0].value).toBe('a :smile: emoji')
    })
})