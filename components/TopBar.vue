<template>
  <SfTopBar>
    <template #left>
        <SfButton data-cy="top-bar-btn_faq" class="sf-button--text">Help & FAQs</SfButton>
      </template>
    <template #center>
        <p>Download our application.</p>
        <SfButton data-cy="top-bar-btn_more" class="topbar__button sf-button--text">Find out more</SfButton>
      </template>
      <template #right>
        <LocaleSelector />
    </template>
  </SfTopBar>
</template>

<script>
import { SfButton, SfTopBar } from '@storefront-ui/vue';
import uiState from '~/assets/ui-state';
import { useUser, userGetters } from '~/composables';
import LocaleSelector from './LocaleSelector';

const { toggleLoginModal } = uiState;

export default {
  components: { SfTopBar,
    SfButton,
    LocaleSelector },
  setup() {
    const { isAuthenticated, logout, user } = useUser();

    return {
      toggleLoginModal,
      isAuthenticated,
      logout,
      user,
      userGetters
    };
  }
};

</script>
<style lang="scss" scoped>
.topbar {
  &__button {
    margin: 0 0 0 var(--spacer-xs);
  }
}
</style>
