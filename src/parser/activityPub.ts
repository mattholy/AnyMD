import { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { Node, Parent } from 'unist'
import { LinkNode, TextNode, MentionNode, HashTagNode, activityPubOptions, RenderedNode } from '../types.ts'

const activityPubMention: Plugin<[activityPubOptions?]> = (option?: activityPubOptions) => {
    if (!option?.notToParseActivityPub) {
        return (tree) => {
            visit(tree, 'link', (node: LinkNode, index, parent: RenderedNode) => {
                if (node.url.startsWith('mailto:')) {
                    if (parent && 'children' in parent && typeof index === 'number') {
                        let newChildren: RenderedNode[] = []
                        let elder = parent.children[index - 1]
                        if ('value' in elder && typeof elder.value === 'string' && elder.value.endsWith('@')) {
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
                if (parent && parent.type === 'link' && parent.url.startsWith('mailto:')) {
                    return
                }
                const hashtagRegex = /(?:^|\s)(#[\p{L}]+)(?=\P{L}|$)/gu
                let match
                let newChildren: Node[] = []
                let lastIndex = 0
                while ((match = hashtagRegex.exec(node.value)) !== null) {
                    if (match.index > lastIndex) {
                        newChildren.push({
                            type: 'text',
                            value: node.value.slice(lastIndex, match.index),
                            position: undefined,
                        } as TextNode)
                    }

                    const hashtagValue = match[1]
                    newChildren.push({
                        type: 'hashtag',
                        value: hashtagValue,
                        position: undefined,
                    } as HashTagNode)

                    lastIndex = hashtagRegex.lastIndex
                }

                if (lastIndex < node.value.length) {
                    newChildren.push({
                        type: 'text',
                        value: node.value.slice(lastIndex),
                        position: undefined,
                    } as TextNode)
                }

                if (newChildren.length > 0 && parent && typeof index === 'number' && 'children' in parent) {
                    parent.children.splice(index, 1, ...(newChildren as RenderedNode[]))
                }
            })

            visit(tree, 'text', (node: TextNode, index, parent: RenderedNode) => {
                if (parent && parent.type === 'link' && parent.url.startsWith('mailto:')) {
                    return
                }
                const mentionRegex = /(?:^|\s)@[a-zA-Z0-9_]+(?:@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})?(?=\s|$)/g
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                let match
                let newChildren: Node[] = []
                let lastIndex = 0

                while ((match = mentionRegex.exec(node.value)) !== null) {
                    if (match.index > lastIndex) {
                        newChildren.push({
                            type: 'text',
                            value: node.value.slice(lastIndex, match.index),
                            position: undefined,
                        } as TextNode)
                    }

                    const mentionValue = match[0]
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

                    lastIndex = mentionRegex.lastIndex
                }

                if (lastIndex < node.value.length) {
                    newChildren.push({
                        type: 'text',
                        value: node.value.slice(lastIndex),
                        position: undefined,
                    } as TextNode)
                }

                if (newChildren.length > 0 && parent && typeof index === 'number' && 'children' in parent) {
                    parent.children.splice(index, 1, ...(newChildren as RenderedNode[]))
                }
            })
        }
    }
}

export default activityPubMention
