import { Plugin } from 'unified';
import { activityPubOptions } from '../types';
declare const activityPubMention: Plugin<[activityPubOptions?]>;
export default activityPubMention;
