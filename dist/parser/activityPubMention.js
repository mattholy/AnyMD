import { visit } from 'unist-util-visit';
const activityPubMention = (option) => {
    if (!option?.notToParseMention) {
        return (tree) => {
            visit(tree, 'link', (node, index, parent) => {
                if (node.url.startsWith('mailto:')) {
                    let textNode = {
                        type: 'text',
                        value: node.children.map((child) => child.value).join(''),
                        position: node.position,
                    };
                    if (parent && typeof index === 'number') {
                        parent.children[index] = textNode;
                        if (index > 0 && parent.children[index - 1].type === 'text') {
                            const prevNode = parent.children[index - 1];
                            prevNode.value += textNode.value;
                            parent.children.splice(index, 1);
                            textNode = prevNode;
                            index--;
                        }
                        if (index < parent.children.length - 1 && parent.children[index + 1].type === 'text') {
                            const nextNode = parent.children[index + 1];
                            textNode.value += nextNode.value;
                            parent.children.splice(index + 1, 1);
                        }
                    }
                }
            });
            visit(tree, 'text', (node, index, parent) => {
                const mentionRegex = /@([a-zA-Z0-9_]+)(@[a-zA-Z0-9.-]+)?/g;
                let match;
                let newChildren = [];
                let lastIndex = 0;
                while ((match = mentionRegex.exec(node.value)) !== null) {
                    if (match.index > lastIndex) {
                        newChildren.push({
                            type: 'text',
                            value: node.value.slice(lastIndex, match.index),
                            position: undefined,
                        });
                    }
                    newChildren.push({
                        type: 'mention',
                        value: match[0],
                        position: undefined,
                    });
                    lastIndex = mentionRegex.lastIndex;
                }
                if (lastIndex < node.value.length) {
                    newChildren.push({
                        type: 'text',
                        value: node.value.slice(lastIndex),
                        position: undefined,
                    });
                }
                if (newChildren.length > 0 && parent && typeof index === 'number') {
                    parent.children.splice(index, 1, ...newChildren);
                }
            });
        };
    }
};
export default activityPubMention;
