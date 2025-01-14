const layoutConfig = reactive({
  ripple: true,
  darkTheme: true,
  inputStyle: 'outlined',
  menuMode: 'static',
  theme: 'aura-light-green',
  scale: 14,
  activeMenuItem: null
});

const layoutState = reactive({
  staticMenuDesktopInactive: false,
  overlayMenuActive: false,
  profileSidebarVisible: false,
  configSidebarVisible: false,
  staticMenuMobileActive: false,
  menuHoverActive: false
});

export function useLayout() {
  const setScale = (scale: number) => {
    layoutConfig.scale = scale;
  };

  const setActiveMenuItem = (item: any) => {
    layoutConfig.activeMenuItem = item.value || item;
  };

  const onMenuToggle = () => {
    if (layoutConfig.menuMode === 'overlay') {
      layoutState.overlayMenuActive = !layoutState.overlayMenuActive;
    }

    if (window.innerWidth > 1250) {
      layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive;
    } else {
      layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive;
    }
  };

  const isSidebarActive = computed(() => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive);

  const isDarkTheme = computed(() => layoutConfig.darkTheme);

  return { layoutConfig: toRefs(layoutConfig), layoutState: toRefs(layoutState), setScale, onMenuToggle, isSidebarActive, isDarkTheme, setActiveMenuItem };
}
