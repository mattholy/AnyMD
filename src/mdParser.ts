import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import { Node } from 'unist'
import activityPubPlugin from './parser/activityPubMention.ts'
import { ParserOptions } from './types.ts'

export function parseMarkdown(markdownText: string, option?: ParserOptions): Node {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(activityPubPlugin, option?.activityPubOptions ?? {})

  const ast = processor.parse(markdownText)
  const processedAst = processor.runSync(ast)
  return processedAst
}
