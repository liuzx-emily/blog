<script setup>
defineProps({
  content: {
    required: true,
    type: String,
  },
});
</script>

<template>
  <div id="post-content" v-html="content"></div>
</template>
<style lang="scss" scoped>
#post-content:deep() {
  font-size: 14px;
  color: #333;
  margin-top: 20px;
  h2 {
    font-size: 21px;
    background: #eff4f5;
    padding: 10px 0 10px 12px;
    margin: 8px 0;
  }
  h3 {
    font-size: 16px;
    border: 1px dashed #999;
    padding: 6px 0 6px 8px;
    margin: 4px 0;
    border-radius: 4px;
  }
  h4 {
    font-size: 15px;
    margin: 10px 0;
  }
  h5 {
    font-size: 14px;
    margin: 8px 0;
  }
  h6 {
    font-size: 14px;
    margin: 6px 0;
    color: black;
    &::before {
      font-size: 12px;
      content: "✧✧✧✧✧✧";
      font-weight: normal;
      margin-right: 4px;
    }
  }
  p {
    line-height: 22px;
    margin: 10px 0;
  }
  img {
    max-width: 100%;
  }

  hr {
    margin: 35px 0;
    border: none;
    border-bottom: 1px solid #ddd;
  }

  blockquote {
    background: #f5f5f5;
    margin: 0;
    padding: 1px 20px;
  }

  a {
    color: #2196f3;
  }
  ul,
  ol {
    padding-left: 20px;
  }
  ul > li {
    list-style: circle;
  }
  li {
    line-height: 22px;
    margin: 2px 0;
  }
  table {
    border-collapse: collapse;
    th {
      background-color: #eff3f5;
    }
    th,
    td {
      border: 1px solid #ddd;
      padding: 8px;
    }
  }
  p > code,
  li > code {
    padding: 1px 2px;
    background: #f9f2f4;
    color: #c7254e;
    word-break: break-all;
  }
  pre {
    background-color: #f5f7ff;
    padding: 8px;
    color: #555;
    font-family: Source Code Pro;
    overflow-x: auto;
    .hljs-comment {
      font-size: 13px;
      color: #9e9e9e;
    }
    .hljs-keyword {
      color: #6679cc;
    }
    .function_ {
      color: #3d8fd1;
    }
    .hljs-string {
      color: #ac9739;
    }
    .hljs-number,
    .hljs-attr,
    .hljs-regexp {
      color: #ac9739;
    }
    .hljs-subst {
      color: #ac3939;
    }
  }
  pre.language-html {
    .hljs-tag > .hljs-name {
      color: #c94922;
    }
  }
  iframe {
    width: 100%;
    height: 280px;
    margin: 10px 0;
  }
}
</style>
