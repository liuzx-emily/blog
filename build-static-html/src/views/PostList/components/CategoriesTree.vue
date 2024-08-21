<script setup>
import { categories } from "../../../store";

const emit = defineEmits(["select"]);

function selectTreeNode(selected, e) {
  emit("select", e.node.key);
}
</script>

<template>
  <a-tree
    :default-expand-all="true"
    :tree-data="categories"
    :fieldNames="{ children: 'children', title: 'name', key: 'name' }"
    @select="selectTreeNode"
  >
    <template #title="{ name, count }">{{ name }} ({{ count }})</template>
  </a-tree>
</template>
