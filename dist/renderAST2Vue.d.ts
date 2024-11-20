import { VNode } from 'vue';
import { Node } from 'unist';
import 'katex/dist/katex.min.css';
import { MentionNode, RenderedNode, RenderOptions, customComponents } from './types';
export type { RenderedNode, RenderOptions, customComponents, MentionNode };
export declare function renderAst2Vue(ast: Node, options?: RenderOptions): VNode[];
