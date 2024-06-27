<script setup lang="ts">
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue';

const { layoutConfig, layoutState, isSidebarActive } = useLayout();
const outsideClickListener = ref<((event: Event) => void) | null>(null);

watch(isSidebarActive, (newVal) => {
  if (newVal) {
    bindOutsideClickListener();
  } else {
    unbindOutsideClickListener();
  }
});

const containerClass = computed(() => ({
  "layout-theme-light": !layoutConfig.darkTheme.value,
  "layout-theme-dark": layoutConfig.darkTheme.value,
  "layout-overlay": layoutConfig.menuMode.value === "overlay",
  "layout-static": layoutConfig.menuMode.value === "static",
  "layout-static-inactive": layoutState.staticMenuDesktopInactive.value && layoutConfig.menuMode.value === "static",
  "layout-overlay-active": layoutState.overlayMenuActive.value,
  "layout-mobile-active": layoutState.staticMenuMobileActive.value,
  "p-ripple-disabled": layoutConfig.ripple.value === false,
}));

const bindOutsideClickListener = () => {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event) => {
      if (isOutsideClicked(event)) {
        layoutState.overlayMenuActive.value = false;
        layoutState.staticMenuMobileActive.value = false;
        layoutState.menuHoverActive.value = false;
      }
    };
    document.addEventListener("click", outsideClickListener.value);
  }
};

const unbindOutsideClickListener = () => {
  if (outsideClickListener.value) {
    document.removeEventListener("click", outsideClickListener.value);
    outsideClickListener.value = null;
  }
};

const isOutsideClicked = (event: any) => {
  const sidebarEl = document.querySelector(".layout-sidebar");
  const topbarEl = document.querySelector(".layout-menu-button");

  return !(
    sidebarEl?.isSameNode(event.target) ||
    sidebarEl?.contains(event.target) ||
    topbarEl?.isSameNode(event.target) ||
    topbarEl?.contains(event.target)
  );
};

onMounted(() => {
  if (isSidebarActive.value) {
    bindOutsideClickListener();
  }
});

onBeforeUnmount(() => {
  unbindOutsideClickListener();
});
</script>

<template>
  <div :class="containerClass" class="layout-wrapper">
    <NavigationTopbar />
    <div class="layout-sidebar">
      <NavigationSidebar />
    </div>
    <div class="layout-main-container">
      <div class="layout-main">
        <slot />
      </div>
    </div>
    <div class="layout-mask"></div>
    <Toast />
  </div>
</template>
