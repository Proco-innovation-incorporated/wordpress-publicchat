import markdownit from "markdown-it";
import taskLists from "markdown-it-task-lists";
import markdownSub from "markdown-it-sub";
import markdownSup from "markdown-it-sup";
import DOMPurify from "dompurify";

// !!! IMPORTANT !!!
// this converter will automatically wrap bare HTTP URLs with <a></a> tags!
const md = markdownit({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
})
  .use(taskLists, { enabled: true })
  .use(markdownSub, { enabled: true })
  .use(markdownSup, { enabled: true });

// Converts commonmark + gfm to html
// Pass in options if we want to transform elements or add classes
export function mdToHtml(commonmark, options = {linksNewTab: true}) {
  if (!commonmark) return '<div class="markdown"></div>';
  console.log("commonmark-request: ", commonmark)
  
  // md -> html
  const html = md.render(commonmark)
  console.debug("html: ", html)

  // Check options
  DOMPurify.removeAllHooks?.();

  // Run this after the attributes have been sanitized
  // TODO: Think about a way to do this generally. We do not want the same problem as the 
  // get methods on the BE where we have to make a check for every single filter param
  DOMPurify.addHook('afterSanitizeAttributes', (node)=>{
    if(options.linksNewTab && node.tagName === 'A') {
      node.setAttribute('target', '_blank')
    }

  })

  // validate html
  const santized = DOMPurify.sanitize(html,
     { 
      USE_PROFILES: {html: true},
      ADD_TAGS: ["s", "sup", "sub"],
      ADD_ATTR: ['class','target','rel'] // Need this for later, so applied styles stay
  })
  console.debug("sanitized: ", santized)

  return `<div class="markdown">${santized}</div>`
}

export function purifyHtml(html) {
  const santized = DOMPurify.sanitize(html,
     { 
      USE_PROFILES: {html: true},
      ADD_TAGS: ["s", "sup", "sub"],
      ADD_ATTR: ['class','target','rel'] // Need this for later, so applied styles stay
  })
  // console.debug("sanitized: ", santized)
  DOMPurify.removeAllHooks();

  return `<div class="purified">${santized}</div>`
}
