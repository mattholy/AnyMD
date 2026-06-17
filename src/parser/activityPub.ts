import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import type { Node } from 'unist'
import type { LinkNode, TextNode, MentionNode, HashTagNode, activityPubOptions, RenderedNode, EmojiNode } from '../types.js'

const activityPubMention: Plugin<[activityPubOptions?]> = (option?: activityPubOptions) => {
    if (!option?.notToParseActivityPub) {
        return (tree) => {
            visit(tree, 'link', (node: LinkNode, index, parent: RenderedNode) => {
                if (node.url.startsWith('mailto:')) {
                    if (parent && 'children' in parent && typeof index === 'number') {
                        let newChildren: RenderedNode[] = []
                        let elder = parent.children[index - 1]
                        if (elder && 'value' in elder && typeof elder.value === 'string' && elder.value.endsWith('@') && node.children[0]) {
                            newChildren = parent.children
                            newChildren[index] = node.children[0]
                            for (let i = 0; i < newChildren.length - 1; i++) {
                                if (newChildren[i].type === 'text' && newChildren[i + 1].type === 'text') {
                                    (newChildren[i] as TextNode).value += (newChildren[i + 1] as TextNode).value
                                    if (newChildren[i].position && newChildren[i + 1].position) {
                                        if (newChildren[i].position !== undefined && newChildren[i + 1].position !== undefined) {
                                            newChildren[i].position!.end = newChildren[i + 1].position!.end
                                        }
                                    }
                                    newChildren.splice(i + 1, 1)
                                    i--
                                }
                            }
                            parent.children = newChildren
                        }
                    }
                }
            }
            )

            visit(tree, 'text', (node: TextNode, index, parent: RenderedNode) => {
                if (parent && parent.type === 'link') {
                    return
                }
                const hashtagRegex = /(^|\s)(#[\p{L}0-9]+)(?=\P{L}|$)/gu
                let match
                let newChildren: Node[] = []
                let lastIndex = 0
                let hasMatch = false

                while ((match = hashtagRegex.exec(node.value)) !== null) {
                    hasMatch = true
                    const prefix = match[1]
                    const hashtagValue = match[2]
                    const hashtagIndex = match.index + prefix.length

                    if (hashtagIndex > lastIndex) {
                        newChildren.push({
                            type: 'text',
                            value: node.value.slice(lastIndex, hashtagIndex),
                            position: undefined,
                        } as TextNode)
                    }

                    newChildren.push({
                        type: 'hashtag',
                        value: hashtagValue,
                        position: undefined,
                    } as HashTagNode)

                    lastIndex = hashtagIndex + hashtagValue.length
                }

                if (lastIndex < node.value.length) {
                    newChildren.push({
                        type: 'text',
                        value: node.value.slice(lastIndex),
                        position: undefined,
                    } as TextNode)
                }

                if (hasMatch && parent && typeof index === 'number' && 'children' in parent) {
                    parent.children.splice(index, 1, ...(newChildren as RenderedNode[]))
                }
            })

            visit(tree, 'text', (node: TextNode, index, parent: RenderedNode) => {
                if (parent && parent.type === 'link') {
                    return
                }
                const emojiRegex = /(^|\s):([a-zA-Z0-9_]+):(?=\s|$)/g
                let match
                let newChildren: Node[] = []
                let lastIndex = 0
                let hasMatch = false

                while ((match = emojiRegex.exec(node.value)) !== null) {
                    hasMatch = true
                    const prefix = match[1]
                    const emojiValue = match[2]
                    const emojiIndex = match.index + prefix.length

                    if (emojiIndex > lastIndex) {
                        newChildren.push({
                            type: 'text',
                            value: node.value.slice(lastIndex, emojiIndex),
                            position: undefined,
                        } as TextNode)
                    }

                    newChildren.push({
                        type: 'emoji',
                        value: emojiValue,
                        position: undefined,
                    } as EmojiNode)

                    lastIndex = emojiIndex + emojiValue.length + 2
                }

                if (lastIndex < node.value.length) {
                    newChildren.push({
                        type: 'text',
                        value: node.value.slice(lastIndex),
                        position: undefined,
                    } as TextNode)
                }

                if (hasMatch && parent && typeof index === 'number' && 'children' in parent) {
                    parent.children.splice(index, 1, ...(newChildren as RenderedNode[]))
                }
            })

            visit(tree, 'text', (node: TextNode, index, parent: RenderedNode) => {
                if (parent && parent.type === 'link') {
                    return
                }
                const mentionRegex = /(^|\s)(@[a-zA-Z0-9_]+(?:@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})?)(?=\s|$)/g
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                let match
                let newChildren: Node[] = []
                let lastIndex = 0
                let hasMatch = false

                while ((match = mentionRegex.exec(node.value)) !== null) {
                    hasMatch = true
                    const prefix = match[1]
                    const mentionValue = match[2]
                    const mentionIndex = match.index + prefix.length

                    if (mentionIndex > lastIndex) {
                        newChildren.push({
                            type: 'text',
                            value: node.value.slice(lastIndex, mentionIndex),
                            position: undefined,
                        } as TextNode)
                    }

                    if (emailRegex.test(mentionValue)) {
                        newChildren.push({
                            type: 'text',
                            value: mentionValue,
                            position: undefined,
                        } as TextNode)
                    } else {
                        newChildren.push({
                            type: 'mention',
                            value: mentionValue,
                            position: undefined,
                        } as MentionNode)
                    }

                    lastIndex = mentionIndex + mentionValue.length
                }

                if (lastIndex < node.value.length) {
                    newChildren.push({
                        type: 'text',
                        value: node.value.slice(lastIndex),
                        position: undefined,
                    } as TextNode)
                }

                if (hasMatch && parent && typeof index === 'number' && 'children' in parent) {
                    parent.children.splice(index, 1, ...(newChildren as RenderedNode[]))
                }
            })
        }
    }
}

export default activityPubMention
