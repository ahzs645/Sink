<script setup lang="ts">
import { DEFAULT_URL_MAX_LENGTH } from '#shared/schemas/link'
import { Loader, Save } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const { t } = useI18n()
const isSaving = ref(false)
const urlMaxLength = ref(DEFAULT_URL_MAX_LENGTH)

const { data } = await useAsyncData('settings', () => useAPI<{ urlMaxLength: number }>('/api/settings'))
if (data.value) {
  urlMaxLength.value = data.value.urlMaxLength
}

async function handleSave() {
  isSaving.value = true
  try {
    await useAPI('/api/settings/url-max-length', {
      method: 'PUT',
      body: { urlMaxLength: urlMaxLength.value },
    })
    toast.success(t('settings.url_max_length.save_success'))
  }
  catch (error) {
    toast.error(t('settings.url_max_length.save_failed'), {
      description: error instanceof Error ? error.message : String(error),
    })
  }
  finally {
    isSaving.value = false
  }
}
</script>

<template>
  <Card class="h-fit">
    <CardHeader>
      <CardTitle>{{ $t('settings.url_max_length.title') }}</CardTitle>
      <CardDescription>{{ $t('settings.url_max_length.description') }}</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="flex items-end gap-3">
        <div class="grid w-full max-w-sm gap-1.5">
          <Label for="url-max-length">
            {{ $t('settings.url_max_length.label') }}
          </Label>
          <Input
            id="url-max-length"
            v-model.number="urlMaxLength"
            type="number"
            :min="1"
            :max="100000"
            :placeholder="String(DEFAULT_URL_MAX_LENGTH)"
          />
        </div>
        <Button :disabled="isSaving" @click="handleSave">
          <Loader v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" />
          <Save v-else class="mr-2 h-4 w-4" />
          {{ $t('common.save') }}
        </Button>
      </div>
      <p class="mt-2 text-sm text-muted-foreground">
        {{ $t('settings.url_max_length.hint', { default: DEFAULT_URL_MAX_LENGTH }) }}
      </p>
    </CardContent>
  </Card>
</template>
