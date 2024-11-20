import { Plugin } from 'unified';
import { activityPubOptions } from '../types.ts';
declare const activityPubMention: Plugin<[activityPubOptions?]>;
export default activityPubMention;
