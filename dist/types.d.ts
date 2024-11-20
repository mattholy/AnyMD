import { Node } from 'unist';
import { VNode } from 'vue';
export interface RootNode extends Node {
    type: 'root';
    children: RenderedNode[];
}
export interface ParagraphNode extends Node {
    type: 'paragraph';
    children: RenderedNode[];
}
export interface TextNode extends Node {
    type: 'text';
    value: string;
}
export interface HeadingNode extends Node {
    type: 'heading';
    depth: number;
    children: RenderedNode[];
}
export interface EmphasisNode extends Node {
    type: 'emphasis';
    children: RenderedNode[];
}
export interface StrongNode extends Node {
    type: 'strong';
    children: RenderedNode[];
}
export interface InlineCodeNode extends Node {
    type: 'inlineCode';
    value: string;
}
export interface CodeNode extends Node {
    type: 'code';
    value: string;
    lang?: string;
}
export interface BlockquoteNode extends Node {
    type: 'blockquote';
    children: RenderedNode[];
}
export interface ListNode extends Node {
    type: 'list';
    ordered: boolean;
    start?: number;
    spread?: boolean;
    children: RenderedNode[];
}
export interface ListItemNode extends Node {
    type: 'listItem';
    spread?: boolean;
    checked?: boolean | null;
    children: RenderedNode[];
}
export interface ThematicBreakNode extends Node {
    type: 'thematicBreak';
}
export interface BreakNode extends Node {
    type: 'break';
}
export interface LinkNode extends Node {
    type: 'link';
    url: string;
    title?: string;
    children: RenderedNode[];
}
export interface ImageNode extends Node {
    type: 'image';
    url: string;
    title?: string;
    alt?: string;
}
export interface TableNode extends Node {
    type: 'table';
    align: Array<'left' | 'center' | 'right' | null>;
    children: TableRowNode[];
}
export interface TableRowNode extends Node {
    type: 'tableRow';
    children: TableCellNode[];
}
export interface TableCellNode extends Node {
    type: 'tableCell';
    children: RenderedNode[];
}
export interface DeleteNode extends Node {
    type: 'delete';
    children: RenderedNode[];
}
export interface HTMLNode extends Node {
    type: 'html';
    value: string;
}
export interface MentionNode extends Node {
    type: 'mention';
    value: string;
}
export interface InlineMathNode extends Node {
    type: 'inlineMath';
    value: string;
}
export interface MathNode extends Node {
    type: 'math';
    value: string;
}
export type RenderedNode = RootNode | ParagraphNode | TextNode | HeadingNode | EmphasisNode | StrongNode | InlineCodeNode | CodeNode | BlockquoteNode | ListNode | ListItemNode | ThematicBreakNode | BreakNode | LinkNode | ImageNode | TableNode | TableRowNode | TableCellNode | DeleteNode | HTMLNode | MentionNode | InlineMathNode | MathNode;
export interface RenderOptions {
    customComponents?: customComponents;
    customRenderers?: customRenderers;
}
export interface customComponents {
}
export interface customRenderers {
    root?: (node: RootNode) => VNode;
    text?: (node: TextNode) => VNode;
    paragraph?: (node: ParagraphNode) => VNode;
    heading?: (node: HeadingNode) => VNode;
    emphasis?: (node: EmphasisNode) => VNode;
    strong?: (node: StrongNode) => VNode;
    inlineCode?: (node: InlineCodeNode) => VNode;
    code?: (node: CodeNode) => VNode;
    blockquote?: (node: BlockquoteNode) => VNode;
    list?: (node: ListNode) => VNode;
    listItem?: (node: ListItemNode) => VNode;
    thematicBreak?: (node: ThematicBreakNode) => VNode;
    break?: (node: BreakNode) => VNode;
    link?: (node: LinkNode) => VNode;
    image?: (node: ImageNode) => VNode;
    table?: (node: TableNode) => VNode;
    tableRow?: (node: TableRowNode) => VNode;
    tableCell?: (node: TableCellNode) => VNode;
    delete?: (node: DeleteNode) => VNode;
    html?: (node: HTMLNode) => VNode;
    mention?: (node: MentionNode) => VNode;
    inlineMath?: (node: InlineMathNode) => VNode;
    math?: (node: MathNode) => VNode;
}
export interface ParserOptions {
    activityPubOptions?: activityPubOptions;
}
export interface activityPubOptions {
    notToParseMention?: boolean;
}
