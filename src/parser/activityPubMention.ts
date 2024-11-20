import { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { Node, Parent } from 'unist'
import { LinkNode, TextNode, MentionNode, activityPubOptions } from '../types'


const activityPubMention: Plugin<[activityPubOptions?]> = (option?: activityPubOptions) => {
    if (!option?.notToParseMention) {
        return (tree) => {
            visit(tree, 'link', (node: LinkNode, index, parent: Parent) => {
                if (node.url.startsWith('mailto:')) {
                    let textNode: TextNode = {
                        type: 'text',
                        value: node.children.map((child) => (child as TextNode).value).join(''),
                        position: node.position,
                    }

                    if (parent && typeof index === 'number') {
                        parent.children[index] = textNode

                        if (index > 0 && parent.children[index - 1].type === 'text') {
                            const prevNode = parent.children[index - 1] as TextNode
                            prevNode.value += textNode.value
                            parent.children.splice(index, 1)
                            textNode = prevNode
                            index--
                        }
                        if (index < parent.children.length - 1 && parent.children[index + 1].type === 'text') {
                            const nextNode = parent.children[index + 1] as TextNode
                            textNode.value += nextNode.value
                            parent.children.splice(index + 1, 1)
                        }
                    }
                }
            })

            visit(tree, 'text', (node: TextNode, index, parent: Parent) => {
                const mentionRegex = /@([a-zA-Z0-9_]+)(@[a-zA-Z0-9.-]+)?/g
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

                    newChildren.push({
                        type: 'mention',
                        value: match[0],
                        position: undefined,
                    } as MentionNode)

                    lastIndex = mentionRegex.lastIndex
                }

                if (lastIndex < node.value.length) {
                    newChildren.push({
                        type: 'text',
                        value: node.value.slice(lastIndex),
                        position: undefined,
                    } as TextNode)
                }

                if (newChildren.length > 0 && parent && typeof index === 'number') {
                    parent.children.splice(index, 1, ...newChildren)
                }
            })
        }
    }
}

export default activityPubMention
