import { expect, test, describe } from 'vitest'
import * as types from '../src/types.ts'

describe('Node Types', () => {
    test('RootNode should have correct type and children', () => {
        const rootNode: types.RootNode = {
            type: 'root',
            children: []
        }
        expect(rootNode.type).toBe('root')
        expect(rootNode.children).toEqual([])
    })

    test('ParagraphNode should have correct type and children', () => {
        const paragraphNode: types.ParagraphNode = {
            type: 'paragraph',
            children: []
        }
        expect(paragraphNode.type).toBe('paragraph')
        expect(paragraphNode.children).toEqual([])
    })

    test('TextNode should have correct type and value', () => {
        const textNode: types.TextNode = {
            type: 'text',
            value: 'Hello, world!'
        }
        expect(textNode.type).toBe('text')
        expect(textNode.value).toBe('Hello, world!')
    })

    test('HeadingNode should have correct type, depth, and children', () => {
        const headingNode: types.HeadingNode = {
            type: 'heading',
            depth: 1,
            children: []
        }
        expect(headingNode.type).toBe('heading')
        expect(headingNode.depth).toBe(1)
        expect(headingNode.children).toEqual([])
    })

    test('LinkNode should have correct type, url, and children', () => {
        const linkNode: types.LinkNode = {
            type: 'link',
            url: 'https://example.com',
            children: []
        }
        expect(linkNode.type).toBe('link')
        expect(linkNode.url).toBe('https://example.com')
        expect(linkNode.children).toEqual([])
    })

    test('ImageNode should have correct type, url, and optional properties', () => {
        const imageNode: types.ImageNode = {
            type: 'image',
            url: 'https://example.com/image.png'
        }
        expect(imageNode.type).toBe('image')
        expect(imageNode.url).toBe('https://example.com/image.png')
        expect(imageNode.title).toBeUndefined()
        expect(imageNode.alt).toBeUndefined()
    })

    test('CodeNode should have correct type, value, and optional lang', () => {
        const codeNode: types.CodeNode = {
            type: 'code',
            value: 'console.log("Hello, world!")'
        }
        expect(codeNode.type).toBe('code')
        expect(codeNode.value).toBe('console.log("Hello, world!")')
        expect(codeNode.lang).toBeUndefined()
    })

    test('BlockquoteNode should have correct type and children', () => {
        const blockquoteNode: types.BlockquoteNode = {
            type: 'blockquote',
            children: []
        }
        expect(blockquoteNode.type).toBe('blockquote')
        expect(blockquoteNode.children).toEqual([])
    })

    test('ListNode should have correct type, ordered, and children', () => {
        const listNode: types.ListNode = {
            type: 'list',
            ordered: true,
            children: []
        }
        expect(listNode.type).toBe('list')
        expect(listNode.ordered).toBe(true)
        expect(listNode.children).toEqual([])
    })

    test('ListItemNode should have correct type and children', () => {
        const listItemNode: types.ListItemNode = {
            type: 'listItem',
            children: []
        }
        expect(listItemNode.type).toBe('listItem')
        expect(listItemNode.children).toEqual([])
    })

    test('ThematicBreakNode should have correct type', () => {
        const thematicBreakNode: types.ThematicBreakNode = {
            type: 'thematicBreak'
        }
        expect(thematicBreakNode.type).toBe('thematicBreak')
    })

    test('BreakNode should have correct type', () => {
        const breakNode: types.BreakNode = {
            type: 'break'
        }
        expect(breakNode.type).toBe('break')
    })

    test('TableNode should have correct type, align, and children', () => {
        const tableNode: types.TableNode = {
            type: 'table',
            align: ['left', 'center', 'right'],
            children: []
        }
        expect(tableNode.type).toBe('table')
        expect(tableNode.align).toEqual(['left', 'center', 'right'])
        expect(tableNode.children).toEqual([])
    })

    test('TableRowNode should have correct type and children', () => {
        const tableRowNode: types.TableRowNode = {
            type: 'tableRow',
            children: []
        }
        expect(tableRowNode.type).toBe('tableRow')
        expect(tableRowNode.children).toEqual([])
    })

    test('TableCellNode should have correct type and children', () => {
        const tableCellNode: types.TableCellNode = {
            type: 'tableCell',
            children: []
        }
        expect(tableCellNode.type).toBe('tableCell')
        expect(tableCellNode.children).toEqual([])
    })

    test('DeleteNode should have correct type and children', () => {
        const deleteNode: types.DeleteNode = {
            type: 'delete',
            children: []
        }
        expect(deleteNode.type).toBe('delete')
        expect(deleteNode.children).toEqual([])
    })

    test('HTMLNode should have correct type and value', () => {
        const htmlNode: types.HTMLNode = {
            type: 'html',
            value: '<div>Hello, world!</div>'
        }
        expect(htmlNode.type).toBe('html')
        expect(htmlNode.value).toBe('<div>Hello, world!</div>')
    })

    test('MentionNode should have correct type and value', () => {
        const mentionNode: types.MentionNode = {
            type: 'mention',
            value: '@user'
        }
        expect(mentionNode.type).toBe('mention')
        expect(mentionNode.value).toBe('@user')
    })

    test('InlineMathNode should have correct type and value', () => {
        const inlineMathNode: types.InlineMathNode = {
            type: 'inlineMath',
            value: 'E=mc^2'
        }
        expect(inlineMathNode.type).toBe('inlineMath')
        expect(inlineMathNode.value).toBe('E=mc^2')
    })

    test('MathNode should have correct type and value', () => {
        const mathNode: types.MathNode = {
            type: 'math',
            value: '\\frac{a}{b}'
        }
        expect(mathNode.type).toBe('math')
        expect(mathNode.value).toBe('\\frac{a}{b}')
    })
})
