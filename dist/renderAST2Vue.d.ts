import { VNode } from 'vue';
import { Node } from 'unist';
import 'katex/dist/katex.min.css';
import { RenderOptions } from './types';
export declare function renderAst2Vue(ast: Node, options?: RenderOptions): VNode[];
